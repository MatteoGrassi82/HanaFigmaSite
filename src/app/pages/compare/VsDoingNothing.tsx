import { SEO, breadcrumbSchema, faqSchema } from "../../components/SEO";
import { Footer } from "../../components/layout/Footer";
import { Hero } from "../../components/sections/Hero";
import { CostOfDelay } from "../../components/sections/CostOfDelay";
import { SonicDemoSection } from "../../components/sections/SonicDemoSection";
import type { WebCallProps } from "../../components/templates/ProgrammePage";
import { EligibilityGap } from "../../components/sections/EligibilityGap";
import { RevenueEstimator } from "../../components/sections/RevenueEstimator";
import { WhatIsHanaCompare } from "../../components/sections/WhatIsHanaCompare";
import { FaqSection } from "../../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../../components/sections/CtaBand";

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
      "The note lands in your chart, ready for your staff to review",
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
    a: "The honest answer is that these are billing rules and they have to be got right. That is why nothing bills until a person on your team has read the note and approved it, and why each programme page answers the billing rules from CMS's own documents, with the source beside each one.",
  },
  {
    q: "Could we just hire someone?",
    a: "You could, and some practices should. It is worth doing the arithmetic first: a coordinator's salary against the share of the panel one person can actually reach in a month. That comparison is the one that usually decides it.",
  },
];

export function VsDoingNothing(webCall: WebCallProps) {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/compare/vs-doing-nothing"
        useExactTitle
        keywords="cost of not billing chronic care management, unenrolled Medicare patients, CCM revenue opportunity"
        jsonLd={[
          breadcrumbSchema([
            { name: "Compare", url: "https://www.hana.health/compare/vs-doing-nothing" },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* NO PHOTO HERO HERE, deliberately, and this page is the one exception
          among the three. Matteo, 8 Sept 2026: it "doesn't have to include
          heroes ... could be a table. Be more inventive." A portrait was the
          lazy answer: the other two compare a thing to a thing, so a face
          works as a way in. This page compares NOW TO LATER, and the
          invention it needed was the argument nothing else on the site makes,
          not a picture. That argument is CostOfDelay below. */}
      <Hero
        tone="orbs"
        eyebrow="Compared with doing nothing"
        headline={<>The gap is not effort. <em>It is hours.</em></>}
        body="Most patients who qualify for chronic care management are not enrolled anywhere. The work is already being done in your practice. It is happening in a form that cannot be billed, to a fraction of the people who qualify."
        primaryCta={{ label: "Book a demo", href: DEMO_HREF }}
        secondaryCta={{ label: "See what a month costs", href: "#cost-of-delay" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* Third-party figures, cited on screen. The subtraction is the argument. */}
      <EligibilityGap />

      {/* What the gap is worth, at published CMS amounts. */}
      <RevenueEstimator programme="ccm" id="what-it-is-worth" />

      {/* THE TABLE, and it replaces the two-column compare that used to sit
          here ("Same panel. Different month."). Two columns said today versus
          with HANA as a list of assertions. The table says the same thing as
          arithmetic a reader can check, and adds the part the columns could
          not carry: that the loss is PERMANENT, because the code is billed per
          calendar month and there is no back-billing a month nobody worked.
          COLUMNS is left in the file, one line from being restored. */}
      <CostOfDelay id="cost-of-delay" />


      {/* Try it. A comparison page is exactly where "so let me hear it" lands:
          the reader has just been told what the difference is and the cheapest
          way to settle it is to talk to the thing. Real form, real Vapi
          handlers, threaded from App.tsx. */}
      <SonicDemoSection {...webCall} />

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>leave it another year.</em></>}
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
                <a href="/compare/vs-care-management-software" className="group flex h-full flex-col rounded-tile border border-rule bg-paper-bright p-5 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="text-[15.5px] font-semibold text-ink">Compared with care management software</span>
                  <span className="mt-2 text-[14px] font-medium text-ink-soft underline underline-offset-4 decoration-rule group-hover:decoration-ink-soft">Read it</span>
                </a>
              </li>
              <li>
                <a href="/compare/vs-outsourced-care-management" className="group flex h-full flex-col rounded-tile border border-rule bg-paper-bright p-5 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="text-[15.5px] font-semibold text-ink">Compared with outsourced care management</span>
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

export default VsDoingNothing;
