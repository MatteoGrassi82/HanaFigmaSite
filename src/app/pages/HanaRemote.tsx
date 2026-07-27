import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";
import { RecipesMarquee } from "../components/RecipesMarquee";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { CompassDashboard, Glyph, RI } from "../components/remote/CompassDashboard";
import { Stats } from "../components/ui/statistics-card";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * HANA Remote — product page for the engagement layer that sits on top of
 * remote care programs (CCM / APCM / BHI / RTM / ACCESS / Sleep, plus RPM where
 * the practice already has devices).
 *
 * POSITIONING GUARDRAIL — read before editing copy on this page.
 * "Device-less RPM" is not a claim we make. RPM codes (99453/99454/99457) require
 * an FDA-defined medical device that transmits data automatically; patient
 * self-report does not qualify, and DOJ's first RPM False Claims settlement
 * (Health Wealth Safe, $1.29M) was exactly this fact pattern. So:
 *   - device-less = CCM / APCM / BHI / ACCESS (and RTM where a SaMD determination
 *     applies). Voice check-ins are legitimately the covered activity there.
 *   - RPM is supported as an *engagement layer* on top of the customer's existing
 *     devices — device/wearable API data, never self-reported readings.
 *   - HANA never "generates billable minutes" or "auto-bills". It prepares
 *     structured documentation; a named clinician's time is what is billed, and
 *     that clinician attests. Keep every billing string phrased that way.
 *
 * Shares the design language and interaction patterns of the HANA Contact page:
 * light field, navy + periwinkle, serif display type, slider calculator, tabbed
 * explorer, stat band, FAQ. Signature piece: an animated SaaS-dashboard mock
 * (worklist / patient timeline / billing readiness).
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

// The five-step monitoring flow (ported from Contact's five-step-flow pipeline,
// applied to device-free care management): enroll → check in → flag → escalate → document.
const HOW_SOURCES = ["New enrollments", "Scheduled check-ins", "Wearable & device data", "Patient-reported symptoms"];
const HOW_OUTCOMES = ["Higher adherence", "Every flag reviewed", "Documentation that holds up"];

const HOW_BLOCKS = [
  {
    key: "Enroll",
    title: "Enroll by phone, on day one",
    short: "Consent and onboarding on a call — no app to download.",
    detail: "HANA Remote calls the patient, explains the program, captures consent, and sets up the right clinical protocol for their condition. No device to ship, no app to download, no behavior change asked of the patient.",
    stat: "Day 1",
    statLabel: "consent + onboarding, entirely by phone",
    proof: "Consent captured on the call",
  },
  {
    key: "Check in",
    title: "Check in on the right cadence",
    short: "The conversation is the care contact.",
    detail: "Scheduled voice calls capture symptoms, adherence, and how the plan is actually going, in the patient's language, on the cadence their protocol needs. Where a device is part of the program, its readings flow in via API alongside the conversation.",
    stat: "85%",
    statLabel: "pick up and engage — vs 20% for apps",
    proof: "Voice + wearable data",
  },
  {
    key: "Flag",
    title: "Flag what matters",
    short: "45+ clinical protocols score every response.",
    detail: "Every answer is scored against the protocol — MSK, CPAP/sleep, diabetes, hypertension, behavioral health, post-op, chronic care. When a threshold trips or risk rises, HANA surfaces it instead of burying it in a log.",
    stat: "45+",
    statLabel: "clinical protocols across conditions",
    proof: "Protocol-scored in real time",
  },
  {
    key: "Escalate",
    title: "Escalate to a clinician",
    short: "A clinician on every flag — the rest is handled.",
    detail: "Clinical flags route straight to your worklist with the full context of the call. Your team reviews only what matters, on one flagged queue — not a phone list and not every check-in.",
    stat: "1",
    statLabel: "flagged worklist is all your team reviews",
    proof: "Straight to the worklist",
  },
  {
    key: "Document",
    title: "Document to the EHR",
    short: "Structured data, ready for your clinician to attest.",
    detail: "The moment the call ends, structured data is written back to your EHR — attributed to the named clinician who owns the patient, ready for their review and attestation across CCM, APCM, BHI, RTM and ACCESS Pathway 4. 150+ integrations.",
    stat: "150+",
    statLabel: "EHR integrations · CCM · APCM · RTM",
    proof: "Direct EHR write-back",
  },
];

// Which workflow tags (RecipesMarquee) are the clinical / monitoring-program ones
// — the workflows behind these programs (not front-desk intake/refills). Includes
// the Italian tag twins so the marquee filters correctly in either locale.
const PROGRAM_WORKFLOW_TAGS = [
  "Outreach", "Behavioral Health", "Surgery", "Testing", "ADHD",
  "Cronicità", "Salute Mentale", "Chirurgia", "Esami", "Aderenza", "Prevenzione",
];

const R_FAQS = [
  {
    q: "Do my patients need a device or an app?",
    a: "Not for the programs HANA Remote runs device-free — CCM, APCM, behavioral health integration and ACCESS, where the covered activity is the care-management contact itself. Nothing is shipped, downloaded, or charged to the patient. If your patients already use wearables or connected devices, that device data flows in via API alongside the conversation.",
  },
  {
    q: "Is this device-less RPM?",
    a: "No, and we're deliberate about that. RPM codes (99453/99454/99457) require an FDA-defined medical device that transmits readings automatically — a patient reading a number to us over the phone does not satisfy them, and billing RPM that way is what the DOJ's first RPM False Claims settlement was about. On RPM, HANA Remote is the engagement layer on top of the devices you already use: the device transmits, HANA keeps the patient engaged and transmitting. The device-free programs are CCM, APCM, BHI and ACCESS.",
  },
  {
    q: "Does this replace my clinicians' billable time?",
    a: "No — the opposite. We don't replace the clinician's billable interaction, and HANA's call time is not billed as clinical time. HANA captures the data, drives the adherence, and prepares the documentation so your clinician reviews a flagged worklist and attests, instead of chasing patients.",
  },
  {
    q: "How does the billing actually work?",
    a: "HANA Remote produces the documentation the codes require; your qualified staff supply and attest to the time. Every interaction is written back as a structured note attributed to a named clinician, across CCM, APCM, BHI, RTM (98975–98981) and ACCESS Pathway 4 — so the person who bills is the person who did the clinical work, with the record to show it.",
  },
  {
    q: "We already run RPM with devices. Why would we add this?",
    a: "Because the devices aren't the problem — engagement is. HANA Remote is the engagement layer that keeps your existing RPM program transmitting: it handles the between-visit contact, chases the days where the device went quiet, and recovers the patients who've drifted. The readings still come from the device, exactly as the codes require.",
  },
  {
    q: "What happens if we get audited?",
    a: "You export the month and hand it over. Every check-in stores its transcript and structured note, every care-management minute is attributed to the named clinician who supplied it, every escalation records who received it and what they did, and program consent is captured in the patient's own words on the enrollment call. That's the packet an auditor asks for — assembled as the program runs, not reconstructed afterwards.",
  },
  {
    q: "What is ACCESS, and can we use HANA Remote for it?",
    a: "ACCESS is the CMS program launched in July 2026. HANA Remote is live inside ACCESS — if you're an enrolled participant or working toward enrollment, HANA Remote serves as your engagement layer under Pathway 4.",
  },
  {
    q: "What languages do you support?",
    a: "HANA calls patients in any language they speak, switching automatically per patient — no separate configuration or phone lines required.",
  },
];

// Per-stage animated icon (ported from Contact's five-step flow): a small motif
// that loops while its stage is active. Rings for enroll/document, dot-matrices
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

// "How it works" — the five-step monitoring pipeline (ported from Contact's
// FrontDeskPipeline): sources rail · animated stage cards · outcomes rail, with
// a cross-fading detail panel. Auto-advances on-screen; pauses on hover.
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

// ── Sleep / CPAP recovery calculator (Contact calculator chassis) ────────────

const HANA_NONADHERENCE = 22; // % non-adherent with HANA, in production
const PER_PATIENT_DEFAULT = 1400;

function SleepCalculator() {
  const [setups, setSetups] = useState(300);
  const [nonAdherence, setNonAdherence] = useState(50); // current %
  const [perPatient, setPerPatient] = useState(PER_PATIENT_DEFAULT);

  const { patientsSaved, recovered } = useMemo(() => {
    const delta = Math.max(0, nonAdherence - HANA_NONADHERENCE) / 100;
    const saved = setups * 12 * delta;
    return { patientsSaved: saved, recovered: saved * perPatient };
  }, [setups, nonAdherence, perPatient]);

  const money = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
  const count = (n: number) => Math.round(n).toLocaleString();

  const field = (
    label: string,
    value: number,
    set: (v: number) => void,
    opts: { min: number; max: number; step?: number; prefix?: string; suffix?: string },
  ) => (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-slate-600">{label}</span>
        <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1 focus-within:border-[#5b76d9] focus-within:ring-2 focus-within:ring-[#5b76d9]/20 transition shrink-0">
          {opts.prefix && <span className="text-slate-500 text-[13px] mr-0.5">{opts.prefix}</span>}
          <input
            type="number"
            value={value}
            min={opts.min}
            step={opts.step}
            onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
            className="w-[64px] bg-transparent outline-none text-[15px] font-semibold text-[#00122F] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {opts.suffix && <span className="text-slate-500 text-[13px] ml-0.5">{opts.suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        value={Math.min(value, opts.max)}
        min={opts.min}
        max={opts.max}
        step={opts.step ?? 1}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-3 w-full h-1.5 cursor-pointer accent-[#5b76d9]"
      />
    </div>
  );

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,18,47,0.08)]"
    >
      <div className="bg-white p-7 md:p-9">
        <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-5`}>Your sleep / DME program</p>
        <div className="grid grid-cols-1 gap-5">
          {field("New CPAP setups / month", setups, setSetups, { min: 25, max: 1000, step: 25 })}
          {field("Current 90-day non-adherence", nonAdherence, setNonAdherence, { min: 25, max: 83, suffix: "%" })}
          {field("Reimbursement per adherent patient", perPatient, setPerPatient, { min: 500, max: 3000, step: 100, prefix: "$" })}
        </div>
        <p className="text-[12px] text-slate-500 mt-5 leading-[1.6]">
          Estimates only, for illustration. Assumes HANA Remote brings non-adherence to ~22%, its
          production figure. 46–83% of new CPAP patients fail Medicare's 90-day threshold today.{" "}
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-[#5b76d9] underline">Get a tailored assessment →</a>
        </p>
      </div>
      <div className="bg-[#00122F] text-white p-7 md:p-9 flex flex-col justify-center">
        <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-3`}>Patients kept adherent</p>
        <div className="font-serif text-[56px] md:text-[72px] leading-[0.95]">
          ≈ {count(patientsSaved)}
          <span className="font-sans text-[18px] md:text-[22px] font-medium text-white/75"> / year</span>
        </div>
        <p className="text-[15px] text-white/80 mt-3">
          That's roughly <span className="font-semibold text-white">{money(recovered)}/year</span> in reimbursement that currently walks out the door.
        </p>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[15px] leading-[1.6] text-white/80 m-0">
            Recovered with a phone call that actually works — non-adherence drops from{" "}
            <span className="font-semibold text-[#A7BCF5]">{nonAdherence}% to ~22%</span> in production.
          </p>
          <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#A7BCF5]"
              initial={{ width: "0%" }}
              whileInView={{ width: `${Math.max(0, Math.min(100, ((nonAdherence - HANA_NONADHERENCE) / Math.max(nonAdherence, 1)) * 100))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold tracking-[1px] uppercase text-white/40 mt-2">
            <span>Share of non-adherence eliminated</span>
            <span>{nonAdherence > 0 ? Math.round(((nonAdherence - HANA_NONADHERENCE) / nonAdherence) * 100) : 0}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── The patient agent — accountability + protocol, conversation over the orb ──

// A short behavioral-change exchange: HANA isn't recording a number, it's
// holding the patient to the plan. Bubbles reveal one at a time on scroll.
const AGENT_TURNS: { who: "hana" | "patient"; text: string }[] = [
  { who: "hana", text: "Hi Maria, it's HANA calling for your evening check-in. How many hours did you wear the CPAP last night?" },
  { who: "patient", text: "Only about two. I took it off, it felt too tight." },
  { who: "hana", text: "That's really common in week one — let's fix the fit, not give up. Try loosening the top strap one notch tonight. Can we aim for four hours?" },
  { who: "patient", text: "Okay, I can try that." },
  { who: "hana", text: "Great. I'll check back tomorrow to see how it went. You're doing the hard part — showing up." },
];

const AGENT_PILLARS = [
  {
    icon: RI.heart,
    title: "An accountability partner",
    body: "Patients don't fail because they can't — they drift. HANA calls on cadence, notices when adherence slips, encourages, and holds them to the plan. That follow-through is what actually moves the number.",
  },
  {
    icon: RI.clipboard,
    title: "Running a real protocol",
    body: "Every conversation runs a clinician-built protocol for the condition — the right questions, the right thresholds, the right escalation. The warmth is human; the rigor is clinical.",
  },
];

function PatientAgentSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#f6f7fb] py-20 md:py-28 px-6 md:px-16">
      {/* soft periwinkle wash + the bloom orb behind the conversation (lower-left,
          low-opacity so it never fights the heading text) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 30% 75%, rgba(167,188,245,0.30) 0%, rgba(246,247,251,0) 60%)" }} />
        <div className="absolute left-[8%] bottom-[-8%] opacity-[0.15] blur-[5px] hidden md:block">
          <div className="scale-[1.7]" style={{ transformOrigin: "center" }}>
            <HanaBloomOrb />
          </div>
        </div>
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The patient agent</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
            Not just a monitor. <em className="text-[#5b76d9]">The reason they stick with it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[58ch] mx-auto mt-4">
            Data alone doesn't change behavior. A patient who feels seen does. HANA is the voice on
            the other end of the line — an accountability partner running a real clinical protocol.
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
            <div className="rounded-[24px] bg-white/80 backdrop-blur-sm border border-white shadow-[0_30px_80px_rgba(0,18,47,0.14)] p-5 md:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-slate-100">
                <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#eef1fb] text-[#5b76d9]">
                  <Glyph d={RI.phone} className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-[#00122F]">HANA · evening check-in</div>
                  <div className="text-[11px] text-slate-500">CPAP adherence · HANA Sleep protocol</div>
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
                          ? "bg-[#1e2a3a] text-white rounded-bl-md"
                          : "bg-white text-[#00122F] border border-slate-200 rounded-br-md"
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
                  className="flex items-center gap-2 pt-1 text-[11px] text-slate-500"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                  Logged to chart · follow-up scheduled for tomorrow
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Two pillars: accountability + protocol */}
          <div className="space-y-6">
            {AGENT_PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-white border border-slate-200 text-[#5b76d9] shrink-0 shadow-sm">
                  <Glyph d={p.icon} className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.2] mt-0 mb-2 text-[#00122F]">{p.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-slate-600 m-0">{p.body}</p>
                </div>
              </motion.div>
            ))}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="pt-2">
              <p className="font-serif text-[20px] md:text-[22px] leading-[1.3] text-[#00122F] m-0">
                85% of patients pick up and engage — <em className="text-[#5b76d9]">because it doesn't feel like a machine.</em>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Audit-proof section ──────────────────────────────────────────────────────

// The enforcement wave around remote care (OIG's published remote-monitoring
// audit work; DOJ's first remote-monitoring False Claims settlement) is a moat,
// not a threat: the four things an auditor asks for are the four things HANA
// records by default. Every claim here must stay literally true of the product —
// this is the last section on the site that should ever be aspirational.
const AUDIT_PILLARS = [
  {
    icon: RI.watch,
    title: "Every minute attributed to a named clinician",
    body: "HANA's own call time is never counted as clinical time. Care-management minutes are recorded against the qualified staff member who did the work, with a timestamped record of what they reviewed and when they attested.",
  },
  {
    icon: RI.alert,
    title: "Every escalation reaches a qualified human",
    body: "Clinical flags route to a named clinician, not a shared queue. The record shows who received it, when it was opened, and what was done — so \"a clinician reviewed it\" is a fact you can produce, not a claim you make.",
  },
  {
    icon: RI.phone,
    title: "Consent recorded on the call",
    body: "Program consent is captured in the patient's own words at enrollment — the program, the date, and the cost-sharing disclosure, stored with the recording. It's the first thing an auditor asks for and the thing practices most often can't produce.",
  },
  {
    icon: RI.database,
    title: "One-click audit export",
    body: "Any month, any patient, any program: one export with transcripts, structured notes, time attribution, escalation trail, and attestations. Ready to hand to a payer, an auditor, or your counsel — without a chart-by-chart reconstruction.",
  },
];

function AuditSection() {
  return (
    <section className="bg-[#00122F] text-white py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Audit-ready by default</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
            Built for the audit <em className="text-[#A7BCF5]">you'll eventually get.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-white/80 max-w-[62ch] mx-auto mt-5">
            Remote care billing is under real scrutiny — OIG has published its remote-monitoring
            audit work, and DOJ has already settled its first remote-monitoring False Claims case.
            The four things an auditor asks for are the four things HANA records on every call,
            for every patient, whether or not anyone ever asks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {AUDIT_PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-6 md:p-7 flex items-start gap-4"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-[#2347e6]/20 text-[#A7BCF5] shrink-0">
                <Glyph d={p.icon} className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-[17px] md:text-[18px] font-semibold mt-0 mb-2 leading-snug">{p.title}</h3>
                <p className="text-[14.5px] leading-[1.7] text-white/75 m-0">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }} className="text-[17px] md:text-[19px] leading-[1.6] text-white/90 text-center max-w-[54ch] mx-auto mt-12">
          We don't bill, and we don't generate clinical time.{" "}
          <span className="text-[#A7BCF5]">We produce the record that proves yours was real.</span>
        </motion.p>
      </div>
    </section>
  );
}

// ── Small shared bits (Contact patterns) ─────────────────────────────────────

// A before→after outcome stat: the big "after" number, plus two length bars
// (baseline vs HANA) so the delta reads as a visible change on the side.
type DeltaRow = { k: string; pct: number; v: string; hi?: boolean };
function RDeltaStat({ big, suffix, label, rows }: { big: string; suffix?: string; label: string; rows: DeltaRow[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5 md:gap-7">
      <div className="sm:w-[150px] shrink-0">
        <div className="font-serif text-[52px] md:text-[64px] leading-[0.9] text-[#00122F]">
          {big}
          {suffix && <span className="text-[28px] md:text-[34px] text-[#5b76d9]">{suffix}</span>}
        </div>
        <div className="text-[14px] text-slate-600 leading-[1.5] mt-2">{label}</div>
      </div>
      <div className="flex-1 min-w-0 space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center gap-3">
            <span className={`w-[76px] shrink-0 text-[12px] ${r.hi ? "font-semibold text-[#5b76d9]" : "text-slate-600"}`}>{r.k}</span>
            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${r.hi ? "bg-[#5b76d9]" : "bg-slate-300"}`}
                initial={{ width: reduce ? `${r.pct}%` : 0 }}
                whileInView={{ width: `${r.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className={`w-11 text-right text-[12px] tabular-nums ${r.hi ? "font-semibold text-[#00122F]" : "text-slate-600"}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// A question-framed feature block: the question, a short answer, and a small
// live-UI snippet (children) that animates in on scroll.
function QBlock({ q, a, children }: { q: string; a: string; children: React.ReactNode }) {
  return (
    <motion.div {...fadeUp} className="rounded-2xl bg-white border border-slate-200 p-6 md:p-7 flex flex-col">
      <h3 className="text-[18px] md:text-[19px] font-semibold text-[#00122F] mt-0 mb-2 leading-snug">{q}</h3>
      <p className="text-[14.5px] leading-[1.65] text-slate-700 m-0">{a}</p>
      <div className="mt-5 pt-5 border-t border-slate-100">{children}</div>
    </motion.div>
  );
}

// Labelled mini bar used inside a QBlock (Apps vs HANA, etc.).
function QBar({ k, pct, v, hi }: { k: string; pct: number; v: string; hi?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-3 mb-2 last:mb-0">
      <span className={`w-12 shrink-0 text-[12px] ${hi ? "font-semibold text-[#5b76d9]" : "text-slate-500"}`}>{k}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${hi ? "bg-[#5b76d9]" : "bg-slate-300"}`}
          initial={{ width: reduce ? `${pct}%` : 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className={`w-10 text-right text-[12px] tabular-nums ${hi ? "font-semibold text-[#00122F]" : "text-slate-500"}`}>{v}</span>
    </div>
  );
}

function RFaqRow({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[17px] font-medium text-[#00122F] transition-colors duration-200 group-hover:text-[#5b76d9]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[#5b76d9] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`rfaq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[15px] leading-[1.7] text-slate-600 pb-5 pr-8 m-0">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaRemote() {
  return (
    <div className="bg-white text-[#00122F] font-sans overflow-x-hidden">
      <SEO
        title="HANA Remote — The Engagement Layer for Remote Care"
        useExactTitle
        type="product"
        description="HANA Remote is the device-less engagement layer for remote care programs — CCM, APCM, BHI, RTM and ACCESS. Voice check-ins reach 85% of patients and produce structured documentation your clinician attests to, inside your EHR."
        path="/hana-remote"
        keywords="remote care engagement layer, device-less patient engagement, chronic care management software, APCM, behavioral health integration, remote therapeutic monitoring, CPAP adherence program, voice AI patient outreach, ACCESS program, RPM engagement layer"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Remote", url: "https://www.hana.health/hana-remote" },
        ])}
      />

      {/* HERO — centered and dominant (Contact-style) */}
      <header className="bg-[#f6f7fb] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
          <motion.p {...fadeUp} className={`${eyebrow} text-[#5b76d9] m-0`}>
            HANA Remote · The engagement layer for remote care
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[80px] leading-[1.02] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[18ch]"
          >
            Turn remote care into <em className="text-[#5b76d9]">monthly revenue</em>,
            <br />
            without adding staff.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[17px] md:text-[19px] leading-[1.6] text-slate-700 mt-7 mb-0 mx-auto max-w-[54ch]"
          >
            HANA keeps patients engaged across CCM, APCM, BHI, RTM &amp; ACCESS — and keeps the
            devices in your existing RPM program transmitting.
            <em className="text-[#5b76d9] not-italic font-semibold"> Documented to your EHR, ready for your clinician to attest.</em>
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1e2a3a] text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-9 md:mt-10"
          >
            Book a demo →
          </motion.a>
        </div>
      </header>

      {/* HOW IT WORKS — the five-step monitoring pipeline (Contact five-step flow,
          dark), directly below the hero. Replaces the old closed-loop figure. */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#00122F] text-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The five-step flow</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              From first call to documented — <em className="text-[#A7BCF5]">in five steps.</em>
            </h2>
          </motion.div>
          <HowItWorksFlow />
        </div>
      </section>

      {/* THE PROBLEM — cost-of-inaction band (Tile-style hard stats) */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="mb-10 md:mb-14 max-w-[46ch]">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The cost of doing nothing</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#00122F] mt-0 mb-4">
              The program dies before it pays for itself.
            </h2>
            <p className="text-[16px] leading-[1.7] text-slate-700 m-0">
              Remote care is reimbursable — CCM, APCM, BHI, RTM, RPM, ACCESS. The codes exist and the
              money is there. Programs still fail for one reason: patients don't answer, don't use the
              devices you ship, and don't open the apps you send. No engagement, no data, nothing to bill.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 border-t border-slate-200 pt-10">
            {[
              { v: "46–83%", l: "of new CPAP patients fail Medicare's adherence threshold in the first 90 days" },
              { v: "$1,400", l: "lost per patient who walks out the door" },
              { v: "20%", l: "all the engagement an app gets — patients won't open it" },
              { v: "$3/call", l: "offshore call centers that still don't move the needle" },
            ].map((s, i) => (
              <motion.div key={s.v} {...fadeUp} transition={{ duration: 0.5, delay: 0.04 + i * 0.07 }}>
                <div className="font-serif text-[40px] md:text-[56px] leading-[0.95] text-[#00122F] mb-3">{s.v}</div>
                <div className="text-[14px] leading-[1.55] text-slate-700">{s.l}</div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-[18px] md:text-[20px] leading-[1.5] font-semibold text-[#00122F] mt-12 max-w-[34ch]">
            The problem was never the monitoring. <span className="text-[#5b76d9]">It was the engagement.</span>
          </motion.p>
        </div>
      </section>

      {/* THE PROOF — voice reaches patients where passive channels don't (was homepage §2) */}
      <Stats />

      {/* WHAT HANA REMOTE DOES — question-framed feature blocks (Tile pattern) */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The questions every clinic asks</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              No device to ship. No app to download. <em className="text-[#5b76d9]">No behavior change.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QBlock
              q="Will patients actually pick up?"
              a="The whole model rests on it — so it's the number we lead with. We call; they answer."
            >
              <QBar k="Apps" pct={20} v="20%" />
              <QBar k="HANA" pct={85} v="85%" hi />
            </QBlock>

            <QBlock
              q="What happens when something looks wrong?"
              a="A tripped threshold routes to your worklist in real time — a qualified human on every flag, not a log nobody reads."
            >
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-mono text-slate-700 bg-white border border-slate-200 rounded-md px-2.5 py-1">&ldquo;My BP cuff read 158/94&rdquo;</span>
                <span className="text-slate-400">→</span>
                <motion.span
                  initial={{ opacity: 0.4 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-1.5 font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Escalated → Dr. Reyes
                </motion.span>
              </div>
            </QBlock>

            <QBlock
              q="Does it actually count for billing?"
              a="HANA doesn't bill and doesn't generate clinical minutes. It writes the structured note the moment the call ends, so your clinician reviews and attests — CCM, APCM, BHI, RTM, ACCESS."
            >
              <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                <span className="text-slate-500">Call ends</span>
                <span className="text-slate-400">→</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <Check className="w-3 h-3" strokeWidth={3} /> Structured note in the chart
                </span>
                <span className="font-semibold text-[#5b76d9] bg-[#eef1fb] rounded-full px-2.5 py-1">Ready for Dr. Reyes to attest</span>
              </div>
            </QBlock>

            <QBlock
              q="Do I ship a device or make them download an app?"
              a="Not for the device-free programs — CCM, APCM, BHI and ACCESS. The conversation is the care contact. Where a program requires a device, its data flows in via API."
            >
              <div className="flex flex-wrap gap-2 text-[13px] font-semibold text-[#00122F]">
                {["No device", "No app", "No behavior change"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1">
                    <Check className="w-3.5 h-3.5 text-[#5b76d9]" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </QBlock>
          </div>
        </div>
      </section>

      {/* TWO SIDES — the control panel (care team) + the agent (patient).
          Section 1: Compass, the SaaS control panel. */}
      <section className="bg-[#00122F] text-white py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Compass · the control panel</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              Your team reviews what matters. <em className="text-[#A7BCF5]">The rest is handled.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/80 max-w-[56ch] mx-auto mt-4">
              Compass is where your care team lives: enrollment, escalations, and billing
              documentation run on their own. What reaches your team is a flagged worklist — not a phone queue.
            </p>
          </motion.div>
          <CompassDashboard />
        </div>
      </section>

      {/* Section 2: the patient agent — accountability + protocol, chat over orb. */}
      <PatientAgentSection />

      {/* THE PROGRAMS — one platform, shown as the home-page workflow marquee */}
      <RecipesMarquee
        tags={PROGRAM_WORKFLOW_TAGS}
        tag="The programs"
        heading="One platform. Every monitoring program."
        body="RPM, RTM, chronic and behavioral care, post-op, ACCESS — every reimbursable program runs as a built-in call workflow, documented to the chart for attestation. Tap any card to see the steps."
      />

      {/* PROOF — two clinician testimonials (reused approved quotes), enlarged */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-[#eef1fb]">
        <div className="max-w-[1080px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>In their words</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              The clinicians running these programs.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
            {[
              {
                // Trimmed with an ellipsis from the approved quote — the elided clause
                // ("the biggest bottleneck was always the touch-time documentation…")
                // read as though HANA generates the billable touch time. Words are his;
                // confirm the shortened form with Dr. Mohamed before this ships.
                quote: "Hana … captures the conversation in structured notes that go straight into the chart, and flags anyone who needs a same-day callback.",
                name: "Fakhrudin Mohamed, MD",
                role: "Board-Certified Physician",
                avatar: "/avatars/fakhrudin.png",
              },
              {
                quote: "Getting elderly patients ready for surgery over the phone is nearly impossible — they don't pick up, they miss voicemails, and if they show up unprepared the case gets cancelled. HANA reaches them, walks them through everything, and flags whoever still isn't ready so we can step in.",
                name: "Dr. Oprandi",
                role: "Primary care clinic",
                avatar: "/avatars/oprandi.webp",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="rounded-[24px] bg-white border border-white shadow-[0_28px_64px_rgba(0,18,47,0.10)] p-8 md:p-10 flex flex-col justify-between m-0"
              >
                <blockquote className="font-serif text-[21px] md:text-[24px] leading-[1.5] text-[#00122F] m-0">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3.5 mt-8">
                  <img src={t.avatar} alt={t.name} width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="text-[15px] font-semibold text-[#00122F] leading-tight">{t.name}</div>
                    <div className="text-[14px] text-slate-600 mt-0.5">{t.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR — sleep/CPAP recovery */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The adherence math</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              What does non-adherence <em className="text-[#5b76d9]">cost your program?</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[52ch] mx-auto mt-4">
              Run the numbers for a sleep / DME program — the sharpest case for the device-less model.
            </p>
          </motion.div>
          <SleepCalculator />
        </div>
      </section>

      {/* THE NUMBERS — stat band */}
      <section className="py-16 md:py-[72px] px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-3`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] mt-0 mb-10 md:mb-[52px] max-w-[22ch] text-[#00122F]">
              Engagement you can bill against.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div {...fadeUp}>
              <RDeltaStat big="85" suffix="%" label="Patient engagement — vs. app-based monitoring" rows={[{ k: "Apps", pct: 20, v: "20%" }, { k: "HANA", pct: 85, v: "85%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.06 }}>
              <RDeltaStat big="22" suffix="%" label="CPAP non-adherence, in production" rows={[{ k: "Before", pct: 50, v: "50%" }, { k: "HANA", pct: 22, v: "22%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.06 }}>
              <RDeltaStat big="85" suffix="%" label="CPAP adherence after 12 months on program" rows={[{ k: "Month 1", pct: 38, v: "38%" }, { k: "Month 12", pct: 85, v: "85%", hi: true }]} />
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}>
              <RDeltaStat big="2.3" suffix="×" label="More patients per care coordinator" rows={[{ k: "Baseline", pct: 43, v: "1×" }, { k: "With HANA", pct: 100, v: "2.3×", hi: true }]} />
            </motion.div>
          </div>
          <motion.div {...fadeUp} className="flex flex-wrap gap-2.5 mt-10">
            {["$1.4K recovered per patient", "150+ EHR integrations", "45+ clinical protocols", "4M+ patient interactions", "Live in the CMS ACCESS program"].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-[#00122F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5b76d9]" aria-hidden="true" />
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>



      {/* AUDIT — the enforcement wave as a selling point (see AUDIT_PILLARS) */}
      <AuditSection />

      {/* HOW WE START — three-step go-live section, same as the homepage */}
      <InlineImageHeader />

      {/* FAQ */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[820px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Questions? Answers.</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#00122F]">
              The things everyone asks.
            </h2>
          </motion.div>
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {R_FAQS.map((f, i) => (
              <RFaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>Ready to run a monitoring program that actually works?</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            Book a demo — <em>live in days.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          {/* Transparent terms — true claims only; add real pricing terms when confirmed */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["No devices to ship", "No app to download", "Audit-ready from day one", "Live in your EHR in days"].map((t) => (
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
