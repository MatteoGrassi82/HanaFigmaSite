import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * The site's real 404.
 *
 * WHY A FUNCTION AND NOT A STATIC FILE
 * This is a client-rendered SPA: vercel.json rewrites every extensionless path
 * that doesn't match a file to a single destination. A rewrite cannot change the
 * status code, so pointing it at /index.html (what we did until now) answered
 * *every* unknown URL with HTTP 200 and the full prerendered homepage — same
 * bytes, same <title>, and `<link rel="canonical" href="https://www.hana.health/">`.
 * Google read /demo, /solutions, /blog/deleted-post and every typo as a duplicate
 * of the homepage, which is a large part of why Search Console reports 20
 * "Alternative page with proper canonical tag" and 9 "Duplicate without
 * user-selected canonical" against 1 indexed page.
 *
 * Rewrites check the filesystem first (Vercel docs, vercel.json#rewrites — it is
 * why /pricing has always served its own prerendered file despite the catch-all).
 * So every route scripts/prerender.mjs writes a dist/<route>/index.html for still
 * resolves statically and never reaches this handler. Only genuinely unknown
 * paths land here, and a function — unlike a rewrite — can answer 404.
 *
 * Consequence to keep in mind: a route that exists in src/app/App.tsx but is NOT
 * prerendered now 404s on a hard navigation. STATIC_ROUTES + NOINDEX_ROUTES in
 * scripts/lib/route-seo.mjs is therefore the real allow-list; add new routes to
 * both places. `npm run seo:check` fails the build if the two drift apart.
 *
 * <NotFound> in App.tsx is still the client-side fallback for in-app navigation,
 * which never touches the server.
 */

const COPY = {
  en: {
    lang: "en",
    title: "Page not found | Hana Health",
    heading: "Page not found",
    body: "That page doesn't exist, or it moved. The link that brought you here may be out of date.",
    home: "Go to the homepage",
    more: "Or try",
    links: [
      ["/care", "Care coordination"],
      ["/sleep", "HANA Sleep"],
      ["/blog", "Blog"],
      ["/contact", "Contact"],
    ],
  },
  it: {
    lang: "it",
    title: "Pagina non trovata | Hana Health",
    heading: "Pagina non trovata",
    body: "Questa pagina non esiste, oppure è stata spostata. Il link che ti ha portato qui potrebbe non essere aggiornato.",
    home: "Vai alla homepage",
    more: "Oppure prova",
    links: [
      ["/hana-remote", "HANA Remote"],
      ["/hana-contact", "HANA Contact"],
      ["/blog", "Blog"],
      ["/contact", "Contatti"],
    ],
  },
} as const;

/** Same "ita." test src/lib/i18n.ts detectLocale() and prerender.mjs use. */
function localeFor(host: string): "en" | "it" {
  return host.toLowerCase().startsWith("ita.") ? "it" : "en";
}

function page(t: (typeof COPY)["en"]): string {
  const links = t.links
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join("");

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${t.title}</title>
<meta name="robots" content="noindex, follow" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 2rem; background: #f8fafc; color: #1e293b;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  main { max-width: 32rem; }
  .code { font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: #475569; margin: 0 0 .75rem; }
  h1 { font-size: 1.875rem; line-height: 1.2; margin: 0 0 .75rem; font-weight: 600; color: #0f172a; }
  p { margin: 0 0 1.5rem; color: #334155; }
  .home {
    display: inline-block; padding: .625rem 1.25rem; border-radius: 9999px;
    background: #0f172a; color: #fff; text-decoration: none; font-weight: 500;
  }
  .home:hover { background: #1e293b; }
  .more { margin-top: 2rem; font-size: .875rem; color: #475569; }
  ul { list-style: none; padding: 0; margin: .5rem 0 0; display: flex; flex-wrap: wrap; gap: 1rem; }
  a { color: #334155; }
</style>
</head>
<body>
  <main>
    <p class="code">404</p>
    <h1>${t.heading}</h1>
    <p>${t.body}</p>
    <a class="home" href="/">${t.home}</a>
    <div class="more">${t.more}
      <ul>${links}</ul>
    </div>
  </main>
</body>
</html>
`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const host = (req.headers.host as string) || "";
  const t = COPY[localeFor(host)];

  res.status(404);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Belt and braces alongside the <meta> tag: a 404 should never be indexed, and
  // the header also covers HEAD requests, where the body is dropped.
  res.setHeader("X-Robots-Tag", "noindex");
  // Don't let a 404 sit in the CDN for a URL that may become real (a blog post is
  // published, a route is added) — but don't re-invoke on every asset probe either.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, must-revalidate");

  if (req.method === "HEAD") return res.end();
  return res.send(page(t));
}
