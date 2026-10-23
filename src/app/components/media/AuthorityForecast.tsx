// Authority forecast for a React site built with Vite (prerendered at build time, hydrated in the browser, client-side
// on SPA navigation). No API key, no env var, no id map. Three uses:
//   <AuthorityForecast path={'/blog/' + slug} />       the forecast of the page, found by its URL (shared article template):
//                                                      a new forecast for a new article appears by itself
//   <AuthorityForecast embed={code} path={...} />      the code an editor pasted from Authority's "Copy embed code" button
//                                                      into a CMS block; an id in it (live snippet) -> always the latest
//                                                      version by id; a plain block -> rendered as pasted
//   <AuthorityForecast id="FORECAST_ID" />             one specific forecast, latest version
// Why a component: React re-renders the page after hydration and drops HTML put into the DOM from outside; a block
// rendered by React stays. Scripts inside innerHTML never run, so the block's <script> (chart, tooltips) is kept inert
// in the markup and re-created as a real script after mount, once per block.
// Build time (crawlers): either wrap renderToString with prerenderAuthorityForecasts(), or call
// preloadAuthorityForecasts(path, body) in the route's data loader before it renders. In the browser the prerendered
// markup is reused as is (no refetch, no hydration mismatch); a page that was not prerendered with it fetches after mount.
import { useEffect, useRef, useState } from 'react';

const EMBED_BASE = 'https://authority-forecast-mcp.vercel.app/e/';
const SITE_ORIGIN = 'https://www.hana.health'; // the site's public origin (not a secret)
const ATTR = 'data-authority-forecast-page'; // the embed URL, on the wrapper: how the hydrated component finds its prerendered markup
const INERT = 'text/authority-forecast';
const ID_IN_CODE = [/data-authority-forecast=["']?([0-9a-f-]{36})/i, /\/e\/([0-9a-f-]{36})(?![0-9a-f-])/i, /^\s*([0-9a-f-]{36})\s*$/i];

export interface ForecastTarget {
  id?: string;
  /** The public path of the page, e.g. '/blog/my-article'. */
  path?: string;
  /** Code pasted from Authority's "Copy embed code" button (a CMS block), a forecast id or its /e/ link. */
  embed?: string | null;
}
export interface ForecastPlacement {
  mode: 'after-intro' | 'after-heading' | 'before-last-heading' | 'end';
  /** after-heading: the heading text the client chose */
  heading?: string;
}

/** html per embed URL ('' = no forecast for it); one map for the build step and the browser, shared across bundles. */
const g = globalThis as typeof globalThis & { __authorityForecasts?: Map<string, string>; __authorityPending?: Set<string> };
const cache: Map<string, string> = (g.__authorityForecasts ??= new Map());
/** Embed URLs a server render needed but had no cache entry for (see prerenderAuthorityForecasts). */
const pending: Set<string> = (g.__authorityPending ??= new Set());

/** The forecast id in pasted embed code, an /e/ link or a bare id, or null (a plain pasted block has none). */
export function forecastIdIn(code: string | null | undefined): string | null {
  for (const re of ID_IN_CODE) {
    const m = code ? re.exec(code) : null;
    if (m) return m[1].toLowerCase();
  }
  return null;
}

/** The public embed URL to load for a target, or null when nothing is loaded (a plain pasted block, or nothing at all). */
export function authorityEmbedUrl(t: ForecastTarget): string | null {
  const id = t.id || forecastIdIn(t.embed);
  if (id) return EMBED_BASE + encodeURIComponent(id.toLowerCase());
  if (t.path && !(t.embed || '').trim()) return EMBED_BASE + 'page?url=' + encodeURIComponent(SITE_ORIGIN + (t.path.startsWith('/') ? t.path : '/' + t.path));
  return null;
}

/** Browser only: the page paths of this site that have a live forecast (/e/site), so a page lookup never asks for a 404. */
let listing: Promise<Set<string> | null> | null = null;
function sitePaths(): Promise<Set<string> | null> {
  return (listing ??= fetch(EMBED_BASE + 'site?url=' + encodeURIComponent(SITE_ORIGIN + '/'), { signal: AbortSignal.timeout(8000) })
    .then((res) => (res.ok ? res.json() : null))
    .then((site: { forecasts?: { path: string }[] } | null) => (site ? new Set((site.forecasts || []).map((f) => normPath(f.path))) : null))
    .catch(() => null));
}
function normPath(p: string): string {
  let d = p;
  try {
    d = decodeURI(p);
  } catch {
    // keep as is
  }
  return d.replace(/\/+$/, '') || '/';
}

async function loadUrl(url: string): Promise<string> {
  const hit = cache.get(url);
  if (hit !== undefined) return hit;
  const page = url.indexOf('page?url=');
  if (page >= 0 && typeof document !== 'undefined') {
    const paths = await sitePaths();
    if (paths && !paths.has(normPath(decodeURIComponent(url.slice(page + 9)).slice(SITE_ORIGIN.length)))) {
      cache.set(url, ''); // no forecast for this page: nothing to fetch
      return '';
    }
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const html = await res.text();
      cache.set(url, html);
      return html;
    }
    if (res.status === 404 || res.status === 410) cache.set(url, ''); // no forecast for this page (yet), or retired
  } catch {
    // Authority unreachable: nothing cached, so the browser tries again; the page renders without the forecast
  }
  return '';
}

/** Loads one target's block into the cache; resolves to its html ('' when there is none). Never throws. */
export async function preloadAuthorityForecast(t: ForecastTarget): Promise<string> {
  const url = authorityEmbedUrl(t);
  return url ? loadUrl(url) : '';
}

/**
 * Data loader of an article route (vite-react-ssg loader, vike +data, your own prerender script): loads the page's
 * forecast and the forecast of every CMS block in its Portable Text body before the route renders.
 */
export async function preloadAuthorityForecasts(path: string, body?: { _type: string; embedCode?: string | null }[] | null): Promise<void> {
  const targets: ForecastTarget[] = [{ path }];
  for (const b of body || []) if (b._type === 'authorityForecast') targets.push({ embed: b.embedCode, path });
  await Promise.all(targets.map((t) => preloadAuthorityForecast(t)));
}

/**
 * Custom prerender scripts: const html = await prerenderAuthorityForecasts(() => renderToString(<App />)).
 * Renders once to learn which forecasts the page needs, loads them, and renders again with them in the markup.
 */
export async function prerenderAuthorityForecasts(render: () => string): Promise<string> {
  pending.clear();
  let html = render();
  if (pending.size) {
    await Promise.all([...pending].map((u) => loadUrl(u)));
    pending.clear();
    html = render();
  }
  return html;
}

/** Executable scripts made inert (re-created after mount); JSON data scripts stay; a loader script with src is dropped. */
export function inertScripts(html: string): string {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag: string, attrs: string, code: string) => {
    const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || [])[1] || '';
    if (type && !/^(text|application)\/(java|ecma)script$|^module$/i.test(type)) return tag; // data, e.g. application/json; or already inert
    if (/\bsrc\s*=/i.test(attrs)) return ''; // the live-snippet loader (embed.js): this component loads the block itself
    return code.trim() ? '<script type="' + INERT + '">' + code + '</script>' : '';
  });
}

/** Text of a Portable Text block. */
function textOf(b: { children?: { text?: string }[] }): string {
  return (b.children || []).map((c) => c.text || '').join('');
}
function norm(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** true when the editor placed a forecast block in this Portable Text body (then the template adds none). */
export function hasAuthorityBlock(body: { _type: string }[] | null | undefined): boolean {
  return (body || []).some((b) => b._type === 'authorityForecast');
}

/**
 * Splits a Portable Text body where the forecast goes: [before, after]. after-intro (default) = before the first h2/h3,
 * or after the first paragraph when there is none; after-heading = after the named heading; before-last-heading; end.
 * Render <PortableText value={before} />, <AuthorityForecast path={...} />, <PortableText value={after} />.
 */
export function splitPortableText<T extends { _type: string; style?: string; children?: { text?: string }[] }>(
  blocks: T[],
  placement: ForecastPlacement = { mode: 'after-intro' },
): [T[], T[]] {
  const heads = blocks.map((b, i) => (b._type === 'block' && /^h[23]$/.test(b.style || '') ? i : -1)).filter((i) => i >= 0);
  const intro = heads.length ? heads[0] : Math.min(1, blocks.length);
  let at = intro;
  if (placement.mode === 'end') at = blocks.length;
  else if (placement.mode === 'before-last-heading') at = heads.length ? heads[heads.length - 1] : blocks.length;
  else if (placement.mode === 'after-heading' && placement.heading) {
    const want = norm(placement.heading);
    const exact = heads.find((h) => norm(textOf(blocks[h])) === want);
    const near = heads.find((h) => {
      const t = norm(textOf(blocks[h]));
      return !!want && (t.includes(want) || want.includes(t));
    });
    const i = exact ?? near;
    at = i == null ? intro : i + 1;
  }
  return [blocks.slice(0, at), blocks.slice(at)];
}

interface Shown {
  html: string;
  /** true: loaded from Authority (latest version); false: the pasted code, to be refreshed by id if it has one */
  live: boolean;
}

/** What to show first: the cache (build step), the prerendered markup already on the page, else the pasted code. */
function initial(url: string | null, pasted: string): Shown | null {
  if (url) {
    const hit = cache.get(url);
    if (hit !== undefined) return { html: hit, live: true };
    if (typeof document === 'undefined') pending.add(url);
    else {
      const nodes = document.querySelectorAll('[' + ATTR + ']');
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute(ATTR) !== url) continue;
        // the prerender keeps only the inert copies; drop any executed copy a snapshot still carried
        const html = nodes[i].innerHTML.replace(/<script data-authority-run[^>]*>[\s\S]*?<\/script>/gi, '');
        const live = nodes[i].getAttribute('data-authority-source') === 'live';
        if (live) cache.set(url, html);
        return { html, live };
      }
    }
    return pasted ? { html: pasted, live: false } : null;
  }
  return { html: pasted, live: false };
}

export default function AuthorityForecast({ id, path, embed, className }: ForecastTarget & { className?: string }) {
  const url = authorityEmbedUrl({ id, path, embed });
  const pasted = inertScripts((embed || '').trim());
  const [shown, setShown] = useState<Shown | null>(() => initial(url, pasted));
  const box = useRef<HTMLDivElement>(null);
  const ran = useRef<string | null>(null);

  // not prerendered with it (SPA navigation, no prerender) or pasted code with an id: load the latest version
  useEffect(() => {
    if (!url || (shown && shown.live)) return;
    let on = true;
    loadUrl(url).then((html) => {
      if (!on || cache.get(url) === undefined) return; // unreachable: keep what is shown
      if (html) setShown({ html, live: true });
      else if (!shown) setShown({ html: '', live: true }); // nothing for this page; a pasted block stays as pasted
    });
    return () => {
      on = false;
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  // run the block's scripts once per markup (chart, tooltips); inert in the markup, real elements here
  useEffect(() => {
    const el = box.current;
    const html = shown ? shown.html : '';
    if (!el || !html || ran.current === html) return;
    ran.current = html;
    const list = el.querySelectorAll('script[type="' + INERT + '"]');
    for (let i = 0; i < list.length; i++) {
      const s = document.createElement('script');
      s.setAttribute('data-authority-run', ''); // scripts/prerender.mjs removes these before it serialises the page
      s.text = list[i].textContent || '';
      el.appendChild(s);
    }
  }, [shown]);

  if (!shown || !shown.html) return null;
  return (
    <div
      ref={box}
      className={className || 'authority-forecast'}
      {...(url ? { [ATTR]: url } : {})}
      data-authority-source={shown.live ? 'live' : 'pasted'}
      dangerouslySetInnerHTML={{ __html: inertScripts(shown.html) }}
    />
  );
}

// --- The forecasts index (/forecasts) ---------------------------------------------------
// Every live forecast Authority publishes for this site comes from /e/site. The index page
// summarises each one (question, probability, trend, deadline) from the same block the full
// chart renders, so each forecast is fetched once. The page embeds what it computed as JSON
// (PageJson) so the prerendered snapshot carries it and the browser does not fetch again.

export interface SiteForecast {
  forecast_id: string;
  /** Path of the HANA post the forecast belongs to, e.g. '/blog/aco-reach-ends-lead-model-2027'. */
  path: string;
  version: number;
}

/** The site's live forecasts from /e/site; [] when there are none or Authority is unreachable. */
export async function loadAuthoritySiteForecasts(): Promise<SiteForecast[]> {
  try {
    const res = await fetch(EMBED_BASE + 'site?url=' + encodeURIComponent(SITE_ORIGIN + '/'), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const site: { forecasts?: SiteForecast[] } = await res.json();
    return (site.forecasts || [])
      .filter((f) => f.forecast_id && f.path)
      .map((f) => ({ forecast_id: f.forecast_id, path: normPath(f.path), version: f.version }));
  } catch {
    return [];
  }
}

export interface ForecastPoint {
  date: string; // YYYY-MM-DD
  p: number; // 0..1
}
export interface ForecastSummary {
  question: string;
  /** Probability today, 0..1, and the date it is as of. */
  p: number | null;
  asOf: string | null;
  /** start, every sourced event, today: the trend line. */
  series: ForecastPoint[];
  /** "Resolves 31 March 2027", as Authority words it. */
  resolves: string | null;
  /** "YYYY-MM", for sorting by deadline. */
  deadline: string | null;
  lastMove: { date: string; deltaPts: number; title: string } | null;
}

/**
 * Reads what the index needs out of a forecast block. Browser only (DOMParser): it runs in the
 * prerender's Chrome and, for a page that was not prerendered, in the visitor's. It leans on
 * the block's markup (h2.now, p.res, the jrf-data JSON), so every field degrades to empty
 * rather than throwing if Authority changes it; the card then shows the question alone.
 */
export function summarizeForecastHtml(html: string): ForecastSummary | null {
  if (!html || typeof DOMParser === 'undefined') return null;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const question = (doc.querySelector('h2.now') || doc.querySelector('h2'))?.textContent?.replace(/\s+/g, ' ').trim() || '';
  if (!question) return null;
  const resolves = doc.querySelector('p.res b')?.textContent?.trim() || null;
  let data: {
    start?: { date: string; p: string };
    today?: { date: string; p: string };
    deadline?: string;
    events?: { date: string; title: string; delta: string; after: string }[];
  } = {};
  try {
    data = JSON.parse(doc.querySelector('script[type="application/json"][id^="jrf-data"]')?.textContent || '{}');
  } catch {
    // keep the empty object: the card shows the question without numbers
  }
  const num = (v: unknown) => (v == null || v === '' || isNaN(Number(v)) ? null : Number(v));
  const events = (data.events || []).filter((e) => e.date && num(e.after) != null).sort((a, b) => a.date.localeCompare(b.date));
  const series: ForecastPoint[] = [];
  if (data.start && num(data.start.p) != null) series.push({ date: data.start.date, p: num(data.start.p)! });
  for (const e of events) series.push({ date: e.date, p: num(e.after)! });
  if (data.today && num(data.today.p) != null) series.push({ date: data.today.date, p: num(data.today.p)! });
  // the latest event that actually moved the number (some events are logged with no change)
  const last = [...events].reverse().find((e) => Math.abs(num(e.delta) || 0) >= 0.001);
  return {
    question,
    p: num(data.today?.p),
    asOf: data.today?.date || null,
    series,
    resolves,
    deadline: data.deadline || null,
    lastMove: last && num(last.delta) != null ? { date: last.date, deltaPts: Math.round(num(last.delta)! * 1000) / 10, title: last.title } : null,
  };
}

/** Reads JSON a prerendered page embedded with <PageJson id=... />, or null. */
export function readPageJson<T>(id: string): T | null {
  if (typeof document === 'undefined') return null;
  // main.tsx copies it out of the snapshot before React replaces it (lib/prerendered.ts)
  const captured = (globalThis as typeof globalThis & { __pageJson?: Map<string, string> }).__pageJson?.get(id);
  const text = captured ?? document.getElementById(id)?.textContent;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Embeds data as inert JSON so the prerendered snapshot carries it (see readPageJson). */
export function PageJson({ id, data }: { id: string; data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/json" id={id} dangerouslySetInnerHTML={{ __html: json }} />;
}
