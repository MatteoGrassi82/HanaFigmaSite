import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * Live-demo lead notification. Emails the lead via Resend (no Zapier).
 * Reuses the same env as api/contact.ts: RESEND_API_KEY, CONTACT_FROM_EMAIL
 * (verified usehana.com sender), and CONTACT_TO_EMAIL (defaults to matteo@usehana.com).
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

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email ? String(email) : undefined,
      subject: `New live-demo lead${name ? ` — ${name}` : ""}`,
      text:
        `New lead from the live demo${page ? ` (${page})` : ""}:\n\n` +
        `Name:  ${name || "(not provided)"}\n` +
        `Email: ${email || "(not provided)"}\n` +
        `Phone: ${phone || "(not provided)"}\n`,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "Could not send the lead notification." });
    }

    return res.status(200).json({ ok: true });
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
