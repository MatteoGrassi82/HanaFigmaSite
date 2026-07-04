import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from "../../lib/i18n";

function WorkflowAnimation() {
  return (
    <div className="relative w-9 h-9 grid grid-cols-2 gap-[5px]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-[3px] bg-white"
          style={{
            animation: `tileFlash 2s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes tileFlash {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function SyncAnimation() {
  return (
    <div className="relative w-9 h-7 flex items-center justify-between">
      {/* Left node */}
      <div
        className="w-3 h-3 rounded-full bg-white flex-shrink-0"
        style={{ animation: 'nodePulse 1.8s ease-in-out infinite' }}
      />

      {/* Travelling dot on line */}
      <div className="absolute inset-0 flex items-center">
        <div className="relative w-full h-px bg-white/20">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
            style={{ animation: 'travel 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Right node */}
      <div
        className="w-3 h-3 rounded-full bg-white/40 flex-shrink-0"
        style={{ animation: 'nodePulse 1.8s ease-in-out infinite', animationDelay: '0.9s' }}
      />

      <style>{`
        @keyframes travel {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

function LiveAnimation() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#A7BCF5]"
          style={{
            width: `${(i + 1) * 33}%`,
            height: `${(i + 1) * 33}%`,
            animation: `ripple 2s ease-out infinite`,
            animationDelay: `${i * 0.55}s`,
          }}
        />
      ))}
      <div className="w-2.5 h-2.5 rounded-full bg-[#A7BCF5]" />
      <style>{`
        @keyframes ripple {
          0% { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(2.2); }
        }
      `}</style>
    </div>
  );
}

export function InlineImageHeader() {
  const t = useTranslations();
  const gs = t.getStarted;
  return (
    <section className="py-16 md:py-[100px] px-6 md:px-10 bg-[#00122F] text-white font-['DM_Sans']">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-[72px]">
          <h2 className="font-serif text-[36px] md:text-[56px] leading-[1.1] tracking-normal text-white max-w-[720px] mx-auto mb-5">
            {gs.heading}
          </h2>
          <p className="text-[16px] leading-[1.7] text-slate-400 max-w-[520px] mx-auto">
            {gs.subheading}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 px-4 md:px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">{gs.step1Number}</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-white/5 border-2 border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              <WorkflowAnimation />
            </div>
            <h3 className="font-serif text-[22px] md:text-[26px] text-white mb-3 tracking-normal">{gs.step1Title}</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              {gs.step1Body}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 px-4 md:px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">{gs.step2Number}</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-blue-500/20 border-2 border-blue-400/30 shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
              <SyncAnimation />
            </div>
            <h3 className="font-serif text-[22px] md:text-[26px] text-white mb-3 tracking-normal">{gs.step2Title}</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              {gs.step2Body}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 px-4 md:px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">{gs.step3Number}</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-[rgb(167,188,245)]/20 border-2 border-[rgb(167,188,245)]/30 shadow-[0_4px_16px_rgba(167,188,245,0.1)]">
              <LiveAnimation />
            </div>
            <h3 className="font-serif text-[22px] md:text-[26px] text-white mb-3 tracking-normal">{gs.step3Title}</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              {gs.step3Body}
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-[72px] text-center">
          <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-[14px] bg-white text-[#00122F] rounded-lg text-[15px] font-semibold hover:bg-slate-100 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-200 group">
            {gs.cta}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </a>
          <p className="text-[13px] text-slate-400 mt-[14px]">{gs.note}</p>
        </div>

      </div>
    </section>
  );
}
