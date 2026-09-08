import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { PhotoHero, CLINICIAN_PHOTO } from "../components/sections/PhotoHero";
import { MonthWrittenUp } from "../components/sections/MonthWrittenUp";
import { InlineImageHeader } from "../components/sections/InlineImageHeader";
import { IntegrationsSection } from "../components/sections/IntegrationsSection";
import { SonicDemoSection } from "../components/sections/SonicDemoSection";
import type { WebCallProps } from "../components/templates/ProgrammePage";
import { EligibilityGap } from "../components/sections/EligibilityGap";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";
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

/* The example month shown in the written-up section. ILLUSTRATIVE: not a real
 * patient and not real readings, and the card header says "an example month".
 * Shaped to CCM's actual requirement, twenty minutes of clinical staff time
 * across the month on a two-or-more-conditions patient, because this page's
 * programme cards land on CCM more often than anything else. */
const MONTH = [
  { day: "Aug 3", title: "Monthly check-in", body: "Taking both blood pressure meds. Home reading 138/86.", src: "HANA call · summarised", len: "6 min" },
  { day: "Aug 11", title: "Refill and diet", body: "Metformin refill due Friday. Two skipped breakfasts this week.", src: "HANA call · summarised", len: "5 min" },
  { day: "Aug 18", title: "Threshold crossed", body: "158/94 on two home readings. Escalated to Dr Reyes with the full call.", src: "HANA call · flagged to the threshold you set", len: "7 min" },
  { day: "Aug 26", title: "Care plan review", body: "Dose adjusted 20 Aug. Back to 134/84. Goals reconfirmed with the patient.", src: "HANA call · summarised", len: "4 min" },
];

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

export function ForPractices(webCall: WebCallProps) {
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

      {/* The page had NO image anywhere across 7,300px, which is why it read as
          a document rather than a page -- and it is the funnel's front door.
          A CLINICIAN, not a patient: this page's reader is the practice, so the
          hero shows the reader's side of the work. The patient photograph stays
          on the written-up month below, which is genuinely about a patient's
          month -- so the page runs practice side, then patient side. */}
      <PhotoHero
        eyebrow="For practices"
        headline={<>You are already eligible. <em>Nobody has time to call.</em></>}
        body="Most of your Medicare panel qualifies for a care management programme today. Almost none of them are enrolled, and the reason is never the billing. It is the phone."
        image={CLINICIAN_PHOTO}
        secondaryCta={{ label: "See the gap on your panel", href: "#gap" }}
      />

      {/* The only quantitative argument on the page, and it is not ours. */}
      <EligibilityGap />

      {/* The gap above argues that nobody is calling. This is the artefact that
          answers "so what arrives if somebody does": a month already written up
          when the clinician presses start. It also breaks up 3,400px of
          unbroken type between the gap and the programme cards. */}
      <MonthWrittenUp
        id="written-up"
        entries={MONTH}
        badge="CCM"
        pill="Chronic Care Management"
        chip="CCM 99490"
        body="Every contact HANA makes is recorded and summarised straight into the time log, with the minutes attributed against the code. When your clinician opens the patient, the month is already there. The clock they start runs on reading and attesting, not typing."
        stats={[
          { value: "0:00", label: "Time your team spends writing the month up" },
          { value: "4", label: "Documented contacts waiting when they open the chart" },
        ]}
        cta={{ label: "See the CCM page", href: "/programs/chronic-care-management" }}
      />

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

      {/* WAS PatientEngagement ("Every patient conversation, handled"). Pulled
          7 Sept 2026: Matteo was unconvinced by it, and on a second look he is
          right for this page -- its four tiles are HANA Contact flavoured (QA
          scoring, a branded dashboard) rather than care-programme flavoured,
          and it closes on a founders' card, which is an odd note to strike
          mid-funnel. It stays on Home. */}

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

      {/* Try it. Real form, real Vapi handlers, threaded from App.tsx. */}
      <SonicDemoSection {...webCall} />

      <FaqSection
        items={FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
      />

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

export default ForPractices;
