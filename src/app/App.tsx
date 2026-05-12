import { useState, useEffect, useRef } from "react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { toast, Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Navbar } from "./components/Navbar";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { SEO } from "./components/SEO";
import { GoogleTagManager } from "./components/GoogleTagManager";
import { Home } from "./pages/Home";
import { Research } from "./pages/Research";
import { About } from "./pages/About";
import { RadialOrbitalTimelineDemo } from "./pages/Timeline";
import { Contact } from "./pages/Contact";
import { TestWebhook } from "./components/TestWebhook";
import { Terms } from "./pages/Terms";
import { AUP } from "./pages/AUP";
import { StateOfAI } from "./pages/StateOfAI";
import { Pricing } from "./pages/Pricing";
import { CaseStudies } from "./pages/CaseStudies";
import { VideoAskWidget } from "./components/VideoAskWidget";

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
    const isElevenLabs = assistantId.startsWith("agent_");

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
        await vapiRef.current.start(assistantId);
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

  return (
    <BrowserRouter>
        <SEO />
        <GoogleTagManager />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-12 relative overflow-x-hidden">
          <Toaster position="top-center" />

          <AnnouncementBar />
          <Navbar />
          <VideoAskWidget />

          <main>
            <Routes>
              <Route path="/" element={
                <Home
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
              <Route path="/use-cases" element={<Navigate to="/case-studies" replace />} />
              <Route path="/timeline" element={<RadialOrbitalTimelineDemo />} />
              <Route path="/research" element={<Research />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/test-webhook" element={<TestWebhook />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/aup" element={<AUP />} />
              <Route path="/state-of-ai" element={<StateOfAI />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/case-studies" element={
                <CaseStudies
                  activeAgentId={activeAgentId}
                  webCallStatus={webCallStatus}
                  handleStartWebCall={handleStartWebCall}
                  handleEndWebCall={handleEndWebCall}
                />
              } />
            </Routes>
          </main>
        </div>
    </BrowserRouter>
  );
}
