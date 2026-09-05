import type { ReactNode } from "react";
import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { EligibilityCheck } from "../components/sections/EligibilityCheck";
import { CodeTable } from "../components/sections/CodeTable";
import { WhoDoesWhat } from "../components/sections/WhoDoesWhat";
import { HowItWorksLoop } from "../components/sections/HowItWorksLoop";
import { RecipesMarquee } from "../components/sections/RecipesMarquee";
import { RevenueEstimator } from "../components/sections/RevenueEstimator";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";
import { programmeById } from "../../content/programmes/index";
import { PROGRAM_CARDS } from "../../content/programmes";

/**
 * /programs/chronic-care-management — THE REFERENCE PROGRAMME PAGE.
 *
 * Six more programme pages get built from this one, so its shape is the decision,
 * not its copy. Read this before adding APCM, BHI, RTM, RPM or ACCESS.
 *
 * THE ORDER IS THE ARGUMENT, and it answers the five questions a practice manager
 * actually asks, in the order they ask them:
 *   1. Is this me?            EligibilityCheck
 *   2. What does it pay?      CodeTable
 *   3. What do I have to do?  WhoDoesWhat      <- the one that closes the deal
 *   4. How does it run?       HowItWorksLoop + the programme's own workflows
 *   5. What is the catch?     the open questions, stated rather than hidden
 * A page that reorders these is answering questions nobody asked yet.
 *
 * WHY THIS IS A PAGE FILE AND NOT A TEMPLATE CALL, YET. There is one programme
 * page. Extracting a ProgrammePage template from a single instance would be
 * guessing at what varies. Build APCM next, diff the two, and extract the
 * template from what actually differs. Until then this file IS the spec.
 *
 * THE <SEO> BLOCK MUST STAY IN THIS FILE, AS A LITERAL.
 * scripts/lib/route-seo.mjs regex-scrapes it out of the page source and needs
 * `path` to be a plain double-quoted string starting with "/". Move it into a
 * shared template and the parser finds one unresolvable path, skips the route,
 * and every programme page prerenders with the generic default title and
 * description. There is no build error when that happens. You find out from
 * Search Console. title/description may read from a const in THIS file, which is
 * what COPY below is for.
 *
 * NOINDEX FOR NOW. The route is in NOINDEX_ROUTES so it is live at its real URL
 * for review but not indexed. Moving it to STATIC_ROUTES is the publish step, and
 * it should not happen until the open questions below are answered.
 *
 * WHAT IS DELIBERATELY MISSING, and rendered as visible gaps rather than papered
 * over with plausible copy: consent handling, the initiating-visit rule, who may
 * bill and under what supervision, the concurrency matrix, and the CY2027 line.
 * See OPEN_QUESTIONS. Every one is a fact somebody has to supply, not a writing
 * problem, and a programme page that guesses at any of them is worse than one
 * that says it does not know yet.
 */

const CCM = programmeById("ccm")!;

/* Copy lives here, in the page, so the <SEO> block can read it and the prerender
   parser can still resolve it. Do not move this into the content module. */
const COPY = {
  title: "Chronic care management, run by your own staff",
  description:
    "CPT 99490 pays for the month of work that happens between visits. HANA makes the calls and writes them up. Your team reviews and attests, and nothing bills until a person on your team approves it.",
};

const HERO_HEADLINE: ReactNode = (
  <>
    Bill the month of work that <em>happens between visits.</em>
  </>
);

/* The four CCM workflows already fact-checked in src/content/programmes.ts. */
const CCM_WORKFLOWS = PROGRAM_CARDS.filter((c) => c.tag === "CCM");

/* Answerable from the sourced data and nothing else. Every answer below traces to
   src/content/programmes/index.ts or to rates.ts. Questions that need a fact we do
   not have are in OPEN_QUESTIONS instead, where they read as open rather than
   getting a confident invented answer. */
const CCM_FAQS = [
  {
    q: "Who counts as eligible?",
    a: `${CCM.who} The programme runs against a care plan the patient has agreed to.`,
  },
  {
    q: "What does the month have to show?",
    a: CCM.rule,
  },
  {
    q: "What does my team still do?",
    a: `${CCM.team} HANA makes the calls and writes them up. Nothing bills until a person on your team approves it.`,
  },
  {
    q: "What does it pay?",
    a: `${CCM.payment.code} is ${CCM.payment.year} $${CCM.payment.rate.toFixed(2)} national non-facility, before geographic adjustment. That is one base code for one patient in one calendar month. It is not what the practice collects: sequestration and the standard Part B patient coinsurance both come off, and the amount varies by locality. The table above shows the basis.`,
  },
  {
    q: "Is this HANA billing on our behalf?",
    a: "No. They are your patients and it is your claim. HANA supplies the reach and the documentation, your team supplies the clinical judgement and the attestation.",
  },
];

/* Rendered on the page, not hidden in a comment. A practice manager reading this
   page will ask every one of these, and an honest gap is worth more than a
   confident guess. Each is a fact somebody has to supply. */
const OPEN_QUESTIONS: { q: string; needs: string }[] = [
  { q: "How is patient consent obtained and recorded?", needs: "Confirm how consent is captured, by whom, and whether it is once or annual." },
  { q: "Does a patient need an initiating visit first?", needs: "Confirm which patients require one, and who may perform it." },
  { q: "Who in the practice may bill this?", needs: "Confirm practitioner types and the supervision level the clinical staff time sits under." },
  { q: "Can it run alongside our other programmes?", needs: "Confirm the concurrency rules beyond the APCM exclusion, and how the same minutes are kept from being counted twice." },
  { q: "What changes under the CY2027 proposed rule?", needs: "Wording for the proposed rule, from Matteo and counsel. Always described as proposed, never as settled." },
];

export function ChronicCareManagement() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/programs/chronic-care-management"
        useExactTitle
        /* NOINDEX_ROUTES in route-seo.mjs governs the PRERENDERED head. This prop
           governs the head the runtime renders. Both are needed, and RemoteV2 does
           the same. Delete this line and move the route to STATIC_ROUTES together,
           as one publish step, once OPEN_QUESTIONS are answered. */
        robots="noindex, nofollow"
        keywords="chronic care management, CPT 99490, CCM billing, Medicare chronic care management, care coordination"
        jsonLd={[
          breadcrumbSchema([
            { name: "Programs", url: "https://www.hana.health/programs" },
            { name: "Chronic care management", url: "https://www.hana.health/programs/chronic-care-management" },
          ]),
          faqSchema(CCM_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      {/* 0. The claim. Single column: there is no product animation for a
             programme page, and a half-empty visual slot reads as unfinished. */}
      <Hero
        eyebrow={`${CCM.code} · ${CCM.codes}`}
        headline={HERO_HEADLINE}
        body={CCM.rule}
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See what it pays", href: "#codes" }}
        trustLine="Your team reviews. Your provider signs."
      />

      {/* 1. Is this me? */}
      <EligibilityCheck data={CCM} id="eligibility" />

      {/* 2. What does it pay? The basis travels with every figure. */}
      <CodeTable id="codes" tone="band" />

      {/* 3. What do I have to do? The section the page is really for. */}
      <WhoDoesWhat data={CCM} id="who-does-what" />

      {/* 4. How does it run, month to month. */}
      <HowItWorksLoop id="how-it-works" />

      {/* 4b. The programme's own workflows, filtered to CCM. */}
      <RecipesMarquee
        soft
        tag="CCM"
        items={CCM_WORKFLOWS}
        heading="What a CCM month actually looks like"
        body="Four of the workflows HANA runs inside chronic care management. Each one ends in the record, not in a spreadsheet."
      />

      {/* 5. What is it worth on my panel. Locked to CCM: the four-programme
             selector belongs on the hub, not on a page about one programme.
             NO PROOF SECTION HERE. ProofBento carries generic HANA proof and
             quotes that are not about chronic care management, so on this page it
             would be borrowed credibility. It goes back when there is a CCM
             case study to put in it. */}
      <RevenueEstimator programme="ccm" id="what-it-is-worth" />

      <FaqSection
        items={CCM_FAQS}
        eyebrow="Questions practices ask"
        heading={<>Before you <em>start.</em></>}
      />

      {/* 6. The gaps, stated. This section comes out before the page is indexed. */}
      <section id="open" className="scroll-mt-24 bg-band border-y border-rule py-16 md:py-20 px-6 md:px-16">
        <div className="max-w-[820px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">
            Not answered on this page yet
          </p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-4">
            Five things we will not guess at.
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]">
            These are billing rules, and a plausible-sounding answer is worse than
            no answer. Each one is confirmed before this page is published.
          </p>
          <ul className="m-0 p-0 list-none grid gap-3">
            {OPEN_QUESTIONS.map((o) => (
              <li key={o.q} className="rounded-tile border border-rule bg-paper-bright p-5">
                <p className="text-[16px] font-semibold text-ink m-0">{o.q}</p>
                <p className="text-[14.5px] leading-[1.6] text-ink-soft m-0 mt-1.5">{o.needs}</p>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-[1.6] text-ink-mute m-0 mt-6">
            Medicare rules as they stand in August 2026. Figures are CY2026.
          </p>
        </div>
      </section>

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

export default ChronicCareManagement;
