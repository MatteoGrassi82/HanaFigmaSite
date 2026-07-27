const { join } = require('path');

/**
 * Keep Chrome inside the project instead of ~/.cache/puppeteer.
 *
 * On Vercel the home directory isn't part of the build cache, so puppeteer's
 * post-install download (when it runs at all) is gone by the time the build
 * executes — which is how `scripts/prerender.mjs` ended up silently skipping and
 * shipping an unrendered site. A project-local cache is both restorable and
 * findable by the `chrome:install` step in package.json.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
