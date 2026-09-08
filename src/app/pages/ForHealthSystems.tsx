import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { PhotoHero, CARE_TEAM_PHOTO } from "../components/sections/PhotoHero";
import { MonthWrittenUp } from "../components/sections/MonthWrittenUp";
import { InlineImageHeader } from "../components/sections/InlineImageHeader";
import { IntegrationsSection } from "../components/sections/IntegrationsSection";
import { SonicDemoSection } from "../components/sections/SonicDemoSection";
import type { WebCallProps } from "../components/templates/ProgrammePage";
import { EligibilityGap } from "../components/sections/EligibilityGap";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";

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

/* The example month shown in the written-up section. ILLUSTRATIVE: not a real
 * patient, not real readings, and the card header says "an example month". */
const MONTH = [
  { day: "Aug 3", title: "Monthly check-in", body: "Taking both blood pressure meds. Home reading 138/86.", src: "HANA call · summarised", len: "6 min" },
  { day: "Aug 11", title: "Refill and diet", body: "Metformin refill due Friday. Two skipped breakfasts this week.", src: "HANA call · summarised", len: "5 min" },
  { day: "Aug 18", title: "Threshold crossed", body: "158/94 on two home readings. Escalated to the treating clinician with the full call.", src: "HANA call · flagged to the threshold you set", len: "7 min" },
  { day: "Aug 26", title: "Care plan review", body: "Dose adjusted 20 Aug. Back to 134/84. Goals reconfirmed with the patient.", src: "HANA call · summarised", len: "4 min" },
];

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

export function ForHealthSystems(webCall: WebCallProps) {
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

      {/* Same fault /for-practices had: 6,345px with no image anywhere. A CARE
          TEAM rather than one clinician, because this page's reader runs
          several sites and the argument is scale -- and because the sibling
          page opens on a single physician, so the two do not share a face. */}
      <PhotoHero
        eyebrow="For health systems"
        headline={<>Same programmes. <em>A much bigger gap.</em></>}
        body="Your clinics already bill these codes. At group scale the number of eligible patients nobody has called is not a rounding error, it is most of the panel."
        image={CARE_TEAM_PHOTO}
        secondaryCta={{ label: "See the gap at scale", href: "#gap" }}
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

      {/* The artefact, after the rollout tiles so this page's distinctive
          content still leads. Deliberately the same section /for-practices
          carries: a group arriving here and a practice arriving there should
          see the same evidence of what a month produces, and duplication
          between two audience pages costs far less than either page being
          6,000px of unbroken type. The stats are per clinic, which is the
          only thing that changes at scale. */}
      <MonthWrittenUp
        id="written-up"
        entries={MONTH}
        badge="CCM"
        pill="Chronic Care Management"
        chip="CCM 99490"
        body="Every contact HANA makes is recorded and summarised straight into the time log, with the minutes attributed against the code. Whichever clinic the patient belongs to, when your clinician opens them the month is already there. The clock they start runs on reading and attesting, not typing."
        stats={[
          { value: "0:00", label: "Time any of your sites spends writing the month up" },
          { value: "4", label: "Documented contacts waiting when a clinician opens the chart" },
        ]}
        cta={{ label: "See the CCM page", href: "/programs/chronic-care-management" }}
      />

      <HowItWorksLoop id="how-it-works" />

      {/* DOES IT FIT MY EHR -- a top-three practice question that neither
          audience page answered visually. Taken from Home, where the catalogue
          showed it stranded on one page. Placed BEFORE three phases so the
          order matches how the objections arrive: does it fit what we run,
          then how long until we are live. */}
      <IntegrationsSection />

      {/* THREE PHASES — the section Matteo singled out as working ("I think
          it's good in the three phases"). It is InlineImageHeader, and it is
          DARK BY DESIGN: its three step animations are white artwork on navy,
          and although it takes a `light` prop the artwork washes out on a light
          ground until it is recoloured (see the note at RemoteV2 §16a). So it
          runs dark here, which is a considered exception to "no dark bands
          mid-page": the page already carries one full-bleed dark media band in
          MonthWrittenUp, and the palette rule allows full-bleed media. It is
          placed several sections clear of that one so the two never abut. */}
      <InlineImageHeader />

      {/* TRY HANA. Matteo, 7 Sept 2026: "I think Try Hana is missing in the
          health system." It was missing from both audience pages. Real form,
          real Vapi handlers, threaded from App.tsx. */}
      <SonicDemoSection {...webCall} />

      <FaqSection
        items={FAQS}
        eyebrow="Questions groups ask"
        heading={<>Before you <em>roll it out.</em></>}
      />

      <CtaBand
        heading={<>Start with one clinic. <em>Then decide.</em></>}
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

export default ForHealthSystems;
