import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check, ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

/* ── The month, written up before the clinician starts their time ─────────────
 * The point of this one is the TIME LOG, not the note. In Remote, a coordinator
 * starts a timer against a CPT code and every action lands on an activity trail;
 * calls placed through the system are recorded and summarised into that log, so
 * the coordinator does not type the visit up. Dr. Mohamed's favourite part of the
 * build is exactly this: with ConnectCareTeam somebody types every note by hand.
 *
 * So the artefact is a month of CPAP entries that are already written when the
 * clinician presses start. The clock that runs is theirs, and it runs on reading
 * and attesting. HANA's call time sits outside it, labelled, deliberately.
 */
const SLEEP_LOG = [
  {
    day: "Aug 3",
    title: "Night 1 · first check-in",
    body: "Mask felt tight. She took it off at 2h 10m.",
    src: "HANA call · summarised",
    len: "4 min",
  },
  {
    day: "Aug 4",
    title: "Night 2 · fit coaching",
    body: "Top strap loosened a notch. Agreed to try again the same night.",
    src: "HANA call · summarised",
    len: "6 min",
  },
  {
    day: "Aug 6",
    title: "Threshold crossed",
    body: "4h 20m. First night above four hours.",
    src: "Device data · flagged to the threshold you set",
    len: "",
  },
  {
    day: "Aug 10",
    title: "Weekly check-in",
    body: "5h 05m average across the week. Cadence drops to weekly.",
    src: "HANA call · summarised",
    len: "5 min",
  },
];

function mmss(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function SleepNoteBeforeTime() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [secs, setSecs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    // the log is already written; what animates is the clinician's own clock
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setSecs((s) => {
          if (s >= 252) {
            window.clearInterval(id);
            setDone(true);
            return 252;
          }
          return s + 4;
        });
      }, 26);
    }, 900);
    return () => window.clearTimeout(start);
  }, [inView]);

  return (
    <section className="bg-white py-0">
      {/* Full-bleed, not contained (Matteo 2026-08-25): the card ran to a
          1240px column and read as a banner. */}
      <div>
        <motion.div {...fadeUp} className="relative overflow-hidden bg-[#0A1633]">
          <img
            src="/products/remote-patient-call.webp"
            alt="A patient taking a call at home"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,12,26,0.92) 0%, rgba(5,12,26,0.76) 38%, rgba(5,12,26,0.38) 72%, rgba(5,12,26,0.24) 100%)",
            }}
          />

          <div
            ref={ref}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] gap-12 lg:gap-10 items-center px-6 sm:px-10 md:px-16 py-20 md:py-28 lg:min-h-[720px] max-w-[1400px] mx-auto"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E8A06A] text-[#231206] text-[11px] font-bold uppercase tracking-[1.2px] px-2.5 py-1">
                  New program
                </span>
                <span className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.14] backdrop-blur-md border border-white/15 pl-3.5 pr-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-[#5B93FF]" />
                  <span className="text-[13px] font-medium text-white">HANA Sleep</span>
                </span>
              </div>

              <h2 className="font-serif font-normal text-[36px] sm:text-[46px] md:text-[54px] leading-[1.05] tracking-[-0.015em] text-white mt-8 mb-0 max-w-[17ch]">
                The month is written up before you start your time.
              </h2>

              <p className="text-[16px] md:text-[17px] leading-[1.65] text-white/75 mt-7 mb-0 max-w-[50ch]">
                HANA calls the new CPAP patient through the week that decides whether therapy holds,
                and every call is recorded and summarised straight into the time log. When your
                clinician opens the patient, the month is already there. The clock they start runs on
                reading and attesting, not typing.
              </p>

              <div className="mt-9 flex flex-wrap gap-x-10 gap-y-6">
                <div>
                  <p className="font-serif text-[32px] leading-none text-white m-0">0:00</p>
                  <p className="text-[12.5px] leading-[1.5] text-white/60 mt-2 mb-0 max-w-[18ch]">
                    Time your team spends writing the month up
                  </p>
                </div>
                <div>
                  <p className="font-serif text-[32px] leading-none text-white m-0">4</p>
                  <p className="text-[12.5px] leading-[1.5] text-white/60 mt-2 mb-0 max-w-[18ch]">
                    Documented contacts waiting when they open the chart
                  </p>
                </div>
              </div>

              <a
                href="/hana-sleep"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white no-underline mt-9 border-b border-white/30 pb-1 hover:border-white transition-colors"
              >
                See HANA Sleep
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
              </a>
            </div>

            {/* the artefact: the time log, already filled in */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="w-full lg:justify-self-end lg:max-w-[470px] rounded-[22px] bg-white/[0.13] backdrop-blur-xl border border-white/20 p-6 md:p-7 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11.5px] font-bold uppercase tracking-[1.3px] text-white/60 m-0">
                  Time log · an example month
                </p>
                <span className="rounded-full bg-white/15 border border-white/15 text-[11px] font-semibold text-white/85 px-2.5 py-1">
                  RTM 98980
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {SLEEP_LOG.map((e, i) => (
                  <motion.div
                    key={e.day}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[14px] bg-white/[0.07] border border-white/10 px-4 py-3.5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-white">{e.title}</span>
                      <span className="text-[11.5px] tabular-nums text-white/50 shrink-0">
                        {e.day}
                        {e.len ? ` · ${e.len}` : ""}
                      </span>
                    </div>
                    <p className="text-[12.5px] leading-[1.55] text-white/70 mt-1.5 mb-0">{e.body}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#9EC1FF] mt-2 mb-0">
                      {e.src}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* the clinician's clock, the only one that counts */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-[1.3px] text-white/60 m-0">
                      Your clinician's time
                    </p>
                    <p className="text-[12.5px] text-white/50 mt-1 mb-0">Review and attest</p>
                  </div>
                  <p className="font-serif text-[34px] leading-none text-white tabular-nums m-0">
                    {mmss(secs)}
                  </p>
                </div>

                <div className="relative mt-4 h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4ECB8B] transition-[width] duration-100 ease-linear"
                    style={{ width: `${(secs / 252) * 100}%` }}
                  />
                </div>

                <motion.span
                  initial={false}
                  animate={{ opacity: done ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white text-[#0A1633] text-[14px] font-semibold px-5 py-2.5 rounded-full mt-5"
                >
                  <Check className="w-3.5 h-3.5 text-[#2F8F6B]" strokeWidth={3.2} />
                  {done ? "Attested by the treating clinician" : "Attest and submit"}
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
