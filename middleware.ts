import { next } from "@vercel/edge";

/**
 * Geo redirect — Italian visitors → the Italian site.
 *
 * The English (hana.health) and Italian (ita.hana.health) sites are two Vercel
 * projects sharing this repo; locale is chosen at runtime from the hostname.
 * This middleware runs at the edge before the SPA loads and, ONLY on the English
 * host, sends genuine Italian-country visitors to ita.hana.health.
 *
 * Rules (agreed with the owner):
 *  - Auto-redirect on the FIRST visit only — we set a `hana_geo` cookie so a
 *    user who later chooses English is never redirected again.
 *  - Bots/crawlers are NEVER redirected, so indexing of both domains stays clean
 *    (Googlebot crawls from US IPs anyway; hreflang already links the two).
 *  - One direction only: IT visitors on hana.health → ita.hana.health. Visitors
 *    on ita.hana.health (and non-IT visitors) are left untouched.
 *
 * Because the Italian project deploys the same repo, the host guard below is
 * essential: on ita.hana.health this middleware must do nothing (no loops).
 */

export const config = {
  // Skip Vercel internals, the API functions, and anything that looks like a
  // static asset (has a file extension). Only real page navigations are matched.
  matcher: ["/((?!api/|_next/|_vercel/|.*\\.[a-zA-Z0-9]+$).*)"],
};

const IT_HOST = "ita.hana.health";

// Conservative bot match — search engines, social unfurlers, monitors, headless.
const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkShare|whatsapp|telegram|slackbot|discordbot|googlebot|bingbot|duckduckbot|baiduspider|yandex|sogou|exabot|ia_archiver|lighthouse|headlesschrome|preview|monitor|pingdom|uptime/i;

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const host = (req.headers.get("host") || url.hostname).toLowerCase();

  // Never act on the Italian host (same repo deploys there) → no redirect loop.
  // Only act on the English production host(s); leave Vercel preview URLs alone.
  const isEnglishProd = host === "hana.health" || host === "www.hana.health" || host === "usehana.com" || host === "www.usehana.com";
  if (!isEnglishProd) return next();

  // Respect a prior choice: if we've already handled this visitor, do nothing.
  const cookie = req.headers.get("cookie") || "";
  if (/(?:^|;\s*)hana_geo=/.test(cookie)) return next();

  // Never redirect bots/crawlers — keeps SEO/indexing clean.
  const ua = req.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) return next();

  // Vercel provides the visitor's country here.
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();

  // First real visit, not a bot, no prior choice. Set the cookie either way so we
  // only ever evaluate this once per visitor.
  const setCookie = "hana_geo=1; Path=/; Max-Age=31536000; SameSite=Lax";

  if (country === "IT") {
    const dest = new URL(req.url);
    dest.hostname = IT_HOST;
    dest.protocol = "https:";
    dest.port = "";
    return new Response(null, {
      status: 302, // temporary — visitor can still navigate back to English
      headers: { Location: dest.toString(), "Set-Cookie": setCookie },
    });
  }

  // Non-IT visitor on the English site: remember we've seen them, then continue.
  const res = next();
  res.headers.append("Set-Cookie", setCookie);
  return res;
}
