import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { toast, Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Navbar } from "./components/Navbar";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { getLocale } from "../lib/i18n";
import { VideoAskWidget } from "./components/VideoAskWidget";
import { Home } from "./pages/Home";

// Route components are code-split — each page is fetched on demand so the initial
// download is just the chrome + the landing page, not all 20 routes at once.
// React.lazy needs a default export, so named page exports are mapped through.
const Research = lazy(() => import("./pages/Research").then((m) => ({ default: m.Research })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const RadialOrbitalTimelineDemo = lazy(() => import("./pages/Timeline").then((m) => ({ default: m.RadialOrbitalTimelineDemo })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const TestWebhook = lazy(() => import("./components/TestWebhook").then((m) => ({ default: m.TestWebhook })));
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
  // site, so we drop its route and the announcement bar that links to it.
  const isItalian = getLocale() === "it";

  return (
    <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-12 relative">
          <Toaster position="top-center" />

          {!isItalian && <AnnouncementBar />}
          <Navbar />
          <VideoAskWidget />

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
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
                <Route path="/access" element={
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
