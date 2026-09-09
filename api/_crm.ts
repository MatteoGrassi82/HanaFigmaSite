/**
 * Forwarding inbound leads to the CRM.
 *
 * Why this exists: until 2026-09-05 the live-demo form also POSTed each lead to
 * a Supabase edge function, and the CRM polled the KV store that wrote to. The
 * dead-code sweep in `ea9918d` removed that fetch — correctly, by every local
 * signal: the site had moved to Sanity and nothing else here touched Supabase.
 * It was the CRM's only source of website leads, and nobody found out for four
 * days, because the CRM's poller kept returning "0 new" over a frozen store.
 *
 * So the lead now travels the same way its notification email does, from the
 * same handler, in the same statement. The two sinks are deliberately coupled:
 * if someone deletes the CRM leg, they are editing the line that also sends the
 * email, and the diff says so.
 *
 * A file under `api/` whose name starts with `_` is not routed by Vercel, so
 * this is a shared module rather than an endpoint.
 */

export interface InboundLead {
  name?: string;
  email?: string;
  phone?: string;
  /** Which surface captured them — the CRM turns this into the signal line. */
  page?: string;
  /** Free text the visitor typed (contact form). */
  message?: string;
  /** Set when the site has already auto-replied with the Calendly link, so the
   *  CRM drafts a follow-up rather than a near-identical first touch. */
  auto_replied?: boolean;
}

export type LegResult =
  | { ok: true; detail?: string }
  | { ok: false; error: string };

/**
 * POST one lead to the CRM. Resolves to a result rather than throwing: a lead
 * must never be lost because the CRM was briefly unreachable, and the visitor
 * must never see an error from a step they did not ask for.
 */
export async function sendToCrm(lead: InboundLead): Promise<LegResult> {
  const url = process.env.CRM_LEAD_INGEST_URL;
  const secret = process.env.CRM_LEAD_INGEST_SECRET;

  if (!url || !secret) {
    // Loud, because this is the state the whole change exists to prevent: the
    // site happily emailing leads that reach no system of record.
    return {
      ok: false,
      error:
        "CRM_LEAD_INGEST_URL / CRM_LEAD_INGEST_SECRET are not set — the lead was emailed but NOT recorded in the CRM",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `CRM responded ${res.status}: ${text.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { status?: string };
    return { ok: true, detail: data.status };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `CRM request failed: ${reason}` };
  }
}

/**
 * Log the outcome of a lead's delivery legs. Anything that failed is printed
 * with the lead attached, so a dropped lead can be replayed from the logs
 * rather than reconstructed from memory.
 */
export function reportDelivery(
  where: string,
  lead: InboundLead,
  legs: Record<string, LegResult>,
): void {
  const failed = Object.entries(legs).filter(([, r]) => !r.ok);
  if (failed.length === 0) return;
  for (const [name, result] of failed) {
    console.error(
      `[${where}] ${name} leg failed: ${(result as { error: string }).error}`,
    );
  }
  console.error(
    `[${where}] lead needing replay: ${JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      page: lead.page,
    })}`,
  );
}

/** Unwrap a Promise.allSettled entry into a LegResult. */
export function settled(r: PromiseSettledResult<LegResult>): LegResult {
  if (r.status === "fulfilled") return r.value;
  return {
    ok: false,
    error: r.reason instanceof Error ? r.reason.message : String(r.reason),
  };
}
