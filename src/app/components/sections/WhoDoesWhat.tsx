import { useId, type ReactNode } from "react";
import { PenLine, PhoneCall } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Programme } from "../../../content/programmes/index";

/* ─────────────────────────────────────────────────────────────────────────────
 * WhoDoesWhat — the split, in one view.
 *
 * WHAT IT IS FOR. Two columns that read at once: what HANA does inside a
 * programme, and where the practice's own team stays. It is the positioning
 * argument made visual instead of argued, so the layout carries the meaning and
 * the copy does not have to raise its voice.
 *
 * THE ASYMMETRY IS THE POINT, AND IT IS IN THE DATA.
 * `data.hana` is three or four concrete mechanical actions. `data.team` is one
 * sentence about judgement and attestation. Do not pad the team column to match
 * the list, and do not let HANA's column read as the bigger or more impressive
 * one. HANA does the volume. Your team does the deciding. Nothing bills until a
 * person on your team approves it.
 *
 * So the visual weight is deliberately reversed against the word count: HANA's
 * side is a plain white card and a hairline-divided list in secondary prose,
 * the team's side is the accent-tinted card, the larger type, and the standing
 * line the section exists to land. The two cards are the same width and, in a
 * grid row, the same height. Neither is a feature list with ticks.
 *
 * `data.lands` runs underneath, because what the month leaves in the record is
 * the evidence the split is real rather than a promise.
 *
 * WHAT THIS SECTION DELIBERATELY DOES NOT RENDER.
 *  · `data.note`, `data.rule`, `data.who` and `data.payment`. They belong to the
 *    rules and payment sections of a programme page; rendering them twice on one
 *    page is worse than not rendering them here.
 *  · PROGRAMME_FOOTNOTE. It is a page-level footnote ("Programs are what your
 *    practice bills. HANA does not bill…"), owned by the page, not by a section
 *    in the middle of it.
 *  · Any proof point, rate, code or eligibility rule of its own. Every fact on
 *    screen comes from the programme object. See the TODO block at the foot of
 *    src/content/programmes/index.ts for what is still missing site-wide; none
 *    of it is guessed here.
 *
 * PRERENDER. The build snapshots every route in headless Chrome at 800x600 and
 * never scrolls, so this section is below the fold when the HTML is captured.
 * There is therefore no entrance animation, no IntersectionObserver, no state
 * and no effect: a `whileInView` here would bake `opacity: 0` onto the most
 * important copy on the page. Nothing is conditionally rendered either, so
 * every word is in the snapshot on first paint. Motion is CSS-only.
 *
 * THE IMPORT PATH IS EXPLICIT ON PURPOSE. `src/content/programmes.ts` (the
 * RecipesMarquee card list) and `src/content/programmes/index.ts` (the
 * programme facts) both exist, and a bare "../../../content/programmes"
 * resolves to the FILE, not the directory. Nothing type-checks in this build,
 * so that mistake is silent. Always import "…/content/programmes/index".
 *
 * TOKENS. No hex. Colour, radius, shadow and the type scale come from
 * src/styles/tokens.css, so this reskins with the rest of the site and renders
 * correctly inside the .cobalt scope. No dark ground mid-page: the "band" tone
 * separates on --color-band with a hairline, per the palette rules.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface WhoDoesWhatProps {
  /** The programme. Required: this section is nothing without its facts. */
  data: Programme;
  /** Defaults to "<CODE> · Who does what", e.g. "CCM · Who does what". */
  eyebrow?: string;
  /** ReactNode so a page can accent part of it with an <em>. */
  heading?: ReactNode;
  body?: string;
  /** "light" is paper ground; "band" is the tinted section ground with rules. */
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

/* Tone is two palettes over one layout, token-only. The team card keeps the
   accent tint in both tones: it is the side that matters, and it is the side a
   reader's eye should land on first. */
const TONE = {
  light: {
    section: "bg-paper",
    eyebrow: "text-ink-mute",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
    hanaCard: "bg-paper-bright border-rule shadow-card",
    hanaBadge: "bg-paper border-rule text-ink-soft",
    teamCard: "bg-brand-tint border-brand/25 shadow-card",
    teamBadge: "bg-paper-bright border-brand/20 text-brand",
    divider: "border-rule",
    pill: "border-rule bg-paper-bright text-ink",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-ink-mute",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
    hanaCard: "bg-paper-bright border-rule shadow-card",
    hanaBadge: "bg-paper-2 border-rule text-ink-soft",
    teamCard: "bg-brand-tint border-brand/25 shadow-card",
    teamBadge: "bg-paper-bright border-brand/20 text-brand",
    divider: "border-rule",
    pill: "border-rule bg-paper-bright text-ink",
  },
} as const;

/** The line the section exists to land. House copy. Never the word "nurses". */
const ATTESTATION = "Your team reviews, your provider signs.";

export function WhoDoesWhat({
  data,
  eyebrow,
  heading = (
    <>
      HANA does the volume. <em>Your team does the deciding.</em>
    </>
  ),
  body = "HANA does the reaching out and the writing up. Every clinical judgement stays with your people, and nothing bills until a person on your team approves it.",
  tone = "light",
  className,
  id,
}: WhoDoesWhatProps) {
  const uid = useId();
  const headingId = `${uid}-wdw-heading`;
  const hanaId = `${uid}-wdw-hana`;
  const teamId = `${uid}-wdw-team`;
  const landsId = `${uid}-wdw-lands`;
  const skin = TONE[tone];
  const eyebrowText = eyebrow ?? `${data.code} · Who does what`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        skin.section,
        "px-6 md:px-16 py-24 md:py-32 scroll-mt-24",
        className,
      )}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Plain <div>, not motion.div. See the PRERENDER note above: an
            entrance animation here bakes opacity:0 onto the <h2>. */}
        <div className="max-w-[720px] mx-auto text-center">
          {eyebrowText ? (
            <p
              className={cn(
                "text-eyebrow font-bold uppercase mt-0 mb-4",
                skin.eyebrow,
              )}
            >
              {eyebrowText}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal m-0 text-[32px]/[1.1] sm:text-[40px]/[1.1] md:text-h2",
              skin.heading,
            )}
          >
            {heading}
          </h2>
          {body ? (
            <p className={cn("text-lead mt-6 mb-0 mx-auto max-w-[56ch]", skin.body)}>
              {body}
            </p>
          ) : null}
        </div>

        {/* Two columns, same width, same height. The content inside them is
            deliberately unequal. */}
        <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 md:grid-cols-2">
          {/* HANA. The work that repeats. */}
          <div
            className={cn(
              "flex flex-col rounded-card border p-7 md:p-9",
              skin.hanaCard,
            )}
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "grid place-items-center w-11 h-11 shrink-0 rounded-tile border",
                  skin.hanaBadge,
                )}
              >
                <PhoneCall className="w-5 h-5" />
              </span>
              <div>
                <h3
                  id={hanaId}
                  className="font-serif font-normal m-0 text-[24px] md:text-h3 text-navy"
                >
                  HANA does
                </h3>
                <p className="m-0 mt-1 text-[13px] leading-snug text-ink-soft">
                  The work that repeats
                </p>
              </div>
            </div>

            <ul
              aria-labelledby={hanaId}
              className="list-none m-0 mt-6 p-0"
            >
              {data.hana.map((item) => (
                <li
                  key={item}
                  className={cn(
                    "flex gap-3 border-t py-3.5 first:border-t-0 first:pt-0",
                    skin.divider,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[9px] w-1.5 h-1.5 shrink-0 rounded-pill bg-brand"
                  />
                  <span className="text-[15px] leading-[1.65] text-ink-soft">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The practice. One sentence, and the line that ends the argument. */}
          <div
            className={cn(
              "flex flex-col rounded-card border p-7 md:p-9",
              skin.teamCard,
            )}
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "grid place-items-center w-11 h-11 shrink-0 rounded-tile border",
                  skin.teamBadge,
                )}
              >
                <PenLine className="w-5 h-5" />
              </span>
              <div>
                <h3
                  id={teamId}
                  className="font-serif font-normal m-0 text-[24px] md:text-h3 text-navy"
                >
                  Your team does
                </h3>
                <p className="m-0 mt-1 text-[13px] leading-snug text-ink-soft">
                  Never delegated
                </p>
              </div>
            </div>

            <p className="m-0 mt-6 text-[17px] md:text-lead leading-[1.55] text-ink">
              {data.team}
            </p>

            {/* mt-auto pins this to the bottom edge, so the shorter column
                still finishes level with the longer one. */}
            <p className="m-0 mt-auto pt-8">
              {/* The italic sits on an <em> INSIDE .font-serif, not on the span
                  itself. serif-display.css is unlayered, so its
                  `:is(div, span).font-serif { font-weight: 300 }` beats any
                  Tailwind weight utility, and 300 at 21-24px is the thin,
                  daylight-illegible case that file warns about. The
                  `:is(h1, h2, .font-serif) :is(em, i)` rule puts this back at
                  400 with the accent axis, which is the treatment this line
                  wants anyway. */}
              <span className="block border-t border-brand/25 pt-6 font-serif text-[21px]/[1.25] md:text-[24px]/[1.25] text-brand">
                <em>{ATTESTATION}</em>
              </span>
            </p>
          </div>
        </div>

        {/* What the month produces. The evidence the split is real. */}
        <div className={cn("mt-10 md:mt-12 border-t pt-8", skin.divider)}>
          <h3
            id={landsId}
            className="m-0 text-eyebrow font-bold uppercase text-ink-soft"
          >
            What the month leaves in the record
          </h3>
          <ul
            aria-labelledby={landsId}
            className="list-none flex flex-wrap gap-2.5 m-0 mt-4 p-0"
          >
            {data.lands.map((item) => (
              <li
                key={item}
                className={cn(
                  "rounded-pill border px-4 py-2 text-[14px] leading-snug",
                  skin.pill,
                )}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="m-0 mt-5 max-w-[62ch] text-[14px] leading-[1.7] text-ink-soft">
            The record is built while the work happens, not afterwards.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhoDoesWhat;
