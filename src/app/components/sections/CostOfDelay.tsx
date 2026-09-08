import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  afterSequestration,
  medicareShare,
  programmeById,
  SEQUESTRATION_PCT,
  PART_B_COINSURANCE_PCT,
} from "../../../content/programmes/index";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CostOfDelay — a month you do not bill is gone, as a table.
 *
 * WHY A TABLE, AND WHY THIS PAGE. Matteo, 8 Sept 2026: /compare/vs-doing-nothing
 * "doesn't have to include heroes ... could be a table. Be more inventive." He
 * is right, and the reason is that this page is a different KIND of comparison
 * from its two siblings. Those compare a thing to a thing -- software, or
 * contracted staff -- so two columns are the natural shape. This one compares
 * NOW TO LATER, and nothing anywhere on the site argued time.
 *
 * THE ARGUMENT, WHICH IS THE PART WORTH GETTING RIGHT.
 * Chronic care management is billed FOR A CALENDAR MONTH in which the service
 * was actually furnished. There is no mechanism to go back and bill January in
 * March, because the twenty minutes did not happen in January. So a month
 * nobody worked is not deferred revenue, it is revenue that has stopped
 * existing. That is what makes "doing nothing" cost something, and it is the
 * one claim on this page that needs no market figure, no projection and no
 * HANA number: it follows from how the code is defined.
 *
 * WHAT IS EXACT AND WHAT IS NOT.
 *   EXACT: every figure in the table is `months x rate`, taken off the same
 *   CY2026 rate in rates.ts that PayVisual and the estimator use. The net
 *   column applies afterSequestration and medicareShare from the content
 *   module, so it moves with those constants rather than restating them.
 *   NOT A FORECAST: the table is per ONE eligible, unenrolled patient who
 *   would have been enrolled and billable from month one. Real enrolment
 *   ramps, patients lapse, and some months miss the twenty minutes. The
 *   footnote says so. It is a ceiling on one patient, not a projection for a
 *   panel.
 *
 * NO INVENTED PANEL MULTIPLIER. The obvious move is a "x 100 patients" column,
 * and it would be fiction: the multiplier would be picked to make the number
 * look big. Instead the reader supplies it. The optional `unenrolled` prop is
 * wired to whatever the page already computed above (EligibilityGap's own
 * dials), so the total is the reader's own arithmetic continued, not ours.
 *
 * ACCESSIBILITY IS NOT DECORATION HERE. This is a real <table> with a
 * <caption>, scoped <th>s and a <tfoot>, because a screen reader meeting four
 * rows of dollar figures needs the row and column headers to make sense of
 * them. A grid of divs would look identical and read as noise.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface CostOfDelayProps {
  /** Which programme's rate to reason from. Defaults to CCM. */
  programme?: "ccm" | "apcm" | "bhi" | "pcm";
  /** The reader's own unenrolled-eligible count, if the page has one. */
  unenrolled?: number;
  eyebrow?: string;
  heading?: ReactNode;
  body?: string;
  tone?: "light" | "band";
  id?: string;
}

/** The waits a practice actually deliberates over. Not a smooth series. */
const WAITS = [
  { months: 1, label: "One month", note: "“let us look at it after month end”" },
  { months: 3, label: "One quarter", note: "“next quarter, when things are calmer”" },
  { months: 6, label: "Six months", note: "“after the EHR migration”" },
  { months: 12, label: "A year", note: "the decision nobody made" },
];

const usd = (n: number) =>
  n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(2)}`;

export function CostOfDelay({
  programme = "ccm",
  unenrolled,
  eyebrow = "The cost of waiting",
  heading,
  body,
  tone = "band",
  id = "cost-of-delay",
}: CostOfDelayProps) {
  const reduce = useReducedMotion();
  const [showNet, setShowNet] = useState(false);
  const p = programmeById(programme)!;
  const rate = p.payment.rate;

  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.5 } };

  const TH = "text-[12px] font-bold uppercase tracking-[1.2px] text-ink-mute px-4 py-3 align-bottom";
  const TD = "px-4 py-4 align-top border-t border-rule-soft";

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", tone === "band" ? "bg-band border-y border-rule" : "bg-paper")}
    >
      <div className="max-w-[1000px] mx-auto">
        <motion.div {...fade} className="max-w-[64ch]">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-4">
            {heading ?? <>A month you do not bill <em>is gone.</em></>}
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0">
            {body ??
              `${p.code} is billed for a calendar month in which the work was actually done. There is no way to go back and bill January in March, because the minutes did not happen in January. So waiting does not defer this revenue. It ends it.`}
          </p>
        </motion.div>

        <motion.div {...fade} className="mt-9">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-[13px] text-ink-mute m-0">
              Per one eligible patient who is not enrolled.
            </p>
            {/* Gross is the headline figure everywhere else on this site, so it
                leads here too; the net is one tap away rather than a footnote,
                because a biller asks for it immediately. */}
            <button
              type="button"
              onClick={() => setShowNet((v) => !v)}
              aria-pressed={showNet}
              className="inline-flex items-center gap-2 rounded-pill border border-rule bg-paper-bright px-4 py-2 text-[13px] font-semibold text-ink hover:border-rule-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {showNet ? "Showing what you net" : "Show what you net"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-card border border-rule bg-paper-bright shadow-card">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Billable months lost per unenrolled eligible patient, by how long the decision waits
              </caption>
              <thead>
                <tr className="bg-paper-2">
                  <th scope="col" className={TH}>The wait</th>
                  <th scope="col" className={cn(TH, "text-right")}>Billable months<br />gone</th>
                  <th scope="col" className={cn(TH, "text-right")}>
                    {showNet ? "Net, per patient" : "Gross, per patient"}
                  </th>
                  {unenrolled !== undefined && (
                    <th scope="col" className={cn(TH, "text-right")}>
                      On your {unenrolled.toLocaleString("en-US")}<br />unenrolled
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {WAITS.map((w) => {
                  const gross = rate * w.months;
                  const net = medicareShare(afterSequestration(rate)) * w.months;
                  const shown = showNet ? net : gross;
                  const last = w.months === 12;
                  return (
                    <tr key={w.months} className={last ? "bg-brand-tint/45" : undefined}>
                      <th scope="row" className={cn(TD, "font-normal")}>
                        <span className={cn("block text-[16px] text-ink", last && "font-semibold")}>{w.label}</span>
                        <span className="block text-[13px] leading-[1.5] text-ink-soft mt-1">{w.note}</span>
                      </th>
                      <td className={cn(TD, "text-right")}>
                        <span className="font-serif text-[22px] leading-none text-ink tabular-nums">{w.months}</span>
                      </td>
                      <td className={cn(TD, "text-right")}>
                        <span className={cn("font-serif leading-none text-ink tabular-nums", last ? "text-[30px]" : "text-[24px]")}>
                          {usd(shown)}
                        </span>
                      </td>
                      {unenrolled !== undefined && (
                        <td className={cn(TD, "text-right")}>
                          <span className={cn("font-serif leading-none text-ink tabular-nums", last ? "text-[30px]" : "text-[24px]")}>
                            {usd(shown * unenrolled)}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-rule">
                  <td colSpan={unenrolled !== undefined ? 4 : 3} className="px-4 py-4">
                    <p className="text-[13px] leading-[1.6] text-ink-soft m-0">
                      {showNet ? (
                        <>
                          Net applies the {SEQUESTRATION_PCT}% sequestration and takes off the standard{" "}
                          {PART_B_COINSURANCE_PCT}% Part B patient coinsurance, so it is the Medicare
                          share only. Still before geographic adjustment.
                        </>
                      ) : (
                        <>
                          {p.payment.code} at the {p.payment.year} national non-facility amount of{" "}
                          {usd(rate)}, before geographic adjustment. Not what you collect.
                        </>
                      )}
                    </p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-[13px] leading-[1.65] text-ink-mute mt-4 mb-0 max-w-[76ch]">
            A ceiling on one patient, not a forecast for a panel. It assumes a patient who would have
            been eligible, consented and billable from the first month. Real enrolment ramps, patients
            lapse, and some months miss the twenty minutes.
            {unenrolled === undefined && " Multiply by your own unenrolled count from the panel above."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CostOfDelay;
