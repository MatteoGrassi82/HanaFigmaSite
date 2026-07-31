/**
 * When did each static route last actually change?
 *
 * WHY THIS EXISTS
 * sitemap.xml carries <lastmod> for the 75 blog posts (Sanity gives us
 * `_updatedAt`) and nothing at all for the 21 static routes — so the pages whose
 * HTML changed most recently (/hana-remote, /hana-sleep/*, the footer-linked
 * product pages) shipped with the weakest possible recrawl signal, while Google
 * kept serving pre-prerender-fix titles for them. This supplies the missing date.
 *
 * The source of truth is git: a page changed when its source last changed. That
 * is honest in a way "now" is not — stamping today's date on all 96 URLs every
 * deploy is exactly the sitemap lie Google learns to ignore.
 *
 * THE SHALLOW-CLONE PROBLEM
 * Vercel builds run `git clone --depth=10`, so at build time only the last ten
 * commits are visible and every older page looks undated. Hence two sources,
 * merged newest-wins:
 *   1. `scripts/data/route-lastmod.json` — committed, regenerated from full
 *      history by `npm run seo:lastmod`. Covers everything.
 *   2. Live `git log` at build time — covers whatever is inside the clone depth,
 *      so a page edited in this very deploy is dated correctly even if nobody
 *      remembered to refresh the manifest.
 * Either source may be missing; a route with no date simply gets no <lastmod>,
 * which is the pre-existing behaviour and never wrong.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const EXTS = ['.tsx', '.ts', '.jsx', '.js'];

/** Repo-relative, forward-slashed — the form `git log --name-only` prints. */
export function toRepoPath(root, file) {
  return relative(root, file).split('\\').join('/');
}

function git(root, args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return null; // not a repo, git absent, or the command failed — all non-fatal
  }
}

/**
 * The grafted commits at a shallow clone's history boundary.
 *
 * These have no visible parent, so git diffs them against nothing and reports
 * them as *adding the entire tree*. Left in, a --depth=10 clone dates every file
 * the last ten commits didn't touch to the boundary commit — which is how a
 * first cut of this dated /case-studies to July 9th when it last really changed
 * on June 14th. Their file lists are noise and must be dropped.
 */
function graftedCommits(root) {
  const path = (git(root, ['rev-parse', '--git-path', 'shallow']) || '').trim();
  if (!path) return new Set();
  const file = resolve(root, path);
  if (!existsSync(file)) return new Set();
  try {
    return new Set(readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean));
  } catch {
    return new Set();
  }
}

/**
 * Last commit date per file, from one `git log` walk.
 *
 * `--name-only` lists each commit's files newest-first, so the first time a path
 * appears is its most recent change. Merge commits list no files by default,
 * which is what we want: the change is attributed to the commit that made it.
 *
 * @returns {{ shallow: boolean, dates: Map<string, string> } | null}
 */
export function gitFileDates(root, dirs = ['src']) {
  if (git(root, ['rev-parse', '--git-dir']) === null) return null;

  const shallow = (git(root, ['rev-parse', '--is-shallow-repository']) || '').trim() === 'true';
  const grafted = shallow ? graftedCommits(root) : new Set();
  const out = git(root, ['log', '--format=%H %cI', '--name-only', '--no-renames', '--', ...dirs]);
  if (out === null) return null;

  const dates = new Map();
  let current = null;
  for (const line of out.split('\n')) {
    if (!line) continue;
    const header = line.match(/^([0-9a-f]{40}) (\d{4}-\d{2}-\d{2}T\S+)$/);
    if (header) {
      // A grafted commit's file list is an artefact of the truncation, not a
      // change — skip its paths and let the committed manifest date them.
      current = grafted.has(header[1]) ? null : header[2];
    } else if (current && !dates.has(line)) {
      dates.set(line, current);
    }
  }
  return { shallow, dates };
}

/** Resolve one import specifier to a file on disk, or null if it isn't local. */
function resolveImport(spec, fromFile, root) {
  let base;
  if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec);
  else if (spec.startsWith('@/')) base = join(root, 'src', spec.slice(2));
  else return null; // bare specifier — a dependency, not our source

  const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => join(base, `index${e}`))];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/**
 * The files a route's freshness depends on: its page source plus the local
 * modules it imports directly.
 *
 * One level, deliberately. Home.tsx is twenty section components in a trenchcoat
 * — dating it by its own commit alone would say the homepage hasn't changed
 * since someone last touched the imports list, which is plainly false. Going
 * deeper would drag in the shared ui/ primitives and make every page's date move
 * together, which is the same failure in the other direction.
 *
 * Callers should still strip site-wide chrome afterwards — see SHARED_RATIO.
 */
export function routeSourceFiles(entryFile, root) {
  const files = new Set([entryFile]);
  let src;
  try {
    src = readFileSync(entryFile, 'utf8');
  } catch {
    return files;
  }

  const specs = [
    ...src.matchAll(/\bfrom\s+["']([^"']+)["']/g),
    ...src.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g), // lazy(() => import('…'))
  ].map((m) => m[1]);

  for (const spec of specs) {
    const file = resolveImport(spec, entryFile, root);
    if (file) files.add(file);
  }
  return files;
}

/** Newest date among `files`, or null if git knows about none of them. */
export function newestDate(files, root, dates) {
  if (!dates) return null;
  let newest = null;
  for (const file of files) {
    const when = dates.get(toRepoPath(root, file));
    if (when && (!newest || when > newest)) newest = when;
  }
  return newest;
}

/**
 * A module imported by at least this fraction of the routes is site-wide chrome
 * (Footer, SEO, the nav), not page content.
 *
 * Without this the whole thing is worthless: every page imports Footer, so one
 * footer commit re-dated all 21 routes to the same day and the sitemap claimed
 * the entire site changed at once. Google is explicit that lastmod should track
 * *significant* content change and that boilerplate edits don't qualify — a
 * sitemap that cries wolf every deploy is one Google stops believing.
 */
const SHARED_RATIO = 1 / 3;

/**
 * lastmod per static route, merging the committed manifest with live git.
 *
 * @param {object}  pageMeta   route → { source } from collectRouteMeta()
 * @param {string}  root       repo root
 * @param {object}  manifest   committed route → ISO date map (may be empty)
 * @returns {{ lastmod: Record<string,string>, stale: string[], shallow: boolean }}
 *          `stale` = routes git dates later than the manifest does, i.e. the
 *          manifest wants regenerating.
 */
export function staticRouteLastmod(pageMeta, root, manifest = {}) {
  const info = gitFileDates(root);
  const lastmod = {};
  const stale = [];

  // Resolve every route's imports first, so we can tell page content from chrome.
  const routes = Object.entries(pageMeta).filter(([, meta]) => meta?.source);
  const filesByRoute = new Map(
    routes.map(([route, meta]) => [route, routeSourceFiles(meta.source, root)])
  );
  const useCount = new Map();
  for (const files of filesByRoute.values()) {
    for (const file of files) useCount.set(file, (useCount.get(file) || 0) + 1);
  }
  const sharedThreshold = Math.max(2, Math.ceil(routes.length * SHARED_RATIO));

  for (const [route, meta] of routes) {
    // The page's own source always counts, however widely it's imported.
    const own = filesByRoute.get(route);
    const content = new Set([...own].filter(
      (f) => f === meta.source || (useCount.get(f) || 0) < sharedThreshold
    ));

    const fromGit = newestDate(content, root, info?.dates);
    const fromManifest = manifest[route] || null;

    // Newest wins: the manifest covers history the shallow clone can't see, git
    // covers edits made since the manifest was last regenerated.
    const when = [fromGit, fromManifest].filter(Boolean).sort().pop();
    if (when) lastmod[route] = when;
    if (fromGit && (!fromManifest || fromGit > fromManifest)) stale.push(route);
  }

  return { lastmod, stale, shallow: Boolean(info?.shallow) };
}
