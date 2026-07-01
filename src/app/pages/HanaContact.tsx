import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * HANA Contact — product landing page for the front-desk call-automation product.
 * Distinct from the /contact form page. Built from the "Hana Contact.dc.html" design
 * in the Hana Design System (DM Sans + Instrument Serif, navy #00122F, periwinkle accents).
 */

// Shared entrance animation — fade + rise, triggered once on scroll into view.
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

export function HanaContact() {
  return (
    <div className="bg-white text-[#00122F] font-sans">
      <SEO
        title="HANA Contact — AI Front Desk for Clinics"
        useExactTitle
        type="product"
        description="HANA Contact handles every inbound call, outreach, and patient follow-up your team doesn't have time for — automatically, in any language, 24/7, and directly inside your EHR."
        path="/hana-contact"
        keywords="AI front desk, clinic phone automation, patient call automation, AI receptionist, EHR integration, missed call recovery, patient outreach automation"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Contact", url: "https://www.hana.health/hana-contact" },
        ])}
      />

      {/* HERO */}
      <header className="pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <motion.p
            {...fadeUp}
            className={`${eyebrow} text-[#5b76d9] m-0`}
          >
            HANA Contact
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[56px] md:text-[76px] leading-[1.02] tracking-[-0.01em] mt-5 mb-0 max-w-[20ch]"
          >
            Your phones answer themselves.
            <br />
            <em className="text-[#5b76d9]">So your front desk can focus on care.</em>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg leading-[1.7] text-slate-500 max-w-[52ch] mt-7 mb-9"
          >
            HANA Contact handles every inbound call, outreach, and patient follow-up your team
            doesn't have time for — automatically, in any language, 24/7, and directly inside your EHR.
          </motion.p>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1e2a3a] text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </motion.a>
        </div>
      </header>

      {/* PROBLEM — stat left / text right */}
      <section className="py-20 md:py-24 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-6`}>The problem</p>
            <div className="font-serif text-[76px] md:text-[100px] leading-[0.9] text-[#00122F] mb-5">30%</div>
            <p className="text-lg leading-[1.6] text-[#00122F] m-0 max-w-[28ch]">
              of calls are missed after hours. Each missed call is a missed patient.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="md:pt-2 space-y-5">
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              Your front desk is the first thing patients experience. It's also the most
              overloaded part of your clinic.
            </p>
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              Missed calls become missed appointments. Missed appointments become lost revenue.
              Your staff spends hours chasing patients, confirming appointments, collecting
              information, and leaving voicemails that nobody returns.
            </p>
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              The average clinic misses 30% of calls after hours. Each missed call is a missed patient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMPARISON — bar chart */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white text-center">
        <motion.h2
          {...fadeUp}
          className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.06] mt-0 mb-[18px]"
        >
          Portals wait. Texts wait.
          <br />
          <em className="italic">HANA Contact picks up the phone.</em>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-[17px] leading-[1.7] text-slate-500 max-w-[60ch] mx-auto"
        >
          Patients ignore the portal and miss the text — then the slot goes empty. HANA Contact
          reaches them the way they actually respond.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-end justify-center gap-4 sm:gap-8 md:gap-10 h-[340px] mt-12 md:mt-[72px]"
        >
          {/* Patient portals — 15% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[53px] rounded-[24px] flex items-start justify-center pt-3.5"
              style={{ background: "linear-gradient(#4a4a4a,#3a3a3a)" }}
            >
              <span className="text-2xl font-bold text-white">15%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Patient portals</div>
          </div>
          {/* Automated SMS — 20% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[71px] rounded-[24px] flex items-start justify-center pt-3.5"
              style={{ background: "linear-gradient(#333,#262626)" }}
            >
              <span className="text-2xl font-bold text-white">20%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Automated SMS</div>
          </div>
          {/* HANA Contact — 85% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center relative">
            <div className="w-full h-[300px] rounded-[24px] bg-[#aebdf2] flex items-start justify-center pt-5 relative">
              <div className="absolute -top-[54px] left-1/2 -translate-x-1/2 bg-[#aebdf2] text-white text-[12px] sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-[11px] whitespace-nowrap">
                Patients reached
              </div>
              <div className="bg-[#c2cef6] rounded-2xl px-4 sm:px-8 py-2.5 sm:py-[13px]">
                <span className="text-2xl sm:text-[32px] font-bold text-white">85%</span>
              </div>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">HANA Contact</div>
          </div>
          {/* Health apps — 35% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[124px] rounded-[24px] flex items-start justify-center pt-3.5"
              style={{ background: "linear-gradient(#1c1c1c,#0d0d0d)" }}
            >
              <span className="text-2xl font-bold text-white">35%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Health apps</div>
          </div>
        </motion.div>

        <p className="text-xs font-bold tracking-[1.5px] uppercase text-slate-400 mt-12">
          % of targeted patients reached · voice vs. passive channels
        </p>
      </section>

      {/* HOW IT WORKS — the orb-hub flow diagram (big-picture overview) */}
      <section className="bg-[#00122F] text-white py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>How it works</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              A digital front desk. Every call in, every action out.
            </h2>
          </motion.div>

          <FrontDeskDiagram />
        </div>
      </section>

      {/* THE FIVE-STEP FLOW — interactive stage pipeline (step-by-step detail) */}
      <section className="bg-[#00122F] text-white pb-20 md:pb-24 -mt-4 md:-mt-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-14">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The five-step flow</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              From ringing phone to done — in five steps.
            </h2>
          </motion.div>

          <FrontDeskPipeline />
        </div>
      </section>

      {/* STAT BAND */}
      <section className="py-16 md:py-[72px] px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-3`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] mt-0 mb-10 md:mb-[52px] max-w-[22ch]">
              The front desk, running itself.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
            <StatCell value="85" suffix="%" first>
              Patient engagement vs. 20% for automated SMS
            </StatCell>
            <StatCell value="80" suffix="%+">
              Of front desk calls handled without staff involvement
            </StatCell>
            <StatCell value="Days">
              To go live. Not months. No staff training required.
            </StatCell>
            <StatCell value="150" suffix="+">
              EHR integrations, live in your existing workflow
            </StatCell>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-[72px] px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-[52px]">
            <h2 className="font-serif font-normal text-[32px] md:text-[44px] mt-0 mb-3.5">What clinics say.</h2>
            <p className="text-[17px] leading-[1.7] text-slate-500 m-0">In their words.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            <motion.div
              {...fadeUp}
              className="rounded-[18px] p-8 bg-[#4f7bf7] text-white flex flex-col justify-between min-h-[290px]"
            >
              <div className="font-serif text-[74px] leading-[0.9]">80%+</div>
              <div>
                <div className="font-serif text-2xl mt-auto">Calls handled without staff</div>
                <div className="text-sm mt-2 opacity-80">front desk automation in production</div>
              </div>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-[18px] p-8 bg-[#f8c99a] text-[#2a2118] flex flex-col justify-between min-h-[290px]"
            >
              <div className="text-[15.5px] leading-[1.6]">
                "The calls that used to take my staff two hours a day now happen automatically.
                Patients actually pick up."
              </div>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src="/avatars/oprandi.webp"
                  alt="Dr Oprandi"
                  loading="lazy"
                  className="w-11 h-11 rounded-full object-cover object-top shrink-0"
                />
                <div>
                  <div className="text-sm font-bold">Dr Oprandi</div>
                  <div className="text-[13px] opacity-70">Primary care clinic</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="rounded-[18px] p-8 bg-[#0b1b34] text-white flex flex-col justify-between min-h-[290px]"
            >
              <div className="font-serif text-[74px] leading-[0.9]">150+</div>
              <div>
                <div className="font-serif text-2xl mt-auto">EHR systems connected</div>
                <div className="text-sm mt-2 opacity-80">live in your existing workflow, in days</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR + BRIDGE */}
      <section className="py-20 md:py-24 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-5`}>Who it's for</p>
            <p className="text-base leading-[1.75] text-slate-700 m-0">
              Primary care, behavioral health, chronic care management, specialty clinics, DME
              providers, and any practice where the phone is a bottleneck and patient follow-up is
              falling through the cracks.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-9 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,18,47,0.06)] border-l-[3px] border-[#A7BCF5]"
          >
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-3.5`}>What comes next</p>
            <h3 className="font-serif font-normal text-[26px] leading-[1.2] mt-0 mb-3.5">
              Contact gets you in. Remote is where the real value is.
            </h3>
            <p className="text-sm leading-[1.7] text-slate-500 mt-0 mb-[22px]">
              When you're ready to move from front-desk engagement to a full remote monitoring
              program, HANA Remote is already there — same platform, same EHR integration, no new
              onboarding.
            </p>
            {/* HANA Remote page not built yet — placeholder anchor until it ships. */}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e2a3a]/50 cursor-default select-none">
              HANA Remote — coming soon
            </span>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>Ready to stop missing calls?</p>
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
          <p className="text-sm text-slate-400 mt-[18px]">
            HIPAA-compliant · BAA available · 150+ EHR integrations
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

// ── "How it works" — STAGE PIPELINE ──────────────────────────────────────────
// Horizontal pipeline (Anthropic/Innovaccer "Data Activation" style): sources on
// the left feed a left-to-right chain of stage cards; the active card is enlarged
// + brand-blue with an animated icon, and a detail panel below explains it with a
// stat + proof line. Auto-advances and is clickable. Reduced-motion → no auto-play.

const PIPELINE_SOURCES = ["Inbound calls", "Patient texts & SMS", "Staff transfers", "After-hours overflow"];
const PIPELINE_OUTCOMES = ["Fewer missed calls", "Staff hours saved", "Faster patient access"];

const PIPELINE_STAGES = [
  {
    key: "Answer",
    short: "Picks up every call, text, and transfer instantly — in any language, 24/7.",
    detail:
      "HANA answers on your existing phone lines the moment a patient reaches out — inbound calls, texts, staff transfers, and after-hours overflow. No hold music, no voicemail, no missed patient. It greets, listens, and stays on the line for as long as the patient needs.",
    stat: "30%",
    statLabel: "of after-hours calls otherwise missed",
    proof: "Live on your existing phone lines",
  },
  {
    key: "Understand",
    short: "Transcribes and interprets what the patient actually needs.",
    detail:
      "Every conversation is transcribed and interpreted in real time. HANA identifies intent — a reschedule, a refill, a new-patient intake, a billing question — and pulls the patient's context so it can act, not just record.",
    stat: "Any",
    statLabel: "language, accent, and intent understood",
    proof: "Real-time transcription & intent",
  },
  {
    key: "Act",
    short: "Books, reschedules, routes, or answers — the actual front-desk task.",
    detail:
      "HANA does the work a front desk does: books and reschedules appointments, routes urgent issues, answers common questions, and collects the information your staff would otherwise chase. Most calls resolve end-to-end without anyone stepping in.",
    stat: "80%+",
    statLabel: "of front-desk calls handled without staff",
    proof: "Resolved end-to-end",
  },
  {
    key: "Sync",
    short: "Writes structured notes and outcomes straight back to your EHR.",
    detail:
      "Outcomes don't live in a separate tool. HANA writes structured notes, dispositions, and updates directly into your EHR through 150+ integrations — so the record is current the moment the call ends, with nothing to re-key.",
    stat: "150+",
    statLabel: "EHR integrations, live in your workflow",
    proof: "Direct EHR write-back",
  },
  {
    key: "Follow up",
    short: "Closes the loop: confirmations, recalls, and outreach.",
    detail:
      "HANA doesn't stop at the call. It sends confirmations, runs recall and no-show recovery, and follows up on the outreach your team never has time for — reaching patients the way they actually respond.",
    stat: "85%",
    statLabel: "patient engagement vs. 20% for SMS",
    proof: "Proactive patient outreach",
  },
] as const;

// Per-stage animated icon — a small motif that loops while its stage is active.
function StageIcon({ stage, active }: { stage: number; active: boolean }) {
  const reduce = useReducedMotion();
  const anim = active && !reduce;
  const fill = active ? "#fff" : "#A7BCF5";
  // 0 Answer: pulsing rings (a call landing). 1 Understand: dot grid settling.
  // 2 Act: scattered dots converging. 3 Sync: dots snapping to a grid. 4 Follow up: ring orbit.
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
  // dot-matrix motifs (Understand / Act / Sync)
  const dots = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) dots.push([c, r]);
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-14 md:h-14">
      {dots.map(([c, r], i) => {
        const gx = 14 + c * 12;
        const gy = 14 + r * 12;
        // Act (2) scatters; Understand (1) & Sync (3) sit on the grid.
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
                  ? {
                      x: [gx, gx + ((i * 7) % 11) - 5, gx],
                      y: [gy, gy + ((i * 5) % 11) - 5, gy],
                      opacity: [0.85, 0.4, 0.85],
                    }
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

function FrontDeskPipeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  // Auto-advance through the stages while on-screen and not hovered.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PIPELINE_STAGES.length), 3600);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const cur = PIPELINE_STAGES[active];

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Pipeline row: sources · stages · outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_150px] gap-6 lg:gap-5 items-stretch">
        {/* Sources */}
        <div className="hidden lg:flex flex-col justify-center gap-3 text-right">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Sources</p>
          {PIPELINE_SOURCES.map((s) => (
            <p key={s} className="text-[13.5px] text-white/70 leading-snug">{s}</p>
          ))}
        </div>

        {/* Stage cards */}
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto lg:overflow-visible pb-1 -mx-2 px-2 lg:mx-0 lg:px-0">
          {PIPELINE_STAGES.map((st, i) => {
            const isActive = i === active;
            return (
              <button
                key={st.key}
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`group relative flex-1 min-w-[150px] lg:min-w-0 text-left rounded-2xl p-5 transition-all duration-500 ${
                  isActive
                    ? "bg-[#2347e6] shadow-[0_18px_50px_rgba(35,71,230,0.45)]"
                    : "bg-white/[0.04] hover:bg-white/[0.07]"
                }`}
                style={{ flexGrow: isActive ? 1.5 : 1 }}
              >
                <div className="h-14 flex items-center">
                  <StageIcon stage={i} active={isActive} />
                </div>
                <div className={`mt-3 font-semibold text-[15px] ${isActive ? "text-white" : "text-white/80"}`}>
                  {st.key}
                </div>
                <motion.p
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
                  className="overflow-hidden text-[13px] leading-[1.5] text-white/85 mt-1.5"
                >
                  {st.short}
                </motion.p>
                {/* step index pill */}
                <span className={`absolute top-4 right-4 text-[11px] font-bold ${isActive ? "text-white/70" : "text-white/30"}`}>
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Outcomes */}
        <div className="hidden lg:flex flex-col justify-center gap-3">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Outcomes</p>
          {PIPELINE_OUTCOMES.map((o) => (
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
            <h3 className="font-serif font-normal text-[26px] md:text-[30px] text-white mt-0 mb-3">{cur.key}</h3>
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
            <div className="text-[13px] text-white/55 leading-[1.45] mt-2">{cur.statLabel}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stepper dots */}
      <div className="flex justify-center gap-2.5 mt-7">
        {PIPELINE_STAGES.map((st, i) => (
          <button
            key={st.key}
            onClick={() => setActive(i)}
            aria-label={`Show ${st.key}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-[#A7BCF5]" : "w-2 bg-white/25 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── "How it works" flow diagram ──────────────────────────────────────────────
// A cinematic, calm-and-premium reveal told in three acts, played once on scroll:
//
//   ACT 1 — INGEST (≈0–3.4s): the dim, dormant hub waits. Input cards fade in,
//     their connectors draw, then each input sends a *burst* of glowing packets
//     (a stream of calls/texts/transfers pouring in), all converging on the orb.
//   ACT 2 — ACTIVATE (≈3.4–4.6s): the streams land and the orb ignites — a
//     brightness + scale surge, two ripple rings burst outward, glow swells. A
//     held beat: nothing flows out yet. This is the central "moment".
//   ACT 3 — ACT ON IT (≈4.6–7s): outbound connectors draw, packets fire from the
//     hub into the EHR/actions, and each destination node lights up and *stays*
//     activated (locks to a brighter "done" state), reading as work completed.
//
// Techniques: packets ride their connector via CSS `offsetPath` (motion animates
// `offsetDistance` 0→100%); an SVG blur filter makes packets bleed light; line
// draw is `pathLength`. Inspiration: Magic UI's AnimatedBeam (MIT), but the motion
// is built around the reveal rather than a constant loop.
// All motion is gated behind prefers-reduced-motion.

const INPUT_NODES = [
  { y: 20, ty: 48, label: "Inbound patient calls" },
  { y: 88, ty: 116, label: "Patient texts & SMS" },
  { y: 156, ty: 184, label: "Transfers from staff" },
  { y: 224, ty: 252, label: "After-hours overflow" },
];

const OUTPUT_NODES = [
  { y: 20, ty: 48, label: "EHR write-back" },
  { y: 88, ty: 116, label: "Appointment booked" },
  { y: 156, ty: 184, label: "Staff escalation" },
  { y: 224, ty: 252, label: "Follow-up & outreach" },
];

// Connector geometry: inbound (left node → hub) and outbound (hub → right node).
const INBOUND_PATHS = [
  "M 220,44 C 295,44 295,65 370,65",
  "M 220,112 C 295,112 295,115 370,115",
  "M 220,180 C 295,180 295,175 370,175",
  "M 220,248 C 295,248 295,225 370,225",
];
const OUTBOUND_PATHS = [
  "M 570,65 C 645,65 645,44 720,44",
  "M 570,115 C 645,115 645,112 720,112",
  "M 570,175 C 645,175 645,180 720,180",
  "M 570,225 C 645,225 645,248 720,248",
];

// Reveal timeline (seconds). Three acts: ingest → activate → act on it.
const T = {
  hub: 0.2, // hub appears (dim/dormant)
  inputs: 0.7, // input cards begin fading in
  inDraw: 1.2, // inbound lines start drawing
  inPacket: 1.9, // first wave of inbound packets leaves the inputs
  activate: 3.4, // ACT 2 — orb ignites as the streams land
  outDraw: 4.3, // outbound lines start drawing
  outPacket: 4.7, // packets fire from the hub toward the EHR/actions
  nodeHit: 5.7, // destination nodes light up and lock to "done"
};
const PACKET_DUR = 1.1; // how long a packet takes to traverse a connector
const IN_BURST = 3; // packets per input line — reads as a stream pouring in
const BURST_GAP = 0.32; // spacing between packets within one input's burst

function FrontDeskDiagram() {
  const reduce = useReducedMotion();

  // A glowing data-packet that rides a connector path via offset-path. The bright
  // core sits inside a blurred halo (filter) so it reads as a bead of light.
  // `r` lets inbound stream-packets run a touch smaller than the outbound "actions".
  const packet = (id: string, d: string, delay: number, r = 4, dur = PACKET_DUR) => (
    <motion.circle
      key={id}
      r={r}
      fill="#e8eeff"
      filter="url(#packetGlow)"
      initial={{ offsetDistance: "0%", opacity: 0 }}
      whileInView={{
        offsetDistance: "100%",
        opacity: [0, 1, 1, 0],
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        offsetDistance: { delay, duration: dur, ease: [0.45, 0, 0.55, 1] },
        opacity: { delay, duration: dur, times: [0, 0.12, 0.82, 1] },
      }}
      style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
    />
  );

  return (
    <div className="relative">
    <motion.svg
      viewBox="0 0 940 310"
      className="w-full block"
      role="img"
      aria-label="Flow diagram: inbound patient calls, texts, staff transfers, and after-hours overflow flow into HANA Contact, which writes back to the EHR, books appointments, escalates to staff, and runs follow-up outreach."
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#A7BCF5" opacity="0.55" />
        </marker>
        {/* Soft glow used by packets and the hub core — makes light bleed. */}
        <filter id="packetGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connector lines — draw inbound first, then outbound, via pathLength */}
      <g stroke="#A7BCF5" strokeWidth="1.5" fill="none" opacity="0.45" markerEnd="url(#arr)">
        {INBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.45 : 0 },
              show: { pathLength: 1, opacity: 0.45 },
            }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : T.inDraw + i * 0.1 }}
          />
        ))}
        {OUTBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.45 : 0 },
              show: { pathLength: 1, opacity: 0.45 },
            }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : T.outDraw + i * 0.1 }}
          />
        ))}
      </g>

      {/* Traveling data-packets (skipped entirely under reduced-motion) */}
      {!reduce && (
        <>
          {/* ACT 1 — INGEST: each input fires a burst of small packets, so it reads
              as a stream of calls/texts pouring in and converging on the orb. The
              last packet of every line lands just as ACT 2 (activate) begins. */}
          {INBOUND_PATHS.map((d, i) =>
            Array.from({ length: IN_BURST }, (_, k) =>
              packet(`pin-${i}-${k}`, d, T.inPacket + i * 0.1 + k * BURST_GAP, 3, 0.95),
            ),
          )}
          {/* ACT 3 — ACT ON IT: one strong packet fires from the hub into each
              action/EHR node, slightly larger so it reads as a committed action. */}
          {OUTBOUND_PATHS.map((d, i) => packet(`pout-${i}`, d, T.outPacket + i * 0.16, 4.5))}
        </>
      )}

      {/* Input nodes — fade in from the left, staggered */}
      {INPUT_NODES.map((n, i) => (
        <motion.g
          key={n.label}
          variants={{
            hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -14 },
            show: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.5, delay: reduce ? 0 : T.inputs + i * 0.1 }}
        >
          <rect x="0" y={n.y} width="220" height="48" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <text x="16" y={n.ty} fontFamily="DM Sans, sans-serif" fontSize="13.5" fill="rgba(255,255,255,0.82)" fontWeight="500">{n.label}</text>
        </motion.g>
      ))}

      {/* Center hub */}
      <motion.g
        variants={{
          hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.94 },
          show: { opacity: 1, scale: 1 },
        }}
        transition={{ duration: 0.7, delay: reduce ? 0 : T.hub, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "470px 155px", transformBox: "fill-box" }}
      >
        <rect x="370" y="5" width="200" height="300" rx="16" fill="#1e2a3a" />

        {/* ACT 2 — ACTIVATE: when the inbound streams land, the orb ignites and
            three rings burst outward in quick succession (the "moment"). */}
        {!reduce &&
          [0, 0.18, 0.36].map((off, i) => (
            <motion.circle
              key={i}
              cx="470"
              cy="100"
              fill="none"
              stroke="#A7BCF5"
              strokeWidth="1.5"
              initial={{ r: 16, opacity: 0 }}
              whileInView={{ r: [16, 104], opacity: [0.55, 0] }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: T.activate + off, duration: 1.5, ease: "easeOut" }}
            />
          ))}

        {/* The live "Talk to Hana" bloom orb sits here as an HTML overlay (see the
            wrapper in the return below). The text + captions read beneath it. */}
        <text x="470" y="190" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="11" fontWeight="700" fill="#A7BCF5" letterSpacing="2">HANA</text>
        <text x="470" y="217" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize="27" fill="white">Contact</text>
        <line x1="406" y1="240" x2="534" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="470" y="262" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10.5" fill="rgba(255,255,255,0.38)">Your existing phone lines</text>
        <text x="470" y="280" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10.5" fill="rgba(255,255,255,0.38)">150+ EHR integrations</text>
        <text x="470" y="298" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10.5" fill="rgba(255,255,255,0.38)">Any language · 24 / 7</text>
      </motion.g>

      {/* Connection dots */}
      <g fill="#A7BCF5" opacity="0.35">
        <circle cx="370" cy="65" r="3" /><circle cx="370" cy="115" r="3" />
        <circle cx="370" cy="175" r="3" /><circle cx="370" cy="225" r="3" />
        <circle cx="570" cy="65" r="3" /><circle cx="570" cy="115" r="3" />
        <circle cx="570" cy="175" r="3" /><circle cx="570" cy="225" r="3" />
      </g>

      {/* ACT 3 — ACT ON IT: outputs fade in from the right, then as each packet
          lands the node flares and LOCKS to a brighter "done" state (it stays
          activated, with its left border lit + a confirmation dot), reading as a
          completed action in the EHR rather than a transient blink. */}
      {OUTPUT_NODES.map((n, i) => {
        const hit = T.nodeHit + i * 0.16; // when this node's packet lands
        return (
          <motion.g
            key={n.label}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : 14 },
              show: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5, delay: reduce ? 0 : T.outDraw + i * 0.1 }}
          >
            {/* Node body — flares on impact, then SETTLES brighter (stays "done") */}
            <motion.rect
              x="720"
              y={n.y}
              width="220"
              height="48"
              rx="10"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
              initial={{ fill: "rgba(255,255,255,0.06)" }}
              whileInView={
                reduce
                  ? { fill: "rgba(167,188,245,0.12)" }
                  : { fill: ["rgba(255,255,255,0.06)", "rgba(167,188,245,0.34)", "rgba(167,188,245,0.12)"] }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit, duration: 1.0, times: [0, 0.35, 1], ease: "easeOut" }}
            />
            {/* Lit left edge — lights up on impact and stays on (the "active" marker) */}
            <motion.rect
              x="720"
              y={n.y}
              width="3"
              height="48"
              rx="1.5"
              fill="#A7BCF5"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit + 0.1, duration: 0.4 }}
            />
            {/* Confirmation dot — pops in on the right as the action completes */}
            <motion.circle
              cx="922"
              cy={n.y + 24}
              r="3.5"
              fill="#A7BCF5"
              filter="url(#packetGlow)"
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit + 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `922px ${n.y + 24}px`, transformBox: "fill-box" }}
            />
            <text x="736" y={n.ty} fontFamily="DM Sans, sans-serif" fontSize="13.5" fill="rgba(255,255,255,0.92)" fontWeight="500">{n.label}</text>
          </motion.g>
        );
      })}
    </motion.svg>

      {/* "Talk to Hana" bloom orb — HTML overlay centered on the SVG hub core.
          Position tracks the hub: cx 470/940 = 50%, cy 100/310 ≈ 32.3% of the
          rendered SVG. Scales down with the diagram so it always fills the hub.
          Choreography: appears DIM during ACT 1 (ingest), then IGNITES at ACT 2 —
          a brightness + scale surge synced to the ripple burst — and settles. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "32.3%", translate: "-50% -50%" }}
        initial={{ opacity: 0, scale: 0.82, filter: "saturate(0.4) brightness(0.6)" }}
        whileInView={
          reduce
            ? { opacity: 1, scale: 1, filter: "saturate(1) brightness(1)" }
            : {
                opacity: [0, 0.5, 0.5, 1, 0.92],
                scale: [0.82, 0.9, 0.9, 1.06, 1],
                filter: [
                  "saturate(0.4) brightness(0.6)",
                  "saturate(0.55) brightness(0.72)",
                  "saturate(0.55) brightness(0.72)",
                  "saturate(1.15) brightness(1.25)",
                  "saturate(1) brightness(1)",
                ],
              }
        }
        viewport={{ once: true, margin: "-80px" }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                // keyframe times map to: appear(hub) → hold dim → ignite(activate) → settle
                duration: T.activate + 1.2,
                times: [0, T.hub / (T.activate + 1.2), (T.activate - 0.3) / (T.activate + 1.2), (T.activate + 0.5) / (T.activate + 1.2), 1],
                ease: "easeInOut",
              }
        }
        aria-hidden="true"
      >
        {/* HanaBloomOrb renders a fixed 300px square; scale it down to fill the
            hub interior. transform-scale keeps the center pinned to the hub core
            (the wrapper above centers via translate), so it tracks across breakpoints. */}
        <div
          style={{ transformOrigin: "center center" }}
          className="scale-[0.2] sm:scale-[0.34] md:scale-[0.46] lg:scale-[0.56]"
        >
          <HanaBloomOrb />
        </div>
      </motion.div>
    </div>
  );
}

/** A single stat in the "By the numbers" band — large serif figure + caption,
 *  with a hairline divider on the left for all but the first cell. */
function StatCell({
  value,
  suffix,
  first,
  children,
}: {
  value: string;
  suffix?: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`px-5 md:px-11 ${first ? "" : "lg:border-l lg:border-[#dfe3ee]"}`}>
      <div className="font-serif text-[56px] md:text-[84px] leading-[0.95] mb-3">
        {value}
        {suffix && <span className="text-[28px] md:text-[40px] text-[#5b76d9]">{suffix}</span>}
      </div>
      <div className="text-[15px] text-slate-500 leading-[1.5]">{children}</div>
    </div>
  );
}
