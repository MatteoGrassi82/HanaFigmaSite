import { SEO, breadcrumbSchema, faqSchema } from "../../components/SEO";
import { Footer } from "../../components/layout/Footer";
import { Hero } from "../../components/sections/Hero";
import { WhatIsHanaCompare } from "../../components/sections/WhatIsHanaCompare";
import { HowItWorksLoop } from "../../components/sections/HowItWorksLoop";
import { MonthWrittenUp } from "../../components/sections/MonthWrittenUp";
import { SonicDemoSection } from "../../components/sections/SonicDemoSection";
import type { WebCallProps } from "../../components/templates/ProgrammePage";
import { FaqSection } from "../../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../../components/sections/CtaBand";

/**
 * /compare/vs-care-management-software
 *
 * THE ARGUMENT: care management software is a system of record for work a
 * person still has to do. It tracks the minutes, holds the care plan and
 * assembles the claim, and every one of those is downstream of somebody having
 * dialled. HANA is the dialling. That is the whole comparison, and it is a
 * category distinction rather than a feature list, so the page stays short.
 *
 * NEVER NAME A COMPANY. Not in copy, not in a meta tag, not in JSON-LD, not in
 * a code comment that could be read aloud in a demo. The category noun is
 * "care management software" and it stays generic. This is not squeamishness:
 * there is a live commercial conversation with a company that would read a
 * named comparison as being about them, and a comparison page is the single
 * easiest thing to screenshot.
 *
 * NO SIDE-BY-SIDE FEATURE MATRIX, for the same reason. A checkbox grid is a
 * claim about somebody else's product that we cannot keep current and did not
 * verify. Two columns describing two categories is defensible; a fourteen-row
 * matrix with somebody's name on it is not.
 *
 * PROOF IS THIRD-PARTY ONLY. There are no figures on this page at all, which
 * is the honest version: the difference here is not a number.
 *
 * NOINDEX with the /programs routes it links into.
 */

const COPY = {
  title: "HANA compared with care management software",
  description:
    "Care management software tracks the minutes, holds the care plan and assembles the claim. Someone on your team still has to make the call. HANA makes the call and writes the note.",
};

const COLUMNS = [
  {
    label: "The usual tooling",
    title: "Care management software",
    subtitle: "A system of record for work a person does",
    mark: "cross" as const,
    variant: "muted" as const,
    points: [
      "Tracks the minutes once somebody has spent them",
      "Holds the care plan and assembles the claim",
      "Reaches the patient only when your team dials",
      "Enrolment is capped by the hours your team has",
    ],
  },
  {
    label: "HANA",
    title: "AI care coordination",
    subtitle: "Based on clinician-built protocols",
    mark: "check" as const,
    variant: "feature" as const,
    points: [
      "It dials, it listens, it writes the note",
      "Calls every enrolled patient every month, in 30+ languages",
      "The note lands in your chart, ready for your staff to review",
      "Your team reviews and attests, and nothing bills until they do",
    ],
  },
];

/* The example month. ILLUSTRATIVE: not a real patient, not real readings, and
 * the card header says "an example month" on screen. */
const MONTH = [
  { day: "Aug 3", title: "Monthly check-in", body: "Taking both blood pressure meds. Home reading 138/86.", src: "HANA call · summarised", },
  { day: "Aug 11", title: "Refill and diet", body: "Metformin refill due Friday. Two skipped breakfasts this week.", src: "HANA call · summarised", },
  { day: "Aug 18", title: "Threshold crossed", body: "158/94 on two home readings. Escalated to the treating clinician with the full call.", src: "HANA call · flagged to the threshold you set", },
  { day: "Aug 26", title: "Care plan review", body: "Dose adjusted 20 Aug. Back to 134/84. Goals reconfirmed with the patient.", src: "HANA call · summarised", },
];

const FAQS = [
  {
    q: "Does HANA replace our care management software?",
    a: "Not necessarily, and often not. If you already have a system of record you are happy with, HANA is the part that reaches the patient and produces the documentation that system was waiting for. The two answer different questions.",
  },
  {
    q: "So what is the actual difference?",
    a: "Software of this kind is downstream of a phone call. It gives a coordinator somewhere to record the minutes, a place to keep the care plan, and a way to get the claim out. None of that happens until a person picks up the phone. HANA is the phone call.",
  },
  {
    q: "Is a time tracker not enough to bill?",
    a: "It is enough to bill the months you actually worked. The problem it does not solve is the months nobody got to. A tool that records the work cannot do the work.",
  },
  {
    q: "Can we keep our own care plan templates?",
    a: "Yes. Your clinicians scope what HANA asks and what it escalates. HANA does not bring its own clinical protocol and it does not change therapy.",
  },
  {
    q: "Who is accountable for what gets billed?",
    a: "Your team. A person on your side reads the note, approves it, and your provider signs. HANA never bills on your behalf and nothing goes out unreviewed.",
  },
];

export function VsCareManagementSoftware(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/compare/vs-care-management-software"
        useExactTitle
        keywords="care management software alternative, chronic care management software, care coordination platform comparison"
        jsonLd={[
          breadcrumbSchema([
            { name: "Compare", url: "https://www.hana.health/compare/vs-care-management-software" },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        tone="orbs"
        eyebrow="Compared with care management software"
        headline={<>Tracking the work <em>does not do it.</em></>}
        body="Care management software is a system of record for work a person still has to do. It holds the care plan, counts the time and builds the claim, and none of it starts until somebody dials."
        primaryCta={{ label: "Book a demo", href: DEMO_HREF }}
        secondaryCta={{ label: "See the difference", href: "#compare" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <WhatIsHanaCompare
        id="compare"
        tone="band"
        eyebrow="Two categories"
        heading={<>One records the work. <em>One does it.</em></>}
        body="Not a feature comparison. These are two different things, and a practice usually needs to be clear about which one it is short of."
        columns={COLUMNS}
        footnote="Describing a category, not any particular product. Check anything you are evaluating against its own documentation."
      />

      {/* THE ARTEFACT IS THIS PAGE'S ARGUMENT, not decoration. The whole claim
          is that one category records the work and the other does it, and a
          time log that is already full when the clinician presses start is the
          only thing that shows the difference rather than asserting it. It is
          also the page's first image: it ran 5,052px with none. */}
      <MonthWrittenUp
        id="written-up"
        entries={MONTH}
        badge="CCM"
        pill="Chronic Care Management"
        chip="CCM"
        body="This is the part a system of record cannot do for you. Every contact is made, recorded and summarised straight into the patient's record. Nobody typed it up. The clock your clinician starts runs on reading and attesting."
        stats={[
          { value: "0:00", label: "Time your team spends writing the month up" },
          { value: "4", label: "Documented contacts waiting when they open the chart" },
        ]}
        cta={{ label: "See the CCM page", href: "/programs/chronic-care-management" }}
      />

      <HowItWorksLoop id="how-it-works" />


      {/* Try it. A comparison page is exactly where "so let me hear it" lands.
          Real form, real Vapi handlers, threaded from App.tsx. */}
      <SonicDemoSection {...webCall} />

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>choose.</em></>}
      />


      {/* The other two comparisons. Sibling links, added because these three
          pages had no inbound links from anywhere except one mention on
          /academy, which left two of the three fully orphaned. A reader who
          rejects this comparison is usually holding one of the others. */}
      <section className="bg-paper py-14 md:py-16 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">The other comparisons</p>
          <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-2">
              <li>
                <a href="/compare/vs-outsourced-care-management" className="group flex h-full flex-col rounded-tile border border-rule bg-paper-bright p-5 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="text-[15.5px] font-semibold text-ink">Compared with outsourced care management</span>
                  <span className="mt-2 text-[14px] font-medium text-ink-soft underline underline-offset-4 decoration-rule group-hover:decoration-ink-soft">Read it</span>
                </a>
              </li>
              <li>
                <a href="/compare/vs-doing-nothing" className="group flex h-full flex-col rounded-tile border border-rule bg-paper-bright p-5 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="text-[15.5px] font-semibold text-ink">Compared with doing nothing</span>
                  <span className="mt-2 text-[14px] font-medium text-ink-soft underline underline-offset-4 decoration-rule group-hover:decoration-ink-soft">Read it</span>
                </a>
              </li>
          </ul>
        </div>
      </section>

      <CtaBand
        heading={<>Hear it make the call. <em>Then decide.</em></>}
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

export default VsCareManagementSoftware;
