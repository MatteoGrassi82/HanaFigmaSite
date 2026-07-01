/**
 * Post-build prerender (SPA snapshot).
 *
 * After `vite build`, this:
 *   1. Fetches all published blog slugs from Sanity.
 *   2. Builds the full route list (static marketing routes + blog posts).
 *   3. Serves the built `dist/` with `vite preview`.
 *   4. Loads each route in headless Chrome, waits for the SPA to render and the
 *      <SEO> component to inject its head tags, then writes the fully-rendered
 *      HTML to `dist/<route>/index.html`.
 *
 * Result: non-JS crawlers (AI answer engines + Googlebot fallback) receive real
 * per-route HTML with content, meta, and JSON-LD baked in — no app refactor.
 *
 * Run via:  npm run build   (build script chains this after `vite build`)
 */

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import puppeteer from 'puppeteer';
import { preview } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4178;

// Static marketing routes (must match the <Route> list in App.tsx).
const STATIC_ROUTES = [
  '/',
  '/access',
  '/case-studies',
  '/pricing',
  '/state-of-ai',
  '/research',
  '/about',
  '/contact',
  '/hana-contact',
  '/terms',
  '/aup',
  '/blog',
  '/whitepapers',
  '/whitepapers/adhd-intake',
  '/timeline',
];

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
    console.warn(`  ⚠ could not fetch blog data from Sanity (${err.message}); prerendering static routes only`);
    return { routes: [], cache: { posts: [], postBySlug: {} } };
  }
}

function routeToFile(route) {
  // "/"            -> dist/index.html
  // "/pricing"     -> dist/pricing/index.html
  // "/blog/x"      -> dist/blog/x/index.html
  if (route === '/') return join(DIST, 'index.html');
  return join(DIST, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('✗ dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  console.log('▸ Prerender: collecting routes…');
  const { routes: blogRoutes, cache } = await getBlogData();
  const routes = [...STATIC_ROUTES, ...blogRoutes];
  console.log(`▸ ${routes.length} routes to prerender.`);

  // Serve the built dist with vite preview (SPA fallback to index.html).
  const server = await preview({
    root: ROOT,
    preview: { port: PORT, strictPort: true },
    // appType spa => unknown paths fall back to index.html, which is what we want.
  });
  const base = `http://localhost:${PORT}`;

  // On Vercel (and other CI environments), Chromium may be at a custom path.
  // PUPPETEER_EXECUTABLE_PATH lets us override the bundled binary.
  // If Chrome isn't available, skip prerendering gracefully (SPA still works; only SEO baking is skipped).
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (launchErr) {
    console.warn(`▸ Prerender skipped: could not launch Chromium (${launchErr.message})`);
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
        html = html.replaceAll(base, 'https://www.hana.health');

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

  console.log(`▸ Prerender complete: ${ok} ok, ${failed} failed.`);
  if (ok === 0) process.exit(1);
}

main().catch((err) => {
  console.error('✗ Prerender crashed:', err);
  process.exit(1);
});
