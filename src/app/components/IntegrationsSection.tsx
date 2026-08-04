import React from 'react';
import { ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslations } from '../../lib/i18n';
import { TRUST_LOGOS, LogoMarquee } from './ui/brand-logos';

export function IntegrationsSection() {
  const t = useTranslations();
  const i = t.integrations;
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 overflow-hidden bg-[#f5f6f8] text-[#1e2a3a]">
       {/* Ambient glow */}
       <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none z-0" />

       <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-blue-600 mb-6
              before:content-[''] before:w-6 before:h-px before:bg-blue-600 before:opacity-40
              after:content-[''] after:w-6 after:h-px after:bg-blue-600 after:opacity-40
            ">
              {i.tag}
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-[#1e2a3a] mb-5 tracking-normal">
              {i.heading} <em className="italic text-blue-600">{i.headingEmphasis}</em>
            </h2>
            <p className="text-lg leading-[1.65] text-[#718096] max-w-2xl mx-auto font-normal">
              {i.body}
            </p>
          </div>

          {/* Trusted-by band — under the header */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <p className="text-center text-sm sm:text-base font-medium text-[#5a6b82]">
              {i.trustLine}
            </p>
            <LogoMarquee brands={TRUST_LOGOS} className="mt-9" />
          </div>

          {/* Grid — 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Pillar 1: EHR Integrations */}
             <div className="relative bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 md:p-10 pb-6 sm:pb-7 md:pb-9 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg group">
                
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-7 bg-blue-50 border border-blue-200 text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                   </svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-[#1e2a3a] mb-2 tracking-normal">{i.ehr}</h3>
                <p className="text-[14px] leading-[1.5] text-blue-600 font-medium mb-4">{i.ehrTagline}</p>
                <p className="text-[15px] leading-[1.7] text-[#718096] mb-8 font-normal">
                  {i.ehrBody}
                </p>
                
                <div className="flex flex-wrap gap-[10px]">
                   {["Athena Health", "Epic", "eClinicalWorks", "Redox", "95+ EHRs"].map(item => (
                     <span key={item} className="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg bg-slate-50 border border-slate-200 text-[13px] font-medium text-[#1e2a3a] transition-colors hover:bg-slate-100 hover:border-slate-300 tracking-[0.01em]">
                       <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500"></span>
                       {item}
                     </span>
                   ))}
                </div>
             </div>

             {/* Pillar 2: Patient Channels */}
             <div className="relative bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 md:p-10 pb-6 sm:pb-7 md:pb-9 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg group">
                
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-7 bg-blue-50 border border-blue-200 text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                   </svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-[#1e2a3a] mb-2 tracking-normal">{i.channels}</h3>
                <p className="text-[14px] leading-[1.5] text-blue-600 font-medium mb-4">{i.channelsTagline}</p>
                <p className="text-[15px] leading-[1.7] text-[#718096] mb-8 font-normal">
                  {i.channelsBody}
                </p>
                
                <div className="flex flex-wrap gap-[10px]">
                   {["Voice calls", "SMS", "WhatsApp", "iMessage", "30+ languages"].map(item => (
                     <span key={item} className="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg bg-slate-50 border border-slate-200 text-[13px] font-medium text-[#1e2a3a] transition-colors hover:bg-slate-100 hover:border-slate-300 tracking-[0.01em]">
                       <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500"></span>
                       {item}
                     </span>
                   ))}
                </div>
             </div>

             {/* Pillar 3: No EHR? No problem. */}
             <div className="relative bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 md:p-10 pb-6 sm:pb-7 md:pb-9 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg group">
                
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-7 bg-blue-50 border border-blue-200 text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
                   </svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-[#1e2a3a] mb-2 tracking-normal">{i.noEhr}</h3>
                <p className="text-[14px] leading-[1.5] text-blue-600 font-medium mb-4">{i.noEhrTagline}</p>
                <p className="text-[15px] leading-[1.7] text-[#718096] mb-8 font-normal">
                  {i.noEhrBody}
                </p>
                
                <div className="flex flex-wrap gap-[10px]">
                   {["Custom dashboards", "Agent control panel", "Works alongside your tools", "No tech requirements"].map(item => (
                     <span key={item} className="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg bg-slate-50 border border-slate-200 text-[13px] font-medium text-[#1e2a3a] transition-colors hover:bg-slate-100 hover:border-slate-300 tracking-[0.01em]">
                       <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500"></span>
                       {item}
                     </span>
                   ))}
                </div>
             </div>

             {/* Pillar 4: SDK & White-Label — UPGRADED to full card */}
             <div className="relative bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 md:p-10 pb-6 sm:pb-7 md:pb-9 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg group">
                
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-7 bg-blue-50 border border-blue-200 text-blue-600">
                   <Code2 className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-[#1e2a3a] mb-2 tracking-normal">{i.sdk}</h3>
                <p className="text-[14px] leading-[1.5] text-blue-600 font-medium mb-4">{i.sdkTagline}</p>
                <p className="text-[15px] leading-[1.7] text-[#718096] mb-8 font-normal">
                  {i.sdkBody}
                </p>
                
                <div className="flex flex-wrap gap-[10px] mb-8">
                   {["Full API", "White-label", "Custom dashboards", "Your branding", "SDK"].map(item => (
                     <span key={item} className="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg bg-slate-50 border border-slate-200 text-[13px] font-medium text-[#1e2a3a] transition-colors hover:bg-slate-100 hover:border-slate-300 tracking-[0.01em]">
                       <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500"></span>
                       {item}
                     </span>
                   ))}
                </div>

                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-[15px] font-medium transition-colors group/link"
                >
                  {i.learnPartnerships}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
             </div>

             {/* Pillar 5: Wearables & devices — full-width row (spans both columns) */}
             <div className="md:col-span-2 relative bg-white border border-slate-200 rounded-[20px] p-6 sm:p-8 md:p-10 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg flex flex-col md:flex-row md:items-center gap-7 md:gap-10">
                <div className="md:flex-1">
                   <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-6 bg-blue-50 border border-blue-200 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                   </div>
                   <h3 className="text-xl sm:text-2xl md:text-[26px] font-normal text-[#1e2a3a] mb-2 tracking-normal">{i.wearables}</h3>
                   <p className="text-[14px] leading-[1.5] text-blue-600 font-medium mb-4">{i.wearablesTagline}</p>
                   <p className="text-[15px] leading-[1.7] text-[#718096] font-normal max-w-[560px]">{i.wearablesBody}</p>
                </div>
                <div className="flex flex-wrap gap-[10px] md:max-w-[300px] md:justify-end">
                   {["Apple Watch", "Oura", "Fitbit", "Garmin"].map(item => (
                     <span key={item} className="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg bg-slate-50 border border-slate-200 text-[13px] font-medium text-[#1e2a3a] transition-colors hover:bg-slate-100 hover:border-slate-300 tracking-[0.01em]">
                       <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500"></span>
                       {item}
                     </span>
                   ))}
                </div>
             </div>

          </div>
       </div>
    </section>
  )
}