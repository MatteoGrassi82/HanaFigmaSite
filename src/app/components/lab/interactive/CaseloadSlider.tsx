import { motion, useReducedMotion } from "motion/react";
import { Arithmetic, BigStat, Dial, Note, Panel, clamp, formatInt, useUrlState } from "./kit";

/* ─────────────────────────────────────────────────────────────────────────────
 * CaseloadSlider — the minute is the constraint.
 *
 * FRAMING (fixed, from the brand brief): minutes lead, caseload follows. The
 * headline figure is the minute. The caseload is what the minute implies, it is
 * shown second, it is always shown with its division, and it is never presented
 * as a promise about a real panel.
 *
 * EVERY FIGURE HERE IS HANA'S OWN, from LOOP_MATH in src/app/pages/RemoteV2.tsx:
 *   45 to 60 min   what a coordinator spends on one enrolled patient today,
 *                  when the calling, the chasing and the note are done by hand
 *   120 to 160     the caseload that caps at, which is why programs stall
 *   29 min         what HANA is built for. Same coordinator, same hours,
 *                  toward 250 patients
 *
 * MONTH_MINUTES is derived from those figures, not invented. The two ends of
 * HANA's published range describe the same month of coordination time:
 *   120 patients × 60 min = 7,200      160 patients × 45 min = 7,200
 * That constant is what makes the range internally consistent, and dividing it
 * by 29 gives 248, which is the "toward 250" in the same data. So the dial does
 * one honest division and shows it. Nothing here is a new claim.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Minutes of coordination time in one coordinator's month. See the note above. */
const MONTH_MINUTES = 7200;

/** The status quo. Hand-run, the slow end of HANA's own 45 to 60. */
const MINUTES_TODAY = 60;

/** What HANA is built for. */
const MINUTES_HANA = 29;

const PRESETS = [
  { value: 60, label: "60 min", note: "hand-run today" },
  { value: 45, label: "45 min", note: "the fast end of today" },
  { value: MINUTES_HANA, label: "29 min", note: "what HANA is built for" },
];

function caseloadFor(minutes: number): number {
  return Math.floor(MONTH_MINUTES / minutes);
}

/** What is true at this pace. Three bands, each one a statement we can defend. */
function paceCopy(minutes: number): string {
  if (minutes >= 45)
    return "Hand-run. The calling, the chasing and the note are all done by hand.";
  if (minutes > MINUTES_HANA)
    return "Part of the work has come off the coordinator's hands. The month stretches further.";
  return "What HANA is built for. Same coordinator, same hours.";
}

export function CaseloadSlider() {
  const reduce = useReducedMotion();

  // Linkable, but the default is what renders first and what gets indexed.
  // The parse rejects anything outside the range, so a stranger's URL cannot
  // put a figure on this page that we do not stand behind.
  const [minutes, setMinutes] = useUrlState<number>("min", MINUTES_TODAY, {
    parse: (raw) => {
      const n = Math.round(Number(raw));
      return Number.isFinite(n) ? clamp(n, MINUTES_HANA, MINUTES_TODAY) : null;
    },
  });

  const caseload = caseloadFor(minutes);

  return (
    <section className="bg-paper-2 py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-eyebrow font-bold uppercase text-brand m-0">Caseload math</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-h2 leading-[1.08] text-navy max-w-[24ch] mx-auto mt-4 mb-0">
            The minute leads. <em className="text-brand">The caseload follows.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[58ch] mx-auto mt-5 mb-0">
            Care management is bought in minutes. Run by hand, one enrolled patient costs a
            coordinator 45 to 60 minutes a month, and that minute is what caps the panel. Move it and
            watch what the same person can hold.
          </p>
        </motion.div>

        <Panel
          className="mt-10 md:mt-14"
          eyebrow="One coordinator, one month"
          title="Minutes per patient, per month"
          sub="Drag the dial, or tap a pace. The caseload underneath is a division of the same month, done in front of you."
          footnote={
            <>
              This is a division, not a guarantee. A real panel carries no-shows, escalations and
              patients who need far more than the average, and no month divides that cleanly. HANA
              makes the calls. Your team reviews and attests, and nothing is billed until a person on
              your team approves it.
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* ── The input, and the number it sets ── */}
            <div>
              <BigStat
                value={minutes}
                unit="min"
                label="per patient, per month"
                sub={paceCopy(minutes)}
                width={2}
                subLines={2}
              />

              <Dial
                className="mt-8"
                label="Minutes per patient, per month"
                value={minutes}
                onChange={setMinutes}
                min={MINUTES_HANA}
                max={MINUTES_TODAY}
                step={1}
                format={(v) => `${v} min`}
                valueText={(v) =>
                  `${v} minutes per patient per month, about ${caseloadFor(v)} patients for one coordinator`
                }
                presets={PRESETS}
                describedBy="caseload-consequence"
              />
            </div>

            {/* ── The consequence, second, with its working shown ── */}
            <div className="rounded-tile border border-rule-soft bg-paper-2 p-6 md:p-7">
              <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">
                What that pace implies
              </p>

              <p
                id="caseload-consequence"
                className="text-[16px] leading-[1.55] text-ink mt-4 mb-0"
              >
                At {minutes} minutes a patient, one coordinator holds about{" "}
                <span className="font-serif text-[30px] leading-none text-brand tabular-nums align-baseline inline-block min-w-[3ch]">
                  {formatInt(caseload)}
                </span>{" "}
                patients.
              </p>

              <div className="mt-6 pt-5 border-t border-rule">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-ink-mute m-0 mb-2.5">
                  The arithmetic
                </p>
                <Arithmetic
                  op="÷"
                  parts={[
                    { value: `${formatInt(MONTH_MINUTES)} min`, label: "in the month" },
                    { value: `${minutes} min`, label: "per patient" },
                  ]}
                  result={{ value: formatInt(caseload), label: "patients" }}
                />
              </div>

              <div className="mt-5">
                <Note>
                  Where the month comes from. HANA's own figures put a hand-run patient at 45 to 60
                  minutes and cap the caseload at 120 to 160. Both ends are the same 7,200 minutes,
                  so that is the month this divides.
                </Note>
              </div>

              {/* Fixed height, because this line swaps as the dial passes 29. */}
              <div className="mt-4 min-h-[64px]">
                {minutes === MINUTES_HANA ? (
                  <Note>
                    29 minutes is what HANA is built for, and 7,200 divided by 29 is why the target
                    we quote is a panel moving toward 250. Same coordinator, same hours.
                  </Note>
                ) : (
                  <Note>
                    29 minutes is the pace HANA is built for. Take the dial there and the caseload it
                    implies is the one our own numbers quote.
                  </Note>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
