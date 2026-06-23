# Italian demo agents — handoff for the site maker

We now have **Italian versions** of the 4 website demo voice agents (Monitoring,
Intake, Outreach, Coordination). They are exact mirrors of the English ones —
same Hana voice, same flows — just speaking Italian, with the transcriber set to
Italian and the emergency line set to 118.

**They use the SAME phone numbers and the SAME dashboard webhook as the English
agents.** The only thing that differs is the Vapi `assistantId`.

## The assistant IDs

| Agent | English (current) | Italian (new) |
|---|---|---|
| Monitoring | `f4ed7d07-ac37-4fbe-a2f1-2acca1e45607` | `d343531d-3db4-4637-9c13-741f962e7cdb` |
| Intake | `10171aae-e41e-47df-a11c-5730878c4253` | `f0a0fd30-fc65-45f4-9b71-d6d4bc4595d5` |
| Outreach | `5aeee0ef-6d66-4600-8911-c8ca7e6f1050` | `5ba6cb14-9c06-4cda-a333-6bdda2bc54e3` |
| Coordination | `4cebebf5-76df-4289-9034-ff34f7e3791c` | `c34a2840-d4da-4d47-991a-b23dc5562830` |

## Where these IDs are used today

`supabase/functions/server/index.tsx`, the `SITE_AGENTS` map (~line 625). Each
agent's assistant ID is read from an env var, falling back to the hardcoded
English ID:

```ts
const SITE_AGENTS = {
  monitoring:   { ..., assistantEnv: "VAPI_SITE_ASSISTANT_MONITORING",   fallback: "f4ed7d07-..." },
  intake:       { ..., assistantEnv: "VAPI_SITE_ASSISTANT_INTAKE",       fallback: "10171aae-..." },
  outreach:     { ..., assistantEnv: "VAPI_SITE_ASSISTANT_OUTREACH",     fallback: "5aeee0ef-..." },
  coordination: { ..., assistantEnv: "VAPI_SITE_ASSISTANT_COORDINATION", fallback: "4cebebf5-..." },
};
```

The chosen ID is passed to `placeVapiCall()` in the `site-demo-sms-inbound`
handler (~line 777).

---

## Option A — Italian REPLACES English (no code change)

If the demo should just be in Italian for everyone, **set these 4 environment
variables** on the Supabase Edge Function and redeploy. No code edit needed.

```
VAPI_SITE_ASSISTANT_MONITORING   = d343531d-3db4-4637-9c13-741f962e7cdb
VAPI_SITE_ASSISTANT_INTAKE       = f0a0fd30-fc65-45f4-9b71-d6d4bc4595d5
VAPI_SITE_ASSISTANT_OUTREACH     = 5ba6cb14-9c06-4cda-a333-6bdda2bc54e3
VAPI_SITE_ASSISTANT_COORDINATION = c34a2840-d4da-4d47-991a-b23dc5562830
```

Done — the demo is now Italian, same numbers, same dashboard.

---

## Option B — Keep BOTH, add an EN/IT switch (small code change)

If the site should offer English **and** Italian, add a `lang` to the flow.

### 1. Add an Italian ID set next to `SITE_AGENTS`

```ts
// Italian twins — same agents, Italian speech.
const SITE_AGENTS_IT: Record<string, string> = {
  monitoring:   "d343531d-3db4-4637-9c13-741f962e7cdb",
  intake:       "f0a0fd30-fc65-45f4-9b71-d6d4bc4595d5",
  outreach:     "5ba6cb14-9c06-4cda-a333-6bdda2bc54e3",
  coordination: "c34a2840-d4da-4d47-991a-b23dc5562830",
};
```

### 2. Capture `lang` when the visitor starts the demo

In the `POST /make-server-77ada9a1/site-demo-start` handler (~line 711), read a
`lang` field from the body (`"it"` or `"en"`, default `"en"`) and persist it in
the KV row alongside `region`/`name`/`email`:

```ts
const lang = String((body as any).lang || "en").toLowerCase() === "it" ? "it" : "en";
await kv.set(`sitedemo:${to}`, { ..., lang, ... });
```

### 3. Pick the ID set when placing the call

In `site-demo-sms-inbound` (~line 777), where it currently does
`const assistantId = Deno.env.get(agent.assistantEnv) || agent.fallback;`,
branch on the stored `lang`:

```ts
const assistantId = row.lang === "it"
  ? SITE_AGENTS_IT[agentKey]
  : (Deno.env.get(agent.assistantEnv) || agent.fallback);
```

### 4. Frontend

Add an EN/IT toggle on the demo section and send the chosen `lang` in the
`site-demo-start` POST body. (Optional: also localize the SMS option text the
visitor receives — the keywords MONITORING/INTAKE/OUTREACH/COORDINATION can stay
the same; only the surrounding copy needs Italian.)

---

## Notes

- **Phone numbers:** unchanged. Italian agents dial from the same US/UK Vapi
  numbers (`VAPI_SITE_PHONE_US` / `VAPI_SITE_PHONE_UK`). "English number,
  Italian agent" is exactly the intended setup.
- **Dashboard:** unchanged. Italian calls report to the same `/site` webhook and
  appear in the same dashboard. (The dashboard's analysis fields are still in
  English; the caller's words are quoted verbatim in Italian. Localizing those
  fields is a separate, optional task.)
- **Heads-up — Irish/IE inbound SMS:** this demo flow is SMS-first (text the
  options, visitor replies a keyword). Irish-inbound SMS is unreliable at the
  carrier level, so for IE/UK numbers the keyword reply may not arrive. Not
  specific to Italian, but worth knowing when testing.
