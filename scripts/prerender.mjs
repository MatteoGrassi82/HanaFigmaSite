/**
 * Post-build prerender (SPA snapshot), in two layers.
 *
 * After `vite build`, this:
 *   1. Fetches all published blog slugs from Sanity.
 *   2. Builds the full route list (static marketing routes + blog posts).
 *   3. LAYER 1 — writes `dist/<route>/index.html` for every route with the correct
 *      title, description, canonical, OG/Twitter, hreflang and a crawlable
 *      <noscript> skeleton, using scripts/lib/route-seo.mjs. No browser needed,
 *      so this cannot be skipped.
 *   4. LAYER 2 — serves `dist/` with `vite preview`, loads each route in headless
 *      Chrome, waits for the SPA to render and <SEO> to inject its head tags, and
 *      overwrites the layer-1 file with the fully-rendered HTML.
 *
 * Layer 2 used to be the whole script, and when Chrome failed to launch it warned
 * and returned 0 — which is how production ended up serving the same homepage
 * shell (title, canonical and all) on all 90+ URLs for weeks. Layer 1 is the floor
 * that makes that failure mode survivable; layer 2 is still what we want.
 *
 * Run via:  npm run build   (build script chains this after `vite build`)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import puppeteer from 'puppeteer';
import { preview } from 'vite';
import {
  collectRouteMeta,
  injectHead,
  buildSitemap,
  stripFallbackNoscript,
  verifyAndFixHead,
  fullTitle,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  EN_DOMAIN,
  IT_DOMAIN,
  STATIC_ROUTES,
  EN_ONLY_ROUTES,
  NOINDEX_ROUTES,
  UNLISTED_ROUTES,
  checkRouteCoverage,
} from './lib/route-seo.mjs';
import { staticRouteLastmod } from './lib/git-lastmod.mjs';
import { readManifest } from './lastmod.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4178;

/**
 * Which site is being built.
 *
 * hana.health and ita.hana.health are two Vercel projects deploying THIS repo;
 * the app picks its locale from window.location.hostname at runtime. That means a
 * prerender is locale-specific: rendering on localhost bakes English copy and
 * English canonicals, which would be actively harmful on the Italian project.
 * So resolve the target up front and render as that host.
 *
 * Override with SITE_LOCALE=it|en; otherwise infer from the Vercel project domain
 * using the same "ita." test as src/lib/i18n.ts detectLocale().
 */
const PROJECT_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
const EXPLICIT_LOCALE =
  process.env.SITE_LOCALE === 'it' || process.env.SITE_LOCALE === 'en'
    ? process.env.SITE_LOCALE
    : null;

// Getting this wrong is silent and expensive: falling back to 'en' on the Italian
// project bakes https://www.hana.health canonicals onto every Italian page, which
// tells Google the whole Italian site is a duplicate of the English one. The
// inference below reads VERCEL_PROJECT_PRODUCTION_URL, which Vercel injects during
// a normal build — but NOT when the build output is produced elsewhere and shipped
// with `vercel deploy --prebuilt`. In that case the variable is empty and we would
// quietly choose 'en'. On a Vercel production build, refuse instead of guessing.
if (!EXPLICIT_LOCALE && !PROJECT_HOST && process.env.VERCEL_ENV === 'production') {
  console.error(
    '✗ Cannot determine the build locale.\n' +
    '  VERCEL_PROJECT_PRODUCTION_URL is empty and SITE_LOCALE is not set, so this build\n' +
    '  would default to English — which on the Italian project would point every\n' +
    '  canonical at www.hana.health. Set SITE_LOCALE=en or SITE_LOCALE=it explicitly.'
  );
  process.exit(1);
}

const LOCALE =
  EXPLICIT_LOCALE ??
  (PROJECT_HOST.startsWith('ita.') || PROJECT_HOST.includes('hanafigmasite-ita') ? 'it' : 'en');
const DOMAIN = LOCALE === 'it' ? IT_DOMAIN : EN_DOMAIN;
// Hostname headless Chrome must appear to be on for detectLocale() to agree.
const RENDER_HOST = LOCALE === 'it' ? 'ita.hana.health' : 'www.hana.health';

// STATIC_ROUTES / EN_ONLY_ROUTES live in ./lib/route-seo.mjs — see the import above.

// Sanity client (same config as src/lib/sanity.ts — public dataset read).
const sanity = createClient({
  projectId: '7dkhf6fw',
  dataset: 'production',
  apiVersion: '2026-05-12',
  useCdn: false,
});

// Fetch full post data in Node (no browser CORS limits) so we can inject it into
// the page as window.__PRERENDER__ — the SPA reads that instead of fetching
// Sanity from the headless browser (which is CORS-blocked from localhost).
const POST_LIST_Q = `
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, excerpt, mainImage, publishedAt, _updatedAt,
    categories[]->{ title },
    author->{ name, image }
  }`;
const POST_FULL_Q = `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
    _id, title, slug, excerpt, mainImage, publishedAt, _updatedAt,
    categories[]->{ title },
    author->{ name, image },
    body,
    seo { metaTitle, metaDescription, ogImage, noIndex }
  }`;

async function getBlogData() {
  try {
    const [posts, fullPosts] = await Promise.all([
      sanity.fetch(POST_LIST_Q),
      sanity.fetch(POST_FULL_Q),
    ]);
    const postBySlug = {};
    for (const p of fullPosts || []) {
      if (p?.slug?.current) postBySlug[p.slug.current] = p;
    }
    const routes = Object.keys(postBySlug).map((s) => `/blog/${s}`);
    console.log(`  ↳ fetched ${routes.length} blog posts (full data) from Sanity`);
    return { routes, cache: { posts: posts || [], postBySlug } };
  } catch (err) {
    throw new Error(`Sanity fetch failed: ${err.message}`);
  }
}

/**
 * Blog data with retries, because the sitemap is generated from it.
 *
 * A transient Sanity outage used to be a warning ("prerendering static routes
 * only"). Now that the same route list produces sitemap.xml, swallowing it would
 * silently ship a sitemap missing ~78% of the site — a much worse outcome than a
 * failed build. Retry, then stop. ALLOW_MISSING_BLOG=1 forces through if you
 * genuinely need to deploy during a Sanity outage.
 */
async function getBlogDataOrFail(attempts = 3) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await getBlogData();
    } catch (err) {
      lastErr = err;
      console.warn(`  ⚠ ${err.message} (attempt ${i}/${attempts})`);
      if (i < attempts) await new Promise((r) => setTimeout(r, 2000 * i));
    }
  }
  if (process.env.ALLOW_MISSING_BLOG === '1') {
    console.warn('  ⚠ ALLOW_MISSING_BLOG=1 — continuing WITHOUT blog posts. sitemap.xml will be incomplete.');
    return { routes: [], cache: { posts: [], postBySlug: {} } };
  }
  console.error(
    `✗ ${lastErr.message}\n` +
    '  Refusing to build: the sitemap is generated from this data, and shipping it\n' +
    '  without the blog posts would drop them from search. Set ALLOW_MISSING_BLOG=1\n' +
    '  to override.'
  );
  process.exit(1);
}

/**
 * Strip third-party <script src> tags that were injected at RUNTIME, keeping the
 * ones the built shell actually ships.
 *
 * Layer 2 serialises whatever the headless browser ended up with, and Google Tag
 * Manager spends that render injecting its own tags. So every prerendered page in
 * dist/ has hardcoded <script> tags for Wistia's player, Sentry, leadsy.ai and a
 * second gtag — none of which are in index.html, all of which GTM would inject
 * again at runtime anyway. Baked into the HTML they become parser-discovered
 * downloads on first paint instead of asynchronous ones after it.
 *
 * That is a site-wide condition and predates this function; it is NOT fixed here,
 * because changing what loads on 160 pages is a decision about analytics, not a
 * prerender detail. This is applied only to UNLISTED_ROUTES, where it has to be:
 * /go has a two-second budget on 4G, and one of the tags being baked in is the
 * Calendly widget, which the page deliberately defers until the reader scrolls
 * near it (see CalendlyInline in src/app/pages/Go.tsx). Serialising it defeats
 * that on the one page where the deferral was the point.
 *
 * Anything present in the shell is left alone, so GTM, GA4 and Gleap still load
 * on these pages exactly as they do everywhere else.
 */
function stripUnusedModulePreloads(html) {
  return html.replace(/\s*<link\b[^>]*\brel="modulepreload"[^>]*>/gi, '');
}

/**
 * Drop <link rel="modulepreload"> hints from a page that does not need them.
 *
 * App.tsx imports Home statically (every other route is lazy), so Home's whole
 * component graph — the carousel, the slick bundle, the safety monitor, the
 * patient context panel — sits in the entry chunk's static import graph, and Vite
 * writes a modulepreload link for each one into the shell. Every route inherits
 * them. On most pages that is a fair trade for the homepage being instant.
 *
 * On /go it is about 110KB gzipped of chunks the page never renders, downloading
 * in parallel with the film on a connection that has a two-second budget. The
 * hints are only hints: anything actually needed is still reached through the
 * entry chunk's own imports, just without the head start. Stylesheets and the
 * entry <script> are untouched, so nothing about how the page renders changes.
 */
function stripRuntimeInjectedScripts(html, shellSrcs) {
  return html.replace(
    /<script\b[^>]*\bsrc="([^"]*)"[^>]*>\s*<\/script>/gi,
    (tag, src) => (shellSrcs.has(src) || src.startsWith('/') ? tag : '')
  );
}

function routeToFile(route) {
  // "/"            -> dist/index.html
  // "/pricing"     -> dist/pricing/index.html
  // "/blog/x"      -> dist/blog/x/index.html
  if (route === '/') return join(DIST, 'index.html');
  return join(DIST, route.replace(/^\//, ''), 'index.html');
}

/**
 * LAYER 1 — bake per-route <head> into the shell without a browser.
 * Runs for every route, always, before Chrome is even attempted.
 */
async function writeHeadOnly(routes, shell, cache) {
  const pageMeta = collectRouteMeta(join(ROOT, 'src', 'app'), LOCALE);
  const found = Object.keys(pageMeta).length;
  console.log(`  ↳ read <SEO> props for ${found} routes from the page sources`);

  // Static routes are dated from git (+ the committed manifest, for the history
  // Vercel's --depth=10 clone can't see); blog posts are dated from Sanity below.
  // Filtered to STATIC_ROUTES so the shared-chrome threshold is computed over the
  // same route set as `npm run seo:lastmod` — otherwise en/it builds would
  // disagree with the manifest and every build would report it stale.
  const staticMeta = Object.fromEntries(
    Object.entries(pageMeta).filter(([route]) => STATIC_ROUTES.includes(route))
  );
  const { lastmod, stale, shallow } = staticRouteLastmod(staticMeta, ROOT, await readManifest());
  if (stale.length) {
    console.warn(
      `  ⚠ route-lastmod.json is behind git for ${stale.length} route(s): ${stale.join(', ')}\n` +
      '    Using the git date for this build; run `npm run seo:lastmod` and commit.'
    );
  } else if (shallow) {
    console.log('  ↳ shallow clone — static route dates came from route-lastmod.json');
  }

  let written = 0;
  const unknown = [];
  const indexable = [];
  // The resolved metadata per route, handed to layer 2 so the rendered snapshot
  // can be checked against it (see verifyAndFixHead).
  const resolved = {};
  for (const route of routes) {
    let m = pageMeta[route];

    // Blog posts get their metadata from the Sanity payload we already fetched.
    if (!m && route.startsWith('/blog/')) {
      const post = cache.postBySlug[route.slice('/blog/'.length)];
      if (post) {
        m = {
          title: fullTitle(post.seo?.metaTitle || post.title, false),
          description: post.seo?.metaDescription || post.excerpt || DEFAULT_DESCRIPTION,
          type: 'article',
          robots: post.seo?.noIndex ? 'noindex, follow' : 'index, follow',
        };
        if (post._updatedAt || post.publishedAt) lastmod[route] = post._updatedAt || post.publishedAt;
      }
    }

    if (!m) {
      // Internal preview routes are expected to have no <SEO> block — don't warn
      // about them, and don't let them inherit the homepage's generic title.
      if (NOINDEX_ROUTES.includes(route) || UNLISTED_ROUTES.includes(route)) {
        m = { title: fullTitle(`Internal preview: ${route}`), description: DEFAULT_DESCRIPTION, type: 'website' };
      } else {
        unknown.push(route);
        m = { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'website', robots: 'index, follow' };
      }
    }

    // Force noindex on the internal preview routes whatever the page declares.
    // /preview already sets it via <SEO robots="noindex, nofollow">; /demo, /bento
    // and /proof have no <SEO> at all and would otherwise default to index,follow.
    // This is also what keeps them out of sitemap.xml (see `indexable` below).
    // UNLISTED_ROUTES get the same override for the opposite reason: /go is
    // published and permanent, but it is for 247 letter recipients, not for
    // search. Forcing it here means the page cannot drift into the sitemap by
    // someone editing its <SEO> block.
    if (NOINDEX_ROUTES.includes(route) || UNLISTED_ROUTES.includes(route)) {
      m = { ...m, robots: 'noindex, nofollow' };
    }

    const meta = { ...m, path: route, locale: LOCALE };
    resolved[route] = meta;

    const file = routeToFile(route);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, injectHead(shell, meta), 'utf8');
    written++;
    if (!/noindex/i.test(m.robots || '')) indexable.push(route);
  }

  if (unknown.length) {
    // Not fatal — these still get a correct canonical, which is the thing that
    // was actively hurting us — but they're carrying the generic title.
    console.warn(`  ⚠ no <SEO path="…"> found for ${unknown.length} route(s): ${unknown.join(', ')}`);
  }
  console.log(`▸ Head-injection complete: ${written} routes have a unique title + canonical.`);

  // sitemap.xml, generated from the very same route list so it can never drift.
  await writeFile(
    join(DIST, 'sitemap.xml'),
    buildSitemap(indexable, { locale: LOCALE, lastmod }),
    'utf8'
  );
  console.log(`▸ sitemap.xml written: ${indexable.length} URLs on ${DOMAIN}.`);
  return resolved;
}

/** Launch headless Chrome, ignoring a stale PUPPETEER_EXECUTABLE_PATH. */
async function launchBrowser() {
  // A PUPPETEER_EXECUTABLE_PATH pointing at a binary that isn't there is worse
  // than none at all — it was set to /usr/bin/google-chrome-stable in Vercel
  // production, which doesn't exist on the build image, and every build silently
  // shipped an unrendered site. Only honour it if the binary actually exists.
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath && !existsSync(envPath)) {
    console.warn(`  ⚠ ignoring PUPPETEER_EXECUTABLE_PATH=${envPath} (no binary there)`);
  }
  const executablePath = envPath && existsSync(envPath) ? envPath : undefined;
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    // Render as the real production hostname so detectLocale() (which reads
    // window.location.hostname) picks the same locale this build is for.
    `--host-resolver-rules=MAP ${RENDER_HOST} 127.0.0.1`,
  ];

  for (const headless of [true, 'shell']) {
    try {
      return await puppeteer.launch({ headless, executablePath, args });
    } catch (err) {
      console.warn(`  ⚠ chrome launch (headless: ${String(headless)}) failed — ${err.message.split('\n')[0]}`);
    }
  }

  // Fallback for the Vercel build image. `puppeteer browsers install chrome`
  // downloads fine there but the binary dies with exit code 127 — Amazon Linux
  // 2023 is missing the shared libraries (libnss3 and friends) a normal Chrome
  // build links against, and there's no root to dnf them in. @sparticuz/chromium
  // is a Chromium built for exactly this environment, libs included.
  try {
    const { default: chromium } = await import('@sparticuz/chromium');
    const sparticuzPath = await chromium.executablePath();
    console.log('  ↳ falling back to @sparticuz/chromium');
    return await puppeteer.launch({
      executablePath: sparticuzPath,
      args: [...chromium.args, ...args],
      headless: 'shell',
    });
  } catch (err) {
    console.warn(`  ⚠ @sparticuz/chromium launch failed — ${err.message.split('\n')[0]}`);
  }

  return null;
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('✗ dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  // Unknown paths now return a real 404 (vercel.json → api/not-found.ts), so a
  // route that exists in App.tsx but is missing from the lists below is no longer
  // a quiet SEO problem — it is a live page returning 404. Fail loudly instead.
  const coverage = checkRouteCoverage(
    join(ROOT, 'src', 'app', 'App.tsx'),
    join(ROOT, 'src', 'app'),
    join(ROOT, 'src', 'app', 'components', 'layout', 'Footer.tsx'),
  );
  if (coverage.length) {
    console.error('✗ Route coverage check failed:\n' + coverage.map((p) => `  • ${p}`).join('\n'));
    process.exit(1);
  }

  console.log('▸ Prerender: collecting routes…');
  const { routes: blogRoutes, cache } = await getBlogDataOrFail();
  const staticRoutes =
    LOCALE === 'it' ? STATIC_ROUTES.filter((r) => !EN_ONLY_ROUTES.includes(r)) : STATIC_ROUTES;
  // UNPUBLISHED PAGES ARE NOT RENDERED AT ALL, so they do not exist in production.
  //
  // These were prerendered-but-noindex: reachable at their real URL, kept out of
  // Google. That is the right shape for a page under review and the wrong one for a
  // site that has not launched — the pages for the new site are written but not
  // announced, and "anyone with the URL" is not the same as hidden. vercel.json
  // rewrites every path with no matching file to /api/not-found, so leaving a route
  // out of this list IS the hiding mechanism; it is what DEV_ONLY_ROUTES has always
  // relied on. Publishing is then one edit: move the route out of NOINDEX_ROUTES and
  // into STATIC_ROUTES, and it gains both a rendered page and an index entry.
  //
  // It is also most of the build. These 22 routes include /remote-lab at 212s,
  // /compare/vs-doing-nothing at 58s and eight /programs/* pages, against a total of
  // ~1400s for all 168 — so hiding them roughly halves every deploy.
  //
  // PRERENDER_INCLUDE_NOINDEX=1 puts them back for one build, which is how to review
  // one on a preview URL without publishing it.
  const includeNoindex = process.env.PRERENDER_INCLUDE_NOINDEX === '1';
  const hidden = includeNoindex ? [] : NOINDEX_ROUTES;
  // UNLISTED_ROUTES are always rendered, in every build and both locales. They are
  // published pages that simply are not advertised — /go is a printed QR code's
  // destination, and a build that skipped it would 404 a letter. See route-seo.mjs.
  const routes = [
    ...staticRoutes,
    ...UNLISTED_ROUTES,
    ...(includeNoindex ? NOINDEX_ROUTES : []),
    ...blogRoutes,
  ];
  if (hidden.length) {
    console.log(`▸ ${hidden.length} unpublished route(s) NOT rendered — they will 404: ${hidden.join(', ')}`);
  }
  console.log(`▸ ${routes.length} routes to prerender (locale: ${LOCALE}, ${DOMAIN}).`);

  // Layer 1: always, no browser. Read the shell first — later layer-2 writes
  // replace these files wholesale, so the shell must be the untouched build.
  const shell = await readFile(join(DIST, 'index.html'), 'utf8');
  // A previous run leaves the *rendered homepage* at dist/index.html. Using that
  // as the shell would stamp homepage content onto all 96 routes, so refuse.
  if (!shell.includes('<div id="root"></div>')) {
    console.error(
      '✗ dist/index.html is already prerendered — refusing to use it as the shell.\n' +
      '  Run `vite build` first (or just `npm run build`, which chains both).'
    );
    process.exit(1);
  }
  const routeMeta = await writeHeadOnly(routes, shell, cache);

  // Serve the built dist with vite preview (SPA fallback to index.html).
  const server = await preview({
    root: ROOT,
    // allowedHosts: we browse via the production hostname (see RENDER_HOST), which
    // Vite's host check would otherwise reject as a DNS-rebinding attempt.
    // host: bind IPv4 explicitly — the resolver rule points at 127.0.0.1, and a
    // default localhost bind can end up IPv6-only (connection refused).
    preview: { host: '127.0.0.1', port: PORT, strictPort: true, allowedHosts: [RENDER_HOST] },
    // appType spa => unknown paths fall back to index.html, which is what we want.
  });
  // Navigate via the production hostname (mapped to 127.0.0.1 by the resolver rule
  // above) rather than localhost, so the app detects the right locale.
  const base = `http://${RENDER_HOST}:${PORT}`;

  const browser = await launchBrowser();
  if (!browser) {
    console.warn(
      '▸ Full prerender SKIPPED: no usable Chrome.\n' +
      '  Routes still have correct titles, descriptions and canonicals from layer 1,\n' +
      '  but crawlers will not see rendered body copy. Fix by making\n' +
      '  `puppeteer browsers install chrome` run in the build (see package.json).'
    );
    await server.httpServer.close();
    return;
  }

  let ok = 0;
  let failed = 0;
  const headFixes = [];
  // Every <script src> the built shell genuinely ships. Anything outside this set
  // in a rendered snapshot was injected while the page ran. See
  // stripRuntimeInjectedScripts.
  const shellSrcs = new Set(
    [...shell.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map((m) => m[1])
  );
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      try {
        // Inject the Sanity data cache BEFORE any app code runs, so the SPA reads
        // it instead of making a CORS-blocked browser fetch to api.sanity.io.
        await page.evaluateOnNewDocument((data) => {
          window.__PRERENDER__ = data;
        }, cache);

        // networkidle0 is the right default: it waits out the data fetches most
        // routes do before they have anything to serialise. But it is a wait for
        // SILENCE on the network, and a page that streams media never goes quiet.
        // /go autoplays a 6.6MB film, so it never reaches idle and the navigation
        // times out — which used to abandon the route at its layer-1 head-only
        // file, losing the rendered body, the video markup and the muted attribute
        // that markup exists to carry.
        //
        // A timeout here is not a failed render, it is an unanswered question. The
        // waits below are the real test of whether the app mounted, so let them
        // answer it. Any other navigation error is still a genuine failure.
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle0', timeout: 45000 })
          .catch((err) => {
            if (!/timeout/i.test(String(err?.message || err))) throw err;
            console.log(`  ↳ ${route} never reached network idle (streaming media); continuing`);
          });

        // Wait until the app has mounted real content and isn't on a loading
        // skeleton. With the injected cache, blog data resolves synchronously-ish.
        //
        // The 200-character floor is a proxy for "this is a real page, not a
        // spinner", and it is right for every page that argues something. It is
        // wrong for a page whose whole point is that it says almost nothing: /go
        // carries about 147 characters of visible text on purpose, and it timed
        // out here rather than rendering. So a page may also declare itself ready
        // by putting data-rendered="true" on an element — an attribute that only
        // exists once React has actually rendered, which is the same guarantee
        // the text length was standing in for. Use it sparingly; the heuristic is
        // the default for a reason.
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root');
            if (!root) return false;
            if (root.querySelector('[data-rendered="true"]')) return true;
            const text = (root.innerText || '').trim();
            if (text.length < 200) return false;
            if (text === 'Loading...') return false;
            return true;
          },
          { timeout: 25000, polling: 150 }
        );

        // Wait for the <SEO> head injection to settle: a non-placeholder <title>
        // and at least one JSON-LD block present in the head.
        await page.waitForFunction(
          () => {
            const t = document.title || '';
            const hasTitle = t.length > 0 && t !== 'Hana Eng SIte';
            const hasLd = !!document.querySelector('script[type="application/ld+json"]');
            return hasTitle && hasLd;
          },
          { timeout: 15000, polling: 200 }
        );

        // Settle: wait until #root size is stable across two reads (async content
        // + SEO effects fully flushed), then a final beat.
        let prev = -1;
        for (let i = 0; i < 20; i++) {
          const size = await page.evaluate(
            () => document.getElementById('root')?.innerHTML.length || 0
          );
          if (size === prev && size > 0) break;
          prev = size;
          await new Promise((r) => setTimeout(r, 250));
        }
        await new Promise((r) => setTimeout(r, 300));

        // Fire every scroll-triggered reveal before capturing.
        //
        // 28 component files animate their sections in with motion's
        // `whileInView`, which is an IntersectionObserver. Puppeteer's default
        // viewport is 800x600 and nothing here ever scrolled, so every section
        // below the first 600px never intersected, and motion left its initial
        // `opacity: 0` inline in the serialized HTML. Measured before this fix:
        // 52% of the homepage's text, 62% of /hana-remote and 79% of /remote-v2
        // were captured inside an opacity-0 node — invisible in exactly the
        // static files this whole pipeline exists to produce. The text is in the
        // DOM, so seo-check's byte-count assertion passed the whole time.
        //
        // Scrolling the document in viewport-sized steps triggers the observers
        // in order, the same way a reader would. Cheap, and it fixes all 28
        // files at once without touching a single component.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          const height = () => document.documentElement.scrollHeight;
          for (let y = 0; y < height(); y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 90));
          }
          window.scrollTo(0, height());
          await new Promise((r) => setTimeout(r, 250));
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 120));
        });
        // Let the reveal transitions land on their final values.
        await new Promise((r) => setTimeout(r, 500));

        let html = await page.content();
        // Strip the dev/preview origin if it leaked into any absolute URLs.
        html = html.replaceAll(base, DOMAIN);
        // The rendered body supersedes the layer-1 skeleton (and preview's SPA
        // fallback means the skeleton in hand is the homepage's, not this route's).
        html = stripFallbackNoscript(html);

        // /go and friends: keep the snapshot down to what the page asked for.
        if (UNLISTED_ROUTES.includes(route)) {
          html = stripRuntimeInjectedScripts(html, shellSrcs);
          html = stripUnusedModulePreloads(html);
        }

        // Never trust the snapshot's <head>. A page that renders no <SEO> block
        // leaves the homepage's canonical and robots in place, because vite
        // preview answers unknown paths with dist/index.html.
        const { html: checked, fixed } = verifyAndFixHead(html, {
          ...routeMeta[route],
          homeTitle: routeMeta['/']?.title,
        });
        if (fixed.length) {
          headFixes.push(`${route}: ${fixed.join('; ')}`);
          html = checked;
        }

        const file = routeToFile(route);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html, 'utf8');
        ok++;
        console.log(`  ✓ ${route}`);
      } catch (err) {
        failed++;
        console.warn(`  ✗ ${route} — ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await server.httpServer.close();
  }

  console.log(`▸ Prerender complete: ${ok} rendered, ${failed} left at head-only.`);
  if (headFixes.length) {
    console.warn(
      `  ⚠ repaired the <head> of ${headFixes.length} snapshot(s) that came back with the\n` +
      '    wrong canonical/robots/title — usually a page with no <SEO> block:\n' +
      headFixes.map((f) => `      • ${f}`).join('\n')
    );
  }
  // Layer 1 already wrote every route, so a partial layer 2 is a degradation, not
  // a broken build. Only a total failure means the browser path is misconfigured.
  if (ok === 0) {
    console.error('✗ Every route failed to render — check the app for a boot error.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('✗ Prerender crashed:', err);
  process.exit(1);
});
