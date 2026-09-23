import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Step two of the live demo: text the visitor the four-agent menu.
 *
 * The page cannot call the agent directly — /sms/start on the Pipecat app sends a
 * billed SMS to an arbitrary number and is gated by a shared secret that must never
 * ship in a browser bundle. So the page posts here, and this function (which holds
 * PIPECAT_WEBHOOK_SECRET_SITE) forwards to the agent. The agent composes the menu
 * from the sitedemo personas and sends it from the Telnyx line the reply comes back
 * to; that reply lands on the agent's own /sms and places the call. Nothing about the
 * call ever comes back here, which is why the page only promises "check your texts".
 *
 * Abuse: the agent enforces a ten-minute per-number cooldown, and only a reply from
 * the handset ever places a call — you cannot make HANA ring a number you don't hold.
 */
const AGENT_URL = process.env.PIPECAT_SITE_AGENT_URL || "https://hana-kat-clinic.fly.dev";
const E164 = /^\+[1-9]\d{7,14}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const secret = process.env.PIPECAT_WEBHOOK_SECRET_SITE;
  if (!secret) {
    // Say which var, so a 500 here is a config fix and not a debugging session.
    return res.status(500).json({ error: "Demo texting is not configured (PIPECAT_WEBHOOK_SECRET_SITE)." });
  }
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};
  const to = String((body as Record<string, unknown>).to ?? "").replace(/[\s().-]/g, "");
  const name = String((body as Record<string, unknown>).name ?? "").trim().slice(0, 40);
  const lang = String((body as Record<string, unknown>).lang ?? "en").toLowerCase().startsWith("it") ? "it" : "en";
  if (!E164.test(to)) {
    return res.status(400).json({ error: "Enter your number in international format, e.g. +1 555 123 4567." });
  }
  // Numbers the demo never serves and SMS-pumping fraud favours. UK 070 is personal
  // numbering and 076 is pagers, bar 07624 (Isle of Man mobiles): neither is a handset
  // a visitor holds. Twilio's log for 15-19 Sept 2026 shows the same name submitted
  // twice on +447010830006, undelivered (30005) and paid for regardless. This proxy
  // is the only thing between a public form and a billed text, and the agent's own
  // docstring says rate limits belong here; this is the first of them.
  if (/^\+447(?:0|6(?!24))/.test(to)) {
    return res.status(400).json({ error: "Please enter a mobile number." });
  }
  try {
    const r = await fetch(`${AGENT_URL.replace(/\/$/, "")}/sms/start`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: { "content-type": "application/json", "x-pipecat-secret": secret },
      body: JSON.stringify({ to, agent: "sitedemo", name, lang }),
    });
    const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    if (!r.ok) {
      console.error(`[demo-text] agent ${r.status}`, data);
      return res.status(502).json({
        error: r.status === 401
          ? "Demo texting is misconfigured (secret rejected by the agent)."
          : "We couldn't send the text. Please check the number and try again.",
      });
    }
    return res.status(200).json({ ok: true, status: data.status ?? "texted" });
  } catch (err) {
    console.error("[demo-text] failed:", err);
    return res.status(502).json({ error: "We couldn't send the text. Please try again." });
  }
}

function safeParse(s: string): unknown {
  try { return JSON.parse(s); } catch { return {}; }
}
