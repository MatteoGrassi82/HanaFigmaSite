import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Globe, PhoneOff, CheckCircle2, Phone } from "lucide-react";
import { cn } from "../../lib/utils";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const AGENT_TYPES = ["Monitoring", "Intake", "Outreach", "Coordination"];

const ELEVENLABS_AGENT_IDS: Record<string, string> = {
  "Monitoring":   "agent_2301kj5dz760fm7s6g6x67qmc07n",
  "Intake":       "agent_1101kj5rbjvaf3ras919nbh6kdgr",
  "Outreach":     "agent_3901kj5srm7qfn9bw93qtxv3nbmc",
  "Coordination": "agent_5701kj5se9gtf79t3edtyynwvpgh"
};

const AGENT_PHONE_NUMBERS: Record<string, { US: string; UK: string }> = {
  "Outreach":     { US: "+1 938 201 9945", UK: "+44 7426 780324" },
  "Monitoring":   { US: "+1 463 217 0155", UK: "+44 7883 291917" },
  "Coordination": { US: "+1 231 310 3794", UK: "+44 7429 947032" },
  "Intake":       { US: "+1 984 224 7846", UK: "+44 7897 023174" },
};

interface LiveDemoSectionProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

export function LiveDemoSection({
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
}: LiveDemoSectionProps) {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ agent?: string; name?: string; email?: string }>({});

  const handleWebCallClick = async () => {
    const errors: { agent?: string; name?: string; email?: string } = {};
    if (!selectedAgent)  errors.agent = "Please select a use case";
    if (!name.trim())    errors.name  = "Name is required";
    if (!email.trim())   errors.email = "Email is required";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});

    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1/leads`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${publicAnonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), agent: selectedAgent, workflow: selectedAgent, page: "live-demo-web-call" }),
      });
    } catch (err) {
      console.error("Failed to capture lead:", err);
    }

    handleStartWebCall(selectedAgent, ELEVENLABS_AGENT_IDS[selectedAgent]);
  };

  return (
    <section id="live-demo-section" className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Headline */}
        <h2 className="font-serif text-5xl md:text-7xl text-slate-900 leading-[1.0] text-center mb-14 tracking-tight">
          Try Our<br />Live Demo
        </h2>

        {/* Two-column card */}
        <div className="flex flex-col lg:flex-row gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Left — orb + tags */}
          <div className="relative lg:w-[48%] bg-slate-50 flex flex-col justify-between p-8 min-h-[420px]">
            {/* Video */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <video
                src="/video1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Agent tags — bottom */}
            <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-48">
              {AGENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { setSelectedAgent(type); setFieldErrors(p => ({ ...p, agent: undefined })); }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150",
                    selectedAgent === type
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:w-[52%] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-8 flex flex-col justify-between">

            <AnimatePresence mode="wait">
              {webCallStatus !== "idle" ? (
                /* Active call state */
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-8"
                >
                  <div className="relative w-24 h-24">
                    {webCallStatus === "connecting" && (
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                    )}
                    {webCallStatus === "active" && (
                      <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" />
                    )}
                    <div className={cn(
                      "absolute inset-2 bg-white rounded-full flex items-center justify-center border shadow-sm",
                      webCallStatus === "active" ? "border-green-100" : "border-blue-100"
                    )}>
                      <Globe className={cn("w-8 h-8", webCallStatus === "active" ? "text-green-600" : "text-blue-600")} />
                    </div>
                    <div className={cn(
                      "absolute -right-1 -top-1 text-white p-1.5 rounded-full border-4 border-slate-50",
                      webCallStatus === "active" ? "bg-green-500" : "bg-blue-500"
                    )}>
                      {webCallStatus === "active"
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    </div>
                  </div>

                  <div>
                    <p className="text-xl font-medium text-slate-900 mb-1">
                      {webCallStatus === "active" ? `Speaking with ${selectedAgent} Agent` : "Connecting..."}
                    </p>
                    <p className="text-sm text-slate-500">
                      {webCallStatus === "active" ? "Click End Call when you're done." : "Establishing connection..."}
                    </p>
                  </div>

                  <button
                    onClick={handleEndWebCall}
                    className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="w-4 h-4" /> End Call
                  </button>
                </motion.div>
              ) : (
                /* Form state */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full">
                  <p className="text-[17px] text-slate-700 leading-relaxed">
                    Receive a live call from our agent and discover how our AI caller transforms patient conversations.
                  </p>

                  {/* Selected use case indicator */}
                  {selectedAgent ? (
                    <p className="text-[13px] text-slate-500">Use case: <span className="font-semibold text-slate-900">{selectedAgent}</span></p>
                  ) : (
                    <p className="text-[13px] text-slate-400 italic">Select a use case from the left →</p>
                  )}
                  {fieldErrors.agent && <p className="text-xs text-red-500">{fieldErrors.agent}</p>}

                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                      placeholder="Your Name"
                      className={cn(
                        "w-full bg-transparent border-b-2 py-3 text-slate-900 text-[16px] placeholder:text-slate-300 focus:outline-none transition-colors",
                        fieldErrors.name ? "border-red-400" : "border-slate-200 focus:border-slate-900"
                      )}
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                      placeholder="you@company.com"
                      className={cn(
                        "w-full bg-transparent border-b-2 py-3 text-slate-900 text-[16px] placeholder:text-slate-300 focus:outline-none transition-colors",
                        fieldErrors.email ? "border-red-400" : "border-slate-200 focus:border-slate-900"
                      )}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                  </div>

                  {/* Two call options */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {/* Web call */}
                    <button
                      onClick={handleWebCallClick}
                      disabled={webCallStatus !== "idle"}
                      className="flex flex-col items-start gap-3 bg-white border-2 border-slate-200 hover:border-slate-900 rounded-xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">Web Call</p>
                        <p className="text-[12px] text-slate-500">Talk in your browser</p>
                      </div>
                      <span className="mt-auto text-[12px] font-medium text-blue-600 flex items-center gap-1">
                        {webCallStatus === "connecting" ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Connecting...</>
                        ) : "Start now →"}
                      </span>
                    </button>

                    {/* Phone call */}
                    <div className="flex flex-col items-start gap-3 bg-white border-2 border-slate-200 rounded-xl p-4 text-left">
                      <Phone className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">Call Us</p>
                        <p className="text-[12px] text-slate-500">Dial from your phone</p>
                      </div>
                      {selectedAgent ? (
                        <div className="mt-auto space-y-0.5">
                          <a href={`tel:${AGENT_PHONE_NUMBERS[selectedAgent].US.replace(/\s/g,"")}`} className="block text-[12px] font-medium text-blue-600 hover:underline">
                            🇺🇸 {AGENT_PHONE_NUMBERS[selectedAgent].US}
                          </a>
                          <a href={`tel:${AGENT_PHONE_NUMBERS[selectedAgent].UK.replace(/\s/g,"")}`} className="block text-[12px] font-medium text-blue-600 hover:underline">
                            🇬🇧 {AGENT_PHONE_NUMBERS[selectedAgent].UK}
                          </a>
                        </div>
                      ) : (
                        <p className="mt-auto text-[12px] text-slate-400">Select a use case first</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
