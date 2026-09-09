import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { sendToCrm, reportDelivery, settled, type LegResult } from "./_crm";

/**
 * Live-demo lead capture. Does two things with every lead, together:
 *   1. records it in the CRM (POST /api/inbound/site-lead) — the system of record
 *   2. emails the team via Resend — the alert
 *
 * Both legs run in one `Promise.allSettled` below. Keep them there. From
 * 2026-09-05 to 2026-09-09 this handler did only (2), because the write that
 * fed the CRM lived in a component and was removed as dead code; every lead in
 * that window exists solely as an email — and each of those people had already
 * been sent the Calendly auto-reply by this very handler. See api/_crm.ts.
 *
 * Env: RESEND_API_KEY, CONTACT_FROM_EMAIL (verified sender), CONTACT_TO_EMAIL
 * (defaults to matteo@usehana.com), CRM_LEAD_INGEST_URL, CRM_LEAD_INGEST_SECRET.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const body =
    typeof req.body === "string" ? safeParse(req.body) : req.body ?? {};
  const { name, email, phone, page } = body as Record<string, string>;

  if (!email && !phone) {
    return res.status(400).json({ error: "Nothing to capture." });
  }

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "HANA Website <noreply@usehana.com>";
  const toEmail = process.env.CONTACT_TO_EMAIL || "matteo@usehana.com";

  // The lead as the CRM will see it. `auto_replied` is true because this
  // handler sends the prospect the Calendly note below, so the CRM drafts the
  // NEXT touch instead of a second copy of the same email.
  const lead = {
    name: name ? String(name) : undefined,
    email: email ? String(email) : undefined,
    phone: phone ? String(phone) : undefined,
    page: page ? String(page) : undefined,
    auto_replied: true,
  };

  try {
    const resend = new Resend(apiKey);

    // 1) Record the lead and notify the team. Two sinks, one statement, on
    //    purpose: the CRM is the system of record and the email is only the
    //    alert, and losing either silently is the failure this shape prevents.
    const [notifyLeg, crmLeg] = await Promise.allSettled<LegResult>([
      resend.emails
        .send({
          from: fromEmail,
          to: [toEmail],
          replyTo: email ? String(email) : undefined,
          subject: `New live-demo lead${name ? ` — ${name}` : ""}`,
          text:
            `New lead from the live demo${page ? ` (${page})` : ""}:\n\n` +
            `Name:  ${name || "(not provided)"}\n` +
            `Email: ${email || "(not provided)"}\n` +
            `Phone: ${phone || "(not provided)"}\n`,
        })
        .then(({ error }) =>
          error
            ? ({ ok: false, error: String(error) } as LegResult)
            : ({ ok: true } as LegResult),
        ),
      sendToCrm(lead),
    ]);

    const notify = settled(notifyLeg);
    const crm = settled(crmLeg);
    reportDelivery("lead", lead, { notify, crm });

    // Only a failed notification is worth a non-2xx: the CRM leg failing still
    // leaves the lead in the inbox, and the visitor should not be blocked from
    // their demo by our bookkeeping.
    if (!notify.ok) {
      return res.status(502).json({ error: "Could not send the lead notification." });
    }

    // 2) Send the prospect a warm follow-up with a Calendly link.
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      const firstName = String(name || "").trim().split(/\s+/)[0];
      const greeting = firstName ? `Hey ${firstName},` : "Hey,";
      const calendly = "https://calendly.com/matteowastaken/30min";
      try {
        await resend.emails.send({
          from: fromEmail,
          to: [String(email)],
          replyTo: toEmail,
          subject: "Thanks for trying the Hana demo 👋",
          text:
            `${greeting} noticed you tried our demo at Hana!\n\n` +
            `Need any help? Happy to assist with any doubt :)\n\n` +
            `Feel free to book a time that works best for you via my calendar: ${calendly}\n\n` +
            `Looking forward to connecting, happy to coordinate around your schedule!`,
          html:
            `<div style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;line-height:1.7;color:#1e2a3a;">` +
            `<p>${greeting} noticed you tried our demo at Hana!</p>` +
            `<p>Need any help? Happy to assist with any doubt :)</p>` +
            `<p>Feel free to book a time that works best for you via my calendar: ` +
            `<a href="${calendly}" style="color:#5b76d9;">${calendly}</a></p>` +
            `<p>Looking forward to connecting, happy to coordinate around your schedule!</p>` +
            `</div>`,
        });
      } catch (replyErr) {
        // Don't fail the request if the auto-reply doesn't go through.
        console.error("Auto-reply to prospect failed:", replyErr);
      }
    }

    // `recorded` tells a caller (and anyone reading the network tab) whether
    // the lead actually reached the CRM, rather than implying it from a 200.
    return res.status(200).json({ ok: true, recorded: crm.ok });
  } catch (err) {
    console.error("Lead handler error:", err);
    return res.status(500).json({ error: "Unexpected error." });
  }
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
