import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView, useScroll, useTransform } from "motion/react";
import { Check, ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
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
import { Player, type PlayerRef } from "@remotion/player";
import { CareJourneyComp, CARE_JOURNEY_DURATION } from "../components/remotion/CareJourneyComp";
import { CompassShowcaseComp, COMPASS_CHAPTER_LEN, COMPASS_DURATION } from "../components/remotion/CompassShowcaseComp";
import { CompanionShowcaseComp, COMPANION_CHAPTER_LEN, COMPANION_DURATION } from "../components/remotion/CompanionShowcaseComp";
import { ProofBento } from "../components/sections/ProofBento";
import OrbitingCirclesGlobe from "../components/media/OrbitingCirclesGlobe";
import { ShaderBackground } from "../components/media/ShaderBackground";
// Fraunces as the display serif, scoped to the `serif-display` class on this
// page's root. The warm-paper half of the original experiment was dropped with
// the palette decision; this page is the legacy navy and periwinkle on white.
import "../../styles/serif-display.css";

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
// Instrument Serif at font-weight 500 — the family only ships 400, so the
// browser fakes a bold that reads as a different font — plus larger sizes
// (56-60px) and tighter tracking. These wrappers restyle the imported headings
// to this page's title style (serif 400 · 32/40/46px · normal tracking) without
// touching the Home originals.
const homeTitleFix =
  "[&_h2]:font-normal [&_h2]:tracking-normal [&_h2]:leading-[1.1] [&_h2]:text-[32px] sm:[&_h2]:text-[40px] md:[&_h2]:text-[46px]";
const homeTitleFixLight = `${homeTitleFix} [&_h2]:text-[#00122F]`;

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
    <header ref={ref} className="bg-white text-navy overflow-hidden border-b border-slate-200/80">
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
          <p className="text-[16px] md:text-[17.5px] leading-[1.65] text-slate-600 mt-7 mb-0 max-w-[48ch]">
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
    body: "Every call is scored against your protocol. Only the flags surface, each with the call behind it and a named owner.",
  },
  {
    title: "Billing documentation, ready to attest",
    body: "The note is written the moment the call ends, and the minutes are attributed to whoever earned them. You see what is ready to sign, across every program you run.",
  },
  {
    title: "An audit trail that assembles itself",
    body: "Who was flagged, who got it, what they did, when they signed. Any month, any patient, one export.",
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
    <div ref={ref}>
      {/* Heading on top, shared with the patient companion below so the two
          product sections read as a pair (Matteo 2026-08-25). */}
      <motion.div {...fadeUp} className="mb-12 md:mb-16">
        <p className={`${eyebrow} text-brand mt-0 mb-4`}>For your clinic</p>
        <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy m-0 max-w-[16ch]">
          Your team sees four patients. <em className="text-brand">HANA called two hundred.</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
      {/* LEFT — synced accordion */}
      <div>
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
                      open ? "text-brand" : "text-navy group-hover:text-brand"
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
    </div>
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
const COMPANION_ITEMS = [
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
    flags: true,
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
      setChapter(Math.min(2, Math.floor(f / COMPANION_CHAPTER_LEN)));
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
        <p className={`${eyebrow} text-brand mt-0 mb-4`}>For your patients</p>
        <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy m-0 max-w-[16ch]">
          The call your patient <em className="text-brand">actually picks up.</em>
        </h2>
      </motion.div>

      {/* Same arrangement as Compass above: accordion left, motion graphic right */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
        {/* RIGHT in source order, second column on screen — the motion graphic */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="order-2">
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
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }} className="order-1 border-t border-slate-200 self-start">
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
                      open ? "text-brand" : "text-navy group-hover:text-brand"
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
                      {"flags" in item && item.flags && (
                        <div className="flex flex-wrap gap-2 pb-6 pr-6">
                          {LANGS_IN_PRODUCTION.map((l) => (
                            <span
                              key={l.name}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[12.5px] text-slate-700"
                            >
                              <span aria-hidden>{l.flag}</span>
                              {l.name}
                            </span>
                          ))}
                          <span className="inline-flex items-center rounded-full bg-[#EFF3FF] text-brand px-2.5 py-1 text-[12.5px] font-semibold">
                            +21 more
                          </span>
                        </div>
                      )}
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















// ── §6b Our team ─────────────────────────────────────────────────────────────
// Pill badge, mission statement, CTA, overlapping oval portraits, three stats
// with pill captions.
//
// PROVENANCE: the mission statement, the roster and all three figures below came
// from Matteo directly (2026-08-16). "75 years combined" and "100+ peer reviewed
// publications" are HIS assertions about his own team, not derived from anything
// in this repo; "45+ care protocols" matches what the rest of the site claims.
// The "+20" chip is a headcount claim and should be checked before this ships.
//
// Roster is HANA's own people only. Oprandi, Katie Murphy and Lorri Hanes appear
// elsewhere on the site as CUSTOMERS and must never be listed here.
//
// PHOTOS: only Dr. Mohamed has one in /public/avatars. The rest render as
// monograms, which is a deliberate fallback. Archie's old portrait was hotlinked
// from ResearchGate and now 403s, so it isn't used.
type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  w: number;
  h: number;
  offset: number;
  z: number;
};

// Roster set 2026-08-25 (Matteo): Grassi, Archie, Sthita and Massimo, with real
// photographs to come — drop each into /public/avatars and fill `photo`. Until
// then the initials tiles render. Fakhrudin and Priyanka came off with this cut;
// one line each to restore. Massimiliano's surname and exact title need
// confirming with him before launch (brand doc: agree titles before a team page).
const TEAM: TeamMember[] = [
  { name: "Sthita Pujari", role: "Engineering & applied AI", photo: "/avatars/sthita.jpg", w: 98, h: 142, offset: 48, z: 1 },
  { name: "Archie Defillo, MD", role: "Neuroscience, sleep & behavioral health", photo: "/avatars/archie.jpg", w: 112, h: 164, offset: 18, z: 2 },
  { name: "Matteo Grassi", role: "Founder · behavioral psychologist", photo: "/avatars/matteo.jpg", w: 138, h: 202, offset: 0, z: 4 },
  { name: "Massimiliano", role: "Clinical psychologist · sleep", photo: "/avatars/massimo.jpg", w: 108, h: 156, offset: 26, z: 3 },
];

const TEAM_STATS = [
  { v: "75", l: "years of combined experience in medicine and clinical AI" },
  { v: "100+", l: "peer reviewed publications" },
  { v: "45+", l: "care protocols deployed" },
];

function initials(name: string) {
  return name
    .replace(/,.*$/, "")
    .split(" ")
    .filter((w) => !/^(MD|Dr\.?)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function TeamSection() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,50%)_minmax(0,1fr)] gap-14 lg:gap-8 items-center">
          {/* left: badge, mission, CTA */}
          <div>
            <motion.span
              {...fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full bg-navy pl-3.5 pr-4 py-2"
            >
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span className="text-[13px] font-medium text-white">Our team</span>
            </motion.span>

            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="font-serif font-normal text-[27px] sm:text-[32px] md:text-[36px] leading-[1.24] tracking-[-0.01em] text-navy mt-7 mb-0"
            >
              Our team of clinicians, AI researchers and care operators is united by one belief: the
              care that decides outcomes happens between visits, and it is lost for the most ordinary
              reason. <em className="text-brand">Nobody had the hours to call.</em>
            </motion.h2>

            <motion.a
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.12 }}
              href="/about"
              className="group inline-flex items-center gap-2 bg-brand text-white text-[15px] font-semibold pl-6 pr-5 py-3.5 rounded-full no-underline hover:opacity-90 transition-opacity mt-9"
            >
              About us
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
            </motion.a>
          </div>

          {/* right: overlapping oval portraits */}
          <div className="flex items-start justify-start lg:justify-end overflow-x-auto lg:overflow-visible pb-2 pt-2">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: m.offset, marginLeft: i === 0 ? 0 : -20, zIndex: m.z }}
                className="relative shrink-0"
                title={`${m.name} · ${m.role}`}
              >
                <div
                  style={{ width: m.w, height: m.h }}
                  className="relative rounded-full overflow-hidden bg-[#EFF3FF] ring-[5px] ring-white"
                >
                  <span
                    className="absolute inset-0 grid place-items-center font-serif text-brand"
                    style={{
                      fontSize: Math.round(m.w * 0.33),
                      background:
                        "radial-gradient(120% 90% at 30% 15%, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0) 62%), linear-gradient(160deg, #F4F7FF 0%, #E7EDFA 100%)",
                    }}
                  >
                    {initials(m.name)}
                  </span>
                  {m.photo && (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      /* the roster lists photos that are not in the repo yet;
                         until each lands, the initials tile shows instead of a
                         broken image */
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
              </motion.div>
            ))}

            {/* the wider team */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: 70, marginLeft: -20, zIndex: 0 }}
              className="relative shrink-0"
              title="Plus the wider team"
            >
              <div className="w-[78px] h-[112px] rounded-full ring-[5px] ring-white bg-navy grid place-items-center">
                <span className="font-serif text-[22px] text-white">+20</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mt-20 md:mt-24 max-w-[900px]">
          {TEAM_STATS.map((s, i) => (
            <motion.div key={s.l} {...fadeUp} transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}>
              <p className="font-serif text-[54px] md:text-[66px] leading-[0.9] text-navy m-0">{s.v}</p>
              <span className="inline-block mt-5 rounded-full bg-[#F1F4FA] px-4 py-2 text-[13px] leading-snug text-slate-600">
                {s.l}
              </span>
            </motion.div>
          ))}
        </div>
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
        Hana calls · <b className="text-navy">you set the protocol</b>
      </>
    ),
    body: "It calls from your number until someone picks up. Then medications, symptoms, and what changed.",
  },
  {
    n: "2",
    name: "Flag",
    role: (
      <>
        Hana routes · <b className="text-navy">your team decides</b>
      </>
    ),
    body: "Anything clinical goes to your team, with the reason and the transcript attached.",
  },
];

const LOOP_RIGHT: LoopStep[] = [
  {
    n: "3",
    name: "Document",
    role: (
      <>
        <b className="text-navy">Your clinician reviews</b> · Hana writes
      </>
    ),
    body: "The note is in the chart before your team opens it. Under that patient, not in a spreadsheet.",
  },
  {
    n: "4",
    name: "Bill",
    role: (
      <>
        <b className="text-navy">You submit</b> · Hana supplies the evidence
      </>
    ),
    body: "Every minute attributed to the person who earned it, ready to attest on the first.",
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
// The arithmetic under the loop. Published range for coordinator time per
// patient per month, the caseload it caps at, and where HANA is built to take it.
// Order matters: minutes, then caseload.
const LOOP_MATH = [
  {
    v: "45-60",
    suf: "min",
    label: "per patient, per month, today",
    body: "What a coordinator spends on one enrolled patient when the calling, the chasing and the note are all done by hand.",
  },
  {
    v: "120-160",
    suf: "",
    label: "the caseload that caps at",
    body: "Which is why most programs stall well short of what the panel could support.",
  },
  {
    v: "29",
    suf: "min",
    label: "what HANA is built for",
    body: "Same coordinator, same hours, toward 250 patients. HANA makes the calls; your team reviews and attests.",
  },
];

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
            <span className="text-[19px] font-bold tracking-[-0.01em] text-navy order-1">{step.name}</span>
            <span className="font-serif text-[44px] leading-none text-[#C9D6F2] order-2">{step.n}</span>
          </>
        ) : (
          <>
            <span className="font-serif text-[44px] leading-none text-[#C9D6F2]">{step.n}</span>
            <span className="text-[19px] font-bold tracking-[-0.01em] text-navy">{step.name}</span>
          </>
        )}
      </div>
      <p className="mt-2.5 mb-0 text-[10px] font-bold uppercase tracking-[1px] text-brand">{step.role}</p>
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
          <p className={`${eyebrow} text-brand mt-0 mb-6`}>How it works</p>
          <h2 className="font-serif font-normal text-[34px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-[-0.015em] text-navy m-0">
            Forty-five minutes a patient.
            <br />
            <em className="text-brand">We take it under thirty.</em>
          </h2>
          <p className="text-[17px] leading-[1.62] text-slate-600 max-w-[600px] mx-auto mt-6 mb-0">
            One coordinator. Same hours. Two hundred and fifty patients instead of a hundred and fifty.
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
                    <path d={LOOP_PATH} fill="none" stroke="var(--color-brand)" strokeWidth="4.6" opacity="0.9" strokeDasharray="120 1500" strokeLinecap="round">
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
                          <circle cx={node.cx} cy={node.cy} r="31" fill="none" stroke="var(--color-brand)" strokeWidth="2" opacity="0">
                            <animate attributeName="r" dur={LOOP_DUR} repeatCount="indefinite" values={`31;31;40;46;46`} keyTimes={keyTimes} />
                            <animate attributeName="opacity" dur={LOOP_DUR} repeatCount="indefinite" values="0;0;0.55;0;0" keyTimes={keyTimes} />
                          </circle>
                          {/* accent fill */}
                          <circle cx={node.cx} cy={node.cy} r="31" fill="var(--color-brand)" opacity="0">
                            <animate attributeName="opacity" dur={LOOP_DUR} repeatCount="indefinite" values="0;0;1;0;0" keyTimes={keyTimes} />
                          </circle>
                        </>
                      )}
                      <g
                        fill="none"
                        stroke="var(--color-navy)"
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
                            values="#00122F;#00122F;#FFFFFF;#00122F;#00122F"
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
          every clinical flag, an audit trail on every call, minutes totalled per patient.
        </motion.p>

        {/* The arithmetic, folded in here rather than given its own section
            (Matteo 2026-08-25). Minutes first and caseload second, never caseload
            alone, because a competitor already claims 250. */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 md:mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center"
        >
          {LOOP_MATH.map((m) => (
            <div key={m.label}>
              <p className="font-serif font-normal text-[44px] md:text-[54px] leading-none text-navy m-0">
                {m.v}
                <span className="text-brand text-[0.4em] align-super ml-1">{m.suf}</span>
              </p>
              <p className="text-[15px] font-semibold text-navy mt-4 mb-1.5">{m.label}</p>
              <p className="text-[14px] leading-[1.6] text-slate-600 m-0 max-w-[30ch] mx-auto">{m.body}</p>
            </div>
          ))}
        </motion.div>

        {/* The human step. The brief says this one never gets cut for length. */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-[17px] leading-[1.6] text-navy mt-12 mb-0 max-w-[62ch] mx-auto text-center"
        >
          Your team reviews it. Your provider signs it.{" "}
          <b className="font-semibold">Nothing is billed until a person on your team approves it.</b>
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
//   - "AI care coordination" keeps the category noun away from "software", and
//     drops "agentic" (deprecated in the brand architecture, and the Site Build
//     Brief is explicit that the behaviour goes on the site and the label does
//     not). Matteo 2026-08-25: the AI has to stay visible, only the buzzword goes.

const CMP_OUTSOURCED_POINTS = [
  "They do the calling. You pay for their hours.",
  "Capacity capped by whoever they can hire",
  "Notes handed back to you, not written in your chart",
  "From January, Medicare may not pay you back for them",
];

const CMP_HANA_POINTS = [
  "It dials, it listens, it writes the note",
  "Every patient, every month, in 30+ languages",
  "The note lands in your chart, ready to sign",
  "Not clinical staff, so the proposed CY2027 rule leaves it standing",
];

function WhatIsHanaCompare() {
  return (
    <section className="bg-white py-28 md:py-36 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        {/* Retell-style header: heading left, one-liner right */}
        <motion.div {...fadeUp} className="md:flex md:items-start md:justify-between md:gap-12 mb-10 md:mb-14">
          <h2 className="font-serif font-normal text-[36px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.015em] text-[#00122F] m-0">
            Three ways to run care management.
            <br />
            <em className="text-[#5b76d9]">One of them makes the calls.</em>
          </h2>
          {/* The "only one of them actually picks up the phone" one-liner came out
              here (Matteo 2026-08-25): the HANA card's first bullet already says
              it, so the header was making the point twice. */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — sparse (reference: IVR card): name mid-card, one line at bottom */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-xl bg-[#f6f7fb] p-8 md:p-9 flex flex-col md:min-h-[620px]"
          >
            <p className="text-[13px] font-semibold text-[#00122F] m-0">One way</p>
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
            <p className="text-[13px] font-semibold text-[#00122F] m-0">Another way</p>
            <div className="h-10 md:h-[220px]" aria-hidden />
            <h3 className="font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] text-[#00122F] m-0">
              Outsourced care management
            </h3>
            <p className="text-[16px] leading-[1.5] text-[#00122F] mt-6 mb-0">
              Based on contracted staff and staffing agencies
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
            <p className="text-[13px] font-semibold text-white m-0">Our way</p>
            <div className="h-10 md:h-[220px]" aria-hidden />
            <h3 className="font-serif font-normal text-[26px] md:text-[28px] leading-[1.2] text-white m-0">
              AI care coordination
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

        {/* The "only one that does the calling" line came out 2026-09-02: the
            headline says it now, and the cards prove it. This is the keeper. */}
        <motion.p {...fadeUp} className="text-[15px] leading-[1.6] text-slate-600 text-center mt-10 mb-0 max-w-[62ch] mx-auto">
          Your team keeps the relationship, the judgment and the signature. HANA does the dialing.
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
// The three clinicians in the headline. Order is left to right; `pos` is the
// crop focus once the real photo lands.
const BUILT_BY_FACES = [
  { src: "/avatars/archie.jpg", pos: "50% 25%" },
  { src: "/avatars/fakhrudin.png", pos: "50% 20%" },
  { src: "/avatars/matteo.jpg", pos: "50% 25%" },
];

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
            {/* Three overlapping faces (Matteo 2026-08-25, mock A "recommended"):
                the claim and its proof in the same line. Round crops, tight
                overlap, sized to the cap height so the line still reads as type.
                Each circle carries a drawn silhouette and, layered over it, a
                photo that appears when its file lands in /public/avatars —
                fakhrudin.png exists today, archie.jpg and matteo.jpg are pending
                (same lazy-photo pattern as the team section). */}
            <motion.span
              aria-hidden
              style={{ scale: chipScale, opacity }}
              className="relative inline-flex items-center shrink-0 h-[1.06em]"
            >
              {BUILT_BY_FACES.map((f, i) => (
                <span
                  key={f.src}
                  className="relative inline-block w-[1.06em] h-[1.06em] rounded-full overflow-hidden ring-[0.045em] ring-white shadow-[0_10px_30px_rgba(0,18,47,0.20)]"
                  style={{ marginLeft: i === 0 ? 0 : "-0.38em", zIndex: 3 - i, background: "#DFE8F8" }}
                >
                  {/* the silhouette, always there */}
                  <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                    <circle cx="20" cy="15" r="7" fill="#8FA8D8" />
                    <path d="M6 38c1.8-8.3 7.4-12.5 14-12.5S32.2 29.7 34 38Z" fill="#8FA8D8" />
                  </svg>
                  {/* the photo, when its file exists */}
                  <img
                    src={f.src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: f.pos }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </span>
              ))}
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




// ── §10 Sleep / CPAP recovery calculator (unchanged; fate still OPEN) ─────────



// ── §12 Audit-proof section (unchanged from live page) ───────────────────────



// ── Shared bits (unchanged from live page) ───────────────────────────────────


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
    <div className="serif-display bg-white text-[#00122F] font-sans overflow-x-hidden">
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
      <section className="bg-white text-navy py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <CompassShowcase />
        </div>
      </section>

      {/* §7 BUILT BY CLINICIANS — giant inline-image statement. Sits between the
          two product views (Matteo 2026-08-20): Compass is what your team gets,
          the statement, then what the patient gets. */}
      <BuiltByClinicians />

      {/* §8 THE PATIENT COMPANION — the patient's side (Retell accordion pattern
          + Remotion, twin of §8 Compass; replaced PatientAgentSection, which is
          kept below for revert) */}
      <section className="bg-white py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <CompanionShowcase />
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
      <section className="bg-white pt-24 md:pt-32 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <motion.div {...fadeUp} className="text-center">
            <p className={`${eyebrow} text-brand mt-0 mb-4`}>Integrations</p>
            <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy mx-auto max-w-[24ch] m-0">
              It lands in the chart <em className="text-brand">you already use.</em>
            </h2>
            <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[54ch] mx-auto mt-5 mb-0">
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

      {/* §16b2 FROM THE BLOG and ASK AI — imported from Home as-is
          (Matteo 2026-08-20), in Home's order: the three most recent posts, then
          the ask-AI box, then the closing CTA. */}
      <LatestPosts />

      <AskAiAboutUs className="py-12 md:py-16" />

      {/* §16c CTA */}
      <section className="bg-white text-navy py-28 md:py-32 px-6 md:px-16 text-center relative overflow-hidden">
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
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy bg-white border border-slate-200 rounded-full px-3.5 py-1.5">
                <Check className="w-3.5 h-3.5 text-brand" strokeWidth={3} /> {t}
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
