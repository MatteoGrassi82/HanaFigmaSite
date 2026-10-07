import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";
import logoImage from 'figma:asset/55130a9cc9a8f890dc08e580a5cf6dd0df0df413.png';
import { useTranslations, getLocale } from "../../../lib/i18n";

/**
 * Routes this column links to that are NOT published yet.
 *
 * Mirror of NOINDEX_ROUTES in scripts/lib/route-seo.mjs. It cannot be imported
 * here - that module reads node:fs - so it is duplicated, exactly like
 * EN_ONLY_PATHS in SEO.tsx. checkRouteCoverage() fails the build if the two
 * drift, so this cannot silently rot.
 *
 * WHY THIS EXISTS. 857aaa6 (7 Sep 2026) added this column while the gated pages
 * were prerendered-but-noindex, so the links resolved. 6e391a7 (9 Sep 2026)
 * stopped rendering unpublished routes entirely and did not revisit the footer,
 * so from that commit every page on the site - homepage included - shipped seven
 * links that returned 404 to visitors and crawlers alike. Found 12 Sep 2026.
 *
 * THIS IS TEMPORARY (Matteo, 13 Sep 2026): these pages ship with the new site, and
 * the links come back then. Until that launch a dead link is worse than no link, for
 * a reader and for a crawler both.
 *
 * Publishing a route is a three-file edit: move it to STATIC_ROUTES, delete the page's
 * robots prop, and remove it from this list. checkRouteCoverage() enforces all three,
 * so a half-done publish fails the build rather than shipping quietly.
 */
/**
 * TEMPORARY: the footer is cut back to company and legal links only.
 *
 * Matteo, 13 Sep 2026: "hide all the footers. Just keep About, Privacy, etc. but
 * hide all the other links." The product, care-programme and resource columns are
 * suppressed until the new site launches, when the held pages publish alongside it.
 *
 * Flip this to true to restore the full footer in one edit. The markup is kept
 * rather than deleted so that restoring it is a one-word change and none of the
 * internal-linking work has to be rebuilt.
 *
 * KNOWN COST, accepted and time-boxed. Measured against the built dist/ after the
 * change, exactly TWO pages drop to zero inbound internal links while this is false:
 *   /labs         0 inbound
 *   /state-of-ai  0 inbound
 * Both stay in sitemap.xml, so they remain crawlable and should not drop out of the
 * index - they lose internal link equity, not discoverability. Worth knowing that
 * /state-of-ai is currently the only HANA page ranking for a non-brand category query
 * (page 1 for "voice AI for CCM patient outreach", Sept 2026), so if a ranking slips
 * while this flag is false, that is the first place to look.
 *
 * Everything else survives on links from the page bodies: /hana-remote and
 * /hana-contact 7 inbound each via ProductsIntro, /pricing 7, /sleep 6,
 * /programs/access-model 6, /case-studies 155.
 */
const FULL_FOOTER = false;

const HELD_ROUTES = [
  "/programs",
  "/for-practices",
  "/for-health-systems",
  "/compare/vs-doing-nothing",
  "/academy",
  "/faq",
  "/security",
];

const PROGRAMME_LINKS = [
  { to: "/programs", label: "All programmes" },
  { to: "/for-practices", label: "For practices" },
  { to: "/for-health-systems", label: "For health systems" },
  { to: "/compare/vs-doing-nothing", label: "What the gap is worth" },
  { to: "/academy", label: "Academy" },
  { to: "/faq", label: "FAQ" },
  { to: "/security", label: "Security" },
].filter((l) => !HELD_ROUTES.includes(l.to));

export function Footer() {
  const t = useTranslations();
  // State of Voice AI + Case Studies (via /use-cases) are US-specific; dropped on Italian.
  const isItalian = getLocale() === "it";
  return (
    <footer className="bg-[rgb(0,18,47)] text-white/75 py-12 px-4" role="contentinfo">
      <div className={`max-w-7xl mx-auto grid grid-cols-2 gap-8 mb-8 ${FULL_FOOTER ? "md:grid-cols-5" : "md:grid-cols-3"}`}>
        <div className="col-span-2 md:col-span-1">
          <Link to="/" aria-label="Hana Health Home">
            <img
              src={logoImage}
              alt="Hana Voice AI Logo"
              className="h-8 mb-6 brightness-0 invert"
              width="120"
              height="32"
            />
          </Link>
          <p className="text-sm text-white/75 mb-4">
            {t.footer.tagline}
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label={t.footer.twitterLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label={t.footer.githubLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/usehana" target="_blank" rel="noopener noreferrer" aria-label={t.footer.linkedinLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        {/* The product pages live in the navbar's "Solutions" dropdown, whose
            submenu is only mounted once opened — so before this column existed,
            not one of the 96 built pages contained a link to /hana-remote,
            /hana-contact or /sleep. They are the pages we most want crawled
            and they had zero internal links. Keep them linked from here. */}
        {FULL_FOOTER && (
        <nav aria-label="Platform navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.platform}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hana-contact" className="inline-block py-2 hover:text-white transition-colors">HANA Contact</Link></li>
            {isItalian && <li><Link to="/hana-remote" className="inline-block py-2 hover:text-white transition-colors">HANA Remote</Link></li>}
            <li><Link to="/sleep" className="inline-block py-2 hover:text-white transition-colors">HANA Sleep</Link></li>
            <li><Link to="/sleep/analysis" className="inline-block py-2 hover:text-white transition-colors">Sleep Analysis</Link></li>
            <li><Link to="/sleep/cpap" className="inline-block py-2 hover:text-white transition-colors">CPAP Adherence Program</Link></li>
            {!isItalian && <li><Link to="/programs/access-model" className="inline-block py-2 hover:text-white transition-colors">CMS ACCESS Model</Link></li>}
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.sdk}</a></li>
          </ul>
        </nav>
        )}

        {/* Care programmes. Added 6 Sept 2026 for the same reason the Platform
            column above exists, and after making the identical mistake: the 17
            pages of the care-coordination site had ZERO inbound internal links
            from anywhere in the repo. A page nothing links to is orphaned even
            once it is indexed, and these are the pages we most want crawled.
            The hub carries the seven programme pages, so linking it links them.

            EN-ONLY, hardcoded English, matching the CMS ACCESS Model row above.
            These are US Medicare programmes and there is no Italian version of
            any of them. This guard is presentational only: the routes are still
            declared unconditionally in App.tsx, so it hides the links without
            fixing the underlying ita.hana.health exposure. That is tracked
            separately as the EN_ONLY_ROUTES work. */}
        {FULL_FOOTER && !isItalian && PROGRAMME_LINKS.length > 0 && (
          <nav aria-label="Care programmes navigation">
            <h4 className="text-white font-medium mb-4">Care programmes</h4>
            <ul className="space-y-2 text-sm">
              {PROGRAMME_LINKS.map(({ to, label }) => (
                <li key={to}><Link to={to} className="inline-block py-2 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </nav>
        )}

        {FULL_FOOTER && (
        <nav aria-label="Resources navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.resources}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.documentation}</a></li>
            <li><Link to="/blog" className="inline-block py-2 hover:text-white transition-colors">{t.footer.blog}</Link></li>
            <li><Link to="/labs" className="inline-block py-2 hover:text-white transition-colors">{t.footer.labs}</Link></li>
            {!isItalian && <li><Link to="/state-of-ai" className="inline-block py-2 hover:text-white transition-colors">{t.footer.stateOfVoiceAI}</Link></li>}
            {/* Links straight to /case-studies: /use-cases is now a server-side 301
                (vercel.json), so pointing at it made every page link through a redirect. */}
            {!isItalian && <li><Link to="/case-studies" className="inline-block py-2 hover:text-white transition-colors">{t.footer.useCases}</Link></li>}
          </ul>
        </nav>
        )}

        <nav aria-label="Company navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm">
            {FULL_FOOTER && <li><Link to="/pricing" className="inline-block py-2 hover:text-white transition-colors">{t.footer.pricing}</Link></li>}
            <li><Link to="/about" className="inline-block py-2 hover:text-white transition-colors">{t.footer.aboutUs}</Link></li>
            <li><Link to="/contact" className="inline-block py-2 hover:text-white transition-colors">{t.footer.contact}</Link></li>
            {FULL_FOOTER && <li><Link to="/contact" className="inline-block py-2 hover:text-white transition-colors">{t.footer.partnerships}</Link></li>}
            {FULL_FOOTER && <li><a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.bookDemo}</a></li>}
          </ul>
        </nav>

        <div>
          <h4 className="text-white font-medium mb-4">{t.footer.legal}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="inline-block py-2 hover:text-white transition-colors">{t.footer.privacyPolicy}</Link></li>
            <li><Link to="/terms" className="inline-block py-2 hover:text-white transition-colors">{t.footer.termsOfService}</Link></li>
            <li><Link to="/terms" className="inline-block py-2 hover:text-white transition-colors">{t.footer.compliance}</Link></li>
            <li><Link to="/aup" className="inline-block py-2 hover:text-white transition-colors">{t.footer.acceptableUsePolicy}</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
        <p>&copy; {new Date().getFullYear()} {t.footer.allRightsReserved}</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="py-2 hover:text-white transition-colors">{t.footer.privacy}</Link>
          <Link to="/terms" className="py-2 hover:text-white transition-colors">{t.footer.terms}</Link>
          <Link to="/cookies" className="py-2 hover:text-white transition-colors">{t.footer.cookies}</Link>
          <Link to="/aup" className="py-2 hover:text-white transition-colors">{t.footer.aup}</Link>
        </div>
      </div>
    </footer>
  );
}