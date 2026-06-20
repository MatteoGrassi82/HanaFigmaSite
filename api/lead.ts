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

    // 1) Notify the team of the new lead.
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
