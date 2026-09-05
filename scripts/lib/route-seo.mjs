/**
 * Route SEO — the browser-free half of the prerender pipeline.
 *
 * WHY THIS EXISTS
 * The site is a client-rendered SPA whose per-route <title>/description/canonical
 * are injected by <SEO> at runtime. `scripts/prerender.mjs` bakes those into static
 * HTML with headless Chrome — but when Chrome can't launch in CI, that step used to
 * skip silently and *every* route shipped as the same 4.9 KB shell: homepage title,
 * homepage canonical, zero body text. Google read all 90+ URLs as duplicates of the
 * homepage, and answer engines had nothing to cite.
 *
 * So the head is now injected deterministically, with no browser involved:
 *   1. collectRouteMeta() reads the <SEO … /> props straight out of the page
 *      sources — the same single source of truth the runtime component uses.
 *   2. injectHead() rewrites the built shell's <head> for one route.
 * prerender.mjs runs this for every route first, then upgrades whatever it can with
 * a real rendered snapshot. Worst case the route still has a correct canonical,
 * unique title/description, and crawlable links — never a duplicate of the homepage.
 *
 * Keep the title/description defaults below in sync with src/app/components/SEO.tsx.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const SITE_NAME = 'Hana Voice AI';
export const EN_DOMAIN = 'https://www.hana.health';
export const IT_DOMAIN = 'https://ita.hana.health';

export const DEFAULT_TITLE = 'Hana Voice AI | Intelligent Patient Engagement';
export const DEFAULT_DESCRIPTION =
  "Automate patient intake, monitoring, and care coordination with Hana's clinical Voice AI. Engage patients naturally, improve outcomes, and reduce administrative burden.";

/**
 * The static marketing routes, in one place.
 *
 * Must match the <Route> list in src/app/App.tsx. This lived in two scripts with
 * different contents, which is how the sitemap ended up advertising /research
 * (a redirect) while omitting /access, /hana-remote, /hana-sleep/*, /privacy and
 * /cookies. Both scripts import this now.
 */
export const STATIC_ROUTES = [
  '/',
  '/access',
  '/case-studies',
  '/pricing',
  '/state-of-ai',
  '/labs',
  '/about',
  '/contact',
  '/hana-contact',
  '/hana-remote',
  '/hana-sleep',
  '/hana-sleep/analysis',
  '/hana-sleep/cpap',
  '/terms',
  '/aup',
  '/privacy',
  '/cookies',
  '/blog',
  '/whitepapers',
  '/whitepapers/adhd-intake',
  '/timeline',
];

// Routes App.tsx renders only when !isItalian — on ita.hana.health these fall
// through to <NotFound>, so they must not be prerendered or listed in its sitemap.
export const EN_ONLY_ROUTES = ['/access', '/case-studies', '/state-of-ai', '/use-cases'];

/**
 * Real app routes that must answer 200 but must never be indexed.
 *
 * These are internal preview/sandbox pages (see the docblock at the top of each
 * page component). They were never prerendered, so until now the vercel.json
 * catch-all answered them with the full prerendered homepage — 200, homepage
 * <title>, `canonical=https://www.hana.health/` — i.e. four more homepage
 * duplicates for Google. Now that unknown paths return a real 404 (api/not-found.ts)
 * they must be prerendered, or they would start 404ing instead.
 *
 * They get `robots: noindex, nofollow`, which also keeps them out of sitemap.xml
 * (writeHeadOnly only sitemaps routes whose robots lack "noindex").
 *
 * /preview already asks for this itself via <SEO robots="noindex, nofollow">;
 * /demo, /bento and /proof have no <SEO> block at all, so prerender.mjs forces it.
 *
 * NOT included, deliberately: /test-webhook. It fires a Supabase → Zapier test
 * webhook on mount (src/app/components/TestWebhook.tsx), so a public 200 lets
 * anyone inject test leads by loading the URL. Leaving it out of every route list
 * means it now 404s in production while still working in `npm run dev`.
 */
// /remote-v2 is the in-progress rebuild of /hana-remote (src/app/pages/RemoteV2.tsx)
// — remove it from here and from App.tsx when it replaces the live page.
export const NOINDEX_ROUTES = [
  '/demo', '/preview', '/bento', '/proof', '/remote-v2', '/remote-lab',
  // The reference programme page. Live at its real URL for review, deliberately
  // not indexed: it renders five open billing questions on the page, and those
  // are answered before it moves to STATIC_ROUTES. Moving it is the publish step.
  '/programs/chronic-care-management',
  '/programs/advanced-primary-care-management',
  '/programs/behavioral-health-integration',
  '/programs/remote-therapeutic-monitoring',
];

/**
 * Paths handled by a real server-side 301 in vercel.json.
 *
 * App.tsx also declares these as client-side <Navigate>, which only ever runs for
 * in-app navigation — a crawler hitting /use-cases directly got the homepage at
 * 200, not a redirect. Listed here so the App.tsx coverage check below knows they
 * are accounted for rather than missing.
 */
export const REDIRECT_ROUTES = ['/research', '/use-cases'];

/**
 * Routes that exist in App.tsx for local development but must NOT be reachable in
 * production. They are deliberately left out of every prerender list, so the
 * vercel.json catch-all sends them to api/not-found.ts and they answer 404.
 *
 * /test-webhook fires a Supabase → Zapier test webhook from a useEffect on mount
 * (src/app/components/TestWebhook.tsx), so while it answered 200 in production
 * anyone who loaded the URL — or any crawler that executes JS — injected a test
 * lead. `npm run dev` still serves it, which is the only place it is useful.
 */
export const DEV_ONLY_ROUTES = ['/test-webhook'];

// Links surfaced in the <noscript> block so a non-JS crawler can still reach the
// rest of the site from any page it lands on.
export const NAV_LINKS = [
  ['/', 'Home'],
  ['/hana-remote', 'HANA Remote — engagement layer for remote care'],
  ['/hana-contact', 'HANA Contact — front desk'],
  ['/hana-sleep', 'HANA Sleep'],
  ['/access', 'CMS ACCESS program'],
  ['/pricing', 'Pricing'],
  ['/case-studies', 'Case studies'],
  ['/blog', 'Blog'],
  ['/whitepapers', 'Whitepapers'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

// ── A very small JS/TSX literal reader ───────────────────────────────────────
// Enough to resolve the handful of shapes the <SEO> props actually use:
//   title="literal"
//   title={it ? "Italian" : "English"}          → the English branch
//   title={t.pricing.seoTitle}                  → src/lib/i18n.ts `const en`
//   title={COPY.seoTitle} where COPY = getLocale() === "it" ? COPY_IT : COPY_EN
// Anything it can't resolve returns null and the caller falls back to defaults.

/** Index just past the string literal starting at `i`. */
function skipString(src, i) {
  const quote = src[i];
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === '\\') j += 2;
    else if (src[j] === quote) return j + 1;
    else j++;
  }
  return j;
}

/** Body of the object literal whose opening brace is at `open`. */
function objectBodyAt(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') { i = skipString(src, i) - 1; continue; }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i); i = e < 0 ? src.length : e + 1; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(open + 1, i); }
  }
  return null;
}

/** Top-level `key: rawValue` pairs of an object-literal body. */
function entriesOf(body) {
  const out = {};
  let i = 0;
  const n = body.length;
  while (i < n) {
    while (i < n && /[\s,;]/.test(body[i])) i++;
    if (i >= n) break;
    if (body[i] === '/' && body[i + 1] === '/') { const e = body.indexOf('\n', i); i = e < 0 ? n : e + 1; continue; }
    if (body[i] === '/' && body[i + 1] === '*') { const e = body.indexOf('*/', i); i = e < 0 ? n : e + 2; continue; }

    let key;
    if (body[i] === '"' || body[i] === "'") {
      const end = skipString(body, i);
      key = body.slice(i + 1, end - 1);
      i = end;
    } else {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(body[j])) j++;
      if (j === i) { i++; continue; }
      key = body.slice(i, j);
      i = j;
    }
    while (i < n && /\s/.test(body[i])) i++;
    if (body[i] !== ':') continue;
    i++;

    const start = i;
    let depth = 0;
    while (i < n) {
      const c = body[i];
      if (c === '"' || c === "'" || c === '`') { i = skipString(body, i); continue; }
      if (c === '/' && body[i + 1] === '/') { const e = body.indexOf('\n', i); i = e < 0 ? n : e; continue; }
      if (c === '/' && body[i + 1] === '*') { const e = body.indexOf('*/', i); i = e < 0 ? n : e + 2; continue; }
      if ('{[('.includes(c)) depth++;
      else if ('}])'.includes(c)) depth--;
      else if (c === ',' && depth === 0) break;
      i++;
    }
    out[key] = body.slice(start, i).trim();
    i++;
  }
  return out;
}

/** Split `cond ? a : b` at the top level. Returns null when it isn't a ternary. */
function splitTernary(expr) {
  let depth = 0;
  let q = -1;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '"' || c === "'" || c === '`') { i = skipString(expr, i) - 1; continue; }
    if ('{[('.includes(c)) depth++;
    else if ('}])'.includes(c)) depth--;
    else if (c === '?' && depth === 0 && expr[i + 1] !== '.' && expr[i + 1] !== '?') { q = i; break; }
  }
  if (q < 0) return null;
  depth = 0;
  for (let i = q + 1; i < expr.length; i++) {
    const c = expr[i];
    if (c === '"' || c === "'" || c === '`') { i = skipString(expr, i) - 1; continue; }
    if ('{[('.includes(c)) depth++;
    else if ('}])'.includes(c)) depth--;
    else if (c === ':' && depth === 0) {
      return { cond: expr.slice(0, q).trim(), then: expr.slice(q + 1, i).trim(), else: expr.slice(i + 1).trim() };
    }
  }
  return null;
}

function parseStringLiteral(expr) {
  const t = expr.trim();
  if (!/^["']/.test(t)) return null;
  const end = skipString(t, 0);
  if (end < t.length) return null; // concatenation / trailing tokens — not a plain literal
  return t
    .slice(1, -1)
    .replace(/\\(["'\\])/g, '$1')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when the condition selects the Italian locale. */
function isItalianCondition(cond) {
  return /^(it|IT|isItalian|isIt)$/.test(cond) || /getLocale\(\)\s*===?\s*["']it["']/.test(cond);
}

/**
 * Resolve one <SEO> prop expression to an English string.
 * `ctx` = { fileSrc, i18nEn } where i18nEn is the parsed English translations object.
 */
function resolveExpr(expr, ctx, depth = 0) {
  if (!expr || depth > 6) return null;
  const t = expr.trim().replace(/^\{|\}$/g, '').trim();

  const literal = parseStringLiteral(t);
  if (literal !== null) return literal;

  const ternary = splitTernary(t);
  if (ternary) {
    // `it ? "Italiano" : "English"` — take the branch for the locale being built,
    // and fall back to the other branch if that one doesn't resolve.
    const wantItalian = ctx.locale === 'it';
    const italianBranch = isItalianCondition(ternary.cond) ? ternary.then : ternary.else;
    const englishBranch = isItalianCondition(ternary.cond) ? ternary.else : ternary.then;
    const first = wantItalian ? italianBranch : englishBranch;
    const second = wantItalian ? englishBranch : italianBranch;
    return resolveExpr(first, ctx, depth + 1) ?? resolveExpr(second, ctx, depth + 1);
  }

  const member = t.match(/^([A-Za-z_$][\w$]*)((?:\.[A-Za-z_$][\w$]*)+)$/);
  if (member) {
    const [, root, rest] = member;
    const path = rest.slice(1).split('.');
    // `t.x.y` → the shared i18n dictionary.
    if (root === 't' && ctx.i18nEn) return getIn(ctx.i18nEn, path, ctx, depth);
    // A literal object declared in the page itself, e.g. `const COPY_EN = { … }`.
    if (ctx.locals?.[root]) return getIn(ctx.locals[root], path, ctx, depth);
    // Otherwise a local alias: `const ab = t.about;` / `const COPY = … ? … : COPY_EN;`
    const aliased = resolveIdentifier(root, ctx, depth);
    if (aliased) return resolveExpr(`${aliased}.${path.join('.')}`, ctx, depth + 1);
  }

  return null;
}

/** Read a top-level `const NAME = <expr>;` out of the page source. */
function resolveIdentifier(name, ctx, depth) {
  const m = ctx.fileSrc.match(new RegExp(`\\bconst\\s+${name}\\s*(?::[^=]+)?=\\s*([^;\\n]+)`));
  if (!m) return null;
  const expr = m[1].trim();
  const ternary = splitTernary(expr);
  if (ternary) {
    // e.g. `const COPY = getLocale() === "it" ? COPY_IT : COPY_EN;`
    const italianBranch = isItalianCondition(ternary.cond) ? ternary.then : ternary.else;
    const englishBranch = isItalianCondition(ternary.cond) ? ternary.else : ternary.then;
    return ctx.locale === 'it' ? italianBranch : englishBranch;
  }
  return /^[A-Za-z_$][\w$.]*$/.test(expr) ? expr : null;
}

/** Walk `path` through an entries-map, descending into nested object literals. */
function getIn(entries, path, ctx, depth) {
  let cur = entries;
  for (let i = 0; i < path.length; i++) {
    const raw = cur?.[path[i]];
    if (raw === undefined) return null;
    if (i === path.length - 1) return resolveExpr(raw, ctx, depth + 1);
    const open = raw.indexOf('{');
    if (open < 0) return null;
    cur = entriesOf(objectBodyAt(raw, open) ?? '');
  }
  return null;
}

/** Parse one locale's half of src/lib/i18n.ts into an entries-map. */
function loadI18n(srcRoot, locale) {
  try {
    const file = join(srcRoot, '..', 'lib', 'i18n.ts');
    const src = readFileSync(file, 'utf8');
    const at = src.search(new RegExp(`\\bconst\\s+${locale}\\s*:\\s*Translations\\s*=\\s*\\{`));
    if (at < 0) return null;
    return entriesOf(objectBodyAt(src, src.indexOf('{', at)) ?? '');
  } catch {
    return null;
  }
}

/** Local object literals in the page itself, e.g. `const COPY_EN: Copy = { … }`. */
function localObjects(fileSrc) {
  const out = {};
  const re = /\bconst\s+([A-Za-z_$][\w$]*)\s*(?::\s*[\w<>[\]\s.]+)?=\s*\{/g;
  let m;
  while ((m = re.exec(fileSrc))) {
    const body = objectBodyAt(fileSrc, fileSrc.indexOf('{', m.index + m[0].length - 1));
    if (body) out[m[1]] = entriesOf(body);
  }
  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/**
 * Pull a string-literal JSX prop: `name="value"` or `name={"value"}`.
 * Returns null for anything dynamic (template literals, expressions) — those can
 * only be resolved by actually rendering, which is the browser path's job.
 */
function strProp(body, name) {
  const m =
    body.match(new RegExp(`\\b${name}=\\{?"((?:[^"\\\\]|\\\\.)*)"\\}?`)) ||
    body.match(new RegExp(`\\b${name}=\\{?'((?:[^'\\\\]|\\\\.)*)'\\}?`));
  if (!m) return null;
  return m[1]
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, ' ')
    .trim();
}

/** The raw expression inside a `name={ … }` JSX prop, brace-balanced. */
function exprProp(body, name) {
  const m = new RegExp(`\\b${name}=\\{`).exec(body);
  if (!m) return null;
  return objectBodyAt(body, m.index + m[0].length - 1);
}

function boolProp(body, name) {
  // `useExactTitle` (bare) or `useExactTitle={true}`
  return new RegExp(`\\b${name}(\\s|=\\{true\\}|/|>)`).test(body);
}

/** Mirrors the brand-suffix rule in src/app/components/SEO.tsx. */
export function fullTitle(title, useExactTitle) {
  if (!title) return DEFAULT_TITLE;
  if (useExactTitle || /\bHana\b/i.test(title)) return title;
  return `${title} | ${SITE_NAME}`;
}

/**
 * Scan the app sources for every `<SEO … path="/x" />` usage and return a map of
 * route path → { title, description, type, robots }.
 */
export function collectRouteMeta(srcDir, locale = 'en') {
  const i18nEn = loadI18n(srcDir, locale);
  const meta = {};
  for (const file of walk(srcDir)) {
    const src = readFileSync(file, 'utf8');
    const ctx = { fileSrc: src, i18nEn, locale, locals: localObjects(src) };
    const re = /<SEO\b([\s\S]*?)\/>/g;
    let m;
    while ((m = re.exec(src))) {
      const body = m[1];
      const path = strProp(body, 'path');
      if (!path || !path.startsWith('/')) continue; // dynamic (blog posts) — handled by caller

      const prop = (name) => {
        const literal = strProp(body, name);
        if (literal !== null) return literal;
        return resolveExpr(exprProp(body, name), ctx);
      };

      const title = prop('title');
      meta[path] = {
        title: fullTitle(title, boolProp(body, 'useExactTitle')),
        description: prop('description') || DEFAULT_DESCRIPTION,
        type: prop('type') || 'website',
        robots: prop('robots') || 'index, follow',
        resolved: Boolean(title),
        source: file,
      };
    }
  }
  return meta;
}

/**
 * Build sitemap.xml from the same route list the prerender walks.
 *
 * The hand-maintained public/sitemap.xml had drifted to 43 URLs against 96 real
 * pages — /access, /privacy, /cookies, both /hana-sleep sub-pages and 52 blog
 * posts were missing, and every entry carried the same frozen lastmod. Generating
 * it from the build makes drift impossible.
 *
 * `changefreq`/`priority` are deliberately omitted: Google ignores both.
 *
 * @param {string[]} routes
 * @param {object}   opts   { locale, lastmod: { [route]: ISO date } }
 */
export function buildSitemap(routes, { locale = 'en', lastmod = {} } = {}) {
  const domain = locale === 'it' ? IT_DOMAIN : EN_DOMAIN;
  const entries = routes
    .map((route) => {
      const when = lastmod[route];
      const date = when ? String(when).slice(0, 10) : null;
      return [
        '  <url>',
        `    <loc>${esc(`${domain}${route === '/' ? '/' : route}`)}</loc>`,
        date ? `    <lastmod>${date}</lastmod>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/**
 * Remove the layer-1 <noscript> skeleton from a rendered snapshot.
 *
 * `vite preview` falls back to dist/index.html for extensionless paths, so the
 * page Chrome renders carries the *homepage's* fallback block. Left in, a non-JS
 * crawler would read the homepage <h1> at the top of every route on top of the
 * real rendered content. The GTM <noscript> iframe is untouched.
 */
export function stripFallbackNoscript(html) {
  // Chrome re-serializes the bare attribute as data-prerender-fallback="".
  return html.replace(/<noscript[^>]*\bdata-prerender-fallback\b[^>]*>[\s\S]*?<\/noscript>\s*/gi, '');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Replace a <meta name|property="key"> content, or append the tag if absent. */
function setMetaTag(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${esc(value)}$2`);
  return html.replace(
    '</head>',
    `  <meta ${attr}="${key}" content="${esc(value)}" />\n  </head>`
  );
}

/**
 * Bake one route's metadata into the built SPA shell.
 *
 * @param {string} shell  contents of dist/index.html
 * @param {object} m      { path, title, description, type, robots, image, locale }
 */
export function injectHead(shell, m) {
  // The Italian site is a second Vercel project deploying this same repo, so the
  // canonical must follow the build's locale — baking www.hana.health onto
  // ita.hana.health would tell Google the Italian site is a duplicate.
  const locale = m.locale === 'it' ? 'it' : 'en';
  const domain = locale === 'it' ? IT_DOMAIN : EN_DOMAIN;
  const canonical = `${domain}${m.path === '/' ? '/' : m.path}`;
  let html = shell.replace(/<html\s+lang="[^"]*"/i, `<html lang="${locale}"`);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(m.title)}</title>`);
  html = setMetaTag(html, 'name', 'description', m.description);
  html = setMetaTag(html, 'name', 'robots', m.robots || 'index, follow');
  html = setMetaTag(html, 'property', 'og:title', m.title);
  html = setMetaTag(html, 'property', 'og:description', m.description);
  html = setMetaTag(html, 'property', 'og:url', canonical);
  html = setMetaTag(html, 'property', 'og:type', m.type || 'website');
  html = setMetaTag(html, 'name', 'twitter:title', m.title);
  html = setMetaTag(html, 'name', 'twitter:description', m.description);
  if (m.image) {
    html = setMetaTag(html, 'property', 'og:image', m.image);
    html = setMetaTag(html, 'name', 'twitter:image', m.image);
  }

  // Canonical — the bug that told Google every URL was a copy of the homepage.
  const canonicalTag = `<link rel="canonical" href="${esc(canonical)}" />`;
  html = /<link\s+rel="canonical"[^>]*>/i.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag)
    : html.replace('</head>', `  ${canonicalTag}\n  </head>`);

  // hreflang pair (en ↔ it), matching what <SEO> sets at runtime.
  //
  // Only for routes that actually exist in BOTH locales. EN_ONLY_ROUTES are
  // filtered out of the Italian build (see prerender.mjs), so emitting
  // hreflang="it" for /access, /case-studies and /state-of-ai pointed Google at
  // three ita.hana.health URLs that do not exist — an unreciprocated hreflang,
  // which Google discards and which fed the "alternate page"/duplicate buckets.
  // NOINDEX_ROUTES are internal previews with no translated counterpart either.
  html = html.replace(/\s*<link\s+rel="alternate"[^>]*>/gi, '');
  if (!EN_ONLY_ROUTES.includes(m.path) && !NOINDEX_ROUTES.includes(m.path)) {
    const alternates = [
      ['en', `${EN_DOMAIN}${m.path}`],
      ['it', `${IT_DOMAIN}${m.path}`],
      ['x-default', `${EN_DOMAIN}${m.path}`],
    ]
      .map(([lang, href]) => `  <link rel="alternate" hreflang="${lang}" href="${esc(href)}" />`)
      .join('\n');
    html = html.replace('</head>', `${alternates}\n  </head>`);
  }

  // A crawlable skeleton for the no-JS case. Overwritten wholesale when the
  // headless-Chrome snapshot succeeds; this is the floor, not the goal.
  const nav = NAV_LINKS.filter(([href]) => href !== m.path)
    .map(([href, label]) => `      <li><a href="${href}">${esc(label)}</a></li>`)
    .join('\n');
  const noscript = `<noscript data-prerender-fallback>
    <h1>${esc(m.title)}</h1>
    <p>${esc(m.description)}</p>
    <nav aria-label="Hana Health">
      <ul>
${nav}
      </ul>
    </nav>
  </noscript>`;
  html = html.replace('<div id="root"></div>', `${noscript}\n      <div id="root"></div>`);

  return html;
}

/**
 * Last line of defence over a layer-2 (headless Chrome) snapshot.
 *
 * Layer 2 captures whatever the running app put in <head>. A page that renders no
 * <SEO> block puts nothing there — and because `vite preview` answers unknown
 * paths with dist/index.html, the snapshot then carries the HOMEPAGE's canonical
 * and robots. That is how /demo, /bento and /proof ended up claiming
 * `canonical=https://www.hana.health/` with `index, follow`: silently, and only
 * for the pages that happened to lack an <SEO> block.
 *
 * So don't trust the snapshot. Assert the three tags that decide indexing, and
 * repair them from the route's own metadata when they disagree.
 *
 * @returns {{ html: string, fixed: string[] }} fixed is empty when the snapshot was right.
 */
export function verifyAndFixHead(html, m) {
  const locale = m.locale === 'it' ? 'it' : 'en';
  const domain = locale === 'it' ? IT_DOMAIN : EN_DOMAIN;
  const expectedCanonical = `${domain}${m.path === '/' ? '/' : m.path}`;
  const expectedRobots = m.robots || 'index, follow';
  const fixed = [];

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null;
  if (canonical !== expectedCanonical) {
    fixed.push(`canonical ${canonical ?? '(missing)'} → ${expectedCanonical}`);
    const tag = `<link rel="canonical" href="${esc(expectedCanonical)}" />`;
    html = /<link[^>]+rel="canonical"[^>]*>/i.test(html)
      ? html.replace(/<link[^>]+rel="canonical"[^>]*>/i, tag)
      : html.replace('</head>', `  ${tag}\n  </head>`);
  }

  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? null;
  if (robots !== expectedRobots) {
    fixed.push(`robots ${robots ?? '(missing)'} → ${expectedRobots}`);
    html = setMetaTag(html, 'name', 'robots', expectedRobots);
  }

  // Titles are deliberately NOT forced to match layer 1. A page's runtime <SEO>
  // may legitimately word its title differently — every blog post renders
  // "… | Hana Health" while fullTitle() here computes "… | Hana Voice AI" — and
  // overwriting the rendered one would silently retitle the whole blog.
  //
  // The failure that actually matters is a page inheriting the HOMEPAGE's title,
  // which is what a missing <SEO> block produces. Check only for that.
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const looksInherited = m.path !== '/' && m.homeTitle && title === m.homeTitle;
  if (m.title && (!title || looksInherited)) {
    fixed.push(`title "${title ?? '(missing)'}" → "${m.title}"`);
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(m.title)}</title>`);
  }

  return { html, fixed };
}

/**
 * Every literal `<Route path="…">` declared in App.tsx.
 *
 * Dynamic segments (`/blog/:slug`) and the catch-all (`*`) are dropped — they are
 * not prerenderable as literals and are handled separately.
 */
export function collectAppRoutes(appTsxPath) {
  const src = readFileSync(appTsxPath, 'utf8');
  const out = new Set();
  const re = /<Route\s+[^>]*path="([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    const p = m[1];
    if (p === '*' || p.includes(':')) continue;
    out.add(p);
  }
  return [...out];
}

/**
 * Fail the build when App.tsx and the route lists here drift apart.
 *
 * This matters much more than it used to. Unknown paths used to be answered with
 * the homepage at HTTP 200, so forgetting to add a route here was invisible —
 * merely bad for SEO. Now vercel.json rewrites anything without a prerendered file
 * to api/not-found.ts, so the same omission makes a real, working page return 404
 * in production while continuing to work perfectly in `npm run dev`. That is
 * exactly the class of bug nobody notices until Search Console does.
 *
 * Returns a list of human-readable problems; empty means the lists agree.
 */
export function checkRouteCoverage(appTsxPath) {
  const declared = collectAppRoutes(appTsxPath);
  const accounted = new Set([
    ...STATIC_ROUTES,
    ...NOINDEX_ROUTES,
    ...REDIRECT_ROUTES,
    ...DEV_ONLY_ROUTES,
  ]);
  const problems = [];

  for (const route of declared) {
    if (!accounted.has(route)) {
      problems.push(
        `App.tsx declares <Route path="${route}"> but it is in neither STATIC_ROUTES, ` +
        'NOINDEX_ROUTES nor REDIRECT_ROUTES in scripts/lib/route-seo.mjs. It would be ' +
        'served a 404 in production. Add it to one of them.'
      );
    }
  }

  const declaredSet = new Set(declared);
  for (const route of [...STATIC_ROUTES, ...NOINDEX_ROUTES]) {
    if (!declaredSet.has(route)) {
      problems.push(
        `route-seo.mjs prerenders "${route}" but App.tsx has no <Route path="${route}">. ` +
        'It would render as <NotFound> inside a page Google is told to index.'
      );
    }
  }

  // EN_ONLY_ROUTES is duplicated as EN_ONLY_PATHS in src/app/components/SEO.tsx —
  // that file runs in the browser and cannot import this one (node:fs). The two
  // decide hreflang for the prerendered head and the rendered head respectively,
  // so a silent drift would put back exactly the unreciprocated hreflang we just
  // removed, on half the pages.
  const seoTsx = join(dirname(appTsxPath), 'components', 'SEO.tsx');
  const seoSrc = readFileSync(seoTsx, 'utf8');
  const enOnlyLiteral = seoSrc.match(/const\s+EN_ONLY_PATHS\s*=\s*\[([^\]]*)\]/);
  if (!enOnlyLiteral) {
    problems.push(`Could not find EN_ONLY_PATHS in ${seoTsx} — the hreflang drift check cannot run.`);
  } else {
    const inTsx = [...enOnlyLiteral[1].matchAll(/"([^"]+)"|'([^']+)'/g)]
      .map((mm) => mm[1] ?? mm[2])
      .sort();
    const inMjs = [...EN_ONLY_ROUTES].sort();
    if (inTsx.join(',') !== inMjs.join(',')) {
      problems.push(
        `EN_ONLY_PATHS in SEO.tsx (${inTsx.join(', ')}) does not match EN_ONLY_ROUTES in ` +
        `route-seo.mjs (${inMjs.join(', ')}). Keep them identical.`
      );
    }
  }

  return problems;
}
