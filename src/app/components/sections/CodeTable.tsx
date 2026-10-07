import { useId, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import {
  PUBLISHED_PROGRAMMES,
  PROGRAMME_FOOTNOTE,
  RATES_ARE_PLACEHOLDER,
  RATE_CAVEATS,
  formatUsd,
  rateBasisLine,
  type Programme,
  type RateCaveat,
} from "../../../content/programmes/index";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CodeTable — the billing facts, as a table a practice manager can scan.
 *
 * WHAT IT SHOWS, and where every string comes from
 * One row per programme: the code family (`codes`), the base code the figure is
 * priced on (`payment.code`), what the calendar month has to show (`rule`,
 * carried verbatim from src/content/programmes), and the CY2026 amount
 * (`payment.rate`, joined in from rates.ts and never re-typed here).
 *
 * THE INTEGRITY RULE, which is most of this file
 * A bare dollar amount is misleading, and the source file says exactly why. So:
 *  · every figure carries "{year} national non-facility, before adjustment" in
 *    its own cell, not in a footnote;
 *  · the five caveats that make a quoted figure wrong (two conversion factors,
 *    geography, sequestration, patient coinsurance, and one-code-one-month)
 *    render as visible prose under the table and CANNOT be dropped by a caller.
 *    `caveats` can add to the set or reword one, never shrink it below those;
 *  · rateBasisLine() and payment.source are rendered per programme in the
 *    sourcing disclosure, so the claim is checkable;
 *  · nothing here says "what you get paid". PROGRAMME_FOOTNOTE closes it: the
 *    practice bills, HANA does not.
 * If a rate ever goes back to being a placeholder, the cell says so instead of
 * printing a number. Do not replace that guard with a hardcoded figure.
 *
 * NOTHING IS INVENTED. Every code, rule, amount and caveat is a field on the
 * content module. The only new copy is the eyebrow, the heading, the body, the
 * caption and the column headers, and none of those states a fact the data does
 * not carry. The module's open TODOs (add-on codes, the three APCM levels, the
 * RTM supply codes, CoCM) stay unrendered rather than guessed at.
 *
 * WHY A REAL TABLE
 * It is tabular data. A <table> with <caption>, <thead> and <th scope> reads
 * correctly to a screen reader and parses correctly to an answer engine, which
 * a grid of divs does not. The scroll container is a focusable, labelled region
 * so a keyboard can reach it, and the page body never scrolls sideways.
 *
 * THE IMPORT PATH IS EXPLICIT ON PURPOSE. src/content/programmes.ts (the older
 * RecipesMarquee card list) and src/content/programmes/index.ts (the programme
 * facts) both exist, and a bare "../../../content/programmes" resolves to the
 * FILE, which exports none of this. Always import ".../content/programmes/index",
 * as EligibilityCheck and WhoDoesWhat do.
 *
 * PRERENDER
 * The build snapshots every route in headless Chrome at 800x600 and never
 * scrolls, and that HTML is what Google and the answer engines read. So the
 * header is a plain <div> with no whileInView entrance (an IntersectionObserver
 * below the fold never fires and Motion would bake opacity:0 onto the <h2>),
 * and the sourcing disclosure is ALWAYS MOUNTED: it collapses by animating a
 * CSS grid row from 0fr to 1fr over overflow-hidden content, the FaqSection
 * technique. An {open && …} anywhere in this file un-indexes the sourcing.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface CodeTableProps {
  /** The programme this page is about. Its row is marked as the current one. */
  data?: Programme;
  /** The rows. Defaults to all four, so a reader can compare. Pass [data] for one. */
  rows?: Programme[];
  eyebrow?: string;
  /** ReactNode so a page can put an <em> in it. */
  heading?: ReactNode;
  body?: string;
  /** Short. It sits inside the scroll container, so it must fit a phone. */
  caption?: string;
  /**
   * Extra or reworded caveats. The five in REQUIRED_CAVEAT_IDS are always shown
   * whatever is passed here; matching an id replaces that one's wording.
   */
  caveats?: RateCaveat[];
  /** The closing line. Defaults to the module's own footnote. */
  footnote?: string;
  /**
   * Link each programme name to its page. Off by default: the module's
   * TODO(url) has not settled PROGRAMME_PATH_PREFIX, and a link to an unwired
   * route is a 404. Turn it on once the routes exist.
   */
  linkPrograms?: boolean;
  /** Sourcing open on first paint. The copy is in the DOM either way. */
  defaultSourcesOpen?: boolean;
  tone?: "light" | "band";
  /** Tighter vertical rhythm, for a table that sits under a denser section. */
  compact?: boolean;
  className?: string;
  id?: string;
}

/* Cannot be dropped. rates.ts: a page showing a figure must carry the basis
   line plus at least sequestration and coinsurance, and CY2026's two conversion
   factors mean there is no single national rate to quote in the first place.
   "modelling" is required here too, and it is required BECAUSE this is a table:
   the row prints the whole code family beside an amount priced on one base
   code, so without it a reader takes the figure as covering the family. RTM is
   the sharp case, 98980 alone with 98975 to 98978 in the same row. */
const REQUIRED_CAVEAT_IDS: RateCaveat["id"][] = [
  "conversion-factor",
  "geography",
  "sequestration",
  "coinsurance",
  "modelling",
];

/* Tone is two grounds over one layout, token-only, so the .cobalt scope carries
   through untouched. The table itself keeps one skin: it sits on a white card
   either way, and cards separate by rule and shadow, not by tone. There is no
   dark variant on purpose. A section separates on bg-band with a hairline; navy
   is for the footer, the announcement bar and filled buttons. */
const TONES = {
  light: {
    section: "bg-paper",
    eyebrow: "text-ink-mute",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-ink-mute",
    heading: "text-ink [&_em]:italic [&_em]:font-normal [&_em]:text-ink",
    body: "text-ink-soft",
  },
} as const;

const TH_COL =
  "px-5 py-4 align-bottom text-left text-[11px] font-bold uppercase tracking-[1.4px] text-ink-soft";
const TD = "px-5 py-5 align-top";

export function CodeTable({
  data,
  rows = PUBLISHED_PROGRAMMES,
  eyebrow = "The billing, in one table",
  heading,
  body,
  caption,
  caveats = RATE_CAVEATS,
  footnote = PROGRAMME_FOOTNOTE,
  linkPrograms = false,
  defaultSourcesOpen = false,
  tone = "light",
  compact = false,
  className,
  id,
}: CodeTableProps = {}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const headingId = `${uid}-code-heading`;
  const captionId = `${uid}-code-caption`;
  const sourcesBtnId = `${uid}-sources-btn`;
  const sourcesPanelId = `${uid}-sources-panel`;
  const [sourcesOpen, setSourcesOpen] = useState(defaultSourcesOpen);
  const skin = TONES[tone];

  /* Every year comes from the rate data. Nothing hardcodes "CY2026". */
  const years = Array.from(new Set(rows.map((p) => p.payment.year).filter(Boolean)));
  const yearLabel = years.length === 1 ? years[0] : years.join(" and ");
  /* Empty when every row is a placeholder, so the copy has to read without it. */
  const yearPrefix = yearLabel ? `${yearLabel} ` : "";

  const headingText: ReactNode =
    heading ??
    (data ? (
      <>
        What you bill for <em>{data.code}</em>.
      </>
    ) : (
      <>
        What you <em>bill</em>, code by code.
      </>
    ));

  const bodyText =
    body ??
    `The codes behind each program, what the calendar month has to show, and the ${yearPrefix}amount. Each figure is one base code for one patient in one month, before adjustment. It is not what the practice collects.`;

  const captionText =
    caption ?? `${yearLabel ? `${yearLabel} amounts` : "Amounts"}, before adjustment.`;

  /* The required ones first, then anything the caller adds. A caller reusing a
     required id replaces its wording and cannot remove it. */
  const caveatMap = new Map<string, RateCaveat>();
  for (const c of RATE_CAVEATS) if (REQUIRED_CAVEAT_IDS.includes(c.id)) caveatMap.set(c.id, c);
  for (const c of caveats) caveatMap.set(c.id, c);
  const shownCaveats = Array.from(caveatMap.values());

  const notes = rows.filter((p) => p.note);

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "px-6 md:px-16 scroll-mt-24",
        compact ? "py-16 md:py-20" : "py-24 md:py-32",
        skin.section,
        className,
      )}
    >
      <div className="mx-auto max-w-[1080px]">
        {/* Plain <div>, not motion.div. See the PRERENDER note at the top. */}
        <div className={compact ? "mb-8" : "mb-10 md:mb-12"}>
          {eyebrow ? (
            <p className={cn("text-eyebrow font-bold uppercase mt-0 mb-4", skin.eyebrow)}>
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal m-0 text-[32px]/[1.1] sm:text-[40px]/[1.1] md:text-h2",
              skin.heading,
            )}
          >
            {headingText}
          </h2>
          {bodyText ? (
            <p className={cn("text-lead mt-6 mb-0 max-w-[62ch]", skin.body)}>{bodyText}</p>
          ) : null}
        </div>

        {/* Dormant today, and it stays. If a figure ever loses its sourcing the
            reader is told before they read the column, not after. */}
        {RATES_ARE_PLACEHOLDER ? (
          <p className="mb-6 border-l-2 border-brand bg-brand-tint py-3 pl-4 pr-4 text-[14px] leading-[1.6] text-ink m-0">
            Some amounts below are not sourced yet. Those rows say so in place of a figure.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-card border border-rule bg-paper-bright shadow-card">
          {/* Focusable and labelled, so a keyboard can scroll it and a screen
              reader announces what it is scrolling. The page body never moves. */}
          <div
            role="region"
            aria-labelledby={captionId}
            tabIndex={0}
            className={cn(
              "overflow-x-auto",
              // ring-inset, because the card above clips overflow and an outset
              // ring on this element would be cut off.
              "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
            )}
          >
            <table className="w-full min-w-[860px] border-collapse text-left">
              {/* Short, because the caption sits inside the scroll container and
                  a long one would need sideways scrolling to read on a phone.
                  The full description rides along for assistive tech. */}
              <caption
                id={captionId}
                className="caption-top max-w-[34ch] px-5 pt-5 pb-4 text-left text-[13px] font-medium text-ink-soft"
              >
                {captionText}
                <span className="sr-only">
                  {" "}
                  One row per program, with the code family, the base code the amount is
                  priced on, what the calendar month has to show, and the national
                  non-facility amount before geographic adjustment, sequestration and
                  patient coinsurance.
                </span>
              </caption>
              <thead>
                <tr className="border-y border-rule bg-paper-2">
                  <th scope="col" className={TH_COL}>
                    Program
                  </th>
                  <th scope="col" className={TH_COL}>
                    Code family
                  </th>
                  <th scope="col" className={TH_COL}>
                    Base code
                  </th>
                  <th scope="col" className={TH_COL}>
                    What the month has to show
                  </th>
                  <th scope="col" className={cn(TH_COL, "min-w-[13rem]")}>
                    {yearPrefix}amount
                    <span className="mt-1 block text-[11px] font-medium normal-case tracking-normal text-ink-soft">
                      National non-facility, before adjustment
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule-soft">
                {rows.map((p) => {
                  const current = data ? p.id === data.id : false;
                  return (
                    <tr
                      key={p.id}
                      aria-current={current ? "true" : undefined}
                      className={current ? "bg-brand-tint" : undefined}
                    >
                      <th scope="row" className={cn(TD, "text-left font-normal")}>
                        <span className="block text-[15px] font-bold text-ink">{p.code}</span>
                        <span className="mt-1 block text-[13px] leading-snug text-ink-soft">
                          {linkPrograms && !current ? (
                            <Link
                              to={p.path}
                              className="text-brand underline underline-offset-2 hover:text-navy"
                            >
                              {p.name}
                            </Link>
                          ) : (
                            p.name
                          )}
                        </span>
                        {/* The current row is marked by more than a tint. */}
                        {current ? (
                          <span className="mt-2 inline-block rounded-pill border border-rule bg-paper-bright px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                            This page
                          </span>
                        ) : null}
                      </th>
                      <td className={cn(TD, "min-w-[10rem] text-[14px] leading-snug text-ink-soft tabular-nums")}>
                        {p.codes}
                      </td>
                      <td className={cn(TD, "text-[15px] font-semibold text-ink tabular-nums")}>
                        {p.payment.code}
                      </td>
                      <td className={cn(TD, "max-w-[40ch] text-[14px] leading-[1.65] text-ink-soft")}>
                        {p.rule}
                      </td>
                      <td className={TD}>
                        {p.payment.placeholder ? (
                          <span className="block text-[15px] font-semibold text-ink-soft">
                            Not sourced yet
                          </span>
                        ) : (
                          <span className="block font-serif text-[24px] leading-none text-ink tabular-nums">
                            {formatUsd(p.payment.rate)}
                          </span>
                        )}
                        <span className="mt-2 block text-[12px] leading-[1.5] text-ink-soft">
                          {p.payment.placeholder
                            ? "No confirmed amount for this code yet."
                            : `${p.payment.year} national non-facility, before adjustment.`}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Other codes in the same family. A row per code rather than a
                    paragraph, because a practice manager is scanning for their
                    own situation and 99491 is a different situation from 99490.
                    Only rendered when a single programme is shown; across four
                    it would be twenty rows of noise. */}
                {rows.length === 1 &&
                  rows[0].alsoBillable?.map((rc) => (
                    <tr key={rc.code} className="align-top border-t border-rule-soft">
                      <td className={TD}>
                        <span className="block text-[13px] font-semibold uppercase tracking-[1px] text-ink-mute">
                          Also billable
                        </span>
                      </td>
                      <td className={TD} />
                      <td className={TD}>
                        <span className="font-mono text-[15px] font-semibold text-ink tabular-nums">
                          {rc.code}
                        </span>
                      </td>
                      <td className={TD}>
                        <span className="block text-[14.5px] leading-[1.55] text-ink-soft">{rc.what}</span>
                        {rc.caveat && (
                          <span className="mt-1.5 block text-[13px] leading-[1.5] text-ink-mute">{rc.caveat}</span>
                        )}
                      </td>
                      <td className={TD}>
                        {/* A code we can name but not price prints words, never
                            a number. formatUsd(0) would render "$0", which reads
                            as "this code pays nothing" rather than "we have not
                            sourced it". See RelatedCode.rate in the content module. */}
                        {rc.rate === undefined ? (
                          <span className="block text-[13.5px] leading-[1.4] text-ink-mute">
                            not sourced
                          </span>
                        ) : (
                          <span className="block font-serif text-[20px] leading-none text-ink tabular-nums">
                            {formatUsd(rc.rate)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* A rule that qualifies the table. Beside it, not under it. */}
        {notes.length > 0 ? (
          <aside className="mt-8 border-l-2 border-brand pl-5">
            <ul role="list" className="m-0 list-none p-0 space-y-3">
              {notes.map((p) => (
                <li key={p.id} className="text-[14px] leading-[1.65] text-ink-soft">
                  <span className="font-bold text-ink">{p.code}</span> {p.note}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        {/* Visible, never a footnote. These are the reasons the numbers above
            are not what lands in the bank. */}
        <div className="mt-10 border-t border-rule pt-8">
          <h3 className="m-0 text-[15px] font-bold text-ink">How to read these amounts</h3>
          <dl className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {shownCaveats.map((c) => (
              <div key={c.id}>
                <dt className="text-[13px] font-bold uppercase tracking-[1.2px] text-ink">
                  {c.label}
                </dt>
                <dd className="mt-2 ml-0 text-[14px] leading-[1.65] text-ink-soft">{c.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Always mounted. Collapsed is a 0fr grid row over overflow-hidden
            content, so the sourcing is in the prerendered HTML either way. Do
            not turn this into {sourcesOpen && …}, and do not collapse it with
            opacity: zero-opacity body text reads as hidden text. */}
        <div className="mt-8 border-t border-rule">
          <h3 className="m-0">
            <button
              type="button"
              id={sourcesBtnId}
              onClick={() => setSourcesOpen((v) => !v)}
              aria-expanded={sourcesOpen}
              aria-controls={sourcesPanelId}
              className={cn(
                "group flex w-full items-center justify-between gap-4 rounded-tile border-0 bg-transparent py-5 text-left",
                "cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand",
              )}
            >
              <span className="text-[15px] font-medium text-ink transition-colors duration-200 group-hover:text-brand">
                Where each amount comes from
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "h-5 w-5 shrink-0 text-brand",
                  reduce ? "" : "transition-transform duration-300",
                  sourcesOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
          </h3>
          <div
            id={sourcesPanelId}
            className={cn(
              "grid motion-reduce:transition-none",
              reduce ? "" : "transition-[grid-template-rows] duration-300 ease-out",
            )}
            style={{ gridTemplateRows: sourcesOpen ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="divide-y divide-rule-soft pb-6">
                {rows.map((p) => (
                  <div key={p.id} className="py-4 first:pt-0">
                    <p className="m-0 text-[13px] font-bold text-ink tabular-nums">
                      {p.code} · {p.payment.code}
                    </p>
                    <p className="mt-1.5 mb-0 text-[13px] leading-[1.65] text-ink-soft">
                      {rateBasisLine(p.payment)}
                    </p>
                    {p.payment.source ? (
                      <p className="mt-1.5 mb-0 text-[12px] leading-[1.6] text-ink-soft">
                        {p.payment.source}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {footnote ? (
          <p className="mt-8 mb-0 max-w-[76ch] text-[13px] leading-[1.7] text-ink-soft">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
