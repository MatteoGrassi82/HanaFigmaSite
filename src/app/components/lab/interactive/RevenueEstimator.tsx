import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Arithmetic, BigStat, Dial, Note, Panel, clamp, formatInt, useUrlState } from "./kit";
import { cn } from "../../../../lib/utils";
import {
  MARKET,
  NATIONAL_ENROLLMENT_PCT,
  PROGRAMME_RATES,
  RATES_ARE_PLACEHOLDER,
  type ProgrammeRate,
  isProgrammeId,
  rateFor,
} from "./rates";

/* ─────────────────────────────────────────────────────────────────────────────
 * RevenueEstimator — what a month of one program comes to.
 *
 * THE ARGUMENT
 * A care management program pays per enrolled patient, per calendar month. So
 * the monthly figure is not really a question about the rate, which is set for
 * you. It is a question about enrollment, which is not. That is why the rate is
 * shown as a multiplier sitting still while the panel and the enrollment move.
 *
 * THIS COMPONENT IS BLOCKED ON FACTS, AND IT SAYS SO ON THE PAGE.
 * The confirmed CMS payment amounts are not in this repo and are not invented
 * here. Every dollar figure comes from ./rates.ts, every entry there is
 * flagged `placeholder: true`, and while any flag is true this renders a large
 * amber notice at the top of the section and a marker on the rate itself.
 * Filling in rates.ts is the only place a rate changes. No JSX
 * changes, no copy changes: the notice is driven by the data.
 *
 * WHERE THE NUMBERS COME FROM
 *   Panel presets ..... dial positions on the eligible-panel axis, and nothing
 *                       more. They are deliberately NOT the caseload figures in
 *                       LOOP_MATH (src/app/pages/RemoteV2.tsx): those count
 *                       ENROLLED patients a coordinator carries, and enrolled
 *                       here is panel x enrollment, so the two are different
 *                       axes and must not share a dial. See CaseloadSlider for
 *                       the caseload question, which is a separate component.
 *   Program facts ..... the verified set in ProgramsStack.tsx and
 *                       src/content/programmes.ts, carried into rates.ts.
 *   Default enrollment  4 in 100 Medicare fee-for-service beneficiaries receive
 *                       chronic care management, against about 75 in 100 who
 *                       qualify. Roughly 5 enrolled for every 100 eligible.
 *                       Third-party figures, attributed on the page, and the
 *                       division is shown rather than asserted.
 *   Dollar amounts .... none. See above.
 *
 * COMPOSED LOCALLY, NOT ADDED TO THE KIT
 * `TapRow` and `PlaceholderPill` live in this file. The kit has one selection
 * pattern, the presets inside <Dial>, and it is bound to a slider. This needs
 * the same tap-target treatment without a slider under it, twice, so the row is
 * rebuilt here against the kit's own classes rather than editing kit.tsx. If a
 * third component wants it, promote it then.
 *
 * THE RULES, CHECKED
 *   1. One dial. Everything else is a tap. No fields, no submit, no reset.
 *   2. The output is one figure, set large in the serif.
 *   3. It updates on every input event.
 *   4. Both multiplications are printed underneath.
 *   5. The default state says something true: where the country actually is.
 *   6. Every value worth landing on is one 52px tap away, at every width.
 *   7. useReducedMotion, tabular figures, reserved widths and heights.
 *   8. Nothing waits on an effect, so the prerendered snapshot is the default.
 * ─────────────────────────────────────────────────────────────────────────── */

const PANEL_MIN = 50;
const PANEL_MAX = 2000;
const PANEL_STEP = 10;
const PANEL_DEFAULT = 250;

/** Starting points on the eligible panel. Not claims. See the header note. */
const PANEL_PRESETS = [
  { value: 160, label: "160", note: "a small eligible panel" },
  { value: PANEL_DEFAULT, label: "250", note: "a mid-size eligible panel" },
  { value: 1000, label: "1,000", note: "a larger eligible panel" },
];

/** Share of the eligible panel actually enrolled. The first one is the country. */
const ENROLL_STEPS = [
  {
    value: NATIONAL_ENROLLMENT_PCT,
    label: `${NATIONAL_ENROLLMENT_PCT}%`,
    note: "the national pace today",
  },
  { value: 25, label: "25%", note: "a quarter of the panel" },
  { value: 50, label: "50%", note: "half the panel" },
];

const DEFAULT_PROGRAMME: ProgrammeRate["id"] = "ccm";

/** 780 → "$780". Whole dollars, because a month is not measured in cents. */
function formatUSD(value: number): string {
  return `$${formatInt(value)}`;
}

/** 60 → "$60.00". The multiplier keeps its cents, because a fee schedule does. */
function formatRate(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ── PlaceholderPill ───────────────────────────────────────────────────────
 * The marker that rides beside any figure that is not confirmed yet. Amber is
 * a signal token, and a rate nobody has checked is exactly what a signal is
 * for. It disappears on its own when rates.ts is filled in.
 */
function PlaceholderPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill bg-signal-amber px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[1.4px] text-navy",
        className
      )}
    >
      Placeholder rate
    </span>
  );
}

/* ── TapRow ────────────────────────────────────────────────────────────────
 * A row of tap-targets, styled as the kit's dial presets. Always visible, 52px
 * tall, one tap per value. This is the whole control on touch, and it is the
 * control on a desktop too, which is why there is no slider under it.
 */
interface TapOption<T extends string | number> {
  value: T;
  label: string;
  note?: string;
}

interface TapRowProps<T extends string | number> {
  legend: string;
  options: TapOption<T>[];
  value: T;
  onChange: (next: T) => void;
  cols: 3 | 4;
  className?: string;
}

function TapRow<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  cols,
  className,
}: TapRowProps<T>) {
  return (
    <fieldset className={cn("m-0 p-0 border-0 min-w-0", className)}>
      <legend className="p-0 mb-4 text-[13.5px] font-semibold text-ink">{legend}</legend>
      <div
        className={cn(
          "grid gap-2",
          cols === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
        )}
      >
        {options.map((option, i) => {
          const on = option.value === value;
          return (
            <button
              key={`${String(option.value)}-${i}`}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={on}
              className={cn(
                "min-h-[52px] px-3 py-2 rounded-tile border text-left cursor-pointer transition-colors",
                on ? "border-brand bg-brand-tint" : "border-rule bg-paper hover:border-brand-soft"
              )}
            >
              <span
                className={cn(
                  "block text-[14px] font-semibold tabular-nums",
                  on ? "text-brand" : "text-navy"
                )}
              >
                {option.label}
              </span>
              {option.note && (
                <span className="block text-[11.5px] leading-[1.35] text-ink-soft mt-0.5">
                  {option.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── The section ───────────────────────────────────────────────────────────── */

export function RevenueEstimator() {
  const reduce = useReducedMotion();

  // Linkable, but the default is what renders first and what gets indexed. Each
  // parse rejects what this component will not stand behind, so a stranger's
  // URL cannot put a panel size, an enrollment rate or a program on the page
  // that is not one of the ones offered here.
  const [programId, setProgramId] = useUrlState<ProgrammeRate["id"]>(
    "prog",
    DEFAULT_PROGRAMME,
    { parse: (raw) => (isProgrammeId(raw) ? raw : null) }
  );

  const [panel, setPanel] = useUrlState<number>("rev.panel", PANEL_DEFAULT, {
    parse: (raw) => {
      const n = Math.round(Number(raw) / PANEL_STEP) * PANEL_STEP;
      return Number.isFinite(n) ? clamp(n, PANEL_MIN, PANEL_MAX) : null;
    },
  });

  const [enrollPct, setEnrollPct] = useUrlState<number>(
    "enroll",
    NATIONAL_ENROLLMENT_PCT,
    {
      parse: (raw) => {
        const n = Math.round(Number(raw));
        return ENROLL_STEPS.some((s) => s.value === n) ? n : null;
      },
    }
  );

  const program = rateFor(programId);
  const enrolled = Math.round(panel * (enrollPct / 100));
  const monthly = Math.round(enrolled * program.rate);

  const programOptions: TapOption<ProgrammeRate["id"]>[] = PROGRAMME_RATES.map((r) => ({
    value: r.id,
    label: r.short,
    note: r.code,
  }));

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
          <p className="text-eyebrow font-bold uppercase text-brand m-0">Program math</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-h2 leading-[1.08] text-navy max-w-[24ch] mx-auto mt-4 mb-0">
            The rate is set. <em className="text-brand">The enrollment is not.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[60ch] mx-auto mt-5 mb-0">
            A care management program pays per enrolled patient, per calendar month. Medicare sets
            the rate. You set how much of your eligible panel is actually on the program, and that is
            where the whole figure comes from. In {MARKET.dataYear}, about{" "}
            {MARKET.receivingPctOfEligible} in 100 Medicare fee-for-service patients who qualified
            for chronic care management were actually enrolled in it.
          </p>
        </motion.div>

        {/* ── The blocker, stated where nobody can miss it ────────────────── */}
        {RATES_ARE_PLACEHOLDER && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            role="note"
            className="max-w-[840px] mx-auto mt-10 rounded-card border-2 border-dashed border-signal-amber bg-paper-bright shadow-card p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={22}
                strokeWidth={2}
                aria-hidden="true"
                className="text-signal-amber shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-eyebrow font-bold uppercase text-navy m-0">
                    Illustrative only
                  </p>
                  <PlaceholderPill />
                </div>
                <p className="text-[14.5px] leading-[1.65] text-ink-soft mt-3 mb-0 max-w-[64ch]">
                  Every dollar amount below is a stand-in. The confirmed Medicare payment amounts are
                  not in yet, so the multiplier is a round number holding the place of one. The
                  arithmetic is real and you can check it. The rate is not. Do not quote this figure
                  to a customer.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <Panel
          className="mt-8 md:mt-10"
          eyebrow="One program, one month"
          title="What a month of this program comes to"
          sub="Pick a program, set the eligible panel, choose how much of it is enrolled. The figure moves as you do. The rate is the multiplier, and it sits still."
          footnote={
            <>
              This is an estimate, not a quote, and not billing advice. It models one base code per
              enrolled patient per calendar month. It leaves out the additional-time codes, the
              geographic adjustment, sequestration and the patient's share, and it assumes every
              enrolled patient is billable every month, which no real month is. Check the rules
              against your MAC before you rely on them. HANA makes the calls. Your team reviews and
              attests, and nothing is billed until a person on your team approves it.
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* ── The inputs, and the number they set ── */}
            <div>
              <TapRow<ProgrammeRate["id"]>
                legend="Program"
                options={programOptions}
                value={programId}
                onChange={setProgramId}
                cols={4}
              />

              <div
                className={cn(
                  "mt-8 rounded-tile p-5 sm:p-6",
                  program.placeholder
                    ? "border border-dashed border-signal-amber bg-paper"
                    : "border border-rule-soft bg-paper"
                )}
              >
                <BigStat
                  value={formatUSD(monthly)}
                  label="estimated, per month"
                  sub={
                    <>
                      {formatInt(enrolled)} of {formatInt(panel)} eligible patients enrolled on{" "}
                      {program.short}.{" "}
                      {program.placeholder
                        ? "Read the shape of this, not the size."
                        : `${program.code}, ${program.year} rate.`}
                    </>
                  }
                  width={8}
                  subLines={3}
                />
              </div>

              <Dial
                className="mt-8"
                label="Eligible patients on your panel"
                value={panel}
                onChange={setPanel}
                min={PANEL_MIN}
                max={PANEL_MAX}
                step={PANEL_STEP}
                format={(v) => formatInt(v)}
                valueText={(v) =>
                  `${formatInt(v)} eligible patients, about ${formatInt(
                    Math.round(v * (enrollPct / 100))
                  )} enrolled at ${enrollPct} percent`
                }
                presets={PANEL_PRESETS}
                describedBy="revenue-estimate-consequence"
              />

              {/* Reserved height: this copy swaps with the program. */}
              <div className="mt-5 md:min-h-[104px]">
                <Note>
                  Eligibility is yours to count. {program.short} asks for this: {program.eligible}{" "}
                  The marks on the dial are starting points, not claims about your panel, so drag it
                  to your own count. How many enrolled patients one coordinator can carry is a
                  separate question, and it is asked of the enrolled figure, not this one.
                </Note>
              </div>

              <TapRow<number>
                className="mt-8 pt-8 border-t border-rule-soft"
                legend="How much of that panel is enrolled"
                options={ENROLL_STEPS}
                value={enrollPct}
                onChange={setEnrollPct}
                cols={3}
              />
            </div>

            {/* ── The consequence, with its working shown ── */}
            <div className="rounded-tile border border-rule-soft bg-paper-2 p-6 md:p-7">
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">
                How the figure is built
              </p>

              <p
                id="revenue-estimate-consequence"
                className="text-[16px] leading-[1.55] text-ink mt-4 mb-0 min-h-[84px]"
              >
                <span className="tabular-nums font-semibold">{formatInt(enrolled)}</span> enrolled
                patients on {program.short} {program.code}, at {formatRate(program.rate)} each, comes
                to{" "}
                <span className="font-serif text-[30px] leading-none text-brand tabular-nums align-baseline inline-block min-w-[8ch]">
                  {formatUSD(monthly)}
                </span>{" "}
                a month.
              </p>

              {/* The multiplier. It is the one figure on this page we do not set,
                  and the one figure on this page nobody has confirmed yet. */}
              <div
                className={cn(
                  "mt-6 rounded-tile p-4 sm:p-5 flex items-center gap-4",
                  program.placeholder
                    ? "border border-dashed border-signal-amber bg-paper"
                    : "border border-rule bg-paper"
                )}
              >
                <span
                  aria-hidden="true"
                  className="font-serif text-[32px] leading-none text-ink-mute"
                >
                  ×
                </span>
                <div className="min-w-0">
                  <p className="font-serif font-normal text-[30px] leading-none text-navy tabular-nums m-0">
                    {formatRate(program.rate)}
                  </p>
                  <p className="text-[12.5px] leading-[1.5] text-ink-soft mt-2 mb-0 md:min-h-[38px]">
                    per enrolled patient, per month · {program.name} · {program.codes}
                  </p>
                  {program.placeholder && <PlaceholderPill className="mt-3" />}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-rule">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  The arithmetic
                </p>
                <Arithmetic
                  op="×"
                  parts={[
                    { value: formatInt(panel), label: "eligible patients" },
                    { value: `${enrollPct}%`, label: "enrolled" },
                  ]}
                  result={{ value: formatInt(enrolled), label: "on the program" }}
                />
                <Arithmetic
                  className="mt-2"
                  op="×"
                  parts={[
                    { value: formatInt(enrolled), label: "on the program" },
                    { value: formatRate(program.rate), label: "per patient, per month" },
                  ]}
                  result={{ value: formatUSD(monthly), label: "a month" }}
                />
              </div>

              {/* Reserved height: this copy swaps with the program. */}
              <div className="mt-5 md:min-h-[70px]">
                <Note>What the code pays for. {program.basis}</Note>
              </div>

              {/* Fixed height, because this line swaps the day the rates land. */}
              <div className="mt-4 min-h-[86px]">
                {program.placeholder ? (
                  <Note>
                    Where the rate does not come from. Nobody has checked {program.code} against a
                    fee schedule yet, so {formatRate(program.rate)} is a round stand-in and nothing
                    more. Replace it in rates.ts and this figure becomes real.
                  </Note>
                ) : (
                  <Note>
                    Where the rate comes from. {program.code}, national non-facility payment amount,
                    Medicare Physician Fee Schedule {program.year}. Source: {program.source}.
                  </Note>
                )}
              </div>

              <div className="mt-4">
                <Note>
                  Where the default enrollment comes from. In {MARKET.dataYear},{" "}
                  {MARKET.eligiblePct}% of Medicare fee-for-service beneficiaries were potentially
                  eligible for chronic care management, and {NATIONAL_ENROLLMENT_PCT}% of those
                  eligible received any. That {NATIONAL_ENROLLMENT_PCT}% is where this page starts.
                  It describes {MARKET.dataYear} and enrollment has grown since, so it is a floor to
                  argue from, not a current rate. Source: {MARKET.citation}.
                </Note>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
