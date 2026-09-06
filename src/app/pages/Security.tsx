import { SEO, breadcrumbSchema, faqSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { SafetyStack } from "../components/sections/SafetyStack";
import { ComplianceSection } from "../components/sections/ComplianceSection";
import { FaqSection } from "../components/sections/FaqSection";
import { CtaBand } from "../components/sections/CtaBand";

/**
 * /security
 *
 * Assembled entirely from sections that already carry signed-off copy:
 * SafetyStack (the layered call-time controls) and ComplianceSection (the
 * certifications and deployment environments, translated). Nothing on this page
 * invents a new security claim, and it must stay that way. A security page is
 * the one page where a sentence written to sound reassuring becomes a
 * representation somebody's counsel will hold us to.
 *
 * ComplianceSection is rendered with `white` so it uses the paper-bright ground
 * rather than its raw #F5F5F5 default, which predates the token sweep.
 *
 * WHAT IS NOT HERE, ON PURPOSE: no BAA or DPA language, no data-residency
 * promise, no retention period, no subprocessor list. Those are all open with
 * counsel. When they land they arrive as their own reviewed section, not as an
 * adjective added to a paragraph here.
 *
 * NOINDEX until the compliance claims above are re-confirmed against the
 * current entity, HANA Health, Inc.
 */

const COPY = {
  title: "Security, privacy and clinical safety",
  description:
    "How HANA protects patient data and what happens on a call when something needs a person. Layered controls at call time, and the certifications and deployment environments behind them.",
};

const FAQS = [
  {
    q: "Is HANA HIPAA compliant?",
    a: "HANA is built to operate as a business associate handling protected health information, and the certifications and controls behind that are listed above. The executed agreement itself is part of contracting, so ask us for the current paperwork rather than taking a web page as the answer.",
  },
  {
    q: "What happens on a call if a patient says something urgent?",
    a: "It reaches a person live, on the call, against the escalation rules your clinicians set. HANA does not decide clinical urgency on its own judgement and it does not queue something it was told to escalate.",
  },
  {
    q: "Does HANA make clinical decisions?",
    a: "No. It makes contact, asks what your clinicians scoped it to ask, and writes it up. Diagnosis, medication and treatment stay with your clinicians, and nothing bills until a person on your team approves the note.",
  },
  {
    q: "Are patients told what they are speaking to?",
    a: "Yes, plainly, at the start of the call. There is no version of this where a patient is left to work it out.",
  },
  {
    q: "Where does the data live?",
    a: "That depends on the deployment environment agreed with your organisation, which is covered in the environments note above. We will not put a single answer on a public page that turns out to be wrong for your contract.",
  },
  {
    q: "Can we review the call recordings and transcripts?",
    a: "Yes. The record of what was said, when, and how long it took is what the note is built from, and it is reviewable by your team. That reviewability is the point: your team attests to something they can actually check.",
  },
];

export function Security() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/security"
        useExactTitle
        robots="noindex, nofollow"
        keywords="HIPAA voice AI, healthcare AI security, patient data protection, clinical safety, SOC 2, GDPR"
        jsonLd={[
          breadcrumbSchema([{ name: "Security", url: "https://www.hana.health/security" }]),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero
        eyebrow="Security and safety"
        headline={<>Every call has a person <em>behind it.</em></>}
        body="Patient data is protected in transit and at rest, and clinical judgement never leaves your clinicians. When a call needs a human, it reaches one live rather than joining a queue."
        primaryCta={{ label: "Talk to HANA", href: "/demo" }}
        secondaryCta={{ label: "See the controls", href: "#compliance" }}
        trustLine="Your team reviews. Your provider signs."
      />

      <SafetyStack />

      <div id="compliance" className="scroll-mt-24">
        <ComplianceSection white />
      </div>

      <FaqSection
        items={FAQS}
        eyebrow="Questions security teams ask"
        heading={<>Before you <em>sign off.</em></>}
      />

      <CtaBand
        heading={<>Bring your security team. <em>We will take the questions.</em></>}
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

export default Security;
