import { SEO, breadcrumbSchema, faqSchema } from "../../components/SEO";
import { Footer } from "../../components/layout/Footer";
import { Hero } from "../../components/sections/Hero";
import { EligibilityGap } from "../../components/sections/EligibilityGap";
import { RevenueEstimator } from "../../components/sections/RevenueEstimator";
import { WhatIsHanaCompare } from "../../components/sections/WhatIsHanaCompare";
import { FaqSection } from "../../components/sections/FaqSection";
import { CtaBand } from "../../components/sections/CtaBand";

/**
 * /compare/vs-doing-nothing
 *
 * THE ONLY COMPARE PAGE WITH NUMBERS ON IT, and every one of them comes from
 * outside this building. The gap is ASPE/NORC via MARKET in rates.ts, cited on
 * screen. The amounts are the published CMS physician fee schedule. Nothing on
 * this page is a HANA measurement, which is the point: the case against the
 * status quo does not need us to have measured anything.
 *
 * THE ARGUMENT IS BILLING, NOT OUTCOMES. It is genuinely tempting to argue
 * that unenrolled patients do worse, and we have not measured that on anyone's
 * panel, so it does not go on the page. What we can say is arithmetic a reader
 * can check: this many patients qualify, this few are enrolled, this is what
 * the code pays. The estimator does the second half and says loudly that it is
 * an estimate, not a projection.
 *
 * WHAT THIS PAGE MUST NOT BECOME: a page that tells a practice it is failing
 * its patients. The reason the gap exists is that nobody has the hours, not
 * that nobody cares, and the copy says so in the hero. Get that wrong and the
 * page insults the exact person it is trying to reach.
 *
 * NOINDEX with the /programs routes.
 */

const COPY = {
  title: "The cost of not running a care management programme",
  description:
    "Most Medicare patients who qualify for chronic care management are not enrolled. Not because the billing is hard, but because nobody has the hours to make the calls. Here is what that gap is worth.",
};

const COLUMNS = [
  {
    label: "Today",
    title: "Nothing changes",
    subtitle: "The month runs the way it runs now",
    mark: "cross" as const,
    variant: "muted" as const,
    points: [
      "Patients who qualify go another month uncontacted",
      "Coordination happens, but not in a form that can be billed",
      "Enrolment is capped by the hours your team already does not have",
      "The gap does not close on its own, and the panel keeps growing",
    ],
  },
  {
    label: "With HANA",
    title: "The month has something in it",
    subtitle: "Based on clinician-built protocols",
    mark: "check" as const,
    variant: "feature" as const,
    points: [
      "Every eligible patient gets the monthly contact, in 30+ languages",
      "The note lands in your chart with the time attributed",
      "Your team reviews and attests, and nothing bills until they do",
      "Reaching the rest of the panel is not a hiring decision",
    ],
  },
];

const FAQS = [
  {
    q: "We already do this work. Why are we not billing it?",
    a: "Most practices are doing a great deal of coordination that never becomes a claim, because it happens in the corridor, between visits, and nothing captures the time in a form that supports billing. The gap is usually documentation and reach rather than effort.",
  },
  {
    q: "Is the enrolment figure really that low?",
    a: "The figures on this page come from published third-party analysis of the Medicare fee-for-service population, cited beside the arithmetic. They describe a national picture, not your panel, which is why the dials move. Run them against your own numbers.",
  },
  {
    q: "Is the estimate what we would actually collect?",
    a: "No, and it says so on itself. It is the published national amount before geographic adjustment, and it is not what lands in the bank: sequestration and the standard Part B patient coinsurance both come off. It is an order of magnitude, not a forecast.",
  },
  {
    q: "What is the risk of starting?",
    a: "The honest answer is that these are billing rules and they have to be got right. That is why nothing bills until a person on your team has read the note and approved it, and why the programme pages list the questions we will not guess at rather than answering them plausibly.",
  },
  {
    q: "Could we just hire someone?",
    a: "You could, and some practices should. It is worth doing the arithmetic first: a coordinator's salary against the share of the panel one person can actually reach in a month. That comparison is the one that usually decides it.",
  },
];

export function VsDoingNothing() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/compare/vs-doing-nothing"
        useExactTitle
        robots="noindex, nofollow"
        keywords="cost of not billing chronic care management, unenrolled Medicare patients, CCM revenue opportunity"
        jsonLd={[
          breadcrumbSchema([
            { name: "Compare", url: "https://www.hana.health/compare/vs-doing-nothing" },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="Compared with doing nothing"
        headline={<>The gap is not effort. <em>It is hours.</em></>}
        body="Most patients who qualify for chronic care management are not enrolled anywhere. The work is already being done in your practice. It is happening in a form that cannot be billed, to a fraction of the people who qualify."
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See the arithmetic", href: "#gap" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* Third-party figures, cited on screen. The subtraction is the argument. */}
      <EligibilityGap />

      {/* What the gap is worth, at published CMS amounts. */}
      <RevenueEstimator programme="ccm" id="what-it-is-worth" />

      <WhatIsHanaCompare
        id="compare"
        tone="band"
        eyebrow="Two versions of next month"
        heading={<>Same panel. <em>Different month.</em></>}
        columns={COLUMNS}
      />

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>leave it another year.</em></>}
      />

      <CtaBand
        heading={<>Hear it make the call. <em>Then decide.</em></>}
        body="Drop your number and HANA calls you. The agent works out the right demo as you talk."
        buttons={[
          { label: "Talk to HANA", href: "/demo" },
          { label: "Book a demo", href: "/contact", variant: "ghost" },
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

export default VsDoingNothing;
