/**
 * IndexNow submission — push freshly deployed URLs to the search engines that
 * accept a push.
 *
 * WHAT THIS IS AND ISN'T
 * IndexNow is supported by Bing, Yandex, Naver, Seznam and Yep. Google does NOT
 * support it (still "testing" since 2021) and killed its own sitemap ping endpoint
 * in 2023 — for Google the only mechanism is sitemap.xml plus Search Console, and
 * there is nothing to automate. So this covers everyone except Google, which
 * matters here because Bing's index is what feeds Copilot and part of ChatGPT
 * search — i.e. the AEO surface.
 *
 * THE KEY IS NOT A SECRET. The protocol requires it to be publicly fetchable at
 * https://<host>/<key>.txt, which is why it lives in public/ and is committed even
 * though this repo is public. It only proves control of the domain.
 *
 * Usage:
 *   npm run indexnow             # submit every URL in dist/sitemap.xml
 *   npm run indexnow -- --dry-run  # print the payload, submit nothing
 *
 * Runs automatically on production builds via `vercel-build`. Never fails the
 * build: a rejected ping is a missed nudge, not a broken deploy.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITEMAP = join(ROOT, 'dist', 'sitemap.xml');
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY = '05186e4e744065433c3cb3936d0970bb';
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  if (!existsSync(SITEMAP)) {
    console.warn('▸ IndexNow skipped: dist/sitemap.xml not found (run `npm run build` first).');
    return;
  }

  const xml = await readFile(SITEMAP, 'utf8');
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) {
    console.warn('▸ IndexNow skipped: no URLs in sitemap.');
    return;
  }

  // Host comes from the sitemap itself, so the Italian project submits
  // ita.hana.health and the English one submits www.hana.health. A URL that
  // doesn't match the declared host is rejected wholesale (422).
  const host = new URL(urlList[0]).host;
  const mismatched = urlList.filter((u) => new URL(u).host !== host);
  if (mismatched.length) {
    console.warn(`▸ IndexNow skipped: sitemap mixes hosts (${mismatched.length} URLs are not on ${host}).`);
    return;
  }

  const body = {
    host,
    key: KEY,
    keyLocation: `https://${host}/${KEY}.txt`,
    // The whole list every time. Proper change-detection would need the previous
    // deployment's page hashes, which we have nowhere to persist; at 96 URLs on a
    // few deploys a week the volume is negligible against the protocol's limits
    // (10k URLs/request). Revisit if the page count grows by an order of magnitude.
    urlList,
  };

  if (DRY_RUN) {
    console.log(`▸ IndexNow dry run — would submit ${urlList.length} URLs for ${host}`);
    console.log(`  keyLocation: ${body.keyLocation}`);
    urlList.slice(0, 5).forEach((u) => console.log(`   · ${u}`));
    if (urlList.length > 5) console.log(`   … and ${urlList.length - 5} more`);
    return;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // 200 = accepted, 202 = accepted but the key is still being validated
      // (expected on the very first deploy, before /<key>.txt is reachable).
      console.log(`▸ IndexNow: submitted ${urlList.length} URLs for ${host} (HTTP ${res.status}).`);
      if (res.status === 202) {
        console.log(`  ↳ key pending validation — confirm https://${host}/${KEY}.txt is live.`);
      }
      return;
    }

    const hint =
      res.status === 403 ? `key not valid for this host — is https://${host}/${KEY}.txt live?`
      : res.status === 422 ? 'URLs do not match the declared host'
      : res.status === 429 ? 'rate limited — submitting too often'
      : 'see https://www.indexnow.org/documentation';
    console.warn(`▸ IndexNow: HTTP ${res.status} — ${hint}`);
  } catch (err) {
    console.warn(`▸ IndexNow: submission failed (${err.message}) — deploy is unaffected.`);
  }
}

main().catch((err) => {
  // Deliberately non-fatal.
  console.warn(`▸ IndexNow: unexpected error (${err.message}) — deploy is unaffected.`);
});
