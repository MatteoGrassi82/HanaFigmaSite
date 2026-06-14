import { CTASection } from "../components/ui/hero-dithering-card";
import { Stats } from "../components/ui/statistics-card";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LiveDemoSection } from "../components/LiveDemoSection";
import { AgenticFrameworkCarousel } from "../components/AgenticFrameworkCarousel";
import { ComplianceSection } from "../components/ComplianceSection";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { ClientFeedback } from "../components/ui/testimonial";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { SafetyStack } from "../components/ui/safety-stack";
import { HowHanaWorks } from "../components/HowHanaWorks";
import { IntegrationsSection } from "../components/IntegrationsSection";
import { ReadyToUseSection } from "../components/ReadyToUseSection";
import { RecipesMarquee } from "../components/RecipesMarquee";
import { AskAiAboutUs } from "../components/AskAiAboutUs";
import { LatestPosts } from "../components/LatestPosts";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { organizationSchema, websiteSchema, softwareApplicationSchema, faqSchema } from "../components/SEO";

/* Answer-first FAQ for AI answer engines & rich results. Sourced from Hana's
   positioning (see public/llms.txt). Concise, factual, citation-friendly. */
const HOME_FAQ = faqSchema([
  {
    question: "What is Hana Voice AI?",
    answer:
      "Hana is a clinical voice AI platform that automates patient engagement across the full care journey — intake, follow-up, remote monitoring, and care coordination. It deploys AI agents that call, text, and message patients using voice, SMS, and chat, integrates with EHR systems, and is HIPAA-compliant with a BAA available.",
  },
  {
    question: "How is Hana different from a patient portal or a generic AI chatbot?",
    answer:
      "Patient portals and text reminders wait for the patient to act, so slots go empty. Hana picks up the phone and reaches patients the way they actually respond. Unlike generic AI chatbots, Hana reads the chart, knows the patient, and follows clinical care protocols, so it is purpose-built for healthcare workflows rather than repurposed call-center or sales AI.",
  },
  {
    question: "What clinical workflows does Hana support?",
    answer:
      "Hana supports post-discharge follow-up to prevent 30-day readmissions, chronic care management (APCM/CCM) that satisfies CMS billing requirements, structured ADHD and behavioral health intake, medication adherence outreach, and remote patient monitoring that writes back to the EHR.",
  },
  {
    question: "How long does it take to deploy Hana?",
    answer:
      "Hana deploys in weeks, not months. Most teams go live in about 3 weeks — your team tests it on a real line before a single patient is called. It is infrastructure that clinics build on rather than a fixed point solution.",
  },
]);

// Agent ID for the primary agent (Medicaid Redetermination)
const HERO_AGENT_ID = "4224af64-f52d-449b-883c-8fc07a09d669";

interface HomeProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

export function Home({ 
  activeAgentId, 
  webCallStatus, 
  handleStartWebCall, 
  handleEndWebCall 
}: HomeProps) {
  return (
    <div className="space-y-0">
      <SEO
        title="Hana Voice AI | The calls your EHR can't make"
        useExactTitle={true}
        description="Hana works your patient access calls end to end — pre-visit intake, prior auth status checks, no-show recovery, recalls, refills. Reads the chart, makes the call, writes the note back."
        path="/"
        keywords="patient access automation, prior authorization status, no-show recovery, patient recall, AI front desk, clinical voice agents, multi-specialty clinic automation"
        jsonLd={[organizationSchema, websiteSchema, softwareApplicationSchema, HOME_FAQ]}
      />

      {/* §1 — HERO */}
      <CTASection
        onStartCall={() => {
          if (webCallStatus === "idle") {
            handleStartWebCall("hero-agent", HERO_AGENT_ID);
          }
          document.getElementById('live-demo-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        isConnecting={false}
        isActive={false}
        disabled={activeAgentId !== null && activeAgentId !== "hero-agent"}
      />

      {/* §2 — ACTIVE vs PASSIVE (patients-reached chart) — directly below hero */}
      <Stats />

      {/* §3 — HOW IT WORKS (the closed loop) */}
      <LoopDiagram />

      {/* §4 — LIVE DEMO (elevated — best voice proof) */}
      <LiveDemoSection
        activeAgentId={activeAgentId}
        webCallStatus={webCallStatus}
        handleStartWebCall={handleStartWebCall}
        handleEndWebCall={handleEndWebCall}
      />

      {/* §4b — WATCH HANA IN ACTION (video carousel) */}
      <HowHanaWorks />

      {/* §5 — PROOF (testimonials) */}
      <ClientFeedback />

      {/* §6 — WORKFLOWS GRID */}
      <RecipesMarquee />

      {/* §6b — secondary: how it adapts to your clinic */}
      <AgenticFrameworkCarousel />

      {/* §7 — GO LIVE */}
      <InlineImageHeader />

      {/* §8 — INTEGRATIONS (+ No-EHR / SDK tail cards) */}
      <IntegrationsSection />

      {/* §9 — SECURITY: defense-in-depth layered stack */}
      <SafetyStack />

      {/* §9b — TAIL: COMPLIANCE (certs + safety pillars — the credentials view) */}
      <ComplianceSection />

      {/* LATEST FROM THE BLOG — 3 most recent posts */}
      <LatestPosts />

      {/* §10 — ASK AI (demoted out of prime real estate) */}
      <AskAiAboutUs className="py-12 md:py-16" />

      {/* FINAL CTA */}
      <ReadyToUseSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}