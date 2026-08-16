import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView, useScroll, useTransform } from "motion/react";
import { Check, ChevronDown, Clock, Loader2, MessageSquare, Minus, Phone, Plus } from "lucide-react";
import { SEO } from "../components/SEO";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Footer } from "../components/Footer";
import { HanaBloomOrb } from "../components/ui/hana-bloom-orb";
import { RecipesMarquee } from "../components/RecipesMarquee";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LiveDemoSection } from "../components/LiveDemoSection";
import { SafetyStack } from "../components/ui/safety-stack";
import { CompassDashboard, Glyph, RI } from "../components/remote/CompassDashboard";
import { Player, type PlayerRef } from "@remotion/player";
import { CareJourneyComp, CARE_JOURNEY_DURATION } from "../components/remotion/CareJourneyComp";
import { CompassShowcaseComp, COMPASS_CHAPTER_LEN, COMPASS_DURATION } from "../components/remotion/CompassShowcaseComp";
import { CompanionShowcaseComp, COMPANION_CHAPTER_LEN, COMPANION_DURATION } from "../components/remotion/CompanionShowcaseComp";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { WhyHana } from "../components/WhyHana";
import { ProofBento } from "../components/ui/proof-bento";
import { PatientEngagement } from "../components/PatientEngagement";
import { PhoneCarousel } from "../components/ui/phone-mockups-1-utils/phone-carousel";
import OrbitingCirclesGlobe from "../components/ui/orbiting-circles-02";
import { ShaderBackground } from "../components/ui/waves-shaders-homlu-ui";
import { HANA_PHONE_SCREENS } from "../components/ui/phone-mockups-1";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * /remote-v2 — DRAFT rebuild of the HANA Remote page. NOT linked from any nav,
 * noindex (see NOINDEX_ROUTES in scripts/lib/route-seo.mjs). Working canvas:
 * iterate here, then replace HanaRemote.tsx wholesale when approved, and
 * remove this route.
 *
 * Skeleton v3 (2026-08-12): the care-journey motion graphic graduated from a
 * mid-page section to the HERO (Federato-style split), so the old centered
 * light hero and the standalone §7 section are both gone.
 *   1  Hero: split — claim left, CareJourneyComp on a textured canvas right
 *   2  "What is Hana?" three-way comparison (Matteo's mock 2026-08-12: care
 *      management software / outsourced care management / HANA agentic care
 *      coordination — replaced the WhyHana channel bars)
 *   3  LoopDiagram "Read. Engage. Document. Every call." (from Home)
 *   4  Economics: coordinator math (absorbs the old "cost of doing nothing")
 *   5  Live demo ("take the call", from Home; agent is still the front-desk
 *      scenario — swap in a Remote check-in scenario when one exists)
 *   5b "Built by clinicians" giant inline-image statement (reference screenshot;
 *      scroll-linked convergence; hero stays as-is per Matteo 2026-08-12)
 *   6  ProofBento "Proven by the teams running care at scale" (from Home —
 *      replaces the two-quote testimonial section; both quotes live inside it)
 *   7  (empty — the care journey is now the hero. NOTE: §3 LoopDiagram is now
 *      almost certainly redundant, since the hero tells the how-it-works story)
 *   8  Compass  9  Patient agent  10  Programs marquee
 *   11 PatientEngagement "Every patient conversation, handled" (from Home)
 *   12 Adherence calculator (OPEN: keep here / move to Sleep / rebuild as CCM)
 *   13 Numbers band (85%-vs-apps row removed; §2 owns it now)
 *   14 Audit-ready  15 SafetyStack (from Home — clinical trust after billing trust)
 *   16 Go-live · FAQ (+2 new) · CTA
 * CUT vs live page: "The questions every clinic asks" QBlocks (each block
 * duplicated a surviving section); the standalone testimonials (folded into §6).
 *
 * HERO copy — "Built by clinicians. Supervised by yours." (kept per Matteo).
 * Alternates still on the table:
 *   - "A care coordinator built by clinicians."   (noun flip; prices vs salary)
 *   - "Your patients get a call. Your team gets a worklist."
 *   - "Every patient called. No new hires."
 * Rejected: "Built by clinicians. It makes the calls." (idiom collision:
 * "makes the calls" reads as "makes the decisions").
 *
 * POSITIONING GUARDRAILS (carried over from HanaRemote.tsx + 2026-08-11 session):
 *   - No "device-less RPM" claim. Device-free = CCM/APCM/BHI. RPM = engagement
 *     layer on top of existing devices. HANA never "generates billable minutes";
 *     a named clinician attests.
 *   - Never "software" (or bare "platform") as the noun for HANA. Co-pilots are
 *     priced at $0.99-$8 PPPM by the incumbents' own content; HANA is priced
 *     against the coordinator's salary. Copy carries the verb: HANA does the
 *     phone work.
 *   - Comparison copy stays unnamed ("care management software"). No competitor
 *     names on the page.
 *   - CMS CY2027 rule (RPM/RTM must be furnished by the billing practitioner's
 *     own employed staff) is PROPOSED as of Aug 2026: comments close 2026-09-14,
 *     final expected ~Nov 2026. Every mention says "proposed" until final. It
 *     covers RPM and RTM only, not CCM.
 *   - No HANA pricing on the page until real terms are confirmed.
 *   - No em dashes in new prose (site style rule). Copied legacy strings keep
 *     theirs until the final copy pass.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";
// (readability pass: body copy uses slate-600+, never the lighter grays)

// Scoped title normalization for the sections imported from Home. Their h2s run
// Instrument Serif at font-weight 500 — the family only ships 400, so the
// browser fakes a bold that reads as a different font — plus larger sizes
// (56-60px) and tighter tracking. These wrappers restyle the imported headings
// to this page's title style (serif 400 · 32/40/46px · normal tracking) without
// touching the Home originals.
const homeTitleFix =
  "[&_h2]:font-normal [&_h2]:tracking-normal [&_h2]:leading-[1.1] [&_h2]:text-[32px] sm:[&_h2]:text-[40px] md:[&_h2]:text-[46px]";
const homeTitleFixLight = `${homeTitleFix} [&_h2]:text-[#00122F]`;

// ── Content ──────────────────────────────────────────────────────────────────

// The five-step monitoring flow: enroll → check in → flag → escalate → document.
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
    detail: "The moment the call ends, structured data is written back to your EHR — attributed to the named clinician who owns the patient, ready for their review and attestation across CCM, APCM, BHI and RTM. 150+ integrations.",
    stat: "150+",
    statLabel: "EHR integrations · CCM · APCM · RTM",
    proof: "Direct EHR write-back",
  },
];

// Clinical / monitoring-program workflow tags for the marquee (incl. Italian twins).
const PROGRAM_WORKFLOW_TAGS = [
  "Outreach", "Behavioral Health", "Surgery", "Testing", "ADHD",
  "Cronicità", "Salute Mentale", "Chirurgia", "Esami", "Aderenza", "Prevenzione",
];

const R_FAQS = [
  {
    q: "Do my patients need a device or an app?",
    a: "Not for the programs HANA Remote runs device-free: CCM, APCM and behavioral health integration, where the covered activity is the care-management contact itself. Nothing is shipped, downloaded, or charged to the patient. If your patients already use wearables or connected devices, that device data flows in via API alongside the conversation.",
  },
  {
    q: "Is this device-less RPM?",
    a: "No, and we're deliberate about that. RPM codes (99453/99454/99457) require an FDA-defined medical device that transmits readings automatically. A patient reading a number to us over the phone does not satisfy them, and billing RPM that way is what the DOJ's first RPM False Claims settlement was about. On RPM, HANA Remote is the engagement layer on top of the devices you already use: the device transmits, HANA keeps the patient engaged and transmitting. The device-free programs are CCM, APCM and BHI.",
  },
  {
    q: "Does this replace my clinicians' billable time?",
    a: "No. The opposite. We don't replace the clinician's billable interaction, and HANA's call time is not billed as clinical time. HANA captures the data, drives the adherence, and prepares the documentation so your clinician reviews a flagged worklist and attests, instead of chasing patients.",
  },
  {
    q: "How does the billing actually work?",
    a: "HANA Remote produces the documentation the codes require; your qualified staff supply and attest to the time. Every interaction is written back as a structured note attributed to a named clinician, across CCM, APCM, BHI and RTM (98975–98981), so the person who bills is the person who did the clinical work, with the record to show it.",
  },
  {
    q: "How is this different from care management software?",
    a: "Care management software is a co-pilot for your care manager: conversation guides, call summaries, auto-populated care plans, a dialer. Every feature makes a human's call better, and none of them makes the call. HANA does the call itself, then writes the note, so your care manager supervises a panel instead of phoning through a list. A co-pilot makes one nurse somewhat faster. Removing the dialing is what changes how many patients one nurse can hold.",
  },
  {
    q: "We already run RPM with devices. Why would we add this?",
    a: "Because the devices aren't the problem. Engagement is. HANA Remote is the engagement layer that keeps your existing RPM program transmitting: it handles the between-visit contact, chases the days where the device went quiet, and recovers the patients who've drifted. The readings still come from the device, exactly as the codes require.",
  },
  {
    q: "What happens if we get audited?",
    a: "You export the month and hand it over. Every check-in stores its transcript and structured note, every care-management minute is attributed to the named clinician who supplied it, every escalation records who received it and what they did, and program consent is captured in the patient's own words on the enrollment call. That's the packet an auditor asks for, assembled as the program runs rather than reconstructed afterwards.",
  },
  {
    q: "What does the proposed 2027 CMS rule mean for our program?",
    a: "CMS's CY2027 Physician Fee Schedule proposal would pay for RPM and RTM only when the clinical staff furnishing them are direct employees of the billing practitioner or their practice. If it is finalized as written, contracting the calling out to a third-party staffing company stops being billable for those codes from January 1, 2027. HANA fits the model that remains: it is not contracted clinical staff, and its call time is never billed as clinical time. Your own employed clinicians supervise the program, review every flag, and attest the work.",
  },
  {
    q: "What languages do you support?",
    a: "HANA calls patients in 30+ languages, switching automatically per patient. No separate configuration or phone lines required.",
  },
];

// ── Five-step flow (unchanged from live page) ────────────────────────────────

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

// Replaced in the page by CareJourneyPipeline (Federato-style); kept for easy revert.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_150px] gap-6 lg:gap-5 items-stretch">
        <div className="hidden lg:flex flex-col justify-center gap-3 text-right">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Sources</p>
          {HOW_SOURCES.map((s) => (
            <p key={s} className="text-[13.5px] text-white/70 leading-snug">{s}</p>
          ))}
        </div>

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

        <div className="hidden lg:flex flex-col justify-center gap-3">
          <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#A7BCF5] mb-1">Outcomes</p>
          {HOW_OUTCOMES.map((o) => (
            <p key={o} className="text-[13.5px] text-white/70 leading-snug">{o}</p>
          ))}
        </div>
      </div>

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

// ── §3 Economics — the coordinator math ──────────────────────────────────────
// Replaces the old "cost of doing nothing" band. One money argument, CCM-first:
// the codes pay; the labor line breaks; that's why programs stall around 95
// patients. Numbers sourced from the 2026-08-11 research session (fully loaded
// coordinator ~$65K; industry planning ratio 250; CCM ~$66 PPPM; break-even 131
// at 12 billable months vs 3-5 observed → ~390 real; 96.6% of eligible Medicare
// patients never receive CCM). Flag before final ship: confirm the $66 figure
// for the current fee schedule year and decide whether stats carry a source line.

/* Two comparisons rather than four flat stats: $57-vs-$22 and 131-vs-390 are
   each a RELATIONSHIP, and a bar shows it faster than prose. The three-sentence
   preamble and the 96.6%-never-receive-CCM stat were cut (Matteo 2026-08-13:
   physicians receiving this page already know the setup; the market-education
   stat was the most condescending line on it). What stays is the arithmetic a
   doctor hasn't done: real break-even once patients bill 3-5 months, and the
   per-patient cost of coordinator time that anchors HANA against a salary. */
type EconRow = { label: string; note: string; value: string; pct: number; hi?: boolean };

const ECON_CARDS: {
  title: string;
  rows: EconRow[];
  foot: string;
  tint: string;
  bar: string;
  barHi: string;
}[] = [
  {
    title: "What coordinator time costs, per patient per month",
    rows: [
      { label: "95 patients", note: "a typical panel", value: "$57", pct: 100, hi: true },
      { label: "250 patients", note: "the planning ratio", value: "$22", pct: 38 },
    ],
    foot: "A $65K salary, fully loaded. Very few programs reach 250 by phone.",
    tint: "linear-gradient(150deg, #FAFBFF 0%, #EEF2FC 100%)",
    bar: "#93B4F5",
    barHi: "#2563EB",
  },
  {
    title: "Where break-even actually lands",
    rows: [
      { label: "131 patients", note: "at the 12 billable months the models assume", value: "131", pct: 34 },
      { label: "~390 patients", note: "at the 3 to 5 months claims data shows", value: "~390", pct: 100, hi: true },
    ],
    foot: "The average practice enrolls about 95.",
    tint: "linear-gradient(150deg, #FFFCF9 0%, #FBF2E9 100%)",
    bar: "#F3C89A",
    barHi: "#E2703A",
  },
];

function EconomicsSection() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="max-w-[52ch]">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>The coordinator math</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mt-0 mb-4">
            The codes pay. <em className="text-[#2563EB]">The dialing doesn't scale.</em>
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-slate-600 m-0">
            CCM pays about $66 per patient per month. The cost is a salary, divided by however many
            patients one person can actually reach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-12 md:mt-14">
          {ECON_CARDS.map((card, ci) => (
            <motion.div
              key={card.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + ci * 0.08 }}
              className="rounded-[22px] border border-slate-200/80 p-7 md:p-9"
              style={{ background: card.tint }}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[1.2px] text-slate-500 m-0 mb-7">
                {card.title}
              </p>
              <div className="space-y-6">
                {card.rows.map((r, i) => (
                  <div key={r.label}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className={`text-[14px] ${r.hi ? "font-semibold text-[#0A1633]" : "text-slate-600"}`}>
                        {r.label}
                      </span>
                      <span
                        className="font-serif leading-none"
                        style={{
                          fontSize: r.hi ? 46 : 34,
                          color: r.hi ? card.barHi : "#64748B",
                        }}
                      >
                        {r.value}
                      </span>
                    </div>
                    <div className="mt-2.5 h-2.5 rounded-full bg-white/80 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: r.hi ? card.barHi : card.bar }}
                        initial={{ width: reduce ? `${r.pct}%` : 0 }}
                        whileInView={{ width: `${r.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
                      />
                    </div>
                    <p className="text-[12.5px] text-slate-500 mt-2 mb-0">{r.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12.5px] leading-[1.55] text-slate-500 mt-7 mb-0 pt-5 border-t border-slate-200/70">
                {card.foot}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-[18px] md:text-[21px] leading-[1.55] font-semibold text-[#0A1633] mt-12 md:mt-14 mb-0 max-w-[62ch]"
        >
          Most in-house programs lose money before they scale. Not because the codes don't pay,
          because a human can only dial so many patients.{" "}
          <span className="text-[#2563EB]">
            HANA changes the denominator: your clinician supervises the panel instead of phoning it.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

// ── §7 Care journey pipeline (Federato-style) ────────────────────────────────
// Recreation of the Federato hero animation for HANA (analyzed from Matteo's
// screencast 2026-08-12): a stepper rail of stages, a canvas where per-stage UI
// vignettes swap, and persistent data chips that travel through every stage so
// one patient's facts are the protagonist. Ends on a compressed outcome coda
// (new enrollment → phone → note in your EHR), then loops. Auto-advances,
// pauses on hover, runs only in view; reduced motion pins the Document stage.

const PIPE_STAGES = [
  { key: "Enroll", color: "#5b76d9" },
  { key: "Check in", color: "#10b981" },
  { key: "Flag", color: "#f59e0b" },
  { key: "Escalate", color: "#f43f5e" },
  { key: "Document", color: "#2dd4bf" },
];

// Per-stage chip positions in % of the canvas; null = hidden that stage.
type ChipPos = { x: number; y: number } | null;
const JOURNEY_CHIPS: { id: string; text: string; amber?: boolean; pos: ChipPos[] }[] = [
  {
    id: "name",
    text: "Maria R.",
    pos: [{ x: 12.5, y: 30.5 }, { x: 51, y: 27.5 }, { x: 28, y: 56 }, { x: 21, y: 36.5 }, { x: 34, y: 27 }, null],
  },
  {
    id: "usage",
    text: "CPAP · 2 hrs last night",
    pos: [null, { x: 52, y: 56 }, { x: 29.5, y: 31 }, { x: 28.5, y: 36.5 }, { x: 34.5, y: 33 }, null],
  },
  {
    id: "flag",
    text: "Below 4-hr threshold",
    amber: true,
    pos: [null, null, { x: 55, y: 66 }, { x: 40, y: 49 }, { x: 33.5, y: 39 }, null],
  },
];

// Small building blocks for the vignettes.
function VCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute rounded-2xl bg-[#f8f9fc] shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-5 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function VHeader({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-200">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eef1fb] text-[#5b76d9] shrink-0">
        <Glyph d={icon} className="w-3.5 h-3.5" />
      </span>
      <div>
        <div className="text-[13px] font-semibold text-[#00122F] leading-tight">{title}</div>
        {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
      </div>
    </div>
  );
}

// A placeholder slot bar a chip visually docks over.
function VSlot({ w }: { w: string }) {
  return <span className={`inline-block h-6 ${w} rounded-md bg-slate-200/70 align-middle`} />;
}

// Superseded in the page by CareJourneySplit (Federato-identical); kept for revert.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CareJourneyPipeline() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const N = 6; // 5 stages + outcome coda

  useEffect(() => {
    if (reduce) {
      setStage(4);
      return;
    }
    if (paused || !inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % N), 4200);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const activeIdx = Math.min(stage, 4);
  const coda = stage === 5;

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Stepper rail */}
      <div className={`relative transition-opacity duration-500 ${coda ? "opacity-40" : "opacity-100"}`}>
        <div aria-hidden className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/25" />
        <div className="relative flex justify-between items-center gap-2">
          {PIPE_STAGES.map((s, i) => {
            const is = i === activeIdx && !coda;
            return (
              <button
                key={s.key}
                onClick={() => setStage(i)}
                aria-pressed={is}
                className="relative focus:outline-none"
              >
                <motion.div
                  animate={{ scale: is ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 md:px-4 md:py-2.5 ${
                    is ? "bg-white shadow-[0_14px_36px_rgba(0,0,0,0.4)]" : "bg-white/85"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: s.color, boxShadow: is ? `0 0 0 4px ${s.color}33` : "none" }}
                  />
                  <span className={`uppercase tracking-[1px] font-bold text-[#00122F] whitespace-nowrap ${is ? "text-[12px] md:text-[13px]" : "text-[10px] md:text-[11px]"}`}>
                    {s.key}
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative mt-8 h-[460px] md:h-[520px] rounded-2xl overflow-hidden bg-[#0b1b34]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(80% 90% at 70% 20%, rgba(91,118,217,0.28) 0%, rgba(11,27,52,0) 60%), radial-gradient(70% 80% at 15% 85%, rgba(167,188,245,0.14) 0%, rgba(11,27,52,0) 55%)" }}
        />

        <AnimatePresence mode="wait">
          {stage === 0 && (
            <VCard key="v0" className="left-[6%] top-[16%] w-[88%] md:left-[10%] md:w-[42%]">
              <VHeader icon={RI.phone} title="HANA · enrollment call" sub="CPAP program · Dr. Reyes' office" />
              <div className="mb-2"><VSlot w="w-24" /></div>
              <div className="rounded-2xl rounded-bl-md bg-[#1e2a3a] text-white px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[92%]">
                Hi Maria, it's HANA calling from Dr. Reyes' office to set up your CPAP check-ins. Is now a good time?
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11.5px] text-slate-500">
                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                Consent captured on the call
              </div>
            </VCard>
          )}

          {stage === 1 && (
            <VCard key="v1" className="left-[6%] top-[12%] w-[88%] md:left-[48%] md:w-[42%]">
              <VHeader icon={RI.phone} title="Evening check-in" sub="Day 6 on program" />
              <div className="mb-2"><VSlot w="w-24" /></div>
              <div className="rounded-2xl rounded-bl-md bg-[#1e2a3a] text-white px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[92%]">
                How many hours did you wear the CPAP last night?
              </div>
              <div className="flex justify-end mt-2">
                <div className="rounded-2xl rounded-br-md bg-white border border-slate-200 text-[#00122F] px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[85%]">
                  Only about two. I took it off, it felt too tight.
                </div>
              </div>
              <div className="mt-3"><VSlot w="w-40" /></div>
            </VCard>
          )}

          {stage === 2 && (
            <VCard key="v2" className="left-[6%] top-[12%] w-[88%] md:left-[26%] md:w-[48%]">
              <VHeader icon={RI.clipboard} title="HANA Sleep protocol" sub="Every answer scored in real time" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                  <VSlot w="w-36" />
                  <span className="ml-auto text-[11px] font-bold uppercase tracking-[1px] text-amber-600">Scored</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[13px] text-slate-700">
                  Mask discomfort · coaching delivered
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[13px] text-slate-400">
                  Mood check · no concern
                </div>
              </div>
              <div className="mt-3"><VSlot w="w-44" /></div>
            </VCard>
          )}

          {stage === 3 && (
            <VCard key="v3" className="left-[6%] top-[16%] w-[88%] md:left-[18%] md:w-[52%]">
              <VHeader icon={RI.alert} title="Compass · flagged worklist" sub="What your team actually reviews" />
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-3">
                <div className="flex items-center gap-2">
                  <VSlot w="w-20" />
                  <VSlot w="w-32" />
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Escalated → Dr. Reyes
                  </span>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-3 mb-0">12 check-ins completed today · 1 needs review</p>
            </VCard>
          )}

          {stage === 4 && (
            <VCard key="v4" className="left-[6%] top-[10%] w-[88%] md:left-[28%] md:w-[44%]">
              <VHeader icon={RI.database} title="Structured note" sub="Written to your EHR the moment the call ends" />
              <div className="space-y-2 text-[12.5px] text-slate-600">
                <div className="flex items-center gap-2">Patient <VSlot w="w-20" /></div>
                <div className="flex items-center gap-2">Finding <VSlot w="w-36" /></div>
                <div className="flex items-center gap-2">Risk <VSlot w="w-32" /></div>
                <div>Plan · strap adjustment, follow-up call tomorrow</div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 text-[12px] font-semibold text-emerald-600">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Ready for Dr. Reyes to attest
              </div>
            </VCard>
          )}

          {coda && (
            <motion.div
              key="coda"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <span className="rounded-lg bg-[#A7BCF5] text-[#00122F] text-[13px] font-bold uppercase tracking-[1.5px] px-4 py-2">
                New enrollment
              </span>
              <div className="h-16 border-l border-dashed border-white/40" aria-hidden />
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2347e6]/30 text-[#A7BCF5]">
                <Glyph d={RI.phone} className="w-6 h-6" />
              </span>
              <div className="h-16 border-l border-dashed border-white/40" aria-hidden />
              <span className="rounded-lg bg-white text-[#00122F] text-[13px] font-bold uppercase tracking-[1.5px] px-4 py-2">
                Note in your EHR
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent data chips — the protagonist */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {JOURNEY_CHIPS.map((ch) => {
            const p = ch.pos[stage];
            return (
              <motion.span
                key={ch.id}
                initial={false}
                animate={
                  p
                    ? { left: `${p.x}%`, top: `${p.y}%`, opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ type: "spring", stiffness: 120, damping: 19, mass: 0.9 }}
                className={`absolute inline-block rounded-md px-2.5 py-1 text-[12px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.35)] whitespace-nowrap ${
                  ch.amber ? "bg-amber-300 text-[#3d2e00]" : "bg-[#A7BCF5] text-[#00122F]"
                }`}
              >
                {ch.text}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Stage dots */}
      <div className="flex justify-center gap-2.5 mt-6">
        {Array.from({ length: N }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStage(i)}
            aria-label={i === 5 ? "Show outcome" : `Show ${PIPE_STAGES[i].key}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === stage ? "w-8 bg-[#A7BCF5]" : "w-2 bg-white/25 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── §7b Federato-identical split version ─────────────────────────────────────
// Faithful recreation of the Federato hero layout: static headline block on the
// left; full-bleed textured canvas on the right carrying the stepper rail
// (white cards with colored star badges on their top edge), the swapping
// vignettes, butter-yellow data chips, and the outcome coda with the dashed
// arrow. Texture = SVG fractal turbulence mapped to a navy→periwinkle duotone
// (their sand dunes, our palette).

function StarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 0 C13.2 6.8 17.2 10.8 24 12 C17.2 13.2 13.2 17.2 12 24 C10.8 17.2 6.8 13.2 0 12 C6.8 10.8 10.8 6.8 12 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

// The hero canvas ground. Was a noise-based "dune" texture copied from the
// Federato reference; replaced 2026-08-12 with Retell's treatment — smooth
// luminous blooms (blue · indigo · magenta) over near-black navy, no grain.
// Deep enough that the white cards and blue chips read cleanly on top.
// The hero canvas ground: the "Waves" WebGL shader (components/ui/waves-shaders-
// homlu-ui.tsx), replacing the ocean clip. No asset download, resolution-
// independent, and it never loops visibly. Shown ungraded, as with the video.
//
// The shader component animates unconditionally, so reduced-motion users get a
// still gradient approximating it rather than a paused canvas. It also pauses
// itself off-screen and on tab blur, and caps DPR and total pixels internally.
const SHADER_STILL =
  "linear-gradient(180deg, #C6D4EC 0%, #7FA0D4 42%, #2A4A86 74%, #0E1E3C 100%)";

function DuneTexture() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#1B2A4A]">
      {reduce ? (
        <div className="absolute inset-0" style={{ background: SHADER_STILL }} />
      ) : (
        <ShaderBackground className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}

// Chip positions for the split canvas (percent of the right-half stage zone).
const JOURNEY_CHIPS_SPLIT: { id: string; text: string; pos: ChipPos[] }[] = [
  {
    id: "name",
    text: "Maria R.",
    pos: [{ x: 9, y: 25 }, { x: 37, y: 23 }, { x: 21, y: 46 }, { x: 12.5, y: 28.5 }, { x: 25.5, y: 21 }, null],
  },
  {
    id: "usage",
    text: "CPAP · 2 hrs last night",
    pos: [null, { x: 38, y: 47 }, { x: 21, y: 24.5 }, { x: 24.5, y: 28.5 }, { x: 26, y: 26.5 }, null],
  },
  {
    id: "flag",
    text: "Below 4-hr threshold",
    pos: [null, null, { x: 50, y: 62 }, { x: 40, y: 42 }, { x: 25.8, y: 32 }, null],
  },
];

// Superseded in the page by CareJourneyVideo (Remotion comp); kept for revert.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CareJourneySplit() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const N = 6;

  useEffect(() => {
    if (reduce) {
      setStage(4);
      return;
    }
    if (paused || !inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % N), 4200);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  const activeIdx = Math.min(stage, 4);
  const coda = stage === 5;

  return (
    <section ref={ref} className="bg-[#00122F] text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[44%_56%]">
        {/* LEFT — static claim (Federato: headline never moves) */}
        <div className="px-6 md:px-16 py-16 md:py-24 lg:py-28 flex flex-col justify-center">
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[62px] leading-[1.06] tracking-[-0.015em] m-0 max-w-[14ch]">
            From first call to documented — <em className="text-[#A7BCF5]">in five steps.</em>
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.65] text-white/75 mt-7 mb-0 max-w-[42ch]">
            HANA enrolls the patient, checks in on cadence, flags what matters, escalates to your
            team, and writes the note to your EHR. Watch one patient go start to finish.
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 self-start bg-white text-[#00122F] text-[15px] font-semibold px-7 py-[13px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-9"
          >
            Book a demo →
          </a>
        </div>

        {/* RIGHT — full-bleed textured canvas */}
        <div
          className="relative h-[640px] lg:h-auto lg:min-h-[720px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <DuneTexture />

          {/* Stepper rail */}
          <div className={`absolute left-[5%] right-[5%] top-9 transition-opacity duration-500 ${coda ? "opacity-45" : "opacity-100"}`}>
            <div aria-hidden className="absolute left-0 right-0 top-[60%] border-t border-dashed border-white/40" />
            <div className="relative flex justify-between items-end">
              {PIPE_STAGES.map((s, i) => {
                const is = i === activeIdx && !coda;
                return (
                  <button key={s.key} onClick={() => setStage(i)} aria-pressed={is} className="relative focus:outline-none pt-4">
                    <motion.div
                      animate={{ scale: is ? 1.3 : 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                      style={{ transformOrigin: "center bottom" }}
                      className={`relative rounded-lg bg-[#fdfdfa] px-3 py-2.5 md:px-4 md:py-3 ${is ? "shadow-[0_18px_44px_rgba(0,0,0,0.5)]" : "shadow-[0_8px_20px_rgba(0,0,0,0.3)]"}`}
                    >
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full"
                        style={{ background: s.color }}
                      >
                        <StarGlyph className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#00122F]" />
                      </span>
                      <span className="block text-center uppercase font-bold text-[#101820] text-[9px] md:text-[10px] leading-[1.2] tracking-[0.6px] max-w-[86px] pt-1">
                        {s.key}
                      </span>
                    </motion.div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage zone: vignettes + chips + coda */}
          <div className="absolute left-[5%] right-[5%] top-[130px] bottom-[5%]">
            <AnimatePresence mode="wait">
              {stage === 0 && (
                <VCard key="v0" className="left-[4%] top-[10%] w-[92%] md:left-[6%] md:w-[60%]">
                  <VHeader icon={RI.phone} title="HANA · enrollment call" sub="CPAP program · Dr. Reyes' office" />
                  <div className="mb-2"><VSlot w="w-24" /></div>
                  <div className="rounded-2xl rounded-bl-md bg-[#1e2a3a] text-white px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[92%]">
                    Hi Maria, it's HANA calling from Dr. Reyes' office to set up your CPAP check-ins. Is now a good time?
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-[11.5px] text-slate-500">
                    <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                    Consent captured on the call
                  </div>
                </VCard>
              )}

              {stage === 1 && (
                <VCard key="v1" className="left-[4%] top-[8%] w-[92%] md:left-[34%] md:w-[60%]">
                  <VHeader icon={RI.phone} title="Evening check-in" sub="Day 6 on program" />
                  <div className="mb-2"><VSlot w="w-24" /></div>
                  <div className="rounded-2xl rounded-bl-md bg-[#1e2a3a] text-white px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[92%]">
                    How many hours did you wear the CPAP last night?
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="rounded-2xl rounded-br-md bg-white border border-slate-200 text-[#00122F] px-3.5 py-2.5 text-[13px] leading-[1.5] max-w-[85%]">
                      Only about two. I took it off, it felt too tight.
                    </div>
                  </div>
                  <div className="mt-3"><VSlot w="w-40" /></div>
                </VCard>
              )}

              {stage === 2 && (
                <VCard key="v2" className="left-[4%] top-[8%] w-[92%] md:left-[16%] md:w-[64%]">
                  <VHeader icon={RI.clipboard} title="HANA Sleep protocol" sub="Every answer scored in real time" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                      <VSlot w="w-36" />
                      <span className="ml-auto text-[11px] font-bold uppercase tracking-[1px] text-amber-600">Scored</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[13px] text-slate-700">
                      Mask discomfort · coaching delivered
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[13px] text-slate-400">
                      Mood check · no concern
                    </div>
                  </div>
                  <div className="mt-3"><VSlot w="w-44" /></div>
                </VCard>
              )}

              {stage === 3 && (
                <VCard key="v3" className="left-[4%] top-[12%] w-[92%] md:left-[8%] md:w-[70%]">
                  <VHeader icon={RI.alert} title="Compass · flagged worklist" sub="What your team actually reviews" />
                  <div className="rounded-lg bg-white border border-slate-200 px-3 py-3">
                    <div className="flex items-center gap-2">
                      <VSlot w="w-20" />
                      <VSlot w="w-32" />
                      <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Escalated → Dr. Reyes
                      </span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-3 mb-0">12 check-ins completed today · 1 needs review</p>
                </VCard>
              )}

              {stage === 4 && (
                <VCard key="v4" className="left-[4%] top-[6%] w-[92%] md:left-[16%] md:w-[62%]">
                  <VHeader icon={RI.database} title="Structured note" sub="Written to your EHR the moment the call ends" />
                  <div className="space-y-2 text-[12.5px] text-slate-600">
                    <div className="flex items-center gap-2">Patient <VSlot w="w-20" /></div>
                    <div className="flex items-center gap-2">Finding <VSlot w="w-36" /></div>
                    <div className="flex items-center gap-2">Risk <VSlot w="w-32" /></div>
                    <div>Plan · strap adjustment, follow-up call tomorrow</div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 text-[12px] font-semibold text-emerald-600">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    Ready for Dr. Reyes to attest
                  </div>
                </VCard>
              )}

              {coda && (
                <motion.div
                  key="coda"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span className="rounded-md bg-[#F2E88D] text-[#26210a] text-[13px] font-bold uppercase tracking-[1.5px] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    New enrollment
                  </span>
                  <div className="h-14 border-l-2 border-dashed border-white/50 my-3" aria-hidden />
                  <span className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#0a1830] border border-white/10 text-[#F2E88D] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                    <Glyph d={RI.phone} className="w-6 h-6" />
                  </span>
                  <div className="h-14 border-l-2 border-dashed border-white/50 mt-3" aria-hidden />
                  <span aria-hidden className="text-white/70 text-[10px] leading-none mb-2">▼</span>
                  <span className="rounded-md bg-[#F2E88D] text-[#26210a] text-[13px] font-bold uppercase tracking-[1.5px] px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    Note in your EHR
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Persistent chips — butter yellow, like the reference */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              {JOURNEY_CHIPS_SPLIT.map((ch) => {
                const p = ch.pos[stage];
                return (
                  <motion.span
                    key={ch.id}
                    initial={false}
                    animate={p ? { left: `${p.x}%`, top: `${p.y}%`, opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 120, damping: 19, mass: 0.9 }}
                    className="absolute inline-block rounded-[6px] bg-[#F2E88D] text-[#26210a] px-2.5 py-1 text-[12px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.4)] whitespace-nowrap"
                  >
                    {ch.text}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── §1 HERO — Federato-style split hero ──────────────────────────────────────
// The care-journey motion graphic IS the hero (per Matteo 2026-08-12, matching
// federato.ai): static claim on the left half, full-bleed textured canvas on the
// right carrying the Remotion composition. The headline is the positioning
// claim, never a description of the animation — the rail labels tell the
// five-step story on their own, exactly as the reference does it.
// Navbar is `sticky` (80px, in flow), so the hero fills the rest of the viewport.
function HeroCareJourney() {
  const reduce = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const ref = useRef<HTMLElement>(null);
  // Only run once most of the hero is on screen, so it never plays while half of
  // it is scrolled under the navbar (Matteo: "it should only start when you are
  // all in"). 0.55 rather than "all" because the hero is taller than a phone
  // viewport and would otherwise never start there.
  const inView = useInView(ref, { once: false, amount: 0.55 });

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reduce) {
      // Reduced motion: hold the Document beat as a still.
      p.pause();
      p.seekTo(760);
      return;
    }
    if (inView) {
      p.play();
      // Remotion's play() can no-op before full mount — retry once.
      const t = setTimeout(() => playerRef.current?.play(), 350);
      return () => clearTimeout(t);
    }
    p.pause();
  }, [inView, reduce]);

  return (
    // -mt-20 pulls the hero up under the sticky 80px navbar so the textured
    // canvas runs edge to edge like the reference (the navbar is 90% opaque with
    // a backdrop blur, so it reads as a frosted strip over the texture). The
    // animation itself is kept clear of it by pt-20 on both columns' content.
    // No negative top margin: with a white hero, pulling it under the light
    // navbar made the bar vanish into the page (Matteo: "the nav bar is hiding").
    // The hero now starts below the navbar, whose bottom hairline separates them.
    <header ref={ref} className="bg-white text-[#0A1633] overflow-hidden border-b border-slate-200/80">
      {/* 50/50 split, like the reference — 46/54 let the video panel dominate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-80px)]">
        {/* LEFT — the claim, static */}
        <div className="px-6 md:px-16 py-20 md:py-24 lg:py-28 flex flex-col justify-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-6`}>
            HANA Remote · The engagement layer for remote care
          </p>
          <h1 className="font-serif font-normal text-[40px] sm:text-[50px] md:text-[56px] lg:text-[60px] leading-[1.05] tracking-[-0.015em] m-0">
            Built by clinicians.
            <br />
            <em className="text-[#2563EB]">Supervised by yours.</em>
          </h1>
          <p className="text-[16px] md:text-[17.5px] leading-[1.65] text-slate-600 mt-7 mb-0 max-w-[46ch]">
            HANA does the phone work behind CCM, APCM, BHI &amp; RTM: enrollment, check-ins,
            escalation, documentation. Your team reviews a flagged worklist and attests the work.
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 self-start bg-[#0A1633] text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-10"
          >
            Book a demo →
          </a>
        </div>

        {/* RIGHT — textured canvas with the motion graphic. Texture fills the
            whole panel (including behind the navbar); the Player is inset by
            pt-20 so no part of the animation sits under the bar. */}
        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-0">
          <DuneTexture />
          {/* Both dimensions set → the Player CONTAIN-fits inside the panel and
              can never overflow it. This is the real fix for the rail badges
              being clipped at the top: width-only sizing let the comp grow
              taller than the panel on shorter viewports. */}
          <div className="absolute inset-0 flex items-center justify-center px-3 md:px-6 py-8">
            <Player
              ref={playerRef}
              component={CareJourneyComp}
              durationInFrames={CARE_JOURNEY_DURATION}
              compositionWidth={800}
              compositionHeight={820}
              fps={30}
              loop
              autoPlay
              initiallyMuted
              controls={false}
              clickToPlay={false}
              doubleClickToFullscreen={false}
              spaceKeyToPlayOrPause={false}
              style={{ width: "100%", height: "100%", maxWidth: 900 }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Integrations ─────────────────────────────────────────────────────────────
// Explains integration from both ends: the patient's side (nothing to install,
// their own phone, your clinic on the caller ID) via the phone carousel, and the
// practice's side (the note lands in the chart you already use) via the EHR
// logos. Claims kept to what the page already asserts: 150+ integrations, 30+
// languages, a named clinician attests.
const EHR_LOGOS = [
  { src: "/logos/epic.png", name: "Epic" },
  { src: "/logos/athenahealth.png", name: "athenahealth" },
  { src: "/logos/eclinicalworks.png", name: "eClinicalWorks" },
  { src: "/logos/drchrono.png", name: "DrChrono" },
  { src: "/logos/elation.png", name: "Elation Health" },
  { src: "/logos/charm.png", name: "CharmHealth" },
];

const PATIENT_SIDE = [
  "Nothing to download, nothing to ship, nothing to charge them for",
  "Your clinic's name on the caller ID, so they pick up",
  "30+ languages, switching automatically per patient",
];

const PRACTICE_SIDE = [
  "The structured note is written the moment the call ends",
  "Attributed to the named clinician who owns the patient, ready to attest",
  "Escalations land in one flagged worklist, not another inbox",
];

// Not mounted on the page since 2026-08-12; kept for easy re-add.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function IntegrationsSection() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="md:flex md:items-start md:justify-between md:gap-12 mb-14 md:mb-20">
          <h2 className="font-serif font-normal text-[36px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.015em] text-[#0A1633] m-0">
            The phone they have. <em className="text-[#2563EB]">The chart you use.</em>
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.55] text-slate-600 md:max-w-[400px] mt-5 md:mt-2 mb-0">
            Integration is the whole job. Nothing new for the patient to learn, and nothing new for
            your team to open. HANA calls the phone in their pocket and writes into the chart you
            already work in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-14 lg:gap-16 items-center">
          {/* Patient side — the phone carousel */}
          <motion.div {...fadeUp}>
            <PhoneCarousel images={HANA_PHONE_SCREENS} />
          </motion.div>

          {/* Practice side */}
          <div className="space-y-10">
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }}>
              <p className={`${eyebrow} text-[#2563EB] mt-0 mb-3`}>Their side</p>
              <h3 className="font-serif font-normal text-[24px] md:text-[27px] leading-[1.2] text-[#0A1633] mt-0 mb-4">
                No app. No device. No new habit.
              </h3>
              <ul className="list-none p-0 m-0 space-y-3">
                {PATIENT_SIDE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-[1.55] text-slate-700">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#EFF3FF] text-[#2563EB] grid place-items-center">
                      <Check className="w-3 h-3" strokeWidth={3.2} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.16 }}>
              <p className={`${eyebrow} text-[#2563EB] mt-0 mb-3`}>Your side</p>
              <h3 className="font-serif font-normal text-[24px] md:text-[27px] leading-[1.2] text-[#0A1633] mt-0 mb-4">
                Straight into the chart, 150+ integrations.
              </h3>
              <ul className="list-none p-0 m-0 space-y-3 mb-7">
                {PRACTICE_SIDE.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-[1.55] text-slate-700">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#EFF3FF] text-[#2563EB] grid place-items-center">
                      <Check className="w-3 h-3" strokeWidth={3.2} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-3">
                {EHR_LOGOS.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-[#f6f7fb] px-3 py-4"
                  >
                    <img
                      src={l.src}
                      alt={l.name}
                      loading="lazy"
                      className="max-h-6 w-auto max-w-full object-contain opacity-70 grayscale"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-slate-500 mt-4 mb-0">
                Plus an API and SDK where you'd rather build the connection yourself.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── §8 Compass showcase (Retell accordion pattern + Remotion) ────────────────
// Retell's "Consistently High Quality" section shape: heading + accordion on
// the left, product visual in a soft gradient tile on the right. Upgrade over
// their static screenshots: the right panel is a Remotion motion graphic with
// three chapters (worklist → billing readiness → audit trail), and the
// accordion is synced BOTH ways — clicking an item seeks the video to that
// chapter; playback moves the open item as chapters change.
const COMPASS_ITEMS = [
  {
    title: "One flagged worklist, not a phone queue",
    body: "Every check-in HANA completes is scored against the protocol. Your team sees only the flags, each with the full context of the call and a named owner.",
  },
  {
    title: "Billing documentation, ready to attest",
    body: "Structured notes are written the moment calls end, and minutes are attributed to the named clinician who did the work. Compass shows what's ready for attestation across CCM, APCM, BHI and RTM.",
  },
  {
    title: "An audit trail that assembles itself",
    body: "Who was flagged, who received it, what they did, and when they attested. Any month, any patient: one export, no chart-by-chart reconstruction.",
  },
];

function CompassShowcase() {
  const reduce = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const [chapter, setChapter] = useState(0);

  // Follow playback: derive the open accordion item from the current frame.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reduce) {
      p.pause();
      p.seekTo(70); // hold the worklist beat as a still
      return;
    }
    if (!inView) {
      p.pause();
      return;
    }
    p.play();
    const retry = setTimeout(() => playerRef.current?.play(), 350);
    const id = setInterval(() => {
      const f = playerRef.current?.getCurrentFrame() ?? 0;
      setChapter(Math.min(2, Math.floor(f / COMPASS_CHAPTER_LEN)));
    }, 250);
    return () => {
      clearTimeout(retry);
      clearInterval(id);
    };
  }, [inView, reduce]);

  // Drive playback: clicking an item seeks its chapter.
  const select = (i: number) => {
    setChapter(i);
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(i * COMPASS_CHAPTER_LEN + 2);
    if (!reduce) p.play();
  };

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
      {/* LEFT — heading + synced accordion */}
      <div>
        <motion.div {...fadeUp}>
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Compass · the control panel</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mt-0 mb-10 max-w-[16ch]">
            Your team reviews what matters. <em className="text-[#2563EB]">The rest is handled.</em>
          </h2>
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="border-t border-slate-200">
          {COMPASS_ITEMS.map((item, i) => {
            const open = chapter === i;
            return (
              <div key={item.title} className="border-b border-slate-200">
                <button
                  onClick={() => select(i)}
                  aria-expanded={open}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <span
                    className={`text-[17px] md:text-[18px] font-semibold leading-snug transition-colors duration-300 ${
                      open ? "text-[#2563EB]" : "text-[#0A1633] group-hover:text-[#2563EB]"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="shrink-0 mt-0.5 text-slate-400">
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] leading-[1.7] text-slate-600 pb-5 pr-8 m-0">{item.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* RIGHT — motion graphic in a soft gradient tile (Retell treatment) */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}>
        <div
          className="rounded-[28px] p-4 sm:p-8 md:p-10"
          style={{
            background: [
              "radial-gradient(60% 55% at 18% 12%, rgba(245,158,66,0.18) 0%, rgba(245,158,66,0) 60%)",
              "radial-gradient(65% 60% at 88% 22%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 62%)",
              "radial-gradient(70% 60% at 16% 92%, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 62%)",
              "linear-gradient(150deg, #FAFBFF 0%, #F0F3FA 60%, #EDF0F8 100%)",
            ].join(", "),
          }}
        >
          <Player
            ref={playerRef}
            component={CompassShowcaseComp}
            durationInFrames={COMPASS_DURATION}
            compositionWidth={760}
            compositionHeight={620}
            fps={30}
            loop
            autoPlay
            initiallyMuted
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            style={{ width: "100%" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ── §9 Companion showcase (the patient's side; twin of CompassShowcase) ──────
// From Matteo's HTML mock: stage LEFT (warm pastel tile + Remotion comp with
// four chapters), accordion RIGHT, synced both ways like Compass. Copy adapted
// to the billing guardrail: call DURATION can be shown ("Answered · 21 min"),
// but HANA never "logs billable minutes" — the transcript beat ends on "note
// ready to attest", and the mock's "billable clinical time" lines are gone.
const COMPANION_ITEMS = [
  {
    title: "Your patients see your practice, not an unknown number",
    body: "Calls go out with your practice's name and verified caller ID, so a patient in her seventies sees the clinic she trusts instead of a number she's been told to ignore. A call that isn't answered is worth nothing, which makes this the gate on everything else.",
  },
  {
    title: "Calls go out when the patient is actually free",
    body: "A coordinator calls between nine and five, once, then moves on. Your patient is at dialysis on Tuesday morning and picks up at seven in the evening. HANA tries mornings, evenings and Saturdays until someone answers, with text as a fallback. The conversation is the care contact, so reaching them is the whole job.",
  },
  {
    title: "The conversation finishes, not just starts",
    body: "Hearing loss, a landline, a question that needs repeating, an answer that wanders somewhere else entirely. HANA slows down, repeats itself, follows the tangent, and still completes the protocol, in 30+ languages. A half-finished call helps nobody and documents nothing.",
  },
  {
    title: "It calls back next month, and it remembers",
    body: "Every call opens where the last one ended and references what the patient actually said. Most patients drift out of programs within a few months. Continuity is what keeps them in, and it's worth more than any new enrollment.",
  },
];

function CompanionShowcase() {
  const reduce = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reduce) {
      p.pause();
      p.seekTo(70); // hold the caller-ID beat as a still
      return;
    }
    if (!inView) {
      p.pause();
      return;
    }
    p.play();
    const retry = setTimeout(() => playerRef.current?.play(), 350);
    const id = setInterval(() => {
      const f = playerRef.current?.getCurrentFrame() ?? 0;
      setChapter(Math.min(3, Math.floor(f / COMPANION_CHAPTER_LEN)));
    }, 250);
    return () => {
      clearTimeout(retry);
      clearInterval(id);
    };
  }, [inView, reduce]);

  const select = (i: number) => {
    setChapter(i);
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(i * COMPANION_CHAPTER_LEN + 2);
    if (!reduce) p.play();
  };

  return (
    <div ref={ref}>
      <motion.div {...fadeUp} className="mb-12 md:mb-16">
        <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>The patient companion</p>
        <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] m-0 max-w-[16ch]">
          Built for the one call that actually <em className="text-[#2563EB]">gets answered.</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)] gap-12 lg:gap-16 items-center">
        {/* LEFT — motion graphic on the warm pastel tile (mock's stage) */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="order-2 lg:order-1">
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: [
                "radial-gradient(120% 90% at 12% 88%, #F2DCEF 0%, rgba(242,220,239,0) 55%)",
                "radial-gradient(110% 80% at 88% 14%, #B9CDF5 0%, rgba(185,205,245,0) 58%)",
                "radial-gradient(90% 70% at 42% 34%, #F6E3CE 0%, rgba(246,227,206,0) 60%)",
                "#EDEFF6",
              ].join(", "),
            }}
          >
            <Player
              ref={playerRef}
              component={CompanionShowcaseComp}
              durationInFrames={COMPANION_DURATION}
              compositionWidth={660}
              compositionHeight={660}
              fps={30}
              loop
              autoPlay
              initiallyMuted
              controls={false}
              clickToPlay={false}
              doubleClickToFullscreen={false}
              spaceKeyToPlayOrPause={false}
              style={{ width: "100%" }}
            />
          </div>
        </motion.div>

        {/* RIGHT — synced accordion */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }} className="order-1 lg:order-2 border-t border-slate-200 self-start">
          {COMPANION_ITEMS.map((item, i) => {
            const open = chapter === i;
            return (
              <div key={item.title} className="border-b border-slate-200">
                <button
                  onClick={() => select(i)}
                  aria-expanded={open}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <span
                    className={`text-[17px] md:text-[18px] font-semibold leading-snug transition-colors duration-300 ${
                      open ? "text-[#2563EB]" : "text-[#0A1633] group-hover:text-[#2563EB]"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="shrink-0 mt-0.5 text-slate-400">
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-[15px] leading-[1.7] text-slate-600 pb-5 pr-8 m-0">{item.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ── §6 Proof, in the page's own language ─────────────────────────────────────
// Replaces the imported ProofBento (Matteo 2026-08-12: "too many elements inside
// the square"). Its tiles each carried a decorative geometric doodle plus a
// number plus a label, and the navy/blue checkerboard didn't match the soft
// gradient tiles used by the hero, Compass and Companion sections. This version
// keeps the same approved numbers and quotes, but: one number per tile, no
// decoration, soft gradient grounds, and quote cards that read like the rest of
// the page. Stats chosen to avoid duplicating the §13 numbers band.
const PROOF_STATS = [
  {
    v: "90",
    suf: "%",
    l: "fewer missed patient calls",
    bg: "radial-gradient(120% 100% at 15% 10%, rgba(37,99,235,0.20) 0%, rgba(37,99,235,0) 62%), linear-gradient(150deg, #FAFBFF 0%, #EEF2FC 100%)",
  },
  {
    v: "89",
    suf: "%",
    l: "less time to respond",
    bg: "radial-gradient(120% 100% at 85% 12%, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0) 62%), linear-gradient(150deg, #FAFAFF 0%, #F0EEFB 100%)",
  },
  {
    v: "2",
    suf: "×",
    l: "the volume, same headcount",
    bg: "radial-gradient(120% 100% at 20% 90%, rgba(245,158,66,0.22) 0%, rgba(245,158,66,0) 62%), linear-gradient(150deg, #FFFCF9 0%, #FBF2E9 100%)",
  },
];

const PROOF_QUOTES = [
  {
    quote:
      "Designed for both Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) programs, enabling scalable, intelligent patient engagement while improving adherence, streamlining clinical operations, and lowering the cost of care.",
    name: "Archie Defillo, MD",
    role: "Neuroscience & Sleep / Behavioral Health Innovator",
    avatar: "https://i1.rgstatic.net/ii/profile.image/272173122191393-1441902537961_Q512/Archie-Defillo.jpg",
  },
  {
    // Trimmed with an ellipsis from the approved quote — confirm the shortened
    // form with Dr. Mohamed before this ships.
    quote:
      "Hana … captures the conversation in structured notes that go straight into the chart, and flags anyone who needs a same-day callback.",
    name: "Fakhrudin Mohamed, MD",
    role: "Board-Certified Physician",
    avatar: "/avatars/fakhrudin.png",
  },
];

function ProofSection() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>In their words</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[24ch] m-0">
            Proven by the teams running care <em className="text-[#2563EB]">at scale.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[52ch] mx-auto mt-4 mb-0">
            Real outcomes, in the words of the clinicians running HANA.
          </p>
        </motion.div>

        {/* one number per tile, nothing else */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {PROOF_STATS.map((s, i) => (
            <motion.div
              key={s.l}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
              className="rounded-[22px] border border-slate-200/80 p-8 md:p-9"
              style={{ background: s.bg }}
            >
              <div className="font-serif text-[64px] md:text-[76px] leading-[0.9] text-[#0A1633]">
                {s.v}
                <span className="text-[34px] md:text-[40px] text-[#2563EB]">{s.suf}</span>
              </div>
              <p className="text-[15px] leading-[1.5] text-slate-600 mt-4 mb-0 max-w-[18ch]">{s.l}</p>
            </motion.div>
          ))}
        </div>

        {/* quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
          {PROOF_QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              className="rounded-[22px] bg-[#f6f7fb] border border-slate-200/80 p-8 md:p-9 flex flex-col justify-between m-0"
            >
              <blockquote className="font-serif font-normal text-[19px] md:text-[21px] leading-[1.55] text-[#0A1633] m-0">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3.5 mt-7">
                <img
                  src={q.avatar}
                  alt={q.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div>
                  <div className="text-[15px] font-semibold text-[#0A1633] leading-tight">{q.name}</div>
                  <div className="text-[13.5px] text-slate-600 mt-0.5">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="text-center mt-12">
          <a
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] no-underline hover:gap-3 transition-all"
          >
            See all case studies →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── §5 "Talk to HANA" banner ─────────────────────────────────────────────────
// Retell's CTA-band shape: a full-bleed photograph with a card floating in its
// negative space. Here the card isn't a generic CTA — it IS the live demo, so
// the web call starts from inside the banner. Same Vapi squad the standalone
// LiveDemoSection uses, so behaviour is identical; only the frame changed.
const TALK_AGENT_ID = "Demo";
const TALK_SQUAD_ID = "squad:91b2273e-a3b2-46df-af20-193b50054921";
const FN_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;

function TalkToHanaBanner({
  activeAgentId,
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
}: RemoteV2Props) {
  const isThis = activeAgentId === TALK_AGENT_ID;
  const connecting = isThis && webCallStatus === "connecting";
  const live = isThis && webCallStatus === "active";
  const busyElsewhere = activeAgentId !== null && !isThis;

  // Lead capture, same fields and endpoints as the original LiveDemoSection:
  // name + email + E.164 phone → /site-demo-start texts the prospect and HANA
  // calls back; every submit also POSTs to /api/lead. The `page` tags are kept
  // identical to the old section so downstream lead routing keeps working.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState<"US" | "EU">("US");
  const [errs, setErrs] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "texted" | "called" | "failed">("idle");
  const [smsError, setSmsError] = useState("");

  // Once texted, poll until the backend reports HANA actually dialled them.
  useEffect(() => {
    if (smsStatus !== "texted") return;
    const e164 = phone.replace(/[^\d+]/g, "");
    const id = setInterval(async () => {
      try {
        const res = await fetch(`${FN_BASE}/site-demo-status/${encodeURIComponent(e164)}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json().catch(() => ({}));
        if (data?.status === "called") setSmsStatus("called");
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => clearInterval(id);
  }, [smsStatus, phone]);

  const captureLead = (page: string) => {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        page,
      }),
    }).catch((err) => console.error("Failed to capture lead:", err));
  };

  const handleTextMe = async () => {
    const next: typeof errs = {};
    if (!name.trim()) next.name = "Your name, please";
    if (!email.trim()) next.email = "We need an email";
    const e164 = phone.replace(/[^\d+]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) next.phone = "Include the country code, e.g. +1 555 123 4567";
    if (Object.keys(next).length) {
      setErrs(next);
      return;
    }
    setErrs({});
    setSmsError("");
    setSmsStatus("sending");
    captureLead("live-demo-callback");
    try {
      const res = await fetch(`${FN_BASE}/site-demo-start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: e164, region, lang: "en", name: name.trim() || undefined, email: email.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSmsStatus("idle");
        setSmsError(data.error || "Something went wrong. Try again in a moment.");
        return;
      }
      setSmsStatus("texted");
    } catch {
      setSmsStatus("idle");
      setSmsError("Something went wrong. Try again in a moment.");
    }
  };

  const handleWebCall = () => {
    const next: typeof errs = {};
    if (!name.trim()) next.name = "Your name, please";
    if (!email.trim()) next.email = "We need an email";
    if (Object.keys(next).length) {
      setErrs((p) => ({ ...p, ...next }));
      return;
    }
    setErrs({});
    captureLead("live-demo-web-call");
    handleStartWebCall(TALK_AGENT_ID, TALK_SQUAD_ID);
  };

  const field = (err?: string) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-[14.5px] text-[#0A1633] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 transition ${
      err ? "border-red-400" : "border-slate-200 focus:border-[#2563EB]"
    }`;

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1240px] mx-auto">
        <div className="relative rounded-[28px] overflow-hidden bg-[#0A1633]">
          {/* photograph — subject sits left, card lands in the space at right */}
          <img
            src="/products/remote-patient-call.webp"
            alt="An older man taking a call on his mobile phone"
            className="h-[300px] w-full object-cover object-[30%_center] sm:h-[380px] lg:h-[520px]"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden lg:block"
            style={{ background: "linear-gradient(90deg, rgba(10,22,51,0) 40%, rgba(10,22,51,0.35) 100%)" }}
          />

          {/* the card: static under the photo on small screens, floating on lg */}
          <div className="p-4 sm:p-6 lg:p-0 lg:absolute lg:top-1/2 lg:right-[5%] lg:-translate-y-1/2 lg:w-[430px]">
            <div className="rounded-[20px] bg-white/95 backdrop-blur-sm border border-white/60 shadow-[0_24px_60px_-20px_rgba(10,22,51,0.45)] p-7 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-[1.12] text-[#0A1633] m-0 max-w-[11ch]">
                  Talk to HANA <em className="text-[#2563EB]">right now.</em>
                </h2>
                {/* Brand mark: gradient tile + live waveform, mirroring the
                    reference's gradient thumbnail. (HanaBloomOrb is a fixed 300px
                    composition and doesn't scale down legibly to this size.) */}
                <span
                  className="relative w-[86px] h-[86px] rounded-2xl overflow-hidden shrink-0 grid place-items-center"
                  style={{
                    background: [
                      "radial-gradient(80% 70% at 20% 15%, rgba(96,165,250,0.95) 0%, rgba(96,165,250,0) 60%)",
                      "radial-gradient(80% 70% at 85% 80%, rgba(245,158,66,0.85) 0%, rgba(245,158,66,0) 62%)",
                      "linear-gradient(150deg, #2563EB 0%, #4F46E5 60%, #7C3AED 100%)",
                    ].join(", "),
                  }}
                >
                  <span aria-hidden className="flex items-end gap-[3px] h-7">
                    {[10, 18, 26, 20, 12].map((h, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full bg-white/90"
                        style={{
                          height: h,
                          animation: `hanaTalkBar 1.1s ease-in-out ${i * 0.13}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                  <style>{`
                    @keyframes hanaTalkBar {
                      0%, 100% { transform: scaleY(0.55); }
                      50%      { transform: scaleY(1); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                      @keyframes hanaTalkBar { 0%, 100% { transform: none; } }
                    }
                  `}</style>
                </span>
              </div>

              {smsStatus === "texted" || smsStatus === "called" ? (
                /* confirmation replaces the form once the text is away */
                <div className="mt-5">
                  <div className="flex items-start gap-3 rounded-xl bg-[#EFF3FF] border border-[#2563EB]/20 p-4">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#2563EB] text-white grid place-items-center">
                      <Check className="w-3.5 h-3.5" strokeWidth={3.2} />
                    </span>
                    <div>
                      <p className="text-[14.5px] font-semibold text-[#0A1633] m-0">
                        {smsStatus === "called" ? "HANA is calling you now." : "Check your phone."}
                      </p>
                      <p className="text-[13.5px] leading-[1.6] text-slate-600 mt-1 mb-0">
                        {smsStatus === "called"
                          ? "Pick up and talk normally. Ask it anything a patient would."
                          : `We just texted ${phone.trim()}. Reply to it and HANA calls you straight back.`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSmsStatus("idle");
                      setSmsError("");
                    }}
                    className="text-[13px] font-semibold text-[#2563EB] mt-4 hover:underline"
                  >
                    Use a different number
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[14.5px] leading-[1.6] text-slate-600 mt-4 mb-5">
                    Leave your number and HANA calls you back in seconds. Ask it anything a patient
                    would.
                  </p>

                  <div className="space-y-2.5">
                    <div>
                      <input
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrs((p) => ({ ...p, name: undefined }));
                        }}
                        placeholder="Your name"
                        aria-label="Your name"
                        className={field(errs.name)}
                      />
                      {errs.name && <p className="mt-1 mb-0 text-[12px] text-red-500">{errs.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrs((p) => ({ ...p, email: undefined }));
                        }}
                        placeholder="you@clinic.com"
                        aria-label="Work email"
                        className={field(errs.email)}
                      />
                      {errs.email && <p className="mt-1 mb-0 text-[12px] text-red-500">{errs.email}</p>}
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <div className="flex shrink-0 rounded-lg border border-slate-200 bg-white p-0.5">
                          {(["US", "EU"] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => setRegion(r)}
                              aria-pressed={region === r}
                              className={`px-2.5 py-1.5 text-[12px] font-bold rounded-md transition-colors ${
                                region === r ? "bg-[#0A1633] text-white" : "text-slate-500 hover:text-[#0A1633]"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setErrs((p) => ({ ...p, phone: undefined }));
                            setSmsError("");
                          }}
                          placeholder={region === "US" ? "+1 555 123 4567" : "+44 7123 456789"}
                          aria-label="Phone number"
                          className={field(errs.phone)}
                        />
                      </div>
                      {errs.phone && <p className="mt-1 mb-0 text-[12px] text-red-500">{errs.phone}</p>}
                    </div>
                  </div>

                  {smsError && <p className="mt-3 mb-0 text-[12.5px] text-red-500">{smsError}</p>}

                  <button
                    onClick={handleTextMe}
                    disabled={smsStatus === "sending"}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#0A1633] text-white text-[14.5px] font-semibold px-6 py-[13px] rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {smsStatus === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" strokeWidth={2.2} /> Text me, HANA calls back
                      </>
                    )}
                  </button>

                  {/* secondary path: straight into a browser call */}
                  <div className="mt-3 text-center">
                    {live ? (
                      <button
                        onClick={handleEndWebCall}
                        className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#E05252] hover:underline"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#E05252] animate-pulse" /> End the browser call
                      </button>
                    ) : (
                      <button
                        onClick={handleWebCall}
                        disabled={connecting || busyElsewhere}
                        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2563EB] hover:underline disabled:opacity-50 disabled:no-underline"
                      >
                        <Phone className="w-3.5 h-3.5" strokeWidth={2.4} />
                        {connecting ? "Connecting…" : "or talk in your browser instead"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── §4b The call list, played out ────────────────────────────────────────────
// Matteo's interactive mock (2026-08-13): a Monday-morning call list that plays
// three rounds of coordinator dialling, stops on the damage, then lets HANA take
// the out-of-hours rounds. Numbers are internally consistent: 31 attempts, 3
// reached by staff at 96 minutes, 7 reached in total at 102.
//
// COPY GUARDRAIL — the one change from the mock. It scored answered calls as
// "20 min documented" and the verdict as "three billable patients", which says
// HANA's call time is the billable clinical time. Reframed so the meter measures
// what it actually measures: coordinator time spent ON THE PHONE. That's a
// sharper argument anyway — her 96 minutes went into dialling, not into care —
// and it never claims HANA's minutes are billable.
type Caller = "staff" | "hana";
type Attempt = "none" | "missStaff" | "missHana" | "hit";

const CALL_ROUNDS: { who: Caller; when: string }[] = [
  { who: "staff", when: "Tuesday, 10:12am" },
  { who: "staff", when: "Wednesday, 2:35pm" },
  { who: "staff", when: "Thursday, 11:48am" },
  { who: "hana", when: "Thursday, 6:40pm" },
  { who: "hana", when: "Friday, 8:05am" },
  { who: "hana", when: "Saturday, 10:20am" },
];

const CALL_PATIENTS: {
  name: string;
  detail: string;
  /** 1-indexed round they answer on; null = never answers */
  hit: number | null;
  /** reason per failed attempt */
  fails: string[];
  /** raises a flag a nurse must review when reached */
  flags?: boolean;
}[] = [
  { name: "Doris A.", detail: "78 · heart failure", hit: 1, fails: [] },
  { name: "Ray M.", detail: "71 · COPD, diabetes", hit: 2, fails: ["No answer"] },
  { name: "Bernice T.", detail: "74 · diabetes", hit: 3, fails: ["Blocked, spam likely", "Blocked, spam likely"] },
  { name: "Elena V.", detail: "69 · kidney disease, stage 4", hit: 4, fails: ["At dialysis", "No answer", "At dialysis"], flags: true },
  { name: "Joyce L.", detail: "80 · COPD", hit: 4, fails: ["No answer", "Voicemail full", "No answer"] },
  { name: "Walter P.", detail: "83 · atrial fibrillation", hit: 5, fails: ["Voicemail full", "Voicemail full", "No answer", "No answer"], flags: true },
  { name: "Hector S.", detail: "66 · hypertension", hit: 6, fails: ["No answer", "No answer", "No answer", "Asleep, works nights", "No answer"] },
  { name: "Frank O.", detail: "72 · after knee surgery", hit: null, fails: ["No answer", "No answer", "No answer", "No answer", "No answer", "No answer"] },
];

type CallStep = { t: "round"; round: number } | { t: "call"; p: number; round: number };

/** Flatten the simulation into ONE event per attempt. Each beat resolves the
 *  call that was ringing and starts the next, so the whole thing runs on a
 *  single constant tempo. Separate dial/result steps with different delays is
 *  what made this read as jittery. */
function buildCallSteps(from: number, to: number): CallStep[] {
  const out: CallStep[] = [];
  for (let r = from; r < to; r++) {
    out.push({ t: "round", round: r });
    CALL_PATIENTS.forEach((p, i) => {
      if (p.hit !== null && p.hit < r + 1) return; // already reached
      out.push({ t: "call", p: i, round: r });
    });
  }
  return out;
}

/** One beat. Everything is a multiple of this, so the rhythm stays even. */
const BEAT = 520;

const STEPS_A = buildCallSteps(0, 3);
const STEPS_B = buildCallSteps(3, 6);

type RowState = { attempts: Attempt[]; status: string; state: "idle" | "dialing" | "done" | "stuck" };
const freshRows = (): RowState[] =>
  CALL_PATIENTS.map(() => ({ attempts: Array(6).fill("none") as Attempt[], status: "On the list", state: "idle" }));

function CallListSim() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const [phase, setPhase] = useState<"idle" | "staff" | "staffDone" | "hana" | "done">("idle");
  const [rows, setRows] = useState<RowState[]>(freshRows);
  const [round, setRound] = useState<number | null>(null);
  const [reached, setReached] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = phase === "hana" ? STEPS_B : STEPS_A;

  // autostart once on screen
  useEffect(() => {
    if (inView && phase === "idle" && !reduce) {
      setPhase("staff");
      setPlaying(true);
    }
  }, [inView, phase, reduce]);

  // the call still ringing, resolved on the next beat
  const pending = useRef<{ p: number; round: number } | null>(null);

  const resolvePending = () => {
    const cur = pending.current;
    if (!cur) return;
    pending.current = null;
    const patient = CALL_PATIENTS[cur.p];
    const rn = cur.round + 1;
    const who = CALL_ROUNDS[cur.round].who;
    const answered = patient.hit === rn;
    setAttempts((a) => a + 1);
    setRows((rs) =>
      rs.map((r, i) => {
        if (i !== cur.p) return r;
        const next = [...r.attempts];
        next[rn - 1] = answered ? "hit" : who === "hana" ? "missHana" : "missStaff";
        return {
          attempts: next,
          state: answered ? "done" : "stuck",
          status: answered
            ? who === "staff"
              ? "Answered · 20 min on the call"
              : patient.flags
                ? "Answered · flagged for your nurse"
                : "Answered · contact documented"
            : patient.fails[rn - 1] ?? "No answer",
        };
      }),
    );
    if (answered) setReached((n) => n + 1);
    // coordinator time: 2 min per unanswered dial, 20 min on a call she runs
    // herself, 3 min reviewing each flag HANA hands her. Never 20 for a HANA
    // call — her minutes are the only ones that count as clinical time.
    if (who === "staff") setMinutes((m) => m + (answered ? 20 : 2));
    else if (answered && patient.flags) setMinutes((m) => m + 3);
  };

  useEffect(() => {
    if (!playing) return;
    if (cursor >= steps.length) {
      const id = setTimeout(() => {
        resolvePending();
        setPlaying(false);
        setPhase((ph) => (ph === "staff" ? "staffDone" : "done"));
      }, BEAT);
      return () => clearTimeout(id);
    }
    const step = steps[cursor];
    const id = setTimeout(() => {
      resolvePending();
      if (step.t === "round") {
        setRound(step.round);
      } else {
        pending.current = { p: step.p, round: step.round };
        setRows((rs) =>
          rs.map((r, i) => (i === step.p ? { ...r, state: "dialing", status: "Dialing from your number…" } : r)),
        );
      }
      setCursor((c) => c + 1);
    }, BEAT);
    return () => clearTimeout(id);
  }, [playing, cursor, steps]);

  const startHana = () => {
    pending.current = null;
    setPhase("hana");
    setCursor(0);
    setPlaying(true);
  };

  const reset = () => {
    pending.current = null;
    setPhase("idle");
    setRows(freshRows());
    setRound(null);
    setReached(0);
    setMinutes(0);
    setAttempts(0);
    setCursor(0);
    setPlaying(false);
  };

  // reduced motion: show the finished staff phase immediately
  useEffect(() => {
    if (!reduce || phase !== "idle" || !inView) return;
    setRows(
      CALL_PATIENTS.map((p) => {
        const at = Array(6).fill("none") as Attempt[];
        for (let r = 1; r <= 3; r++) {
          if (p.hit !== null && p.hit < r) break;
          at[r - 1] = p.hit === r ? "hit" : "missStaff";
        }
        const done = p.hit !== null && p.hit <= 3;
        return {
          attempts: at,
          state: done ? "done" : "stuck",
          status: done ? "Answered · 20 min on the call" : p.fails[2] ?? "No answer",
        };
      }),
    );
    setReached(3);
    setMinutes(96);
    setAttempts(21);
    setRound(2);
    setPhase("staffDone");
  }, [reduce, phase, inView]);

  const activeRound = round === null ? null : CALL_ROUNDS[round];
  const hanaPhase = round !== null && round >= 3;

  const meters = [
    {
      k: "Patients reached",
      v: (
        <>
          {reached} <span className="text-[20px] text-slate-400">of 8</span>
        </>
      ),
      tick: reached,
      pop: true,
      s:
        reached === 0
          ? "Nobody has picked up yet"
          : phase === "done"
            ? "Frank still hasn't answered"
            : `${8 - reached} still on the list`,
      frozen: false,
    },
    {
      k: "Coordinator time on the phone",
      v: <>{minutes}</>,
      tick: minutes,
      s: phase === "done" ? "Six minutes added, on two nurse flags" : "Dialing, waiting, noting",
      frozen: phase === "done",
    },
    {
      k: "Attempts made",
      v: <>{attempts}</>,
      tick: attempts,
      s: phase === "done" ? "Twelve of these were made by HANA" : hanaPhase ? "HANA is dialing out of hours" : "Three rounds is a normal week",
      frozen: false,
    },
  ];

  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div ref={ref} className="max-w-[1080px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-5`}>Monday morning</p>
          <h2 className="font-serif font-normal text-[34px] sm:text-[42px] md:text-[50px] leading-[1.08] tracking-[-0.015em] text-[#0A1633] m-0 mx-auto max-w-[24ch]">
            This is your call list. <em className="text-[#2563EB]">Watch it run.</em>
          </h2>
          <p className="text-[16.5px] leading-[1.65] text-slate-600 mt-5 mb-0 mx-auto max-w-[58ch]">
            Eight patients enrolled in care management. Each one needs twenty minutes of clinical
            staff time this month. Your coordinator has today.
          </p>

          {/* week progress: one pip per round, filled as it plays */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {CALL_ROUNDS.map((r, i) => {
              const played = round !== null && i <= round;
              return (
                <motion.span
                  key={r.when}
                  animate={{
                    width: round === i ? 26 : 8,
                    backgroundColor: played ? (r.who === "hana" ? "#2563EB" : "#0A1633") : "#E2E8F0",
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="h-2 rounded-full"
                />
              );
            })}
          </div>
        </motion.div>

        {/* meters */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-[18px] overflow-hidden mt-10"
        >
          {meters.map((m) => (
            <div key={m.k} className="bg-white p-5 md:p-6">
              <p className="text-[10.5px] font-bold uppercase tracking-[1.3px] text-slate-400 m-0">{m.k}</p>
              <p
                className={`font-serif text-[38px] leading-none mt-3 mb-0 tabular-nums transition-colors duration-300 ${
                  m.frozen ? "text-[#2F8F6B]" : "text-[#0A1633]"
                }`}
              >
                {m.pop ? (
                  <motion.span
                    key={m.tick}
                    initial={reduce ? false : { scale: 0.9, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="inline-block"
                  >
                    {m.v}
                  </motion.span>
                ) : (
                  m.v
                )}
              </p>
              <p className={`text-[12.5px] mt-2 mb-0 min-h-[18px] ${m.frozen ? "text-[#2F8F6B] font-semibold" : "text-slate-500"}`}>
                {m.s}
              </p>
            </div>
          ))}
        </motion.div>

        {/* who is calling, and when */}
        <div className="flex items-center justify-center gap-3 mt-8 min-h-[30px]">
          <AnimatePresence mode="wait">
            {activeRound && (
              <motion.div
                key={`${round}-${phase}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="flex items-center gap-3"
              >
                <span
                  className={`text-[10.5px] font-bold uppercase tracking-[1.3px] px-2.5 py-1 rounded-full ${
                    activeRound.who === "staff" ? "bg-[#0A1633] text-white" : "bg-[#2563EB] text-white"
                  }`}
                >
                  {activeRound.who === "staff" ? "Your coordinator" : "HANA"}
                </span>
                <span className="flex items-center gap-1.5 text-[14px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                  {phase === "done" ? "Still trying Frank" : activeRound.when}
                </span>
                {activeRound.who === "hana" && phase !== "done" && (
                  <span className="text-[10.5px] font-bold uppercase tracking-[1.2px] text-[#2563EB] bg-[#EFF3FF] px-2.5 py-1 rounded-full">
                    Out of hours
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* the list */}
        <div className="mt-3.5 border border-slate-200 rounded-[18px] overflow-hidden">
          {rows.map((r, i) => (
            <motion.div
              key={CALL_PATIENTS[i].name}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.03 * i }}
              className={`relative grid grid-cols-1 md:grid-cols-[1fr_180px_190px] gap-2 md:gap-4 items-center pl-6 pr-5 md:pl-7 md:pr-6 py-3.5 transition-colors duration-300 ${
                i < rows.length - 1 ? "border-b border-slate-200" : ""
              } ${r.state === "dialing" ? "bg-[#EFF3FF]" : r.state === "done" ? "bg-[#EDF6F1]" : "bg-white"}`}
            >
              {/* state stripe */}
              <motion.span
                aria-hidden
                animate={{
                  opacity: r.state === "idle" ? 0 : 1,
                  backgroundColor:
                    r.state === "dialing" ? "#2563EB" : r.state === "done" ? "#2F8F6B" : "#E2E8F0",
                }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 top-0 bottom-0 w-[3px]"
              />
              <div className="text-[15px] font-semibold text-[#0A1633]">
                {CALL_PATIENTS[i].name}
                <span className="font-normal text-slate-400 ml-2 text-[13.5px]">{CALL_PATIENTS[i].detail}</span>
              </div>
              <div className="flex gap-1.5">
                {r.attempts.map((a, j) => (
                  <span
                    key={j}
                    className={`w-[9px] h-[9px] rounded-full transition-colors duration-300 ${
                      a === "hit"
                        ? "bg-[#2F8F6B]"
                        : a === "missHana"
                          ? "bg-[#A9B7FA]"
                          : a === "missStaff"
                            ? "bg-slate-300"
                            : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
              <div className="md:text-right text-[13px] flex md:justify-end items-center gap-2">
                {r.state === "dialing" && (
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[#2563EB] animate-ping" />
                    <span className="relative w-2 h-2 rounded-full bg-[#2563EB]" />
                  </span>
                )}
                {r.state === "done" && (
                  <motion.span
                    initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="w-4 h-4 rounded-full bg-[#2F8F6B] grid place-items-center shrink-0"
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.4} />
                  </motion.span>
                )}
                <span
                  className={
                    r.state === "done"
                      ? "text-[#2F8F6B] font-semibold"
                      : r.state === "stuck"
                        ? "text-[#C2643A]"
                        : "text-slate-500"
                  }
                >
                  {r.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* verdicts */}
        <AnimatePresence mode="wait">
          {phase === "staffDone" && (
            <motion.div
              key="v1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="mt-7 rounded-[18px] border border-[#F0D8C6] bg-[#FCF0E7] p-7 md:p-8"
            >
              <h3 className="font-serif font-normal text-[24px] md:text-[26px] leading-[1.34] text-[#0A1633] m-0">
                Your week is gone. Five patients were never reached.
              </h3>
              <p className="text-[15px] leading-[1.65] text-slate-600 mt-3 mb-0 max-w-[660px]">
                Ninety-six minutes of coordinator time, and <b className="text-[#0A1633]">three patients reached</b>.
                Most of those minutes went into dialing people who never picked up. The other five are
                still on the list, and they'll be on it again next month. In the published enrollment
                study, <b className="text-[#0A1633]">22 of 94 patients were lost at exactly this point</b>, after
                up to four attempts, without ever saying no.
              </p>
              <p className="text-[15px] leading-[1.65] text-slate-600 mt-3 mb-0 max-w-[660px]">
                Nobody dials at 6:40 in the evening. Nobody dials on a Saturday morning. That isn't a
                training problem. There are no hours left.
              </p>
            </motion.div>
          )}
          {phase === "done" && (
            <motion.div
              key="v2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-7 rounded-[18px] border border-[#D8DEFB] bg-[#F1F3FE] p-7 md:p-8"
            >
              <h3 className="font-serif font-normal text-[24px] md:text-[26px] leading-[1.34] text-[#0A1633] m-0">
                Seven of eight. Your coordinator's time barely moved.
              </h3>
              <p className="text-[15px] leading-[1.65] text-slate-600 mt-3 mb-0 max-w-[660px]">
                HANA made twelve more attempts, in the evening, at eight in the morning and on a
                Saturday, and reached four more patients. Your team spent{" "}
                <b className="text-[#0A1633]">six minutes</b> in that whole stretch, on the two flags a
                nurse actually needed to see, and those are the minutes that count as clinical time.
              </p>
              <p className="text-[15px] leading-[1.65] text-slate-600 mt-3 mb-0 max-w-[660px]">
                Same team, same week: <b className="text-[#0A1633]">seven patients reached instead of three</b>.
                Frank still hasn't answered, and HANA will keep trying.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {phase === "idle" && (
            <button
              onClick={() => {
                setPhase("staff");
                setPlaying(true);
              }}
              className="bg-[#0A1633] text-white text-[14.5px] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Start calling
            </button>
          )}
          {phase === "staffDone" && (
            <button
              onClick={startHana}
              className="bg-[#2563EB] text-white text-[14.5px] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Let HANA keep calling →
            </button>
          )}
          {(phase === "staffDone" || phase === "done") && (
            <button
              onClick={reset}
              className="bg-white text-slate-500 border border-slate-200 text-[14.5px] font-semibold px-6 py-3 rounded-full hover:text-[#0A1633] transition-colors"
            >
              Run it again
            </button>
          )}
        </div>

        <p className="text-[12.5px] leading-[1.75] text-slate-400 mt-10 mb-0 mx-auto max-w-[820px] text-center">
          Attempt outcomes and the pattern of loss are drawn from a peer-reviewed enrollment study in
          which 22 of 94 contacted patients were never reached after up to four attempts, while only
          11 percent of those reached declined. Coordinator time assumes two minutes per unanswered
          attempt, twenty minutes per care-management call she runs herself, and three minutes to
          review each flag, against published estimates of 45 to 60 minutes of staff time per patient
          per month.
        </p>
      </div>
    </section>
  );
}

// ── §3 How it works: the care coordination loop ──────────────────────────────
// From Matteo's HTML mock (2026-08-13), replacing the imported LoopDiagram. The
// point of this version is the WHO on every step: each beat says what HANA does
// and what the practice does, which is the post-CY2027 argument in miniature.
//
// COPY GUARDRAIL: the mock's step 4 read "Twenty documented minutes per patient,
// ready to attest", which asserts HANA's call time IS the billable time. That's
// the one claim this page must never make (see the header note). Rewritten as
// documentation prepared + minutes attributed to the clinician who supplied them.
type LoopStep = { n: string; name: string; role: React.ReactNode; body: string };

const LOOP_LEFT: LoopStep[] = [
  {
    n: "1",
    name: "Reach",
    role: (
      <>
        Hana calls · <b className="text-[#0A1633]">you set the protocol</b>
      </>
    ),
    body: "From your number, until they answer. Then twenty minutes on medications, symptoms and what changed.",
  },
  {
    n: "2",
    name: "Flag",
    role: (
      <>
        Hana routes · <b className="text-[#0A1633]">your nurse decides</b>
      </>
    ),
    body: "Anything clinical goes to your nurse, with the reason and the transcript attached.",
  },
];

const LOOP_RIGHT: LoopStep[] = [
  {
    n: "3",
    name: "Document",
    role: (
      <>
        <b className="text-[#0A1633]">Your clinician reviews</b> · Hana writes
      </>
    ),
    body: "Time, note and care plan revision, in the chart, under that patient, not in a spreadsheet.",
  },
  {
    n: "4",
    name: "Bill",
    role: (
      <>
        <b className="text-[#0A1633]">You submit</b> · Hana supplies the evidence
      </>
    ),
    body: "The month's documentation per patient, every minute attributed to the clinician who supplied it, ready to attest on the first.",
  },
];

const LOOP_PATH =
  "M 400 200 C 300 80, 120 90, 120 200 C 120 310, 300 320, 400 200 C 500 80, 680 90, 680 200 C 680 310, 500 320, 400 200 Z";
const LOOP_PATH_BACK =
  "M 400 200 C 300 74, 112 84, 112 200 C 112 316, 300 326, 400 200 C 500 74, 688 84, 688 200 C 688 316, 500 326, 400 200 Z";
const LOOP_DUR = "10s";

/* Node positions plus the slice of the 10s cycle when the travelling dot is on
   them, as keyTimes [riseStart, peak, fadeEnd]. The path runs centre → left-top
   → left-bottom → centre → right-top → right-bottom → centre, so the four nodes
   sit at roughly 12%, 37%, 62% and 87% of the loop. */
const LOOP_NODES = [
  {
    name: "reach",
    cx: 222,
    cy: 114,
    window: [0.075, 0.125, 0.2, 1] as const,
    glyph: <path d="M-9 -5 V5 M-4.5 -9 V9 M0 -6 V6 M4.5 -9 V9 M9 -4 V4" />,
  },
  {
    name: "flag",
    cx: 222,
    cy: 286,
    window: [0.325, 0.375, 0.45, 1] as const,
    glyph: (
      <>
        <path d="M0 -9 L9.5 8 H-9.5 Z" />
        <path d="M0 -3 V2" />
        <path d="M0 4.6 V4.7" />
      </>
    ),
  },
  {
    name: "document",
    cx: 578,
    cy: 114,
    window: [0.575, 0.625, 0.7, 1] as const,
    glyph: (
      <>
        <path d="M-7.5 -10 H5 L8 -7 V10 H-7.5 Z" />
        <path d="M-4 -4 H4 M-4 0.5 H4 M-4 5 H1" />
      </>
    ),
  },
  {
    name: "bill",
    cx: 578,
    cy: 286,
    window: [0.825, 0.875, 0.95, 1] as const,
    glyph: (
      <>
        <path d="M-8 -10 H8 V10 L4 7 L0 10 L-4 7 L-8 10 Z" />
        <path d="M-4 -4.5 L-1.5 -2 L4 -7" />
        <path d="M-4.5 2.5 H4.5" />
      </>
    ),
  },
];

function LoopStepBlock({ step, align }: { step: LoopStep; align: "l" | "r" }) {
  const right = align === "r";
  return (
    <motion.div {...fadeUp} className={`max-w-[300px] ${right ? "ml-auto text-right" : ""}`}>
      <div className={`flex items-baseline gap-2.5 ${right ? "justify-end" : ""}`}>
        {right ? (
          <>
            <span className="text-[19px] font-bold tracking-[-0.01em] text-[#0A1633] order-1">{step.name}</span>
            <span className="font-serif text-[44px] leading-none text-[#C9D6F2] order-2">{step.n}</span>
          </>
        ) : (
          <>
            <span className="font-serif text-[44px] leading-none text-[#C9D6F2]">{step.n}</span>
            <span className="text-[19px] font-bold tracking-[-0.01em] text-[#0A1633]">{step.name}</span>
          </>
        )}
      </div>
      <p className="mt-2.5 mb-0 text-[10px] font-bold uppercase tracking-[1px] text-[#2563EB]">{step.role}</p>
      <p className="mt-2.5 mb-0 text-[14.5px] leading-[1.58] text-slate-500">{step.body}</p>
    </motion.div>
  );
}

function HowItWorksLoop() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1240px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-6`}>How it works</p>
          <h2 className="font-serif font-normal text-[34px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-[-0.015em] text-[#0A1633] m-0">
            Reach. Flag. Document. Bill.
            <br />
            <em className="text-[#2563EB]">Every month.</em>
          </h2>
          <p className="text-[17px] leading-[1.62] text-slate-600 max-w-[600px] mx-auto mt-6 mb-0">
            This is your care coordination loop. HANA runs the part your team has no hours for, and
            hands the rest to your clinician.
          </p>
          <p className="text-[15.5px] leading-[1.6] text-slate-500 max-w-[520px] mx-auto mt-3.5 mb-0">
            Reaching the patient is the step that fails. It's the step HANA doesn't stop at.
          </p>
        </motion.div>

        {/* the loop */}
        <div className="relative mt-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(520px,760px)_1fr] items-center gap-9 lg:gap-0">
            <div className="lg:px-2 space-y-8 lg:space-y-[150px]">
              {LOOP_LEFT.map((s) => (
                <LoopStepBlock key={s.n} step={s} align="l" />
              ))}
            </div>

            <div className="order-first lg:order-none">
              <svg viewBox="60 40 680 320" className="w-full h-auto overflow-visible" role="img" aria-label="The care coordination loop: reach, flag, document, bill">
                <defs>
                  <filter id="hanaLoopShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0F1B33" floodOpacity="0.13" />
                  </filter>
                </defs>
                <path d={LOOP_PATH_BACK} fill="none" stroke="#8FB2F2" strokeWidth="3.6" opacity="0.26" />
                <path d={LOOP_PATH} fill="none" stroke="#8FB2F2" strokeWidth="4.2" opacity="0.5" />
                {!reduce && (
                  <>
                    <path d={LOOP_PATH} fill="none" stroke="#2563EB" strokeWidth="4.6" opacity="0.9" strokeDasharray="120 1500" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" from="1620" to="0" dur={LOOP_DUR} repeatCount="indefinite" />
                    </path>
                    <circle r="6.5" fill="#F59E42">
                      <animateMotion dur={LOOP_DUR} repeatCount="indefinite" path={LOOP_PATH} />
                    </circle>
                  </>
                )}

                {/* Nodes. Each lights up as the travelling dot reaches it: the
                    windows below are that node's position along the loop, so the
                    pulse and the dot stay in sync on one 10s cycle. */}
                {LOOP_NODES.map((node) => {
                  const [a, b, c, d] = node.window;
                  const keyTimes = `0;${a};${b};${c};1`;
                  return (
                    <g key={node.name}>
                      <g filter="url(#hanaLoopShadow)">
                        <circle cx={node.cx} cy={node.cy} r="31" fill="#fff" />
                      </g>
                      {!reduce && (
                        <>
                          {/* halo */}
                          <circle cx={node.cx} cy={node.cy} r="31" fill="none" stroke="#2563EB" strokeWidth="2" opacity="0">
                            <animate attributeName="r" dur={LOOP_DUR} repeatCount="indefinite" values={`31;31;40;46;46`} keyTimes={keyTimes} />
                            <animate attributeName="opacity" dur={LOOP_DUR} repeatCount="indefinite" values="0;0;0.55;0;0" keyTimes={keyTimes} />
                          </circle>
                          {/* accent fill */}
                          <circle cx={node.cx} cy={node.cy} r="31" fill="#2563EB" opacity="0">
                            <animate attributeName="opacity" dur={LOOP_DUR} repeatCount="indefinite" values="0;0;1;0;0" keyTimes={keyTimes} />
                          </circle>
                        </>
                      )}
                      <g
                        fill="none"
                        stroke="#0A1633"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform={`translate(${node.cx},${node.cy})`}
                      >
                        {!reduce && (
                          <animate
                            attributeName="stroke"
                            dur={LOOP_DUR}
                            repeatCount="indefinite"
                            values="#0A1633;#0A1633;#FFFFFF;#0A1633;#0A1633"
                            keyTimes={keyTimes}
                          />
                        )}
                        {node.glyph}
                      </g>
                    </g>
                  );
                })}
              </svg>

            </div>

            <div className="lg:px-2 space-y-8 lg:space-y-[150px]">
              {LOOP_RIGHT.map((s) => (
                <LoopStepBlock key={s.n} step={s} align="r" />
              ))}
            </div>
          </div>
        </div>

        <motion.p {...fadeUp} className="max-w-[820px] mx-auto mt-16 mb-0 text-center text-[14.5px] leading-[1.6] text-slate-500">
          <b className="font-medium text-slate-600">You set the escalation rules.</b> A person on
          every clinical flag, a full audit trail on every call, and the minutes totalled per
          patient rather than per program.
        </motion.p>
      </div>
    </section>
  );
}

// ── §2 "What is Hana?" three-way comparison ──────────────────────────────────
// Ported from Matteo's HTML mock (Retell-style "what is X" comparison): two
// muted "other option" cards + the dark HANA card. Copy notes:
//   - US spellings applied (enrollment / program / dialing / judgment).
//   - CY2027 cell on the HANA card rewritten from "Software is explicitly
//     permitted" (unverified clause) to the defensible mechanism; every 2027
//     mention stays "proposed" until the final rule (~Nov 2026).
//   - "Agentic care coordination" keeps the category noun away from "software".

const CMP_OUTSOURCED_POINTS = [
  "Capacity capped by whatever staff they can hire",
  "$20–30 per patient per month, the price their own market set",
  "Notes handed back to you, not written in your chart",
  "Proposed CY2027 rule would ban non-employee staff from furnishing RPM and RTM",
];

const CMP_HANA_POINTS = [
  "Makes every call itself, in 30+ languages",
  "85% of patients reached weekly, against a 15–20% benchmark",
  "Structured note written to your EHR, ready for your clinician to attest",
  "Unaffected by the proposed CY2027 rule: HANA isn't clinical staff",
];

function WhatIsHanaCompare() {
  return (
    <section className="bg-white py-28 md:py-36 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        {/* Retell-style header: heading left, one-liner right */}
        <motion.div {...fadeUp} className="md:flex md:items-start md:justify-between md:gap-12 mb-10 md:mb-14">
          <h2 className="font-serif font-normal text-[36px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.015em] text-[#00122F] m-0">
            What is <em className="text-[#5b76d9]">Hana</em>?
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.55] text-slate-600 md:max-w-[380px] mt-5 md:mt-2 mb-0">
            Every option here costs money and takes work to run. Only one of them actually picks
            up the phone and talks to your patient.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — sparse (reference: IVR card): name mid-card, one line at bottom */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-xl bg-[#f6f7fb] p-8 md:p-9 flex flex-col md:min-h-[620px]"
          >
            <p className="text-[13px] font-semibold text-[#00122F] m-0">Another solution</p>
            <div className="h-10 md:h-[220px]" aria-hidden />
            <h3 className="font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] text-[#00122F] m-0">
              Care management software
            </h3>
            <p className="text-[15px] leading-[1.6] text-slate-600 mt-10 md:mt-auto md:pt-10 mb-0">
              Mainly used to track time, build the care plan, and assemble the claim. Nothing
              happens until someone on your team dials.
            </p>
          </motion.div>

          {/* Card 2 — outsourced care management, ✕ list */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.13 }}
            className="rounded-xl bg-[#f6f7fb] p-8 md:p-9 flex flex-col md:min-h-[620px]"
          >
            <p className="text-[13px] font-semibold text-[#00122F] m-0">Another solution</p>
            <div className="h-10 md:h-[220px]" aria-hidden />
            <h3 className="font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] text-[#00122F] m-0">
              Outsourced care management
            </h3>
            <p className="text-[16px] leading-[1.5] text-[#00122F] mt-6 mb-0">
              Based on contracted nurses and staffing agencies
            </p>
            <ul className="list-none p-0 mt-5 mb-0 space-y-4">
              {CMP_OUTSOURCED_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] leading-[1.5] text-slate-700">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#00122F] text-white grid place-items-center text-[9px] font-bold mt-0.5">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3 — HANA, dark, ✓ list */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.21 }}
            className="rounded-xl bg-[#00122F] p-8 md:p-9 flex flex-col md:min-h-[620px] shadow-[0_28px_70px_-26px_rgba(0,18,47,0.55)]"
          >
            <p className="text-[13px] font-semibold text-white m-0">Our solution</p>
            <div className="h-10 md:h-[220px]" aria-hidden />
            <h3 className="font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] text-white m-0">
              Agentic care coordination
            </h3>
            <p className="text-[16px] leading-[1.5] text-white/90 mt-6 mb-0">
              Based on clinician-built protocols
            </p>
            <ul className="list-none p-0 mt-5 mb-0 space-y-4">
              {CMP_HANA_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] leading-[1.5] text-white/90">
                  <span className="shrink-0 w-5 h-5 rounded-full border border-white/40 text-white grid place-items-center text-[10px] mt-0.5">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          {...fadeUp}
          className="font-serif text-[22px] md:text-[28px] leading-[1.42] text-[#00122F] text-center max-w-[780px] mx-auto mt-14 md:mt-[62px] mb-0"
        >
          Hana is the only one that does the calling <em className="text-[#5b76d9]">and</em> hands
          your clinician a note ready to sign.
        </motion.p>
        <motion.p {...fadeUp} className="text-[13px] text-slate-500 text-center mt-6 mb-0">
          Your care team keeps the relationship, the judgment and the signature. Hana does the dialing.
        </motion.p>
      </div>
    </section>
  );
}

// ── §5b "Built by clinicians" statement ──────────────────────────────────────
// Giant serif statement with an image chip inline in the headline (pattern from
// the reference screenshot). Scroll-linked: "Built" and "by" start pushed to
// the outside and converge to center as the section scrolls into view;
// "clinicians" rises from below. Chip = the Remote product photo blurred hard
// with a blue/violet cast and a warm glow, approximating the reference's
// blurred-silhouette look. No subline (removed per Matteo 2026-08-12); the hero
// keeps "Built by clinicians. Supervised by yours." alongside this section.
function BuiltByClinicians() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.45"] });
  const still = [0, 0] as [number, number];
  const xLeft = useTransform(scrollYProgress, [0, 1], reduce ? still : [-170, 0]);
  const xRight = useTransform(scrollYProgress, [0, 1], reduce ? still : [170, 0]);
  const yLine2 = useTransform(scrollYProgress, [0, 1], reduce ? still : [70, 0]);
  const chipScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.75, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], reduce ? [1, 1, 1] : [0, 0.55, 1]);

  return (
    <section ref={ref} className="bg-white py-24 md:py-36 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif font-normal text-[#00122F] leading-[1.04] tracking-[-0.02em] m-0 text-[48px] sm:text-[80px] md:text-[112px]">
          <span className="flex items-center justify-center gap-[0.35em] whitespace-nowrap">
            <motion.span style={{ x: xLeft, opacity }} className="inline-block">Built</motion.span>
            <motion.span
              aria-hidden
              style={{ scale: chipScale, opacity }}
              className="relative inline-block w-[1.1em] h-[1.1em] rounded-[0.16em] overflow-hidden shrink-0 shadow-[0_12px_40px_rgba(0,18,47,0.22)]"
            >
              {/* luminous blue chip with a warm aurora glow; the blurred photo
                  sits on top at low opacity only to hint a figure (reference look) */}
              <span
                className="absolute inset-0"
                style={{ background: "linear-gradient(150deg, #2a55c0 0%, #16336f 55%, #0d2150 100%)" }}
              />
              <span
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(40% 40% at 25% 18%, rgba(120,170,255,0.55) 0%, transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />
              <span
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(58% 56% at 68% 45%, rgba(255,160,115,0.95) 0%, rgba(235,120,170,0.45) 50%, transparent 76%)",
                  mixBlendMode: "screen",
                }}
              />
              <img
                src="/products/remote-patient-call.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-[10px] scale-125 opacity-40"
                style={{ mixBlendMode: "soft-light" }}
                loading="lazy"
              />
            </motion.span>
            <motion.span style={{ x: xRight, opacity }} className="inline-block">by</motion.span>
          </span>
          <motion.span
            style={{ y: yLine2, opacity }}
            className="block text-center md:-translate-x-[0.3em] mt-[0.02em]"
          >
            clinicians
          </motion.span>
        </h2>
      </div>
    </section>
  );
}

// ── §9 The patient agent (unchanged from live page) ──────────────────────────

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

// Superseded in the page by CompanionShowcase (Retell pattern); kept for revert.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PatientAgentSection() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32 px-6 md:px-16">
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
                Patients answer because <em className="text-[#5b76d9]">it doesn't feel like a machine.</em>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── §10 Sleep / CPAP recovery calculator (unchanged; fate still OPEN) ─────────

const HANA_NONADHERENCE = 22; // % non-adherent with HANA, in production
const PER_PATIENT_DEFAULT = 1400;

function SleepCalculator() {
  const [setups, setSetups] = useState(300);
  const [nonAdherence, setNonAdherence] = useState(50);
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
      {/* result panel — light periwinkle rather than navy, so the page stays light */}
      <div className="bg-[#EFF3FF] text-[#0A1633] p-7 md:p-9 flex flex-col justify-center">
        <p className={`${eyebrow} text-[#2563EB] mt-0 mb-3`}>Patients kept adherent</p>
        <div className="font-serif text-[56px] md:text-[72px] leading-[0.95]">
          ≈ {count(patientsSaved)}
          <span className="font-sans text-[18px] md:text-[22px] font-medium text-slate-500"> / year</span>
        </div>
        <p className="text-[15px] text-slate-600 mt-3">
          That's roughly <span className="font-semibold text-[#0A1633]">{money(recovered)}/year</span> in reimbursement that currently walks out the door.
        </p>
        <div className="mt-6 pt-6 border-t border-[#2563EB]/15">
          <p className="text-[15px] leading-[1.6] text-slate-600 m-0">
            Recovered with a phone call that actually works. Non-adherence drops from{" "}
            <span className="font-semibold text-[#2563EB]">{nonAdherence}% to ~22%</span> in production.
          </p>
          <div className="mt-5 h-2 rounded-full bg-white overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#2563EB]"
              initial={{ width: "0%" }}
              whileInView={{ width: `${Math.max(0, Math.min(100, ((nonAdherence - HANA_NONADHERENCE) / Math.max(nonAdherence, 1)) * 100))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold tracking-[1px] uppercase text-slate-500 mt-2">
            <span>Share of non-adherence eliminated</span>
            <span>{nonAdherence > 0 ? Math.round(((nonAdherence - HANA_NONADHERENCE) / nonAdherence) * 100) : 0}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── §12 Audit-proof section (unchanged from live page) ───────────────────────

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
    body: "Program consent is captured in the patient's own words at enrollment: the program, the date, and the cost-sharing disclosure, stored with the recording. It's the first thing an auditor asks for and the thing practices most often can't produce.",
  },
  {
    icon: RI.database,
    title: "One-click audit export",
    body: "Any month, any patient, any program: one export with transcripts, structured notes, time attribution, escalation trail, and attestations. Ready to hand to a payer, an auditor, or your counsel, with no chart-by-chart reconstruction.",
  },
];

function AuditSection() {
  return (
    <section className="bg-white text-[#0A1633] py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Audit-ready by default</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch]">
            Built for the audit <em className="text-[#2563EB]">you&rsquo;ll eventually get.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[62ch] mx-auto mt-5">
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
              className="rounded-2xl bg-[#f6f7fb] border border-slate-200 p-6 md:p-7 flex items-start gap-4"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-[12px] bg-[#EFF3FF] text-[#2563EB] shrink-0">
                <Glyph d={p.icon} className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-[17px] md:text-[18px] font-semibold mt-0 mb-2 leading-snug">{p.title}</h3>
                <p className="text-[14.5px] leading-[1.7] text-slate-600 m-0">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.35 }} className="text-[17px] md:text-[19px] leading-[1.6] text-[#0A1633] text-center max-w-[54ch] mx-auto mt-14">
          We don't bill, and we don't generate clinical time.{" "}
          <span className="text-[#2563EB]">We produce the record that proves yours was real.</span>
        </motion.p>
      </div>
    </section>
  );
}

// ── Shared bits (unchanged from live page) ───────────────────────────────────

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

interface RemoteV2Props {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

export function RemoteV2({
  activeAgentId,
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
}: RemoteV2Props) {
  return (
    <div className="bg-white text-[#00122F] font-sans overflow-x-hidden">
      <SEO
        title="HANA Remote · Draft"
        useExactTitle
        path="/remote-v2"
        robots="noindex, nofollow"
      />

      {/* §1 HERO — Federato-style split: claim left, motion graphic right */}
      <HeroCareJourney />

      {/* §2 WHAT IS HANA — three-way comparison (software / outsourced / HANA);
          replaces the WhyHana channel bars, which are one import away if wanted back */}
      <WhatIsHanaCompare />

      {/* §2b REACHED-BY-CHANNEL — the 85% column, imported from Home. Header
          overridden so the page doesn't carry two "What is Hana?" headings. */}
      <WhyHana
        eyebrow="The proof"
        heading={
          <>
            They don't answer apps. <span className="italic text-[#2563EB]">They answer HANA.</span>
          </>
        }
        sub="Share of patients actually reached, by channel. Legacy systems wait for the patient to act, and most never do. HANA reaches out, and the conversation finishes."
      />

      {/* §3 HOW IT WORKS — the care coordination loop, with who-does-what on every
          step (replaced the imported LoopDiagram, whose Read/Reason/Engage/Write-Back
          stations didn't carry the practice-vs-HANA split) */}
      <HowItWorksLoop />

      {/* §4 ECONOMICS — the coordinator math (replaces "cost of doing nothing") */}
      <EconomicsSection />

      {/* §4b THE CALL LIST — the coordinator math, played out */}
      <CallListSim />

      {/* §5 TALK TO HANA — the live call, framed as a photo banner (replaced the
          imported LiveDemoSection; same Vapi squad, so the call behaves the same) */}
      <TalkToHanaBanner
        activeAgentId={activeAgentId}
        webCallStatus={webCallStatus}
        handleStartWebCall={handleStartWebCall}
        handleEndWebCall={handleEndWebCall}
      />

      {/* §5b BUILT BY CLINICIANS — giant inline-image statement (from reference) */}
      <BuiltByClinicians />

      {/* §6 PROOF — the bento, kept as-is structurally (Matteo 2026-08-12: keep the
          same structure) but rendered in `soft` mode: gradient tiles instead of the
          navy checkerboard, and the decorative doodles dropped. */}
      <div className={homeTitleFixLight}>
        <ProofBento soft compact />
      </div>

      {/* §7 was the standalone care-journey section — it graduated to the hero
          (§1) on 2026-08-12, so nothing renders here now. */}

      {/* §8 COMPASS — the care team's side */}
      <section className="bg-white text-[#0A1633] py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <CompassShowcase />
        </div>
      </section>

      {/* §9 THE PATIENT COMPANION — the patient's side (Retell accordion pattern
          + Remotion, twin of §8 Compass; replaced PatientAgentSection, which is
          kept below for revert) */}
      <section className="bg-white py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <CompanionShowcase />
        </div>
      </section>

      {/* §10 THE PROGRAMS — workflow marquee */}
      <RecipesMarquee
        tags={PROGRAM_WORKFLOW_TAGS}
        tag="The programs"
        heading="Every program. The same phone call."
        body="RPM, RTM, chronic and behavioral care, post-op. Every reimbursable program runs as a built-in call workflow, documented to the chart for attestation. Tap any card to see the steps."
      />

      {/* §10b INTEGRATIONS — EHR logos orbiting the HANA core. Replaced the phone
          carousel version ("The phone they have. The chart you use."), which is
          kept in the file as IntegrationsSection for easy re-add. */}
      <section className="bg-white pt-24 md:pt-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center">
            <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Integrations</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[24ch] m-0">
              It lands in the chart <em className="text-[#2563EB]">you already use.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[54ch] mx-auto mt-5 mb-0">
              150+ EHR integrations, plus an API and webhooks where you'd rather build the
              connection yourself. The structured note is written the moment the call ends,
              attributed to the clinician who owns the patient.
            </p>
          </motion.div>
        </div>
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mt-8 md:mt-4">
          <OrbitingCirclesGlobe />
        </motion.div>
      </section>

      {/* §11 PATIENT ENGAGEMENT — "Every patient conversation, handled" (from Home) */}
      <div className={homeTitleFixLight}>
        <PatientEngagement white />
      </div>

      {/* §12 CALCULATOR — sleep/CPAP recovery. OPEN DECISION: keep here, move to
          /hana-sleep, or rebuild as a CCM coordinator calculator. */}
      <section className="py-24 md:py-32 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-4`}>The adherence math</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] mx-auto max-w-[24ch] text-[#00122F]">
              Non-adherence has a price. <em className="text-[#5b76d9]">Here's yours.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[52ch] mx-auto mt-4">
              Run the numbers for a sleep or DME program. The sharpest case for the device-free model.
            </p>
          </motion.div>
          <SleepCalculator />
        </div>
      </section>

      {/* §13 THE NUMBERS — 85%-vs-apps row removed (§2 owns the engagement stat) */}
      <section className="py-24 md:py-32 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp}>
            <p className={`${eyebrow} text-[#5b76d9] mt-0 mb-3`}>By the numbers</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.05] mt-0 mb-10 md:mb-[52px] max-w-[22ch] text-[#00122F]">
              Engagement you can bill against.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div {...fadeUp}>
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
            {["$1.4K recovered per patient", "150+ EHR integrations", "45+ clinical protocols", "4M+ patient interactions"].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-[#00122F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5b76d9]" aria-hidden="true" />
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* §14 AUDIT — billing trust */}
      <AuditSection />

      {/* §15 SAFETY — clinical trust after billing trust. Imported from Home as-is:
          SafetyStack is dark by design (white type on translucent glass panels
          that need a dark ground), so it lands as the page's one dark section.
          A light variant would mean rewriting its whole palette. */}
      <SafetyStack light />

      {/* §16a HOW WE START — pulled 2026-08-12 for the same reason as SafetyStack:
          InlineImageHeader is dark by design (its three step animations are white
          artwork on navy, so they wash out on a light ground). It now takes a
          `light` prop, but the artwork needs recoloring before it can come back. */}

      {/* §16b FAQ */}
      <section className="py-24 md:py-32 px-6 md:px-16 bg-white">
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

      {/* §16c CTA */}
      <section className="bg-white text-[#0A1633] py-28 md:py-32 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#2563EB]/[0.12] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-[#2563EB]/[0.12] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-6`}>Ready to run a monitoring program that actually works?</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            Book a demo. <em>Live in days.</em>
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#0A1633] text-white rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["No devices to ship", "No app to download", "Audit-ready from day one", "Live in your EHR in days"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0A1633] bg-white border border-slate-200 rounded-full px-3.5 py-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default RemoteV2;
