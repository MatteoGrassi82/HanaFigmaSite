import { useEffect, useRef } from "react";
import { PaletteSwitcher } from "../components/lab/PaletteSwitcher";
import { motion, useReducedMotion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { SEO } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { RecipesMarquee } from "../components/sections/RecipesMarquee";
import { PROGRAM_CARDS } from "../../content/programmes";
import { SleepNoteBeforeTime } from "../components/sections/SleepNoteBeforeTime";
import { InlineImageHeader } from "../components/sections/InlineImageHeader";
import { SonicDemoSection } from "../components/sections/SonicDemoSection";
import { GetYouLive } from "../components/sections/GetYouLive";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { SafetyStack } from "../components/sections/SafetyStack";
import { ComplianceSection } from "../components/sections/ComplianceSection";
import { LatestPosts } from "../components/sections/LatestPosts";
import { AskAiAboutUs } from "../components/sections/AskAiAboutUs";
import { FaqSection } from "../components/sections/FaqSection";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { WhatIsHanaCompare } from "../components/sections/WhatIsHanaCompare";
import { BuiltByClinicians } from "../components/sections/BuiltByClinicians";
import { TeamSection } from "../components/sections/TeamSection";
import { AccordionPlayer, type AccordionPlayerItem } from "../components/sections/AccordionPlayer";
import { Player, type PlayerRef } from "@remotion/player";
import { CareJourneyComp, CARE_JOURNEY_DURATION } from "../components/remotion/CareJourneyComp";
import { CompanionShowcaseComp, COMPANION_CHAPTER_LEN, COMPANION_DURATION } from "../components/remotion/CompanionShowcaseComp";
import { ProofBento } from "../components/sections/ProofBento";
import OrbitingCirclesGlobe from "../components/media/OrbitingCirclesGlobe";
import { ShaderBackground } from "../components/media/ShaderBackground";

const DEMO_URL = "https://calendly.com/matteowastaken/discoverycall";

/**
 * /remote-v2 — DRAFT rebuild of the HANA page. NOT linked from any nav,
 * noindex (see NOINDEX_ROUTES in scripts/lib/route-seo.mjs). Working canvas:
 * iterate here, then replace HanaRemote.tsx wholesale when approved, and
 * remove this route.
 *
 * Skeleton v4 (2026-08-19, after Matteo's call with Sthita). Remote is what
 * this page sells; Sleep gets one hand-off section and nothing more. The page was
 * running too long, so five sections came off.
 *   1  Hero: split, claim left, CareJourneyComp on a textured canvas right
 *   2  "What is Hana?" three-way comparison (care management software /
 *      outsourced care management / HANA AI care coordination). This is the
 *      section that explains what it IS, so it stays first.
 *   3  The loop: "Reach. Flag. Document. Bill. Every month."
 *   3b "Built by clinicians" giant inline-image statement
 *   4  Talk to HANA (the live demo, the one interactive thing worth keeping)
 *   5  Our team (clinicians, AI researchers, care operators)
 *   6  ProofBento "Proven by the teams running care at scale"
 *   7  Compass, the control panel
 *   8  The patient companion (phone mockup + accordion)
 *   9  Programs: the CCM / APCM / BHI / RTM stack
 *   10 Integrations (EHR logos orbiting the core)
 *   11 Numbers band
 *   12 HANA Sleep, one section, labelled New, links to /hana-sleep
 *   13 Audit-ready  14 SafetyStack  15 FAQ · CTA
 *
 * PULLED on 2026-08-19, all still in the file or one import away:
 *   - the 85% reached-by-channel column (§2 already does the comparing, and
 *     comparing channels is a Contact argument)
 *   - the coordinator math and the Monday-morning call list (too long; nobody
 *     clicks through an animated call list)
 *   - Home's "Every patient conversation, handled" (the companion says it)
 *   - the sleep/DME adherence calculator (moving to its own page as a
 *     multi-step interactive calculator)
 *   - the badged programs marquee, in favour of the scannable stack
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
// larger (56-60px) with tighter tracking than this page's title style. These
// wrappers restyle the imported headings to serif 32/40/46px at normal tracking
// without touching the Home originals. (The original reason for this also
// included Instrument Serif faking a bold at weight 500, since that family only
// ships 400. Fraunces is variable across 100-900, so that half is now moot.)
const homeTitleFix =
  "[&_h2]:font-normal [&_h2]:tracking-normal [&_h2]:leading-[1.1] [&_h2]:text-[32px] sm:[&_h2]:text-[40px] md:[&_h2]:text-[46px]";
const homeTitleFixLight = `${homeTitleFix} [&_h2]:text-navy`;

// ── Content ──────────────────────────────────────────────────────────────────



// The care-coordination tag filter for the workflow marquee. Kept for the day the
// marquee comes back (it was replaced by ProgramsStack on 2026-08-19): these are
// the tags that made it show care-coordination workflows only, Italian twins
// included so it filtered in either locale.
const CARE_COORDINATION_TAGS = [
  "Outreach", "Behavioral Health", "ADHD", "Testing", "Reactivation",
  "Cronicità", "Salute Mentale", "Aderenza", "Prevenzione", "Recupero", "Esami",
];

const R_FAQS = [
  {
    q: "Do my patients need a device or an app?",
    a: "Not for the programs HANA runs device-free: CCM, APCM and behavioral health integration, where the covered activity is the care-management contact itself. Nothing is shipped, downloaded, or charged to the patient. If your patients already use wearables or connected devices, that device data flows in via API alongside the conversation.",
  },
  {
    q: "Is this device-less RPM?",
    a: "No, and we're deliberate about that. RPM codes (99453/99454/99457) require an FDA-defined medical device that transmits readings automatically. A patient reading a number to us over the phone does not satisfy them, and billing RPM that way is what the DOJ's first RPM False Claims settlement was about. On RPM, HANA is the engagement layer on top of the devices you already use: the device transmits, HANA keeps the patient engaged and transmitting. The device-free programs are CCM, APCM and BHI.",
  },
  {
    q: "Does this replace my clinicians' billable time?",
    a: "No. The opposite. We don't replace the clinician's billable interaction, and HANA's call time is not billed as clinical time. HANA captures the data, drives the adherence, and prepares the documentation so your clinician reviews a flagged worklist and attests, instead of chasing patients.",
  },
  {
    q: "How does the billing actually work?",
    a: "HANA produces the documentation the codes require; your qualified staff supply and attest to the time. Every interaction is written back as a structured note attributed to a named clinician, across CCM, APCM, BHI and RTM (98975–98981), so the person who bills is the person who did the clinical work, with the record to show it.",
  },
  {
    q: "How is this different from care management software?",
    a: "Care management software is a co-pilot for your care manager: conversation guides, call summaries, auto-populated care plans, a dialer. Every feature makes a human's call better, and none of them makes the call. HANA does the call itself, then writes the note, so your care manager supervises a panel instead of phoning through a list. A co-pilot makes one person somewhat faster. Removing the dialing is what changes how many patients one person can hold.",
  },
  {
    q: "We already run RPM with devices. Why would we add this?",
    a: "Because the devices aren't the problem. Engagement is. HANA is the engagement layer that keeps your existing RPM program transmitting: it handles the between-visit contact, chases the days where the device went quiet, and recovers the patients who've drifted. The readings still come from the device, exactly as the codes require.",
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
  // The four objections the Site Build Brief names as compulsory (2026-08-25).
  {
    q: "We already have a care management vendor. Why change?",
    a: "Most vendors in this category supply the staff as well as the software, and the CY2027 proposal pays for remote monitoring only when the clinical staff are direct employees of the billing practice. If that is finalized as written, the contracted-staffing model stops being billable for those codes. HANA is the other shape: your own employed clinicians own the patients and the attestation, and HANA is the capacity that makes the calling possible. You can also run us alongside an existing vendor on a different cohort and compare the documentation.",
  },
  {
    q: "My staff has no bandwidth to take this on.",
    a: "That is the objection the whole program is built around, and it is why onboarding is a named person rather than a login. One owner takes your clinic live, the protocols come pre-built, and the learning is short courses your staff can do in the gaps rather than a manual. The calling itself is the part that consumed the bandwidth, and that is the part HANA does.",
  },
  {
    q: "Is there a long contract?",
    a: "No multi-year lock-in. Start on one program and one cohort, keep the documentation either way, and expand when the numbers hold up. If a pilot does not clear the bar you set at the start, you should not be signing anything longer.",
  },
  {
    q: "What does it cost?",
    a: "Usage-based, per actively managed patient per month, so the cost moves with the panel you actually run rather than with a seat count or a platform tier. We will put the number in front of you on the call, along with the arithmetic against a coordinator's fully loaded cost, because that is the comparison that decides it.",
  },
];

// ── Five-step flow (unchanged from live page) ────────────────────────────────





// ── §7 Care journey pipeline (Federato-style) ────────────────────────────────
// Recreation of the Federato hero animation for HANA (analyzed from Matteo's
// screencast 2026-08-12): a stepper rail of stages, a canvas where per-stage UI
// vignettes swap, and persistent data chips that travel through every stage so
// one patient's facts are the protagonist. Ends on a compressed outcome coda
// (new enrollment → phone → note in your EHR), then loops. Auto-advances,
// pauses on hover, runs only in view; reduced motion pins the Document stage.







// ── §7b Federato-identical split version ─────────────────────────────────────
// Faithful recreation of the Federato hero layout: static headline block on the
// left; full-bleed textured canvas on the right carrying the stepper rail
// (white cards with colored star badges on their top edge), the swapping
// vignettes, butter-yellow data chips, and the outcome coda with the dashed
// arrow. Texture = SVG fractal turbulence mapped to a navy→periwinkle duotone
// (their sand dunes, our palette).


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
/* The reduced-motion still of the hero dune: the same four-stop light-to-dark
   fall the shader animates, so a reduced-motion visitor sees the same image. */
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
    <header ref={ref} className="bg-paper-bright text-navy overflow-hidden border-b border-rule/80">
      {/* The claim gets the larger half: 58/42. It ran 43/57 before, which let the
          motion panel dominate a hero whose job is the headline. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:min-h-[calc(100vh-40px)]">
        {/* LEFT — the claim, static */}
        <div className="px-6 md:px-16 py-20 md:py-24 lg:py-28 flex flex-col justify-center">
          {/* Hero copy set by Matteo 2026-08-26. Only the HANDWRITING EFFECT was
              reverted, not the words: the third line is the serif italic accent,
              the same treatment as every other accent line on the page.
              <HandwritingText> is still in components/ui if it finds a home. */}
          <p className={`${eyebrow} text-brand mt-0 mb-6`}>
            AI care coordination that reaches every patient
          </p>
          <h1 className="font-serif font-normal text-[42px] sm:text-[54px] md:text-[64px] lg:text-[74px] leading-[1.02] tracking-[-0.018em] m-0">
            More patients.
            <br />
            Same team.
            <br />
            <em className="text-brand">Better outcomes.</em>
          </h1>
          <p className="text-[16px] md:text-[17.5px] leading-[1.65] text-ink-soft mt-7 mb-0 max-w-[48ch]">
            Every reimbursable care program, run in house from enrollment to billing. HANA's AI
            does the calls and the documentation. Your clinicians review and sign.
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 self-start bg-navy text-white text-[15px] font-semibold px-8 py-[15px] rounded-[10px] no-underline hover:opacity-90 transition-opacity mt-10"
          >
            Book a demo →
          </a>
        </div>

        {/* RIGHT — textured canvas with the motion graphic. Texture fills the
            whole panel (including behind the navbar); the Player is inset by
            pt-20 so no part of the animation sits under the bar. */}
        <div className="relative min-h-[480px] sm:min-h-[620px] lg:min-h-[740px]">
          <DuneTexture />
          {/* Both dimensions set → the Player CONTAIN-fits inside the panel and
              can never overflow it. This is the real fix for the rail badges
              being clipped at the top: width-only sizing let the comp grow
              taller than the panel on shorter viewports. */}
          <div className="absolute inset-0 flex items-center justify-center px-2 md:px-4 py-4">
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
              style={{ width: "100%", height: "100%", maxWidth: 1040 }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}







// ── §9 Companion showcase (the patient's side; twin of CompassShowcase) ──────
// From Matteo's HTML mock: stage LEFT (warm pastel tile + Remotion comp with
// four chapters), accordion RIGHT, synced both ways like Compass. Copy adapted
// to the billing guardrail: call DURATION can be shown ("Answered · 21 min"),
// but HANA never "logs billable minutes" — the transcript beat ends on "note
// ready to attest", and the mock's "billable clinical time" lines are gone.
// Cut to THREE rows (Matteo 2026-08-25: "there should just be three in the
// patient companion", languages definitely one of them). His added idea —
// "before they want to call, we can answer" — folds into the caller-ID row:
// the number is the practice's, and it answers when rung back. The dropped
// rows (call timing, the conversation finishing) live on in the FAQ.
// LANGUAGE COUNT: confirmed 30+ (Matteo 2026-08-25, closing the earlier "65").
// The nine below are the ones he named as in production. "Indian" in his list
// is written as Hindi here — confirm that is the language he means.
const LANGS_IN_PRODUCTION = [
  { flag: "🇺🇸", name: "English" },
  { flag: "🇪🇸", name: "Spanish" },
  { flag: "🇮🇹", name: "Italian" },
  { flag: "🇫🇷", name: "French" },
  { flag: "🇵🇹", name: "Portuguese" },
  { flag: "🇨🇳", name: "Chinese" },
  { flag: "🇷🇺", name: "Russian" },
  { flag: "🇵🇭", name: "Tagalog" },
  { flag: "🇮🇳", name: "Hindi" },
];

/* The three patient-side rows, for the AccordionPlayer. Copy unchanged from the
   page-local COMPANION_ITEMS this replaces. The old `flags: true` flag is now a
   rendered `extra` node on the row it belongs to, which is the language row and
   not the caller-ID one: the two accordions share markup and it has landed in
   the wrong one before. */
const COMPANION_ITEMS: AccordionPlayerItem[] = [
  {
    title: "Your patients see your practice, not an unknown number",
    body: "Your name on the caller ID, not a number she has been told to ignore. And it works the other way: she rings that number back and HANA answers, any hour, and writes that conversation up too.",
  },
  {
    title: "It calls back next month, and it remembers",
    body: "Every call opens where the last one ended, in the patient's own words. Most patients drift out of a program within months. Remembering is what keeps them in.",
  },
  {
    title: "It works in the language they actually speak",
    body: "30+ languages, switched per patient, same number and same protocol. Nothing to configure, no second line, no interpreter to book. The patients who get a worse call everywhere else get the same call here.",
    extra: (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {LANGS_IN_PRODUCTION.map((l) => (
          <span
            key={l.name}
            className="inline-flex items-center gap-1.5 rounded-pill border border-rule bg-paper px-2.5 py-1 text-[12.5px] text-ink-soft"
          >
            <span aria-hidden>{l.flag}</span>
            {l.name}
          </span>
        ))}
        <span className="inline-flex items-center rounded-pill border border-rule bg-paper px-2.5 py-1 text-[12.5px] text-ink-mute">
          +21 more
        </span>
      </div>
    ),
  },
];






























// ── §2 "What is Hana?" three-way comparison ──────────────────────────────────
// Ported from Matteo's HTML mock (Retell-style "what is X" comparison): two
// muted "other option" cards + the dark HANA card. Copy notes:
//   - US spellings applied (enrollment / program / dialing / judgment).
//   - CY2027 cell on the HANA card rewritten from "Software is explicitly
//     permitted" (unverified clause) to the defensible mechanism; every 2027
//     mention stays "proposed" until the final rule (~Nov 2026).
//   - "AI care coordination" keeps the category noun away from "software", and
//     drops "agentic" (deprecated in the brand architecture, and the Site Build
//     Brief is explicit that the behaviour goes on the site and the label does
//     not). Matteo 2026-08-25: the AI has to stay visible, only the buzzword goes.






// ── §9 The patient agent (unchanged from live page) ──────────────────────────




// ── §10 Sleep / CPAP recovery calculator (unchanged; fate still OPEN) ─────────



// ── §12 Audit-proof section (unchanged from live page) ───────────────────────



// ── Shared bits (unchanged from live page) ───────────────────────────────────



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
    <div className="bg-paper-bright text-navy font-sans overflow-x-hidden">
      <SEO
        title="HANA · Draft"
        useExactTitle
        path="/remote-v2"
        robots="noindex, nofollow"
      />

      {/* §0 ANNOUNCEMENT — above everything (Matteo 2026-09-02) */}
      <AnnouncementBar />

      {/* §1 HERO — Federato-style split: claim left, motion graphic right */}
      <HeroCareJourney />

      {/* §2 WHAT IS HANA — three-way comparison (software / outsourced / HANA);
          replaces the WhyHana channel bars, which are one import away if wanted back */}
      <WhatIsHanaCompare />

      {/* §2c PROOF — directly under What is Hana? (Matteo 2026-08-25) — the bento, kept as-is structurally (Matteo 2026-08-12: keep the
          same structure) but rendered in `soft` mode: gradient tiles instead of the
          navy checkerboard, and the decorative doodles dropped. */}
      <div className={homeTitleFixLight}>
        <ProofBento soft compact />
      </div>


      {/* §3 HOW IT WORKS — the care coordination loop, with who-does-what on every
          step (replaced the imported LoopDiagram, whose Read/Reason/Engage/Write-Back
          stations didn't carry the practice-vs-HANA split) */}
      <HowItWorksLoop />

      {/* §3c was the 85% reached-by-channel column. Pulled 2026-08-19 (call):
          §2's three-way comparison already does the comparing, and comparing
          channels is a HANA Contact argument. The import is one line away in
          ../components/WhyHana if it comes back. */}

      {/* §4 and §4b were the coordinator math and the Monday-morning call list.
          Both pulled 2026-08-19 (call): the page ran too long, and the animated
          call list asked the reader to click through something they won't. The
          2.3x number survives in the §13 numbers band. EconomicsSection and
          CallListSim are still in this file, unmounted, for a separate page. */}

      {/* §5 TALK TO HANA — the same headline and the same working form, on the
          sonic-waveform canvas (Matteo 2026-08-20, variant 10a from the lab).
          The form is not a copy: SonicDemoSection renders Home's LiveDemoSection
          in `bare` mode, so validation, endpoints, the callback flow and the Vapi
          handlers are the same code Home runs. */}
      <SonicDemoSection
        activeAgentId={activeAgentId}
        webCallStatus={webCallStatus}
        handleStartWebCall={handleStartWebCall}
        handleEndWebCall={handleEndWebCall}
      />

      {/* §6 COMPASS — the care team's side */}
      <section className="bg-paper-bright text-navy py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <AccordionPlayer />
        </div>
      </section>

      {/* §7 BUILT BY CLINICIANS — giant inline-image statement. Sits between the
          two product views (Matteo 2026-08-20): Compass is what your team gets,
          the statement, then what the patient gets. */}
      <BuiltByClinicians />

      {/* §8 THE PATIENT COMPANION — the patient's side (Retell accordion pattern
          + Remotion, twin of §8 Compass; replaced PatientAgentSection, which is
          kept below for revert) */}
      <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <AccordionPlayer
            eyebrow="For your patients"
            heading={<>The call your patient actually <em>picks up.</em></>}
            items={COMPANION_ITEMS}
            comp={CompanionShowcaseComp}
            chapterLen={COMPANION_CHAPTER_LEN}
            duration={COMPANION_DURATION}
            side="left"
          />
        </div>
      </section>

      {/* §9 THE PROGRAMS — the moving cards, badged by billable program
          (Matteo 2026-08-20, brought over from /remote-lab and placed directly
          under the patient companion). Chips read CCM / APCM / BHI / RTM. `tags`
          is still passed so an Italian visitor keeps the filtered Italian
          recipes, because PROGRAM_CARDS is US Medicare and English only.
          ProgramsStack, the scannable accordion version, is still in
          components/remote and is a one-line swap. */}
      <RecipesMarquee
        soft
        items={PROGRAM_CARDS}
        tags={CARE_COORDINATION_TAGS}
        tag="Programs"
        heading="Every program is a phone call somebody has to make."
        body="Any program where the same patient needs a call next month. CCM, APCM, BHI, RTM, RPM, the ACCESS Model. Different rules, same phone call. Tap any card to see the steps it runs."
      />

      {/* §9a THE MONTH, ALREADY WRITTEN UP — what a program month produces:
          the time log is full before the clinician starts their own clock
          (Matteo 2026-08-20: below the programs). */}
      <SleepNoteBeforeTime />

      {/* §10a2 GETTING LIVE — onboarding and the academy (Matteo + Dr Mohamed,
          2026-08-25). The answer to "my staff has no bandwidth", which is the
          objection that sells the staffing model CY2027 is closing. */}
      <GetYouLive />

      {/* §10b INTEGRATIONS — EHR logos orbiting the HANA core. Replaced the phone
          carousel version ("The phone they have. The chart you use."), which is
          kept in the file as IntegrationsSection for easy re-add. */}
      <section className="bg-paper-bright pt-24 md:pt-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center">
            <p className={`${eyebrow} text-brand mt-0 mb-4`}>Integrations</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy mx-auto max-w-[24ch] m-0">
              It lands in the chart <em className="text-brand">you already use.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[54ch] mx-auto mt-5 mb-0">
              Your EHR. Your phone system. Nothing to rip out. The note is written the moment the
              call ends, attributed to whoever owns the patient.
            </p>
          </motion.div>
        </div>
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mt-8 md:mt-4">
          <OrbitingCirclesGlobe />
        </motion.div>
      </section>

      {/* §11 was Home's "Every patient conversation, handled". Pulled 2026-08-19
          (call): §9's patient companion makes the same argument with the phone
          mockup, so this was the duplicate. PatientEngagement import removed. */}

      {/* §7 was the standalone care-journey section — it graduated to the hero
          (§1) on 2026-08-12, so nothing renders here now. */}

      {/* §12 was the sleep/DME adherence calculator. Pulled 2026-08-19 (call):
          it is sleep economics on a care-coordination page, and it is being
          replaced by a multi-step interactive calculator on its own page. The
          SleepCalculator component is still in this file, unmounted. */}

      {/* §13 was the numbers band, "Engagement you can bill against" (22% / 85%
          / 2.3x). Pulled 2026-08-20. RDeltaStat is still in this file, and the
          surviving numeric proof on the page is the §11 bento. */}

      {/* §13b was the HANA Sleep hand-off band. Pulled 2026-08-20. SleepBand is
          in components/remote and is a one-line re-add. NOTE: §9's "written up
          before you start your time" is still badged HANA Sleep, so it is now
          the only sleep-flavoured section on the page. */}

      {/* §14 was the audit-proof section, "Built for the audit you'll eventually
          get". Pulled 2026-08-20. AuditSection is still in this file; the FAQ
          carries the CY2027 answer. */}

      {/* §15 SAFETY — clinical trust after billing trust. Imported from Home as-is:
          SafetyStack is dark by design (white type on translucent glass panels
          that need a dark ground), so it lands as the page's one dark section.
          A light variant would mean rewriting its whole palette. */}
      <SafetyStack light />

      {/* §15b OUR TEAM — moved under Security & Safety (Matteo 2026-08-25) — the credential behind Built by clinicians, which now
          sits up at §3b. Say the word and the roster follows it up there. */}
      <TeamSection />


      {/* §16a HOW WE START — pulled 2026-08-12 for the same reason as SafetyStack:
          InlineImageHeader is dark by design (its three step animations are white
          artwork on navy, so they wash out on a light ground). It now takes a
          `light` prop, but the artwork needs recoloring before it can come back. */}

      {/* §15b COMPLIANCE — the credentials view, imported from Home as-is
          (Matteo 2026-08-20). Sits right after SafetyStack, same pairing as Home:
          the defense-in-depth argument, then the certifications behind it. */}
      <ComplianceSection white />

      {/* §16b FAQ — the shared section. This page was the seventh copy of the
          same expanding row; FaqSection is the one implementation now. */}
      <FaqSection items={R_FAQS} />

      {/* §16b2 FROM THE BLOG and ASK AI — imported from Home as-is
          (Matteo 2026-08-20), in Home's order: the three most recent posts, then
          the ask-AI box, then the closing CTA. */}
      <LatestPosts />

      <AskAiAboutUs className="py-12 md:py-16" />

      {/* §16c CTA */}
      <section className="bg-paper-bright text-navy py-28 md:py-32 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-brand/[0.12] w-[520px] h-[520px] -bottom-[180px] pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-brand/[0.12] w-[340px] h-[340px] -bottom-[110px] pointer-events-none" />
        <motion.div {...fadeUp} className="relative">
          <p className={`${eyebrow} text-brand mt-0 mb-6`}>See it on your own patients.</p>
          <h2 className="font-serif font-normal text-[40px] sm:text-[52px] md:text-[60px] leading-[1.04] mx-auto mb-8 max-w-[16ch]">
            Book a demo.
          </h2>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-navy text-white rounded-[10px] font-semibold text-[15px] px-8 py-[15px] no-underline hover:opacity-90 transition-opacity"
          >
            Book a demo →
          </a>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {["No devices to ship", "No app to download", "Audit-ready from day one", "Runs in the EHR you already use"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy bg-paper-bright border border-rule rounded-full px-3.5 py-1.5">
                <Check className="w-3.5 h-3.5 text-brand" strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <PaletteSwitcher startOpen={false} />
      <Footer />
    </div>
  );
}

export default RemoteV2;
