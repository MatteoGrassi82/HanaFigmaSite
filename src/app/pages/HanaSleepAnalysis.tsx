import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { SafetyStack } from "../components/ui/safety-stack";
import { NightSky } from "../components/ui/night-sky";
import { Glyph, RI } from "../components/remote/CompassDashboard";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * HANA Sleep — Sleep Analysis platform. The wearable-agnostic, AI-driven sleep
 * analysis engine: it reads the hypnogram consumer wearables and Type III/IV
 * home testing already produce and extracts clinically meaningful insight —
 * bridging consumer sleep technology and clinical sleep medicine. Clinical
 * decision support that complements HST and PSG through longitudinal assessment.
 *
 * One of the HANA Sleep suite of solutions (see HanaSleep.tsx for the umbrella;
 * HanaSleepCPAP.tsx for the CPAP Adherence Program). Shares the design language
 * of HANA Remote / HANA Contact and reuses the NightSky hero and the
 * defense-in-depth Safety Stack.
 *
 * Scaffolded page: real structure and copy grounded in the product's stated
 * positioning; deliberately lighter than the CPAP page while the platform's
 * specifics firm up.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

// ── Content ──────────────────────────────────────────────────────────────────

// What the platform does — the three moves that turn a wearable's raw night
// into a clinically usable read.
const CAPABILITIES = [
  {
    icon: RI.watch,
    title: "Wearable-agnostic by design",
    body: "It doesn't matter what the patient wears. HANA Sleep reads the hypnogram consumer wearables already produce — Apple Watch, Oura, Fitbit, Garmin — and pulls the same signal from Type III and Type IV home sleep testing. One platform, every device.",
  },
  {
    icon: RI.activity,
    title: "Insight, not more data",
    body: "A novel, AI-driven algorithm extracts clinically meaningful insight from the night — not another number to interpret. It reads the architecture of sleep the way a clinician would, against clinical best practices and the patient's own history.",
  },
  {
    icon: RI.cycle,
    title: "Longitudinal by default",
    body: "One night is a snapshot; the pattern is the diagnosis. HANA Sleep assesses sleep over weeks and months, surfacing the trend and the drift that a single study can't — so treatment can be adjusted before the patient falls off it.",
  },
];

// Where it sits in the clinical pathway — it complements the gold-standard
// tests rather than competing with them.
const FITS = [
  {
    k: "Consumer wearables",
    body: "The device the patient already sleeps with, read for clinically relevant signal — no new hardware, no behavior change.",
  },
  {
    k: "Type III & IV home testing",
    body: "The same engine reads home sleep apnea test data, bringing consistency across the settings where most testing now happens.",
  },
  {
    k: "Complements HST & PSG",
    body: "Not a replacement for home sleep testing or polysomnography — a longitudinal layer around them, filling the months a single study leaves dark.",
  },
];

const A_FAQS = [
  {
    q: "What exactly does the platform analyze?",
    a: "The hypnogram — the stepped record of sleep stages across the night (Awake · REM · Light · Deep) that wearables and home sleep tests already produce. HANA Sleep interprets it against clinical best practices and the patient's own baseline to extract clinically meaningful insight.",
  },
  {
    q: "Which devices and testing environments does it support?",
    a: "It's wearable-agnostic. Consumer devices — Apple Watch, Oura, Fitbit, Garmin — and Type III and Type IV sleep testing environments. The point of the platform is that the analysis doesn't depend on the hardware.",
  },
  {
    q: "Does it replace a sleep study?",
    a: "No. HANA Sleep is a clinical decision support tool that complements home sleep testing (HST) and polysomnography (PSG). It adds longitudinal assessment — the ongoing read between and after studies — rather than standing in for the diagnostic test itself.",
  },
  {
    q: "Is it a medical device?",
    a: "No. It's clinical decision support, not a medical device. Every interpretation is presented for the clinician to agree with or override — the platform reads and reports, the clinician decides.",
  },
  {
    q: "How does this relate to the CPAP Adherence Program?",
    a: "They're two solutions in the same HANA Sleep suite. Sleep Analysis is the wearable-agnostic read of the night; the CPAP Adherence Program is the autonomous voice follow-up that keeps patients on therapy. The analysis platform can feed the follow-up, but each stands on its own.",
  },
];

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

function AFaqRow({ q, a, index }: { q: string; a: string; index: number }) {
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
            key={`afaq-${index}`}
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

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaSleepAnalysis() {
  return (
    <div className="bg-[#00122F] text-white font-sans overflow-x-hidden">
      <SEO
        title="HANA Sleep Analysis — Clinically Meaningful Insight From Any Wearable"
        useExactTitle
        type="product"
        description="HANA Sleep is a wearable-agnostic sleep analysis platform. A novel, AI-driven algorithm extracts clinically meaningful insight from the hypnogram consumer wearables and Type III/IV home testing already produce — bridging consumer sleep technology and clinical sleep medicine. Clinical decision support that complements HST and PSG."
        path="/hana-sleep/analysis"
        keywords="sleep analysis, wearable sleep analysis, hypnogram interpretation, wearable-agnostic sleep platform, Type III sleep testing, Type IV sleep testing, HST, PSG, longitudinal sleep assessment, clinical decision support sleep"
        jsonLd={[
          breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Sleep", url: "https://www.hana.health/hana-sleep" },
          { name: "Sleep Analysis", url: "https://www.hana.health/hana-sleep/analysis" },
        ]),
          faqSchema(A_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* HERO — night sky, same immersive treatment as the CPAP page */}
      <header className="relative overflow-hidden bg-[#00122F] text-white flex items-center min-h-[86vh] md:min-h-[760px] pt-32 pb-28 md:pt-36 md:pb-40">
        <NightSky />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-16 text-center w-full">
          <motion.p {...fadeUp} className={`${eyebrow} text-[#A7BCF5] m-0`}>
            HANA Sleep · Sleep Analysis
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[80px] leading-[1.02] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[17ch]"
          >
            Not more data. <em className="text-[#A7BCF5]">Meaning.</em>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[17px] md:text-[19px] leading-[1.6] text-white/75 mt-7 mb-0 mx-auto max-w-[54ch]"
          >
            HANA Sleep is redefining how sleep is understood — not by collecting more data, but by extracting
            <em className="text-[#A7BCF5] not-italic font-semibold"> clinically meaningful insight</em> from
            any wearable.
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

      {/* THE POSITIONING — one clear statement, right below the hero */}
      <section className="py-20 md:py-24 px-6 md:px-16 text-white" style={{ background: "linear-gradient(180deg, #00122F 0%, #081a38 100%)" }}>
        <div className="max-w-[820px] mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The idea</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mt-0 mb-5 mx-auto max-w-[24ch]">
              Bridging consumer sleep tech and <em className="text-[#A7BCF5]">clinical sleep medicine.</em>
            </h2>
            <p className="text-[17px] leading-[1.75] text-white/70 m-0 mx-auto max-w-[62ch]">
              Powered by a novel, AI-driven algorithm, HANA Sleep delivers advanced, clinically relevant
              sleep analysis from the wearable devices patients already own — a single, wearable-agnostic
              platform that reads the night the way a clinician would.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT IT DOES — three capabilities */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #081a38 0%, #0c1f40 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>What it does</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mx-auto max-w-[24ch]">
              One platform. <em className="text-[#A7BCF5]">Every device.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-[12px] bg-white/[0.06] border border-white/10 text-[#A7BCF5] mb-5">
                  <Glyph d={c.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.2] mt-0 mb-3 text-white">{c.title}</h3>
                <p className="text-[15px] leading-[1.7] text-white/65 m-0">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE NIGHT IT READS — hypnogram visual + the wearable-agnostic pitch */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #0c1f40 0%, #00122F 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The night it reads</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-5 max-w-[20ch]">
              The signal is already there. <em className="text-[#A7BCF5]">We read it.</em>
            </h2>
            <p className="text-[16px] leading-[1.7] text-white/70 m-0 max-w-[46ch]">
              Every wearable and every home sleep test already records a hypnogram — the shape of the night
              across its stages. HANA Sleep interprets that record against clinical best practices and the
              patient's own history, and returns a clinically meaningful read. We don't build the hardware
              or run the study; we make sense of what it already captured.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold tracking-[1.5px] uppercase text-[#A7BCF5]">A single night, read</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                <Glyph d={RI.activity} className="w-3.5 h-3.5" /> Hypnogram · via API
              </span>
            </div>
            <Hypnogram />
            <div className="mt-5 flex flex-wrap gap-2">
              {["Apple Watch", "Oura", "Fitbit", "Garmin", "Type III / IV"].map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5 text-[12px] text-white/80 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A7BCF5]" aria-hidden="true" />
                  {d}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHERE IT FITS — three-column clinical pathway framing */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #00122F 0%, #0a1c3e 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14 max-w-[60ch] mx-auto">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Where it fits</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-4 mx-auto max-w-[22ch]">
              A layer around the tests you <em className="text-[#A7BCF5]">already trust.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/70 m-0">
              HANA Sleep doesn't replace the diagnostic standard — it wraps longitudinal assessment around it,
              filling the months a single study leaves dark.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {FITS.map((f, i) => (
              <motion.div
                key={f.k}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7"
              >
                <h3 className="font-serif font-normal text-[20px] md:text-[22px] leading-[1.25] mt-0 mb-3 text-white">{f.k}</h3>
                <p className="text-[14.5px] leading-[1.65] text-white/65 m-0">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY — reuse the home-page defense-in-depth Safety Stack */}
      <SafetyStack />

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
            {A_FAQS.map((f, i) => (
              <AFaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>See the analysis on a real night</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            See what a wearable's night <em>really</em> says.
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["Wearable-agnostic", "Reads Type III / IV", "Complements HST & PSG", "Clinical decision support"].map((t) => (
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
