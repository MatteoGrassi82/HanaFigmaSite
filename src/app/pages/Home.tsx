import { lazy, Suspense } from "react";
import { CTASection } from "../components/ui/hero-dithering-card";
import { InlineImageHeader } from "../components/InlineImageHeader";
import { LiveDemoSection } from "../components/LiveDemoSection";
import { useTranslations, getLocale } from "../../lib/i18n";
// Below-the-fold + heavy (Remotion + react-slick): code-split so they don't ship in the homepage critical bundle.
const AgenticFrameworkCarousel = lazy(() => import("../components/AgenticFrameworkCarousel").then((m) => ({ default: m.AgenticFrameworkCarousel })));
import { ComplianceSection } from "../components/ComplianceSection";
import { FrontDeskBento } from "../components/FrontDeskBento";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { ProofBento } from "../components/ui/proof-bento";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { SafetyStack } from "../components/ui/safety-stack";
const HowHanaWorks = lazy(() => import("../components/HowHanaWorks").then((m) => ({ default: m.HowHanaWorks })));
import { IntegrationsSection } from "../components/IntegrationsSection";
import { ReadyToUseSection } from "../components/ReadyToUseSection";
import { RecipesMarquee } from "../components/RecipesMarquee";
import { AskAiAboutUs } from "../components/AskAiAboutUs";
import { LatestPosts } from "../components/LatestPosts";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { organizationSchema, websiteSchema, softwareApplicationSchema, faqSchema } from "../components/SEO";

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
  const t = useTranslations();
  const homeFaq = faqSchema(t.homeSeo.faq);
  // On Italian, HowHanaWorks renders the same Remotion animations as
  // AgenticFrameworkCarousel above — drop it to avoid showing the section twice.
  const isItalian = getLocale() === "it";
  return (
    <div className="space-y-0 overflow-x-hidden">
      <SEO
        title={t.homeSeo.title}
        useExactTitle={true}
        description={t.homeSeo.description}
        path="/"
        keywords="patient access automation, prior authorization status, no-show recovery, patient recall, AI front desk, clinical voice agents, multi-specialty clinic automation"
        jsonLd={[organizationSchema, websiteSchema, softwareApplicationSchema, homeFaq]}
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

      {/* §2 — HOW IT WORKS
          Wrapper overlaps 128px into the hero (no bg — transparent, shows dithering).
          The absolute gradient div at the top fades hero → navy across that overlap zone. */}
      <div className="relative -mt-32 pt-32 z-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(0,18,47,0) 0%, #00122F 100%)" }}
        />
        <LoopDiagram />
      </div>

      {/* §4 — LIVE DEMO (elevated — best voice proof) */}
      <LiveDemoSection
        activeAgentId={activeAgentId}
        webCallStatus={webCallStatus}
        handleStartWebCall={handleStartWebCall}
        handleEndWebCall={handleEndWebCall}
      />

      {/* §5 — PROOF (customer proof bento) */}
      <ProofBento />

      {/* §6 — WORKFLOWS GRID */}
      <RecipesMarquee />

      {/* §6b — secondary: how it adapts to your clinic */}
      <Suspense fallback={null}>
        <AgenticFrameworkCarousel />
      </Suspense>

      {/* §6c — EVERYTHING YOUR FRONT DESK CAN'T GET TO (feature bento) */}
      <FrontDeskBento />

      {/* §7 — GO LIVE */}
      <InlineImageHeader />

      {/* §8 — INTEGRATIONS (+ No-EHR / SDK tail cards) */}
      <IntegrationsSection />

      {/* §9 — SECURITY: defense-in-depth layered stack */}
      <SafetyStack />

      {/* WATCH HANA IN ACTION (Wistia video carousel) — moved below security/safety.
          Hidden on Italian: it would duplicate the Remotion animations already
          shown in AgenticFrameworkCarousel above. */}
      {!isItalian && (
        <Suspense fallback={null}>
          <HowHanaWorks />
        </Suspense>
      )}

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