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
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { organizationSchema, websiteSchema, softwareApplicationSchema } from "../components/SEO";

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
        jsonLd={[organizationSchema, websiteSchema, softwareApplicationSchema]}
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
      <RadialOrbitalTimelineDemo />

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

      {/* 6. INTEGRATIONS */}
      <IntegrationsSection />

      {/* 7. 3-STEP ONBOARDING */}
      <InlineImageHeader />


      {/* 9. COMPLIANCE */}
      <ComplianceSection />

      {/* 10. FINAL CTA */}
      <ReadyToUseSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}