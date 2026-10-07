import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { HanaBloomOrb } from "../components/media/HanaBloomOrb";
import { RecipesMarquee } from "../components/sections/RecipesMarquee";
import { InlineImageHeader } from "../components/sections/InlineImageHeader";
import { FaqSection } from "../components/sections/FaqSection";
import { CompassDashboard, Glyph, RI } from "../components/media/CompassDashboard";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * /care — the care coordination page (since 7 Oct 2026).
 *
 * This was /hana-remote, the HANA Remote product page. When the rebuilt page
 * became the homepage, Matteo asked for this one back as its own page beside
 * /sleep: "need to build CARE page, homepage stay the same, the page you have
 * about Remote before". It came back CLEANED, because the old page carried what
 * the rebuild was made to remove:
 *   - "HANA Remote" (a retired name) and "device-less engagement layer".
 *   - RPM and RTM sold as current (they are roadmap; 90 FR 49397), including
 *     the "keeps your RPM devices transmitting" pitch and its FAQ.
 *   - Embargoed or retired numbers: 85% vs 20% engagement, $1,400 and "$1.4K
 *     recovered", 4M+ interactions, 22% CPAP non-adherence "in production", 85%
 *     CPAP adherence at 12 months, 2.3x coordinators, 150+ EHRs, $3/call.
 *   - The sleep/DME calculator (sleep economics on a care page) and the
 *     uncited Stats bars.
 *   - "Live in days" (a time promise).
 * The problem band now uses the two sourced figures (ASPE/NORC 2019, JAMA 2018),
 * the patient conversation is a care example rather than CPAP, and the Compass
 * mock's data was cleaned the same day (see its header).
 *
 * BILLING GUARDRAIL, unchanged: HANA never "generates billable minutes" or
 * "auto-bills". It prepares the record; a named clinician's time is what is
 * billed, and that clinician attests. CMS counts only clinical staff time
 * (CCM FAQ p.1). "45+ protocols" stays because the homepage carries it too; it
 * is still Matteo's open call.
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
const HOW_SOURCES = ["New enrollments", "Scheduled check-ins", "Patient-reported symptoms"];
const HOW_OUTCOMES = ["Higher adherence", "Every flag reviewed", "Documentation that holds up"];

const HOW_BLOCKS = [
  {
    key: "Enroll",
    title: "Enroll by phone, on day one",
    short: "Onboarding on a call. No app to download.",
    detail: "HANA calls the patient, explains the program, records their consent in their own words, and starts the protocol your clinicians chose for their condition. No device to ship, no app to download, no behavior change asked of the patient.",
    stat: "Day 1",
    statLabel: "consent + onboarding, entirely by phone",
    proof: "Consent recorded on the call",
  },
  {
    key: "Check in",
    title: "Check in on the right cadence",
    short: "The conversation is the care contact.",
    detail: "Scheduled voice calls capture symptoms, adherence, and how the plan is actually going, in the patient's language, on the cadence their protocol needs. Where a device is part of the program, its readings flow in via API alongside the conversation.",
    stat: "30+",
    statLabel: "languages, switched per patient",
    proof: "In the patient's language",
  },
  {
    key: "Flag",
    title: "Flag what matters",
    short: "45+ clinical protocols score every response.",
    detail: "Every answer is checked against the thresholds your clinicians set: diabetes, hypertension, heart failure, COPD, behavioral health, post-op. When one trips, HANA surfaces it instead of burying it in a log. It flags; it never diagnoses.",
    stat: "45+",
    statLabel: "clinical protocols across conditions",
    proof: "Protocol-scored in real time",
  },
  {
    key: "Escalate",
    title: "Escalate to a clinician",
    short: "A clinician on every flag. The rest is handled.",
    detail: "Clinical flags route straight to your worklist with the full context of the call. Your team reviews only what matters, on one flagged queue, not a phone list and not every check-in.",
    stat: "1",
    statLabel: "flagged worklist is all your team reviews",
    proof: "Straight to the worklist",
  },
  {
    key: "Document",
    title: "Document to the EHR",
    short: "Structured data, ready for your clinician to attest.",
    detail: "The moment the call ends, a structured note is written to the patient's record, assigned to the named clinician who owns the patient, ready for their review and attestation. CCM, APCM, PCM and BHI.",
    stat: "Same day",
    statLabel: "note in the chart, ready to attest",
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
    a: "No. Chronic care management, advanced primary care management, principal care management and behavioral health integration are device-free: the care-management contact is the covered activity. Nothing is shipped, downloaded or charged to the patient.",
  },
  {
    q: "Is this device-less RPM?",
    a: "No, and we're deliberate about that. RPM codes (99453/99454/99457) require an FDA-defined medical device that transmits readings automatically. A patient reading a number to us over the phone does not satisfy them, and billing RPM that way is what the DOJ's first RPM False Claims settlement was about. The programs HANA runs are the device-free ones: CCM, APCM, PCM, BHI and CoCM.",
  },
  {
    q: "Does this replace my clinicians' billable time?",
    a: "No, the opposite. HANA's call time is never billed as clinical time: CMS counts only time spent by clinical staff. HANA makes the call, captures what the patient said and writes the note, so your clinician reviews a flagged worklist and attests instead of chasing patients.",
  },
  {
    q: "How does the billing actually work?",
    a: "HANA produces the record the codes require; your qualified staff supply and attest to the time. Every call is written back as a structured note assigned to a named clinician, across CCM, APCM, PCM and BHI, so the person who bills is the person who did the clinical work, with the record to show it.",
  },
  {
    q: "What happens if we get audited?",
    a: "You export the month and hand it over. Every check-in stores its transcript and structured note, every care-management minute is attributed to the named clinician who supplied it, every escalation records who received it and what they did, and program consent is recorded in the patient's own words on the enrollment call. That's the packet an auditor asks for, assembled as the program runs rather than reconstructed afterwards.",
  },
  {
    q: "What languages do you support?",
    a: "HANA calls patients in 30+ languages, switching automatically per patient. No separate configuration or phone lines required.",
  },
];

// Per-stage animated icon (ported from Contact's five-step flow): a small motif
// that loops while its stage is active. Rings for enroll/document, dot-matrices
// for the middle stages.
function StageIcon({ stage, active }: { stage: number; active: boolean }) {
  const reduce = useReducedMotion();
  const anim = active && !reduce;
  const fill = active ? "#fff" : "var(--color-brand-soft)";
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
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-brand-soft mb-1">Sources</p>
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
                  is ? "bg-[#2347e6] shadow-[0_18px_50px_rgba(35,71,230,0.45)]" : "bg-paper-bright/[0.04] hover:bg-paper-bright/[0.07]"
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
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-brand-soft mb-1">Outcomes</p>
          {HOW_OUTCOMES.map((o) => (
            <p key={o} className="text-[13.5px] text-white/70 leading-snug">{o}</p>
          ))}
        </div>
      </div>

      {/* Detail panel — cross-fades on stage change */}
      <div className="mt-8 rounded-2xl bg-paper-bright/[0.03] border border-white/[0.06] p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 items-center min-h-[200px]">
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
            <p className="text-[12px] font-semibold tracking-[1.5px] uppercase text-brand-soft mt-5">{cur.proof}</p>
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
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-brand-soft" : "w-2 bg-paper-bright/25 hover:bg-paper-bright/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── The patient agent — accountability + protocol, conversation over the orb ──

// A short behavioral-change exchange: HANA isn't recording a number, it's
// holding the patient to the plan. Bubbles reveal one at a time on scroll.
/* A care example since the move to /care (was a CPAP check-in). HANA asks,
   records and routes to the clinician; it does not advise on the medication. */
const AGENT_TURNS: { who: "hana" | "patient"; text: string }[] = [
  { who: "hana", text: "Hi Maria, it's HANA calling from Dr. Reyes's office for your monthly check-in. Have you been able to take your blood pressure medication every day?" },
  { who: "patient", text: "Not every day. It makes me dizzy in the mornings, so I skipped a few." },
  { who: "hana", text: "Thank you for telling me. I'm passing that to Dr. Reyes's team today so they can look at it, and someone from the office will call you." },
  { who: "patient", text: "Okay, thank you." },
  { who: "hana", text: "You're welcome. I'll call again next month, and you can call the office any time before then." },
];

const AGENT_PILLARS = [
  {
    icon: RI.heart,
    title: "An accountability partner",
    body: "Patients don't fail because they can't. They drift. HANA calls on cadence, notices when the plan slips, and makes sure your team hears about it. That follow-through is what keeps a care plan alive between visits.",
  },
  {
    icon: RI.clipboard,
    title: "Running a real protocol",
    body: "Every conversation runs the protocol your clinicians set for the condition: the right questions, the right thresholds, the right escalation. It never gives clinical advice.",
  },
];

function PatientAgentSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-paper-2 py-20 md:py-28 px-6 md:px-16">
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
          <p className={`${eyebrow} text-brand mt-0 mb-4`}>The patient agent</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-navy">
            Not just a monitor. <em className="text-brand">The reason they stick with it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[58ch] mx-auto mt-4">
            Data alone doesn't change behavior. A patient who feels seen does. HANA is the voice on
            the other end of the line, running the protocol your clinicians wrote.
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
            <div className="rounded-[24px] bg-paper-bright/80 backdrop-blur-sm border border-white shadow-[0_30px_80px_rgba(0,18,47,0.14)] p-5 md:p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-rule-soft">
                <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-brand-tint text-brand">
                  <Glyph d={RI.phone} className="w-4 h-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-navy">HANA · monthly check-in</div>
                  <div className="text-[11px] text-ink-mute">Hypertension · your clinic's protocol</div>
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
                          ? "bg-navy-soft text-white rounded-bl-md"
                          : "bg-paper-bright text-navy border border-rule rounded-br-md"
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
                  className="flex items-center gap-2 pt-1 text-[11px] text-ink-mute"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                  Note in the chart · flagged to Dr. Reyes
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
                <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-paper-bright border border-rule text-brand shrink-0 shadow-sm">
                  <Glyph d={p.icon} className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.2] mt-0 mb-2 text-navy">{p.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-ink-soft m-0">{p.body}</p>
                </div>
              </motion.div>
            ))}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="pt-2">
              <p className="font-serif text-[20px] md:text-[22px] leading-[1.3] text-navy m-0">
                In 30+ languages, <em className="text-brand">on the cadence your protocol sets.</em>
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
    body: "Clinical flags route to a named clinician, not a shared queue. The record shows who received it, when it was opened, and what was done, so \"a clinician reviewed it\" is a fact you can produce, not a claim you make.",
  },
  {
    icon: RI.phone,
    title: "Consent recorded on the call",
    body: "Program consent is recorded in the patient's own words at enrollment: the program, the date and the cost-sharing disclosure, stored with the recording. It's the first thing an auditor asks for and the thing practices most often can't produce.",
  },
  {
    icon: RI.database,
    title: "One-click audit export",
    body: "Any month, any patient, any program: one export with transcripts, structured notes, time attribution, escalation trail, and attestations. Ready to hand to a payer, an auditor, or your counsel, without a chart-by-chart reconstruction.",
  },
];

function AuditSection() {
  return (
    <section className="bg-navy text-white py-20 md:py-28 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-brand-soft mt-0 mb-4`}>Audit-ready by default</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
            Built for the audit <em className="text-brand-soft">you'll eventually get.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-white/80 max-w-[62ch] mx-auto mt-5">
            Remote care billing is under real scrutiny. OIG has published its remote-monitoring
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
              className="rounded-2xl bg-paper-bright/[0.04] border border-white/[0.07] p-6 md:p-7 flex items-start gap-4"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-[#2347e6]/20 text-brand-soft shrink-0">
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
          We don't bill, and our call time is never clinical time.{" "}
          <span className="text-brand-soft">We produce the record that proves yours was real.</span>
        </motion.p>
      </div>
    </section>
  );
}

// ── Small shared bits (Contact patterns) ─────────────────────────────────────

// A question-framed feature block: the question, a short answer, and a small
// live-UI snippet (children) that animates in on scroll.
function QBlock({ q, a, children }: { q: string; a: string; children: React.ReactNode }) {
  return (
    <motion.div {...fadeUp} className="rounded-2xl bg-paper-bright border border-rule p-6 md:p-7 flex flex-col">
      <h3 className="text-[18px] md:text-[19px] font-semibold text-navy mt-0 mb-2 leading-snug">{q}</h3>
      <p className="text-[14.5px] leading-[1.65] text-ink-soft m-0">{a}</p>
      <div className="mt-5 pt-5 border-t border-rule-soft">{children}</div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaRemote() {
  return (
    <div className="bg-paper-bright text-navy font-sans overflow-x-hidden">
      <SEO
        title="Care coordination: the monthly calls, made and written up | HANA Health"
        useExactTitle
        type="product"
        description="HANA calls your chronic care, principal care, APCM and BHI patients every month, flags what needs a clinician, and writes the note your team reviews and attests. No device, no app, no new hires."
        path="/care"
        keywords="care coordination, chronic care management, principal care management, APCM, behavioral health integration, voice AI patient outreach, care management calls"
        // FAQPage as well as the breadcrumb: the Q&As are the most directly
        // citable content on the page. "Is this device-less RPM?" has a
        // definitive answer that answer engines can lift verbatim.
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", url: "https://www.hana.health/" },
            { name: "Care coordination", url: "https://www.hana.health/care" },
          ]),
          faqSchema(R_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* HERO — centered and dominant (Contact-style) */}
      <header className="bg-paper-2 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
          <motion.p {...fadeUp} className={`${eyebrow} text-brand m-0`}>
            Care coordination
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[80px] leading-[1.02] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[18ch]"
          >
            Run the care programs <em className="text-brand">Medicare already pays for</em>,
            <br />
            without adding staff.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[17px] md:text-[19px] leading-[1.6] text-ink-soft mt-7 mb-0 mx-auto max-w-[54ch]"
          >
            HANA calls your patients every month for chronic care, principal care, advanced
            primary care and behavioral health, flags what needs a clinician, and writes the note.
            <em className="text-brand not-italic font-semibold"> Your clinician reviews and attests.</em>
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-navy-soft text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-9 md:mt-10"
          >
            Book a demo →
          </motion.a>
        </div>
      </header>

      {/* HOW IT WORKS — the five-step monitoring pipeline (Contact five-step flow,
          dark), directly below the hero. Replaces the old closed-loop figure. */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-navy text-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-brand-soft mt-0 mb-4`}>The five-step flow</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              From first call to documented, <em className="text-brand-soft">in five steps.</em>
            </h2>
          </motion.div>
          <HowItWorksFlow />
        </div>
      </section>

      {/* THE PROBLEM. Was four unsourced or retired stats ($1,400, 20% for apps,
          $3/call, a CPAP range). Now the two figures the site may publish, each
          with its year and source, per the copy guardrails:
            4.0%: ASPE/NORC for HHS, 2019 Medicare fee-for-service claims, share
                  OF THE ELIGIBLE (63.4% potentially eligible) who received CCM.
            93%:  Agarwal et al., JAMA 320(24), Dec 2018, primary care practices
                  billing no CCM in 2016 (3,347 of 48,113, 6.9%, billed any).
          Both are floors from years ago, never current figures. */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-paper-bright">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="mb-10 md:mb-14 max-w-[46ch]">
            <p className={`${eyebrow} text-brand mt-0 mb-4`}>The cost of doing nothing</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy mt-0 mb-4">
              The care is paid for. The calls never happen.
            </h2>
            <p className="text-[16px] leading-[1.7] text-ink-soft m-0">
              Medicare pays for the care between visits: chronic care management, principal care
              management, advanced primary care management, behavioral health integration. Almost none
              of it gets done, for one reason. Somebody has to call every patient, every month, and
              nobody has the hours.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 border-t border-rule pt-10 max-w-[900px]">
            {[
              { v: "4.0%", l: "of Medicare fee-for-service patients eligible for chronic care management received it in 2019.", src: "ASPE / NORC for HHS" },
              { v: "93%", l: "of US primary care practices billed no chronic care management at all in 2016.", src: "Agarwal et al., JAMA, 2018" },
            ].map((s, i) => (
              <motion.div key={s.v} {...fadeUp} transition={{ duration: 0.5, delay: 0.04 + i * 0.07 }}>
                <div className="font-serif text-[40px] md:text-[56px] leading-[0.95] text-navy mb-3">{s.v}</div>
                <div className="text-[14px] leading-[1.55] text-ink-soft">{s.l}</div>
                <div className="text-[12.5px] leading-[1.5] text-ink-mute mt-2">{s.src}</div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-[18px] md:text-[20px] leading-[1.5] font-semibold text-navy mt-12 max-w-[34ch]">
            The problem was never the billing codes. <span className="text-brand">It was the phone calls.</span>
          </motion.p>
        </div>
      </section>

      {/* WHAT HANA DOES — question-framed feature blocks (Tile pattern) */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-paper-2">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-brand mt-0 mb-4`}>The questions every clinic asks</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-navy">
              No device to ship. No app to download. <em className="text-brand">No behavior change.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Was an 85% vs 20% bar pair, which is embargoed and unsourced. */}
            <QBlock
              q="Will patients actually pick up?"
              a="The whole model rests on it. HANA calls in the patient's language, on the cadence the protocol sets, and tries again when nobody answers. Reach is the first thing we show you on your own panel."
            >
              <div className="flex flex-wrap gap-2 text-[13px] font-semibold text-navy">
                {["30+ languages", "Repeat attempts", "Your protocol's cadence"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 bg-paper-bright border border-rule rounded-full px-3 py-1">
                    <Check className="w-3.5 h-3.5 text-brand" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </QBlock>

            <QBlock
              q="What happens when something looks wrong?"
              a="A tripped threshold routes to your worklist in real time: a qualified human on every flag, not a log nobody reads."
            >
              <div className="flex items-center gap-2 text-[13px]">
                <span className="font-mono text-ink-soft bg-paper-bright border border-rule rounded-md px-2.5 py-1">&ldquo;My BP cuff read 158/94&rdquo;</span>
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
              a="HANA doesn't bill, and its call time never counts as clinical time. It writes the structured note the moment the call ends, so your clinician reviews and attests. CCM, APCM, PCM and BHI."
            >
              <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                <span className="text-ink-mute">Call ends</span>
                <span className="text-slate-400">→</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <Check className="w-3 h-3" strokeWidth={3} /> Structured note in the chart
                </span>
                <span className="font-semibold text-brand bg-brand-tint rounded-full px-2.5 py-1">Ready for Dr. Reyes to attest</span>
              </div>
            </QBlock>

            <QBlock
              q="Do I ship a device or make them download an app?"
              a="No. CCM, APCM, PCM and BHI need no device and no app: the care-management contact is the covered activity."
            >
              <div className="flex flex-wrap gap-2 text-[13px] font-semibold text-navy">
                {["No device", "No app", "No behavior change"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 bg-paper-bright border border-rule rounded-full px-3 py-1">
                    <Check className="w-3.5 h-3.5 text-brand" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </QBlock>
          </div>
        </div>
      </section>

      {/* TWO SIDES — the control panel (care team) + the agent (patient).
          Section 1: Compass, the SaaS control panel. */}
      <section className="bg-navy text-white py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-brand-soft mt-0 mb-4`}>Compass · the control panel</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              Your team reviews what matters. <em className="text-brand-soft">The rest is handled.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/80 max-w-[56ch] mx-auto mt-4">
              Compass is where your care team lives: enrollment, escalations, and billing
              documentation run on their own. What reaches your team is a flagged worklist, not a phone queue.
            </p>
          </motion.div>
          <CompassDashboard />
          <p className="text-[13px] text-white/60 text-center mt-5 mb-0">Illustrative data.</p>
        </div>
      </section>

      {/* Section 2: the patient agent — accountability + protocol, chat over orb. */}
      <PatientAgentSection />

      {/* THE PROGRAMS — one platform, shown as the home-page workflow marquee */}
      <RecipesMarquee
        tags={PROGRAM_WORKFLOW_TAGS}
        tag="The workflows"
        heading="One loop. Every care program."
        body="Chronic and behavioral care, wellness visits, post-op follow-up, screenings. Each one runs as a call workflow, documented to the chart for your clinician to attest. Tap any card to see the steps."
      />

      {/* PROOF — two clinician testimonials (reused approved quotes), enlarged */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-brand-tint">
        <div className="max-w-[1080px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14">
            <p className={`${eyebrow} text-brand mt-0 mb-4`}>In their words</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-navy">
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
                quote: "Getting elderly patients ready for surgery over the phone is nearly impossible. HANA reaches them, walks them through everything, and flags whoever still isn't ready so we can step in.",
                name: "Dr. G. Oprandi",
                role: "Orthopedic surgeon",
                avatar: "/avatars/oprandi.webp",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="rounded-[24px] bg-paper-bright border border-white shadow-[0_28px_64px_rgba(0,18,47,0.10)] p-8 md:p-10 flex flex-col justify-between m-0"
              >
                <blockquote className="font-serif text-[21px] md:text-[24px] leading-[1.5] text-navy m-0">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3.5 mt-8">
                  <img src={t.avatar} alt={t.name} width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="text-[15px] font-semibold text-navy leading-tight">{t.name}</div>
                    <div className="text-[14px] text-ink-soft mt-0.5">{t.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* The sleep/CPAP calculator and the "By the numbers" band were here.
          Both came off on 7 Oct 2026: sleep economics belong on /sleep, and every
          figure in the band was embargoed or unsourced. See the header. */}

      {/* AUDIT — the enforcement wave as a selling point (see AUDIT_PILLARS) */}
      <AuditSection />

      {/* HOW WE START — three-step go-live section, same as the homepage */}
      <InlineImageHeader />

      {/* FAQ — shared accordion. The local RFaqRow rendered its answer as
          {open && …}, so the prerendered HTML shipped without any answers in
          it; FaqSection keeps every answer mounted. Same copy, same R_FAQS. */}
      <FaqSection
        items={R_FAQS}
        eyebrow="Questions? Answers."
        heading="The things everyone asks."
        className="py-20 md:py-24"
      />

      {/* CTA */}
      <section className="bg-navy text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-brand-soft/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-brand-soft/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-brand-soft mt-0 mb-6`}>Ready to run the programs your patients already qualify for?</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            See it on <em>your own panel.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-paper-bright text-navy rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          {/* Transparent terms — true claims only; add real pricing terms when confirmed */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["No devices to ship", "No app to download", "Audit-ready from day one"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/90 bg-paper-bright/[0.06] border border-white/10 rounded-full px-3.5 py-1.5">
                <Check className="w-3.5 h-3.5 text-brand-soft" strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
