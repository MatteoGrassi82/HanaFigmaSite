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
 * PUBLISHED 7 Oct 2026 with the four programme pages it links to: CCM, APCM,
 * BHI and PCM. RPM, RTM and TCM are parked (see the content module's header)
 * and their URLs redirect here. The hub and its pages move together.
 */

const COPY = {
  title: "The Medicare care programs your practice can already bill",
  description:
    "Chronic care management, advanced primary care management, behavioral health integration and principal care management. Which one fits a patient, what each pays, and what your team still does.",
};

const HUB_FAQS = [
  {
    q: "Which programme should we start with?",
    a: "Whichever fits the patients you already have. Describe a patient in the filter above and the programmes they could be considered for stay lit. Chronic care management has the widest eligibility, and advanced primary care management counts no minutes at all, but that is a fact about panels, not a recommendation.",
  },
  {
    q: "Can a patient be on more than one?",
    a: "Often, and the filter above works it out for you: describe the patient and it shows the sets CMS lets a practice bill in the same month, with the combined figure. Behavioral health integration can run alongside chronic care management or advanced primary care management. Most of the other limits are about the practitioner, not the patient: the practitioner billing advanced primary care management cannot also bill chronic or principal care management that month, and one practitioner cannot bill both chronic and principal care management, though a specialist can bill PCM for a different condition while the primary care practice bills CCM. The same minutes never count toward two codes.",
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
    a: "Not today. Remote physiologic and therapeutic monitoring turn on a device recording readings at home, and HANA does not supply devices. The four programmes on this page need none.",
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
        keywords="Medicare care management programs, CCM, APCM, BHI, PCM, chronic care management, care coordination billing"
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
        eyebrow="Four Medicare programs"
        headline={<>One loop. <em>Four ways to bill it.</em></>}
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
