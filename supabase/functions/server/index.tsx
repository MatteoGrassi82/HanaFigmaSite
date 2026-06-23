import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 calls per hour per IP
const MAX_REQUESTS_PER_EMAIL = 3; // Max 3 calls per hour per email

// Email blacklist - block specific spam emails permanently
const EMAIL_BLACKLIST = new Set([
  "madjidlotfi183@gmail.com",
  // Add more spam emails here as needed
]);

// Helper function to check and enforce rate limits using KV store
async function checkRateLimit(ip: string, email?: string): Promise<{ allowed: boolean; remaining: number; limitType?: string }> {
  const now = Date.now();

  try {
    // Check IP-based rate limit
    const ipRateLimitKey = `ratelimit:ip:${ip}`;
    const ipStored = await kv.get(ipRateLimitKey);
    const ipTimestamps: number[] = ipStored ? JSON.parse(ipStored) : [];
    const validIpTimestamps = ipTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    if (validIpTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      await kv.set(ipRateLimitKey, JSON.stringify(validIpTimestamps));
      return { allowed: false, remaining: 0, limitType: 'IP' };
    }

    let validEmailTimestamps: number[] = [];

    // Check email-based rate limit if email provided
    if (email && email.trim()) {
      const emailNormalized = email.toLowerCase().trim();
      const emailRateLimitKey = `ratelimit:email:${emailNormalized}`;
      const emailStored = await kv.get(emailRateLimitKey);
      const emailTimestamps: number[] = emailStored ? JSON.parse(emailStored) : [];
      validEmailTimestamps = emailTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

      if (validEmailTimestamps.length >= MAX_REQUESTS_PER_EMAIL) {
        await kv.set(emailRateLimitKey, JSON.stringify(validEmailTimestamps));
        return { allowed: false, remaining: 0, limitType: 'email' };
      }

      // Update email rate limit
      validEmailTimestamps.push(now);
      await kv.set(emailRateLimitKey, JSON.stringify(validEmailTimestamps));
    }

    // Update IP rate limit
    validIpTimestamps.push(now);
    await kv.set(ipRateLimitKey, JSON.stringify(validIpTimestamps));

    const ipRemaining = MAX_REQUESTS_PER_WINDOW - validIpTimestamps.length;
    const emailRemaining = email && email.trim()
      ? MAX_REQUESTS_PER_EMAIL - validEmailTimestamps.length
      : MAX_REQUESTS_PER_WINDOW;

    return {
      allowed: true,
      remaining: Math.min(ipRemaining, emailRemaining)
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request to prevent blocking legitimate users
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
  }
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-77ada9a1/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug IP detection
app.get("/make-server-77ada9a1/debug-ip", async (c) => {
  const ip = c.req.header("x-forwarded-for")?.split(",")[0] ||
             c.req.header("x-real-ip") ||
             "unknown";

  const rateLimitKey = `ratelimit:${ip}`;
  const stored = await kv.get(rateLimitKey);
  const timestamps: number[] = stored ? JSON.parse(stored) : [];

  return c.json({
    detectedIp: ip,
    headers: {
      "x-forwarded-for": c.req.header("x-forwarded-for"),
      "x-real-ip": c.req.header("x-real-ip"),
      "cf-connecting-ip": c.req.header("cf-connecting-ip")
    },
    rateLimitStatus: {
      currentCount: timestamps.length,
      timestamps: timestamps,
      allowed: timestamps.length < MAX_REQUESTS_PER_WINDOW
    }
  });
});

// View recent leads endpoint (for debugging)
app.get("/make-server-77ada9a1/recent-leads", async (c) => {
  try {
    const leads = await kv.getByPrefix("lead:");
    // Sort by timestamp (newest first)
    const sortedLeads = leads
      .map(lead => typeof lead === 'string' ? JSON.parse(lead) : lead)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20); // Show last 20 leads

    return c.json({
      total: sortedLeads.length,
      leads: sortedLeads
    });
  } catch (error) {
    console.error("Error fetching recent leads:", error);
    return c.json({ error: `Failed to fetch leads: ${error}` }, 500);
  }
});

// Check specific email rate limit
app.get("/make-server-77ada9a1/check-email-limit/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const emailNormalized = email.toLowerCase().trim();
    const rateLimitKey = `ratelimit:email:${emailNormalized}`;

    const stored = await kv.get(rateLimitKey);
    const timestamps = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const validTimestamps = timestamps.filter((ts: number) => now - ts < RATE_LIMIT_WINDOW_MS);

    return c.json({
      email: emailNormalized,
      key: rateLimitKey,
      totalRequests: timestamps.length,
      validRequests: validTimestamps.length,
      maxAllowed: MAX_REQUESTS_PER_EMAIL,
      isBlocked: validTimestamps.length >= MAX_REQUESTS_PER_EMAIL,
      timestamps: validTimestamps.map((ts: number) => new Date(ts).toISOString())
    });
  } catch (error) {
    console.error("Error checking email limit:", error);
    return c.json({ error: `Failed to check email limit: ${error}` }, 500);
  }
});

// Test lead endpoint — visit in browser to fire a test lead to Supabase + Zapier
app.get("/make-server-77ada9a1/test-lead", async (c) => {
  try {
    const timestamp = Date.now();
    const key = `lead:${timestamp}:+15551234567`;
    const leadData = {
      name: "Test User",
      phone: "+15551234567",
      email: "test@hana-voice.ai",
      region: "US",
      agent: "Intake",
      timestamp: new Date().toISOString()
    };

    await kv.set(key, JSON.stringify(leadData));
    console.log(`Test lead saved: ${key}`);

    let zapierStatus = "skipped — ZAPIER_WEBHOOK_URL not configured";
    const zapierWebhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierWebhookUrl) {
      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...leadData,
            lead_key: key,
            source: "hana-voice-ai-demo"
          })
        });
        zapierStatus = zapierResponse.ok
          ? `success (${zapierResponse.status})`
          : `failed (${zapierResponse.status}: ${await zapierResponse.text()})`;
      } catch (zapierError) {
        zapierStatus = `error: ${zapierError}`;
      }
    }

    return c.json({
      success: true,
      message: "Test lead created",
      lead_key: key,
      lead: leadData,
      zapier: zapierStatus
    });
  } catch (error) {
    console.error("Error creating test lead:", error);
    return c.json({ error: `Failed to create test lead: ${error}` }, 500);
  }
});

// Save lead endpoint
app.post("/make-server-77ada9a1/leads", async (c) => {
  try {
    // Get client IP address
    const ip = c.req.header("x-forwarded-for")?.split(",")[0] ||
               c.req.header("x-real-ip") ||
               "unknown";

    const body = await c.req.json();
    const { name, phone, email, region, agent, page, workflow, honeypot } = body;

    // Honeypot check - reject if filled
    if (honeypot) {
      console.warn(`Bot detected via honeypot field from IP: ${ip}`);
      return c.json({ error: "Invalid request" }, 400);
    }

    // Email blacklist check - block permanently banned emails
    if (email && EMAIL_BLACKLIST.has(email.toLowerCase().trim())) {
      console.warn(`Blacklisted email blocked: ${email} from IP: ${ip}`);
      return c.json({ error: "Invalid request" }, 403);
    }

    if (!phone && !email) {
      return c.json({ error: "Phone number or email is required" }, 400);
    }

    // Check rate limit with both IP and email
    const rateLimit = await checkRateLimit(ip, email);
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for ${rateLimit.limitType}: ${rateLimit.limitType === 'email' ? email : ip}`);
      return c.json({
        error: rateLimit.limitType === 'email'
          ? "You've already requested multiple calls. Please try again later."
          : "Too many requests. Please try again later.",
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60)
      }, 429);
    }

    console.log(`Lead request from IP: ${ip}, email: ${email} (${rateLimit.remaining} remaining)`);

    const timestamp = Date.now();
    const identifier = phone || email?.toLowerCase().replace(/[^a-z0-9]/g, "") || `anon-${timestamp}`;
    const key = `lead:${timestamp}:${identifier}`;
    const leadData = {
      name: name || null,
      phone: phone || null,
      email: email || null,
      region: region || null,
      agent: agent || null,
      workflow: workflow || null,
      page: page || "live-demo",
      timestamp: new Date().toISOString()
    };

    await kv.set(key, JSON.stringify(leadData));
    console.log(`Lead saved: ${key}`);

    // Push lead to Zapier webhook → routes to email notification + Attio CRM
    const zapierWebhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (zapierWebhookUrl) {
      try {
        const zapierPayload = {
          // Core lead fields
          ...leadData,
          lead_key: key,
          source: "hana-voice-ai-demo",

          // Attio-friendly structured contact fields
          contact: {
            name: name || null,
            phone_number: phone,
            email: email || null,
          },

          // Attio-friendly deal / note context
          demo_details: {
            agent_type: agent || null,
            workflow: workflow || null,
            region: region || null,
            page: page || "live-demo",
            requested_at: new Date().toISOString(),
          },

          // Flat fields for simple Zapier mapping
          contact_name: name || "Unknown",
          contact_phone: phone,
          contact_email: email || "",
          demo_agent: agent || "Unknown",
          demo_workflow: workflow || "",
          demo_region: region || "US",
          demo_page: page || "live-demo",
        };

        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(zapierPayload)
        });
        if (!zapierResponse.ok) {
          console.log(`Zapier webhook returned status ${zapierResponse.status}: ${await zapierResponse.text()}`);
        } else {
          console.log(`Zapier webhook triggered successfully for lead: ${key}`);
        }
      } catch (zapierError) {
        console.log(`Zapier webhook failed for lead ${key}: ${zapierError}`);
      }
    } else {
      console.log("ZAPIER_WEBHOOK_URL not configured — skipping webhook push");
    }

    return c.json({ success: true, message: "Lead captured successfully" });
  } catch (error) {
    console.error("Error saving lead:", error);
    return c.json({ error: `Failed to save lead: ${error}` }, 500);
  }
});

// Guide download — capture email and push to Zapier
app.post("/make-server-77ada9a1/guide-download", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return c.json({ error: "A valid email address is required" }, 400);
    }

    const timestamp = Date.now();
    const key = `guide-download:${timestamp}:${email}`;
    const downloadData = {
      email,
      guide: "Clinical Voice AI Guide",
      timestamp: new Date().toISOString(),
    };

    await kv.set(key, JSON.stringify(downloadData));
    console.log(`Guide download saved: ${key}`);

    let zapierStatus = "skipped — ZAPIER_WEBHOOK_URL not configured";
    const zapierWebhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    console.log(`ZAPIER_WEBHOOK_URL present: ${!!zapierWebhookUrl}`);

    if (zapierWebhookUrl) {
      try {
        const zapierPayload = {
          email,
          contact_email: email,
          guide: "Clinical Voice AI Guide",
          source: "guide-download",
          timestamp: new Date().toISOString(),
        };
        console.log(`Sending to Zapier: ${JSON.stringify(zapierPayload)}`);
        console.log(`Zapier URL: ${zapierWebhookUrl.substring(0, 50)}...`);

        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(zapierPayload),
        });

        const zapierResponseText = await zapierResponse.text();
        zapierStatus = zapierResponse.ok
          ? `success (${zapierResponse.status}): ${zapierResponseText}`
          : `failed (${zapierResponse.status}): ${zapierResponseText}`;
        console.log(`Zapier response for guide download: ${zapierStatus}`);
      } catch (zapierError) {
        zapierStatus = `error: ${zapierError}`;
        console.log(`Zapier webhook failed for guide download ${email}: ${zapierError}`);
      }
    } else {
      console.log("ZAPIER_WEBHOOK_URL not configured — skipping webhook push for guide download");
    }

    return c.json({ success: true, message: "Guide download request captured", zapier: zapierStatus });
  } catch (error) {
    console.error("Error processing guide download:", error);
    return c.json({ error: `Failed to process guide download: ${error}` }, 500);
  }
});

// Test guide download — visit in browser to verify Zapier fires
app.get("/make-server-77ada9a1/test-guide-download", async (c) => {
  try {
    const testEmail = "test-guide@hana-voice.ai";
    const webhookUrl = Deno.env.get("ZAPIER_WEBHOOK_URL");
    if (!webhookUrl) {
      return c.json({ success: false, error: "ZAPIER_WEBHOOK_URL not configured" }, 503);
    }

    const zapierPayload = {
      email: testEmail,
      contact_email: testEmail,
      guide: "Clinical Voice AI Guide",
      source: "guide-download-test",
      timestamp: new Date().toISOString(),
    };

    console.log(`Sending test payload to Zapier: ${JSON.stringify(zapierPayload)}`);

    const zapierResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zapierPayload),
    });

    const responseText = await zapierResponse.text();
    console.log(`Zapier test response: ${zapierResponse.status} - ${responseText}`);

    return c.json({
      success: zapierResponse.ok,
      zapier_status: zapierResponse.status,
      zapier_response: responseText,
      payload_sent: zapierPayload,
    });
  } catch (error) {
    console.log(`Test guide download error: ${error}`);
    return c.json({ error: `Test failed: ${error}` }, 500);
  }
});

// ElevenLabs outbound call via Twilio
app.post("/make-server-77ada9a1/outbound-call", async (c) => {
  try {
    // Get client IP address
    const ip = c.req.header("x-forwarded-for")?.split(",")[0] ||
               c.req.header("x-real-ip") ||
               "unknown";

    const body = await c.req.json();
    const { agent_id, agent_phone_number_id, to_number, customer_name, email } = body;

    // Email blacklist check for outbound calls
    if (email && EMAIL_BLACKLIST.has(email.toLowerCase().trim())) {
      console.warn(`Blacklisted email blocked from calling: ${email} from IP: ${ip}`);
      return c.json({ error: "Unable to process request" }, 403);
    }

    // Check rate limit for outbound calls (with email if provided)
    const rateLimit = await checkRateLimit(ip, email);
    if (!rateLimit.allowed) {
      console.warn(`Outbound call rate limit exceeded for ${rateLimit.limitType}: ${rateLimit.limitType === 'email' ? email : ip}`);
      return c.json({
        error: rateLimit.limitType === 'email'
          ? "You've already requested multiple calls. Please try again later."
          : "Too many call requests. Please try again later.",
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60)
      }, 429);
    }

    if (!agent_id || !agent_phone_number_id || !to_number) {
      return c.json({ error: "agent_id, agent_phone_number_id, and to_number are required" }, 400);
    }

    console.log(`Outbound call request from IP: ${ip} (${rateLimit.remaining} remaining)`);

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      console.log("ELEVENLABS_API_KEY not configured");
      return c.json({ error: "ElevenLabs API key not configured on server" }, 500);
    }

    console.log(`Initiating ElevenLabs outbound call:`);
    console.log(`  - agent_id: ${agent_id}`);
    console.log(`  - agent_phone_number_id: ${agent_phone_number_id}`);
    console.log(`  - to_number: ${to_number}`);
    console.log(`  - customer_name: ${customer_name || 'not provided'}`);

    const payload: Record<string, unknown> = {
      agent_id,
      agent_phone_number_id,
      to_number,
    };

    // Optionally pass dynamic variables (e.g. customer name) to the agent
    if (customer_name) {
      payload.conversation_initiation_client_data = {
        dynamic_variables: {
          customer_name: customer_name,
        },
      };
    }

    console.log(`Payload being sent to ElevenLabs: ${JSON.stringify(payload)}`);

    const response = await fetch("https://api.elevenlabs.io/v1/convai/twilio/outbound-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`ElevenLabs outbound call error (${response.status}): ${JSON.stringify(data)}`);
      return c.json({
        error: data.detail?.message || data.message || "Failed to initiate outbound call",
        details: data,
        status: response.status,
      }, response.status);
    }

    console.log(`ElevenLabs outbound call success: conversation_id=${data.conversation_id}, callSid=${data.callSid}`);
    return c.json(data);
  } catch (error) {
    console.error("Outbound call error:", error);
    return c.json({ error: `Failed to initiate outbound call: ${error}` }, 500);
  }
});

// Get ElevenLabs conversation token for WebRTC
app.post("/make-server-77ada9a1/elevenlabs-token", async (c) => {
  try {
    const body = await c.req.json();
    const { agent_id } = body;

    if (!agent_id) {
      return c.json({ error: "agent_id is required" }, 400);
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return c.json({ error: "ElevenLabs API key not configured on server" }, 500);
    }

    console.log(`Getting conversation token for agent: ${agent_id}`);

    // Get conversation token from ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agent_id}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`ElevenLabs token error (${response.status}): ${JSON.stringify(data)}`);
      return c.json({
        error: data.detail?.message || data.message || "Failed to get conversation token",
        details: data,
      }, response.status);
    }

    console.log(`Successfully obtained token for agent: ${agent_id}`);
    return c.json({ token: data.token });
  } catch (error) {
    console.error("Conversation token error:", error);
    return c.json({ error: `Failed to get conversation token: ${error}` }, 500);
  }
});

// Check ElevenLabs conversation status
app.get("/make-server-77ada9a1/call-status/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    if (!conversationId) {
      return c.json({ error: "conversation_id is required" }, 400);
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return c.json({ error: "ElevenLabs API key not configured on server" }, 500);
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`ElevenLabs conversation status error (${response.status}): ${JSON.stringify(data)}`);
      return c.json({
        error: data.detail?.message || data.message || "Failed to get call status",
        details: data,
      }, response.status);
    }

    // Return relevant status fields
    return c.json({
      conversation_id: data.conversation_id,
      status: data.status, // e.g. "in-progress", "done", "failed"
      end_reason: data.analysis?.call_ended_reason || data.end_reason || null,
      duration: data.call_duration_secs || null,
    });
  } catch (error) {
    console.error("Call status error:", error);
    return c.json({ error: `Failed to get call status: ${error}` }, 500);
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  Live demo: SMS → reply picks an agent → that agent (Vapi) calls the prospect
//  Flow: site posts { to, region } → we text the 4 options → prospect replies a
//  keyword (e.g. "MONITORING") → Twilio inbound webhook maps it to a Vapi
//  assistant and places the outbound call from the region's number. State is kept
//  in the KV store as `sitedemo:<phone>` so the page can poll texted→called.
// ════════════════════════════════════════════════════════════════════════════

// Use-case → new Vapi assistant id (env-overridable so ids aren't pinned in code).
const SITE_AGENTS: Record<string, { label: string; assistantEnv: string; fallback: string }> = {
  monitoring:   { label: "Monitoring",   assistantEnv: "VAPI_SITE_ASSISTANT_MONITORING",   fallback: "f4ed7d07-ac37-4fbe-a2f1-2acca1e45607" },
  intake:       { label: "Intake",       assistantEnv: "VAPI_SITE_ASSISTANT_INTAKE",       fallback: "10171aae-e41e-47df-a11c-5730878c4253" },
  outreach:     { label: "Outreach",     assistantEnv: "VAPI_SITE_ASSISTANT_OUTREACH",     fallback: "5aeee0ef-6d66-4600-8911-c8ca7e6f1050" },
  coordination: { label: "Coordination", assistantEnv: "VAPI_SITE_ASSISTANT_COORDINATION", fallback: "4cebebf5-76df-4289-9034-ff34f7e3791c" },
};

// Italian assistant twins — same agents/flows/numbers, Italian speech (transcriber
// it, emergency line 118). Env-overridable; falls back to the ids from
// docs/italian-demo-agents-handoff.md. Picked when the demo was started with lang="it".
const SITE_AGENTS_IT: Record<string, { assistantEnv: string; fallback: string }> = {
  monitoring:   { assistantEnv: "VAPI_SITE_ASSISTANT_MONITORING_IT",   fallback: "d343531d-3db4-4637-9c13-741f962e7cdb" },
  intake:       { assistantEnv: "VAPI_SITE_ASSISTANT_INTAKE_IT",       fallback: "f0a0fd30-fc65-45f4-9b71-d6d4bc4595d5" },
  outreach:     { assistantEnv: "VAPI_SITE_ASSISTANT_OUTREACH_IT",     fallback: "5ba6cb14-9c06-4cda-a333-6bdda2bc54e3" },
  coordination: { assistantEnv: "VAPI_SITE_ASSISTANT_COORDINATION_IT", fallback: "c34a2840-d4da-4d47-991a-b23dc5562830" },
};

// Region → the Twilio from-number (SMS) + the Vapi phoneNumberId (caller-ID).
// US covers US/Canada; EU uses the UK number.
const SITE_REGIONS: Record<string, { fromEnv: string; fromFallback: string; vapiPhoneEnv: string; vapiPhoneFallback: string }> = {
  US: { fromEnv: "TWILIO_SITE_FROM_US", fromFallback: "+14632170155", vapiPhoneEnv: "VAPI_SITE_PHONE_US", vapiPhoneFallback: "3f412051-5b3b-485c-92fc-eef207d55409" },
  EU: { fromEnv: "TWILIO_SITE_FROM_UK", fromFallback: "+447897023174", vapiPhoneEnv: "VAPI_SITE_PHONE_UK", vapiPhoneFallback: "22c61779-ef10-4d09-9d41-0c71e4b6d81b" },
};

const E164 = /^\+[1-9]\d{7,14}$/;
const normalizeRegion = (r: unknown): "US" | "EU" => (String(r).toUpperCase() === "EU" ? "EU" : "US");
const normalizeLang = (l: unknown): "en" | "it" => (String(l).toLowerCase() === "it" ? "it" : "en");

// Map a free-text SMS reply to one agent key. Anchored so "no thanks" never matches,
// and tolerant of partial words ("coord", "monitor").
function replyToAgentKey(text: string): string | null {
  const t = (text || "").toLowerCase().trim();
  if (/^(no|nope|stop|unsubscribe|cancel|wrong)\b/.test(t)) return null;
  if (/\b(monitor|monitoring|check.?in)\b/.test(t)) return "monitoring";
  if (/\b(intake|onboard|new patient)\b/.test(t)) return "intake";
  if (/\b(outreach|reactivat|haven'?t|been a while)\b/.test(t)) return "outreach";
  if (/\b(coordinat|rebook|reschedul|no.?show|missed)\b/.test(t)) return "coordination";
  // bare number 1-4 as a fallback selection
  const n = t.match(/^[1-4]$/)?.[0];
  if (n) return (["monitoring", "intake", "outreach", "coordination"] as const)[Number(n) - 1];
  return null;
}

// Send an SMS via Twilio's REST API (no SDK; HTTP Basic with SID + auth token).
async function sendTwilioSms(to: string, from: string, body: string): Promise<string | null> {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  if (!sid || !token) throw new Error("Missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN");
  const form = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${sid}:${token}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(`Twilio send failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return json.sid ?? null;
}

// Verify an inbound Twilio webhook signature (X-Twilio-Signature): HMAC-SHA1 over
// url + every POST param sorted by key, base64, compared in constant time.
async function verifyTwilioSignature(url: string, params: Record<string, string>, signature: string | null): Promise<boolean> {
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  if (!token || !signature) return false;
  const data = Object.keys(params).sort().reduce((acc, k) => acc + k + params[k], url);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(token), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  // constant-time-ish compare
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

// Place a Vapi outbound call. Returns the call id (handles the batch result shape).
async function placeVapiCall(assistantId: string, phoneNumberId: string, to: string, vars: Record<string, string>): Promise<string | null> {
  const apiKey = Deno.env.get("VAPI_API_KEY");
  if (!apiKey) throw new Error("Missing VAPI_API_KEY");
  const res = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      assistantId,
      phoneNumberId,
      customer: { number: to },
      ...(Object.keys(vars).length ? { assistantOverrides: { variableValues: vars } } : {}),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Vapi call failed (${res.status}): ${JSON.stringify(data).slice(0, 200)}`);
  return data?.id ?? data?.results?.[0]?.id ?? null;
}

// POST: start the demo — text the prospect the 4 options, record a pending row.
app.post("/make-server-77ada9a1/site-demo-start", async (c) => {
  try {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0] || c.req.header("x-real-ip") || "unknown";
    const body = await c.req.json();
    const to = String(body.to || "").trim();
    const region = normalizeRegion(body.region);
    const lang = normalizeLang(body.lang);
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";

    if (!E164.test(to)) return c.json({ error: "Enter a valid phone number in international format, e.g. +15551234567" }, 400);

    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) return c.json({ error: "Too many requests. Please try again later.", retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60) }, 429);

    const reg = SITE_REGIONS[region];
    const from = Deno.env.get(reg.fromEnv) || reg.fromFallback;
    // Keyword options (MONITORING/INTAKE/OUTREACH/COORDINATION) stay constant so the
    // inbound matcher works in both languages; only the surrounding copy is localized.
    const opener = lang === "it"
      ? `Ciao${name ? ` ${name}` : ""}, sono Hana. Rispondi con l'agente che vuoi provare e ti chiamo:\n` +
        `• MONITORING — check-in settimanale\n• INTAKE — info pre-visita\n• OUTREACH — check-in "è passato un po'"\n• COORDINATION — riprenota una visita saltata`
      : `Hi${name ? ` ${name}` : ""}, it's Hana. Reply with the agent you want to experience and I'll call you:\n` +
        `• MONITORING — weekly check-in\n• INTAKE — pre-visit info\n• OUTREACH — "been a while" check-in\n• COORDINATION — rebook a missed visit`;

    try {
      await sendTwilioSms(to, from, opener);
    } catch (err) {
      console.error("[site-demo-start] sms failed:", err);
      return c.json({ error: "Could not send the text. Please double-check the number." }, 502);
    }

    await kv.set(`sitedemo:${to}`, { phone: to, region, lang, name: name || null, email: email || null, status: "texted", agent: null, call_id: null, updated_at: new Date().toISOString() });
    return c.json({ ok: true, status: "texted" });
  } catch (error) {
    console.error("site-demo-start error:", error);
    return c.json({ error: `Failed to start demo: ${error}` }, 500);
  }
});

// POST: Twilio inbound-SMS webhook — reply picks the agent, we place the call.
// Always returns 200 + empty TwiML so Twilio doesn't retry (the call is the reply).
app.post("/make-server-77ada9a1/site-demo-sms-inbound", async (c) => {
  const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
  const xml = (s: string) => c.body(s, 200, { "Content-Type": "text/xml" });
  try {
    const rawBody = await c.req.text();
    const params: Record<string, string> = {};
    for (const [k, v] of new URLSearchParams(rawBody)) params[k] = v;

    // The exact URL Twilio signed: prefer an explicit base, else reconstruct (no query).
    const base = (Deno.env.get("PUBLIC_FUNCTION_URL") || "").replace(/\/$/, "");
    const url = base
      ? `${base}/site-demo-sms-inbound`
      : `https://${c.req.header("host")}${new URL(c.req.url).pathname}`;

    if (!(await verifyTwilioSignature(url, params, c.req.header("x-twilio-signature") || null))) {
      console.warn("[site-demo-sms-inbound] bad Twilio signature");
      return c.text("Forbidden", 403);
    }

    const from = (params.From || "").trim();
    const agentKey = replyToAgentKey(params.Body || "");
    if (!from || !agentKey) return xml(EMPTY_TWIML); // not a recognizable choice

    const row = await kv.get(`sitedemo:${from}`);
    if (!row || (row.status !== "texted" && row.status !== "failed")) return xml(EMPTY_TWIML);

    const region = normalizeRegion(row.region);
    const lang = normalizeLang(row.lang);
    const reg = SITE_REGIONS[region];
    const agent = SITE_AGENTS[agentKey];
    // Italian demos dial the Italian assistant twin; English uses the default.
    const assistantId = lang === "it"
      ? (Deno.env.get(SITE_AGENTS_IT[agentKey].assistantEnv) || SITE_AGENTS_IT[agentKey].fallback)
      : (Deno.env.get(agent.assistantEnv) || agent.fallback);
    const phoneNumberId = Deno.env.get(reg.vapiPhoneEnv) || reg.vapiPhoneFallback;

    try {
      const callId = await placeVapiCall(assistantId, phoneNumberId, from, {
        customer_name: row.name || "there",
        // Forwarded so the dashboard saves the visitor's real contact details
        // (the webhook reads these back from the end-of-call report).
        caller_name: row.name || "",
        caller_email: row.email || "",
        caller_phone: from,
      });
      await kv.set(`sitedemo:${from}`, { ...row, status: "called", agent: agentKey, agent_label: agent.label, call_id: callId, updated_at: new Date().toISOString() });
    } catch (err) {
      console.error("[site-demo-sms-inbound] vapi call failed:", err);
      await kv.set(`sitedemo:${from}`, { ...row, status: "failed", agent: agentKey, updated_at: new Date().toISOString() });
    }
    return xml(EMPTY_TWIML);
  } catch (error) {
    console.error("site-demo-sms-inbound error:", error);
    return xml(EMPTY_TWIML); // never make Twilio retry
  }
});

// GET: status poll for the page (texted → called → failed).
app.get("/make-server-77ada9a1/site-demo-status/:phone", async (c) => {
  try {
    const phone = c.req.param("phone");
    const row = await kv.get(`sitedemo:${phone}`);
    if (!row) return c.json({ status: "none" });
    return c.json({ status: row.status, agent: row.agent_label || row.agent || null, updated_at: row.updated_at });
  } catch (error) {
    console.error("site-demo-status error:", error);
    return c.json({ status: "none" });
  }
});

Deno.serve(app.fetch);
