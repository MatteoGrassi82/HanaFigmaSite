import { CTASection } from "../components/ui/hero-dithering-card";
import { Stats } from "../components/ui/statistics-card";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LiveDemoSection } from "../components/LiveDemoSection";
import { AgenticFrameworkCarousel } from "../components/AgenticFrameworkCarousel";
import { RadialOrbitalTimelineDemo } from "./Timeline";
import { ComplianceSection } from "../components/ComplianceSection";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { HowHanaWorks } from "../components/HowHanaWorks";
import { IntegrationsSection } from "../components/IntegrationsSection";
import { ReadyToUseSection } from "../components/ReadyToUseSection";
import { RecipesMarquee } from "../components/RecipesMarquee";
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
      "Unlike patient portals — which see 15–20% engagement — Hana reaches patients by voice and messaging and achieves around 85% weekly engagement. Unlike generic AI chatbots, Hana reads the chart, knows the patient, and follows clinical care protocols, so it is purpose-built for healthcare workflows rather than repurposed call-center or sales AI.",
  },
  {
    question: "What clinical workflows does Hana support?",
    answer:
      "Hana supports post-discharge follow-up to prevent 30-day readmissions, chronic care management (APCM/CCM) that satisfies CMS billing requirements, structured ADHD and behavioral health intake, medication adherence outreach, and remote patient monitoring that writes back to the EHR.",
  },
  {
    question: "How long does it take to deploy Hana?",
    answer:
      "Hana deploys in days, not months. It is infrastructure that clinics build on rather than a fixed point solution, and it has processed more than 2 million patient interactions.",
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
        title="Hana Voice AI | Voice AI Infrastructure for Patient Engagement"
        useExactTitle={true}
        description="Voice AI infrastructure for patient engagement. AI agents that call, text, and message patients across every care workflow. Deploy in days."
        path="/"
        keywords="voice AI infrastructure, healthcare AI, patient engagement automation, clinical voice agents, remote patient monitoring AI"
        jsonLd={[organizationSchema, websiteSchema, softwareApplicationSchema, HOME_FAQ]}
      />

      {/* 1. HERO */}
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


      {/* 3. ENGAGEMENT STATS */}
      <Stats />

      {/* 2. REASONING ENGINE — moved up, core differentiation */}
      <RadialOrbitalTimelineDemo embedded />

      {/* 4. FEATURE CARDS */}
      <AgenticFrameworkCarousel />

      {/* 5. TESTIMONIALS — reordered */}
      <CaseStudiesSection />

      {/* HOW HANA WORKS — video carousel */}
      <HowHanaWorks />

       {/* 8. LIVE DEMO */}
      <LiveDemoSection
        activeAgentId={activeAgentId}
        webCallStatus={webCallStatus}
        handleStartWebCall={handleStartWebCall}
        handleEndWebCall={handleEndWebCall}
      />

      {/* RECIPES MARQUEE */}
      <RecipesMarquee />

      {/* 7. 3-STEP ONBOARDING */}
      <InlineImageHeader />

      {/* 9. COMPLIANCE */}
      <ComplianceSection />

      {/* 6. INTEGRATIONS */}
      <IntegrationsSection />

      {/* 10. FINAL CTA */}
      <ReadyToUseSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}