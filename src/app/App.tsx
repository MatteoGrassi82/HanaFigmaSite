import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { toast, Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Navbar } from "./components/layout/Navbar";
import { getLocale } from "../lib/i18n";
import { Home } from "./pages/Home";

// Route components are code-split — each page is fetched on demand so the initial
// download is just the chrome + the landing page, not all 20 routes at once.
// React.lazy needs a default export, so named page exports are mapped through.
const Research = lazy(() => import("./pages/Research").then((m) => ({ default: m.Research })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const RadialOrbitalTimelineDemo = lazy(() => import("./pages/Timeline").then((m) => ({ default: m.RadialOrbitalTimelineDemo })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const HanaContact = lazy(() => import("./pages/HanaContact").then((m) => ({ default: m.HanaContact })));
const HanaRemote = lazy(() => import("./pages/HanaRemote").then((m) => ({ default: m.HanaRemote })));
const HanaSleep = lazy(() => import("./pages/HanaSleep").then((m) => ({ default: m.HanaSleep })));
const HanaSleepAnalysis = lazy(() => import("./pages/HanaSleepAnalysis").then((m) => ({ default: m.HanaSleepAnalysis })));
const HanaSleepCPAP = lazy(() => import("./pages/HanaSleepCPAP").then((m) => ({ default: m.HanaSleepCPAP })));
const TestWebhook = lazy(() => import("./components/dev/TestWebhook").then((m) => ({ default: m.TestWebhook })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const AUP = lazy(() => import("./pages/AUP").then((m) => ({ default: m.AUP })));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Cookies = lazy(() => import("./pages/Cookies").then((m) => ({ default: m.Cookies })));
const StateOfAI = lazy(() => import("./pages/StateOfAI").then((m) => ({ default: m.StateOfAI })));
const Pricing = lazy(() => import("./pages/Pricing").then((m) => ({ default: m.Pricing })));
const CaseStudies = lazy(() => import("./pages/CaseStudies").then((m) => ({ default: m.CaseStudies })));
const Access = lazy(() => import("./pages/Access").then((m) => ({ default: m.Access })));
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const WhitepaperADHD = lazy(() => import("./pages/WhitepaperADHD").then((m) => ({ default: m.WhitepaperADHD })));
const Whitepapers = lazy(() => import("./pages/Whitepapers").then((m) => ({ default: m.Whitepapers })));
const Demo = lazy(() => import("./pages/Demo").then((m) => ({ default: m.Demo })));
const Preview = lazy(() => import("./pages/Preview").then((m) => ({ default: m.Preview })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));
const BentoShowcase = lazy(() => import("./pages/BentoShowcase").then((m) => ({ default: m.BentoShowcase })));
const ProofShowcase = lazy(() => import("./pages/ProofShowcase").then((m) => ({ default: m.ProofShowcase })));
const RemoteV2 = lazy(() => import("./pages/RemoteV2").then((m) => ({ default: m.RemoteV2 })));
const RemoteLab = lazy(() => import("./pages/RemoteLab").then((m) => ({ default: m.RemoteLab })));
const Programs = lazy(() => import("./pages/Programs").then((m) => ({ default: m.Programs })));
const ChronicCareManagement = lazy(() =>
  import("./pages/ChronicCareManagement").then((m) => ({ default: m.ChronicCareManagement }))
);
const AdvancedPrimaryCareManagement = lazy(() =>
  import("./pages/AdvancedPrimaryCareManagement").then((m) => ({ default: m.AdvancedPrimaryCareManagement }))
);
const BehavioralHealthIntegration = lazy(() =>
  import("./pages/BehavioralHealthIntegration").then((m) => ({ default: m.BehavioralHealthIntegration }))
);
const RemoteTherapeuticMonitoring = lazy(() =>
  import("./pages/RemoteTherapeuticMonitoring").then((m) => ({ default: m.RemoteTherapeuticMonitoring }))
);
const ForPractices = lazy(() => import("./pages/ForPractices").then((m) => ({ default: m.ForPractices })));
const ForHealthSystems = lazy(() => import("./pages/ForHealthSystems").then((m) => ({ default: m.ForHealthSystems })));
const VsCareManagementSoftware = lazy(() =>
  import("./pages/compare/VsCareManagementSoftware").then((m) => ({ default: m.VsCareManagementSoftware }))
);
const VsOutsourcedCareManagement = lazy(() =>
  import("./pages/compare/VsOutsourcedCareManagement").then((m) => ({ default: m.VsOutsourcedCareManagement }))
);
const VsDoingNothing = lazy(() =>
  import("./pages/compare/VsDoingNothing").then((m) => ({ default: m.VsDoingNothing }))
);
const Security = lazy(() => import("./pages/Security").then((m) => ({ default: m.Security })));
const Academy = lazy(() => import("./pages/Academy").then((m) => ({ default: m.Academy })));
const Faq = lazy(() => import("./pages/Faq").then((m) => ({ default: m.Faq })));
const RemotePhysiologicMonitoring = lazy(() =>
  import("./pages/RemotePhysiologicMonitoring").then((m) => ({ default: m.RemotePhysiologicMonitoring }))
);
const PrincipalCareManagement = lazy(() =>
  import("./pages/PrincipalCareManagement").then((m) => ({ default: m.PrincipalCareManagement }))
);
const TransitionalCareManagement = lazy(() =>
  import("./pages/TransitionalCareManagement").then((m) => ({ default: m.TransitionalCareManagement }))
);

// Configuration
const VAPI_PUBLIC_KEY = "5dfc26c6-90a6-4efe-907b-7bd0d690dc6e";

export default function App() {
  return (
    <ConversationProvider>
      <AppContent />
    </ConversationProvider>
  );
}

function AppContent() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [webCallStatus, setWebCallStatus] = useState<"idle" | "connecting" | "active">("idle");
  const vapiRef = useRef<any>(null);
  const vapiLoadedRef = useRef(false);

  const elevenLabsConversation = useConversation({
    onConnect: () => {
      setWebCallStatus("active");
      toast.success("Call Connected", { description: "You are now speaking with the agent." });
    },
    onDisconnect: () => {
      setWebCallStatus("idle");
      setActiveAgentId(null);
      toast.info("Call Ended");
    },
    onError: (error: any) => {
      const msg: string = error?.message ?? String(error);
      setWebCallStatus("idle");
      setActiveAgentId(null);
      if (msg.includes("Permission") || msg.includes("denied") || msg.includes("NotAllowed")) {
        toast.error("Microphone Permission Denied", {
          description: "Please allow microphone access and try again."
        });
      } else if (msg.includes("capacity")) {
        toast.error("Agent Unavailable", {
          description: "Agent is at max capacity. Please try again in a moment."
        });
      } else {
        toast.error("Connection failed", { description: msg || "Could not connect to the agent." });
      }
    },
    onModeChange: (mode: any) => {
      console.log("[ElevenLabs] Mode changed to:", mode);
    },
  });

  // Lazily initialize Vapi SDK inside useEffect to avoid crashing at module load
  useEffect(() => {
    let cancelled = false;

    async function initVapi() {
      if (vapiLoadedRef.current) return;
      try {
        const VapiModule = await import("@vapi-ai/web");
        const VapiClass = VapiModule.default || VapiModule;
        if (cancelled) return;
        vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);
        vapiLoadedRef.current = true;

        vapiRef.current.on("call-start", () => {
          setWebCallStatus("active");
          toast.success("Call Connected", { description: "You are now speaking with the agent." });
        });

        vapiRef.current.on("call-end", () => {
          setWebCallStatus("idle");
          setActiveAgentId(null);
          toast.info("Call Ended");
        });

        vapiRef.current.on("error", (e: any) => {
          console.error("Vapi Error:", e);
          setWebCallStatus("idle");
          setActiveAgentId(null);

          if (e.error?.statusCode === 401 || e.message?.includes("Invalid Key") || e.error?.message?.includes("Invalid Key")) {
            toast.error("Authentication Failed", { description: "Public Key appears to be invalid." });
          } else {
            toast.error("Connection failed", { description: "Could not connect to the agent." });
          }
        });
      } catch (err) {
        console.warn("Vapi SDK could not be loaded (voice features disabled):", err);
      }
    }

    initVapi();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartWebCall = async (agentId: string, assistantId: string) => {
    // assistantId is one of: "agent_…" (ElevenLabs), "squad:<uuid>" (Vapi squad
    // — greeter routes to the specialists), or a bare uuid (single Vapi assistant).
    const isElevenLabs = assistantId.startsWith("agent_");
    const isSquad = assistantId.startsWith("squad:");
    const squadId = isSquad ? assistantId.slice("squad:".length) : null;

    if (isElevenLabs) {
      if (activeAgentId && activeAgentId !== agentId) return;

      setActiveAgentId(agentId);
      setWebCallStatus("connecting");

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err: any) {
        setWebCallStatus("idle");
        setActiveAgentId(null);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          toast.error("Microphone Access Blocked", {
            description: "Browser denied microphone access. Check permissions or try opening in a new window."
          });
        } else {
          toast.error("Microphone Error", {
            description: "Could not access microphone. Please check your device settings."
          });
        }
        return;
      }

      try {
        elevenLabsConversation.startSession({
          agentId: assistantId,
          connectionType: "websocket",
        });
      } catch (error: any) {
        setWebCallStatus("idle");
        setActiveAgentId(null);
        toast.error("Failed to start call", {
          description: error?.message || "Could not connect to the agent."
        });
      }
    } else {
      if (!vapiRef.current) {
        toast.error("Voice SDK not loaded", { description: "Please wait a moment and try again." });
        return;
      }

      if (activeAgentId && activeAgentId !== agentId) return;

      setActiveAgentId(agentId);
      setWebCallStatus("connecting");

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err: any) {
        setWebCallStatus("idle");
        setActiveAgentId(null);

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          toast.error("Microphone Access Blocked", {
            description: "Browser denied microphone access. Check permissions or try opening in a new window."
          });
        } else {
          console.error("Microphone Error:", err);
          toast.error("Microphone Error", {
            description: "Could not access microphone. Please check your device settings."
          });
        }
        return;
      }

      try {
        // Vapi's start() is positional: start(assistant, overrides, squad, …).
        // A squad goes in the 3rd slot; a single assistant in the 1st.
        if (squadId) {
          await vapiRef.current.start(undefined, undefined, squadId);
        } else {
          await vapiRef.current.start(assistantId);
        }
      } catch (error) {
        console.error("Vapi start error:", error);
        setWebCallStatus("idle");
        setActiveAgentId(null);
      }
    }
  };

  const handleEndWebCall = () => {
    elevenLabsConversation.endSession();
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  // The Access page is a US-specific promo; it doesn't apply to the Italian
  // site, so we drop its route.
  const isItalian = getLocale() === "it";

  return (
    <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-paper-2 dark:bg-navy font-sans text-ink dark:text-slate-100 pb-12 relative">
          <Toaster position="top-center" />

          <Navbar />

          <main>
            <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={
                <Home
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              {!isItalian && <Route path="/use-cases" element={<Navigate to="/case-studies" replace />} />}
              <Route path="/timeline" element={<RadialOrbitalTimelineDemo />} />
              <Route path="/labs" element={<Research />} />
              <Route path="/research" element={<Navigate to="/labs" replace />} />
              {/* Renamed 6 Sept 2026. The real 301s live in vercel.json; these
                  only catch in-app navigation from a stale internal link. */}
              <Route path="/hana-sleep" element={<Navigate to="/sleep" replace />} />
              <Route path="/hana-sleep/analysis" element={<Navigate to="/sleep/analysis" replace />} />
              <Route path="/hana-sleep/cpap" element={<Navigate to="/sleep/cpap" replace />} />
              <Route path="/access" element={<Navigate to="/programs/access-model" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/hana-contact" element={<HanaContact />} />
              <Route path="/hana-remote" element={<HanaRemote />} />
              <Route path="/sleep" element={<HanaSleep />} />
              <Route path="/sleep/analysis" element={<HanaSleepAnalysis />} />
              <Route path="/sleep/cpap" element={<HanaSleepCPAP />} />
              <Route path="/test-webhook" element={<TestWebhook />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/aup" element={<AUP />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              {!isItalian && <Route path="/state-of-ai" element={<StateOfAI />} />}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/whitepapers" element={<Whitepapers />} />
              <Route path="/whitepapers/adhd-intake" element={<WhitepaperADHD />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/bento" element={<BentoShowcase />} />
              <Route path="/proof" element={<ProofShowcase />} />
              <Route path="/remote-lab" element={<RemoteLab />} />
              <Route path="/programs" element={
                <Programs
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/chronic-care-management" element={
                <ChronicCareManagement
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/advanced-primary-care-management" element={
                <AdvancedPrimaryCareManagement
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/behavioral-health-integration" element={
                <BehavioralHealthIntegration
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/remote-therapeutic-monitoring" element={
                <RemoteTherapeuticMonitoring
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/remote-physiologic-monitoring" element={
                <RemotePhysiologicMonitoring
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/principal-care-management" element={
                <PrincipalCareManagement
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/programs/transitional-care-management" element={
                <TransitionalCareManagement
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/for-practices" element={
                <ForPractices
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/for-health-systems" element={
                <ForHealthSystems
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/compare/vs-care-management-software" element={
                <VsCareManagementSoftware
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/compare/vs-outsourced-care-management" element={
                <VsOutsourcedCareManagement
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/compare/vs-doing-nothing" element={
                <VsDoingNothing
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/security" element={
                <Security
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/academy" element={<Academy />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/remote-v2" element={
                <RemoteV2
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              {!isItalian && (
                <Route path="/case-studies" element={
                  <CaseStudies
                    activeAgentId={activeAgentId}
                    webCallStatus={webCallStatus}
                    handleStartWebCall={handleStartWebCall}
                    handleEndWebCall={handleEndWebCall}
                  />
                } />
              )}
              {!isItalian && (
                <Route path="/programs/access-model" element={
                  <Access
                    activeAgentId={activeAgentId}
                    webCallStatus={webCallStatus}
                    handleStartWebCall={handleStartWebCall}
                    handleEndWebCall={handleEndWebCall}
                  />
                } />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>
        </div>
    </BrowserRouter>
  );
}
