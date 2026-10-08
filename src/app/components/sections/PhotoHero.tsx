import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DEMO_HREF } from "./CtaBand";

/* ─────────────────────────────────────────────────────────────────────────────
 * PhotoHero — a hero with a person in it, and the work happening to them.
 *
 * EXTRACTED FROM ProgrammeHero on 7 Sept 2026 so pages that are not about one
 * programme can use it. ProgrammeHero is now a thin wrapper that maps a
 * Programme onto these props, the same way SleepNoteBeforeTime wraps
 * MonthWrittenUp. Nothing about the programme pages changed.
 *
 * THE VISUAL IS THE PRODUCTSINTRO PATTERN, deliberately: a photograph of a real
 * person with an activity card floated up over the photo's bottom edge, same
 * card geometry and same chip vocabulary, so a landing page and the homepage
 * read as one site.
 *
 * SPLIT, NOT CENTRED, at 58/42. RemoteV2's hero settled on that proportion
 * after the motion panel was found to dominate a hero whose job is the
 * headline. A centred text hero is what these pages had before, and on a page
 * with no image anywhere it reads as a document rather than a page.
 *
 * THE CARD IS ILLUSTRATIVE AND SAYS SO. The figcaption is not decoration: the
 * default photographs are AI-generated (see ProgrammeHero) and the rows are
 * invented examples. Keep it.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface HeroCardRow {
  label: string;
  chip: string;
  tone?: "positive" | "flag" | "accent";
}

export interface PhotoHeroProps {
  eyebrow: string;
  headline: ReactNode;
  body: string;
  /** Rows in the floated activity card. */
  rows?: HeroCardRow[];
  image?: { src: string; alt: string; position?: string };
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  trustLine?: string;
  /** Text under the card. Defaults to the illustrative disclaimer. */
  caption?: string;
  /** Replaces the photograph and activity card entirely. Used by the programme
   *  pages to draw the programme's own rule instead of a stock face -- seven
   *  heroes that differ by data should not share a photo. */
  visual?: import("react").ReactNode;
  id?: string;
}

/* True for every care programme: it is the loop. */
export const LOOP_ROWS: HeroCardRow[] = [
  { label: "Monthly check-in · M. Alvarez", chip: "Reached", tone: "positive" },
  { label: "Reports two missed doses", chip: "Flagged to Dr Reyes", tone: "flag" },
  { label: "Note in chart · ready for review", chip: "Ready to sign", tone: "accent" },
];

export const KITCHEN_PHOTO = {
  src: "/products/programme-hero-kitchen.webp",
  alt: "An older woman at her kitchen table, listening on a phone call",
  position: "60% 28%",
};

export const ARMCHAIR_PHOTO = {
  src: "/products/programme-hero-armchair.webp",
  alt: "An older man in an armchair at home, listening on a phone call",
  position: "58% 26%",
};

/* ── Whose side is the page on? ────────────────────────────────────────────
 * The patient photographs above are right for a programme page, which argues
 * about a patient's month. They are WRONG for a page addressed to a practice:
 * its reader is a practice manager or a clinician, so the hero should show the
 * reader's side of the work, not the patient's. Matteo, 7 Sept 2026, on
 * /for-practices: "image should be more like maybe doctors etc?"
 *
 * CLINICIAN_PHOTO is the one to reach for on an audience page. The action in it
 * is reading on a screen, which is exactly what this product leaves to the
 * practice -- review and attest -- so it is accurate as well as on-side.
 *
 * CARE_TEAM_PHOTO is two colleagues over a laptop: warmer, but both faces sit
 * centre-right and the laptop fills the lower left, so the floated activity
 * card lands on top of it. Use it UNCOVERED, in a section with no overlay. */
export const CLINICIAN_PHOTO = {
  src: "/products/clinician-reviewing.webp",
  alt: "A physician at a clinic desk, reading notes on a monitor",
  position: "48% 34%",
};

export const CARE_TEAM_PHOTO = {
  src: "/products/care-team-reviewing.webp",
  alt: "Two care-team colleagues reading a screen together in a clinic office",
  position: "55% 30%",
};

const DOT: Record<NonNullable<HeroCardRow["tone"]>, string> = {
  positive: "bg-signal-green",
  flag: "bg-signal-amber",
  accent: "bg-brand",
};

export function PhotoHero({
  eyebrow,
  headline,
  body,
  rows = LOOP_ROWS,
  image = KITCHEN_PHOTO,
  primaryCta = { label: "Book a demo", href: DEMO_HREF, external: true },
  secondaryCta,
  trustLine = "Your team reviews. Your provider signs.",
  caption = "Illustrative. Names and readings are not real patients.",
  visual,
  id,
}: PhotoHeroProps) {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <header id={id} className="bg-paper-bright border-b border-rule/80 overflow-hidden">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] gap-10 lg:gap-14 items-center px-6 md:px-16 py-16 md:py-20 lg:py-24">
        <motion.div {...rise}>
          <p className="text-eyebrow font-bold uppercase text-brand m-0 mb-5">{eyebrow}</p>
          <h1 className="font-serif font-normal text-[40px] sm:text-[50px] md:text-[58px] lg:text-[64px] leading-[1.04] tracking-[-0.015em] text-ink m-0 max-w-[16ch]">
            {headline}
          </h1>
          <p className="text-[16.5px] md:text-[17.5px] leading-[1.65] text-ink-soft mt-6 mb-0 max-w-[46ch]">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href}
                {...(primaryCta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2.5 bg-navy text-white text-[15px] font-semibold px-7 py-[14px] rounded-pill no-underline hover:opacity-90 transition-opacity"
              >
                {primaryCta.label} <ArrowRight size={16} aria-hidden />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 border border-rule bg-paper-bright text-ink text-[15px] font-semibold px-6 py-[13px] rounded-pill no-underline hover:border-rule-strong transition-colors"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
          {trustLine && (
            <p className="text-[13.5px] text-ink-soft mt-7 mb-0 pt-5 border-t border-rule-soft max-w-[46ch]">
              {trustLine}
            </p>
          )}
        </motion.div>

        <motion.figure
          {...(reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const } })}
          className="m-0 w-full lg:justify-self-end lg:max-w-[520px]"
        >
          {visual ? (
            <div className="relative rounded-card overflow-hidden border border-rule bg-paper-bright shadow-card p-6 sm:p-8 aspect-[5/3]">
              {visual}
            </div>
          ) : (
            <div className="relative rounded-card overflow-hidden border border-rule bg-paper-bright shadow-card">
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[260px] sm:h-[300px] object-cover block"
                  style={{ objectPosition: image.position }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 mx-5 sm:mx-7 -mt-14 mb-6 bg-paper-bright rounded-tile border border-rule shadow-[0_12px_30px_rgba(0,18,47,0.14)] px-5 py-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-ink-mute m-0 pt-3 pb-1">
                  One month · an example
                </p>
                {rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-3 py-3 ${i > 0 ? "border-t border-rule-soft" : ""}`}
                  >
                    <span className="text-[13.5px] text-ink truncate">{row.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft whitespace-nowrap">
                      <span aria-hidden className={`w-[6px] h-[6px] rounded-full shrink-0 ${DOT[row.tone ?? "accent"]}`} />
                      {row.chip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {caption && (
            <figcaption className="text-[12.5px] leading-[1.5] text-ink-mute mt-3 mb-0 text-center">
              {caption}
            </figcaption>
          )}
        </motion.figure>
      </div>
    </header>
  );
}

export default PhotoHero;
