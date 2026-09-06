import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { EligibilityGap } from "../components/sections/EligibilityGap";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";

/**
 * /for-health-systems — the audience page for a multi-site group.
 *
 * THE FRAMING IS A DECISION, NOT A DEFAULT (5 Sept 2026): "same product,
 * bigger panel". A health system bills the SAME CCM and APCM codes an
 * independent practice bills. It is not a different product, a different
 * clinical model or a different sale, and this page must not invent one.
 *
 * SPECIFICALLY REJECTED as the frame for this page: readmissions, risk
 * adjustment, Stars, total cost of care, value-based contracts. Every one of
 * those is a claim about outcomes we have not measured, on a population we do
 * not hold, and putting them here would make the page an outcomes pitch that
 * nothing in this repo can support. What a system actually gets that a solo
 * practice does not is ROLLOUT: one contract, many clinics, one place the work
 * is configured. That is the only thing this page adds.
 *
 * PROOF IS THIRD-PARTY ONLY, same decision, same reasons as ForPractices.tsx.
 * The ASPE/NORC pair in EligibilityGap is the whole quantitative argument, and
 * it scales to a system panel because the reader moves the dials.
 *
 * THE FACILITY CAVEAT IS ON THE PAGE ON PURPOSE. Every figure this site
 * publishes is national NON-facility. A provider-based clinic inside a system
 * may be paid on the facility schedule instead, which is a different and lower
 * number, and we do not hold it. The page says so rather than letting a system
 * reader do arithmetic on the wrong column.
 *
 * NOINDEX with the /programs routes. See ForPractices.tsx.
 */

const COPY = {
  title: "Care management across a multi-site group",
  description:
    "The same care management programmes your practices already bill, run across every clinic in the group. One contract, one configuration, and each site keeps its own patients and its own claim.",
};

const ROLLOUT = [
  {
    n: "01",
    title: "One contract, many clinics",
    body: "Sites are added to an existing agreement rather than negotiated one at a time. A clinic that comes into the group later is added the same way.",
  },
  {
    n: "02",
    title: "Configured centrally, run locally",
    body: "Protocols, escalation rules and call scripts are set once by your clinical leadership. Each site keeps its own panel, its own reviewers and its own attestation.",
  },
  {
    n: "03",
    title: "Site by site, not all at once",
    body: "Start with the clinics whose panels have the widest gap, and add the rest as each one settles. Nothing about the loop changes as sites are added.",
  },
];

const FAQS = [
  {
    q: "Is this a different product from the one you sell a single practice?",
    a: "No. Same programmes, same codes, same monthly loop. A larger group has more patients in the gap and more clinics to roll it out across, and that is the entire difference. Anyone who tells you a multi-site version is a separate product is describing a pricing strategy, not a product.",
  },
  {
    q: "Who owns the claim when a group has many tax IDs?",
    a: "The billing entity that owns the patient. HANA supplies the monthly contact and the documentation; the claim goes out from the site under its own NPI, exactly as it does today. HANA never bills on your behalf.",
  },
  {
    q: "Do your figures apply to a provider-based clinic?",
    a: "Not directly, and this matters at system scale. Every amount on this site is the national NON-facility rate. A clinic paid on the facility schedule is paid a different and lower amount, and we do not publish a figure for it because we do not hold a sourced one. Check which schedule each site sits on before doing the arithmetic.",
  },
  {
    q: "How does it fit our EHR?",
    a: "The note lands in the chart your clinicians already work in, with the time attributed, ready to review. What that takes depends on which system and which integration path, and it is a conversation rather than a claim we can make on a page.",
  },
  {
    q: "Does each site need its own staff for this?",
    a: "No new hires. Each site needs people who review and attest, which is work your clinicians already do for everything else that bills. HANA makes the calls and writes them up, and nothing bills until a person on your team approves it.",
  },
  {
    q: "Can we start with one clinic?",
    a: "That is usually the right way to do it. Pick the site with the widest gap between eligible and enrolled, run it for a few months, and add the rest against what you learn there rather than against what we told you.",
  },
];

export function ForHealthSystems() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/for-health-systems"
        useExactTitle
        robots="noindex, nofollow"
        keywords="multi-site care management, health system chronic care management, care coordination at scale, group practice CCM"
        jsonLd={[
          breadcrumbSchema([
            { name: "For health systems", url: "https://www.hana.health/for-health-systems" },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="For health systems"
        headline={<>Same programmes. <em>A much bigger gap.</em></>}
        body="Your clinics already bill these codes. At group scale the number of eligible patients nobody has called is not a rounding error, it is most of the panel."
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See the gap at scale", href: "#gap" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* Move the dials to a group panel and the subtraction does the arguing. */}
      <EligibilityGap />

      <section id="rollout" className="scroll-mt-24 bg-band border-y border-rule py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">Rollout</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3 max-w-[24ch]">
            The only thing that is different at scale.
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-10 max-w-[62ch]">
            Not the product. How it gets from one clinic to twenty.
          </p>
          <ul className="m-0 p-0 list-none grid gap-4 md:grid-cols-3">
            {ROLLOUT.map((r) => (
              <li
                key={r.n}
                className="flex h-full flex-col rounded-card border border-rule bg-paper-bright p-6 md:p-7"
              >
                <span className="font-serif text-[22px] leading-none text-ink-mute tabular-nums">
                  {r.n}
                </span>
                <span className="mt-4 text-[17px] font-semibold text-ink">{r.title}</span>
                <span className="mt-2 text-[15px] leading-[1.65] text-ink-soft">{r.body}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-[1.6] text-ink-mute m-0 mt-6 max-w-[74ch]">
            Amounts published on this site are national non-facility rates before geographic
            adjustment. A provider-based clinic may be paid on the facility schedule instead. Check
            which applies to each site before you model it.
          </p>
        </div>
      </section>

      <HowItWorksLoop id="how-it-works" />

      <FaqSection
        items={FAQS}
        eyebrow="Questions groups ask"
        heading={<>Before you <em>roll it out.</em></>}
      />

      <CtaBand
        heading={<>Start with one clinic. <em>Then decide.</em></>}
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

export default ForHealthSystems;
