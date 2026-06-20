import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Globe, PhoneOff, CheckCircle2, MessageSquare, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const FN_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;

// Single demo agent for the in-browser web call. DAX works out which use case to
// demo during the conversation, so there's no on-page use-case picker anymore.
// TODO: replace with the DAX demo agent id (ElevenLabs "agent_..." or Vapi uuid).
const DEMO_AGENT_ID = "agent_1101kj5rbjvaf3ras919nbh6kdgr";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  // Callback flow: we text the prospect → Hana (DAX) calls them back.
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState<"US" | "EU">("US");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "texted" | "called" | "failed">("idle");
  const [smsError, setSmsError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll demo status while we're waiting on the call.
  useEffect(() => {
    if (smsStatus !== "texted") return;
    const e164 = phone.replace(/[^\d+]/g, "");
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${FN_BASE}/site-demo-status/${encodeURIComponent(e164)}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json().catch(() => ({}));
        if (data.status === "called") { setSmsStatus("called"); }
        else if (data.status === "failed") { setSmsStatus("failed"); setSmsError("We couldn't place the call. Please try again."); }
      } catch { /* keep polling */ }
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [smsStatus, phone]);

  const captureLead = (page: string) => {
    fetch(`${FN_BASE}/leads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), page }),
    }).catch((err) => console.error("Failed to capture lead:", err));
  };

  // Primary: text the prospect, Hana calls them back.
  const handleTextMeClick = async () => {
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim())  errors.name  = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    const e164 = phone.replace(/[^\d+]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) errors.phone = "Enter your number in international format, e.g. +1 555 123 4567.";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});

    setSmsError("");
    setSmsStatus("sending");
    captureLead("live-demo-callback");
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

  // Secondary: simple in-browser web call.
  const handleWebCallClick = () => {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim())  errors.name  = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (Object.keys(errors).length > 0) { setFieldErrors((p) => ({ ...p, ...errors })); return; }
    setFieldErrors({});
    captureLead("live-demo-web-call");
    handleStartWebCall("Demo", DEMO_AGENT_ID);
  };

  const inputClass = (err?: string) =>
    cn(
      "w-full bg-transparent border-b-2 py-3 text-slate-900 text-[16px] placeholder:text-slate-300 focus:outline-none transition-colors",
      err ? "border-red-400" : "border-slate-200 focus:border-slate-900"
    );
  const labelClass = "block text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-600 mb-1.5";

  return (
    <section id="live-demo-section" className="py-12 sm:py-16 lg:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Headline */}
        <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] text-center mb-4 tracking-tight">
          Don't take our word for it.<br />Take the call.
        </h2>
        <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-14 leading-relaxed">
          Drop your number and Hana calls you right now — the agent works out the right demo as you talk.
        </p>

        {/* Two-column card */}
        <div className="flex flex-col lg:flex-row gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Left — video */}
          <div className="relative lg:w-[48%] bg-slate-50 min-h-[260px] lg:min-h-[480px]">
            <video
              src="/video1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right — form / call */}
          <div className="lg:w-[52%] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">

            <AnimatePresence mode="wait">
              {webCallStatus !== "idle" ? (
                /* Active web-call state */
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
                      {webCallStatus === "active" ? "Speaking with Hana" : "Connecting..."}
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
                /* Form state — callback first, web call below */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full">
                  <p className="text-[17px] text-slate-700 leading-relaxed">
                    Get a live call from Hana and hear how the AI handles a real patient conversation.
                  </p>

                  {/* Name */}
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                      placeholder="Your name"
                      className={inputClass(fieldErrors.name)}
                    />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                      placeholder="you@company.com"
                      className={inputClass(fieldErrors.email)}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                  </div>

                  {/* Phone + region */}
                  <div>
                    <label className={labelClass}>Phone</label>
                    <div className="mb-2 flex items-center gap-1 rounded-md p-0.5 bg-slate-100 max-w-[280px]">
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
                      onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); setSmsError(""); }}
                      placeholder={region === "US" ? "+1 555 123 4567" : "+44 7123 456789"}
                      className={inputClass(fieldErrors.phone)}
                    />
                    {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
                  </div>

                  {/* Primary CTA — text me & call me */}
                  <button
                    onClick={handleTextMeClick}
                    disabled={smsStatus === "sending" || smsStatus === "texted"}
                    className="mt-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-[15px] font-medium rounded-xl py-3.5 hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {smsStatus === "sending"
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Texting…</>
                      : <><Smartphone className="w-4 h-4" /> Text me &amp; call me</>}
                  </button>
                  {smsError && <p className="-mt-2 text-xs text-red-500">{smsError}</p>}

                  {/* Callback flow status */}
                  {(smsStatus === "texted" || smsStatus === "called") && (
                    <div className={cn(
                      "rounded-xl border p-4 text-[13px]",
                      smsStatus === "called" ? "bg-green-50 border-green-200 text-green-800" : "bg-blue-50 border-blue-100 text-blue-800"
                    )}>
                      {smsStatus === "texted" && (
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          Check your texts — Hana will call you right back. 📱
                        </span>
                      )}
                      {smsStatus === "called" && (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Calling you now — pick up your phone! 📞
                        </span>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-1">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">or</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  {/* Secondary — simple web call */}
                  <button
                    onClick={handleWebCallClick}
                    disabled={webCallStatus !== "idle"}
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 text-[14px] font-medium rounded-xl py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    Prefer to talk now? Start a web call →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
