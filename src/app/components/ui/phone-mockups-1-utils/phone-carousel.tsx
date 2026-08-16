import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "../../../../lib/utils";

/**
 * PhoneCarousel — a coverflow of iPhone-style frames.
 *
 * Each item can either be a bitmap (`src`) or a rendered React `screen`. We use
 * `screen` on the site: the mockups show real UI (branded caller ID, an in-call
 * view, the note landing in the chart), so the type stays sharp on retina, the
 * copy stays editable, and no external image host is involved.
 *
 * Auto-advances while on screen, pauses on hover, honours reduced motion.
 * Imports are relative because this project has no `@/` path alias.
 */

export type ImageItem = {
  /** Bitmap screen. Ignored when `screen` is provided. */
  src?: string;
  alt: string;
  /** Rendered screen, preferred over `src`. */
  screen?: React.ReactNode;
  /** Short label shown under the active phone. */
  caption?: string;
};

export function PhoneCarousel({
  images,
  className,
  intervalMs = 4200,
}: {
  images: ImageItem[];
  className?: string;
  intervalMs?: number;
}) {
  const n = images.length;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (reduce || paused || !inView || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), intervalMs);
    return () => clearInterval(id);
  }, [reduce, paused, inView, n, intervalMs]);

  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[440px] sm:h-[500px] flex items-center justify-center [perspective:1400px]">
        {images.map((item, i) => {
          // circular offset so the row wraps instead of flying off at the ends
          const half = Math.floor(n / 2);
          const d = ((i - active + n + half) % n) - half;
          const isActive = d === 0;
          return (
            <motion.button
              key={item.alt}
              type="button"
              onClick={() => setActive(i)}
              aria-label={item.alt}
              aria-current={isActive}
              initial={false}
              animate={{
                x: d * 168,
                scale: isActive ? 1 : 0.82,
                opacity: Math.abs(d) > 1 ? 0 : isActive ? 1 : 0.55,
                rotateY: reduce ? 0 : d * -16,
              }}
              transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
              style={{ zIndex: 10 - Math.abs(d) }}
              className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-[44px]"
            >
              <PhoneFrame elevated={isActive}>
                {item.screen ?? (
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                )}
              </PhoneFrame>
            </motion.button>
          );
        })}
      </div>

      {/* caption + dots */}
      <div className="mt-2 text-center">
        <p className="h-5 text-[13.5px] font-medium text-slate-600 m-0">
          {images[active]?.caption ?? ""}
        </p>
        <div className="mt-4 flex justify-center gap-2.5">
          {images.map((item, i) => (
            <button
              key={`dot-${item.alt}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${item.alt}`}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === active ? "w-8 bg-[#2563EB]" : "w-2 bg-slate-300 hover:bg-slate-400",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The device shell: titanium-ish rail, dynamic island, white screen. */
export function PhoneFrame({
  children,
  elevated = false,
}: {
  children: React.ReactNode;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-[232px] h-[420px] sm:w-[248px] sm:h-[472px] rounded-[44px] bg-[#0A1633] p-[9px] transition-shadow duration-500",
        elevated
          ? "shadow-[0_2px_8px_rgba(10,22,51,0.18),0_34px_70px_-18px_rgba(10,22,51,0.45)]"
          : "shadow-[0_12px_30px_-12px_rgba(10,22,51,0.35)]",
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-white">
        <div className="absolute left-1/2 top-2.5 z-20 h-[20px] w-[74px] -translate-x-1/2 rounded-full bg-[#0A1633]" />
        {children}
      </div>
    </div>
  );
}
