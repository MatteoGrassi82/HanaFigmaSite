import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Loader2, Phone, CheckCircle2, Globe, PhoneOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Dithering } from '@paper-design/shaders-react';

const AGENT_TYPES = ["Monitoring", "Intake", "Outreach", "Coordination"];

// ElevenLabs Agent IDs Configuration
const ELEVENLABS_AGENT_IDS: Record<string, string> = {
  "Monitoring": "agent_2301kj5dz760fm7s6g6x67qmc07n",
  "Intake": "agent_1101kj5rbjvaf3ras919nbh6kdgr",
  "Outreach": "agent_3901kj5srm7qfn9bw93qtxv3nbmc",
  "Coordination": "agent_5701kj5se9gtf79t3edtyynwvpgh"
};

// Phone numbers per agent
const AGENT_PHONE_NUMBERS: Record<string, { US: string; UK: string }> = {
  "Outreach": {
    US: "+1 938 201 9945",
    UK: "+44 7426 780324"
  },
  "Monitoring": {
    US: "+1 463 217 0155",
    UK: "+44 7883 291917"
  },
  "Coordination": {
    US: "+1 231 310 3794",
    UK: "+44 7429 947032"
  },
  "Intake": {
    US: "+1 984 224 7846",
    UK: "+44 7897 023174"
  }
};

// ElevenLabs Phone Number IDs per agent + region
// Each agent has a dedicated US and UK/EU Twilio number
const ELEVENLABS_PHONE_NUMBER_IDS: Record<string, { US: string; EU_UK: string }> = {
  "Monitoring": {
    US: "phnum_8501kj5whzm5eftsa19bjwr8955t",
    EU_UK: "phnum_3001khyh985eeg8swtvkkedry68g"
  },
  "Intake": {
    US: "phnum_6701kj5r8497esbvw85qp5tet396",
    EU_UK: "phnum_2901kj5st5rzee3tjww5ypez19ms"
  },
  "Outreach": {
    US: "phnum_9801kj5t4pfyfcr81wh2nnppe0sc",
    EU_UK: "phnum_2101kj5t65w5e8ftt7zgkmz2amjg"
  },
  "Coordination": {
    US: "phnum_0701kj5sx52ef3qtmyyk501zyf2r",
    EU_UK: "phnum_8601kj5svts8ebtvxz9fr68mc65t"
  }
};

const COUNTRIES = [
  { code: "US", flag: "\u{1F1FA}\u{1F1F8}", dial: "+1", name: "United States" },
  { code: "CA", flag: "\u{1F1E8}\u{1F1E6}", dial: "+1", name: "Canada" },
  { code: "GB", flag: "\u{1F1EC}\u{1F1E7}", dial: "+44", name: "United Kingdom" },
  { code: "IE", flag: "\u{1F1EE}\u{1F1EA}", dial: "+353", name: "Ireland" },
  { code: "AU", flag: "\u{1F1E6}\u{1F1FA}", dial: "+61", name: "Australia" },
  { code: "DE", flag: "\u{1F1E9}\u{1F1EA}", dial: "+49", name: "Germany" },
  { code: "FR", flag: "\u{1F1EB}\u{1F1F7}", dial: "+33", name: "France" },
  { code: "ES", flag: "\u{1F1EA}\u{1F1F8}", dial: "+34", name: "Spain" },
  { code: "IT", flag: "\u{1F1EE}\u{1F1F9}", dial: "+39", name: "Italy" },
  { code: "PT", flag: "\u{1F1F5}\u{1F1F9}", dial: "+351", name: "Portugal" },
  { code: "NL", flag: "\u{1F1F3}\u{1F1F1}", dial: "+31", name: "Netherlands" },
  { code: "BR", flag: "\u{1F1E7}\u{1F1F7}", dial: "+55", name: "Brazil" },
  { code: "MX", flag: "\u{1F1F2}\u{1F1FD}", dial: "+52", name: "Mexico" },
  { code: "IN", flag: "\u{1F1EE}\u{1F1F3}", dial: "+91", name: "India" },
  { code: "JP", flag: "\u{1F1EF}\u{1F1F5}", dial: "+81", name: "Japan" },
  { code: "KR", flag: "\u{1F1F0}\u{1F1F7}", dial: "+82", name: "South Korea" },
  { code: "CN", flag: "\u{1F1E8}\u{1F1F3}", dial: "+86", name: "China" },
  { code: "IL", flag: "\u{1F1EE}\u{1F1F1}", dial: "+972", name: "Israel" },
  { code: "AE", flag: "\u{1F1E6}\u{1F1EA}", dial: "+971", name: "UAE" },
  { code: "NG", flag: "\u{1F1F3}\u{1F1EC}", dial: "+234", name: "Nigeria" },
  { code: "ZA", flag: "\u{1F1FF}\u{1F1E6}", dial: "+27", name: "South Africa" },
  { code: "PH", flag: "\u{1F1F5}\u{1F1ED}", dial: "+63", name: "Philippines" },
  { code: "CO", flag: "\u{1F1E8}\u{1F1F4}", dial: "+57", name: "Colombia" },
];

interface LiveDemoSectionProps {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
}

function DotMatrixNumber({ number }: { number: number }) {
  const patterns: Record<number, number[][]> = {
    1: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ],
    2: [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1]
    ]
  };

  const pattern = patterns[number] || patterns[1];

  return (
    <div className="flex flex-col gap-1.5">
      {pattern.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((cell, j) => (
            <div 
              key={`${i}-${j}`} 
              className={cn(
                "w-2 h-2 rounded-full",
                cell ? "bg-slate-900" : "bg-transparent"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LiveDemoSection({
  activeAgentId,
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall
}: LiveDemoSectionProps) {
  const [step, setStep] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState("Monitoring");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  const handleNext = () => {
    if (selectedAgent) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleWebCallClick = async () => {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-77ada9a1/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          agent: selectedAgent,
          workflow: selectedAgent,
          page: "live-demo-web-call"
        })
      });
    } catch (err) {
      console.error("Failed to capture lead:", err);
    }

    const agentId = ELEVENLABS_AGENT_IDS[selectedAgent];
    handleStartWebCall(selectedAgent, agentId);
  };

  return (
    <section id="live-demo-section" className="py-32 px-4 bg-[rgb(0,18,47)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
           <h2 className="text-5xl md:text-7xl lg:text-8xl font-thin text-[rgb(250,250,250)] leading-[0.9]">
             Try it.
           </h2>
           <p className="text-[rgb(248,248,248)] max-w-sm text-lg leading-relaxed mb-2 font-light">
             Receive a live call from our agent and discover how our AI caller transforms customer conversations.
           </p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
          
          {/* Card 1: Selection */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative bg-slate-50 border border-slate-100 rounded-lg p-8 flex flex-col justify-between overflow-hidden group/card",
              step === 1 ? "lg:flex-[1.4]" : "lg:flex-[0.8] opacity-100 lg:opacity-50"
            )}
            onClick={() => step !== 1 && setStep(1)}
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-8">
                <DotMatrixNumber number={1} />
              </div>
              
              <div className="mt-auto">
                 <h3 className="text-3xl font-light text-slate-900 mb-8 max-w-xs leading-tight tracking-tight">
                   Select the type of call you want to receive
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-3 max-w-sm relative z-20">
                   {AGENT_TYPES.map((type) => (
                     <button
                       key={type}
                       onClick={(e) => { e.stopPropagation(); setSelectedAgent(type); }}
                       className={cn(
                         "px-6 py-5 rounded-lg text-lg font-medium border transition-all duration-200 flex items-center justify-center text-center h-full w-full",
                         selectedAgent === type
                           ? "bg-slate-900 text-white border-slate-900"
                           : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                       )}
                     >
                       {type}
                     </button>
                   ))}
                 </div>

                 {/* Visible Next Action for Step 1 */}
                 <div className={cn(
                    "mt-10 pt-6 border-t border-slate-200 flex justify-end transition-opacity duration-300",
                    step === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
                 )}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>

            {/* Orb Visual */}
            <motion.div
              animate={step === 1 ? {
                y: [0, -20, 0],
              } : {}}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
                step === 1 ? "right-[-10%] w-[70%] h-[70%] scale-100 opacity-100" : "right-[-50%] w-[40%] h-[40%] scale-50 opacity-0 blur-xl"
              )}
            >
              <Dithering
                 colorBack="#f8fafc"
                 colorFront="#6366f1"
                 shape="sphere"
                 type="4x4"
                 speed={0.5}
                 className="w-full h-full"
                 minPixelRatio={1}
              />
            </motion.div>
          </motion.div>

          {/* Card 2: Form */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative bg-slate-50 border border-slate-100 rounded-lg p-8 flex flex-col justify-between overflow-hidden",
              step === 2 ? "lg:flex-[1.4]" : "lg:flex-[1]"
            )}
          >
            <div className="h-full flex flex-col relative z-10">
              <div className="mb-8">
                <DotMatrixNumber number={2} />
              </div>
              
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div 
                    key="step1-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-end cursor-pointer"
                    onClick={() => setStep(2)}
                  >
                     <h3 className="text-3xl font-light text-slate-900 mb-4 tracking-tight">
                       Talk to Hana
                     </h3>
                  </motion.div>
                ) : webCallStatus !== "idle" ? (
                  <motion.div
                    key="step3-web-call-active"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center space-y-8 text-center"
                  >
                    <div className="relative w-32 h-32">
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
                        <Globe className={cn(
                          "w-10 h-10",
                          webCallStatus === "active" ? "text-green-600" : "text-blue-600"
                        )} />
                      </div>
                      <div className={cn(
                        "absolute -right-1 -top-1 text-white p-2 rounded-full border-4 border-slate-50",
                        webCallStatus === "active" ? "bg-green-500" : "bg-blue-500"
                      )}>
                        {webCallStatus === "active"
                          ? <CheckCircle2 className="w-4 h-4" />
                          : <Loader2 className="w-4 h-4 animate-spin" />
                        }
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-light text-slate-900 mb-2">
                        {webCallStatus === "active"
                          ? `Speaking with ${selectedAgent} Agent`
                          : "Connecting..."
                        }
                      </h3>
                      <p className="text-slate-500 font-light max-w-xs mx-auto">
                        {webCallStatus === "active"
                          ? "Your call is in progress. Click 'End Call' when you're done."
                          : "Establishing connection to the agent..."
                        }
                      </p>
                    </div>

                    <button
                      onClick={handleEndWebCall}
                      className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <PhoneOff className="w-4 h-4" /> End Call
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2-call-options"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 flex flex-col w-full"
                  >
                     <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full space-y-6">
                        <div>
                          <h3 className="text-3xl font-light text-slate-900 mb-2 tracking-tight">
                            Talk to our {selectedAgent} Agent
                          </h3>
                          <p className="text-slate-500 font-light">
                            Choose how you'd like to connect
                          </p>
                        </div>

                        {/* Name + Email inputs */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                              placeholder="Your name"
                              className={cn(
                                "w-full px-4 py-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all",
                                fieldErrors.name
                                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              )}
                            />
                            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                              placeholder="you@company.com"
                              className={cn(
                                "w-full px-4 py-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all",
                                fieldErrors.email
                                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              )}
                            />
                            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Web Call Option */}
                          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all flex flex-col">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-2.5 bg-blue-50 rounded-lg">
                                <Globe className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-medium text-slate-900 mb-1">Web Call</h4>
                                <p className="text-xs text-slate-500 font-light">Talk in your browser</p>
                              </div>
                            </div>
                            <button
                              onClick={handleWebCallClick}
                              disabled={webCallStatus !== "idle"}
                              className="mt-auto w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                              {webCallStatus === "connecting" ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                                </>
                              ) : (
                                <>
                                  <Globe className="w-4 h-4" /> Start Call
                                </>
                              )}
                            </button>
                          </div>

                          {/* Call Us Option */}
                          <div className="bg-white border-2 border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-2">
                              <div className="p-2 bg-slate-50 rounded-lg">
                                <Phone className="w-5 h-5 text-slate-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-medium text-slate-900 mb-1">Call Us</h4>
                                <p className="text-xs text-slate-500 font-light mb-2">Dial from your phone</p>
                                <div className="space-y-1">
                                  <a
                                    href={`tel:${AGENT_PHONE_NUMBERS[selectedAgent].US.replace(/\s/g, '')}`}
                                    className="block text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                                  >
                                    🇺🇸 {AGENT_PHONE_NUMBERS[selectedAgent].US}
                                  </a>
                                  <a
                                    href={`tel:${AGENT_PHONE_NUMBERS[selectedAgent].UK.replace(/\s/g, '')}`}
                                    className="block text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                                  >
                                    🇬🇧 {AGENT_PHONE_NUMBERS[selectedAgent].UK}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                     </div>

                     <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-8 pb-2">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-slate-400 hover:text-slate-900 text-xs font-semibold flex items-center gap-2 transition-colors uppercase tracking-wider group"
                        >
                          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          Back to Agent Selection
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}