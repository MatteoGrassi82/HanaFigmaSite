import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

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

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
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
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "Could not send your message." });
    }

    return res.status(200).json({ ok: true });
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
