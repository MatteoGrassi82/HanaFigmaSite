import { SEO, breadcrumbSchema, faqSchema } from "../../components/SEO";
import { Footer } from "../../components/layout/Footer";
import { Hero } from "../../components/sections/Hero";
import { WhatIsHanaCompare } from "../../components/sections/WhatIsHanaCompare";
import { FaqSection } from "../../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../../components/sections/CtaBand";

/**
 * /compare/vs-outsourced-care-management
 *
 * THE ARGUMENT IS OWNERSHIP, AND ONLY OWNERSHIP (decision, 5 Sept 2026):
 * "your patients, your claim". When the calling is contracted out, somebody
 * else's staff holds the relationship with your patient, the capacity is
 * whatever that vendor managed to hire, and the notes come back to you rather
 * than being written where your clinicians work.
 *
 * ███ NO CY2027 ARGUMENT ON THIS PAGE. ███
 * This is the one hard rule here and it is a deliberate reversal of the copy
 * that ships in DEFAULT_COMPARE_COLUMNS, which is why this page supplies its
 * own columns instead of taking the defaults. The proposed rule is a live
 * regulatory question, it is PROPOSED rather than settled, and turning it into
 * a competitive weapon on a comparison page is exactly the sentence that would
 * be screenshotted and read as being aimed at a specific company. The
 * ownership argument stands on its own without it. If someone adds the CY2027
 * line back to this page, they have not tightened the argument, they have
 * created a commercial problem.
 *
 * NEVER NAME A COMPANY, and go further here than on the software page: nothing
 * on this page should be readable as a description of any particular vendor's
 * staffing, pricing or quality. The category noun is "outsourced care
 * management". No anecdotes, no "we have seen", no implied incompetence. The
 * argument is structural, so it does not need one.
 *
 * PROOF IS THIRD-PARTY ONLY, and this page carries no figures at all.
 *
 * NOINDEX with the /programs routes.
 */

const COPY = {
  title: "HANA compared with outsourced care management",
  description:
    "Contracted staff can make the calls your team cannot get to, and the capacity you buy is whoever they managed to hire. HANA keeps the patient relationship, the documentation and the claim inside your practice.",
};

const COLUMNS = [
  {
    label: "One way to fill the gap",
    title: "Outsourced care management",
    subtitle: "Based on contracted staff and staffing agencies",
    mark: "cross" as const,
    variant: "muted" as const,
    points: [
      "Somebody else's staff hold the conversation with your patient",
      "Capacity is capped by whoever the vendor managed to hire",
      "Notes are handed back to you rather than written where your clinicians work",
      "What you pay scales with their hours, so reaching more patients costs more",
    ],
  },
  {
    label: "HANA",
    title: "AI care coordination",
    subtitle: "Based on clinician-built protocols",
    mark: "check" as const,
    variant: "feature" as const,
    points: [
      "The call is made under your practice's name, to your protocol",
      "Capacity is not a hiring problem, so the whole panel is reachable",
      "The note lands in your chart with the time attributed, ready to review",
      "Your team reviews and attests, and nothing bills until they do",
    ],
  },
];

const OWNERSHIP = [
  {
    title: "The patient stays yours",
    body: "The call is made on your behalf, to the protocol your clinicians wrote, under your practice's name. The relationship does not move to a third party and it does not move back if a contract ends.",
  },
  {
    title: "The record stays yours",
    body: "The note is written into the chart your clinicians already work in, with the time attributed, rather than arriving as a document somebody else produced and you have to reconcile.",
  },
  {
    title: "The claim stays yours",
    body: "It goes out under your NPI, after a person on your team has read the note and approved it. HANA never bills on your behalf and never becomes a party to the claim.",
  },
];

const FAQS = [
  {
    q: "Is HANA a care management service?",
    a: "No. HANA is software your practice runs. It is not a staffing arrangement and there is no team of people somewhere making the calls. That distinction is the reason capacity is not priced by the hour.",
  },
  {
    q: "Who is talking to our patients?",
    a: "HANA is, on your behalf, and patients are told plainly what they are speaking to. It asks what your clinicians scoped it to ask and escalates to a person live when something needs one.",
  },
  {
    q: "What happens to our notes?",
    a: "They are written into your chart with the time attributed, ready for review. Nothing lives only in our system waiting to be exported, and nothing has to be reconciled at month end.",
  },
  {
    q: "Is this cheaper than contracting the work out?",
    a: "It is priced differently, which matters more than cheaper. Contracted calling is priced against hours, so reaching twice as many patients costs about twice as much. Software is not, so the economics of reaching the rest of your panel are not the same question.",
  },
  {
    q: "Could we do both?",
    a: "Practices do. A common pattern is HANA for the monthly contact across the whole panel and people for the small number of patients who need a longer, harder conversation. The point is that the routine month should not be the thing consuming your capacity.",
  },
  {
    q: "What if we already have a contract in place?",
    a: "Then the useful question is what share of your eligible panel it currently reaches. If it is most of them, the gap is already closed. If it is not, the reason is almost always capacity rather than effort.",
  },
];

export function VsOutsourcedCareManagement() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/compare/vs-outsourced-care-management"
        useExactTitle
        robots="noindex, nofollow"
        keywords="outsourced care management alternative, in-house care coordination, chronic care management staffing"
        jsonLd={[
          breadcrumbSchema([
            {
              name: "Compare",
              url: "https://www.hana.health/compare/vs-outsourced-care-management",
            },
          ]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="Compared with outsourced care management"
        headline={<>Your patients. <em>Your claim.</em></>}
        body="Contracting the calling out fills the gap with somebody else's staff. It works, and it means the conversation with your patient, the note and the capacity all sit outside your practice."
        primaryCta={{ label: "Book a demo", href: DEMO_HREF }}
        secondaryCta={{ label: "See the difference", href: "#compare" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <WhatIsHanaCompare
        id="compare"
        tone="band"
        eyebrow="Two ways to close the gap"
        heading={<>Buy the hours, <em>or keep the work.</em></>}
        body="Both reach patients your team cannot get to. They differ in who ends up holding the relationship."
        columns={COLUMNS}
        footnote="Describing a category, not any particular provider. Check anything you are evaluating against its own terms."
      />

      <section id="ownership" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">What stays inside</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-10 max-w-[24ch]">
            Three things that do not leave the practice.
          </h2>
          <ul className="m-0 p-0 list-none grid gap-4 md:grid-cols-3">
            {OWNERSHIP.map((o) => (
              <li
                key={o.title}
                className="flex h-full flex-col rounded-card border border-rule bg-paper-bright p-6 md:p-7"
              >
                <span className="text-[17px] font-semibold text-ink">{o.title}</span>
                <span className="mt-2 text-[15px] leading-[1.65] text-ink-soft">{o.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>sign anything.</em></>}
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

export default VsOutsourcedCareManagement;
