import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";

/**
 * /faq — the site-wide questions page.
 *
 * FOUR GROUPS, NOT ONE LIST. A single forty-item accordion is a page nobody
 * reads. The groups are the four things a reader is actually trying to settle,
 * and they are ordered the way the doubt arrives: what is it, what does my team
 * do, is it safe, and what does it cost me.
 *
 * ONE JSON-LD BLOCK COVERING ALL FOUR. schema.org FAQPage wants the whole page
 * in one graph; four separate FAQPage entities on one URL is the shape that
 * gets a rich-result warning. The groups are flattened into a single faqSchema
 * call at the bottom of the component for exactly that reason.
 *
 * ANSWERS ARE NOT NEW CLAIMS. Everything here restates something already
 * settled elsewhere in the repo: the programme content module, the guardrails
 * on the programme pages, or the compliance section on /security. If a question
 * cannot be answered from one of those, it does not belong on this page yet.
 * In particular there are no figures here at all, because a figure on an FAQ
 * page is a figure with no source line next to it.
 *
 * ALL FOUR GROUPS RUN LIGHT. FaqSection only offers light or navy, and a navy
 * group mid-page is exactly the dark band the palette decision ruled out. Four
 * light groups separated by their own headings read fine; the eyebrow is what
 * does the separating, not a change of ground.
 *
 * PRICING: the only honest answer today is "it depends on the panel", because
 * the pricing decision is usage-based and /pricing still carries older copy
 * that contradicts it. This page does not resolve that contradiction, it
 * declines to restate either version.
 *
 * NOINDEX until /pricing is reconciled and the programme routes publish.
 */

const COPY = {
  title: "Questions about HANA",
  description:
    "What HANA does on a call, what your team still does, how patient data is protected, and what it takes to start. The questions practices actually ask, answered plainly.",
};

const WHAT_IT_IS = [
  {
    q: "What does HANA actually do?",
    a: "It makes the monthly contact your care management programme requires. It calls the patient, asks what your clinicians scoped it to ask, and writes the conversation into your chart with the time attributed. Your team reviews it and your provider signs.",
  },
  {
    q: "Is HANA a person or software?",
    a: "Software. There is no team of people somewhere making the calls. Patients are told plainly what they are speaking to at the start of the call.",
  },
  {
    q: "What programmes does it support?",
    a: "Chronic care management, advanced primary care management, behavioral health integration, remote therapeutic monitoring and remote physiologic monitoring. Each has its own page setting out who is eligible, what the month has to show and what the code pays.",
  },
  {
    q: "Does it handle patients who do not speak English?",
    a: "Yes, in 30+ languages, in the same call flow. This is usually the part of a panel that goes unenrolled the longest.",
  },
  {
    q: "Is HANA a device, or does it read device data?",
    a: "No. HANA is never the device. Remote monitoring programmes pay for two different things, and HANA only ever does the conversation half. It does not supply hardware, it does not generate readings and it does not interpret them.",
  },
];

const WHAT_YOUR_TEAM_DOES = [
  {
    q: "What is left for our team to do?",
    a: "Review and attestation, plus the clinical judgement that was always yours. A person on your team reads the note, approves it, and your provider signs. Nothing bills until that happens.",
  },
  {
    q: "Do we need to hire anyone?",
    a: "No. The work HANA takes off your team is the calling, the chasing and the write-up. What is left is reviewing, which your clinicians already do for everything else that bills.",
  },
  {
    q: "Who owns the claim?",
    a: "You do. They are your patients and the claim goes out under your NPI, exactly as it does today. HANA never bills on your behalf and never becomes a party to the claim.",
  },
  {
    q: "Does it replace our EHR or our care management tooling?",
    a: "Not necessarily, and often not. The note lands in the chart your clinicians already work in. If you have a system of record you are happy with, HANA is the part that reaches the patient and produces what that system was waiting for.",
  },
  {
    q: "Can our clinicians change what it asks?",
    a: "Yes. Your clinicians scope what HANA asks and what it escalates. HANA does not bring its own clinical protocol.",
  },
];

const SAFETY = [
  {
    q: "What happens if a patient says something urgent?",
    a: "It reaches a person live, on the call, against the escalation rules your clinicians set. It is not queued and it is not left to a follow-up.",
  },
  {
    q: "Does HANA make clinical decisions?",
    a: "No. Diagnosis, medication and treatment stay with your clinicians. HANA makes contact, asks, listens and writes it up.",
  },
  {
    q: "How is patient data protected?",
    a: "In transit and at rest, under the controls and certifications set out on the security page, in the deployment environment agreed with your organisation.",
  },
  {
    q: "Can we review what was said?",
    a: "Yes. The record of what was said, when and for how long is what the note is built from, and your team can check it. That is the point of it being reviewable: your team attests to something they can actually verify.",
  },
];

const GETTING_STARTED = [
  {
    q: "What does it cost?",
    a: "It is priced against the panel rather than against hours, which is the part that matters: reaching twice as many patients is not twice the price. The specific number depends on your panel and which programmes you run, so it is a conversation rather than a figure on a page.",
  },
  {
    q: "How long does it take to start?",
    a: "That depends on your chart system and which programmes you are starting with. It is worth asking us for a real answer against your setup rather than taking a number from a web page.",
  },
  {
    q: "Can we start with one clinic?",
    a: "Yes, and for a multi-site group it is usually the right way to do it. Pick the site with the widest gap between eligible and enrolled, run it, and add the rest against what you learn there.",
  },
  {
    q: "Which programme should we start with?",
    a: "Whichever fits the patients you already have. Chronic care management has the widest eligibility, so most practices land there, but that is a fact about panels rather than a recommendation.",
  },
  {
    q: "What if we already contract this work out?",
    a: "Then the useful question is what share of your eligible panel it currently reaches. If it is most of them, the gap is already closed. If it is not, the reason is almost always capacity rather than effort.",
  },
];

const ALL = [...WHAT_IT_IS, ...WHAT_YOUR_TEAM_DOES, ...SAFETY, ...GETTING_STARTED];

export function Faq() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/faq"
        useExactTitle
        robots="noindex, nofollow"
        keywords="HANA FAQ, care management questions, voice AI healthcare questions, chronic care management FAQ"
        jsonLd={[
          breadcrumbSchema([{ name: "FAQ", url: "https://www.hana.health/faq" }]),
          /* One FAQPage for the whole URL. See the note at the top of this file. */
          faqSchema(ALL.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="Questions"
        headline={<>The questions <em>practices actually ask.</em></>}
        body="What HANA does on a call, what your team still does, how patient data is protected, and what it takes to start."
        primaryCta={{ label: "Book a demo", href: DEMO_HREF }}
        secondaryCta={{ label: "See the programmes", href: "/programs" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <FaqSection
        id="what-it-is"
        items={WHAT_IT_IS}
        eyebrow="What it is"
        heading={<>What HANA <em>actually does.</em></>}
      />

      <FaqSection
        id="your-team"
        items={WHAT_YOUR_TEAM_DOES}
        eyebrow="Your team"
        heading={<>What stays <em>with your clinicians.</em></>}
      />

      <FaqSection
        id="safety"
        items={SAFETY}
        eyebrow="Safety and data"
        heading={<>What happens <em>when it matters.</em></>}
      />

      <FaqSection
        id="getting-started"
        items={GETTING_STARTED}
        eyebrow="Getting started"
        heading={<>What it takes <em>to begin.</em></>}
      />

      <CtaBand
        heading={<>Still have a question? <em>Ask it out loud.</em></>}
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

export default Faq;
