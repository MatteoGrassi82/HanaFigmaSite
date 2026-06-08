/**
 * AEO sync + validate — part of the agentic AEO system (MVP).
 *
 * A self-contained audit (no external API) that keeps the site's machine-facing
 * surfaces honest and in sync. It:
 *   1. Validates every JSON-LD block in the prerendered `dist/` HTML (parses,
 *      checks @context/@type, flags empties).
 *   2. Cross-checks the live route set (static routes + Sanity blog slugs) against
 *      public/sitemap.xml — reports URLs missing from / stale in the sitemap.
 *   3. Cross-checks the "Key pages" links in public/llms.txt against real routes.
 *   4. With `--fix`, regenerates public/sitemap.xml from the true route set
 *      (preserving priorities for known pages) so it never drifts again.
 *
 * Usage:
 *   npm run aeo:sync          # report only
 *   npm run aeo:sync -- --fix # also rewrite sitemap.xml from the real route set
 *
 * Run it after a build (it reads dist/) for the JSON-LD checks; the sitemap/llms
 * checks work without a build (they query Sanity for slugs).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';
import { createClient } from '@sanity/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');
const DOMAIN = 'https://www.hana.health';
const FIX = process.argv.includes('--fix');

// Must mirror the <Route> list in src/app/App.tsx (excluding redirects + the
// catch-all 404). Keep priorities/changefreq for sitemap regeneration here.
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/case-studies', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/state-of-ai', priority: '0.8', changefreq: 'monthly' },
  { path: '/research', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/whitepapers', priority: '0.7', changefreq: 'monthly' },
  { path: '/whitepapers/adhd-intake', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/timeline', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/aup', priority: '0.3', changefreq: 'yearly' },
];

const sanity = createClient({
  projectId: '7dkhf6fw',
  dataset: 'production',
  apiVersion: '2026-05-12',
  useCdn: false,
});

const issues = [];
const note = (level, msg) => issues.push({ level, msg });

// ── 1. Validate JSON-LD across prerendered HTML ────────────────────────────────
async function validateJsonLd() {
  if (!existsSync(join(DIST, 'index.html'))) {
    note('warn', 'dist/ not found — skipping JSON-LD validation (run `npm run build` first).');
    return;
  }
  let files = [];
  for await (const f of glob('**/*.html', { cwd: DIST })) files.push(f);
  let checked = 0;
  let blocks = 0;
  for (const rel of files) {
    const html = await readFile(join(DIST, rel), 'utf8');
    const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
    let m;
    let pageHasLd = false;
    while ((m = re.exec(html))) {
      blocks++;
      pageHasLd = true;
      try {
        const obj = JSON.parse(m[1].trim());
        const arr = Array.isArray(obj) ? obj : [obj];
        for (const o of arr) {
          if (!o['@context']) note('error', `${rel}: JSON-LD missing @context`);
          if (!o['@type']) note('error', `${rel}: JSON-LD missing @type`);
        }
      } catch {
        note('error', `${rel}: invalid JSON-LD (failed to parse)`);
      }
    }
    if (!pageHasLd) note('warn', `${rel}: no JSON-LD structured data`);
    checked++;
  }
  note('info', `JSON-LD: checked ${checked} HTML files, ${blocks} structured-data blocks.`);
}

// ── 2 & 3. Sitemap + llms.txt vs the real route set ────────────────────────────
async function getRealRoutes() {
  let blog = [];
  try {
    const slugs = await sanity.fetch(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){ "s": slug.current, "u": _updatedAt }`
    );
    blog = (slugs || []).map((x) => ({ path: `/blog/${x.s}`, priority: '0.6', changefreq: 'monthly', lastmod: (x.u || '').slice(0, 10) }));
  } catch (err) {
    note('warn', `Could not fetch blog slugs from Sanity (${err.message}).`);
  }
  return [...STATIC_ROUTES, ...blog];
}

async function checkSitemap(routes) {
  const file = join(PUBLIC, 'sitemap.xml');
  const xml = existsSync(file) ? await readFile(file, 'utf8') : '';
  const inSitemap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, '') || DOMAIN));
  const realUrls = new Set(routes.map((r) => (DOMAIN + r.path).replace(/\/$/, '') || DOMAIN));

  for (const u of realUrls) if (!inSitemap.has(u)) note('error', `sitemap.xml missing route: ${u}`);
  for (const u of inSitemap) if (!realUrls.has(u) && u !== DOMAIN) note('warn', `sitemap.xml has stale URL (no matching route): ${u}`);
  note('info', `Sitemap: ${inSitemap.size} URLs listed, ${realUrls.size} real routes.`);
}

async function checkLlms(routes) {
  const file = join(PUBLIC, 'llms.txt');
  if (!existsSync(file)) { note('warn', 'llms.txt not found.'); return; }
  const txt = await readFile(file, 'utf8');
  const linked = new Set([...txt.matchAll(/https:\/\/www\.hana\.health(\/[\w\-/]*)?/g)].map((m) => (m[1] || '/').replace(/\/$/, '') || '/'));
  // Only flag key STATIC pages missing from llms.txt (blog posts aren't expected individually).
  const keyPages = ['/', '/case-studies', '/pricing', '/research', '/state-of-ai', '/blog', '/contact', '/whitepapers', '/whitepapers/adhd-intake'];
  for (const p of keyPages) {
    const norm = p.replace(/\/$/, '') || '/';
    if (!linked.has(norm)) note('warn', `llms.txt does not link key page: ${DOMAIN}${p}`);
  }
  note('info', `llms.txt: links ${linked.size} hana.health URLs.`);
}

// ── 4. Regenerate sitemap from the real route set ──────────────────────────────
function buildSitemap(routes, today) {
  const url = (r) => {
    const loc = (DOMAIN + r.path).replace(/([^:])\/$/, '$1') + (r.path === '/' ? '/' : '');
    const lastmod = r.lastmod || today;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(url).join('\n')}\n</urlset>\n`;
}

async function main() {
  console.log('▸ AEO sync + validate\n');
  const routes = await getRealRoutes();
  await validateJsonLd();
  await checkSitemap(routes);
  await checkLlms(routes);

  if (FIX) {
    // Use a fixed date string passed via env (avoids nondeterminism); fall back to
    // the newest blog lastmod or a placeholder the human can review.
    const today = process.env.SITEMAP_DATE
      || routes.map((r) => r.lastmod).filter(Boolean).sort().pop()
      || 'REVIEW-DATE';
    const xml = buildSitemap(routes, today);
    await writeFile(join(PUBLIC, 'sitemap.xml'), xml, 'utf8');
    note('info', `--fix: rewrote sitemap.xml with ${routes.length} URLs (lastmod ${today}; set SITEMAP_DATE to override).`);
  }

  console.log('\n── Report ──');
  const order = { error: 0, warn: 1, info: 2 };
  issues.sort((a, b) => order[a.level] - order[b.level]);
  const counts = { error: 0, warn: 0, info: 0 };
  for (const it of issues) {
    counts[it.level]++;
    const tag = it.level === 'error' ? '✗ ERROR' : it.level === 'warn' ? '⚠ WARN ' : 'ℹ INFO ';
    console.log(`${tag}  ${it.msg}`);
  }
  console.log(`\n${counts.error} errors, ${counts.warn} warnings.`);
  if (!FIX && (counts.error > 0 || counts.warn > 0)) {
    console.log('Run with --fix to regenerate sitemap.xml from the real route set.');
  }
  process.exitCode = counts.error > 0 ? 1 : 0;
}

main().catch((e) => { console.error('✗ aeo:sync crashed:', e); process.exit(1); });
