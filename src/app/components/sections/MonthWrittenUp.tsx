import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Check, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * MonthWrittenUp — the time log, already full when the clinician presses start.
 *
 * GENERALISED FROM SleepNoteBeforeTime on 7 Sept 2026, which is now a thin
 * wrapper over this with the CPAP log. Matteo pointed at that section as one
 * of the ones with soul ("the message written out before you start the time")
 * and asked for it on the programme pages. The artefact is the same on every
 * programme: a month of HANA contacts that are already written, and the only
 * clock that runs is the clinician's, on reading and attesting. What changes
 * per programme is the entries, the badge and the code chip -- so those are
 * props and nothing else is.
 *
 * WHY THE POINT IS THE TIME LOG AND NOT THE NOTE. In Remote a coordinator starts
 * a timer against a CPT code and every action lands on an activity trail; calls
 * placed through the system are recorded and summarised into that log, so
 * nobody types the visit up. Dr Mohamed's favourite part of the build is
 * exactly this. HANA's call time sits outside the clinician's clock, labelled,
 * deliberately: it is never billed as clinical time.
 *
 * FULL-BLEED, NOT CONTAINED (Matteo 2026-08-25): contained, the card ran to a
 * 1240px column and read as a banner.
 *
 * THE CLOCK ANIMATES TO `clockSecs` AND STOPS. It is the clinician's review
 * time on the example month, not a live timer and not a claim about any real
 * month. The entries say "an example month" in the card header for the same
 * reason.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface LogEntry {
  day: string;
  title: string;
  body: string;
  /** Where it came from: "HANA call · summarised", "Device data · flagged …". */
  src: string;
  len?: string;
}

export interface MonthWrittenUpProps {
  entries: LogEntry[];
  /** Small amber badge, e.g. "New program" or the programme code. */
  badge: string;
  /** The pill beside it, e.g. "HANA Sleep" or "Chronic Care Management". */
  pill: string;
  /** The code chip on the card, e.g. "RTM 98980". */
  chip: string;
  heading?: ReactNode;
  body: string;
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string };
  image?: { src: string; alt: string };
  /** Where the clinician's clock stops, in seconds. */
  clockSecs?: number;
  id?: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function MonthWrittenUp({
  entries,
  badge,
  pill,
  chip,
  heading = <>The month is written up before you start your time.</>,
  body,
  stats,
  cta,
  image = { src: "/products/remote-patient-call.webp", alt: "A patient taking a call at home" },
  clockSecs = 252,
  id,
}: MonthWrittenUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [secs, setSecs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const start = window.setTimeout(() => {
      const idt = window.setInterval(() => {
        setSecs((s) => {
          if (s >= clockSecs) { window.clearInterval(idt); setDone(true); return clockSecs; }
          return s + 4;
        });
      }, 26);
    }, 900);
    return () => window.clearTimeout(start);
  }, [inView, clockSecs]);

  return (
    <section id={id} className="scroll-mt-24 bg-paper-bright py-0">
      <div>
        <motion.div {...fadeUp} className="relative overflow-hidden bg-navy">
          <img src={image.src} alt={image.alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(5,12,26,0.92) 0%, rgba(5,12,26,0.76) 38%, rgba(5,12,26,0.38) 72%, rgba(5,12,26,0.24) 100%)" }} />
          <div ref={ref} className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] gap-12 lg:gap-10 items-center px-6 sm:px-10 md:px-16 py-20 md:py-28 lg:min-h-[720px] max-w-[1400px] mx-auto">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-signal-amber text-[#231206] text-[11px] font-bold uppercase tracking-[1.2px] px-2.5 py-1">{badge}</span>
                <span className="inline-flex items-center gap-2.5 rounded-full bg-paper-bright/[0.14] backdrop-blur-md border border-white/15 pl-3.5 pr-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-brand-soft" />
                  <span className="text-[13px] font-medium text-white">{pill}</span>
                </span>
              </div>
              <h2 className="font-serif font-normal text-[36px] sm:text-[46px] md:text-[54px] leading-[1.05] tracking-[-0.015em] text-white mt-8 mb-0 max-w-[17ch]">{heading}</h2>
              <p className="text-[16px] md:text-[17px] leading-[1.65] text-white/75 mt-7 mb-0 max-w-[50ch]">{body}</p>
              {stats && stats.length > 0 && (
                <div className="mt-9 flex flex-wrap gap-x-10 gap-y-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-serif text-[32px] leading-none text-white m-0 tabular-nums">{s.value}</p>
                      <p className="text-[12.5px] leading-[1.5] text-white/60 mt-2 mb-0 max-w-[18ch]">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
              {cta && (
                <a href={cta.href} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-white no-underline mt-9 border-b border-white/30 pb-1 hover:border-white transition-colors">
                  {cta.label}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
                </a>
              )}
            </div>

            {/* the artefact: the time log, already filled in */}
            <motion.div
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="w-full lg:justify-self-end lg:max-w-[470px] rounded-[22px] bg-paper-bright/[0.13] backdrop-blur-xl border border-white/20 p-6 md:p-7 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Was "Time log", which, with a CPT code chip and HANA's call lengths
                    summing past 20 minutes, read as HANA's minutes meeting the
                    code. They never do (CMS CCM FAQ p.1). Changed 8 Oct 2026. */}
                <p className="text-[11.5px] font-bold uppercase tracking-[1.3px] text-white/60 m-0">HANA's contacts · an example month</p>
                <span className="rounded-full bg-paper-bright/15 border border-white/15 text-[11px] font-semibold text-white/85 px-2.5 py-1">{chip}</span>
              </div>
              <div className="mt-5 space-y-3">
                {entries.map((e, i) => (
                  <motion.div key={e.day + e.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[14px] bg-paper-bright/[0.07] border border-white/10 px-4 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-white">{e.title}</span>
                      <span className="text-[11.5px] tabular-nums text-white/50 shrink-0">{e.day}{e.len ? ` · ${e.len}` : ""}</span>
                    </div>
                    <p className="text-[12.5px] leading-[1.55] text-white/70 mt-1.5 mb-0">{e.body}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#9EC1FF] mt-2 mb-0">{e.src}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-[12px] leading-[1.5] text-white/60 mt-4 mb-0">
                HANA's call time is never counted as clinical time. The billable minutes are your staff's, logged as they work.
              </p>
              {/* the clinician's clock, the only one that counts */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-[1.3px] text-white/60 m-0">Your clinician's time</p>
                    <p className="text-[12.5px] text-white/50 mt-1 mb-0">Reviewing what HANA wrote up</p>
                  </div>
                  <p className="font-serif text-[34px] leading-none text-white tabular-nums m-0">{mmss(secs)}</p>
                </div>
                <div className="relative mt-4 h-1.5 rounded-full bg-paper-bright/15 overflow-hidden">
                  <div className="h-full rounded-full bg-[#4ECB8B] transition-[width] duration-100 ease-linear" style={{ width: `${(secs / clockSecs) * 100}%` }} />
                </div>
                <motion.span initial={false} animate={{ opacity: done ? 1 : 0.35 }} transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 bg-paper-bright text-navy text-[14px] font-semibold px-5 py-2.5 rounded-full mt-5">
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

export default MonthWrittenUp;
