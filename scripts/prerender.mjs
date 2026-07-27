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
  fullTitle,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  EN_DOMAIN,
  IT_DOMAIN,
  STATIC_ROUTES,
  EN_ONLY_ROUTES,
} from './lib/route-seo.mjs';

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
const LOCALE =
  process.env.SITE_LOCALE === 'it' || process.env.SITE_LOCALE === 'en'
    ? process.env.SITE_LOCALE
    : PROJECT_HOST.startsWith('ita.') || PROJECT_HOST.includes('hanafigmasite-ita')
      ? 'it'
      : 'en';
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

  let written = 0;
  const unknown = [];
  const lastmod = {};
  const indexable = [];
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
      unknown.push(route);
      m = { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'website', robots: 'index, follow' };
    }

    const file = routeToFile(route);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, injectHead(shell, { ...m, path: route, locale: LOCALE }), 'utf8');
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
  return null;
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('✗ dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  console.log('▸ Prerender: collecting routes…');
  const { routes: blogRoutes, cache } = await getBlogDataOrFail();
  const staticRoutes =
    LOCALE === 'it' ? STATIC_ROUTES.filter((r) => !EN_ONLY_ROUTES.includes(r)) : STATIC_ROUTES;
  const routes = [...staticRoutes, ...blogRoutes];
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
  await writeHeadOnly(routes, shell, cache);

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
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      try {
        // Inject the Sanity data cache BEFORE any app code runs, so the SPA reads
        // it instead of making a CORS-blocked browser fetch to api.sanity.io.
        await page.evaluateOnNewDocument((data) => {
          window.__PRERENDER__ = data;
        }, cache);

        await page.goto(`${base}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });

        // Wait until the app has mounted real content and isn't on a loading
        // skeleton. With the injected cache, blog data resolves synchronously-ish.
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root');
            if (!root) return false;
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

        let html = await page.content();
        // Strip the dev/preview origin if it leaked into any absolute URLs.
        html = html.replaceAll(base, DOMAIN);
        // The rendered body supersedes the layer-1 skeleton (and preview's SPA
        // fallback means the skeleton in hand is the homepage's, not this route's).
        html = stripFallbackNoscript(html);

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
