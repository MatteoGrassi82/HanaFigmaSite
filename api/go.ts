import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * One row per view of /go.
 *
 * /go is the destination of a QR code printed on 247 physical letters. Each code
 * carries a unique `?r=` between 1 and 247, so a row here says which letter was
 * scanned, when, and on what. The page reads `r`, posts it, and never shows it.
 *
 * WHAT THE ROWS ARE FOR
 * Not analytics. The signal the campaign is actually built on is a visit with no
 * booking: a practice that read the letter, scanned the code, watched some of the
 * film and stopped. Those are the first calls the sales team should make, and
 * they only exist if this endpoint wrote them down. Joining `go_visits` to the
 * mail-merge list on `r` gives you that list by name.
 *
 * WHY THE TIMESTAMP AND USER-AGENT COME FROM HERE
 * They are request facts. Taking them from the request rather than from the page
 * means a clock skewed on someone's phone, or a spoofed body, cannot poison the
 * row, and it keeps the client beacon down to one small field.
 *
 * SINK
 * Supabase, table `go_visits`, over PostgREST. Env:
 *   SITE_SUPABASE_URL                 e.g. https://dissgvupfcazdnhspdzv.supabase.co
 *   SITE_SUPABASE_SERVICE_ROLE_KEY    service role; never the anon key, and never
 *                                     committed (this repo is public)
 * The table, once:
 *   create table public.go_visits (
 *     id          bigint generated always as identity primary key,
 *     r           smallint,
 *     seen_at     timestamptz not null default now(),
 *     user_agent  text,
 *     referrer    text,
 *     ip_country  text
 *   );
 *   create index on public.go_visits (r);
 *   alter table public.go_visits enable row level security;  -- service role only
 *
 * Until those two variables are set the endpoint still answers 204 and still
 * prints the row to the function log, prefixed GO_VISIT, so nothing is lost while
 * the table is being created. It is loud about being unconfigured for the same
 * reason api/_crm.ts is: a campaign that silently records nothing is the exact
 * failure this file exists to prevent.
 */

/** Letters are numbered 1 to 247. */
const LETTERS_PRINTED = 247;

/* Conservative bot match, same spirit as middleware.ts. QR apps, link unfurlers
 * and uptime checks all fetch this page; a row for one of those is not a
 * physician reading a letter, and a sales team working the list should not have
 * to guess which is which. Bot hits are counted in the log and not stored. */
const BOT_RE =
  /bot|crawl|spider|slurp|preview|monitor|pingdom|uptime|headlesschrome|lighthouse|facebookexternalhit|whatsapp|telegram|slackbot|discordbot|embedly|curl|wget|python-requests|okhttp/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};
  const { r: rawR, ref } = body as Record<string, unknown>;

  // An absent or malformed `r` is normal and still gets a row — someone typed the
  // URL, or a QR reader dropped the query. The row simply carries no letter.
  const n = typeof rawR === "number" ? rawR : Number(rawR);
  const r = Number.isInteger(n) && n >= 1 && n <= LETTERS_PRINTED ? n : null;

  const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);
  const referrer = typeof ref === "string" ? ref.slice(0, 500) : null;
  // Vercel sets this at the edge; useful only to sanity-check that the letters
  // landed where they were posted (FL/TX/GA/MS).
  const ipCountry = String(req.headers["x-vercel-ip-country"] || "") || null;

  const row = {
    r,
    seen_at: new Date().toISOString(),
    user_agent: userAgent,
    referrer,
    ip_country: ipCountry,
  };

  if (BOT_RE.test(userAgent)) {
    console.log(`GO_VISIT skipped (bot) ${JSON.stringify(row)}`);
    return res.status(204).end();
  }

  // The log line is the floor, not the record: it is what makes an unconfigured
  // or briefly-unreachable Supabase recoverable by replay rather than lost.
  console.log(`GO_VISIT ${JSON.stringify(row)}`);

  const url = process.env.SITE_SUPABASE_URL;
  const key = process.env.SITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "GO_VISIT NOT RECORDED — SITE_SUPABASE_URL / SITE_SUPABASE_SERVICE_ROLE_KEY are not set. " +
        "The visit exists only in this log line.",
    );
    return res.status(204).end();
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const resp = await fetch(`${url.replace(/\/$/, "")}/rest/v1/go_visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error(`GO_VISIT insert failed ${resp.status}: ${text.slice(0, 300)}`);
    }
  } catch (err) {
    console.error(
      `GO_VISIT insert failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 204 always. The visitor asked for a landing page, not for this, and nothing
  // that happens here should ever reach them or delay them.
  return res.status(204).end();
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
