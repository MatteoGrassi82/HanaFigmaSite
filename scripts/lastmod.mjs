/**
 * Regenerate scripts/data/route-lastmod.json — the committed record of when each
 * static route last changed.
 *
 * Run this from a full clone (your machine), then commit the result. The build
 * reads it because Vercel clones with --depth=10 and cannot date anything older
 * than the last ten commits; see scripts/lib/git-lastmod.mjs for the full story.
 *
 * Usage:
 *   npm run seo:lastmod              # rewrite the manifest
 *   npm run seo:lastmod -- --check   # exit 1 if it is out of date (no writes)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectRouteMeta, STATIC_ROUTES } from './lib/route-seo.mjs';
import { staticRouteLastmod, gitFileDates } from './lib/git-lastmod.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
export const MANIFEST = join(__dirname, 'data', 'route-lastmod.json');
const CHECK = process.argv.includes('--check');

/** Read the committed manifest; a missing or corrupt file is just "no data". */
export async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const info = gitFileDates(ROOT);
  if (!info) {
    console.error('✗ git history unavailable — cannot compute route dates here.');
    process.exit(1);
  }
  if (info.shallow) {
    console.error(
      '✗ shallow clone — dates would be wrong for anything older than the clone depth.\n' +
      '  Run this from a full clone (`git fetch --unshallow`) and commit the result.'
    );
    process.exit(1);
  }

  // Only the static routes: blog posts are dated from Sanity's _updatedAt at
  // build time, so putting them here would create a second, staler source.
  const pageMeta = collectRouteMeta(join(ROOT, 'src', 'app'), 'en');
  const staticOnly = Object.fromEntries(
    Object.entries(pageMeta).filter(([route]) => STATIC_ROUTES.includes(route))
  );

  const { lastmod } = staticRouteLastmod(staticOnly, ROOT, {});
  const previous = await readManifest();

  const missing = STATIC_ROUTES.filter((r) => !lastmod[r]);
  if (missing.length) {
    console.warn(`  ⚠ no date for ${missing.length} route(s): ${missing.join(', ')}`);
  }

  // Sorted keys so the committed file has a stable diff.
  const sorted = Object.fromEntries(Object.entries(lastmod).sort(([a], [b]) => a.localeCompare(b)));
  const changed = Object.keys(sorted).filter((r) => previous[r] !== sorted[r]);

  if (CHECK) {
    if (changed.length) {
      console.error(
        `✗ route-lastmod.json is out of date for ${changed.length} route(s): ${changed.join(', ')}\n` +
        '  Run `npm run seo:lastmod` and commit the result.'
      );
      process.exit(1);
    }
    console.log(`▸ route-lastmod.json is current (${Object.keys(sorted).length} routes).`);
    return;
  }

  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  console.log(
    `▸ route-lastmod.json written: ${Object.keys(sorted).length} routes` +
    (changed.length ? `, ${changed.length} updated (${changed.join(', ')}).` : ', no changes.')
  );
}

if (process.argv[1] && process.argv[1].endsWith('lastmod.mjs')) {
  main().catch((err) => {
    console.error('✗ lastmod generation failed:', err);
    process.exit(1);
  });
}
