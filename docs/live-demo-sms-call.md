# Live demo: SMS → reply picks an agent → that agent calls you

The "Call My Phone" option in `LiveDemoSection` lets a prospect enter their number,
get a text listing four agents, reply with the one they want, and receive a real
phone call from that agent.

## Flow

1. Site → `POST /functions/v1/make-server-77ada9a1/site-demo-start` `{ to, region, name? }`
   - Texts the prospect the four options from the region's Twilio number.
   - Stores `sitedemo:<phone>` in the KV store with status `texted`.
2. Prospect replies (e.g. `MONITORING`) → Twilio hits
   `POST /functions/v1/make-server-77ada9a1/site-demo-sms-inbound`
   - Verifies the Twilio signature, maps the reply to one of the 4 agents,
     places a **Vapi** outbound call from the region's number, status → `called`.
3. Page polls `GET /functions/v1/make-server-77ada9a1/site-demo-status/:phone`
   until `called` (or `failed`) and shows "Calling you now…".

All of this lives in the existing Supabase edge function
`supabase/functions/server/index.tsx` (Deno + Hono + KV store).

## The 4 Vapi assistants

Provisioned from the ElevenLabs agents (same prompts + same ElevenLabs voice via
Vapi's 11labs provider). IDs are baked in as fallbacks and overridable by env:

| Use case | Vapi assistant id | env override |
|---|---|---|
| Monitoring   | `f4ed7d07-ac37-4fbe-a2f1-2acca1e45607` | `VAPI_SITE_ASSISTANT_MONITORING` |
| Intake       | `10171aae-e41e-47df-a11c-5730878c4253` | `VAPI_SITE_ASSISTANT_INTAKE` |
| Outreach     | `5aeee0ef-6d66-4600-8911-c8ca7e6f1050` | `VAPI_SITE_ASSISTANT_OUTREACH` |
| Coordination | `4cebebf5-76df-4289-9034-ff34f7e3791c` | `VAPI_SITE_ASSISTANT_COORDINATION` |

## Region → numbers

| Region | Twilio from-number (SMS) | env | Vapi phoneNumberId (caller-ID) | env |
|---|---|---|---|---|
| US (US/Canada) | `+14632170155` | `TWILIO_SITE_FROM_US` | `3f412051-5b3b-485c-92fc-eef207d55409` | `VAPI_SITE_PHONE_US` |
| EU (UK/Europe) | `+447897023174` | `TWILIO_SITE_FROM_UK` | `22c61779-ef10-4d09-9d41-0c71e4b6d81b` | `VAPI_SITE_PHONE_UK` |

> The two Twilio numbers must live in the Twilio account whose creds are set below,
> AND be imported into the Vapi workspace (they already are: "VC Hana" / "UK Hana").

## Required env (Supabase edge function secrets)

```
TWILIO_ACCOUNT_SID=…
TWILIO_AUTH_TOKEN=…
VAPI_API_KEY=…                 # Vapi private/server key
PUBLIC_FUNCTION_URL=https://dissgvupfcazdnhspdzv.supabase.co/functions/v1/make-server-77ada9a1
# optional overrides — defaults baked in:
TWILIO_SITE_FROM_US, TWILIO_SITE_FROM_UK
VAPI_SITE_PHONE_US, VAPI_SITE_PHONE_UK
VAPI_SITE_ASSISTANT_MONITORING / _INTAKE / _OUTREACH / _COORDINATION
```

`PUBLIC_FUNCTION_URL` is used to reconstruct the exact URL Twilio signed for the
inbound webhook — set it so signature verification is stable behind the proxy.

## Twilio configuration (one-time, per number)

For BOTH the US and UK numbers, set **Messaging → "A message comes in"** (HTTP POST) to:

```
https://dissgvupfcazdnhspdzv.supabase.co/functions/v1/make-server-77ada9a1/site-demo-sms-inbound
```

## Deploy

The edge function deploys via Figma Make's pipeline (or `supabase functions deploy
server` once the project is linked to ref `dissgvupfcazdnhspdzv`). It cannot be
deployed from a plain local shell without the Supabase CLI + link.

## Notes / limits

- Rate-limited per IP via the existing `checkRateLimit` (5/hr).
- Stateless-ish: one open row per phone (`sitedemo:<phone>`); re-texting overwrites it.
- The reply parser is anchored so "no thanks" never triggers a call; accepts
  keywords, partials ("coord", "monitor"), or a bare digit 1–4.
