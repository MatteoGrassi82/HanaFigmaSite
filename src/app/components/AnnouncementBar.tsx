import { X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslations } from "../../lib/i18n";

export function AnnouncementBar() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(true);

  // Check localStorage on mount to see if user has dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("announcement-bar-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-bar-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center px-3 sm:px-4 pt-3 pb-1">
      <div className="announcement-float relative flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-[#00122F] pl-2 pr-2 py-1.5 shadow-[0_4px_16px_rgba(0,18,47,0.35)] ring-1 ring-white/10 max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] min-w-0">
        {/* Soft white sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.14),_transparent_70%)]" />

        {/* Whole pill (minus dismiss) is the link */}
        <Link
          to="/access"
          className="group relative flex items-center gap-2 sm:gap-2.5 pl-1.5 min-w-0"
        >
          {/* Live deadline badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 ring-1 ring-white/25 px-2.5 py-0.5 whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white">{t.announcement.date}</span>
          </span>

          <span className="hidden sm:inline text-white/90 text-sm font-normal leading-snug whitespace-nowrap">
            {t.announcement.body}
          </span>

          {/* CTA pill */}
          <span className="inline-flex items-center gap-1 rounded-full bg-white group-hover:bg-blue-50 group-active:bg-blue-50 px-3 py-1 text-xs sm:text-sm font-medium text-[#00122F] transition-colors whitespace-nowrap">
            <span className="sm:hidden">{t.announcement.ctaMobile}</span>
            <span className="hidden sm:inline">{t.announcement.ctaDesktop}</span>
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="relative shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-2.5 sm:p-1.5 text-white/70 hover:text-white hover:bg-white/15 active:bg-white/15 rounded-full transition-colors"
          aria-label={t.announcement.dismissLabel}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}