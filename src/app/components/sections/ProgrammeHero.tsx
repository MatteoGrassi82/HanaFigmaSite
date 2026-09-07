import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Programme } from "../../../content/programmes/index";
import { DEMO_HREF } from "./CtaBand";

/* ─────────────────────────────────────────────────────────────────────────────
 * ProgrammeHero — the programme page hero, with a person in it.
 *
 * REPLACES the text-only <Hero> on the programme pages. That hero opened every
 * programme page with a CPT string as its eyebrow ("CCM · 99490 · 99439 ·
 * 99487 …"), a headline, a paragraph and two buttons, centred on a gradient.
 * Matteo, 7 Sept 2026: "kind of missing the soul and is really bland." He is
 * right, and the reason is structural: the first thing a reader saw was a list
 * of billing codes. Codes are the answer to question 2 ("what does it pay?")
 * and now live there, in PayVisual. The hero's job is question 0: is this
 * about a real patient and a real month? So it shows one.
 *
 * THE VISUAL IS THE PRODUCTSINTRO PATTERN, deliberately, because it is the
 * section on the current site Matteo pointed at as having the soul this page
 * lacked: a photograph of a real person, and the product's activity feed
 * floated up over the photo's bottom edge. Same photo, same card geometry, same
 * chip vocabulary (positive / flag / accent), so the programme pages and the
 * homepage read as one site.
 *
 * THE CARD ROWS ARE THE LOOP, NOT THE PROGRAMME. Default rows are true for all
 * seven programmes -- reach the patient, flag what matters, land the note --
 * because that is the month every one of them bills. A page can pass its own
 * rows when a programme's month has a distinctive shape (TCM's two-business-day
 * window, RPM's reading). They are illustrative and say so in the card header.
 *
 * SPLIT, NOT CENTRED. The RemoteV2 hero settled on claim-left / visual-right at
 * roughly 58/42 after the motion panel was found to dominate a hero whose job
 * is the headline. Same proportion here for the same reason.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface HeroCardRow {
  label: string;
  chip: string;
  tone?: "positive" | "flag" | "accent";
}

export interface ProgrammeHeroProps {
  data: Programme;
  headline: ReactNode;
  body?: string;
  /** Rows in the floated activity card. Defaults to the loop. */
  rows?: HeroCardRow[];
  image?: { src: string; alt: string; position?: string };
  trustLine?: string;
  id?: string;
}

/* True for every programme: it is the loop. */
const DEFAULT_ROWS: HeroCardRow[] = [
  { label: "Monthly check-in · M. Alvarez", chip: "Reached", tone: "positive" },
  { label: "Reports two missed doses", chip: "Flagged to Dr Reyes", tone: "flag" },
  { label: "Note in chart · 20 min attributed", chip: "Ready to sign", tone: "accent" },
];

/* ── The photographs, and where they came from ──────────────────────────────
 * public/products/programme-hero-kitchen.webp and programme-hero-armchair.webp
 * are AI-GENERATED (Sanity image generation, 7 Sept 2026), made because the
 * site owned exactly two product photographs and remote-patient-call.webp was
 * carrying the hero, the written-up month AND the homepage at once. They were
 * prompted to match that photo's style -- warm window light, muted earth tones,
 * candid, shallow focus, an older adult at home on a call -- and cropped to its
 * exact 1200x800 so every hero crop behaves identically.
 *
 * THE PEOPLE IN THEM DO NOT EXIST. That is fine for an illustrative hero and
 * would not be fine for a testimonial, a case study, a team page, or anywhere
 * a reader could take the face as a real patient or a real clinician. The
 * figcaption under the card says "Illustrative"; keep it. If a real, released
 * patient photograph ever exists, it replaces these here and this note goes.
 *
 * The kitchen shot is the default because her face sits in the top 45% of the
 * frame with quiet table space beneath -- exactly where the card floats. The
 * armchair shot is warmer and fuller in frame: better uncovered, on a page or
 * section without an overlay. remote-patient-call.webp stays on the written-up
 * month, so a programme page now shows two different people, one world. */
const DEFAULT_IMAGE = {
  src: "/products/programme-hero-kitchen.webp",
  alt: "An older woman at her kitchen table, listening on a phone call",
  position: "60% 28%",
};

const DOT: Record<NonNullable<HeroCardRow["tone"]>, string> = {
  positive: "bg-signal-green",
  flag: "bg-signal-amber",
  accent: "bg-brand",
};

export function ProgrammeHero({
  data,
  headline,
  body,
  rows = DEFAULT_ROWS,
  image = DEFAULT_IMAGE,
  trustLine = "Your team reviews. Your provider signs.",
  id,
}: ProgrammeHeroProps) {
  const reduce = useReducedMotion();
  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <header id={id} className="bg-paper-bright border-b border-rule/80 overflow-hidden">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] gap-10 lg:gap-14 items-center px-6 md:px-16 py-16 md:py-20 lg:py-24">
        {/* LEFT — the claim */}
        <motion.div {...rise}>
          <p className="text-eyebrow font-bold uppercase text-brand m-0 mb-5">{data.name}</p>
          <h1 className="font-serif font-normal text-[40px] sm:text-[50px] md:text-[58px] lg:text-[64px] leading-[1.04] tracking-[-0.015em] text-ink m-0 max-w-[16ch]">
            {headline}
          </h1>
          <p className="text-[16.5px] md:text-[17.5px] leading-[1.65] text-ink-soft mt-6 mb-0 max-w-[46ch]">
            {body ?? data.summary}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={DEMO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-navy text-white text-[15px] font-semibold px-7 py-[14px] rounded-pill no-underline hover:opacity-90 transition-opacity"
            >
              Book a demo <ArrowRight size={16} aria-hidden />
            </a>
            <a
              href="#pays"
              className="inline-flex items-center gap-2 border border-rule bg-paper-bright text-ink text-[15px] font-semibold px-6 py-[13px] rounded-pill no-underline hover:border-rule-strong transition-colors"
            >
              See what it pays
            </a>
          </div>
          {trustLine && (
            <p className="text-[13.5px] text-ink-soft mt-7 mb-0 pt-5 border-t border-rule-soft max-w-[46ch]">
              {trustLine}
            </p>
          )}
        </motion.div>

        {/* RIGHT — a person, and the month happening to them */}
        <motion.figure
          {...(reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const } })}
          className="m-0 w-full lg:justify-self-end lg:max-w-[520px]"
        >
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
            {/* the activity feed, floated over the photo's bottom edge */}
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
          <figcaption className="text-[12.5px] leading-[1.5] text-ink-mute mt-3 mb-0 text-center">
            Illustrative. Names and readings are not real patients.
          </figcaption>
        </motion.figure>
      </div>
    </header>
  );
}

export default ProgrammeHero;
