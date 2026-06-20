import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Globe, PhoneOff, CheckCircle2, MessageSquare, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { HanaBloomOrb } from "./ui/hana-bloom-orb";

const FN_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;

// In-browser web call: a Vapi SQUAD. A greeter agent asks what the visitor wants
// to try, then hands off to the matching specialist (monitoring / intake /
// outreach / coordination) — so there's no on-page use-case picker. The "squad:"
// prefix tells handleStartWebCall to start a squad rather than a single assistant
// (mirrors the "agent_" prefix that routes to ElevenLabs).
const DEMO_AGENT_ID = "squad:91b2273e-a3b2-46df-af20-193b50054921";

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
        body: JSON.stringify({ to: e164, region, name: name.trim() || undefined, email: email.trim() || undefined }),
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
      "w-full bg-transparent border-0 border-b-[1.5px] py-2 text-[#00122f] text-[17px] placeholder:text-[#b3bdcc] focus:outline-none transition-colors",
      err ? "border-red-400" : "border-[#dfe3ee] focus:border-[#5b76d9]"
    );
  const labelClass = "block text-[12px] font-bold uppercase tracking-[2.2px] text-[#5b76d9] mb-3";

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
        <div className="flex flex-col lg:flex-row gap-0 border border-[#e8ebf2] rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,18,47,0.10)]">

          {/* Left — fluid bloom orb */}
          <div className="relative lg:w-1/2 bg-white overflow-hidden flex items-center justify-center min-h-[320px] lg:min-h-[520px] px-12 py-16">
            <div className="relative z-10 scale-90 sm:scale-100">
              <HanaBloomOrb />
            </div>

            {/* live caption */}
            <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5b76d9]" style={{ animation: "hana-glow 2.4s ease-in-out infinite" }} />
              <span className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#64748b]">Hana is listening</span>
            </div>
          </div>

          {/* Right — form / call */}
          <div className="lg:w-1/2 bg-[#f6f7fb] border-t lg:border-t-0 lg:border-l border-[#e8ebf2] p-7 sm:p-10 lg:p-14 flex flex-col justify-center">

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
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                  <div>
                    <p className="text-[24px] leading-[1.42] text-[#00122f] font-normal max-w-[30ch] mb-3">
                      Hear Hana handle a real patient conversation.
                    </p>
                    <p className="text-[15px] leading-[1.7] text-[#64748b] max-w-[42ch]">
                      Enter your details and Hana texts you first to confirm, then calls within seconds — so you can experience the AI live.
                    </p>
                  </div>

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
                    <div className="mb-4 inline-flex items-center gap-1 rounded-[10px] p-1 bg-[#eef0f5] border border-[#e2e6f4]">
                      {(["US", "EU"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegion(r)}
                          className={cn(
                            "rounded-[7px] px-4 py-2 text-[14px] font-semibold transition-colors",
                            region === r ? "bg-white text-[#00122f] shadow-[0_1px_3px_rgba(0,18,47,0.12)]" : "text-[#64748b]"
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
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1e2a3a] text-white text-[16px] font-semibold rounded-xl py-[18px] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,18,47,0.18)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {smsStatus === "sending"
                      ? <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Texting…</>
                      : <><Smartphone className="w-[18px] h-[18px]" /> Start</>}
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
                  <div className="flex items-center gap-4 my-0.5">
                    <span className="h-px flex-1 bg-[#e8ebf2]" />
                    <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#94a3b8]">or</span>
                    <span className="h-px flex-1 bg-[#e8ebf2]" />
                  </div>

                  {/* Secondary — simple web call */}
                  <button
                    onClick={handleWebCallClick}
                    disabled={webCallStatus !== "idle"}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-white border border-[#dfe3ee] text-[#00122f] text-[16px] font-semibold rounded-xl py-[18px] transition-all hover:-translate-y-0.5 hover:border-[#c7cfe0] hover:shadow-[0_10px_24px_rgba(0,18,47,0.08)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <Globe className="w-[18px] h-[18px] text-[#5b76d9]" />
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
