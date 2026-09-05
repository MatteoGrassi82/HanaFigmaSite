/**
 * Live SEO smoke test — fetches the deployed site and asserts the things that
 * were silently broken for weeks.
 *
 * WHY THIS EXISTS
 * The site shipped every one of its 96 URLs as the same 4.9 KB shell — homepage
 * title, homepage canonical, no body copy — because the prerender step failed
 * and returned success. Nothing checked, so nothing complained. Buying an SEO
 * API would not have caught it either: the failure was in our own build, and by
 * the time it shows up in Search Console as "Duplicate, Google chose a different
 * canonical" you have already lost the crawl budget.
 *
 * So: after a deploy, read the live sitemap and verify every URL actually serves
 * a rendered page with its own title and its own canonical.
 *
 * Usage:
 *   npm run seo:check                              # www.hana.health
 *   npm run seo:check -- https://ita.hana.health   # the Italian project
 *
 * Exits non-zero on any failure, so it can gate a deploy or run on a schedule.
 */

const BASE = (process.argv[2] || 'https://www.hana.health').replace(/\/$/, '');
const CONCURRENCY = 8;

// A prerendered page is 170 KB+; the broken shell was 4,941 bytes. Anything
// under this threshold means the render did not happen for that route.
const MIN_RENDERED_BYTES = 20_000;

const strip = (u) => u.replace(/\/$/, '') || '/';

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { status: res.status, html: await res.text() };
}

function extract(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null;
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? '';
  return { title, canonical, robots };
}

async function checkUrl(url) {
  const problems = [];
  let title = null;
  try {
    const { status, html } = await fetchText(url);
    if (status !== 200) problems.push(`HTTP ${status}`);

    const meta = extract(html);
    title = meta.title;

    if (!meta.title) problems.push('no <title>');
    if (!meta.canonical) problems.push('no canonical');
    else if (strip(meta.canonical) !== strip(url)) {
      problems.push(`canonical points elsewhere (${meta.canonical})`);
    }
    if (/noindex/i.test(meta.robots)) problems.push('robots: noindex');
    if (html.length < MIN_RENDERED_BYTES) {
      problems.push(`only ${html.length} bytes — looks like an unrendered shell`);
    }
  } catch (err) {
    problems.push(`fetch failed: ${err.message}`);
  }
  return { url, title, problems };
}

/** Run tasks with a fixed concurrency cap. */
async function pool(items, worker, limit) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) results.push(await worker(items[i++]));
    })
  );
  return results;
}

/**
 * Assert that unknown paths really 404, and that the routes which must stay
 * reachable still do.
 *
 * The catch-all rewrite used to answer every unknown path with HTTP 200 and the
 * whole prerendered homepage, so /demo, /blog/deleted-post and every typo looked
 * to Google like a duplicate of "/". That is fixed by routing unmatched paths to
 * api/not-found.ts. The risk of the fix is the mirror image — a real page that
 * nobody remembered to prerender now 404s — so check both directions.
 */
async function checkNotFound() {
  const problems = [];

  const shouldFail = [
    '/this-page-does-not-exist-seocheck',
    '/blog/this-post-does-not-exist-seocheck',
    '/a/b/c/nope-seocheck',
  ];
  const shouldWork = ['/', '/pricing', '/blog', '/hana-remote', '/demo', '/preview'];
  const shouldRedirect = [
    ['/research', '/labs'],
    ['/use-cases', '/case-studies'],
  ];

  for (const path of shouldFail) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
      if (res.status !== 404) {
        problems.push(
          `${path} returned HTTP ${res.status}, expected 404. If it is 200, the ` +
          'vercel.json catch-all is serving the SPA shell again and every unknown ' +
          'URL is a homepage duplicate.'
        );
      }
    } catch (err) {
      problems.push(`${path}: fetch failed: ${err.message}`);
    }
  }

  for (const path of shouldWork) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
      if (res.status !== 200) {
        problems.push(
          `${path} returned HTTP ${res.status}, expected 200. A real route lost its ` +
          'prerendered file — add it to STATIC_ROUTES or NOINDEX_ROUTES in scripts/lib/route-seo.mjs.'
        );
      }
    } catch (err) {
      problems.push(`${path}: fetch failed: ${err.message}`);
    }
  }

  for (const [path, target] of shouldRedirect) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
      const loc = res.headers.get('location') ?? '';
      if (res.status !== 301 && res.status !== 308) {
        problems.push(`${path} returned HTTP ${res.status}, expected a permanent redirect.`);
      } else if (!loc.endsWith(target)) {
        problems.push(`${path} redirects to "${loc}", expected ${target}.`);
      }
    } catch (err) {
      problems.push(`${path}: fetch failed: ${err.message}`);
    }
  }

  return problems;
}

async function main() {
  console.log(`▸ SEO check: ${BASE}\n`);

  const sitemapUrl = `${BASE}/sitemap.xml`;
  let urls;
  try {
    const { status, html } = await fetchText(sitemapUrl);
    if (status !== 200) {
      console.error(`✗ ${sitemapUrl} returned HTTP ${status}. Nothing to check.`);
      process.exit(1);
    }
    urls = [...html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (err) {
    console.error(`✗ could not fetch ${sitemapUrl}: ${err.message}`);
    process.exit(1);
  }

  if (!urls.length) {
    console.error('✗ sitemap contains no URLs.');
    process.exit(1);
  }
  console.log(`  ${urls.length} URLs in the sitemap\n`);

  const results = await pool(urls, checkUrl, CONCURRENCY);

  // Duplicate titles are the signature of the shell bug: every route serving the
  // homepage's <title>. One repeated title across many URLs is the smoking gun.
  const byTitle = new Map();
  for (const r of results) {
    if (!r.title) continue;
    byTitle.set(r.title, [...(byTitle.get(r.title) ?? []), r.url]);
  }
  const duplicates = [...byTitle.entries()].filter(([, list]) => list.length > 1);

  const failed = results.filter((r) => r.problems.length);
  for (const r of failed) {
    console.log(`✗ ${r.url}`);
    for (const p of r.problems) console.log(`    ${p}`);
  }
  for (const [title, list] of duplicates) {
    console.log(`✗ ${list.length} URLs share the title "${title.slice(0, 60)}"`);
    list.slice(0, 5).forEach((u) => console.log(`    ${u}`));
    if (list.length > 5) console.log(`    … and ${list.length - 5} more`);
  }

  const notFoundProblems = await checkNotFound();
  for (const p of notFoundProblems) console.log(`✗ ${p}`);

  const ok = results.length - failed.length;
  console.log(`\n▸ ${ok}/${results.length} URLs pass; ${duplicates.length} duplicate-title group(s).`);
  console.log(
    notFoundProblems.length
      ? `▸ 404 handling: ${notFoundProblems.length} problem(s).`
      : '▸ 404 handling: unknown paths 404, real routes 200, legacy paths 301.'
  );

  if (failed.length || duplicates.length || notFoundProblems.length) {
    console.log('  A page under the byte threshold with the homepage canonical means the');
    console.log('  prerender step failed — check the build log for "Full prerender SKIPPED".');
    process.exit(1);
  }
  console.log('  Every URL renders, with its own title and its own canonical.');
}

main().catch((err) => {
  console.error(`✗ seo:check crashed: ${err.message}`);
  process.exit(1);
});
