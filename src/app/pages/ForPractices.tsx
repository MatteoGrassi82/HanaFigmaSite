import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { EligibilityGap } from "../components/sections/EligibilityGap";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";
import { PROGRAMMES, PROGRAMME_FOOTNOTE } from "../../content/programmes/index";

/**
 * /for-practices — the audience page for an independent practice or small group.
 *
 * THE ARGUMENT, IN ONE LINE: you are already eligible to bill these codes. The
 * thing standing between you and the revenue is not the billing. It is that
 * nobody has time to make the calls.
 *
 * PROOF IS THIRD-PARTY ONLY, BY DECISION (5 Sept 2026). The only quantitative
 * claim on this page is the ASPE/NORC pair carried by EligibilityGap and cited
 * on screen from MARKET in rates.ts. There are NO HANA figures here: no
 * interaction counts, no practice counts, no 29-minute caseload maths. Those
 * numbers are either unreconciled or unpublished, and an audience page is the
 * worst possible place to be the first to print one. If a HANA figure is ever
 * cleared, it arrives with its own source line or it does not arrive.
 *
 * That decision is also why WhyHana is not on this page. Its reach-by-channel
 * bars (58/30/85/33) carry no citation anywhere in the repo.
 *
 * NO CASELOADSLIDER for the same reason, and a second one: EligibilityGap is
 * already the panel-dial component. Two dialled panel components on one page is
 * the same redundancy that made the programme pages read long.
 *
 * NOINDEX until the /programs routes it links into come out of noindex. This
 * page's whole close is "go read the programme page", and publishing it first
 * strands a crawler on four dead ends.
 */

const COPY = {
  title: "Care management for independent practices",
  description:
    "Most of your Medicare panel already qualifies for a care management programme. Almost none of them are enrolled. HANA makes the monthly contact and writes it up. Your team reviews, your provider signs.",
};

const FAQS = [
  {
    q: "Do we have to change anything about how we bill?",
    a: "No. They are your patients and it is your claim, billed under your NPI the way you bill everything else. HANA supplies the monthly contact and the documentation behind it. What changes is that the month has something in it to bill.",
  },
  {
    q: "How much of our team's time does this take?",
    a: "Review and attestation. HANA makes the call, asks what your clinicians scoped, and writes the note with the time attributed. A person on your team reads it and approves it, and nothing bills until they do.",
  },
  {
    q: "Are you hiring people to call our patients?",
    a: "No. HANA is software making the call. That is the whole point of the price: you are not paying for somebody's hours, so the number of patients you can reach is not capped by who anybody managed to hire.",
  },
  {
    q: "What if a patient says something that needs a clinician?",
    a: "It reaches a person live, on the call, against the escalation rules your clinicians set. HANA does not diagnose, does not change therapy and does not interpret a reading.",
  },
  {
    q: "Does it work for patients who do not speak English?",
    a: "Yes, in 30+ languages, in the same call flow. This is usually the part of a panel that goes unenrolled the longest, because it is the part a short-staffed front desk cannot get to.",
  },
  {
    q: "Which programme should we start with?",
    a: "Whichever fits the patients you already have. Chronic care management has the widest eligibility, so most practices land there, but that is a fact about panels rather than a recommendation. The chooser on the programmes page asks three questions and lands on one.",
  },
];

export function ForPractices() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/for-practices"
        useExactTitle
        robots="noindex, nofollow"
        keywords="care management for independent practices, chronic care management, small practice Medicare billing, care coordination"
        jsonLd={[
          breadcrumbSchema([{ name: "For practices", url: "https://www.hana.health/for-practices" }]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="For practices"
        headline={<>You are already eligible. <em>Nobody has time to call.</em></>}
        body="Most of your Medicare panel qualifies for a care management programme today. Almost none of them are enrolled, and the reason is never the billing. It is the phone."
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See the gap on your panel", href: "#gap" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* The only quantitative argument on the page, and it is not ours. */}
      <EligibilityGap />

      {/* What actually changes in a month. */}
      <HowItWorksLoop id="how-it-works" />

      <section id="programmes" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">What you can bill</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3 max-w-[22ch]">
            Seven programmes. One loop.
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-10 max-w-[62ch]">
            The difference between them is who counts and what the month has to show. The work is
            the same shape in all seven.
          </p>
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

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
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

export default ForPractices;
