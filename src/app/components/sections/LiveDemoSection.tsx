import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Globe, PhoneOff, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";
import { HanaBloomOrb } from "../media/HanaBloomOrb";
import { useTranslations, getLocale } from "../../../lib/i18n";

const FN_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1`;

// The SMS callback flow sends `lang` so the backend dials the Italian Vapi
// assistant twins (see docs/italian-demo-agents-handoff.md). The in-browser web
// call uses a Vapi SQUAD; there's no Italian squad yet, so set IT_DEMO_AGENT_ID
// to an Italian "squad:<id>" once it exists to route the web call too.
const IT_DEMO_AGENT_ID: string | null = null;

// In-browser web call: a Vapi SQUAD. A greeter agent asks what the visitor wants
// to try, then hands off to the matching specialist (monitoring / intake /
// outreach / coordination) — so there's no on-page use-case picker. The "squad:"
// prefix tells handleStartWebCall to start a squad rather than a single assistant
// (mirrors the "agent_" prefix that routes to ElevenLabs).
const DEMO_AGENT_ID = "squad:91b2273e-a3b2-46df-af20-193b50054921";

// Text-in demo. The visitor texts a keyword to our Telnyx number and the Pipecat
// agent rings them back on it. Keywords are matched server-side against the agent's
// own persona keys (kat-clinic/agents/sitedemo.json), so these four strings must stay
// spelled exactly as the persona keys are — change one here and the reply silently
// falls through to the default persona.
// Region-aware: an EU visitor asked to text a US number pays international rates and
// reads it as spam. The UK number is Twilio, the US one Telnyx — the bot works out
// which carrier sent a webhook from the request itself, so both drive the same flow.
// EU numbers cannot be bought on Telnyx without local address + ID documentation
// (Ofcom/ComReg/AGCOM all require it), which a Delaware corporation cannot supply.
const TEXT_IN_NUMBERS = { US: "+13135146395", EU: "+447897023174" } as const;
const TEXT_IN_OPTIONS = [
  { keyword: "MONITORING",   labelKey: "optMonitoring",   subKey: "optMonitoringSub" },
  { keyword: "INTAKE",       labelKey: "optIntake",       subKey: "optIntakeSub" },
  { keyword: "OUTREACH",     labelKey: "optOutreach",     subKey: "optOutreachSub" },
  { keyword: "COORDINATION", labelKey: "optCoordination", subKey: "optCoordinationSub" },
] as const;

interface LiveDemoSectionProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
  /** Render only the form and its call states: no <section>, no heading, no
   *  card, no orb. Lets another section host the real, working form rather than
   *  copy its logic. */
  bare?: boolean;
  /** With `bare`, "panel" keeps the grey surface; "glass" draws nothing, for a
   *  host that supplies its own card. */
  bareSurface?: "panel" | "glass";
}

export function LiveDemoSection({
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
  bare = false,
  bareSurface = "glass",
}: LiveDemoSectionProps) {
  const t = useTranslations();
  const ld = t.liveDemo;
  const isItalian = getLocale() === "it";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  // Region only picks which number the visitor texts; nothing is sent from here.
  // Italian site serves EU only (UK/EU agent); US/Canada is not offered there.
  const [region, setRegion] = useState<"US" | "EU">(isItalian ? "EU" : "US");


  // Lead notification → Resend (via our Vercel function), not Zapier.
  const captureLead = (page: string) => {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        page,
      }),
    }).catch((err) => console.error("Failed to capture lead:", err));
  };


  // Secondary: simple in-browser web call.
  const handleWebCallClick = () => {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim())  errors.name  = ld.fieldNameRequired;
    if (!email.trim()) errors.email = ld.fieldEmailRequired;
    if (Object.keys(errors).length > 0) { setFieldErrors((p) => ({ ...p, ...errors })); return; }
    setFieldErrors({});
    captureLead("live-demo-web-call");
    handleStartWebCall("Demo", isItalian && IT_DEMO_AGENT_ID ? IT_DEMO_AGENT_ID : DEMO_AGENT_ID);
  };

  const inputClass = (err?: string) =>
    cn(
      "w-full bg-transparent border-0 border-b-[1.5px] py-2 text-[#00122f] text-[17px] placeholder:text-[#b3bdcc] focus:outline-none transition-colors",
      err ? "border-red-400" : "border-[#dfe3ee] focus:border-[#5b76d9]"
    );
  const labelClass = "block text-[12px] font-bold uppercase tracking-[2.2px] text-[#5b76d9] mb-3";

  /* The working form and its call states. Kept in one place so another section
     can host the real thing through `bare` instead of copying the logic. */
  const formPanel = (
    <>
  
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
                        {webCallStatus === "active" ? ld.speakingWithHana : ld.connecting}
                      </p>
                      <p className="text-sm text-slate-500">
                        {webCallStatus === "active" ? ld.clickEndCall : ld.establishingConnection}
                      </p>
                    </div>
  
                    <button
                      onClick={handleEndWebCall}
                      className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
                    >
                      <PhoneOff className="w-4 h-4" /> {ld.endCall}
                    </button>
                  </motion.div>
                ) : (
                  /* Form state — callback first, web call below */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                    {/* In `bare` mode the host section already carries the
                        headline and the sub, so the card does not repeat them
                        (Matteo 2026-09-02). Home keeps both. */}
                    <div className={bare ? "hidden" : undefined}>
                      <p className="text-[24px] leading-[1.42] text-[#00122f] font-normal max-w-[30ch] mb-3">
                        {ld.formHeading}
                      </p>
                      <p className="text-[15px] leading-[1.7] text-[#64748b] max-w-[42ch]">
                        {ld.formSubheading}
                      </p>
                    </div>
  
                    {/* Name */}
                    <div>
                      <label className={labelClass}>{ld.nameLabel}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                        placeholder={ld.namePlaceholder}
                        className={inputClass(fieldErrors.name)}
                      />
                      {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                    </div>
  
                    {/* Email */}
                    <div>
                      <label className={labelClass}>{ld.emailLabel}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                        placeholder="you@company.com"
                        className={inputClass(fieldErrors.email)}
                      />
                      {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>
  
                    {/* Text-in demo — the path that works in the US today.
                        The visitor sends the keyword, so there is NO outbound SMS in
                        this flow and nothing for A2P 10DLC to gate. It also verifies
                        the number for free: you cannot text from a number you do not
                        hold, which is the same proof the old outbound round-trip was
                        there to get. The page carries the four options because a
                        screen has room to explain them and a text message does not. */}
                    <div className="rounded-xl border border-[#dfe5f0] bg-[#f7f9fd] p-4">
                      <p className="text-[14px] font-semibold text-[#1e2a3a]">{ld.textInHeading}</p>
                      <p className="mt-1 text-[12px] leading-snug text-[#5c6879]">{ld.textInBody}</p>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TEXT_IN_OPTIONS.map((o) => (
                          <a
                            key={o.keyword}
                            href={`sms:${TEXT_IN_NUMBERS[region]}?&body=${encodeURIComponent(o.keyword)}`}
                            onClick={() => captureLead(`live-demo-textin-${o.keyword.toLowerCase()}`)}
                            className="block rounded-lg border border-[#dfe5f0] bg-white px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#1e2a3a] hover:shadow-[0_6px_16px_rgba(0,18,47,0.10)]"
                          >
                            <span className="block text-[13px] font-semibold text-[#1e2a3a]">{ld[o.labelKey]}</span>
                            <span className="block mt-0.5 text-[11px] leading-snug text-[#6b7789]">{ld[o.subKey]}</span>
                            <span className="block mt-1 text-[10px] font-mono tracking-wide text-[#8b95a5]">{o.keyword}</span>
                          </a>
                        ))}
                      </div>
                      {/* sms: links do nothing on most desktops, so the number and the
                          keyword have to be readable and copyable, not just tappable. */}
                      <p className="mt-3 text-[11px] text-[#6b7789]">
                        {ld.textInFallback}{" "}
                        <span className="font-semibold text-[#1e2a3a]">{TEXT_IN_NUMBERS[region]}</span>
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-0.5">
                      <span className="h-px flex-1 bg-[#e8ebf2]" />
                      <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#94a3b8]">{ld.or}</span>
                      <span className="h-px flex-1 bg-[#e8ebf2]" />
                    </div>
  
                    {/* Secondary — simple web call */}
                    <button
                      onClick={handleWebCallClick}
                      disabled={webCallStatus !== "idle"}
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-white border border-[#dfe3ee] text-[#00122f] text-[16px] font-semibold rounded-xl py-[18px] transition-all hover:-translate-y-0.5 hover:border-[#c7cfe0] hover:shadow-[0_10px_24px_rgba(0,18,47,0.08)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      <Globe className="w-[18px] h-[18px] text-[#5b76d9]" />
                      {ld.webCallButton}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
    </>
  );

  /* Matteo 2026-08-20: the sonic-waveform section on /remote-v2 supplies its own
     heading and card, so it renders this component bare. Home passes nothing. */
  if (bare)
    return (
      <div
        id="live-demo-section"
        className={
          bareSurface === "panel"
            ? "rounded-[20px] bg-[#f6f7fb] border border-[#e8ebf2] p-7 sm:p-10 flex flex-col justify-center"
            : "flex flex-col justify-center"
        }
      >
        {formPanel}
      </div>
    );

  return (
    <section id="live-demo-section" className="py-12 sm:py-16 lg:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Headline */}
        <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] text-center mb-4 tracking-tight">
          {ld.heading}
        </h2>
        <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-14 leading-relaxed">
          {ld.subheading}
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
              <span className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#64748b]">{ld.listeningLabel}</span>
            </div>
          </div>

          {/* Right — form / call */}
          <div className="lg:w-1/2 bg-[#f6f7fb] border-t lg:border-t-0 lg:border-l border-[#e8ebf2] p-7 sm:p-10 lg:p-14 flex flex-col justify-center">
            {formPanel}
          </div>
        </div>
      </div>
    </section>
  );
}
