import React from 'react';
import { ArrowRight } from 'lucide-react';
import image_902cc6fcb4c48eee244e5db0e40dfc456537e85f from 'figma:asset/902cc6fcb4c48eee244e5db0e40dfc456537e85f.png';
import image_604a2f01ad9c55649c86d210ffa7add1143256c8 from 'figma:asset/604a2f01ad9c55649c86d210ffa7add1143256c8.png';

export function InlineImageHeader() {
  return (
    <section className="py-[100px] px-6 md:px-10 bg-[#00122F] text-white font-['DM_Sans']">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-[72px]">
          <h2 className="font-serif text-[36px] md:text-[56px] leading-[1.25] tracking-[-0.025em] text-white max-w-[720px] mx-auto mb-5">
            Built around your
            <span className="inline-flex items-center align-middle relative -top-[3px] mx-[2px]">
              <img
                src={image_604a2f01ad9c55649c86d210ffa7add1143256c8}
                alt="Workflow"
                className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-full object-cover shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              />
            </span>
            workflow. Not
            <span className="inline-flex items-center align-middle relative -top-[3px] mx-[2px]">
              <img
                src={image_902cc6fcb4c48eee244e5db0e40dfc456537e85f}
                alt="AI Integration"
                className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] rounded-full object-cover shadow-[0_2px_10px_rgba(0,0,0,0.08)] z-10"
              />
            </span>
            ours.
          </h2>
          <p className="text-[16px] leading-[1.7] text-slate-400 max-w-[520px] mx-auto">
            Tell us how you work. We build around it. Most teams are live in a week.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
          {/* Dashed Connecting Line (Desktop Only) */}
          <div 
            className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-[2px] z-0"
            style={{
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 14px)'
            }}
          />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">001</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-white/5 border-2 border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            </div>
            <h3 className="font-serif text-[26px] text-white mb-3 tracking-[-0.01em]">Pick your workflow.</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              Choose from pre-built clinical templates or we build one together — designed around how your organization actually operates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">002</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-blue-500/20 border-2 border-blue-400/30 shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4"/>
                <path d="M12 18v4"/>
                <path d="M4.93 4.93l2.83 2.83"/>
                <path d="M16.24 16.24l2.83 2.83"/>
                <path d="M2 12h4"/>
                <path d="M18 12h4"/>
                <path d="M4.93 19.07l2.83-2.83"/>
                <path d="M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h3 className="font-serif text-[26px] text-white mb-3 tracking-[-0.01em]">Connect it.</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              Whether it's your EHR, website, phone system, or app — we connect it wherever your patients are.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 px-7 group">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-slate-400 mb-[18px]">003</p>
            <div className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-105 bg-[rgb(167,188,245)]/20 border-2 border-[rgb(167,188,245)]/30 shadow-[0_4px_16px_rgba(167,188,245,0.1)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A7BCF5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="font-serif text-[26px] text-white mb-3 tracking-[-0.01em]">Live.</h3>
            <p className="text-[15px] leading-[1.7] text-slate-400 max-w-[280px] mx-auto">
              Your agent is live. Handling calls, messages, and follow-ups so your team doesn't have to.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-[72px] text-center">
          <a href="https://calendly.com/matteowastaken/discoverycall" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-[14px] bg-white text-[#00122F] rounded-lg text-[15px] font-semibold hover:bg-slate-100 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-200 group">
            Book a Demo
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </a>
          <p className="text-[13px] text-slate-400 mt-[14px]">Most teams go live in a week.</p>
        </div>

      </div>
    </section>
  );
}