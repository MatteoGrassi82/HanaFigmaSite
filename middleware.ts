import { next } from "@vercel/edge";

/**
 * Edge middleware for hana.health.
 *
 * Its one job now is serving usehana.com its own robots.txt (below).
 *
 * THE ITALIAN GEO REDIRECT IS GONE (7 Oct 2026, Matteo: park the Italian site).
 * Until then, a first-time visitor from an Italian IP was 302'd to
 * ita.hana.health. That site is parked: ita.hana.health now redirects to
 * www.hana.health at the domain level, so keeping the geo rule would bounce an
 * Italian visitor between the two hosts. The old rule is in git history, in
 * the parent of the commit "feat(i18n): park the Italian site", if the
 * Italian site ever comes back.
 */

export const config = {
  // robots.txt is the only path this middleware acts on, so it is the only path
  // it runs for. It used to match every page navigation for the geo rule.
  matcher: ["/robots.txt"],
};

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const host = (req.headers.get("host") || url.hostname).toLowerCase();

  /* usehana.com serves its own robots.txt.
   *
   * The domain stays live on purpose: Google Workspace mail runs on it and links
   * to usehana.com pages are already in sent agreements. Every page there already
   * canonicals to hana.health, which Google and Bing honour — but AI answer engines
   * ignore canonical tags, so they were crawling this host and citing usehana.com
   * URLs in answers, splitting the brand across two domains. public/robots-usehana.txt
   * keeps search crawlers allowed (they must fetch the page to read the canonical)
   * and points the AI crawlers at hana.health instead.
   *
   * THIS HAS TO LIVE IN MIDDLEWARE. A `has: host` rewrite in vercel.json does not
   * work for this: Vercel serves an existing static file from the filesystem BEFORE
   * it evaluates rewrites, and public/robots.txt exists, so the rewrite never fires.
   * Middleware runs ahead of the filesystem, so it does. Verified in production on
   * 13 Sep 2026 — the vercel.json version silently served the wrong file. */
  if (url.pathname === "/robots.txt") {
    if (host === "usehana.com" || host === "www.usehana.com") {
      return new Response(null, {
        headers: { "x-middleware-rewrite": new URL("/robots-usehana.txt", url).toString() },
      });
    }
  }
  return next();
}
