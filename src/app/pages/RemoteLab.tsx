import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import { SEO } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
// Both of these graduated out of this file and onto /remote-v2 on 2026-08-19.
// They stay mounted here so a variant can still be compared against them.
import { PROGRAMS, PROGRAM_FOOTNOTE, ProgramsStack } from "../components/lab/ProgramsStack";
import { SleepBand } from "../components/lab/SleepBand";
import {
  DemoSonicHeroForm,
  DemoSonicHeroFormInk,
  DemoSonicHeroFormNavy,
  DemoWithSiriRibbons,
  DemoWithSonicLines,
  DemoWithSiriRadial,
  DemoWithSiriOrb,
  DemoWithSiriHalo,
  DemoWithWaveform,
  DemoWithPhone,
  DemoWithPulse,
  DemoWithCaptions,
} from "../components/lab/demo-variants";
import { SleepTwoProducts } from "../components/lab/SleepTwoProducts";
// Interactive block experiments (2026-09-05). The rule for all of them: one
// input, one number, the arithmetic visible, and a default state that is true
// before anyone touches it — because the prerender snapshot is what gets read.
import { CaseloadSlider } from "../components/lab/interactive/CaseloadSlider";
import { EligibilityGap } from "../components/lab/interactive/EligibilityGap";
import { RevenueEstimator } from "../components/lab/interactive/RevenueEstimator";
import { ProgrammeChooser } from "../components/lab/interactive/ProgrammeChooser";

/**
 * /remote-lab — a design sandbox for /remote-v2 sections.
 *
 * Unlinked and noindex, like /preview, but dedicated to Remote so variants can
 * pile up without disturbing anything else. Each variant sits under a label bar.
 * Open /remote-v2 in another tab to compare against what is currently shipped.
 *
 * Two sections of /remote-v2 are in play here (Matteo, 2026-08-19):
 *   §1 the workflow marquee, which becomes a PROGRAM deck: CCM, APCM, BHI, RTM.
 *      Variants A and B below. Program rules are fact-checked at PROGRAMS.
 *   §8+§9 Compass and the patient companion, collapsed from two tall accordion
 *      sections into one two-card section (TwoSidesCards).
 *   §2 the HANA Sleep card, reframed from "before you open the chart" to
 *      "before you start your time", i.e. the time log. Variant C below;
 *      variants A and B are the earlier passes at giving it clinical substance.
 *
 * FACT CHECK (verified 2026-08-16): Medicare's PAP adherence requirement is at
 * least 4 hours a night on at least 70% of nights (21 of 30) across a single
 * consecutive 30-day window inside the first 90 days of therapy, AND a follow-up
 * visit with the treating physician inside that same window. Both are needed;
 * missing either can end coverage. Sources handed to Matteo in chat.
 *
 * The quit reasons in variant A are the well-documented causes of PAP
 * abandonment in sleep medicine, not HANA data. Note where the boundary sits:
 * HANA coaches comfort and behaviour, and ROUTES anything requiring a pressure
 * or prescription change to the clinician. It never changes therapy.
 */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

function LabBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0A1633] px-6 md:px-16 py-3">
      <p className="max-w-[1200px] mx-auto text-[12px] font-bold uppercase tracking-[1.6px] text-[#8AB4FF] m-0">
        {children}
      </p>
    </div>
  );
}

/* ── Sleep variant A — the reasons people quit ─────────────────────────────── */
const QUIT_REASONS = [
  {
    problem: "The mask leaks, or it hurts",
    hana: "HANA hears “it felt too tight” and coaches a reseat, one notch looser, then checks the next night. Twice in a row and it flags a refit.",
    owner: "HANA coaches",
  },
  {
    problem: "Dry mouth, blocked nose",
    hana: "Asks about humidity and mouth leak, and flags your DME when the humidifier or a chin strap needs changing.",
    owner: "HANA flags",
  },
  {
    problem: "It feels claustrophobic",
    hana: "Walks the patient through desensitisation on the phone: mask on while awake, then with the air on, then at bedtime.",
    owner: "HANA coaches",
  },
  {
    problem: "Air in the stomach, pressure feels wrong",
    hana: "Captured in the patient's own words and routed to your sleep clinician. Pressure changes are theirs to make, never HANA's.",
    owner: "Escalates",
  },
  {
    problem: "The partner can't sleep through it",
    hana: "Checks for leak noise and sleeping position, and flags a mask style change to the clinic.",
    owner: "HANA flags",
  },
  {
    problem: "Travel, a cold, or simply forgetting",
    hana: "Sees the gap in the nightly data and calls about it that week, instead of it surfacing in the 90-day report.",
    owner: "HANA calls",
  },
];

/* ── Sleep variant B — the 90-day clock ───────────────────────────────────── */
const CLOCK = [
  {
    when: "Day 0",
    title: "Setup",
    body: "Device delivered, patient trained, and the 90-day clock starts whether anyone is watching it or not.",
    accent: "#2563EB",
  },
  {
    when: "Days 1 – 7",
    title: "Where most patients are lost",
    body: "Discomfort decides everything this week. HANA calls into it, nightly at first, because a strap fixed on night two is a compliant patient on day ninety.",
    accent: "#E2703A",
  },
  {
    when: "Any 30 consecutive days",
    title: "21 of 30 nights, 4 hours or more",
    body: "That is the window Medicare actually scores. HANA tracks the running count and calls when the week starts slipping, while there is still time to recover it.",
    accent: "#2563EB",
  },
  {
    when: "Inside the same 90 days",
    title: "The follow-up visit",
    body: "Adherence alone is not enough: the patient also has to be seen by the treating physician in that window. HANA books it and confirms they show up.",
    accent: "#4F46E5",
  },
  {
    when: "Day 90",
    title: "The coverage decision",
    body: "Compliant, and the device is covered and resupply begins. Not compliant, and the machine can be recalled and the reimbursement is gone.",
    accent: "#0A1633",
  },
];

function SleepNinetyDayClock() {
  return (
    <section className="bg-[#f6f7fb] py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-[#0A1633] pl-3.5 pr-4 py-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="text-[13px] font-medium text-white">HANA Sleep</span>
          </span>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mt-7 mb-0 mx-auto max-w-[24ch]">
            Every new CPAP patient is on a <em className="text-[#2563EB]">ninety day clock.</em>
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-slate-600 mt-5 mb-0 mx-auto max-w-[62ch]">
            Medicare wants four hours a night on twenty-one of thirty consecutive nights, inside the
            first ninety days, plus a follow-up visit in the same window. Miss either and coverage
            can end.
          </p>
        </motion.div>

        <div className="relative mt-14 md:mt-16">
          {/* the rail */}
          <span aria-hidden className="hidden lg:block absolute left-0 right-0 top-[13px] border-t-2 border-dashed border-slate-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-5">
            {CLOCK.map((c, i) => (
              <motion.div
                key={c.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="hidden lg:block w-[26px] h-[26px] rounded-full border-[5px] bg-white relative z-10"
                  style={{ borderColor: c.accent }}
                />
                <p
                  className="text-[11.5px] font-bold uppercase tracking-[1.2px] mt-5 mb-0 lg:mt-6"
                  style={{ color: c.accent }}
                >
                  {c.when}
                </p>
                <p className="font-serif text-[21px] leading-[1.22] text-[#0A1633] mt-2.5 mb-0">{c.title}</p>
                <p className="text-[14px] leading-[1.6] text-slate-600 mt-3 mb-0">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp} className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href="/hana-sleep"
            className="group inline-flex items-center gap-2 bg-[#0A1633] text-white text-[15px] font-semibold pl-6 pr-5 py-3.5 rounded-full no-underline hover:opacity-90 transition-opacity"
          >
            See HANA Sleep
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
          </a>
          <p className="text-[13px] text-slate-500 m-0 max-w-[52ch]">
            Non-adherence runs at about 22% on programme. Between 46 and 83 percent of new patients
            miss the threshold without one.
          </p>
        </motion.div>
      </div>
    </section>
  );
}







/* ── §8 + §9 as one two-card section ──────────────────────────────────────────
 * Matteo, 2026-08-19: he likes the sleep pair (variant D), so give Compass and
 * the patient companion the same treatment. Those two are currently a tall
 * accordion-plus-Remotion section each; here they collapse into one section with
 * one card apiece, and each card carries the single artefact that makes its
 * point instead of four accordion rows.
 *   · Compass  → the flagged worklist. The point is what your team does NOT see.
 *   · Companion → the two dated notes, the second quoting the first. The point
 *     is continuity, which is the item Matteo's own copy calls worth more than
 *     any new enrollment.
 * Copy is lifted from the approved COMPASS_ITEMS / COMPANION_ITEMS on
 * /remote-v2, condensed. "Dr. Reyes" is dropped from the worklist: it is a
 * fictional name and this is a public preview, so the escalation row just says
 * Escalated.
 */
const WORKLIST = [
  { who: "James T.", prog: "CCM", status: "Reviewed", state: "done" as const },
  { who: "Maria R.", prog: "RTM · Sleep", status: "Escalated", state: "flag" as const },
  { who: "Dorothy K.", prog: "BHI", status: "Reviewed", state: "done" as const },
  { who: "Albert N.", prog: "CCM", status: "No concern", state: "quiet" as const },
];

/* ── §8 + §9, corrected for hierarchy ─────────────────────────────────────────
 * Matteo, 2026-08-19: two peer cards with two product badges made Compass look
 * like a product sitting next to Remote. It isn't. Remote is the product; HANA
 * makes the call, Compass is where your team reviews it, and the companion is
 * what the patient experiences. So this is ONE card with one product name at the
 * top and two panes inside it, divided by a hairline. Same artefacts, right
 * hierarchy: nothing here reads as a second thing to buy.
 */
function RemoteBothSides() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1240px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>HANA Remote</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            One month. <em className="text-[#2563EB]">Both sides of it.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-slate-600 max-w-[56ch] mx-auto mt-5 mb-0">
            HANA makes the call. Your team reviews it in Compass, and the patient gets somebody who
            remembers. Same month, same call, seen from each end.
          </p>
        </motion.div>

        {/* one card, one product, two panes */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="relative mt-12 md:mt-14 rounded-[28px] overflow-hidden bg-[#0A1633]"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 12% 0%, rgba(37,99,235,0.30) 0%, rgba(37,99,235,0) 60%), radial-gradient(60% 55% at 92% 100%, rgba(245,158,66,0.16) 0%, rgba(245,158,66,0) 60%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-white/12">
            {/* pane 1 — what your team sees */}
            <div className="p-8 md:p-10 flex flex-col border-b border-white/12 lg:border-b-0">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B93FF]" />
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-white/70 m-0">
                  What your team sees · Compass
                </p>
              </div>

              <div className="mt-7 rounded-[18px] bg-[#050C1A]/55 border border-white/12 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-white/65 m-0">
                    Flagged worklist
                  </p>
                  <p className="text-[11px] text-white/55 m-0">August · 214 patients</p>
                </div>

                <div className="mt-4 space-y-2">
                  {WORKLIST.map((r, i) => (
                    <motion.div
                      key={r.who}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.22 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex items-center gap-3 rounded-[12px] px-3.5 py-3 border ${
                        r.state === "flag"
                          ? "bg-[#E8A06A]/[0.18] border-[#E8A06A]/45"
                          : "bg-white/[0.06] border-white/10"
                      }`}
                    >
                      <span className="w-7 h-7 shrink-0 rounded-full bg-white/15 border border-white/15 grid place-items-center text-[10.5px] font-bold text-white/85">
                        {r.who.split(" ").map((w) => w[0]).join("")}
                      </span>
                      <span className="text-[13px] font-semibold text-white flex-1 min-w-0 truncate">{r.who}</span>
                      <span className="text-[11.5px] text-white/55 shrink-0 hidden sm:block">{r.prog}</span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[0.7px] shrink-0 ${
                          r.state === "flag" ? "text-[#F5B77E]" : r.state === "done" ? "text-[#7BE0A8]" : "text-white/45"
                        }`}
                      >
                        {r.status}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[11.5px] leading-[1.5] text-white/55 mt-4 mb-0 pt-4 border-t border-white/12">
                  210 check-ins completed this month are not on this list. That is the point of it.
                </p>
              </div>

              <h3 className="font-serif font-normal text-[25px] md:text-[28px] leading-[1.15] text-white mt-8 mb-0 max-w-[22ch]">
                The flags, not the phone queue.
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-white/75 mt-4 mb-0 max-w-[46ch]">
                Every check-in is scored against the protocol your clinicians set. Only the flags
                surface, each with the call's full context and a named owner, next to the month's
                documentation and the minutes attributed to the clinician who did the work.
              </p>

              <div className="mt-auto pt-7 flex flex-wrap gap-2">
                {["Worklist", "Billing review", "Audit trail"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/[0.10] border border-white/15 text-white/80 text-[11.5px] font-semibold px-2.5 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* pane 2 — what your patient gets */}
            <div className="p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A06A]" />
                <p className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-white/70 m-0">
                  What your patient gets · the call
                </p>
              </div>

              <div className="mt-7 space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[16px] bg-white/[0.07] border border-white/12 p-5"
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-[1.3px] text-white/50 m-0">March 12</p>
                  <p className="text-[13.5px] leading-[1.6] text-white/85 mt-2.5 mb-0">
                    Reported ankle swelling in the evenings. Skipping the water tablet on days she
                    goes out.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[16px] bg-white/[0.12] backdrop-blur-xl border border-white/20 p-5"
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-[1.3px] text-white/55 m-0">April 9</p>
                  <p className="text-[12.5px] italic leading-[1.55] text-[#9EC1FF] mt-2.5 mb-0 pl-3 border-l-2 border-[#5B93FF]/60">
                    "Skipping the water tablet on days she goes out"
                  </p>
                  <p className="text-[13.5px] leading-[1.6] text-white mt-3 mb-0">
                    "Last month you mentioned missing the tablet when you're out. Has that gotten any
                    easier?"
                  </p>
                </motion.div>
              </div>

              <h3 className="font-serif font-normal text-[25px] md:text-[28px] leading-[1.15] text-white mt-8 mb-0 max-w-[22ch]">
                It calls back next month, and it remembers.
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-white/75 mt-4 mb-0 max-w-[46ch]">
                Calls go out with your practice's name, at the hours the patient is actually free,
                and they finish rather than start. Most patients drift out of a program within a few
                months, and continuity is what keeps them in.
              </p>

              <div className="mt-auto pt-7 flex flex-wrap gap-2">
                {["Your caller ID", "Evenings and Saturdays", "30+ languages"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/[0.10] border border-white/15 text-white/80 text-[11.5px] font-semibold px-2.5 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p {...fadeUp} className="text-[13px] leading-[1.7] text-slate-600 mt-6 mb-0 max-w-[86ch]">
          HANA scores against a threshold your clinician set and routes what crosses it. The decision
          and the attestation are always a person's, and HANA's call time is never billed as clinical
          time.
        </motion.p>
      </div>
    </section>
  );
}

/* ── HANA Sleep as a cross-sell, not a feature section ────────────────────────
 * Matteo, 2026-08-19: Sleep is a different product, so it should not occupy a
 * full section on a Remote page as though it were part of it. This is the band
 * version: one line of context, the two Sleep products as two rows you can
 * click, and one link out. Roughly a third of the height of variant D, and it
 * reads as "there is also this" rather than "this is what you are buying".
 * Both product descriptions come off the live /hana-sleep pages.
 */
const SLEEP_PRODUCTS = [
  {
    name: "HANA Sleep Analysis",
    line: "Reads the hypnogram any wearable or home sleep test already records, against the patient's own baseline.",
    href: "/hana-sleep/analysis",
  },
  {
    name: "CPAP Adherence Program",
    line: "Calls new CPAP patients through the ninety days that decide whether therapy holds, and documents each follow-up.",
    href: "/hana-sleep/cpap",
  },
];


export function RemoteLab() {
  return (
    <>
      <SEO title="Remote lab" useExactTitle path="/remote-lab" robots="noindex, nofollow" />

      <div className="bg-white px-6 md:px-16 pt-16 pb-10">
        <div className="max-w-[1200px] mx-auto">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Design lab</p>
          <h1 className="font-serif font-normal text-[34px] md:text-[44px] leading-[1.08] text-[#0A1633] m-0 max-w-[24ch]">
            Section variants for HANA Remote.
          </h1>
          <p className="text-[16px] leading-[1.7] text-slate-600 mt-5 mb-0 max-w-[62ch]">
            Unlinked and noindex. Open <span className="font-semibold text-[#0A1633]">/remote-v2</span>{" "}
            alongside this to compare against what is shipped. Nothing here is live.
          </p>
        </div>
      </div>

      {/* Same section, same form. Only the left panel changes. */}
      {/* ── Interactive blocks, newest first so they are the first thing seen ──
          Ship order per the design review: Caseload is the reference and the
          only one fully obeying the brief; Gap and Estimator need trimming;
          the Chooser is a decision tree rather than a calculator and wants
          re-framing. BillTogetherMatrix was built and cut: four of its six
          pairs answered "unsettled", so the modal outcome taught the visitor
          that the site does not know things. Its one real fact (CCM and APCM
          cannot be billed in the same month) belongs in the Chooser footnote. */}
      <LabBar>Interactive · 1 — caseload math. Minutes lead, caseload follows</LabBar>
      <CaseloadSlider />

      <LabBar>Interactive · 2 — the eligibility gap (third-party market figures)</LabBar>
      <EligibilityGap />

      <LabBar>Interactive · 3 — revenue estimator (BLOCKED: needs real CMS rates)</LabBar>
      <RevenueEstimator />

      <LabBar>Interactive · 4 — which program is this patient? (needs biller sign-off)</LabBar>
      <ProgrammeChooser />

      <LabBar>§4 Live demo · 10a — same section, white ground, periwinkle waves</LabBar>
      <DemoSonicHeroForm />

      <LabBar>§4 Live demo · 10b — same section, neutral near-black ground, no blue in it</LabBar>
      <DemoSonicHeroFormInk />

      <LabBar>§4 Live demo · 10c — the navy one you saw first, for comparison</LabBar>
      <DemoSonicHeroFormNavy />

      <LabBar>§4 Left panel · 8 — Siri ribbons, coloured waves crossing the panel</LabBar>
      <DemoWithSiriRibbons />

      <LabBar>§4 Left panel · 9 — a central node with the waveform running through it</LabBar>
      <DemoWithSonicLines />

      <LabBar>§4 Left panel · 5 — Siri-style radial waveform (bars around a ring)</LabBar>
      <DemoWithSiriRadial />

      <LabBar>§4 Left panel · 6 — Siri-style liquid orb (colour drifting under glass)</LabBar>
      <DemoWithSiriOrb />

      <LabBar>§4 Left panel · 7 — Siri-style halo (conic gradient turning on a ring)</LabBar>
      <DemoWithSiriHalo />

      <LabBar>§4 Left panel · 1 — the waveform, with the line being spoken</LabBar>
      <DemoWithWaveform />

      <LabBar>§4 Left panel · 2 — the patient's phone, captions arriving</LabBar>
      <DemoWithPhone />

      <LabBar>§4 Left panel · 3 — pulse rings (a straight swap for the orb, no audio)</LabBar>
      <DemoWithPulse />

      <LabBar>§4 Left panel · 4 — no graphic, the conversation in large type</LabBar>
      <DemoWithCaptions />

      <LabBar>§8 + §9 — one card, one product, two panes (hierarchy fixed)</LabBar>
      <RemoteBothSides />

      <LabBar>§2 Sleep — the band that shipped (photo + New label)</LabBar>
      <SleepBand />

      <LabBar>§2 Sleep · variant D — the two cards HANA Sleep actually has</LabBar>
      <SleepTwoProducts />

      <LabBar>§1 Programs · variant B — the stack a clinician can scan</LabBar>
      <ProgramsStack />

      <LabBar>§2 Sleep · variant B — the ninety day clock</LabBar>
      <SleepNinetyDayClock />

      <Footer />
    </>
  );
}

export default RemoteLab;
