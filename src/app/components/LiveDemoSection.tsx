import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Globe, PhoneOff, CheckCircle2, Phone, MessageSquare, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const FN_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;

const AGENT_TYPES = ["Intake", "Outreach", "Monitoring", "Coordination"];

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

  // ── "Call my phone" flow: text the prospect → they reply with the agent →
  //    that agent calls them. We poll the edge function for texted → called. ──
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState<"US" | "EU">("US");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "texted" | "called" | "failed">("idle");
  const [smsError, setSmsError] = useState("");
  const [calledAgent, setCalledAgent] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll demo status while we're waiting on the prospect's reply / call.
  useEffect(() => {
    if (smsStatus !== "texted") return;
    const e164 = phone.replace(/[^\d+]/g, "");
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${FN_BASE}/site-demo-status/${encodeURIComponent(e164)}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json().catch(() => ({}));
        if (data.status === "called") { setCalledAgent(data.agent || null); setSmsStatus("called"); }
        else if (data.status === "failed") { setSmsStatus("failed"); setSmsError("We couldn't place the call. Please try again."); }
      } catch { /* keep polling */ }
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [smsStatus, phone]);

  const handleTextMeClick = async () => {
    setSmsError("");
    const e164 = phone.replace(/[^\d+]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
      setSmsError("Enter your number in international format, e.g. +1 555 123 4567.");
      return;
    }
    setSmsStatus("sending");
    try {
      const res = await fetch(`${FN_BASE}/site-demo-start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to: e164, region, name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSmsStatus("idle"); setSmsError(data.error || "Could not send the text."); return; }
      setSmsStatus("texted");
    } catch {
      setSmsStatus("idle");
      setSmsError("Network error. Please try again.");
    }
  };

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
    <section id="live-demo-section" className="py-12 sm:py-16 lg:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Headline */}
        <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] text-center mb-4 tracking-tight">
          Don't take our word for it.<br />Take the call.
        </h2>
        <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-14 leading-relaxed">
          Pick a use case — intake, outreach, monitoring, coordination — and Hana calls you right now.
        </p>

        {/* Two-column card */}
        <div className="flex flex-col lg:flex-row gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Left — orb + tags */}
          <div className="relative lg:w-[48%] bg-slate-50 flex flex-col justify-between p-5 sm:p-6 lg:p-8 min-h-[420px]">
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
            <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-24 sm:pt-36 lg:pt-48">
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
          <div className="lg:w-[52%] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col justify-between">

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

                  {/* Three call options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
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

                    {/* Call My Phone — text, reply with the agent, it calls you */}
                    <div className="flex flex-col items-start gap-3 bg-white border-2 border-slate-200 rounded-xl p-4 text-left">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">Call My Phone</p>
                        <p className="text-[12px] text-slate-500">We text you, reply, Hana calls</p>
                      </div>

                      {/* Region toggle */}
                      <div className="mt-1 flex items-center gap-1 rounded-md p-0.5 bg-slate-100 self-stretch">
                        {(["US", "EU"] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRegion(r)}
                            className={cn(
                              "flex-1 text-[11px] font-medium rounded px-2 py-1 transition-colors",
                              region === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                            )}
                          >
                            {r === "US" ? "🇺🇸 US / Canada" : "🇪🇺 Europe"}
                          </button>
                        ))}
                      </div>

                      <input
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setSmsError(""); }}
                        placeholder={region === "US" ? "+1 555 123 4567" : "+44 7123 456789"}
                        className="self-stretch bg-transparent border-b-2 border-slate-200 focus:border-slate-900 py-2 text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none transition-colors"
                      />
                      {smsError && <p className="text-[11px] text-red-500">{smsError}</p>}

                      <button
                        onClick={handleTextMeClick}
                        disabled={smsStatus === "sending" || smsStatus === "texted"}
                        className="mt-auto self-stretch inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white text-[12px] font-medium rounded-lg py-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
                      >
                        {smsStatus === "sending"
                          ? <><Loader2 className="w-3 h-3 animate-spin" /> Texting…</>
                          : <><MessageSquare className="w-3.5 h-3.5" /> Text me the options</>}
                      </button>
                    </div>

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

                  {/* Text-me flow status */}
                  {(smsStatus === "texted" || smsStatus === "called" || smsStatus === "failed") && (
                    <div className={cn(
                      "mt-1 rounded-xl border p-4 text-[13px]",
                      smsStatus === "called" ? "bg-green-50 border-green-200 text-green-800"
                        : smsStatus === "failed" ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-blue-50 border-blue-100 text-blue-800"
                    )}>
                      {smsStatus === "texted" && (
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          Check your texts — reply with <b>MONITORING</b>, <b>INTAKE</b>, <b>OUTREACH</b>, or <b>COORDINATION</b> and that agent will call you.
                        </span>
                      )}
                      {smsStatus === "called" && (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Calling you now with the <b>{calledAgent || "selected"}</b> agent — pick up your phone! 📞
                        </span>
                      )}
                      {smsStatus === "failed" && <span>{smsError}</span>}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
