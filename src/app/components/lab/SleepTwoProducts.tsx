import { motion, useReducedMotion } from "motion/react";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

/* ── HANA Sleep, as its two actual products ────────────────────────────────
 * Matteo, 2026-08-19: build the sleep section out of the two HANA Sleep
 * products rather than inventing a third framing.
 *   · /hana-sleep/analysis — wearable-agnostic analysis. It READS the hypnogram
 *     consumer wearables and Type III/IV home tests already produce; it does not
 *     generate one. Clinical decision support, complements HST and PSG.
 *   · /hana-sleep/cpap — the CPAP adherence programme. The coach: calls through
 *     the first 90 days and documents every follow-up to the chart.
 * Both claims are lifted from those live pages, so nothing new is asserted here.
 */
// The first week on therapy, as the adherence programme sees it. The 4h line is
// Medicare's threshold; pct is the bar width against an eight-hour night, so 48%
// is where the threshold sits.
const SLEEP_NIGHTS = [
  { n: "Night 1", hrs: "2h 10m", pct: 26, note: "Mask felt tight. She took it off.", call: false },
  { n: "Night 2", hrs: "1h 40m", pct: 20, note: "HANA calls. Loosen the top strap one notch.", call: true },
  { n: "Night 4", hrs: "4h 20m", pct: 52, note: "Over the threshold for the first time.", call: false },
  { n: "Night 7", hrs: "5h 05m", pct: 61, note: "Habit forming. Cadence drops to weekly.", call: false },
];

const HYPNO_LEVELS: [string, number][] = [["Awake", 22], ["REM", 50], ["Light", 78], ["Deep", 106]];
const HYPNO_POINTS =
  "46,78 80,78 80,106 110,106 110,78 140,78 140,50 168,50 168,78 196,78 196,106 224,106 224,78 250,78 250,50 276,50 276,22 290,22 290,50 330,50";

export function SleepTwoProducts() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1240px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>HANA Sleep</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            Reading the night is one job. <em className="text-[#2563EB]">Keeping the therapy is another.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[58ch] mx-auto mt-5 mb-0">
            HANA Sleep is two things, and a Remote patient can have both. One reads the night the
            patient is already recording. The other calls them until the therapy sticks.
          </p>
        </motion.div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ── Analysis: the hypnogram ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative rounded-[26px] overflow-hidden bg-[#0A1633] p-8 md:p-10 flex flex-col min-h-[560px]"
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 15% 0%, rgba(96,165,250,0.28) 0%, rgba(96,165,250,0) 62%), radial-gradient(70% 60% at 100% 100%, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0) 60%)",
              }}
            />
            <div className="relative z-10 flex flex-col h-full">
              <span className="inline-flex self-start items-center gap-2.5 rounded-full bg-paper-bright/[0.12] backdrop-blur-md border border-white/15 pl-3.5 pr-4 py-2">
                <span className="w-2 h-2 rounded-full bg-[#5B93FF]" />
                <span className="text-[13px] font-medium text-white">HANA Sleep Analysis</span>
              </span>

              {/* the artefact: a hypnogram, drawing itself in */}
              <div className="mt-8 rounded-[18px] bg-paper-bright/[0.06] border border-white/10 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-white/60 m-0">
                    One night, as the wearable recorded it
                  </p>
                  <p className="text-[11px] text-white/45 m-0">23:10 to 06:40</p>
                </div>
                <svg
                  viewBox="0 0 340 124"
                  className="w-full h-auto mt-3"
                  role="img"
                  aria-label="Illustrative hypnogram showing sleep stages across one night"
                >
                  {HYPNO_LEVELS.map(([label, y]) => (
                    <g key={label}>
                      <line x1="46" y1={y} x2="332" y2={y} stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                      <text x="6" y={y + 3.5} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="var(--font-sans)">
                        {label}
                      </text>
                    </g>
                  ))}
                  <motion.polyline
                    points={HYPNO_POINTS}
                    fill="none"
                    stroke="var(--color-brand-soft)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.3 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                </svg>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  {["Apple Watch", "Oura", "Fitbit", "Garmin", "Type III & IV home tests"].map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-paper-bright/[0.08] border border-white/10 text-white/75 text-[11.5px] font-medium px-2.5 py-1"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-serif font-normal text-[26px] md:text-[30px] leading-[1.15] text-white mt-8 mb-0 max-w-[22ch]">
                What is actually going on in the night.
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-white/75 mt-4 mb-0 max-w-[46ch]">
                Every wearable and every home sleep test already records a hypnogram. HANA Sleep
                reads it against clinical best practice and the patient's own baseline, night after
                night, so the pattern shows up instead of one number on one morning.
              </p>

              <div className="mt-auto pt-7">
                <a
                  href="/hana-sleep/analysis"
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white no-underline border-b border-white/30 pb-1 hover:border-white transition-colors"
                >
                  See HANA Sleep Analysis
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </a>
                <p className="text-[12.5px] leading-[1.6] text-white/55 mt-5 mb-0 max-w-[48ch]">
                  Clinical decision support. It reads the hypnogram, it does not produce one, and it
                  complements home testing and PSG rather than replacing them.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── CPAP adherence: the coach, with a human in it ── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative rounded-[26px] overflow-hidden bg-[#0A1633] p-8 md:p-10 flex flex-col min-h-[560px]"
          >
            {/* cropped to the face, and the scrim stays light across the top so the
                person reads through the glass panel rather than disappearing */}
            <img
              src="/products/remote-patient-call.webp"
              alt="A patient taking a call at home"
              className="absolute inset-0 w-full h-full object-cover object-[52%_12%]"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,12,26,0.34) 0%, rgba(5,12,26,0.62) 42%, rgba(5,12,26,0.93) 78%, rgba(5,12,26,0.97) 100%)",
              }}
            />
            <div className="relative z-10 flex flex-col h-full">
              <span className="inline-flex self-start items-center gap-2.5 rounded-full bg-paper-bright/[0.14] backdrop-blur-md border border-white/15 pl-3.5 pr-4 py-2">
                <span className="w-2 h-2 rounded-full bg-[#E8A06A]" />
                <span className="text-[13px] font-medium text-white">CPAP Adherence Program</span>
              </span>

              {/* the artefact: the first week, and the call that saved it */}
              <div className="mt-8 rounded-[18px] bg-paper-bright/[0.10] backdrop-blur-xl border border-white/15 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-white/65 m-0">
                    An example first week
                  </p>
                  <p className="text-[11px] text-white/55 m-0">4h threshold</p>
                </div>
                <div className="mt-4 space-y-3.5">
                  {SLEEP_NIGHTS.map((x, i) => (
                    <div key={x.n}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-[12.5px] font-semibold text-white">{x.n}</span>
                        <span
                          className="text-[13px] font-semibold tabular-nums"
                          style={{ color: x.pct >= 48 ? "#7BE0A8" : "#F0B183" }}
                        >
                          {x.hrs}
                        </span>
                      </div>
                      <div className="relative mt-1.5 h-2 rounded-full bg-paper-bright/15 overflow-hidden">
                        <span aria-hidden className="absolute inset-y-0 left-[48%] w-[2px] bg-paper-bright/45 z-10" />
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: x.pct >= 48 ? "#4ECB8B" : "#E8A06A" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${x.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <p className={`text-[12px] leading-[1.5] mt-1.5 mb-0 ${x.call ? "text-[#9EC1FF] font-semibold" : "text-white/65"}`}>
                        {x.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-serif font-normal text-[26px] md:text-[30px] leading-[1.15] text-white mt-8 mb-0 max-w-[22ch]">
                Somebody has to call in week one.
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-white/75 mt-4 mb-0 max-w-[46ch]">
                Ninety days decides whether the therapy holds and whether the device stays covered.
                HANA calls on the cadence the protocol sets, coaches the strap and the dry mouth and
                the claustrophobia, and writes every follow-up into the chart before your clinician
                starts their time.
              </p>

              <div className="mt-auto pt-7">
                <a
                  href="/hana-sleep/cpap"
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white no-underline border-b border-white/30 pb-1 hover:border-white transition-colors"
                >
                  See the CPAP Adherence Program
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </a>
                <p className="text-[12.5px] leading-[1.6] text-white/55 mt-5 mb-0 max-w-[48ch]">
                  HANA coaches comfort and habit. Pressure and prescription changes stay with your
                  sleep clinician, and HANA's call time is never billed as clinical time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
