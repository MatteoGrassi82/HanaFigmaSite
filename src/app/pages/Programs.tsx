import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { ProgrammeChooser } from "../components/sections/ProgrammeChooser";
import { CodeTable } from "../components/sections/CodeTable";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";
import { PROGRAMMES, PROGRAMME_FOOTNOTE } from "../../content/programmes/index";

/**
 * /programs — the hub.
 *
 * NOT a programme page and deliberately not built on ProgrammePage. A programme
 * page answers "should I run this one". The hub answers a different question:
 * "which of these is my patient", which is the single most confusing thing about
 * the category and the reason this page exists at all.
 *
 * So the order is different too:
 *   1. The chooser, first. It is the job.
 *   2. The seven programmes as cards, for anyone who already knows.
 *   3. The code table, all seven at once, which is the comparison a hub can make
 *      and a programme page cannot.
 *   4. The loop, because the month is the same shape whichever one you bill.
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
    a: "Sometimes, and the rules are specific. Advanced primary care management cannot be billed in the same month as chronic care management, principal care management or transitional care management for the same patient. The other combinations are not settled on this page, and we will not guess at them. Ask your biller, or ask us and we will go through it with you.",
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

export function Programs() {
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

      <Hero
        eyebrow="Care programmes"
        headline={<>One loop. <em>Seven ways to bill it.</em></>}
        body="Your patients already qualify for more than you are running. The difference between these programmes is who counts and what the month has to show, not how the work gets done."
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "Compare the codes", href: "#codes" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* The job of this page. Three questions, one answer. */}
      <ProgrammeChooser programsHref="/programs" />

      {/* For anyone who already knows which one they want. */}
      <section id="all" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">All seven</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-10 max-w-[20ch]">
            Or go straight to the one you meant.
          </h2>
          <ul className="m-0 p-0 list-none grid gap-4 md:grid-cols-2">
            {PROGRAMMES.map((p) => (
              <li key={p.id}>
                <a
                  href={p.path}
                  className="group flex h-full flex-col rounded-card border border-rule bg-paper-bright p-6 md:p-7 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-serif text-[26px] leading-none text-ink">{p.code}</span>
                    <span className="text-[12.5px] text-ink-mute tabular-nums">{p.codes}</span>
                  </span>
                  <span className="mt-1 text-[15px] font-medium text-ink-soft">{p.name}</span>
                  <span className="mt-4 text-[15px] leading-[1.65] text-ink-soft">{p.summary}</span>
                  <span className="mt-5 flex items-baseline gap-2 border-t border-rule-soft pt-4">
                    <span className="font-serif text-[22px] text-ink tabular-nums">
                      ${p.payment.rate.toFixed(2)}
                    </span>
                    <span className="text-[12.5px] text-ink-mute">
                      {p.payment.year} national, before adjustment
                    </span>
                  </span>
                  <span className="mt-3 text-[14px] font-semibold text-ink-soft underline underline-offset-4 decoration-rule group-hover:decoration-ink-soft">
                    Read the {p.code} page
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-[1.6] text-ink-mute m-0 mt-6 max-w-[70ch]">
            {PROGRAMME_FOOTNOTE}
          </p>
        </div>
      </section>

      {/* The comparison a hub can make and a programme page cannot. */}
      <CodeTable id="codes" tone="band" />

      {/* The month is the same shape whichever one you bill. */}
      <HowItWorksLoop id="how-it-works" />

      <FaqSection
        items={HUB_FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>pick one.</em></>}
      />

      <CtaBand
        heading={<>Not sure which fits your panel? <em>Ask us.</em></>}
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

export default Programs;
