import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { SafetyStack } from "../components/ui/safety-stack";
import { NightSky } from "../components/ui/night-sky";
import { Glyph, RI } from "../components/remote/CompassDashboard";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * HANA Sleep — CPAP Adherence Program. The autonomous follow-up engine for CPAP
 * adherence: reads the device and any wearable, calls the patient like a human
 * would, and documents the follow-up to the chart. One of the HANA Sleep suite
 * of solutions (see HanaSleep.tsx for the umbrella; HanaSleepAnalysis.tsx for the
 * wearable/hypnogram analysis platform). Shares the design language of HANA
 * Remote / HANA Contact (navy + periwinkle, serif display type, motion.dev
 * animation), and reuses the approved home-page and Remote sections: the
 * closed-loop diagram, the five-step flow, the patient agent, and the
 * defense-in-depth Safety Stack.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";
// (readability pass: body copy uses slate-600+, never the lighter grays)

// ── Content ──────────────────────────────────────────────────────────────────

// The five-step sleep flow (ported from Remote's five-step pipeline, applied to
// sleep follow-up): read → interpret → report → follow up → document.
const HOW_SOURCES = ["Any wearable / hypnogram", "CPAP & PAP device data", "Scheduled voice check-ins", "Patient-reported symptoms"];
const HOW_OUTCOMES = ["Higher CPAP adherence", "Every risk flagged", "Documented to the chart"];

const HOW_BLOCKS = [
  {
    key: "Read",
    title: "Read any wearable",
    short: "A hypnogram goes in — no new hardware.",
    detail: "HANA ingests the patient's wearable data — Apple Watch, Oura, Fitbit, Garmin — and reads the hypnogram. Nothing to ship, nothing to charge for, no behavior change asked of the patient.",
    stat: "4+",
    statLabel: "wearables read — Apple Watch, Oura, Fitbit, Garmin",
    proof: "Hypnogram in",
    icon: RI.watch,
  },
  {
    key: "Interpret",
    title: "Interpret the night",
    short: "The night, read in three parts.",
    detail: "Every night is read against clinical best practices and the patient's own history — in three parts, not as one flat number. Clinical insight comes out, not raw device noise.",
    stat: "3-part",
    statLabel: "clinical read of every night",
    proof: "Clinically scored",
    icon: RI.activity,
  },
  {
    key: "Report",
    title: "Two reports, one night",
    short: "One for the clinician, one for the patient.",
    detail: "HANA generates a detailed clinician report — findings, interpretation, risk, recommendations — and a short, plain-language report for the patient. Same night, two audiences.",
    stat: "2",
    statLabel: "reports — one clinical, one human",
    proof: "Clinician + patient",
    icon: RI.clipboard,
  },
  {
    key: "Follow up",
    title: "Call on their schedule",
    short: "A real check-in that remembers the last one.",
    detail: "On the patient's own cadence, HANA calls to review the week, set a small goal, and check adherence — carrying forward every previous conversation. No app, no portal, no login.",
    stat: "96%",
    statLabel: "of patients accepted an AI check-in",
    proof: "Voice + memory",
    icon: RI.phone,
  },
  {
    key: "Document",
    title: "Into the chart",
    short: "Longitudinal trends, ready to act on.",
    detail: "Everything flows back as longitudinal trends — into your dashboard, your EHR, or your inbox. The clinician can agree with or override any interpretation. 150+ EHR integrations.",
    stat: "150+",
    statLabel: "EHR integrations · dashboard · inbox",
    proof: "Direct EHR write-back",
    icon: RI.database,
  },
];

const S_FAQS = [
  {
    q: "Which wearables do you support?",
    a: "Apple Watch, Oura, Fitbit, and Garmin. HANA ingests the hypnogram they already produce and interprets it against clinical best practices — no new hardware to ship, no device to charge for. If a patient doesn't wear one, the phone call still carries the program.",
  },
  {
    q: "Is HANA Sleep a medical device?",
    a: "No. HANA Sleep is clinical decision support, not a medical device. It reads, reports, and follows up — the clinician decides. Every interpretation is presented for the clinician to agree with or override, and nothing acts outside the protocol you define.",
  },
  {
    q: "Do patients need to download an app?",
    a: "Never. HANA calls (or texts, on HIPAA-compliant channels). There's no app to download, no portal to babysit, and no login — which is exactly why patients actually engage. 96% of 10,000 patients said yes to an AI check-in.",
  },
  {
    q: "How does this help with CPAP adherence and the CMS window?",
    a: "The first 90 days decide everything — and it's the window CMS requires adherence data for. About half of CPAP patients quit inside three months, usually silently. HANA is the follow-up that shows up: in production, non-adherence drops from ~50% to ~22%.",
  },
  {
    q: "Can it run in closed environments like the VA?",
    a: "Yes. HANA runs on HIPAA-compliant channels — SMS, fax, voice — with patient consent, and can be sandboxed for closed systems like the VA and military health, where scaling human follow-up is impossible and outside call centers aren't allowed.",
  },
  {
    q: "Does it only do sleep?",
    a: "Sleep and CPAP adherence are the wedge — the sharpest pain and the clearest reimbursement. The same monitoring engine extends to insomnia, chronic-condition coaching, and athletic recovery when you're ready to widen.",
  },
];

// Per-stage animated icon (ported from Remote's five-step flow): a small motif
// that loops while its stage is active. Rings for read/document, dot-matrices
// for the middle stages.
function StageIcon({ stage, active }: { stage: number; active: boolean }) {
  const reduce = useReducedMotion();
  const anim = active && !reduce;
  const fill = active ? "#fff" : "#A7BCF5";
  if (stage === 0 || stage === 4) {
    return (
      <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-14 md:h-14">
        {[10, 18, 26].map((r, i) => (
          <motion.circle
            key={r}
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={fill}
            strokeWidth="2"
            initial={{ opacity: 0.5, scale: 0.7 }}
            animate={anim ? { opacity: [0.6, 0, 0.6], scale: [0.7, 1.1, 0.7] } : { opacity: 0.5, scale: 1 }}
            transition={anim ? { duration: 2.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" } : undefined}
            style={{ transformOrigin: "32px 32px", transformBox: "fill-box" }}
          />
        ))}
        <circle cx="32" cy="32" r="4" fill={fill} />
      </svg>
    );
  }
  const dots: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) dots.push([c, r]);
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-14 md:h-14">
      {dots.map(([c, r], i) => {
        const gx = 14 + c * 12;
        const gy = 14 + r * 12;
        const scatter = stage === 2;
        return (
          <motion.rect
            key={i}
            width="5"
            height="5"
            rx="1.2"
            fill={fill}
            initial={{ x: gx, y: gy, opacity: 0.85 }}
            animate={
              anim
                ? scatter
                  ? { x: [gx, gx + ((i * 7) % 11) - 5, gx], y: [gy, gy + ((i * 5) % 11) - 5, gy], opacity: [0.85, 0.4, 0.85] }
                  : { opacity: [0.3, 1, 0.3] }
                : { x: gx, y: gy, opacity: 0.7 }
            }
            transition={anim ? { duration: 2.4, repeat: Infinity, delay: (i % 4) * 0.12, ease: "easeInOut" } : undefined}
          />
        );
      })}
    </svg>
  );
}

// "How it works" — the five-step sleep pipeline (ported from Remote's
// HowItWorksFlow): sources rail · animated stage cards · outcomes rail, with a
// cross-fading detail panel. Auto-advances on-screen; pauses on hover.
function HowItWorksFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % HOW_BLOCKS.length), 3600);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const cur = HOW_BLOCKS[active];

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Pipeline row: sources · stages · outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_150px] gap-6 lg:gap-5 items-stretch">
        {/* Sources */}
        <div className="hidden lg:flex flex-col justify-center gap-3 text-right">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Sources</p>
          {HOW_SOURCES.map((s) => (
            <p key={s} className="text-[13.5px] text-white/70 leading-snug">{s}</p>
          ))}
        </div>

        {/* Stage cards */}
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto lg:overflow-visible pb-1 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {HOW_BLOCKS.map((b, i) => {
            const is = i === active;
            return (
              <button
                key={b.key}
                onClick={() => setActive(i)}
                aria-pressed={is}
                className={`group relative flex-1 min-w-[150px] lg:min-w-0 snap-start text-left rounded-2xl p-5 transition-all duration-500 ${
                  is ? "bg-[#2347e6] shadow-[0_18px_50px_rgba(35,71,230,0.45)]" : "bg-white/[0.04] hover:bg-white/[0.07]"
                }`}
                style={{ flexGrow: is ? 1.5 : 1 }}
              >
                <div className="h-14 flex items-center">
                  <StageIcon stage={i} active={is} />
                </div>
                <div className={`mt-3 font-semibold text-[15px] ${is ? "text-white" : "text-white/80"}`}>{b.key}</div>
                <motion.p
                  initial={false}
                  animate={{ opacity: is ? 1 : 0, height: is ? "auto" : 0 }}
                  className="overflow-hidden text-[13px] leading-[1.5] text-white/85 mt-1.5 m-0"
                >
                  {b.short}
                </motion.p>
                <span className={`absolute top-4 right-4 text-[11px] font-bold ${is ? "text-white/70" : "text-white/30"}`}>{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Outcomes */}
        <div className="hidden lg:flex flex-col justify-center gap-3">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Outcomes</p>
          {HOW_OUTCOMES.map((o) => (
            <p key={o} className="text-[13.5px] text-white/70 leading-snug">{o}</p>
          ))}
        </div>
      </div>

      {/* Detail panel — cross-fades on stage change */}
      <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 items-center min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-serif font-normal text-[26px] md:text-[30px] text-white mt-0 mb-3">{cur.title}</h3>
            <p className="text-[15px] leading-[1.7] text-white/65 m-0 max-w-[60ch]">{cur.detail}</p>
            <p className="text-[12px] font-semibold tracking-[1.5px] uppercase text-[#A7BCF5] mt-5">{cur.proof}</p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={cur.key + "-stat"}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-[#0b1b34] p-6 text-center"
          >
            <div className="font-serif text-[52px] md:text-[64px] leading-[0.95] text-white">{cur.stat}</div>
            <div className="text-[13px] text-white/80 leading-[1.45] mt-2">{cur.statLabel}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stepper dots */}
      <div className="flex justify-center gap-2.5 mt-7">
        {HOW_BLOCKS.map((b, i) => (
          <button
            key={b.key}
            onClick={() => setActive(i)}
            aria-label={`Show ${b.title}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#A7BCF5]" : "w-2 bg-white/25 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── The patient agent — honesty + memory, conversation over the orb ───────────

// A short CPAP week-one exchange: HANA isn't logging a number, it's holding the
// patient to the plan without judgment. Bubbles reveal one at a time on scroll.
const AGENT_TURNS: { who: "hana" | "patient"; text: string }[] = [
  { who: "hana", text: "Hi Maria, it's HANA for your evening check-in. How many hours did you wear the CPAP last night?" },
  { who: "patient", text: "Honestly? Maybe two. I took it off — it felt too tight." },
  { who: "hana", text: "Thank you for telling me — that's really common in week one. Let's fix the fit, not give up. Try loosening the top strap one notch tonight. Can we aim for four hours?" },
  { who: "patient", text: "Okay. I can try that." },
  { who: "hana", text: "Great. I'll check back tomorrow. You're doing the hard part — showing up." },
];

const AGENT_PILLARS = [
  {
    icon: RI.heart,
    title: "Patients tell it the truth",
    body: "No judgment, no guilt — so patients admit what they'd hide from a doctor: the mask came off, they never plugged it in. That honest answer is the data that actually moves adherence.",
  },
  {
    icon: RI.moon,
    title: "It remembers every call",
    body: "Built-in memory makes each check-in continuous — the goal from last week, the setback, the water by the bed. It behaves like a coach who knows the patient, not a robocall.",
  },
];

function PatientAgentSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#00122F] py-20 md:py-28 px-6 md:px-16">
      {/* soft periwinkle wash + the bloom orb behind the conversation (lower-left,
          low-opacity so it never fights the heading text) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 30% 75%, rgba(167,188,245,0.16) 0%, rgba(0,18,47,0) 60%)" }} />
        <div className="absolute left-[8%] bottom-[-8%] opacity-[0.28] blur-[4px] hidden md:block">
          <div className="scale-[1.7]" style={{ transformOrigin: "center" }}>
            <HanaBloomOrb />
          </div>
        </div>
        {/* fade the wash + orb into solid navy at both edges so the section
            meets the Loop above and the Safety Stack below with no seam */}
        <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, #00122F 0%, rgba(0,18,47,0) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64" style={{ background: "linear-gradient(to bottom, rgba(0,18,47,0) 0%, #00122F 100%)" }} />
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The patient agent</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-white">
            Not just a monitor. <em className="text-[#A7BCF5]">The reason they stick with it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-white/70 max-w-[58ch] mx-auto mt-4">
            Device data alone doesn't change behavior. A patient who feels seen does. HANA is the voice
            on the other end of the line — no judgment, no guilt, just the honest answer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Conversation mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[440px]"
          >
            <div className="rounded-[24px] bg-white/[0.06] backdrop-blur-sm border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)] p-5 md:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-white/10">
                <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-[#A7BCF5]">
                  <Glyph d={RI.phone} className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a1c3d]" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-white">HANA · evening check-in</div>
                  <div className="text-[11px] text-white/50">CPAP adherence · HANA Sleep protocol</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {AGENT_TURNS.map((turn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.3 + i * 0.5 }}
                    className={`flex ${turn.who === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] ${
                        turn.who === "hana"
                          ? "bg-[#5b76d9] text-white rounded-bl-md"
                          : "bg-white/[0.08] text-white/90 border border-white/10 rounded-br-md"
                      }`}
                    >
                      {turn.text}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: reduce ? 1 : 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduce ? 0 : 0.3 + AGENT_TURNS.length * 0.5 }}
                  className="flex items-center gap-2 pt-1 text-[11px] text-white/55"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />
                  Logged to chart · follow-up scheduled for tomorrow
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Two pillars: honesty + memory */}
          <div className="space-y-6">
            {AGENT_PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-white/[0.06] border border-white/10 text-[#A7BCF5] shrink-0">
                  <Glyph d={p.icon} className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.2] mt-0 mb-2 text-white">{p.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-white/70 m-0">{p.body}</p>
                </div>
              </motion.div>
            ))}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="pt-2">
              <p className="font-serif text-[20px] md:text-[22px] leading-[1.3] text-white m-0">
                96% of 10,000 patients said yes to an AI check-in — <em className="text-[#A7BCF5]">because it doesn't feel like a machine.</em>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Small shared bits (Remote patterns) ──────────────────────────────────────

// A before→after outcome stat: the big "after" number, plus two length bars
// (baseline vs HANA) so the delta reads as a visible change on the side.
type DeltaRow = { k: string; pct: number; v: string; hi?: boolean };
function SDeltaStat({ big, suffix, label, rows }: { big: string; suffix?: string; label: string; rows: DeltaRow[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5 md:gap-7">
      <div className="sm:w-[150px] shrink-0">
        <div className="font-serif text-[52px] md:text-[64px] leading-[0.9] text-white">
          {big}
          {suffix && <span className="text-[28px] md:text-[34px] text-[#A7BCF5]">{suffix}</span>}
        </div>
        <div className="text-[14px] text-white/60 leading-[1.5] mt-2">{label}</div>
      </div>
      <div className="flex-1 min-w-0 space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center gap-3">
            <span className={`w-[76px] shrink-0 text-[12px] ${r.hi ? "font-semibold text-[#A7BCF5]" : "text-white/55"}`}>{r.k}</span>
            <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${r.hi ? "bg-[#A7BCF5]" : "bg-white/25"}`}
                initial={{ width: reduce ? `${r.pct}%` : 0 }}
                whileInView={{ width: `${r.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className={`w-11 text-right text-[12px] tabular-nums ${r.hi ? "font-semibold text-white" : "text-white/60"}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SFaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[17px] font-medium text-white transition-colors duration-200 group-hover:text-[#A7BCF5]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#A7BCF5] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`sfaq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[15px] leading-[1.7] text-white/65 pb-5 pr-8 m-0">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// An illustrative hypnogram — the stepped sleep-stage line a wearable already
// produces (Awake · REM · Light · Deep). Draws itself in on scroll. Purely
// decorative: HANA reads a hypnogram like this, it doesn't generate it.
function Hypnogram() {
  const reduce = useReducedMotion();
  const levels: [string, number][] = [["Awake", 24], ["REM", 52], ["Light", 80], ["Deep", 108]];
  const points =
    "46,80 80,80 80,108 110,108 110,80 140,80 140,52 168,52 168,80 196,80 196,108 224,108 224,80 250,80 250,52 276,52 276,24 290,24 290,52 330,52";
  return (
    <svg viewBox="0 0 340 130" className="w-full h-auto" role="img" aria-label="Illustrative hypnogram showing sleep stages across the night">
      {levels.map(([label, y]) => (
        <g key={label}>
          <line x1="46" y1={y} x2="332" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x="6" y={y + 3.5} fill="rgba(255,255,255,0.42)" fontSize="9" fontFamily="'DM Sans', sans-serif">{label}</text>
        </g>
      ))}
      <motion.polyline
        points={points}
        fill="none"
        stroke="#A7BCF5"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.3 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

// Sleep configuration for the shared closed-loop diagram: read the night →
// interpret against guidelines → call the patient → document to the chart.
const SLEEP_LOOP_COPY = {
  eyebrow: "How it works",
  heading: "It reads the night. Then it does something about it.",
  sub: "Not a dashboard you have to check. Any wearable goes in; a clinical read, a call the patient answers, and a note in your chart come out — a loop that runs on its own.",
  center: ["No app. No login.", "No behavior change."] as [string, string],
  centerChips: ["6.4 hrs last night ✓", "Mask leak flagged", "Adherence trending up"],
  offRamp: { station: "engage" as const, label: "Clinician worklist" },
  footnote: "You set the escalation rules. A clinician on every clinical flag, a full record of every call.",
  stations: {
    read: { label: "Read", body: "Ingests any wearable's hypnogram — Apple Watch, Oura, Fitbit, Garmin." },
    reason: { label: "Interpret", body: "Reads the night against clinical best practices and the patient's history." },
    engage: { label: "Call", body: "Phones the patient on their cadence — reviews the week, routes risk to your team." },
    writeback: { label: "Document", body: "A clinician report and a plain-language one — straight to the chart." },
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaSleepCPAP() {
  return (
    <div className="bg-[#00122F] text-white font-sans overflow-x-hidden">
      <SEO
        title="HANA Sleep CPAP Adherence Program — Follow-Up That Finally Shows Up"
        useExactTitle
        type="product"
        description="The HANA Sleep CPAP Adherence Program calls your patients like a human would, holds them to the plan through the first 90 days, and documents every follow-up to the chart — the CPAP adherence follow-up that finally shows up. Clinical decision support, HIPAA-aware by design."
        path="/hana-sleep/cpap"
        keywords="CPAP adherence, CPAP follow-up, CPAP adherence program, RPM, RTM, remote therapeutic monitoring, sleep clinic AI, voice AI sleep medicine, DME adherence, sleep telehealth"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Sleep", url: "https://www.hana.health/hana-sleep" },
          { name: "CPAP Adherence Program", url: "https://www.hana.health/hana-sleep/cpap" },
        ])}
      />

      {/* HERO — immersive night sky (starfield + aurora shader), melting into
          the dark five-step section below */}
      <header className="relative overflow-hidden bg-[#00122F] text-white flex items-center min-h-[86vh] md:min-h-[760px] pt-32 pb-28 md:pt-36 md:pb-40">
        <NightSky />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-16 text-center w-full">
          <motion.p {...fadeUp} className={`${eyebrow} text-[#A7BCF5] m-0`}>
            HANA Sleep · CPAP Adherence Program
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[80px] leading-[1.02] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[16ch]"
          >
            CPAP care that doesn't stop at the <em className="text-[#A7BCF5]">setup.</em>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[17px] md:text-[19px] leading-[1.6] text-white/75 mt-7 mb-0 mx-auto max-w-[52ch]"
          >
            HANA calls your CPAP patients like a human would through the first 90 days, holds them to the plan, and tells you
            <em className="text-[#A7BCF5] not-italic font-semibold"> what the device data can't.</em>
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-9 md:mt-10"
          >
            Book a demo →
          </motion.a>
        </div>
      </header>

      {/* THE FIVE-STEP FLOW — the process, directly below the hero (dark).
          Section backgrounds are chained vertical gradients (bottom of one = top
          of the next) so the whole page reads as one continuously morphing dark
          field rather than flat blocks. */}
      <section className="py-20 md:py-24 px-6 md:px-16 text-white" style={{ background: "linear-gradient(180deg, #00122F 0%, #081a38 100%)" }}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The five-step flow</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[26ch]">
              From a night's data to a documented follow-up — <em className="text-[#A7BCF5]">in five steps.</em>
            </h2>
          </motion.div>
          <HowItWorksFlow />
        </div>
      </section>

      {/* THE GAP — two columns: the statement on the left, the four stats stacked
          as neat cards on the right. */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #081a38 0%, #0c1f40 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — the writing */}
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The gap</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-5">
              Diagnosis is solved. <em className="text-[#A7BCF5]">Everything after isn't.</em>
            </h2>
            <p className="text-[16px] leading-[1.7] text-white/70 m-0 max-w-[46ch]">
              Sleep medicine is great at diagnosis and blind to everything after it. The patient goes
              home, and no one is with them for the three to six months that decide whether treatment
              sticks. Devices show usage and airflow — never the <em>why</em>: the mask leaks, it's
              uncomfortable, they quietly unplugged it.
            </p>
            <p className="text-[18px] md:text-[20px] leading-[1.5] font-semibold text-white mt-7 max-w-[30ch]">
              The problem was never the diagnosis. <span className="text-[#A7BCF5]">It was the follow-up.</span>
            </p>
          </motion.div>

          {/* Right — the four stats, stacked as neat cards */}
          <div className="flex flex-col gap-3">
            {[
              { v: "~50%", l: "of CPAP patients quit within the first three months — most never say so" },
              { v: "3–6 mo", l: "the gap between prescription and treatment where no one is with the patient" },
              { v: "20%", l: "all the engagement an app gets — patients won't open it" },
              { v: "1 call", l: "the difference between a save and a patient lost to treatment" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.04 + i * 0.07 }}
                className="flex items-center gap-5 rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6"
              >
                <div className="font-serif text-[34px] md:text-[44px] leading-[0.95] text-white shrink-0 w-[104px] md:w-[124px]">{s.v}</div>
                <div className="text-[14px] leading-[1.55] text-white/65">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT ANY WEARABLE — we do the integration; the device already
          produces the hypnogram, HANA just reads and interprets it. */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #0c1f40 0%, #00122F 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14 max-w-[62ch] mx-auto">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Connect any wearable</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-4 mx-auto max-w-[22ch]">
              You bring the wearable. <em className="text-[#A7BCF5]">We handle the connection.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/70 m-0">
              Your patients already sleep with a device that scores the night. HANA connects to it,
              pulls the hypnogram it already produces, and interprets it against clinical best practices — no new
              hardware to ship, no app to download, no sleep study to run.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Left — whatever they already wear */}
            <motion.div {...fadeUp}>
              <p className="text-[12px] font-semibold tracking-[1.5px] uppercase text-[#A7BCF5] mb-4">Whatever they already wear</p>
              <div className="grid grid-cols-2 gap-3">
                {["Apple Watch", "Oura", "Fitbit", "Garmin"].map((d) => (
                  <div key={d} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.06] text-[#A7BCF5] shrink-0">
                      <Glyph d={RI.watch} className="w-[18px] h-[18px]" />
                    </span>
                    <span className="text-[14px] font-medium text-white/90">{d}</span>
                  </div>
                ))}
              </div>
              <p className="text-[13.5px] leading-[1.6] text-white/55 mt-4">
                We connect via API — the patient changes nothing. No new hardware, no app to download.
              </p>
            </motion.div>

            {/* Right — the hypnogram it already recorded; HANA interprets it */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold tracking-[1.5px] uppercase text-[#A7BCF5]">The night it already recorded</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                  <Glyph d={RI.activity} className="w-3.5 h-3.5" /> Hypnogram · via API
                </span>
              </div>
              <Hypnogram />
              <p className="text-[14px] leading-[1.65] text-white/65 mt-5 m-0">
                The device makes the hypnogram every night. HANA reads it against{" "}
                <span className="text-white">clinical best practices</span> and acts on it — we don't build the
                hardware or run the study, we interpret what's already there.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE CLOSED LOOP — reuse the home-page loop diagram, configured for sleep */}
      <LoopDiagram copy={SLEEP_LOOP_COPY} pulses={1} />

      {/* THE PATIENT AGENT — honesty + memory, chat over the bloom orb */}
      <PatientAgentSection />

      {/* SECURITY — reuse the home-page defense-in-depth Safety Stack */}
      <SafetyStack />

      {/* THE NUMBERS — two columns: heading + proof chips on the left, the
          delta-stat cards stacked on the right. */}
      <section className="py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #00122F 0%, #0a1c3e 100%)" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — the writing + proof chips */}
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-3`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] mt-0 mb-6 max-w-[16ch] text-white">
              Follow-up you can measure.
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {["Reads Apple Watch · Oura · Fitbit · Garmin", "Clinically-guided interpretation", "Built-in memory across calls", "HIPAA-aware by design", "Clinical decision support — not a device"].map((c) => (
                <span key={c} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[13px] font-medium text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A7BCF5]" aria-hidden="true" />
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — the delta-stat cards, stacked neatly */}
          <div className="flex flex-col gap-4">
            <motion.div {...fadeUp}>
              <SDeltaStat big="96" suffix="%" label="Accepted an AI check-in — of 10,000 patients" rows={[{ k: "Apps", pct: 20, v: "20%" }, { k: "HANA", pct: 96, v: "96%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.06 }}>
              <SDeltaStat big="22" suffix="%" label="CPAP non-adherence, in production" rows={[{ k: "Before", pct: 50, v: "50%" }, { k: "HANA", pct: 22, v: "22%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.06 }}>
              <SDeltaStat big="85" suffix="%" label="CPAP adherence after 12 months on program" rows={[{ k: "Month 1", pct: 38, v: "38%" }, { k: "Month 12", pct: 85, v: "85%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}>
              <SDeltaStat big="2.3" suffix="×" label="More patients followed per coordinator" rows={[{ k: "Baseline", pct: 43, v: "1×" }, { k: "With HANA", pct: 100, v: "2.3×", hi: true }]} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHERE IT FITS — clinical decision-support framing (statement panel) */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #0a1c3e 0%, #00122F 100%)" }}>
        <div className="relative max-w-[820px] mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Where it fits</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-5 mx-auto max-w-[20ch]">
              It sits <em className="text-[#A7BCF5]">under</em> your care. Not in front of it.
            </h2>
            <p className="text-[17px] leading-[1.75] text-white/70 m-0 mx-auto max-w-[62ch]">
              HANA Sleep is clinical decision support, not a medical device. It reads, reports, and
              follows up — you decide. Reports land in your dashboard, your EHR, or your inbox, and you
              can agree with or override any interpretation. It runs on HIPAA-compliant channels with
              patient consent, and can be sandboxed for closed systems like the VA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW WE START — three-step go-live section, same as the homepage */}
      <InlineImageHeader />

      {/* FAQ */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#00122F]">
        <div className="max-w-[820px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Questions? Answers.</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white">
              The things everyone asks.
            </h2>
          </motion.div>
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {S_FAQS.map((f, i) => (
              <SFaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>See the follow-up that finally shows up</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[15ch]">
            See HANA call a sleep patient. <em>Live.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          {/* Transparent terms — true claims only */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["Reads any wearable", "No app to download", "HIPAA-aware by design", "Clinical decision support"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/90 bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-1.5">
                <Check className="w-3.5 h-3.5 text-[#A7BCF5]" strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
