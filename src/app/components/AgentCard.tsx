import { useState } from "react";
import { Loader2, StopCircle, Globe, ArrowRight } from "lucide-react";
import { motion, easeOut } from "motion/react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function AgentCard({
  title,
  description,
  icon: Icon,
  colorClass,
  assistantId,
  workflow,
  webCallStatus,
  isOtherAgentActive,
  onStartWebCall,
  onEndWebCall
}: {
  title: string;
  description: string;
  icon: any;
  colorClass: "blue" | "emerald";
  assistantId: string;
  workflow?: string;
  webCallStatus: "idle" | "connecting" | "active";
  isOtherAgentActive: boolean;
  onStartWebCall: (agentId: string, assistantId: string) => void;
  onEndWebCall: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  const handleWebCallClick = async () => {
    if (webCallStatus === "active") {
      onEndWebCall();
      return;
    }

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
          agent: workflow || title,
          workflow: workflow || null,
          page: "use-cases-web-call"
        })
      });
    } catch (err) {
      console.error("Failed to capture lead:", err);
    }

    onStartWebCall(title, assistantId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full h-full"
    >
      <motion.div
        variants={itemVariants}
        className="group relative bg-white dark:bg-[#0B1D36] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-300 flex flex-col h-full overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex flex-col items-start mb-6 relative z-10">
          <div className={`p-3.5 rounded-2xl mb-6 transition-colors duration-300 ${
            colorClass === 'blue' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20' 
              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'
          }`}>
            <Icon className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-serif text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Interactive Form Section */}
        <div className="mt-auto relative z-10 space-y-4">
          {/* Name + Email Inputs */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5 ml-1 tracking-wide">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                placeholder="Your name"
                className={`w-full bg-slate-50 dark:bg-[#132B4A] border rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  fieldErrors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                }`}
                disabled={webCallStatus === "active" || isOtherAgentActive}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500 ml-1">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5 ml-1 tracking-wide">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })); }}
                placeholder="you@company.com"
                className={`w-full bg-slate-50 dark:bg-[#132B4A] border rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  fieldErrors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-slate-200 dark:border-slate-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                }`}
                disabled={webCallStatus === "active" || isOtherAgentActive}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-500 ml-1">{fieldErrors.email}</p>}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="button"
              whileHover={(webCallStatus === "connecting" || isOtherAgentActive) ? {} : { scale: 1.01 }}
              whileTap={(webCallStatus === "connecting" || isOtherAgentActive) ? {} : { scale: 0.99 }}
              onClick={handleWebCallClick}
              disabled={webCallStatus === "connecting" || isOtherAgentActive}
              className={`w-full border rounded-xl px-6 py-3.5 flex items-center justify-between transition-colors duration-300 font-medium
                ${webCallStatus === "active"
                  ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                  : "bg-[#0A2540] text-white border-transparent hover:bg-[#153457] shadow-lg shadow-blue-900/20 dark:shadow-blue-900/30"
                } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  {webCallStatus === "connecting" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : webCallStatus === "active" ? (
                    <StopCircle className="w-5 h-5 fill-current" />
                  ) : (
                    <Globe className="w-5 h-5" />
                  )}
                </div>
                <span>
                  {webCallStatus === "connecting" ? "Connecting..." : 
                   webCallStatus === "active" ? "End Web Call" : "Start Web Call"}
                </span>
              </div>
              {webCallStatus !== "active" && webCallStatus !== "connecting" && (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10 flex items-center justify-between">
           <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
             Interactive Demo
           </span>
           <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by 
            <a 
              href="https://hana.health/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-900 dark:text-white font-medium ml-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
               Hana
            </a>
          </p>
        </motion.div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}