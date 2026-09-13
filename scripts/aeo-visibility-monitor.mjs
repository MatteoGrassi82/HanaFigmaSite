/**
 * AEO visibility monitor — the "citation monitor" from AEO_AGENTIC_SYSTEM.md.
 *
 * Runs a FIXED query set against the engines buyers actually use and records,
 * per engine × query, whether HANA is mentioned, whether hana.health is cited,
 * where we rank, and which competitors the engine named instead. Writes one JSON
 * snapshot per day to scripts/data/aeo-visibility/ and prints a diff against
 * the previous snapshot, so "we gained ThoroughCare-alternatives on Perplexity"
 * is a fact and not a feeling.
 *
 * Engines (all via Apify Actors, no vendor API keys needed):
 *   google      apify/google-search-scraper       organic + AI Overview
 *   perplexity  apify/perplexity-search-scraper   answer text + citations
 *   chatgpt     apify/chatgpt-search-scraper      answer text + sources
 *
 * Usage:
 *   APIFY_TOKEN=... npm run aeo:monitor                  # all engines, all queries
 *   APIFY_TOKEN=... npm run aeo:monitor -- --engines=perplexity,chatgpt
 *   APIFY_TOKEN=... npm run aeo:monitor -- --group=category
 *   npm run aeo:monitor -- --dry                          # list what would run, no calls
 *   npm run aeo:monitor -- --report                       # re-print the latest snapshot
 *
 * Cost at Sept 2026 prices: full run (18 queries × 3 engines) ≈ $0.35.
 * Run weekly. Put the token in the environment, never in the repo (it is public).
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data', 'aeo-visibility');
const QUERIES_FILE = join(DATA_DIR, 'queries.json');

const ACTORS = {
  google: 'apify~google-search-scraper',
  perplexity: 'apify~perplexity-search-scraper',
  chatgpt: 'apify~chatgpt-search-scraper',
};

const OUR_HOSTS = /(^|\.)(hana\.health|usehana\.com)$/i;
// "HANA", or "Hana" next to a word that marks it as us. Excludes Hāna (Maui), Hana Compass, restaurants.
const OUR_NAME = /\bHANA\b(?!\s+Compass)|\bHana\s+(Health|Voice|Remote|Contact|Sleep)\b|hana\.health|usehana/;

const COMPETITORS = [
  'ThoroughCare', 'HealthArc', 'Prevounce', 'ChronicCareIQ', 'TimeDoc', 'ChartSpan', 'CareHarmony',
  'Hippocratic', 'Assort', 'Hyro', 'Retell', 'CloudTalk', 'Positive Check', 'Keruu', 'Clinii',
  'Commure', 'CareMessage', 'Omada', 'CCN Health', 'Accelerate', 'HealthSnap', 'Phreesia', 'Artera',
  'Luma Health', 'Carenox', 'Chronii', 'Elythea', 'Infinitus', 'Syllable', 'Bland', 'Synthflow',
];

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [a, true];
}));

function today() { return new Date().toISOString().slice(0, 10); }
function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } }
function isOurs(u) { return OUR_HOSTS.test(hostOf(u)); }
function competitorsIn(text) {
  const t = text || '';
  return COMPETITORS.filter((c) => new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t));
}

// ---------- Apify ----------
async function apify(path, init = {}) {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error('APIFY_TOKEN is not set. Export it in your shell; do not put it in the repo.');
  const url = `https://api.apify.com/v2${path}${path.includes('?') ? '&' : '?'}token=${token}`;
  const res = await fetch(url, { ...init, headers: { 'content-type': 'application/json', ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`Apify ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function runActor(engine, input) {
  const start = await apify(`/acts/${ACTORS[engine]}/runs?timeout=600&memory=1024`, {
    method: 'POST', body: JSON.stringify(input),
  });
  const runId = start.data.id, datasetId = start.data.defaultDatasetId;
  process.stdout.write(`  ${engine}: run ${runId} `);
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const { data } = await apify(`/actor-runs/${runId}`);
    if (['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(data.status)) {
      console.log(data.status);
      if (data.status !== 'SUCCEEDED') return [];
      const items = await apify(`/datasets/${datasetId}/items?clean=true&limit=1000`);
      return items;
    }
    process.stdout.write('.');
  }
  console.log('gave up waiting');
  return [];
}

// ---------- normalisers: one record per query ----------
function normGoogle(items, meta) {
  return items.map((it) => {
    const q = it.searchQuery?.term;
    const organic = it.organicResults || [];
    const ours = organic.filter((r) => isOurs(r.url));
    const aio = it.aiOverview;
    const aioText = aio?.content || '';
    const aioSources = (aio?.sources || []).map((s) => s.url).filter(Boolean);
    const allText = [aioText, ...organic.map((r) => `${r.title} ${r.description || ''}`)].join('\n');
    return rec(meta, 'google', q, {
      mentioned: OUR_NAME.test(allText) || ours.length > 0,
      cited: ours.length > 0 || aioSources.some(isOurs),
      ourUrls: [...new Set([...ours.map((r) => r.url), ...aioSources.filter(isOurs)])],
      position: ours.length ? ours[0].position : null,
      aiOverview: aio ? { present: true, mentionsUs: OUR_NAME.test(aioText), citesUs: aioSources.some(isOurs) } : { present: false },
      competitors: competitorsIn(allText),
      topDomains: topDomains([...organic.map((r) => r.url), ...aioSources]),
    });
  });
}
function normPerplexity(items, meta) {
  return items.map((it) => {
    const urls = it.citationUrls || (it.sources || []).map((s) => s.url) || [];
    return rec(meta, 'perplexity', it.query, {
      mentioned: OUR_NAME.test(it.text || ''),
      cited: urls.some(isOurs),
      ourUrls: urls.filter(isOurs),
      position: null,
      competitors: competitorsIn(it.text),
      topDomains: topDomains(urls),
    });
  });
}
function normChatGPT(items, meta) {
  return items.map((it) => {
    const urls = (it.sources || []).map((s) => (s.url || '').replace(/[?&]utm_source=chatgpt\.com/, ''));
    return rec(meta, 'chatgpt', it.query, {
      mentioned: OUR_NAME.test(it.text || ''),
      cited: urls.some(isOurs),
      ourUrls: urls.filter(isOurs),
      position: null,
      competitors: competitorsIn(it.text),
      topDomains: topDomains(urls),
    });
  });
}
function topDomains(urls) {
  const c = {};
  for (const u of urls) { const h = hostOf(u); if (h) c[h] = (c[h] || 0) + 1; }
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([h]) => h);
}
function rec(meta, engine, query, x) {
  return { date: meta.date, engine, group: meta.groupOf[query] || 'unknown', query, ...x };
}

// ---------- reporting ----------
function summarise(records) {
  const byEngine = {};
  for (const r of records) {
    const e = (byEngine[r.engine] ||= { n: 0, mentioned: 0, cited: 0 });
    e.n++; if (r.mentioned) e.mentioned++; if (r.cited) e.cited++;
  }
  return byEngine;
}
function printReport(snapshot, previous) {
  console.log(`\n=== AEO visibility ${snapshot.date} ===`);
  const s = summarise(snapshot.records);
  for (const [e, v] of Object.entries(s)) console.log(`${e.padEnd(11)} mentioned ${v.mentioned}/${v.n}   cited ${v.cited}/${v.n}`);
  console.log('\nengine      group       M C  query                                                    | competitors named');
  for (const r of snapshot.records.sort((a, b) => a.group.localeCompare(b.group) || a.query.localeCompare(b.query) || a.engine.localeCompare(b.engine))) {
    console.log(`${r.engine.padEnd(11)} ${r.group.padEnd(11)} ${r.mentioned ? '●' : '·'} ${r.cited ? '●' : '·'}  ${r.query.slice(0, 56).padEnd(56)} | ${r.competitors.slice(0, 5).join(', ')}`);
  }
  if (previous) {
    const key = (r) => `${r.engine}|${r.query}`;
    const prev = new Map(previous.records.map((r) => [key(r), r]));
    const gained = [], lost = [];
    for (const r of snapshot.records) {
      const p = prev.get(key(r)); if (!p) continue;
      if (r.mentioned && !p.mentioned) gained.push(r); if (!r.mentioned && p.mentioned) lost.push(r);
    }
    console.log(`\nvs ${previous.date}: gained ${gained.length}, lost ${lost.length}`);
    for (const r of gained) console.log(`  + ${r.engine}  ${r.query}`);
    for (const r of lost) console.log(`  - ${r.engine}  ${r.query}`);
  }
  if (snapshot.deadCitations?.length) {
    console.log('\n⚠ CITED BUT BROKEN — engines are sending readers to these:');
    for (const d of snapshot.deadCitations) console.log(`  ${String(d.status).padEnd(12)} ${d.url}`);
    console.log('  Fix: add a redirect in vercel.json to the nearest PUBLISHED page.');
  }

  const misses = snapshot.records.filter((r) => r.group !== 'brand' && !r.mentioned);
  if (misses.length) {
    console.log('\nWhere we are absent (non-brand): pages/citations to go get');
    const dom = {};
    for (const r of misses) for (const d of r.topDomains) dom[d] = (dom[d] || 0) + 1;
    console.log('  most-cited domains on those queries: ' + Object.entries(dom).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([d, n]) => `${d}(${n})`).join(', '));
  }
}

/**
 * A cited URL that 404s is worse than no citation: the engine still names us, and the
 * reader who follows it lands on an error page. Engines keep citing paths from an
 * information architecture we retired, so this has to be checked every run, not once.
 * Returns [{url, status}] for everything that did not answer 200.
 */
async function findDeadCitations(records) {
  const urls = [...new Set(records.flatMap((r) => r.ourUrls || []))];
  const dead = [];
  for (const url of urls) {
    try {
      // Sequential and slow on purpose: a burst of parallel HEADs gets rate-limited and
      // every check comes back as a false failure.
      const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'hana-aeo-monitor' } });
      if (!res.ok) dead.push({ url, status: res.status });
    } catch (e) {
      dead.push({ url, status: 'unreachable' });
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return dead;
}

async function latestSnapshots() {
  await mkdir(DATA_DIR, { recursive: true });
  const files = (await readdir(DATA_DIR)).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  return files;
}

// ---------- main ----------
async function main() {
  const q = JSON.parse(await readFile(QUERIES_FILE, 'utf8'));
  const groups = Object.keys(q).filter((k) => !k.startsWith('_'));
  const wantGroups = args.group ? String(args.group).split(',') : groups;
  const groupOf = {};
  for (const g of wantGroups) for (const s of q[g] || []) groupOf[s] = g;
  const queries = Object.keys(groupOf);
  const engines = args.engines ? String(args.engines).split(',') : Object.keys(ACTORS);
  const files = await latestSnapshots();

  if (args.report) {
    if (!files.length) return console.log('no snapshots yet');
    const cur = JSON.parse(await readFile(join(DATA_DIR, files.at(-1)), 'utf8'));
    const prev = files.length > 1 ? JSON.parse(await readFile(join(DATA_DIR, files.at(-2)), 'utf8')) : null;
    return printReport(cur, prev);
  }
  if (args.dry) {
    console.log(`${queries.length} queries × ${engines.join(', ')}`);
    for (const s of queries) console.log(`  [${groupOf[s]}] ${s}`);
    return;
  }

  const meta = { date: today(), groupOf };
  const records = [];
  console.log(`Running ${queries.length} queries on ${engines.join(', ')}…`);
  const joined = queries.join('\n');
  const jobs = engines.map(async (engine) => {
    let items = [];
    if (engine === 'google') {
      items = await runActor('google', { queries: joined, countryCode: 'us', languageCode: 'en', maxPagesPerQuery: 1, resultsPerPage: 10, includeUnfilteredResults: false, saveHtml: false, saveHtmlToKeyValueStore: false });
      records.push(...normGoogle(items, meta));
    } else if (engine === 'perplexity') {
      items = await runActor('perplexity', { queries: joined });
      records.push(...normPerplexity(items, meta));
    } else if (engine === 'chatgpt') {
      items = await runActor('chatgpt', { queries: joined });
      records.push(...normChatGPT(items, meta));
    }
  });
  await Promise.all(jobs);

  console.log('\nChecking every cited URL still resolves…');
  const deadCitations = await findDeadCitations(records);

  const snapshot = { date: meta.date, engines, queries: groupOf, records, deadCitations };
  const out = join(DATA_DIR, `${meta.date}.json`);
  await writeFile(out, JSON.stringify(snapshot, null, 2) + '\n');
  const prevFile = files.filter((f) => f !== `${meta.date}.json`).at(-1);
  const prev = prevFile ? JSON.parse(await readFile(join(DATA_DIR, prevFile), 'utf8')) : null;
  printReport(snapshot, prev);
  console.log(`\nwrote ${out}`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
