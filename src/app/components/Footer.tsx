import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";
import logoImage from 'figma:asset/55130a9cc9a8f890dc08e580a5cf6dd0df0df413.png';
import { useTranslations, getLocale } from "../../lib/i18n";

export function Footer() {
  const t = useTranslations();
  // State of Voice AI + Case Studies (via /use-cases) are US-specific; dropped on Italian.
  const isItalian = getLocale() === "it";
  return (
    <footer className="bg-[rgb(0,18,47)] text-slate-400 py-12 px-4" role="contentinfo">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
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
          <p className="text-sm text-slate-500 mb-4">
            {t.footer.tagline}
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label={t.footer.twitterLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com/hanahealth" target="_blank" rel="noopener noreferrer" aria-label={t.footer.githubLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/usehana" target="_blank" rel="noopener noreferrer" aria-label={t.footer.linkedinLabel} className="inline-flex items-center justify-center w-11 h-11 -m-2 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <nav aria-label="Platform navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.platform}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#integrations" className="inline-block py-2 hover:text-white transition-colors">{t.footer.integrations}</a></li>
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.sdk}</a></li>
          </ul>
        </nav>

        <nav aria-label="Resources navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.resources}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://docs.hana.health/" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.documentation}</a></li>
            <li><Link to="/blog" className="inline-block py-2 hover:text-white transition-colors">{t.footer.blog}</Link></li>
            <li><Link to="/labs" className="inline-block py-2 hover:text-white transition-colors">{t.footer.labs}</Link></li>
            {!isItalian && <li><Link to="/state-of-ai" className="inline-block py-2 hover:text-white transition-colors">{t.footer.stateOfVoiceAI}</Link></li>}
            {!isItalian && <li><Link to="/use-cases" className="inline-block py-2 hover:text-white transition-colors">{t.footer.useCases}</Link></li>}
          </ul>
        </nav>

        <nav aria-label="Company navigation">
          <h4 className="text-white font-medium mb-4">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/pricing" className="inline-block py-2 hover:text-white transition-colors">{t.footer.pricing}</Link></li>
            <li><Link to="/about" className="inline-block py-2 hover:text-white transition-colors">{t.footer.aboutUs}</Link></li>
            <li><Link to="/contact" className="inline-block py-2 hover:text-white transition-colors">{t.footer.contact}</Link></li>
            <li><Link to="/contact" className="inline-block py-2 hover:text-white transition-colors">{t.footer.partnerships}</Link></li>
            <li><a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="inline-block py-2 hover:text-white transition-colors">{t.footer.bookDemo}</a></li>
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

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {t.footer.allRightsReserved}</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="py-2 hover:text-slate-400 transition-colors">{t.footer.privacy}</Link>
          <Link to="/terms" className="py-2 hover:text-slate-400 transition-colors">{t.footer.terms}</Link>
          <Link to="/cookies" className="py-2 hover:text-slate-400 transition-colors">{t.footer.cookies}</Link>
          <Link to="/aup" className="py-2 hover:text-slate-400 transition-colors">{t.footer.aup}</Link>
        </div>
      </div>
    </footer>
  );
}