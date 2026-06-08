# Hana Health — SEO + AEO Consulting Report
**2026-06-05 · Final deliverable**

---

## 1. EXECUTIVE SUMMARY

### Is the site SEO-optimized? Honest verdict: **No — but the gap is narrow and very specific.**

You've done the hard, thoughtful parts better than almost every B2B healthtech site: a genuinely good `<SEO>` component with prebuilt schema helpers, a correct static `index.html` head (real title, meta, canonical, OG/Twitter, Organization JSON-LD), a full AI-crawler allowlist in `robots.txt`, an excellent `llms.txt`, IndexNow set up, Sanity-driven blog. The *strategy* and *content* are strong.

But all of that quality is shipped inside a **client-only SPA that serves an empty `<div id="root">` to anyone who doesn't run JavaScript.** And in 2025–2026, that's most of the crawlers that matter for AI answer engines. So you have a great strategy delivered through a pipe that ~95% of your URLs can't push through.

**One correction to the original brief up front:** the brief said `index.html` has a `"Hana Eng SIte"` typo title and no static meta/OG/JSON-LD, and that `robots.txt` has no AI directives. **All four repo-inspecting audits agree this is stale — those are already fixed in the current repo.** The real, unsolved problem is rendering, not the static head. I've written this report on current ground truth.

### The single biggest lever: **the SPA rendering problem.**

`vercel.json` rewrites every path to an empty `index.html`. All page body content, and all per-route meta/title/JSON-LD, are injected client-side by `SEO.tsx` in a `useEffect`. Consequences:

- **AI answer-engine bots (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, CCBot, Bytespider, Google-Extended) do not execute JS.** They fetch raw HTML and stop. For ~35 of 37 sitemap URLs — all 27 blog posts, `/pricing`, `/case-studies`, `/research`, whitepapers — they see the homepage's static head and an **empty body**. Your best AEO ammunition (APCM/CCM billing depth, readmission content, the 85%/2M+ proof points in context) is invisible to them.
- **Google** *can* render JS, but on a deferred, budget-limited second wave that's fragile for SPAs — and on render failure it falls back to the static shell, which currently shows **homepage** title/canonical/Organization JSON-LD for *every* route. Worst case, `/pricing` looks like a duplicate homepage.

Fix rendering and your existing good content goes from invisible to citable across ChatGPT, Perplexity, Claude, and Copilot. Everything else is a multiplier on top of that.

### Top 5 actions, in priority order

| # | Action | Why it's here | Effort |
|---|--------|---------------|--------|
| 1 | **Prerender every route to static HTML** (build-time, via `vite-react-ssg` or a Puppeteer snapshot over the route list + Sanity slugs) | The unlock. Makes all 37 URLs readable by non-JS crawlers and bakes per-route meta/JSON-LD into source. | M (1–2 days) |
| 2 | **Remove the duplicate global `<SEO/>` in `App.tsx`** (line 208, outside `<Routes>`) | Two `<SEO>` instances race on `document.head`; the global one writes homepage meta to every page. Fragile canonical/title even with JS. | S |
| 3 | **Wire the unused `faqSchema()` into Home, Pricing, Case Studies + top posts** with real Q&As | Highest-ROI schema for AI citation. The helper already exists and is used on **zero** pages. | S–M |
| 4 | **Wire `_updatedAt`→`dateModified` + real author/reviewer into BlogPosting** (Sanity already exposes `_updatedAt`; code throws it away) | Freshness + E-E-A-T are core AI-citation signals for YMYL health content. Currently `dateModified` is faked = `publishedAt`. | M |
| 5 | **Add a static `og:image` + a real `public/logo.png`** (both currently JS-only / 404) | Organization `logo` 404s; no static OG image for link unfurlers. Cheap entity/social wins. | S |

---

## 2. SEO AUDIT (merged, prioritized)

De-duplicated across all four audits. Severity: **C**ritical / **H**igh / **M**edium / **L**ow. Effort: **S**(hours) / **M**(1–3 days) / **L**(week+).

### 2A. Rendering / Technical

| Sev | Area | Problem | Fix | Eff |
|---|---|---|---|---|
| **C** | SPA empty shell | Every route serves empty `<div id="root">` + homepage-level static head. Non-JS AI crawlers get no page-specific content on ~35/37 URLs; Google must JS-render and falls back to homepage meta on failure. | Build-time prerender (§3). Bakes per-route HTML + meta + JSON-LD into source. | M→L |
| **C** | Duplicate global `<SEO/>` | `<SEO/>` rendered once globally in `App.tsx:208` *outside* `<Routes>` with homepage defaults, AND again per-page. Both mutate the same `document.head` singleton; final state is effect-order-dependent; static fallback is always homepage-level. | Remove the global `<SEO/>` from `App.tsx`; rely on per-page `<SEO>`. Then prerender bakes correct per-route tags. | S |
| **H** | CWV — 3 live Remotion players | `Home.tsx` carousel mounts **3 `<Player autoPlay loop>`** instances (all slides in DOM via react-slick), animating canvas simultaneously. Hurts INP, drains mobile CPU, inflates initial bundle (Remotion is heavy). | (a) Run only the visible slide's Player (pause off-screen via IntersectionObserver/slick `beforeChange`); (b) lazy-load carousel below fold with `React.lazy`; (c) consider `<video muted autoplay loop playsinline>` for the homepage loops. | M |
| **H** | Soft-404s | `vercel.json` rewrites `/(.*)`→`/index.html` with HTTP **200**; no `path="*"` route in `App.tsx`. Any bad/hallucinated URL returns 200 + shell. Google treats as soft-404; AI bots may index junk. | Add catch-all `<Route path="*">` → NotFound with `<SEO robots="noindex">`; emit a real 404 for unknown paths (prerender can ship a true `404.html`). | S–M |
| **M** | `react-helmet-async` unused | Installed as a dep but `SEO.tsx` uses raw `document.head` mutation in `useEffect` — produces nothing pre-hydration and breaks under prerender/SSR (effects don't run server-side). | When prerendering, switch SEO to render-time head (react-helmet-async, already installed, or RR7 `meta`/`links` exports). Otherwise drop the dep. | S (folds into §3) |
| **L** | Viewport conflict | Static `index.html` viewport has no `maximum-scale`; `SEO.tsx:74` overrides to `maximum-scale=5`. Minor a11y/zoom inconsistency pre vs post hydration. | Make them identical; drop `maximum-scale` to allow user zoom. | trivial |
| **L** | GA4/GTM double-tag | `index.html` loads **both** GTM (`GTM-PV2V5846`) and inline GA4 (`G-QMFSD2PPJ7`); a `GoogleTagManager.tsx` component also exists. Risk of double-counted pageviews. No consent mode for EU/regulated traffic. | Pick one path (load GA4 *through* GTM; remove inline) and verify in DebugView. Add Consent Mode v2 if you have EU traffic. | S |

### 2B. Structured Data

| Sev | Area | Problem | Fix | Eff |
|---|---|---|---|---|
| **C** | Schema is JS-injected | All schema beyond the one static Organization block (WebSite, SoftwareApplication, BlogPosting, BreadcrumbList) is injected in `SEO.tsx`'s `useEffect` — invisible to non-JS AI crawlers and fragile for Google. | Bake JSON-LD into prerendered HTML (§3). Until then, the static Organization block is your *only* AEO-visible schema — make it count (below). | M→L (with §3) |
| **H** | FAQPage used nowhere | `faqSchema()` exists in `SEO.tsx` but is referenced on **zero** pages. FAQPage is the single most-cited schema by AI Overviews/ChatGPT (Q&A maps to how engines retrieve & quote). | Add visible FAQ sections + `faqSchema()` to Home, Pricing, Case Studies, ADHD whitepaper, top posts. Self-contained answers (engines quote `acceptedAnswer.text` verbatim). Snippet below. | S–M |
| **H** | Thin Organization entity | Static + `organizationSchema` are minimal: no `address`/`foundingDate`/`founder`/`knowsAbout`/`slogan`, one `sameAs` (LinkedIn). Weak knowledge-graph signal → engines treat "Hana" as a string, not a known brand. | Expand to **`["Organization","MedicalOrganization"]`** with `knowsAbout`, `founder`, full `sameAs` (LinkedIn, Crunchbase, G2, X). Put it in the **static** `index.html`. Snippet below. | S |
| **H** | No healthcare schema | No `MedicalOrganization`/`MedicalBusiness` typing. For a clinical platform, generic Org+SoftwareApplication undersells domain authority exactly where engines apply extra source-credibility weighting. | Type org as `MedicalOrganization`; add `audience:{BusinessAudience, "Healthcare providers"}` and clinical `knowsAbout` (RPM, CCM, patient engagement). | S–M |
| **H** | Misleading pricing schema | `Pricing.tsx` passes **no jsonLd**. `softwareApplicationSchema` hardcodes `"price":"0"` ("free" signal — wrong). No Service/Offer for outcome-based pricing. | Remove `price:"0"`; use `offers` w/ availability + quote framing; add `Service` schema per workflow (post-discharge, CCM/APCM, ADHD intake, RPM). Snippets below. | S |
| **H** | Weak BlogPosting | `dateModified` hardcoded = `datePublished`; `author` falls back to Organization (no Person/url/sameAs); no `image`/`wordCount`/`articleSection`/`reviewedBy`. Authorship is a top AI-citation signal for health content. | Wire Sanity `_updatedAt`→`dateModified`, real `author` Person, `reviewedBy` (clinical), `image`, `wordCount`. Snippet below. | M |
| **M** | BreadcrumbList gaps | Present on About/Case Studies/Contact/Research/Timeline; **missing** on Pricing, Blog, BlogPost, Whitepapers, WhitepaperADHD, StateOfAI, Resources, AUP, Terms. | Add `breadcrumbSchema()` to remaining pages (helper exists). | S |
| **M** | No VideoObject / Dataset | `video1.mp4` ships with no `VideoObject`; `/research` + `/state-of-ai` have original data with no `Dataset` schema. Engines preferentially cite primary-source stats. | Add `VideoObject` (Home/Demo) and `Dataset` on `/research` surfacing the 85%/2M+ stats. Snippets below. | S |
| **L** | JSON-LD array emission | `SEO.tsx:124` has a dead ternary (`Array.isArray(x) ? x : x`); arrays of schemas emit as a raw top-level array. Valid for Google, fragile for some parsers. | Emit a single `{"@context":...,"@graph":[...]}`; drop the dead ternary. | XS |
| **L** | SoftwareApplication hygiene | No `featureList`/`screenshot`; WebSite schema comment claims a `SearchAction` that's absent. | Add `featureList` (workflows); add real `SearchAction` or fix the comment. | XS |

### 2C. Content / llms.txt / robots

| Sev | Area | Problem | Fix | Eff |
|---|---|---|---|---|
| **H** | No author/reviewer E-E-A-T | Live Sanity: `author` is **null** on the sampled post; author doc has only `name` (no role/bio/credentials/sameAs). No `medicalReviewer`. YMYL content without attribution gets down-weighted. | Extend Sanity `author` (role, credentials, bio, sameAs, image); add `medicalReviewer` ref + visible "Medically reviewed by" byline; backfill all 27 posts. | M |
| **H** | No answer-first structure | No `tldr`/`faq` fields on posts. Many titles are already question-shaped — perfect for AEO — but bodies have no extractable Q→A or TL;DR. Engines cite short, self-contained chunks. | Add `tldr` + `faq[]` to Sanity `post`; render visible "Quick answer" under H1 + visible FAQ + FAQPage JSON-LD. | M |
| **M** | Blog cannibalization | 27 posts cluster on 3 themes (~9 readmission, ~7 "dies-in-pilot", ~4 "85% engagement") with near-duplicate angles targeting the same queries. Splits authority; confuses canonical selection + AI dedup. | Per cluster: designate ONE pillar, 301 the weakest dupes, internally link the rest to the pillar. Pursue breadth over variations. | M |
| **M** | Hand-maintained sitemap | Static 37 URLs, uniform `lastmod` (2026-05-30). Sanity-driven blog → drift guaranteed; new posts need manual edits. | Generate `sitemap.xml` at build from Sanity (all slugs + `_updatedAt` for honest `lastmod`) + route list. | M |
| **M** | IndexNow not pinged | Key file present (`public/1cbb…txt`) but no evidence of a submission step. The key file alone does nothing. | POST changed URLs to IndexNow on each deploy/Sanity publish. | S |
| **M** | 2 pages missing `<SEO>` | `Terms.tsx` and `Demo.tsx` render no `<SEO>` → inherit homepage meta (wrong canonical/title). | Add `<SEO>` to Terms (canonical `/terms`); `<SEO robots="noindex">` for Demo (or exclude from index). | S |
| **L** | robots.txt per-bot Disallow | Named bot blocks each only specify `Allow: /` — they don't inherit the `*` `Disallow: /api/ /functions/`, so AI bots are technically allowed into those paths. | Add the two Disallows to each named block (corrected block in §6). | S |
| **L** | No `llms-full.txt` | `llms.txt` is index-level only; no deep-content companion. Especially valuable while rendering is mid-migration — may be the only clean text source some bots can read. | Add generated `llms-full.txt` (full text of top pages); date-stamp both; add a "Key facts (quotable, sourced)" block. | S |
| **L** | logo.png / og:image | Organization `logo` → `/logo.png` which **doesn't exist** (404). No static `og:image` (JS-injected Figma hash only). | Add real `public/logo.png` (≥512×512) + stable static `og:image` (1200×630) in `index.html`. | S |

---

## 3. THE RENDERING DECISION

### The problem, plainly

Your site is a **client-only SPA**. The server (Vercel) hands every visitor — human or bot — the same file: an `index.html` with a good `<head>` but an **empty body** (`<div id="root"></div>`). A browser then downloads your JS, runs React, and *builds* the page. Per-route titles, descriptions, canonicals, and JSON-LD are all written into the page by JavaScript *after* that happens.

Humans and Googlebot (mostly) run that JS, so they see real pages. **The crawlers behind ChatGPT Search, Perplexity, Claude, and Copilot do not.** They read the raw HTML and move on. So for them, your homepage exists (its head is static and good) and **every other page is blank** — same homepage title, same homepage canonical, zero body text. That's ~35 of 37 URLs, including all 27 blog posts and every page where your real differentiated content lives.

The fix is to **render the HTML on the server/at build time** so it ships complete in the first response, then let React "hydrate" it for interactivity. Three ways to get there:

### Option A — Build-time prerendering (RECOMMENDED — do this now)

Snapshot each route to real static HTML at build, keep the SPA for interactivity.

- **Tools for this exact stack (Vite + React 18 + RR7):** `vite-react-ssg` (purpose-built, integrates with RR7, per-route head exports — cleanest fit), or a Puppeteer/`react-snap`-style post-build crawl over your known route list + Sanity slugs into `dist/<route>/index.html`.
- **Fixes:** Non-JS crawlers + Bing get **full page text + per-route title/description/canonical/JSON-LD baked into static HTML** for all 37 URLs. Kills the homepage-meta-on-every-page problem. Google stops depending on second-wave render. Directly unlocks AEO for blog/case-studies/whitepapers.
- **Doesn't fix:** CWV from the 3 Remotion players (separate fix). Content freshness — prerender runs at build, so new posts need a rebuild (solved with a deploy-on-Sanity-publish webhook).
- **Risk:** Low–moderate. Guard browser-only code for the Node pass (Remotion `<Player>` must be client-only — wrap in a mounted check; Vapi already lazy-loads in `useEffect`, good). Need a Sanity-slug enumeration step. Switch `SEO.tsx` from `useEffect` head-mutation to render-time head (react-helmet-async is already installed).
- **Verdict:** Highest impact-per-effort. ~1–2 days. **This is the first move.**

### Option B — Migrate to Astro (or Next.js) — the destination, not the first step

- **Astro** is the right target for a marketing site with a Sanity blog: ships zero JS by default, real HTML output (ideal AEO extractability), first-class Sanity + sitemap + RSS, and "islands" to keep React only for the voice widget + carousel. **Also fixes CWV** by not shipping Remotion/React for static sections, and gives true per-route 404s.
- **Next.js (App Router)** is also excellent — SSG/ISR means new Sanity posts appear without a full redeploy, and you reuse React components more directly — but it's a heavier runtime than Astro.
- **Doesn't fix:** It's a rewrite (router, the custom `figma:asset` Vite resolver, SVG/CSV raw imports, `document.head` SEO logic → framework metadata API, voice SDK rewiring). 1–3 weeks.
- **Verdict:** Best durable SEO/AEO/CWV posture. **Plan it as where you land; don't block on it.** For this marketing-shaped site, Astro > Next.

### Option C — Edge bot-rendering (prerender.io / Vercel bot-serving) — AVOID

- Detect bot UAs at the edge, serve a headless-Chromium snapshot to bots, SPA to humans.
- **Why avoid:** Band-aid. Cloaking risk if bot vs human HTML diverges (Google dislikes this); added latency/cost/cache-staleness; and AI crawler UA lists change constantly, so coverage leaks *exactly where you care* (AEO). Option A gives cleaner, cheaper, non-cloaked HTML for the same effort class. Only justified for heavily dynamic/auth-gated content — which a marketing site doesn't have.

**Recommendation:** **A now, B (Astro) later, never C.** Acceptance test for either A or B: `curl https://www.hana.health/pricing` (and a blog post) with JS disabled returns the answer text + `@graph` JSON-LD in the body. Make this a permanent CI check so it never silently regresses.

---

## 4. AEO STRATEGY — getting cited by answer engines

### How the engines actually crawl & cite (2025–2026)

| Engine | Runs JS? | How it cites | Implication for Hana |
|---|---|---|---|
| **ChatGPT Search** (OAI-SearchBot) | **No** — raw HTML; partly Bing index | Cites live-fetched pages with clear extractable answers | Sees empty shell on sub-pages → can only cite homepage/`llms.txt`/third parties |
| **Perplexity** (PerplexityBot) | **Largely no** | Heavy citation; favors clean, factual, recently-updated pages | Empty shell → quotes competitors who render HTML |
| **Claude** (ClaudeBot + live fetch) | **No full render** | Cites fetched URLs; loves clean prose + tables | Same blindness; doesn't honor `llms.txt` as content source |
| **Google AI Overviews / Gemini** | **Partial** (deferred, fragile for SPAs) | Extractive snippets from indexed pages w/ strong structure + schema | Best chance, but betting on Google's flaky JS-render queue |
| **Copilot / Bing** (BingBot) | **No** | Cites Bing-indexed pages | Empty shell indexes as near-empty → no citations |

**Cross-engine truths:** (1) **Raw HTML wins** — 4 of 5 never run your JS. (2) **`llms.txt` is emerging, not load-bearing** — no major engine guarantees honoring it; keep it excellent, but it can't substitute for renderable pages. (3) **Off-site entity strength is half the game** — LLMs cite brands they "know" from G2/Crunchbase/Wikidata/listicles. (4) **Schema + answer-first structure** is what makes a page extractable.

### The plan

**On-site (after rendering is fixed):**
- **Answer-first structure** on every key page: first 1–2 sentences fully answer the page's core question (engines lift the first extractable answer), then detail, then a visible FAQ.
- **FAQPage schema everywhere it fits** — the highest-leverage missing schema. Phrase questions as users actually ask ("Is Hana HIPAA compliant?", "How does voice AI compare to patient portals?").
- **Comparison pages** (comparison/recommendation queries convert and get cited heavily): "Voice AI vs patient portals", "Best voice AI for post-discharge follow-up", "Voice AI for ADHD intake" — each = direct answer + comparison table + FAQ schema.
- **A definitive stat/methodology page** ("Hana by the numbers"): each claim with definition, sample size, date, schema. The canonical thing engines cite for "85% engagement."
- **Consolidate the duplicate blog clusters** into pillars (§2C) so authority concentrates on one citable URL per query.
- **`llms-full.txt`** with full text of top pages + a date-stamped "Key facts (quotable, sourced)" block.

**Off-site / entity (caps your citation rate regardless of on-site work):**
- Claim/complete **Crunchbase, G2, Capterra/Software Advice, LinkedIn**; create a **Wikidata** entity (pursue Wikipedia once notability supports it).
- Get into **"best voice AI for healthcare/patient engagement" listicles** — the #1 source LLMs draw from for "recommend a tool" prompts.
- Seed authoritative mentions (podcasts, healthtech directories, guest posts). Ensure on-site `sameAs` matches reality.

**Measurement (there's no "AI Search Console"):**
- **Prompt panel:** 40–60 buyer prompts run weekly across the engines' grounded/search APIs; log mentioned / cited-with-link / recommended / competitor-named. Your de-facto rank tracker.
- **Server-log bot analytics:** confirm OAI-SearchBot/PerplexityBot/ClaudeBot/GPTBot actually fetch — and post-fix, that they get non-empty HTML.
- **GA4 AI-referral segment:** sessions from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai` — real citation→visit ground truth.
- **Baseline now**, re-measure after each phase, so lift is attributable (especially to the rendering fix).

---

## 5. THE AGENTIC AEO SYSTEM

Once crawlers can read your pages, AEO becomes a **moving target** — competitors publish, engines re-rank weekly, `dateModified` decays. That's a standing loop, not a project.

### What it does

A fleet of **six scheduled agents** on the **Claude Agent SDK**, wired to **Sanity** (content source of truth), the **Git repo** (schema/llms.txt/sitemap as code), and **human review gates** (Sanity drafts + GitHub PRs). Everything AEO-relevant is treated as content (Sanity) or code (repo), so every agent action is reviewable, revertible, version-controlled.

**The loop in one sentence:** measure share-of-voice across a prompt panel → turn "we lost / we're absent here" into a ranked gap backlog → draft answer-first content (Sanity draft) + attach/validate schema (PR) → human approves → Vercel rebuilds prerendered HTML + pings IndexNow → re-measure the same prompts 2–6 weeks later to prove lift.

| Agent | Job |
|---|---|
| **A1 Citation Monitor** (MVP centerpiece) | Weekly: for each buyer prompt, does an engine mention/cite/recommend Hana or a competitor? Computes **Share-of-Voice** per intent/engine. |
| **A2 Gap/Opportunity** | Converts A1 deltas + content inventory into a ranked, de-duped backlog, each diagnosed as content / schema / rendering / entity gap. |
| **A3 Content Generator** | Drafts answer-first pages/FAQs in Hana's voice → Sanity draft / repo PR. **Never auto-publishes.** Cites only from `facts.yaml`. |
| **A4 Schema/LLM-Asset** | Keeps JSON-LD (`@graph`), `llms.txt`/`llms-full.txt`, `sitemap.xml` correct, validated, in sync — as PRs. |
| **A5 Off-site/Entity** | Tracks + drafts (doesn't auto-create) Crunchbase/G2/Wikidata/listicle presence. |
| **A6 Freshness/Tech-watch** | Daily: asserts raw HTML of sampled routes is non-empty (the permanent rendering-regression guard), broken logo/og, IndexNow health, competitor new content. |

### Architecture (on this stack)

- **Runtime:** Claude Agent SDK (TypeScript), one `aeo-engine` Node service on **Vercel Cron + Functions**. Orchestrator agent schedules subagents, enforces budget, writes a run/cost ledger. **Sonnet-class** for high-volume A1 judging + A6; **Opus-class** for A2 synthesis + A3 generation; prompt-caching on rubrics/templates/facts.
- **Tools/MCP:** **Sanity MCP** (inventory content, land drafts), **Git/gh** (PRs for all code), **WebSearch/WebFetch** (competitor teardown, entity checks, raw-HTML assertions). **External HTTP** from the Node service for the engine APIs (Perplexity Sonar, OpenAI web-search, Gemini grounding, Anthropic web search), IndexNow, schema validator.
- **State:** **Supabase/Postgres** (measurements, prompt panel, gaps, ledgers). **`facts.yaml`** in the repo = single source of truth for every citable number (value + methodology + evidence URL + last-verified) — the anti-hallucination spine; A3 may only cite from it.
- **Human gates (non-negotiable for healthcare):** content → Sanity draft approved by editor + **named medical reviewer**; code → GitHub PR with CI schema validation + the raw-HTML emptiness check. No agent has publish/merge rights.

### Honest limits (threaded through)
- **Don't scrape consumer chat UIs** (chatgpt.com etc.) — ToS-violating, brittle, bot-detected. Use official grounded/search APIs as *directional proxies*, plus server-logs + GA4 referrals as ground truth, plus a monthly human spot-check. Optionally license a GEO tracker (Profound/Peec/Otterly) — A1's schema can ingest a vendor feed.
- **`llms.txt` is a supplement, not the unlock** — rendering is.
- **AEO-spam backfires** — throttle generation (3–6 reviewed drafts/wk), consolidate rather than multiply near-dupes, never fabricate stats or `AggregateRating`.

### Cadence & metrics
- **Cadence:** daily (A1 mini-panel + A6 health), weekly (A1 full panel → A2 → A4 sweep → A6 competitor diff), on-publish (A4 regen + A6 assert + A1 queue re-measure), monthly (A5 + human strategy review).
- **North-star:** **AI Share-of-Voice** — % of panel prompts where Hana is recommended/cited-with-link, trended weekly per intent/engine vs competitors. Supporting: branded vs unbranded presence, AI-referral sessions (ground truth), AI-crawler hits + % returning non-empty HTML (substrate metric), schema coverage, content velocity/freshness.

### Phased roadmap (with MVP)
- **Phase 0 — Substrate (Week 0–1, prerequisite):** §6 quick wins + **prerendering**. The loop is pointless until crawlers can read pages. Acceptance: raw-HTML `curl` of `/pricing` + a post contains H1 + answer + `@graph`.
- **Phase 1 — MVP (Week 2–4):** **A1 (Monitor) + A4 (Schema/llms/sitemap automation)** + shared state + dashboard. ~70% of durable value: a real trended SoV baseline + self-maintaining schema/llms/sitemap. Add the Sanity fields (`tldr`/`faq`/`reviewer`/rich author) now.
- **Phase 2 — Gap + assisted generation (Week 5–8):** **A2 + A3** with `facts.yaml` + YMYL reviewer guardrail. Start with comparison pages + FAQ blocks (easy to review); begin blog consolidation.
- **Phase 3 — Off-site + attribution (Week 9–12+):** **A5** + wire A1 re-measurement → attribution. A6 competitor watch as a standing gap source.
- **Phase 4 — Moat + Astro (ongoing):** an Insights agent that mines Hana's de-identified, compliance-cleared aggregate data into methodology-backed **Dataset/benchmark pages** (the least-replicable AEO asset a healthtech vendor can own); complete the Astro migration and retire the prerender stopgap.

---

## 6. QUICK WINS — do this week

Low-effort, high-value. Several brief-listed "quick wins" (fix title, add static meta/OG/JSON-LD, robots AI directives) are **already done** — verified. Here's what's actually still open, as a checklist.

**Code (hours):**
- [ ] **Remove the global `<SEO/>` in `App.tsx:208`** (outside `<Routes>`). It writes homepage meta to every page and races the per-page `<SEO>`.
- [ ] **Add a real `public/logo.png`** (square, ≥512×512). Organization JSON-LD `logo` currently 404s.
- [ ] **Add a static `og:image` + `twitter:image`** (1200×630, stable absolute URL) to `index.html`. Today it's JS-injected from a Figma hash → no preview for LinkedIn/Slack/iMessage/AI unfurlers.
- [ ] **Add a catch-all `<Route path="*">`** → NotFound with `<SEO robots="noindex">`. Stops soft-404s on hallucinated/stale URLs.
- [ ] **Add `<SEO>` to `Terms.tsx`** (canonical `/terms`) and **`<SEO robots="noindex">` to `Demo.tsx`**.
- [ ] **Fix the viewport conflict** — drop `maximum-scale=5` in `SEO.tsx:74` to match static `index.html` (a11y).
- [ ] **De-dupe GA4/GTM** — load GA4 through GTM, remove the inline GA4 snippet (or vice-versa); verify in DebugView.

**Schema (hours):**
- [ ] **Wire `faqSchema()` into Home + Pricing** with 5–8 real Q&As (HIPAA/BAA, EHR integration, engagement rate, deployment time). Visible FAQ + matching JSON-LD. Zero-cost win using existing code.
- [ ] **Expand the static Organization → `["Organization","MedicalOrganization"]`** in `index.html`: add `knowsAbout`, `founder`, `foundingDate`, full `sameAs` (LinkedIn, Crunchbase, G2, X). This is the one schema every bot sees today.
- [ ] **Remove `"price":"0"`** from `softwareApplicationSchema`; use a quote-framed `offers` + `featureList`.
- [ ] **Fix the dead ternary in `SEO.tsx:124`**; emit multi-schema pages as a single `@graph`.

**Content/robots (hours):**
- [ ] **Pull `_updatedAt` in the Sanity GROQ** and map BlogPosting `dateModified` → it (currently faked = `publishedAt`). Free freshness win.
- [ ] **Tidy `robots.txt`** — add `Disallow: /api/` + `Disallow: /functions/` to each named-bot block (they don't inherit the `*` rules today).
- [ ] **Wire an IndexNow ping** into the deploy/Sanity-publish step (the key file alone does nothing).
- [ ] **Add a date-stamp + "Key facts (quotable, sourced)" block to `llms.txt`**; plan `llms-full.txt`.

**Corrected robots.txt AI block (grouped agents + inherited disallows):**
```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /functions/
Sitemap: https://www.hana.health/sitemap.xml
# LLM summaries: /llms.txt  /llms-full.txt

# AI answer-engine / live-citation crawlers (we want citations)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
Allow: /
Disallow: /api/
Disallow: /functions/

# Training crawlers (allow = future brand-entity reach; flip to Disallow to opt out)
User-agent: GPTBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Amazonbot
User-agent: Bytespider
Allow: /
Disallow: /api/
Disallow: /functions/
```

**FAQPage snippet** (self-contained answers — engines quote `acceptedAnswer.text` verbatim):
```json
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name":"Is Hana HIPAA compliant?","acceptedAnswer":{"@type":"Answer","text":"Yes. Hana Health is HIPAA-compliant and signs a Business Associate Agreement (BAA) with every healthcare customer."}},
 {"@type":"Question","name":"What patient engagement rate does Hana achieve?","acceptedAnswer":{"@type":"Answer","text":"Hana achieves an 85% weekly patient engagement rate via voice, SMS, and chat, versus 15–20% for typical patient portals."}},
 {"@type":"Question","name":"How does Hana integrate with our EHR?","acceptedAnswer":{"@type":"Answer","text":"Hana integrates with EHR systems via API and writes interaction results, symptom check-ins, and intake data back to the patient chart."}}
]}
```

**The one-line takeaway:** Your strategy, content, `llms.txt`, robots, and static head are already good — the bottleneck is that you ship them inside an empty HTML shell that non-JS AI crawlers can't read. **Prerender the routes this sprint**, bake your schema and FAQs into that static HTML, wire `_updatedAt` + author/reviewer into the blog, then stand up the monitor-first agentic loop. That single rendering change converts your existing good work from invisible to citable across ChatGPT, Perplexity, Claude, and Copilot.