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
import { join } from 'node:path';

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
  const alternates = [
    ['en', `${EN_DOMAIN}${m.path}`],
    ['it', `${IT_DOMAIN}${m.path}`],
    ['x-default', `${EN_DOMAIN}${m.path}`],
  ]
    .map(([lang, href]) => `  <link rel="alternate" hreflang="${lang}" href="${esc(href)}" />`)
    .join('\n');
  html = html.replace(/\s*<link\s+rel="alternate"[^>]*>/gi, '');
  html = html.replace('</head>', `${alternates}\n  </head>`);

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
