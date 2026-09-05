import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * The launch bar above the navbar.
 *
 * Matteo 2026-09-02: "I would like to have an announcement bar at the top: we
 * just launched a new sleep protocol." His words, plus somewhere to go.
 *
 * Dismissible, and the dismissal sticks per browser via localStorage. Scoped to
 * whichever page mounts it (currently /remote-v2 only) rather than the whole
 * site, so it can be judged before it goes everywhere. Bump STORAGE_KEY when the
 * announcement changes, otherwise anyone who dismissed the old one never sees
 * the new one.
 */
const STORAGE_KEY = "hana-announce-sleep-2026-09";

export function AnnouncementBar() {
  const [show, setShow] = useState(false);

  // read after mount: the prerendered HTML must not bake in one viewer's choice
  useEffect(() => {
    try {
      setShow(window.localStorage.getItem(STORAGE_KEY) !== "dismissed");
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      /* private windows: it just comes back next visit */
    }
  };

  return (
    <div className="relative z-50 bg-navy text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-2.5 flex items-center justify-center gap-3 text-center">
        <span className="shrink-0 rounded-full bg-[#E8A06A] text-[#231206] text-[10.5px] font-bold uppercase tracking-[1.2px] px-2 py-[3px]">
          New
        </span>
        <p className="text-[13.5px] leading-snug m-0">
          We just launched a new sleep protocol.{" "}
          <a
            href="/hana-sleep"
            className="group inline-flex items-center gap-1 font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
          >
            See it
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
          </a>
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 md:right-8 w-7 h-7 grid place-items-center rounded-full bg-transparent border-0 cursor-pointer text-white/60 hover:text-white hover:bg-paper-bright/10 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
