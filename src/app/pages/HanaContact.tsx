import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check, X, ChevronDown } from "lucide-react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";
import { RecipesMarquee } from "../components/RecipesMarquee";

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

// ── Content for the borrowed sections (comparison / done-for-you / FAQ) ──────
const WITH_HANA = [
  "Every call answered & handled — 24/7",
  "Staff focused on patients, not phones",
  "Automatic outbound follow-up & recall",
  "Structured notes written back to the EHR",
  "Any language, any time of day",
];
const WITHOUT_HANA = [
  "Missed calls after hours and at lunch",
  "Staff pulled off care to answer phones",
  "Follow-ups tracked in spreadsheets",
  "Manual re-keying into the chart",
  "Limited to 9–5, English only",
];

const START_STEPS = [
  {
    title: "Connect your lines",
    desc: "We plug HANA into your existing phone numbers and EHR — no rip-and-replace, no new hardware, no IT lift on your side.",
  },
  {
    title: "Tailor your agent",
    desc: "We configure how HANA answers, routes, schedules, and documents — matched to your protocols, your specialties, and your workflows.",
  },
  {
    title: "Go live",
    desc: "HANA starts answering on day one. A dedicated team monitors quality and tunes continuously as your call patterns shift.",
  },
];

const FAQS = [
  {
    q: "Will it actually sound human?",
    a: "Yes. HANA speaks naturally, handles interruptions, and adapts to how each patient talks. Most callers don't realize they're speaking with an AI — and it never gets impatient or reads from a rigid script.",
  },
  {
    q: "Do I need to retrain my staff?",
    a: "No. HANA slots in behind your existing phone lines and hands off to staff only when it should. Your team keeps working exactly as they do — with far fewer calls to answer.",
  },
  {
    q: "What if we use a niche or older EHR?",
    a: "HANA integrates with 150+ systems, and we regularly add new ones. If yours isn't already supported, our team scopes the integration as part of onboarding.",
  },
  {
    q: "What languages do you support?",
    a: "HANA handles calls in any language your patients speak, switching automatically based on the caller — no separate lines or configuration required.",
  },
  {
    q: "How does pricing work?",
    a: "A flat monthly rate scaled to your call volume, with no hidden per-minute fees. Onboarding, integration, and ongoing tuning are included.",
  },
];

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
      {/* HERO + digital-front-desk diagram — one dominant light block */}
      <header className="bg-[#f6f7fb] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
          <motion.p
            {...fadeUp}
            className={`${eyebrow} text-[#5b76d9] m-0`}
          >
            HANA Contact · Better than an IVR
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[52px] sm:text-[68px] md:text-[92px] leading-[1.0] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[16ch]"
          >
            Your phones answer themselves.
            <br />
            <em className="text-[#5b76d9]">So your front desk can focus on care.</em>
          </motion.h1>
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#1e2a3a] text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-10 md:mt-12"
          >
            Book a demo →
          </motion.a>
        </div>
      </header>

      {/* Front-desk flow — blended into the hero (no heading, orb is the center).
          The wide SVG is illegible at phone widths, so below md we render a
          vertical stacked variant instead. */}
      <section className="bg-[#f6f7fb] pb-24 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <div className="hidden md:block">
            <FrontDeskDiagram />
          </div>
          <div className="md:hidden">
            <FrontDeskDiagramMobile />
          </div>
        </div>
      </section>

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
          Your IVR sends them to voicemail.
          <br />
          <em className="italic">HANA Contact resolves the call.</em>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-[17px] leading-[1.7] text-slate-500 max-w-[60ch] mx-auto"
        >
          Phone trees, hold music, and callback voicemails leave most calls unresolved. HANA Contact
          answers, understands, and finishes the call — no human required.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-end justify-center gap-4 sm:gap-8 md:gap-10 h-[340px] mt-12 md:mt-[72px]"
        >
          {/* Traditional IVR — 10% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[42px] rounded-[24px] flex items-start justify-center pt-3"
              style={{ background: "linear-gradient(#4a4a4a,#3a3a3a)" }}
            >
              <span className="text-2xl font-bold text-white">10%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Traditional IVR</div>
          </div>
          {/* Voicemail + callback — 5% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[28px] rounded-[24px] flex items-start justify-center pt-1"
              style={{ background: "linear-gradient(#333,#262626)" }}
            >
              <span className="text-xl font-bold text-white">5%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Voicemail + callback</div>
          </div>
          {/* HANA Contact — 85% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center relative">
            <div className="w-full h-[300px] rounded-[24px] bg-[#aebdf2] flex items-start justify-center pt-5 relative">
              <div className="absolute -top-[54px] left-1/2 -translate-x-1/2 bg-[#aebdf2] text-white text-[12px] sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-[11px] whitespace-nowrap">
                Calls resolved
              </div>
              <div className="bg-[#c2cef6] rounded-2xl px-4 sm:px-8 py-2.5 sm:py-[13px]">
                <span className="text-2xl sm:text-[32px] font-bold text-white">85%</span>
              </div>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">HANA Contact</div>
          </div>
          {/* Phone tree + hold — 15% */}
          <div className="w-[72px] sm:w-[120px] md:w-40 flex flex-col items-center">
            <div
              className="w-full h-[53px] rounded-[24px] flex items-start justify-center pt-3.5"
              style={{ background: "linear-gradient(#1c1c1c,#0d0d0d)" }}
            >
              <span className="text-2xl font-bold text-white">15%</span>
            </div>
            <div className="mt-5 text-[13px] sm:text-base font-semibold">Phone tree + hold</div>
          </div>
        </motion.div>

        <p className="text-xs font-bold tracking-[1.5px] uppercase text-slate-400 mt-12">
          % of inbound calls resolved without a human · voice AI vs. legacy phone systems
        </p>
      </section>

      {/* ROI CALCULATOR — "Run the numbers" */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The missed-call math</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              How many calls slip through <em className="text-[#5b76d9]">every month?</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-500 max-w-[52ch] mx-auto mt-4">
              Every missed call is a patient who doesn't book. Here's what that leak looks like for you.
            </p>
          </motion.div>
          <RoiCalculator />
        </div>
      </section>

      {/* THE FIVE-STEP FLOW — interactive stage pipeline (step-by-step detail) */}
      <section className="bg-[#00122F] text-white py-20 md:py-24">
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

      {/* A TALE OF TWO FRONT DESKS — with / without comparison */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>A tale of two front desks</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              HANA Contact vs. the status quo.
            </h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-slate-200">
            {/* With */}
            <div className="bg-[#f6f7fb] p-7 md:p-9">
              <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-6`}>With HANA Contact</p>
              <ul className="space-y-4 m-0 p-0 list-none">
                {WITH_HANA.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-[#00122F]">
                    <Check className="w-5 h-5 text-[#5b76d9] shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {/* Without */}
            <div className="bg-white p-7 md:p-9 border-t md:border-t-0 md:border-l border-slate-200">
              <p className={`${eyebrow} text-slate-400 mt-0 mb-6`}>Without</p>
              <ul className="space-y-4 m-0 p-0 list-none">
                {WITHOUT_HANA.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-slate-500">
                    <X className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
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

      {/* HOW WE START — three steps */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>How we start</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              Three steps. <em className="text-[#5b76d9]">You're live in 3 weeks.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {START_STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.1 }}
                className="rounded-2xl bg-[#f6f7fb] border border-slate-200 p-7 md:p-8"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#1e2a3a] text-white font-serif text-[20px]">
                  {i + 1}
                </div>
                <h3 className="font-serif font-normal text-[24px] leading-[1.2] mt-5 mb-3 text-[#00122F]">{s.title}</h3>
                <p className="text-[15px] leading-[1.7] text-slate-500 m-0">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS — telephony systems + EHR, specific to HANA Contact */}
      <ContactIntegrations />

      {/* WORKFLOWS — homepage marquee filtered to front-desk workflows only
          (intake calls, refill triage, recalls / no-show recovery — not the
          clinical-program recipes). IT tags included for locale safety. */}
      <RecipesMarquee tags={["Intake", "Refills", "Reactivation", "Accoglienza", "Ricette", "Recupero"]} />

      {/* FAQ */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#f6f7fb]">
        <div className="max-w-[820px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Questions? Answers.</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#00122F]">
              The things everyone asks.
            </h2>
          </motion.div>
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {FAQS.map((f, i) => (
              <FaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
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
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto lg:overflow-visible pb-1 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none">
          {PIPELINE_STAGES.map((st, i) => {
            const isActive = i === active;
            return (
              <button
                key={st.key}
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`group relative flex-1 min-w-[150px] lg:min-w-0 snap-start text-left rounded-2xl p-5 transition-all duration-500 ${
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

// Compact lucide-style icon paths (24×24 viewBox) for the node icon wells.
const ICONS = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  transfer: "M16 3h5v5 M4 20 21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5 M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  alert: "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  megaphone: "M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6",
};

const INPUT_NODES = [
  { y: 16, label: "Inbound patient calls", icon: ICONS.phone },
  { y: 88, label: "Patient texts & SMS", icon: ICONS.message },
  { y: 160, label: "Transfers from staff", icon: ICONS.transfer },
  { y: 232, label: "After-hours overflow", icon: ICONS.moon },
];

const OUTPUT_NODES = [
  { y: 16, label: "EHR write-back", icon: ICONS.database },
  { y: 88, label: "Appointment booked", icon: ICONS.calendar },
  { y: 160, label: "Staff escalation", icon: ICONS.alert },
  { y: 232, label: "Follow-up & outreach", icon: ICONS.megaphone },
];

// Connector geometry: inbound (left node → orb edge) and outbound (orb edge →
// right node). Lines run all the way to the orb (x≈430 / x≈510) so they visually
// flow into the circle instead of stopping short in empty space.
const INBOUND_PATHS = [
  "M 220,40 C 330,40 380,120 424,128",
  "M 220,112 C 340,112 380,146 420,150",
  "M 220,184 C 340,184 380,164 420,160",
  "M 220,256 C 330,256 380,190 424,182",
];
const OUTBOUND_PATHS = [
  "M 516,128 C 560,120 610,40 720,40",
  "M 520,150 C 560,146 600,112 720,112",
  "M 520,160 C 560,164 600,184 720,184",
  "M 516,182 C 560,190 610,256 720,256",
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

// A node icon: the 24×24 lucide path scaled ~0.62 and centered in a 14px well.
function NodeGlyph({ cx, cy, icon }: { cx: number; cy: number; icon: string }) {
  return (
    <g transform={`translate(${cx - 7.4}, ${cy - 7.4}) scale(0.62)`}>
      <path d={icon} fill="none" stroke="#5b76d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// A polished node card: rounded white rect + periwinkle icon well + label.
// Shared by both input and output columns so the two sides feel like a pair.
function NodeCard({ x, y, label, icon }: { x: number; y: number; label: string; icon: string }) {
  return (
    <g>
      <rect x={x} y={y} width="220" height="48" rx="12" fill="#fff" stroke="#e2e6f0" strokeWidth="1" />
      <circle cx={x + 26} cy={y + 24} r="14" fill="#eef1fb" />
      <NodeGlyph cx={x + 26} cy={y + 24} icon={icon} />
      <text x={x + 52} y={y + 29} fontFamily="DM Sans, sans-serif" fontSize="13" fill="#00122F" fontWeight="500">{label}</text>
    </g>
  );
}

function FrontDeskDiagram() {
  const reduce = useReducedMotion();

  // A glowing data-packet that rides a connector path via offset-path. The bright
  // core sits inside a blurred halo (filter) so it reads as a bead of light.
  // `r` lets inbound stream-packets run a touch smaller than the outbound "actions".
  const packet = (id: string, d: string, delay: number, r = 4, dur = PACKET_DUR) => (
    <motion.circle
      key={id}
      r={r}
      fill="#5b76d9"
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
          <polygon points="0 0, 7 3, 0 6" fill="#5b76d9" opacity="0.7" />
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
      <g stroke="#5b76d9" strokeWidth="1.5" fill="none" opacity="0.55" markerEnd="url(#arr)">
        {INBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.55 : 0 },
              show: { pathLength: 1, opacity: 0.55 },
            }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : T.inDraw + i * 0.1 }}
          />
        ))}
        {OUTBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.55 : 0 },
              show: { pathLength: 1, opacity: 0.55 },
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

      {/* Input nodes — icon well + label, fade in from the left, staggered */}
      {INPUT_NODES.map((n, i) => (
        <motion.g
          key={n.label}
          variants={{
            hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -14 },
            show: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.5, delay: reduce ? 0 : T.inputs + i * 0.1 }}
        >
          <NodeCard x={0} y={n.y} label={n.label} icon={n.icon} />
        </motion.g>
      ))}

      {/* Center — just the orb (HTML overlay in the return below). The only SVG
          here is the ACT 2 activation ripple that bursts from the orb's center. */}
      {!reduce &&
        [0, 0.18, 0.36].map((off, i) => (
          <motion.circle
            key={i}
            cx="470"
            cy="155"
            fill="none"
            stroke="#5b76d9"
            strokeWidth="1.5"
            initial={{ r: 20, opacity: 0 }}
            whileInView={{ r: [20, 110], opacity: [0.4, 0] }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: T.activate + off, duration: 1.5, ease: "easeOut" }}
          />
        ))}


      {/* ACT 3 — ACT ON IT: outputs fade in from the right, then as each packet
          lands the node flares and LOCKS to a brighter "done" state (a checkmark
          replaces its icon), reading as a completed action rather than a blink. */}
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
            {/* Base card — flares on impact, then settles to a lit periwinkle tint. */}
            <motion.rect
              x="720"
              y={n.y}
              width="220"
              height="48"
              rx="12"
              stroke="#e2e6f0"
              strokeWidth="1"
              initial={{ fill: "#ffffff" }}
              whileInView={
                reduce
                  ? { fill: "rgba(91,118,217,0.08)" }
                  : { fill: ["#ffffff", "rgba(91,118,217,0.22)", "rgba(91,118,217,0.08)"] }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit, duration: 1.0, times: [0, 0.35, 1], ease: "easeOut" }}
            />
            {/* Icon well + icon (shared look with inputs) */}
            <circle cx="746" cy={n.y + 24} r="14" fill="#eef1fb" />
            <NodeGlyph cx={746} cy={n.y + 24} icon={n.icon} />
            <text x="772" y={n.y + 29} fontFamily="DM Sans, sans-serif" fontSize="13" fill="#00122F" fontWeight="500">{n.label}</text>
            {/* Confirmation check — pops in at the right edge as the action completes */}
            <motion.g
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `926px ${n.y + 24}px`, transformBox: "fill-box" }}
            >
              <circle cx="926" cy={n.y + 24} r="7" fill="#5b76d9" />
              <path
                d={`M ${926 - 3},${n.y + 24} l 1.9,2 l 3.7,-4`}
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </motion.g>
        );
      })}
    </motion.svg>

      {/* "Talk to Hana" bloom orb — the center of the diagram (no card behind it).
          Positioned at the SVG center: cx 470/940 = 50%, cy 155/310 = 50%.
          Fades in dim during ACT 1, then ignites (brightness + scale) at ACT 2. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "50%", translate: "-50% -50%" }}
        initial={{ opacity: 0, scale: 0.82, filter: "saturate(0.5) brightness(0.8)" }}
        whileInView={
          reduce
            ? { opacity: 1, scale: 1, filter: "saturate(1) brightness(1)" }
            : {
                opacity: [0, 0.55, 0.55, 1, 0.95],
                scale: [0.82, 0.9, 0.9, 1.06, 1],
                filter: [
                  "saturate(0.5) brightness(0.8)",
                  "saturate(0.6) brightness(0.85)",
                  "saturate(0.6) brightness(0.85)",
                  "saturate(1.15) brightness(1.15)",
                  "saturate(1) brightness(1)",
                ],
              }
        }
        viewport={{ once: true, margin: "-80px" }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: T.activate + 1.2,
                times: [0, T.hub / (T.activate + 1.2), (T.activate - 0.3) / (T.activate + 1.2), (T.activate + 0.5) / (T.activate + 1.2), 1],
                ease: "easeInOut",
              }
        }
        aria-hidden="true"
      >
        {/* HanaBloomOrb renders a fixed 300px square; scale it to fill the upper
            hub area. transform-scale keeps the center pinned to the hub core. */}
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

// Vertical variant of the flow for phones: input chips stack above the orb,
// output chips (with "done" checks) below, joined by short connector stems.
// The wide SVG diagram is unreadable at phone scale — this replaces it under md.
function FrontDeskDiagramMobile() {
  const reduce = useReducedMotion();
  const chip = (label: string, icon: string, i: number, done = false) => (
    <motion.div
      key={label}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.08 }}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 ${
        done ? "bg-[#5b76d9]/10 border-[#dfe3ee]" : "bg-white border-[#e2e6f0]"
      }`}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eef1fb] shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#5b76d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-[#00122F] leading-tight flex-1">{label}</span>
      {done && (
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#5b76d9] shrink-0">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
    </motion.div>
  );

  const stem = (delay: number) => (
    <motion.div
      initial={{ scaleY: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: reduce ? 0 : delay }}
      style={{ transformOrigin: "top" }}
      className="w-px h-8 bg-gradient-to-b from-[#5b76d9]/20 via-[#5b76d9]/60 to-[#5b76d9]/20 my-1"
      aria-hidden="true"
    />
  );

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label="Flow: inbound patient calls, texts, staff transfers, and after-hours overflow flow into HANA Contact, which writes back to the EHR, books appointments, escalates to staff, and runs follow-up outreach."
    >
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {INPUT_NODES.map((n, i) => chip(n.label, n.icon, i))}
      </div>
      {stem(0.35)}
      <motion.div
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
        style={{ width: 132, height: 132 }}
        aria-hidden="true"
      >
        <div className="absolute scale-[0.44]" style={{ transformOrigin: "center center" }}>
          <HanaBloomOrb />
        </div>
      </motion.div>
      {stem(0.6)}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {OUTPUT_NODES.map((n, i) => chip(n.label, n.icon, i + 6, true))}
      </div>
    </div>
  );
}

// ── Missed-call calculator ───────────────────────────────────────────────────
// Editable clinic inputs → how many calls you're missing and what it costs.
// Grounded in the missed-call leak (not an ROI multiple):
//   missed/mo = locations × monthlyCalls × missedRate
//   lost revenue/yr = missed × 12 × conversion × visitValue
//   recovered/yr = lost revenue × recoveryRate
const HANA_RECOVERY_RATE = 0.7; // share of currently-missed calls HANA recovers
const CALL_TO_VISIT = 0.35; // share of missed calls that would have booked a visit

function RoiCalculator() {
  const [locations, setLocations] = useState(10);
  const [monthlyCalls, setMonthlyCalls] = useState(2000);
  const [missedRate, setMissedRate] = useState(20); // percent
  const [visitValue, setVisitValue] = useState(150);

  const { missedPerMonth, lostRevenue, recovered } = useMemo(() => {
    const missedMo = locations * monthlyCalls * (missedRate / 100);
    const lost = missedMo * 12 * CALL_TO_VISIT * visitValue;
    return {
      missedPerMonth: missedMo,
      lostRevenue: lost,
      recovered: lost * HANA_RECOVERY_RATE,
    };
  }, [locations, monthlyCalls, missedRate, visitValue]);

  const money = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
  const count = (n: number) => Math.round(n).toLocaleString();

  // Slider + editable value: dragging is the primary interaction (thumb-friendly
  // on mobile); the small number field allows exact entry beyond the slider range.
  const field = (
    label: string,
    value: number,
    set: (v: number) => void,
    opts: { min: number; max: number; step?: number; prefix?: string; suffix?: string },
  ) => (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-slate-500">{label}</span>
        <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1 focus-within:border-[#5b76d9] focus-within:ring-2 focus-within:ring-[#5b76d9]/20 transition shrink-0">
          {opts.prefix && <span className="text-slate-400 text-[13px] mr-0.5">{opts.prefix}</span>}
          <input
            type="number"
            value={value}
            min={opts.min}
            step={opts.step}
            onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
            className="w-[64px] bg-transparent outline-none text-[15px] font-semibold text-[#00122F] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {opts.suffix && <span className="text-slate-400 text-[13px] ml-0.5">{opts.suffix}</span>}
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
      {/* Inputs */}
      <div className="bg-white p-7 md:p-9">
        <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-5`}>Your practice</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {field("Number of locations", locations, setLocations, { min: 1, max: 50 })}
          {field("Avg monthly calls / location", monthlyCalls, setMonthlyCalls, { min: 100, max: 6000, step: 100 })}
          {field("Average missed-call rate", missedRate, setMissedRate, { min: 0, max: 50, suffix: "%" })}
          {field("Average visit value", visitValue, setVisitValue, { min: 50, max: 500, step: 10, prefix: "$" })}
        </div>
        <p className="text-[12px] text-slate-400 mt-5 leading-[1.6]">
          Estimates only, for illustration. Assumes ~35% of missed calls would have booked a visit, and
          HANA recovers ~70% of them. <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="text-[#5b76d9] underline">Get a tailored assessment →</a>
        </p>
      </div>
      {/* Result — the leak, then what HANA plugs back */}
      <div className="bg-[#00122F] text-white p-7 md:p-9 flex flex-col justify-center">
        <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-3`}>Calls you're missing</p>
        <div className="font-serif text-[56px] md:text-[72px] leading-[0.95]">
          ≈ {count(missedPerMonth)}
          <span className="font-sans text-[18px] md:text-[22px] font-medium text-white/50"> / month</span>
        </div>
        <p className="text-[15px] text-white/60 mt-3">
          That's up to <span className="font-semibold text-white">{money(lostRevenue)}/year</span> in lost visits walking out the door.
        </p>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[15px] leading-[1.6] text-white/60 m-0">
            HANA Contact answers every one of them — recovering roughly{" "}
            <span className="font-semibold text-[#A7BCF5]">{money(recovered)}/year</span> your front desk can't get to today.
          </p>
          {/* Recovered vs. lost — visual share of the leak HANA plugs back */}
          <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#A7BCF5]"
              initial={{ width: 0 }}
              whileInView={{ width: `${HANA_RECOVERY_RATE * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold tracking-[1px] uppercase text-white/40 mt-2">
            <span>Recovered by HANA</span>
            <span>~{Math.round(HANA_RECOVERY_RATE * 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Integrations — telephony systems + EHR ───────────────────────────────────
// Page-specific (the homepage IntegrationsSection is broader). Two pillars: the
// phone system HANA answers on, and the EHR it reads from / writes back to.
const INTEGRATION_PILLARS = [
  {
    icon: ICONS.phone,
    title: "Telephony & phone systems",
    tagline: "Keeps your numbers. Replaces your IVR.",
    body: "HANA sits behind the lines you already have — cloud phone systems, SIP trunks, or plain analog. Forward the line or keep it as-is; either way, every call is answered in seconds.",
    chips: ["RingCentral", "8x8", "Zoom Phone", "Dialpad", "Twilio / SIP", "Any analog line"],
    foot: "No porting. No new hardware. Live in days.",
  },
  {
    icon: ICONS.database,
    title: "EHR integrations",
    tagline: "Reads the chart. Writes structured notes back.",
    body: "Direct integrations with major EHRs, or through Redox and health-data networks to reach 150+ systems. HANA pulls patient context before it speaks — and documents the outcome when it hangs up.",
    chips: ["Athena Health", "Charm", "Practice Q", "Redox", "eClinicalWorks", "150+ EHRs"],
    foot: "The chart is current the moment the call ends.",
  },
];

function ContactIntegrations() {
  return (
    <section className="py-20 md:py-24 px-6 md:px-16 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>Plugs into what you run</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[26ch] text-[#00122F]">
            Your phone system. Your EHR. <em className="text-[#5b76d9]">No rip-and-replace.</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {INTEGRATION_PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.1 }}
              className="group rounded-2xl bg-[#f6f7fb] border border-slate-200 p-7 md:p-9 transition-all duration-300 hover:border-[#c2cef6] hover:shadow-[0_16px_44px_rgba(0,18,47,0.10)]"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-[#eef1fb] mb-6 transition-colors group-hover:bg-[#e2e8fb]">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#5b76d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.icon} />
                </svg>
              </span>
              <h3 className="font-serif font-normal text-[24px] md:text-[26px] leading-[1.15] mt-0 mb-1.5 text-[#00122F]">{p.title}</h3>
              <p className="text-[14px] font-medium text-[#5b76d9] mt-0 mb-4">{p.tagline}</p>
              <p className="text-[15px] leading-[1.7] text-slate-500 mt-0 mb-7">{p.body}</p>
              <div className="flex flex-wrap gap-2.5">
                {p.chips.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-[#00122F] transition-colors hover:border-[#A7BCF5] hover:bg-[#eef1fb]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5b76d9]" aria-hidden="true" />
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-[13px] font-semibold text-slate-400 mt-7 mb-0 pt-5 border-t border-slate-200">{p.foot}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ accordion row ────────────────────────────────────────────────────────
function FaqRow({ q, a, index }: { q: string; a: string; index: number }) {
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
            key={`faq-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[15px] leading-[1.7] text-slate-500 pb-5 pr-8 m-0">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
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
