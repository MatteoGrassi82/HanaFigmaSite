I have the ground truth I need. The audit findings are thorough and I've verified the key stack facts (Vite 6, React 18.3, React Router 7.13, Sanity client 7.22 with project `7dkhf6fw`, `react-helmet-async` installed but unused, no SSG tooling, the thin `Post` interface that drops `_updatedAt`/`faq`/`tldr`/reviewer). Now I'll write the design document.

This is the deliverable, returned as my final message.

---

# Hana Health — Agentic AEO/SEO System: Design Document
**Version 1.0 · 2026-06-05 · Author: Principal Eng / AI Systems Architecture**

---

## 0. Executive summary

Hana's AEO problem is **two coupled problems**, and the agentic system must respect that coupling or it will optimize a corpse:

1. **Substrate problem (one-time, foundational):** the site is a client-only SPA. ~95% of routes (35/37 sitemap URLs, all 27 blog posts) ship an empty `<div id="root">` to the non-JS crawlers that power ChatGPT Search, Perplexity, Claude, and Copilot. No agent can win citations for content that crawlers literally cannot read. **The rendering fix (prerender → Astro) is a hard prerequisite for the generation loop to matter.**
2. **Continuous problem (the agentic system):** even with perfect rendering, AEO is a *moving target* — competitors publish, answer engines re-rank weekly, your `dateModified` decays, and "best voice AI for X" answers churn. This requires a **standing loop**, not a project: monitor citations → detect gaps → generate answer-shaped content → human-review → publish → re-measure.

The system I design is a **fleet of six scheduled agents** built on the **Claude Agent SDK** (same family that powers this very session), wired to **Sanity (content source of truth)**, the **Git repo (schema/llms.txt/sitemap as code)**, and a **human-in-the-loop review gate** (Sanity drafts + GitHub PRs). It treats *everything AEO-relevant as either content (Sanity) or code (repo)* so every agent action is reviewable, revertible, and version-controlled.

A crucial honesty constraint threaded throughout: **you cannot reliably, ToS-compliantly query the consumer chat products** (chatgpt.com, perplexity.ai web UI, gemini.google.com, claude.ai) via automation. The monitoring agent must use **official APIs with live-search/grounding** (Perplexity Sonar, OpenAI web-search tools, Gemini grounding, Anthropic web search) as *proxies* for the consumer surfaces, plus **server-log bot analytics** and **AI-referral analytics** as ground-truth signals. I flag every place this matters.

---

## 1. Where Hana's own product and Claude fit

Two assets make this cheaper and better than a generic build:

- **Claude (Anthropic API + Agent SDK)** is the reasoning core of every agent. The model id for the heavy reasoning agents (gap analysis, content generation, citation judging) should be a current Claude (e.g. Sonnet-class for the high-volume monitor/judge loops to control cost, Opus-class for the weekly strategy/gap synthesis). The Agent SDK gives you the loop, tool-use, subagents, and MCP plumbing for free — you are essentially building a domain-specialized version of the harness running this session.
- **Hana's own voice-AI platform** is not directly in the loop, but it is the *source of citable truth*: the "85% engagement / 2M+ interactions" numbers, clinical workflow knowledge, and (critically) **real, anonymized outcome data**. The single most defensible AEO moat for a healthtech vendor is **proprietary, methodology-backed statistics** — answer engines preferentially cite primary sources with numbers. A later-phase "Insights agent" can mine Hana's own (de-identified, aggregate, compliance-cleared) operational data into publishable benchmark pages. That is content no competitor can replicate.

---

## 2. System overview (the loop)

```
                          ┌─────────────────────────────────────────────────┐
                          │   ORCHESTRATOR (Claude Agent SDK, scheduled)     │
                          │   - owns cadence, budget, run ledger             │
                          │   - dispatches subagents, gates on human review  │
                          └───────────────┬─────────────────────────────────┘
                                          │
   ┌───────────────┬───────────────┬──────┴────────┬───────────────┬──────────────┐
   ▼               ▼               ▼               ▼               ▼              ▼
┌────────┐    ┌────────┐     ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌──────────┐
│ A1     │    │ A2     │     │ A3       │    │ A4       │    │ A5       │   │ A6       │
│Citation│    │Gap /   │     │Content   │    │Schema /  │    │Off-site/ │   │Freshness/│
│Monitor │    │Oppty   │     │Generator │    │Structured│    │Entity    │   │Tech-watch│
│(SoV)   │    │        │     │          │    │Data + LLM│    │          │   │          │
└───┬────┘    └───┬────┘     └────┬─────┘    └────┬─────┘    └────┬─────┘   └────┬─────┘
    │             │               │               │               │             │
    └──────┬──────┴───────┬───────┴───────┬───────┴───────┬───────┴──────┬──────┘
           ▼              ▼               ▼               ▼              ▼
    ┌──────────────────────────────────────────────────────────────────────────┐
    │  SHARED STATE  (Postgres / Supabase)                                       │
    │  - measurements (citations, SoV, referrals, bot hits)                      │
    │  - prompt_panel, competitors, query_universe                              │
    │  - gaps (open/triaged/in-progress/published/measured)                     │
    │  - run ledger + cost ledger + audit log                                   │
    └──────────────────────────────────────────────────────────────────────────┘
           │                                          │
           ▼ (content drafts)                         ▼ (code drafts)
    ┌──────────────────┐                      ┌──────────────────────────┐
    │ SANITY (drafts)  │                      │ GIT REPO (PR branch)     │
    │ posts/pages/FAQ  │                      │ schema, llms.txt,        │
    │ tldr/reviewer    │                      │ sitemap gen, JSON-LD     │
    └────────┬─────────┘                      └───────────┬──────────────┘
             ▼  HUMAN REVIEW GATE                          ▼  HUMAN REVIEW GATE
        Sanity editor approves                       GitHub PR review/merge
             │                                            │
             ▼                                            ▼
    ┌────────────────────────────────────────────────────────────────────────┐
    │ PUBLISH → Vercel build (prerender/Astro) → IndexNow ping → sitemap      │
    │           lastmod from _updatedAt → re-measure (A1 picks it up)         │
    └────────────────────────────────────────────────────────────────────────┘
```

**The loop, stated as a sentence:** A1 measures share-of-voice across a prompt panel → A2 turns "we lost this query / we're absent here" into a ranked gap backlog → A3 drafts the answer-first page/FAQ to fill it (Sanity draft) and A4 attaches/validates its schema (PR) → a human approves in Sanity + merges the PR → Vercel rebuilds with prerendered HTML and pings IndexNow → A1 re-measures the same prompts 2–6 weeks later to prove (or disprove) lift. A5 works the off-site half in parallel; A6 keeps the plumbing honest.

---

## 3. The six agents — concrete specs

Each spec gives: **purpose · trigger/cadence · inputs · tools (Agent SDK / MCP / HTTP) · core logic · outputs · the honest limits.**

### A1 — Citation-Monitoring Agent (Share-of-Voice tracker) — *the MVP centerpiece*

**Purpose.** Answer, weekly: *for each buyer question that matters, does an AI answer engine mention Hana, cite hana.health with a link, recommend Hana, or name a competitor instead — and in what framing?*

**Trigger/cadence.** Weekly full panel; daily mini-panel of ~10 highest-value prompts (branded + top category). Manual "run now" after any publish (re-measure that gap's prompts).

**Inputs.**
- `prompt_panel`: 40–60 queries across 5 intents — **branded** ("Hana Health reviews", "is Hana Health HIPAA compliant"), **category/recommendation** ("best voice AI for post-discharge follow-up", "AI patient engagement platforms"), **comparison** ("voice AI vs patient portals", "Hana vs [competitor]"), **problem/solution** ("how to reduce 30-day readmissions with AI", "automate ADHD intake"), **clinical/billing** ("how to bill APCM with AI touchpoints").
- `competitors`: named alternative vendors to detect co-mention.
- `engine targets` (see limits below).

**Tools (this is where the ToS honesty lives).**
| Surface | How A1 queries it | Status |
|---|---|---|
| **Perplexity** | **Sonar API** (`sonar`/`sonar-pro`) — returns answer + `search_results`/citations. The cleanest legitimate proxy for the Perplexity consumer experience. | ✅ supported, has citations |
| **ChatGPT Search** | **OpenAI Responses API with the `web_search` tool** — returns answer + URL citations. Proxy for ChatGPT-search behavior (not byte-identical to consumer, but the right grounding signal). | ✅ supported |
| **Google AI Overviews / Gemini** | **Gemini API with Google Search grounding** — returns grounded answer + `groundingMetadata` (the cited URIs). Proxy for AI Overviews. | ✅ supported |
| **Claude** | **Anthropic Messages API + `web_search` tool** — answer + cited sources. | ✅ supported |
| **Copilot / Bing** | No first-party answer API. Use **Bing Web Search API** ranking + the OpenAI/Bing-index proxy, OR a SERP-data vendor's "AI Overview/Copilot" capture product. | ⚠️ proxy only |
| **Consumer web UIs** (chatgpt.com, perplexity.ai, gemini.google.com, claude.ai) | **Do NOT scrape/automate.** Against ToS, brittle, bot-detected. | ❌ avoid |

> **Honest limit, stated plainly:** API web-search/grounding answers are a *faithful but not identical* proxy for what a human sees in the consumer app (different model snapshots, personalization, A/B). Treat A1's numbers as a **directional, internally-consistent index**, tracked over time, not as a literal screenshot of chatgpt.com. For ground truth on real consumer surfaces, supplement with (a) a **monthly manual spot-check** of ~10 prompts by a human, and (b) **server-log + GA4 referral data** (below), which *are* ground truth. Optionally license a dedicated GEO-tracking vendor (Profound, Peec, Otterly, Scrunch) whose entire business is doing this capture compliantly at scale; A1's schema is designed so a vendor feed can be ingested in place of, or alongside, the API calls.

**Core logic (per prompt × engine):**
1. Send prompt to the engine's grounded/search API.
2. Capture: full answer text, the list of cited URLs, position/order of citations.
3. **Claude as judge** (structured output) extracts:
   - `hana_mentioned` (bool), `hana_cited_with_link` (bool, hana.health in citations), `hana_recommended` (bool — named as a recommended option, not just mentioned), `sentiment/framing` (positive/neutral/negative + a one-line quote of how Hana is described), `competitors_mentioned` (list), `answer_summary`.
4. Write a `measurement` row (engine, prompt, intent, run_date, all flags, raw answer hash, citation list).

**Outputs.**
- **Share-of-Voice (SoV)** per intent and overall: `% of panel prompts where Hana is mentioned / cited-with-link / recommended`, plus **competitive SoV** (Hana vs each competitor's mention rate on the same prompts).
- A weekly **delta report** ("gained citation on 'best voice AI for post-discharge'; lost mention on 'voice AI vs portals' — competitor X now cited") → this is the primary feed into **A2**.
- Trend charts persisted to shared state for the dashboard.

**Cost control.** 50 prompts × 5 engines × weekly = 250 grounded calls/wk + 250 judge calls/wk. Use a Sonnet-class judge with **prompt caching** on the rubric. Budget ceiling enforced by the orchestrator; daily mini-panel is ~50 calls.

---

### A2 — Gap / Opportunity Agent

**Purpose.** Convert A1's signal + the existing content inventory into a **ranked, deduplicated backlog of buildable gaps**, each with a diagnosis (is this a *content* gap, a *schema* gap, a *rendering* gap, or an *entity/off-site* gap?).

**Trigger/cadence.** Weekly, right after A1. Plus event-driven when A6 reports a competitor's new page or a lost ranking.

**Inputs.** A1 measurements (esp. "absent/lost" prompts + which competitor won + *why* — the judge captures the cited competitor URL); the **content inventory** (Sanity slugs + page routes + their current schema/FAQ/tldr coverage); A5's entity-strength signals.

**Tools.** Sanity MCP (`query_documents` over project `7dkhf6fw` to enumerate posts and detect missing `faq`/`tldr`/reviewer); repo read (route list, existing JSON-LD per page); `WebFetch`/`WebSearch` to inspect the **competitor page that won the citation** and reverse-engineer what made it extractable (FAQ? table? direct answer? schema?); the existing **blog-cluster cannibalization map** from the content audit (9 readmission posts, 7 "dies-in-pilot" posts, 4 "85% engagement" posts → consolidate to pillars).

**Core logic.**
- For each lost/absent prompt: classify the gap →
  - **No page exists** targeting this query → *content gap* (new page).
  - **Page exists but not extractable** (no answer-first TL;DR, no FAQ schema, buried answer) → *structure/schema gap* (rewrite/augment).
  - **Page exists, good, but invisible** (JS-only, no prerender) → *rendering gap* (flag to substrate track; do not waste a generation cycle).
  - **Content fine, but Hana isn't a "known entity"** for the engine (string, not brand) → *entity gap* → route to A5.
- Score each gap: `priority = buyer_intent_value × engine_reach × winnability × strategic_fit − effort`. Buyer-intent value weights bottom-funnel ("best voice AI for X", comparison, pricing) above top-funnel.
- Deduplicate against the cannibalization map: prefer *consolidate-into-pillar + 301* over *yet another near-duplicate*.

**Outputs.** `gaps` rows with: target query/cluster, diagnosis, recommended artifact (new page / FAQ block / comparison page / schema-only / 301-consolidation / off-site task), priority score, suggested H1 + TL;DR angle, evidence (the competitor URL that won). This backlog is the work queue for A3/A4/A5.

---

### A3 — Content-Generation Agent

**Purpose.** Turn a triaged gap into a **complete, answer-first, schema-ready draft in Hana's voice**, landed as a **Sanity draft** (or a repo PR for static marketing pages) for human review. *Never auto-publishes.*

**Trigger/cadence.** On-demand from the approved gap backlog (a human or the orchestrator promotes gaps to "build"). Throttled to a content-velocity target (e.g. 3–6 drafts/week) to keep human review tractable and avoid thin-content spam (which AEO punishes).

**Inputs.** One gap; the **answer-first template** (from the content audit — H1 = the question, visible TL;DR block, question-shaped H2s with answer-first sentences, tables/lists, "Key facts" with sourced one-liners, FAQ section); Hana's **canonical facts** (the verified stats + their methodology + evidence URLs — maintained as a single `facts.yaml` source of truth so the agent **cannot invent numbers**); brand voice guide; the winning-competitor page (as a "beat this, don't copy it" reference).

**Tools.** Anthropic API (Opus-class for the draft) with **tool-use constrained to the facts file** (a `lookup_claim` tool that returns only approved stats + their source URL — any number not in the file must be flagged `[NEEDS SOURCE]`, never fabricated); Sanity MCP (`create_version`/draft create) to land the body as PortableText + populate the new `tldr`, `faq[]`, `medicalReviewer` fields; repo write (for static comparison/marketing pages → PR).

**Core logic / guardrails.**
1. Draft to the template; lead with a self-contained 2–4 sentence answer (the chunk engines lift).
2. Every quantitative claim must resolve through `lookup_claim` → real stat + citation, or be marked `[NEEDS SOURCE]`. **YMYL guardrail:** clinical claims get a mandatory `medicalReviewer` placeholder and a "Medically reviewed by" byline slot — the draft is *not eligible to publish* until a human reviewer is assigned.
3. Emit visible FAQ **and** the matching `faqSchema()` payload (A4 finalizes/validates).
4. Internal-link to the cluster pillar; if this is a consolidation, generate the 301 list for the PR.
5. Self-critique pass (a subagent re-reads the draft against the template + "would an answer engine extract a clean answer from the first 60 words?" rubric) before submitting.

**Outputs.** Sanity draft (status `needs-review`, with `tldr`/`faq`/`reviewer`/`author` populated) **or** a repo PR for static pages; plus a "reviewer brief" summarizing sources used, claims needing verification, and the target query. Routed to the human gate.

---

### A4 — Schema / Structured-Data + LLM-Asset Agent

**Purpose.** Keep **JSON-LD, `llms.txt`/`llms-full.txt`, and `sitemap.xml` correct, validated, and in sync** — as code, via PRs. This agent owns the "structured data audit" findings as a *standing* responsibility, not a one-off.

**Trigger/cadence.** On every content publish (regenerate that page's schema + sitemap entry + llms refresh); weekly full audit sweep; on schema-helper changes in the repo.

**Inputs.** The page/post content (Sanity + routes); the schema helpers in `SEO.tsx`; Hana's canonical facts; current `llms.txt`, `sitemap.xml`, `robots.txt`.

**Tools.** Repo read/write (PRs); Sanity MCP (read content for BlogPosting/FAQ generation, pull `_updatedAt` for `dateModified` + sitemap `lastmod`); an HTTP **schema validator** step in CI (Schema.org validator / Rich Results test) so invalid JSON-LD fails the PR; IndexNow POST on deploy.

**Core logic (directly implements the schema audit backlog).**
- Generate per-route JSON-LD as a **single `@graph`** (fixes the dead-ternary array emission), wired into prerendered HTML — not a post-hydration `useEffect`.
- Enforce the high-citation schema set: **FAQPage** (wire the unused `faqSchema()` everywhere with a visible FAQ), **MedicalOrganization** entity (expanded `knowsAbout`/`sameAs`/`founder` in static `index.html`), **Service/Offer** on Pricing (remove the misleading `price:"0"`), **BlogPosting** with real `author` Person + `reviewedBy` + `dateModified=_updatedAt` + `wordCount`/`image`, **BreadcrumbList** on every page, **Dataset** on `/research`, **VideoObject** for demos.
- **`llms.txt` / `llms-full.txt` as generated artifacts:** regenerate from the same source of truth (Sanity + `facts.yaml` + page metadata) on every build so they never drift; add `Last updated:` stamp, a "Key facts (quotable, sourced)" block, and the canonical one-sentence description. Add `llms-full.txt` (full extracted text of the top pages) — *especially* valuable while rendering is mid-migration, because it may be the only clean text source some bots can read.
- **Sitemap generation as a build step** from Sanity (all published slugs + `_updatedAt` for honest `lastmod`) + the static route list; ping IndexNow with changed URLs on deploy.

**Outputs.** PRs that modify schema/llms/sitemap with validator output attached; a weekly "schema coverage" scorecard (which routes have which schema types) feeding the KPI dashboard.

---

### A5 — Off-site / Entity Agent (GEO half)

**Purpose.** Strengthen Hana as a **known entity** in the corpora LLMs draw on — because on-site fixes cap out if the model doesn't "know" the brand. Tracks and *suggests* (does not auto-create) third-party presence.

**Trigger/cadence.** Monthly deep sweep; weekly light check for new listicles/mentions.

**Inputs.** Target directories/profiles (Crunchbase, G2, Capterra, Software Advice, LinkedIn, Wikidata, relevant healthtech directories); the category terms to be co-listed with ("AI patient engagement platforms", "healthcare voice AI vendors"); competitor presence for benchmarking.

**Tools.** `WebSearch`/`WebFetch` to detect presence/absence and freshness of each profile; search for "best voice AI for healthcare/patient engagement" **listicles** that omit Hana (these are the #1 source for "recommend a tool" answers); A1's competitor co-mention data to find which third-party pages the engines actually cite.

**Core logic.** Maintain an **entity-presence matrix** (profile → exists? complete? `sameAs`-linked from site? last updated?). For each gap, emit a **human task** with a ready-to-use payload: drafted Crunchbase/G2 copy, a proposed **Wikidata** entity statement set, a pitch email + the specific listicle/author to approach for inclusion. Verify the on-site `sameAs` array in the Organization schema matches reality (and flag the missing `logo.png`).

**Outputs.** Prioritized off-site task list (human-executed, since most require account ownership/manual submission) + a tracked entity-strength score over time.

> **Honest limit:** A5 *cannot and should not* auto-edit third-party sites or Wikidata (sock-puppetry/ToS risk, and Wikidata/Wikipedia require genuine notability and neutral editing). It is an intelligence-and-drafting agent feeding a human, by design.

---

### A6 — Freshness / Tech-Monitoring Agent

**Purpose.** Keep the substrate healthy and catch decay: stale `lastmod`, broken `logo.png`/og:image, prerender failures, new competitor content, soft-404s, IndexNow ping failures, robots/schema regressions.

**Trigger/cadence.** Daily light (uptime, broken canonical/og-image/logo, did the last deploy actually ship non-empty HTML for sampled routes); weekly (competitor new-content diff, sitemap drift vs Sanity, CWV regressions from the Remotion players).

**Tools.** `WebFetch` with **JS disabled** to assert that `curl`-equivalent HTML of sampled routes contains the H1/answer/JSON-LD (this is the *acceptance test for the rendering fix* and must stay green forever); repo/CI status; competitor sitemap/RSS diffing; IndexNow/GSC/Bing submission checks.

**Core logic.** Regression alarms (e.g., "post-deploy, `/pricing` raw HTML is empty again — prerender broke"), competitor-content alerts → feed A2, freshness nudges ("pillar X not updated in 90 days; refresh `dateModified`"). 

**Outputs.** Alert stream + a "substrate health" panel; competitor-content events into the gap backlog.

---

## 4. Architecture — concretely, on *this* stack

### 4.1 Runtime & framework

- **Agent runtime: Claude Agent SDK (TypeScript)**, one Node service ("aeo-engine") deployed as **Vercel Cron + Functions** (you're already on Vercel) or a small always-on worker (Render/Fly) if runs exceed function limits. Each agent is an SDK `query()`/subagent with a scoped tool set and system prompt. The **Orchestrator** is the top-level agent that schedules subagents, enforces budget, and writes the run ledger.
- **Scheduling: Vercel Cron** entries (daily mini-panel, weekly full panel, monthly off-site) hitting orchestrator endpoints. (In this very harness, the equivalent primitives are `CronCreate`/`schedule`/`loop` — the production system uses Vercel Cron so it runs independent of any interactive session.)
- **Models:** Sonnet-class for high-volume A1 judging + A6 (cost), Opus-class for A2 synthesis + A3 generation (quality). Configure via the Agent SDK; use **prompt caching** on the static rubrics/templates/facts to slash token cost on the repetitive monitor loop.

### 4.2 Tools / MCP wiring (all already available in this environment)

- **Sanity MCP** (`mcp__Sanity__*`) — `get_schema` (project `7dkhf6fw`), `query_documents`, `create_version`/draft creation, `patch_document_from_json`. This is how A2 inventories content and A3/A4 land drafts. **Schema additions A3/A4 depend on** (from the content audit): add to `post` → `tldr` (text), `faq` (array of {question, answer}), `medicalReviewer` (ref→author), and surface `_updatedAt`→`dateModified`; add to `author` → `role`, `credentials`, `bio`, `sameAs`/`linkedinUrl`, `image`; update `getPost`/`getPosts` GROQ to pull these (today `src/lib/sanity.ts` drops all of them). A4 ships these as a Sanity schema PR first — it's the unblock for everything generative.
- **Repo / Git** — agents write to **branches and open PRs** (via the `gh` CLI) for anything code: `SEO.tsx` schema helpers, `llms.txt`/`llms-full.txt`, the sitemap generator, prerender config, `robots.txt` tidy. **Nothing merges without human PR review.**
- **WebSearch / WebFetch** — A1 (fallback/competitor inspection), A2 (competitor page teardown), A5 (entity presence), A6 (regression checks, raw-HTML assertions).
- **External HTTP** (from the Node service, not MCP) — Perplexity Sonar, OpenAI web-search, Gemini grounding, Anthropic web search, IndexNow POST, schema validator.

### 4.3 Shared state

- **Postgres (Supabase)** — the system of record for measurements, prompt panel, competitors, gaps, run/cost ledgers, audit log. (Supabase is already an available integration.) Tables: `prompt_panel`, `measurements`, `sov_snapshots`, `competitors`, `gaps`, `content_inventory`, `entity_matrix`, `runs`, `costs`, `audit_log`.
- **`facts.yaml` in the repo** — the *single source of truth for every citable number*, each with value + definition + sample/methodology + evidence URL + last-verified date. A3 may only cite from here. This is the anti-hallucination spine and the AEO moat (sourced stats are what engines quote).

### 4.4 The human-in-the-loop gate (non-negotiable)

Two gates, mirroring the two artifact types:
- **Content gate — Sanity drafts.** A3 lands drafts in `needs-review`; a human editor (and, for clinical content, a **named medical reviewer**) approves/publishes in Sanity Studio. No agent has publish rights.
- **Code gate — GitHub PRs.** A4/A5/A6 changes (schema, llms.txt, sitemap, robots) open PRs with validator output attached; a human merges. CI blocks merges with invalid JSON-LD or with a raw-HTML emptiness regression.

This gate is what makes the system *safe for a healthcare brand*: every published word and every structured claim has a human (and a clinician where it's medical) on the hook, and everything is revertible.

### 4.5 Data flow (one full cycle, concretely)

```
MON 02:00  A1 runs weekly panel → writes measurements + SoV snapshot.
MON 06:00  A2 reads deltas → "Lost 'voice AI vs patient portals'; competitor C cited via
           their comparison page with an FAQ + table. We have 4 near-dup posts, no pillar."
           → emits gap #142 {type: consolidate+rewrite, target cluster, priority 0.86,
             evidence: competitorC/compare URL}.
HUMAN      Editor promotes gap #142 to "build".
TUE        A3 drafts the definitive "Voice AI vs Patient Portals" pillar (answer-first TL;DR,
           comparison table, FAQ, sourced 85%-stat via facts.yaml) → Sanity draft + 301 plan
           for the 3 weakest dupes. A4 attaches @graph: Article+FAQPage+BreadcrumbList,
           regenerates sitemap/llms entry → opens PR.
HUMAN      Editor + medical reviewer approve Sanity draft; eng merges the schema/redirect PR.
TUE PM     Vercel rebuild → prerendered HTML for the pillar → IndexNow ping → sitemap lastmod
           = _updatedAt. A6 asserts raw HTML of the new URL contains the TL;DR + JSON-LD. ✅
+2–6 WKS   A1 re-runs the gap's prompts → measures: Hana now cited on 'voice AI vs portals'?
           SoV delta recorded → attribution closes the loop on dashboard.
```

---

## 5. Cadence & metrics

### 5.1 Cadence

| Cadence | Agent(s) | Job |
|---|---|---|
| **Daily** | A1 (mini-panel), A6 | 10 top prompts; uptime + raw-HTML emptiness + broken logo/og + IndexNow health |
| **Weekly** | A1 (full panel), A2, A4 (sweep), A6 (competitor diff) | Full SoV measurement → gap backlog refresh → schema/sitemap/llms sweep → competitor-content alerts |
| **On publish / event** | A4, A6, A1 | Regenerate schema+sitemap+llms+IndexNow; assert HTML; queue re-measure of that gap's prompts |
| **Monthly** | A5, strategy review | Entity-presence sweep + off-site task list; human strategy review of SoV trend & roadmap |

### 5.2 KPIs (the dashboard)

**North-star: AI Share-of-Voice** — % of prompt-panel queries where Hana is *recommended/cited-with-link*, overall and per intent, trended weekly, segmented by engine and benchmarked vs each competitor.

Supporting KPIs:
- **Citation count & rate** (mentions, cited-with-link, recommended) per engine.
- **Branded vs unbranded presence** — do we win our own name *and* category queries? (Branded should hit ~100%; unbranded category SoV is the growth metric.)
- **Competitive SoV gap** — Hana vs top-2 competitors on shared prompts.
- **AI-referral analytics (ground truth)** — GA4 sessions from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai` referrers, and conversions thereof. This is real-world citation→visit, the hardest signal.
- **AI-crawler hits (ground truth)** — server-log fetches by OAI-SearchBot/PerplexityBot/ClaudeBot/GPTBot, and (post-fix) the % returning non-empty HTML. The single most important *substrate* metric.
- **Schema coverage** — % of routes with each high-citation schema type (FAQPage, Article+reviewer, Service/Offer, Breadcrumb).
- **Content velocity & freshness** — net-new answer-shaped pages/week; median content age; % of pillars updated in 90 days; honest `lastmod` coverage.
- **Substrate health** — % of sampled routes whose *raw* HTML contains the H1 + answer + JSON-LD (must trend to 100% and stay).

Every KPI is **baselined before Phase 0**, re-measured after each phase, so lift is attributable to specific changes (especially the rendering fix).

---

## 6. Phased roadmap

### Phase 0 — Substrate + stopgaps (Week 0–1, *prerequisite, mostly human-led*)
The agentic loop is pointless until crawlers can read pages. Do the cheap wins now (these are hours, from the audits): remove the duplicate global `<SEO/>` in `App.tsx`; add real `public/logo.png` + static `og:image`; add a catch-all noindex 404 route; add `<SEO>` to `Terms.tsx`/`Demo.tsx`; expand static `index.html` to **MedicalOrganization**; wire the unused `faqSchema()` into Home/Pricing with real Q&As; tidy `robots.txt`. **Then implement prerendering** (`vite-react-ssg` or a Puppeteer post-build snapshot over the route list + Sanity slugs) as the first move, with Astro migration as the planned destination. Acceptance test: `curl` of `/pricing` and a blog post returns full HTML + `@graph` JSON-LD with JS disabled. **A6's raw-HTML assertion becomes the permanent guardrail that this never regresses.**

### Phase 1 — MVP: Monitor + Schema/LLM automation (Week 2–4)
Build **A1 (Citation Monitor)** + **A4 (Schema/llms/sitemap automation)** + the shared state and dashboard. This is ~70% of the durable value: you get a real, trended **AI SoV baseline** the day rendering is fixed, and you make schema/llms/sitemap **self-maintaining as code** (FAQ everywhere, `@graph`, `dateModified=_updatedAt`, build-time sitemap from Sanity, IndexNow on deploy, `llms-full.txt`). Add the Sanity schema fields (`tldr`/`faq`/`reviewer`/rich author) now so the corpus is generation-ready. Stand up the human gates (Sanity draft + PR + CI validators).

### Phase 2 — Gap detection + assisted generation (Week 5–8)
Add **A2 (Gap)** + **A3 (Content Generator)** with the `facts.yaml` anti-hallucination spine and YMYL reviewer guardrail. Start with the highest-ROI, lowest-risk artifacts: **comparison pages** and **FAQ blocks** (clear right answers, easy human review). Begin **blog-cluster consolidation** (9 readmission / 7 dies-in-pilot / 4 engagement → pillars + 301s). Throttle to 3–6 reviewed drafts/week.

### Phase 3 — Off-site/entity + closed-loop attribution (Week 9–12+)
Add **A5 (Off-site/Entity)** and wire **A1 re-measurement → attribution** so the dashboard shows "this page/this off-site profile moved SoV on these prompts." Add **A6** competitor-content watch as a standing gap source.

### Phase 4 — Hana-data moat + Astro destination (ongoing)
Stand up the **Insights agent** that mines Hana's own de-identified, compliance-cleared aggregate operational data into **methodology-backed benchmark/Dataset pages** — the most-citable, least-replicable AEO asset a healthtech vendor can own. Complete the **Astro migration** (React islands for the voice widget + carousel) for the best durable SEO/AEO/CWV posture, retiring the prerender stopgap.

---

## 7. Risks, honest limits, and guardrails (consolidated)

- **Querying consumer engines is not ToS-clean or reliable.** Use official grounded/search APIs as *proxies*, plus server-logs + GA4 referrals as ground truth, plus optional licensed GEO trackers. Never scrape chatgpt.com/perplexity.ai/etc. Treat SoV as a directional index, spot-checked monthly by a human.
- **`llms.txt` is emerging, not load-bearing.** Keep it excellent and generated, but the rendering fix is what actually unlocks citations.
- **AEO-spam backfires.** Throttle generation; require human + (clinical) reviewer approval; consolidate rather than multiply near-duplicates; never fabricate stats or `AggregateRating`. The facts file + review gates are the controls.
- **YMYL/healthcare liability.** Medical claims require a named reviewer before publish; the gate enforces it.
- **Cost.** Sonnet for volume, Opus for synthesis, prompt caching on rubrics/templates/facts, hard budget ceilings in the orchestrator with a cost ledger.
- **Substrate regression.** A6's raw-HTML emptiness assertion is a permanent CI guardrail; if a deploy ever ships an empty `<div id="root">` again, the loop is silently dead — this check makes that loud.

**Key repo touchpoints the system reads/writes:** `/Users/matteo/HanaFigmaSite/src/lib/sanity.ts` (extend `Post` + GROQ for `_updatedAt`/`faq`/`tldr`/reviewer/rich author), `/Users/matteo/HanaFigmaSite/src/app/components/SEO.tsx` (wire `faqSchema()`, `@graph` emission, MedicalOrganization, Service/Offer, BlogPosting reviewer), `/Users/matteo/HanaFigmaSite/src/app/pages/BlogPost.tsx` (`dateModified=_updatedAt`, `<article>`, FAQ, byline), `/Users/matteo/HanaFigmaSite/index.html` (static MedicalOrganization + og:image + logo), `/Users/matteo/HanaFigmaSite/public/llms.txt` (+ new `llms-full.txt`), `/Users/matteo/HanaFigmaSite/public/sitemap.xml` (→ build-time generated from Sanity), `/Users/matteo/HanaFigmaSite/public/robots.txt`, `/Users/matteo/HanaFigmaSite/vercel.json` (404/prerender), `/Users/matteo/HanaFigmaSite/package.json` (add prerender + sitemap-gen build steps; `react-helmet-async` already installed for render-time head). New: `aeo-engine/` Agent-SDK service + Supabase schema + `facts.yaml`.