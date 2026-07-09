import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/Footer";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { SafetyStack } from "../components/ui/safety-stack";
import { NightSky } from "../components/ui/night-sky";
import { Glyph, RI } from "../components/remote/CompassDashboard";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

// Canonical main-site origin. On the standalone sleep.html Vercel project the
// sub-pages (/hana-sleep/analysis, /hana-sleep/cpap) don't exist as routes, so
// the umbrella links out to the main site instead of using an in-app <Link>.
const MAIN_SITE = "https://www.hana.health";

/**
 * HANA Sleep — the suite umbrella ("the overall hat"). HANA Sleep is a suite of
 * solutions for sleep medicine and wellness, not a single product. This page is
 * the umbrella: it introduces the suite and routes to each solution's own page:
 *
 *   • Sleep Analysis (HanaSleepAnalysis.tsx, /hana-sleep/analysis) — the
 *     wearable-agnostic, AI-driven analysis of the hypnogram.
 *   • CPAP Adherence Program (HanaSleepCPAP.tsx, /hana-sleep/cpap) — the
 *     autonomous voice follow-up that keeps patients on therapy.
 *   • Remote Therapeutic Monitoring — on the roadmap.
 *
 * Rendered both at /hana-sleep on the main site (with Navbar) and as the
 * standalone sleep.html Vercel landing page (via sleep-main.tsx, wrapped in a
 * Router so <Link> resolves). Shares the design language of HANA Remote /
 * HANA Contact and reuses the closed-loop diagram.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

// The suite: two solutions live today, RTM on the roadmap. Each live one links
// to its own page.
type Solution = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  icon: string;
  href?: string;
  cta?: string;
  soon?: boolean;
};

const SOLUTIONS: Solution[] = [
  {
    eyebrow: "Analysis",
    title: "Sleep Analysis",
    body: "A novel, AI-driven algorithm that extracts clinically meaningful insight from the hypnogram any wearable — or a Type III/IV home test — already produces. Wearable-agnostic, longitudinal, and built to complement HST and PSG.",
    points: ["Reads any wearable + Type III/IV", "Clinically meaningful insight, not more data", "Complements HST & PSG"],
    icon: RI.activity,
    href: "/hana-sleep/analysis",
    cta: "Explore Sleep Analysis",
  },
  {
    eyebrow: "Adherence",
    title: "CPAP Adherence Program",
    body: "An autonomous follow-up engine for CPAP adherence. HANA calls patients like a human would through the first 90 days, holds them to the plan without judgment, and documents every follow-up to the chart — built for RPM and RTM programs.",
    points: ["Voice follow-up with memory", "Non-adherence ~50% → ~22% in production", "Built for RPM & RTM"],
    icon: RI.phone,
    href: "/hana-sleep/cpap",
    cta: "Explore the CPAP Program",
  },
  {
    eyebrow: "Roadmap",
    title: "Remote Therapeutic Monitoring",
    body: "The same monitoring engine, extending across sleep medicine and wellness — insomnia, chronic-condition coaching, and athletic recovery — as the suite widens.",
    points: ["Insomnia & chronic-condition coaching", "Athletic recovery", "On the roadmap"],
    icon: RI.cycle,
    soon: true,
  },
];

// Sleep-suite configuration for the shared closed-loop diagram: read the night →
// interpret against clinical best practices → call the patient → document to the
// chart. (Same loop the CPAP program runs; shown here as the suite's shape.)
const SLEEP_LOOP_COPY = {
  eyebrow: "How the suite works",
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

// Suite-level proof — the numbers that hold across the family of solutions.
const SUITE_STATS = [
  { v: "96%", l: "of 10,000 patients said yes to an AI check-in — because it doesn't feel like a machine" },
  { v: "~50% → ~22%", l: "CPAP non-adherence, in production, once follow-up actually shows up" },
  { v: "4+", l: "wearables read out of the box — Apple Watch, Oura, Fitbit, Garmin" },
  { v: "2.3×", l: "more patients followed per coordinator, without adding headcount" },
];

// Suite-level FAQ — the questions that apply to HANA Sleep as a whole, before a
// visitor has picked a specific solution.
const SUITE_FAQS = [
  {
    q: "Is HANA Sleep one product or several?",
    a: "It's a suite. HANA Sleep is a family of solutions for sleep medicine and wellness — Sleep Analysis (wearable-agnostic hypnogram interpretation) and the CPAP Adherence Program (autonomous voice follow-up) today, with remote therapeutic monitoring on the roadmap. Each stands on its own; together they cover the night from read to follow-up.",
  },
  {
    q: "Which one should I start with?",
    a: "Start with the pain in front of you. If patients are falling off CPAP, the CPAP Adherence Program is the sharpest wedge. If you want clinically meaningful insight from the wearables patients already own, start with Sleep Analysis. They compose — the analysis can feed the follow-up.",
  },
  {
    q: "Is any of this a medical device?",
    a: "No. Every HANA Sleep solution is clinical decision support, not a medical device. HANA reads, reports, and follows up; the clinician decides. Every interpretation is presented for a clinician to agree with or override.",
  },
  {
    q: "How does it handle patient data and privacy?",
    a: "HANA runs on HIPAA-compliant channels — voice, SMS, fax — with patient consent, and can be sandboxed for closed systems like the VA and military health. Security is defense-in-depth; see the layers below.",
  },
];

function SuiteFaqRow({ q, a, index }: { q: string; a: string; index: number }) {
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
            key={`suitefaq-${index}`}
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

export function HanaSleep({ standalone = false }: { standalone?: boolean } = {}) {
  const reduce = useReducedMotion();
  return (
    <div className="bg-[#00122F] text-white font-sans overflow-x-hidden">
      <SEO
        title="HANA Sleep — A Suite of Solutions for Sleep Medicine & Wellness"
        useExactTitle
        type="product"
        description="HANA Sleep is a suite of solutions for sleep medicine and wellness: wearable-agnostic sleep analysis, the CPAP Adherence Program, and remote therapeutic monitoring. Clinical decision support that reads any wearable and follows up like a human would — HIPAA-aware by design."
        path="/hana-sleep"
        keywords="HANA Sleep, sleep medicine AI, sleep wellness platform, CPAP adherence, wearable sleep analysis, hypnogram interpretation, remote therapeutic monitoring, RTM, sleep clinic AI, sleep telehealth"
        jsonLd={breadcrumbSchema([
          { name: "Home", url: "https://www.hana.health/" },
          { name: "HANA Sleep", url: "https://www.hana.health/hana-sleep" },
        ])}
      />

      {/* HERO — immersive night sky, framing HANA Sleep as the suite */}
      <header className="relative overflow-hidden bg-[#00122F] text-white flex items-center min-h-[86vh] md:min-h-[760px] pt-32 pb-28 md:pt-36 md:pb-40">
        <NightSky />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-16 text-center w-full">
          <motion.p {...fadeUp} className={`${eyebrow} text-[#A7BCF5] m-0`}>
            HANA Sleep · Sleep medicine & wellness
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[80px] leading-[1.02] tracking-[-0.015em] mt-6 mb-0 mx-auto max-w-[16ch]"
          >
            Sleep care that doesn't stop at the <em className="text-[#A7BCF5]">lab.</em>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-[17px] md:text-[19px] leading-[1.6] text-white/75 mt-7 mb-0 mx-auto max-w-[56ch]"
          >
            A suite of solutions for sleep medicine and wellness — wearable-agnostic analysis, autonomous CPAP
            adherence follow-up, and remote monitoring.
            <em className="text-[#A7BCF5] not-italic font-semibold"> One platform, from the night to the chart.</em>
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-9 md:mt-10"
          >
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white text-[#00122F] text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity"
            >
              Book a demo →
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center gap-2.5 border border-white/25 text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:bg-white/10 transition-colors"
            >
              Explore the suite
            </a>
          </motion.div>
        </div>
      </header>

      {/* THE SUITE — the "overall hat": each solution as a card that routes to its
          own page. This is the answer to "how do we show the hat and each one." */}
      <section id="solutions" className="py-20 md:py-24 px-6 md:px-16 text-white" style={{ background: "linear-gradient(180deg, #00122F 0%, #081a38 100%)" }}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16 max-w-[60ch] mx-auto">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The suite</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
              One suite. <em className="text-[#A7BCF5]">Purpose-built solutions.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-white/70 m-0 mt-4">
              HANA Sleep isn't one product — it's a growing family of solutions for sleep medicine and wellness.
              Start with the one that matches the pain in front of you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {SOLUTIONS.map((s, i) => {
              const Card = (
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                  className={`group relative flex flex-col h-full rounded-2xl border p-6 md:p-7 transition-all duration-300 ${
                    s.soon
                      ? "bg-white/[0.02] border-white/[0.08]"
                      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className={`flex items-center justify-center w-12 h-12 rounded-[12px] bg-white/[0.06] border border-white/10 ${s.soon ? "text-white/40" : "text-[#A7BCF5]"}`}>
                      <Glyph d={s.icon} className="w-6 h-6" />
                    </span>
                    <span className={`text-[11px] font-bold tracking-[2px] uppercase ${s.soon ? "text-white/35" : "text-[#A7BCF5]"}`}>{s.eyebrow}</span>
                  </div>
                  <h3 className="font-serif font-normal text-[24px] md:text-[26px] leading-[1.15] mt-0 mb-3 text-white">{s.title}</h3>
                  <p className="text-[14.5px] leading-[1.65] text-white/65 m-0">{s.body}</p>
                  <ul className="list-none p-0 mt-5 mb-6 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-white/75">
                        <span className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${s.soon ? "bg-white/30" : "bg-[#A7BCF5]"}`} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    {s.soon ? (
                      <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/45">Coming soon</span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#A7BCF5] group-hover:gap-3 transition-all">
                        {s.cta} <span aria-hidden="true">→</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              );
              if (!s.href) return <div key={s.title}>{Card}</div>;
              // On the main site, route in-app; on the standalone sleep landing
              // page, link out to the canonical main-site URL.
              return standalone ? (
                <a key={s.title} href={`${MAIN_SITE}${s.href}`} className="no-underline">
                  {Card}
                </a>
              ) : (
                <Link key={s.title} to={s.href} className="no-underline">
                  {Card}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE GAP — the problem the whole suite exists to close (suite-level) */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #081a38 0%, #0c1f40 100%)" }}>
        <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The gap</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-5">
              Diagnosis is solved. <em className="text-[#A7BCF5]">Everything after isn't.</em>
            </h2>
            <p className="text-[16px] leading-[1.7] text-white/70 m-0 max-w-[46ch]">
              Sleep medicine is great at diagnosis and blind to everything after it. The patient goes home,
              and no one is with them for the three to six months that decide whether treatment sticks.
              Devices show usage and airflow — never the <em>why</em>: the mask leaks, it's uncomfortable,
              they quietly unplugged it.
            </p>
            <p className="text-[18px] md:text-[20px] leading-[1.5] font-semibold text-white mt-7 max-w-[30ch]">
              The problem was never the diagnosis. <span className="text-[#A7BCF5]">It's everything after.</span>
            </p>
          </motion.div>
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

      {/* THE COMMON THREAD — one AI-driven engine under every solution */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #0c1f40 0%, #00122F 100%)" }}>
        <div className="relative max-w-[820px] mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>The common thread</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mt-0 mb-5 mx-auto max-w-[24ch]">
              Redefining how sleep is understood — <em className="text-[#A7BCF5]">not by collecting more data.</em>
            </h2>
            <p className="text-[17px] leading-[1.75] text-white/70 m-0 mx-auto max-w-[62ch]">
              Every HANA Sleep solution runs on the same idea: extract clinically meaningful insight from the
              data patients already generate, and act on it like a clinician would. It's clinical decision
              support — HANA reads, reports, and follows up; you decide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE CLOSED LOOP — the shape shared across the suite */}
      <LoopDiagram copy={SLEEP_LOOP_COPY} pulses={1} />

      {/* BY THE NUMBERS — suite-level proof; meets the navy Safety Stack below */}
      <section className="py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #00122F 0%, #0a1c3e 50%, #00122F 100%)" }}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-14 max-w-[52ch] mx-auto">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white mx-auto max-w-[22ch]">
              Follow-up you can <em className="text-[#A7BCF5]">measure.</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {SUITE_STATS.map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.04 + i * 0.08 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 md:p-7"
              >
                <div className="font-serif text-[38px] md:text-[46px] leading-[0.95] text-white">{s.v}</div>
                <div className="text-[13.5px] leading-[1.55] text-white/65 mt-3">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY — reuse the home-page defense-in-depth Safety Stack */}
      <SafetyStack />

      {/* HOW WE START — three-step go-live section, same as the homepage */}
      <InlineImageHeader />

      {/* FAQ — suite-level questions */}
      <section className="py-20 md:py-24 px-6 md:px-16 bg-[#00122F]">
        <div className="max-w-[820px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10 md:mb-12">
            <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-4`}>Questions? Answers.</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-white">
              The things everyone asks.
            </h2>
          </motion.div>
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {SUITE_FAQS.map((f, i) => (
              <SuiteFaqRow key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00122F] text-white py-24 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#A7BCF5]/[0.14] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#A7BCF5] mt-0 mb-6`}>Sleep medicine & wellness, one platform</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[15ch]">
            See HANA read a night. <em>Live.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-[#00122F] rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
