import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { sendToCrm, reportDelivery, settled, type LegResult } from "./_crm";

/**
 * Contact-form handler. Receives a JSON POST from the Contact page and sends the
 * enquiry by email via Resend. Requires the RESEND_API_KEY environment variable.
 * Optional env: CONTACT_FROM_EMAIL (must be a verified Resend sender/domain),
 * CONTACT_TO_EMAIL (defaults to matteo@usehana.com).
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
  const { firstName, lastName, email, subject, message, honey } = body as Record<
    string,
    string
  >;

  // Honeypot: silently accept bots without sending anything.
  if (honey) return res.status(200).json({ ok: true });

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "HANA Website <noreply@hana.health>";
  const toEmail = process.env.CONTACT_TO_EMAIL || "matteo@usehana.com";

  // Someone who fills in the contact form is an inbound lead, so they belong
  // in the CRM too — not only in an inbox. No auto-reply goes out here, so the
  // CRM drafts a genuine first touch.
  const lead = {
    name: `${firstName} ${lastName}`.trim(),
    email: String(email),
    page: "contact",
    message: message ? String(message) : undefined,
    auto_replied: false,
  };

  try {
    const resend = new Resend(apiKey);

    // Record and notify together — see api/_crm.ts for why these stay coupled.
    const [notifyLeg, crmLeg] = await Promise.allSettled<LegResult>([
      resend.emails
        .send({
          from: fromEmail,
          to: [toEmail],
          replyTo: String(email),
          subject: `New website enquiry — ${firstName} ${lastName}${
            subject ? ` (${subject})` : ""
          }`,
          text:
            `Name: ${firstName} ${lastName}\n` +
            `Email: ${email}\n` +
            `Subject: ${subject || "(none)"}\n\n` +
            `Message:\n${message}\n`,
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
    reportDelivery("contact", lead, { notify, crm });

    // The visitor is told only about the leg they care about: their message.
    if (!notify.ok) {
      return res.status(502).json({ error: "Could not send your message." });
    }

    return res.status(200).json({ ok: true, recorded: crm.ok });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Unexpected error sending message." });
  }
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
