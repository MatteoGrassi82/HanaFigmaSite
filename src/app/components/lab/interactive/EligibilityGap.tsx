import { motion, useReducedMotion } from "motion/react";
import { Arithmetic, BigStat, Dial, Note, Panel, clamp, formatInt, useUrlState } from "./kit";
import { ILLUSTRATIVE_PANEL, ILLUSTRATIVE_SHARE } from "./eligibility-todo-figures";
import { MARKET } from "./rates.todo";

/* ─────────────────────────────────────────────────────────────────────────────
 * EligibilityGap — the subtraction that is the whole argument.
 *
 * THE SHAPE
 * Two dials describe a panel. One subtraction runs off them, set as a sum in
 * type: the eligible line, the enrolled line, a rule, and the difference in the
 * display serif. The difference is the point of the component, so it is the
 * only figure that gets BigStat.
 *
 * THE TWO RATES ARE NOT OURS
 * RATE_ELIGIBLE and RATE_RECEIVING are third-party market figures for the
 * Medicare fee-for-service population, cleared for attributed use. They are
 * attributed on screen, in the component, twice: once beside the arithmetic and
 * once under the dials. They are never presented as HANA's own measurement, and
 * they are never presented as a count of anybody's chart.
 *
 * Both rates share one denominator (Medicare fee-for-service beneficiaries),
 * which is what makes the subtraction honest: 75% and 4% are two slices of the
 * same population, so the difference between them is a real 71%, not two
 * unrelated percentages pushed together.
 *
 * WHAT IS A PLACEHOLDER
 * The dial ranges and their starting positions are NOT figures we have. They
 * live in eligibility-todo-figures.ts, marked, and the component says on screen
 * that they are an illustrative example. The arithmetic is correct at every
 * position of both dials, so nothing rests on where they start.
 *
 * PRERENDER
 * useUrlState returns its start value on the first render, so the headless
 * Chrome snapshot shows the default panel with both real numbers already in it.
 * No effect has to run for this component to say something true.
 *
 * COMPOSED LOCALLY, NOT ADDED TO THE KIT
 * <Term> below is the only thing this file draws itself: one line of the sum,
 * as a three-column grid row so the operator, the figure and the label each get
 * their own column and the digits stay aligned. It is a layout, not a number
 * treatment, and it is specific to a subtraction, so it stays here rather than
 * in kit.tsx. The figure inside it reuses the same inline serif treatment
 * CaseloadSlider already uses for its secondary number.
 * ─────────────────────────────────────────────────────────────────────────── */

/* ── The cleared third-party figures ───────────────────────────────────────
 * Third-party market figures for the Medicare fee-for-service population.
 * Not HANA data. Attributed on screen wherever they are used.
 *
 * ONE SOURCE OF TRUTH, NOT A SECOND COPY.
 * These two percentages already live in MARKET, in rates.todo.ts, which is what
 * RevenueEstimator reads and what the publish checklist in that file says to
 * fill the citation on. Re-typing 75 and 4 here would let this component drift
 * away from its siblings the day either figure is revised, so it reads them.
 * Every percentage on screen below is derived from MARKET, never typed twice.
 */
/** Share of Medicare fee-for-service beneficiaries eligible for CCM. */
const RATE_ELIGIBLE = MARKET.eligiblePct / 100;
/** Share of them receiving it. */
const RATE_RECEIVING = MARKET.receivingPct / 100;
/** The spread between the two rates, in percentage points. */
const GAP_POINTS = MARKET.eligiblePct - MARKET.receivingPct;
/** The citation both rates come from. Pending until rates.todo.ts carries it. */
const RATE_SOURCE = MARKET.citation || "citation pending";

/** The element both dials describe, so a screen reader hears the consequence. */
const GAP_ID = "eligibility-gap-consequence";

interface GapMath {
  /** Medicare fee-for-service patients on the panel. */
  medicare: number;
  /** Of those, the ones eligible for chronic care management. */
  eligible: number;
  /** Of those, the ones receiving it at the national rate. */
  receiving: number;
  /** The difference. Defined as eligible minus receiving so the sum on screen
   *  reconciles exactly against the two rounded figures a reader can see. */
  gap: number;
}

function gapMath(panel: number, sharePct: number): GapMath {
  const medicare = Math.round((panel * sharePct) / 100);
  const eligible = Math.round(medicare * RATE_ELIGIBLE);
  const receiving = Math.round(medicare * RATE_RECEIVING);
  return { medicare, eligible, receiving, gap: eligible - receiving };
}

/* ── One line of the sum ───────────────────────────────────────────────────
 * Three grid columns: operator, figure, label. min-w on the figure reserves the
 * widest value either line can hold, so a 2,000 panel and an 8,000 panel put
 * their digits in exactly the same place and nothing moves as a dial travels.
 */
function Term({ op, value, label }: { op?: string; value: string; label: string }) {
  return (
    <>
      <span
        aria-hidden
        className="font-sans text-[15px] font-semibold text-ink-mute justify-self-end"
      >
        {op ?? ""}
      </span>
      <span className="font-serif font-normal text-[28px] sm:text-[34px] leading-none text-navy tabular-nums text-right min-w-[5ch]">
        {value}
      </span>
      <span className="text-[14px] leading-[1.45] text-ink-soft">{label}</span>
    </>
  );
}

export function EligibilityGap() {
  const reduce = useReducedMotion();

  // Linkable, but the start value is what renders first and what gets indexed.
  // Both parsers snap and clamp, so a stranger's URL cannot put a panel we do
  // not believe, or an off-step value the presets could never match, on screen.
  const [panel, setPanel] = useUrlState<number>("gap.panel", ILLUSTRATIVE_PANEL.start, {
    parse: (raw) => {
      const n = Number(raw);
      if (!Number.isFinite(n)) return null;
      const snapped = Math.round(n / ILLUSTRATIVE_PANEL.step) * ILLUSTRATIVE_PANEL.step;
      return clamp(snapped, ILLUSTRATIVE_PANEL.min, ILLUSTRATIVE_PANEL.max);
    },
  });

  const [share, setShare] = useUrlState<number>("gap.mcare", ILLUSTRATIVE_SHARE.start, {
    parse: (raw) => {
      const n = Math.round(Number(raw));
      if (!Number.isFinite(n)) return null;
      return clamp(n, ILLUSTRATIVE_SHARE.min, ILLUSTRATIVE_SHARE.max);
    },
  });

  const { medicare, eligible, receiving, gap } = gapMath(panel, share);

  /** What a screen reader hears from either dial. The number, then the point. */
  const consequence = (p: number, s: number): string => {
    const m = gapMath(p, s);
    return `${formatInt(p)} patients, ${s}% Medicare fee-for-service. About ${formatInt(
      m.eligible
    )} are eligible for chronic care management and about ${formatInt(
      m.receiving
    )} are getting it, leaving about ${formatInt(m.gap)}.`;
  };

  return (
    <section className="bg-paper py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-eyebrow font-bold uppercase text-brand m-0">Eligibility math</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-h2 leading-[1.08] text-navy max-w-[24ch] mx-auto mt-4 mb-0">
            Three in four Medicare fee-for-service patients qualify.{" "}
            <em className="text-brand">One in twenty-five gets it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[58ch] mx-auto mt-5 mb-0">
            Chronic care management pays for the month of work that happens between visits. Most
            Medicare fee-for-service patients are eligible for it. Very few of them are in a
            program. Describe your panel and the subtraction runs in front of you.
          </p>
        </motion.div>

        <Panel
          className="mt-10 md:mt-14"
          eyebrow="One panel, national rates"
          title="Who qualifies, and who is actually enrolled"
          sub="Two dials, one subtraction. The eligible rate and the enrolled rate are third-party market figures, attributed underneath. The only thing you supply is the size and the payer mix of your own panel."
          footnote={
            <>
              This applies national rates to a panel you describe. It is an estimate of scale, not a
              count from your chart. The rates describe Medicare fee-for-service, so a panel
              weighted toward Medicare Advantage reads differently. Eligibility for any one patient
              still turns on two or more chronic conditions expected to last a year or longer, and
              on consent. HANA makes the calls. Your team reviews and attests, and nothing is billed
              until a person on your team approves it.
            </>
          }
        >
          {/* The split waits for lg, not md. At md the Panel is already at its
              widest padding, so two columns there leave the sum and the preset
              tap-targets narrower than they are on a phone. Full width until
              there is genuinely room for two. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* ── The sum, and its answer. First in the source, so it is first on
                 a phone and first in the snapshot. ── */}
            <div className="rounded-tile border border-rule-soft bg-paper-2 p-5 sm:p-6 md:p-7">
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">
                The gap on this panel
              </p>

              <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] gap-x-2.5 sm:gap-x-4 gap-y-4 items-baseline mt-6">
                <Term
                  value={formatInt(eligible)}
                  label="eligible for chronic care management"
                />
                <Term
                  op="−"
                  value={formatInt(receiving)}
                  label="getting it, at the national rate"
                />
              </div>

              {/* The sum bar. Navy at full strength, because this rule is the
                  argument and not a divider. */}
              <div className="mt-6 border-t border-navy" />

              <BigStat
                className="mt-6"
                value={formatInt(gap)}
                label="patients who qualify, and are not getting it"
                sub={`On a panel of ${formatInt(panel)} where ${share}% is Medicare fee-for-service.`}
                width={5}
                subLines={2}
                tone="brand"
                size="lg"
              />

              {/* min-w holds the widest figure this line can carry, "5,680", so
                  the sentence never re-wraps as a dial travels. text-center
                  keeps a short number sitting in the middle of that reservation
                  instead of stranding a gap before the next word. */}
              <p id={GAP_ID} className="text-[16px] leading-[1.55] text-ink mt-6 mb-0">
                The program is not the constraint. Finding the hours to reach{" "}
                <span className="font-serif text-[26px] leading-none text-navy tabular-nums align-baseline inline-block text-center min-w-[5ch]">
                  {formatInt(gap)}
                </span>{" "}
                people is.
              </p>
            </div>

            {/* ── The two inputs ── */}
            <div>
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">
                Describe your panel
              </p>

              <Dial
                className="mt-6"
                label="Patients on your panel"
                value={panel}
                onChange={setPanel}
                min={ILLUSTRATIVE_PANEL.min}
                max={ILLUSTRATIVE_PANEL.max}
                step={ILLUSTRATIVE_PANEL.step}
                format={(v) => formatInt(v)}
                valueText={(v) => consequence(v, share)}
                presets={ILLUSTRATIVE_PANEL.presets}
                describedBy={GAP_ID}
              />

              <Dial
                className="mt-9"
                label="Medicare fee-for-service share"
                value={share}
                onChange={setShare}
                min={ILLUSTRATIVE_SHARE.min}
                max={ILLUSTRATIVE_SHARE.max}
                step={ILLUSTRATIVE_SHARE.step}
                format={(v) => `${v}%`}
                valueText={(v) => consequence(panel, v)}
                presets={ILLUSTRATIVE_SHARE.presets}
                describedBy={GAP_ID}
              />

              <div className="mt-8 pt-5 border-t border-rule flex items-baseline justify-between gap-4">
                <span className="text-[13.5px] font-semibold text-ink">
                  Medicare patients on it
                </span>
                {/* Pinned to the widest value this line can hold, "8,000", so a
                    dial cannot grow the figure and wrap the label beside it. */}
                <span className="font-serif text-[26px] leading-none text-navy tabular-nums text-right min-w-[5ch]">
                  {formatInt(medicare)}
                </span>
              </div>

              <div className="mt-5">
                <Note>
                  The starting panel size and payer mix are an illustrative example, not a market
                  figure. The two rates underneath are. Move both dials to your own numbers.
                </Note>
              </div>
            </div>
          </div>

          {/* ── The working, and where the rates came from ── */}
          <div className="mt-10 pt-8 border-t border-rule grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-3">
                The arithmetic
              </p>
              <div className="space-y-2">
                <Arithmetic
                  parts={[
                    { value: formatInt(panel), label: "patients" },
                    { value: `${share}%`, label: "Medicare fee-for-service" },
                  ]}
                  result={{ value: formatInt(medicare), label: "Medicare patients" }}
                />
                <Arithmetic
                  parts={[
                    { value: formatInt(medicare), label: "Medicare patients" },
                    { value: `${MARKET.eligiblePct}%`, label: "eligible" },
                  ]}
                  result={{ value: formatInt(eligible), label: "eligible" }}
                />
                <Arithmetic
                  parts={[
                    { value: formatInt(medicare), label: "Medicare patients" },
                    { value: `${MARKET.receivingPct}%`, label: "receiving it" },
                  ]}
                  result={{ value: formatInt(receiving), label: "getting it" }}
                />
                <Arithmetic
                  op="−"
                  parts={[
                    { value: formatInt(eligible), label: "eligible" },
                    { value: formatInt(receiving), label: "getting it" },
                  ]}
                  result={{ value: formatInt(gap), label: "not getting it" }}
                />
              </div>
            </div>

            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-3">
                Where the two rates come from
              </p>
              <Note>
                About {MARKET.eligiblePct}% of Medicare fee-for-service beneficiaries are eligible
                for chronic care management, and about {MARKET.receivingPct}% receive it. Those are
                third-party market figures describing the Medicare fee-for-service population. They
                are not HANA's data, and they are not a measurement of your practice. Source:{" "}
                {RATE_SOURCE}.
              </Note>
              <Note className="mt-3">
                Both rates count the same people, so the two lines in the sum are slices of one
                population and the difference between them is a real {GAP_POINTS} points, not two
                unrelated percentages put next to each other.
              </Note>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
