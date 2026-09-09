import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { SonicDemoSection } from "../components/sections/SonicDemoSection";
import type { WebCallProps } from "../components/templates/ProgrammePage";
import { ProgrammeFilter } from "../components/sections/ProgrammeFilter";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";

/**
 * /programs — the hub.
 *
 * NOT a programme page and deliberately not built on ProgrammePage. A programme
 * page answers "should I run this one". The hub answers a different question:
 * "which of these is my patient", which is the single most confusing thing about
 * the category and the reason this page exists at all.
 *
 * So the order is different too (rewritten 9 Sept 2026 -- the chooser, the card
 * grid and the code table collapsed into ProgrammeFilter, see that file):
 *   1. The filter, first. It is the job: describe the patient, the fitting
 *      programmes stay lit. With nothing toggled it is the card grid, and every
 *      card carries its code family, so it is the comparison too.
 *   2. The loop, because the month is the same shape whichever one you bill.
 *
 * NO REVENUE ESTIMATOR HERE. It is locked per programme on the programme pages,
 * and an unlocked seven-way version on the hub invites comparing programmes by
 * their rate, which is the wrong basis: a patient qualifies for one or another,
 * they are not alternatives you pick by price.
 *
 * NOINDEX for now, because it links to seven pages that are themselves noindex
 * pending their open questions. Publishing the hub before them would strand a
 * crawler on seven dead ends. All eight move together.
 */

const COPY = {
  title: "The care programmes you are already eligible to bill",
  description:
    "Chronic care management, advanced primary care management, behavioral health integration, and remote therapeutic and physiologic monitoring. Which one fits a patient, what each pays, and what your team still does.",
};

const HUB_FAQS = [
  {
    q: "Which programme should we start with?",
    a: "Whichever fits the patients you already have. The chooser above asks three questions and lands on one. Most practices start with chronic care management because the eligibility is the widest, but that is a fact about panels, not a recommendation.",
  },
  {
    q: "Can a patient be on more than one?",
    a: "Often, and the filter above works it out for you: describe the patient and it shows the largest sets CMS lets a practice bill in the same month, with the combined figure. Advanced primary care management cannot share a month with chronic care management, principal care management or transitional care management, and remote physiologic and remote therapeutic monitoring cannot share one either. Two pairs we have not found a ruling on are marked unsettled rather than guessed. The same minutes never count toward two codes, and a stack is what may be billed, not what a given patient qualifies for.",
  },
  {
    q: "Do we need different staff for each one?",
    a: "No. It is the same loop every month: reach the patient, flag what matters, write it up, bill it. What changes is who qualifies and what the month has to show. HANA makes the calls and writes them up in every one of them, and your team reviews and attests in every one of them.",
  },
  {
    q: "Is HANA billing these on our behalf?",
    a: "No. They are your patients and it is your claim. HANA supplies the reach and the documentation, your team supplies the clinical judgement and the attestation, and nothing bills until a person on your team approves it.",
  },
  {
    q: "What about remote patient monitoring?",
    a: "It has its own page now, and it says the thing you would want it to say: RPM turns on a device recording a physiologic reading, and HANA is never the device. What HANA does is the other half, the live interactive communication the treatment-management codes require. The device stays yours.",
  },
];

export function Programs(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs"
        useExactTitle
        robots="noindex, nofollow"
        keywords="Medicare care management programs, CCM, APCM, BHI, RTM, chronic care management, care coordination billing"
        jsonLd={[
          breadcrumbSchema([{ name: "Programs", url: "https://www.hana.health/programs" }]),
          faqSchema(HUB_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* The homepage opener, on the hub. Matteo, 9 Sept 2026: "need the hero
          to be better I think could be like the current homepage in
          hana.health" -- so tone="orbs", which is that hero (navy, three
          drifting orbs, a badge, a sky accent) generalised into Hero rather
          than copied. Centred and imageless, per the note before it: the
          programme pages draw their own rule in the hero, and the hub has no
          single rule to draw. */}
      <Hero
        tone="orbs"
        eyebrow="Seven Medicare programmes"
        headline={<>One loop. <em>Seven ways to bill it.</em></>}
        body="Your patients already qualify for more than you are running. The difference between these programmes is who counts and what the month has to show, not how the work gets done."
        primaryCta={{ label: "Book a demo", href: DEMO_HREF }}
        secondaryCta={{ label: "Which fits my patient?", href: "#codes" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* ONE SECTION WHERE THERE WERE THREE. The three-question chooser
          (1,668px, 450 words), the static card grid (1,621px) and the seven-way
          code table (2,539px, 1,109 words) all answered "which programme is
          this patient" -- one by asking, one by listing, one by tabulating. The
          filter does it by pointing: describe the patient, the fitting
          programmes stay lit, and with nothing toggled it IS the card grid. The
          hero's "Compare the codes" anchor still lands here (#codes). */}
      <ProgrammeFilter id="codes" />

      {/* The month is the same shape whichever one you bill. */}
      <HowItWorksLoop id="how-it-works" />

      <FaqSection
        items={HUB_FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>pick one.</em></>}
      />

      {/* High intent: a reader on the hub has decided the category and is
          picking inside it. That is the moment to let them hear it. */}
      <SonicDemoSection {...webCall} />

      <CtaBand
        heading={<>Not sure which fits your panel? <em>Ask us.</em></>}
        body="Bring your panel numbers. We will go through which programmes your patients already qualify for, and what your team would still do."
        buttons={[
          { label: "Book a demo", href: DEMO_HREF },
          { label: "Talk to us", href: "/contact", variant: "ghost" },
        ]}
        reassurances={[
          "Your patients, your claim",
          "Your team reviews and attests",
          "Nothing bills until a person approves",
        ]}
      />

      <Footer />
    </div>
  );
}

export default Programs;
