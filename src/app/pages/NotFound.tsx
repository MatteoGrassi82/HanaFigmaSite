import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { useTranslations } from "../../lib/i18n";

export function NotFound() {
  const t = useTranslations();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has moved."
        robots="noindex, follow"
      />
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">404</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-serif text-slate-900 dark:text-white">
        {t.notFound.heading}
      </h1>
      <p className="mt-4 text-lg text-slate-500 max-w-md">
        {t.notFound.body}
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}
