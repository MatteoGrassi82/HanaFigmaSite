# SEO / AEO tooling

Build-time prerendering + the agentic-AEO MVP scripts. See `SEO_AEO_REPORT.md`
and `AEO_AGENTIC_SYSTEM.md` at the repo root for the full strategy.

## Prerendering (`scripts/prerender.mjs`)

The site is a Vite + React Router SPA. On its own it ships an empty `<div id="root">`,
which non-JS crawlers (most AI answer engines, and Googlebot's fallback) can't read.

`npm run build` now does **`vite build` → prerender**:

1. Fetches all published blog slugs + full post data from Sanity (in Node, so no
   browser CORS limits).
2. Serves the built `dist/` with `vite preview` and visits every route in headless
   Chrome, injecting the Sanity data as `window.__PRERENDER__` so the app reads it
   instead of making a CORS-blocked browser fetch.
3. Writes the fully-rendered HTML (content + per-route meta + JSON-LD) to
   `dist/<route>/index.html`.

`vercel.json` serves those prerendered files and only falls back to the SPA shell
for unknown paths (the catch-all 404 route).

- `npm run build` — bundle + prerender (what Vercel runs).
- `npm run build:bundle` — bundle only (no prerender).
- `npm run prerender` — prerender an already-built `dist/`.

Adding a route? Add it to `STATIC_ROUTES` in `prerender.mjs` (and to the `<Routes>`
in `src/app/App.tsx`). Blog posts are discovered from Sanity automatically.

## AEO sync + validate (`scripts/aeo-schema-llms-sync.mjs`)

Keeps the machine-facing surfaces honest. No external API.

- `npm run aeo:sync` — validates all JSON-LD in `dist/`, and checks `sitemap.xml`
  and `llms.txt` against the real route set (static routes + Sanity blog slugs).
  Reports missing/stale URLs and invalid structured data.
- `SITEMAP_DATE=YYYY-MM-DD npm run aeo:sync -- --fix` — regenerates `sitemap.xml`
  from the true route set so it never drifts.

Run it in CI after a build to catch sitemap/schema drift before deploy.

## AEO content-gap drafter (`scripts/aeo-content-drafter.mjs`)

Drafts answer-first, schema-rich pages that AI answer engines cite. Human-in-the-loop:
output goes to `content-drafts/` for review before publishing to Sanity. Calls the
Anthropic API directly (key from env; nothing runs without it).

- `npm run aeo:draft -- --list` — show the curated gap backlog (no API call).
- `ANTHROPIC_API_KEY=sk-… npm run aeo:draft -- "<query>"` — draft a page.
- `… npm run aeo:draft -- --type=comparison "Hana vs patient portals"` — set the
  page shape (`faq | comparison | guide | stat`).

Each draft ends with a YAML block (title, description, slug, FAQ pairs) ready to
wire into `faqSchema()` and publish.
