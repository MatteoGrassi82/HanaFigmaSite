import { motion } from "motion/react";
import { Link } from "react-router";
import { SEO, breadcrumbSchema } from "../components/SEO";
// Canonical main-site origin. On the standalone sleep.html Vercel project the
// sub-pages (/hana-sleep/analysis, /hana-sleep/cpap) don't exist as routes, so
// the umbrella links out to the main site instead of using an in-app <Link>.
const MAIN_SITE = "https://www.hana.health";
import { Footer } from "../components/Footer";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { NightSky } from "../components/ui/night-sky";
import { Glyph, RI } from "../components/remote/CompassDashboard";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

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

// ── Page ─────────────────────────────────────────────────────────────────────

export function HanaSleep({ standalone = false }: { standalone?: boolean } = {}) {
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

      {/* THE COMMON THREAD — one AI-driven engine under every solution */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-16" style={{ background: "linear-gradient(180deg, #081a38 0%, #00122F 100%)" }}>
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

      {/* HOW WE START — three-step go-live section, same as the homepage */}
      <InlineImageHeader />

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
