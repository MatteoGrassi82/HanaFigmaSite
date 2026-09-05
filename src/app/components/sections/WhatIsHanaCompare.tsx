import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * WhatIsHanaCompare — the three-way "what is this, actually" comparison.
 *
 * Three cards side by side. "One way" is the software category, "Another way"
 * is the outsourced-labour category, "Our way" is HANA. It is the section that
 * says what the thing IS, so on every page that mounts it, it goes first or
 * near-first. Extracted out of RemoteV2.tsx so the three /compare pages can
 * mount it and swap the middle and right columns. Copy, layout, geometry and
 * the card stagger are the original's; the four deliberate deviations are the
 * CY2027 correction, the static header and footnote, the tokenised radius and
 * shadow, and the new opt-in props. Each is spelled out below. Nothing else
 * changed, and nothing else should.
 *
 * ═══ THE ONE GUARDRAIL THAT IS NOT NEGOTIABLE ═══════════════════════════════
 * THE MIDDLE COLUMN DESCRIBES A CATEGORY, NEVER A COMPANY.
 * "Outsourced care management" is a generic business model: contracted staff
 * and staffing agencies doing the calling on a practice's behalf. It must not
 * name a competitor, must not quote one's pricing or headcount, and must not
 * accumulate enough specific detail that a reader can identify one particular
 * vendor from it. There is a live commercial conversation with a company in
 * this category. Sharpening this column into a named or recognisable takedown
 * is not an improvement, it is a business problem. If you are tempted to make
 * it "more concrete", make it more generic instead.
 * The same applies to anything a page passes in as `columns`.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CY2027 IS A PROPOSED RULE. Every reference to it, in the defaults here and in
 * anything a page passes in, says "proposed". The final rule is not out. The
 * original copy read "From January, Medicare may not pay you back for them",
 * which states the timing as settled; that was corrected on extraction. Do not
 * put a date, an effective month or a settled verb back in.
 *
 * OTHER COPY RULES CARRIED OVER FROM THE ORIGINAL, so nobody re-litigates them:
 *  · US spellings (enrollment / program / dialing / judgment).
 *  · "AI care coordination" is the category noun. Never "software", never bare
 *    "platform", and never "agentic" (deprecated in the brand architecture).
 *    Matteo 2026-08-25: the AI stays visible, only the buzzword goes.
 *  · "30+ languages", never "any language".
 *  · Your team reviews, your provider signs. Never "nurses".
 *  · No em dashes.
 *  · The header's old right-hand one-liner ("only one of them actually picks up
 *    the phone") came out 2026-08-25 because the HANA card's first bullet says
 *    it already. The slot survives as the `body` prop, empty by default.
 *  · The standing line under the grid ("Your team keeps the relationship, the
 *    judgment and the signature") is the keeper. The louder "only one that does
 *    the calling" line came out 2026-09-02.
 *
 * PRERENDER. The build snapshots every route in headless Chrome at 800x600 and
 * that HTML is what Google reads. In RemoteV2 the header and the closing line
 * were wrapped in motion `whileInView`, so on a route where this section sits
 * below the fold the observer never fired and motion baked `opacity: 0` onto
 * the section's own <h2> in the snapshot. Both render static here, always.
 * The three cards keep their staggered entrance, because that stagger IS the
 * section's motion and dropping it would be a redesign. A page that wants a
 * fully static snapshot passes `animate={false}` and loses nothing but the
 * fade. Reduced-motion users already get the static render.
 * Nothing in this file is conditionally rendered on state, so every word of
 * every card is in the HTML on first paint.
 *
 * TOKENS. No hex. The feature card's lift was a raw `rgba(0,18,47,0.55)`; it is
 * the navy token at 55% now, so a palette change carries it. Two radii moved to
 * tokens with it, and one of them is not pixel-identical: the cards were
 * `rounded-xl` (12px) and are `rounded-tile` (--radius-tile, 14px), which is the
 * radius every other section in this directory uses. The 2px is the price of
 * being reskinnable and it is the only geometry that differs from RemoteV2. The
 * bullet glyphs went `rounded-full` to `rounded-pill`, which is 9999px either
 * way. The section ground stays light: the navy is a CARD, not a mid-page band,
 * which is what the palette rule forbids. Do not reverse the section out onto
 * navy.
 * ─────────────────────────────────────────────────────────────────────────── */

/** One card. Card 1 is prose-only (`body`); cards 2 and 3 are lists (`points`). */
export interface CompareColumn {
  /** The small label above the gap: "One way", "Another way", "Our way". */
  label: string;
  /** The card's name, in serif. */
  title: string;
  /** One line under the title, above the list. The prose-only card has none. */
  subtitle?: string;
  /** The bullets. Omit for a prose-only card. */
  points?: string[];
  /** Prose instead of bullets. Pinned to the bottom of the card on md and up. */
  body?: string;
  /** Bullet glyph. "cross" is the negative list, "check" the positive one. */
  mark?: "cross" | "check";
  /** "muted" is the light card; "feature" is the navy one. One feature card. */
  variant?: "muted" | "feature";
}

export interface WhatIsHanaCompareProps {
  eyebrow?: string;
  /** ReactNode so a page can put an <em> in it. */
  heading?: ReactNode;
  /** Optional one-liner beside the heading on md and up. Empty by default. */
  body?: string;
  /** The three cards, left to right. */
  columns?: CompareColumn[];
  /** The standing line under the grid. Pass null to drop it. */
  footnote?: ReactNode;
  /** "light" is the paper ground; "band" separates on --color-band + a hairline. */
  tone?: "light" | "band";
  /** Card entrance stagger. false renders every card static. */
  animate?: boolean;
  className?: string;
  id?: string;
}

/* The extraction defaults: RemoteV2's copy, unchanged apart from the CY2027
   correction noted at the top. Read the guardrail block before editing the
   middle column. */
export const DEFAULT_COMPARE_COLUMNS: CompareColumn[] = [
  {
    label: "One way",
    title: "Care management software",
    body:
      "Mainly used to track time, build the care plan, and assemble the claim. Nothing happens until someone on your team dials.",
    variant: "muted",
  },
  {
    // GENERIC CATEGORY. Never a company. See the guardrail block above.
    label: "Another way",
    title: "Outsourced care management",
    subtitle: "Based on contracted staff and staffing agencies",
    mark: "cross",
    variant: "muted",
    points: [
      "They do the calling. You pay for their hours.",
      "Capacity capped by whoever they can hire",
      "Notes handed back to you, not written in your chart",
      "Under the proposed CY2027 rule, Medicare may not pay you back for them",
    ],
  },
  {
    label: "Our way",
    title: "AI care coordination",
    subtitle: "Based on clinician-built protocols",
    mark: "check",
    variant: "feature",
    points: [
      "It dials, it listens, it writes the note",
      "Every patient, every month, in 30+ languages",
      "The note lands in your chart, ready to sign",
      "Not clinical staff, so the proposed CY2027 rule leaves it standing",
    ],
  },
];

/* Tone is two grounds over one layout, token-only, so the .cobalt scope and any
   future palette change carry through untouched. On the band ground the muted
   cards go bright, or they disappear into it. */
const TONE = {
  light: { section: "bg-paper-bright", muted: "bg-paper-2" },
  band: { section: "bg-band border-y border-rule", muted: "bg-paper-bright" },
} as const;

/* Static class strings: Tailwind cannot see a computed one. Three is the design;
   the rest are here so a two-column page does not leave a hole in the grid. */
const GRID_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/* The original's entrance, unchanged: 24px rise, 0.5s, fires once, 80px early. */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export function WhatIsHanaCompare({
  eyebrow,
  heading = (
    <>
      Three ways to run care management.
      <br />
      <em>One of them makes the calls.</em>
    </>
  ),
  body,
  columns = DEFAULT_COMPARE_COLUMNS,
  footnote = "Your team keeps the relationship, the judgment and the signature. HANA does the dialing.",
  tone = "light",
  animate = true,
  className,
  id,
}: WhatIsHanaCompareProps = {}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const headingId = `${uid}-compare-heading`;
  const skin = TONE[tone];
  const motionOn = animate && !reduce;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        skin.section,
        "py-28 md:py-36 px-6 md:px-16 scroll-mt-24",
        className,
      )}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Plain <div>, not motion.div. See the PRERENDER note at the top: an
            entrance animation here bakes opacity:0 onto the <h2>. */}
        <div className="md:flex md:items-start md:justify-between md:gap-12 mb-10 md:mb-14">
          <div>
            {eyebrow ? (
              <p className="text-eyebrow font-bold uppercase text-ink-mute mt-0 mb-4">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={headingId}
              className="font-serif font-normal text-[36px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.015em] text-navy m-0 [&_em]:italic [&_em]:font-normal [&_em]:text-ink"
            >
              {heading}
            </h2>
          </div>
          {body ? (
            <p className="text-[15px] leading-[1.6] text-ink-soft mt-6 md:mt-2 mb-0 md:max-w-[38ch] md:shrink-0">
              {body}
            </p>
          ) : null}
        </div>

        <div className={cn("grid grid-cols-1 gap-5", GRID_COLS[columns.length] ?? GRID_COLS[3])}>
          {columns.map((col, i) => {
            const feature = col.variant === "feature";
            const check = col.mark === "check";
            const anim = motionOn
              ? { ...fadeUp, transition: { duration: 0.5, delay: 0.05 + i * 0.08 } }
              : {};
            return (
              <motion.div
                key={col.title}
                {...anim}
                className={cn(
                  "rounded-tile p-8 md:p-9 flex flex-col md:min-h-[620px]",
                  feature
                    ? // The navy is a CARD, not a mid-page band. Token at 55%,
                      // which is exactly the rgba(0,18,47,0.55) the original used.
                      "bg-navy shadow-[0_28px_70px_-26px_color-mix(in_srgb,var(--color-navy)_55%,transparent)]"
                    : skin.muted,
                )}
              >
                <p
                  className={cn(
                    "text-[13px] font-semibold m-0",
                    feature ? "text-white" : "text-navy",
                  )}
                >
                  {col.label}
                </p>

                {/* The gap that pushes the title to the middle of the card. */}
                <div className="h-10 md:h-[220px]" aria-hidden />

                <h3
                  className={cn(
                    "font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] m-0",
                    feature ? "text-white" : "text-navy",
                  )}
                >
                  {col.title}
                </h3>

                {col.subtitle ? (
                  <p
                    className={cn(
                      "text-[16px] leading-[1.5] mt-6 mb-0",
                      feature ? "text-white/90" : "text-navy",
                    )}
                  >
                    {col.subtitle}
                  </p>
                ) : null}

                {col.points?.length ? (
                  <ul className="list-none p-0 mt-5 mb-0 space-y-4">
                    {col.points.map((p) => (
                      <li
                        key={p}
                        className={cn(
                          "flex items-start gap-3 text-[15px] leading-[1.5]",
                          feature ? "text-white/90" : "text-ink-soft",
                        )}
                      >
                        {/* Decorative: the card's title and subtitle already say
                            which list this is, so the glyph is not read out. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "shrink-0 w-5 h-5 rounded-pill grid place-items-center mt-0.5",
                            check
                              ? "border border-white/40 text-white text-[10px]"
                              : "bg-navy text-white text-[9px] font-bold",
                          )}
                        >
                          {check ? "✓" : "✕"}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {col.body ? (
                  <p
                    className={cn(
                      "text-[15px] leading-[1.6] mt-10 md:mt-auto md:pt-10 mb-0",
                      feature ? "text-white/90" : "text-ink-soft",
                    )}
                  >
                    {col.body}
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        {/* Static, like the header. This line is the section's conclusion and it
            is the last thing on the page here, so it is the most likely of all
            to miss an IntersectionObserver in the snapshot. */}
        {footnote ? (
          <p className="text-[15px] leading-[1.6] text-ink-soft text-center mt-10 mb-0 max-w-[62ch] mx-auto">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
