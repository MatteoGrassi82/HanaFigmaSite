import {
  ShieldCheck,
  FileCheck,
  Lock,
  GlobeLock,
  Command,
  Shield,
  Stethoscope
} from "lucide-react";
import { useTranslations } from "../../lib/i18n";

export function ComplianceSection() {
  const t = useTranslations();
  const certifications = [
    { icon: Shield,      title: t.compliance.iso,   description: t.compliance.isoDesc },
    { icon: Stethoscope, title: t.compliance.soc2,  description: t.compliance.soc2Desc },
    { icon: Command,     title: t.compliance.hipaa, description: t.compliance.hipaaDesc },
    { icon: ShieldCheck, title: t.compliance.gdpr,  description: t.compliance.gdprDesc },
  ];
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F5F5] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 lg:max-w-sm space-y-7 lg:sticky lg:top-24 self-start">
            <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              {t.compliance.tag}
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white leading-[1.1]">
              {t.compliance.heading}
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.compliance.body}
            </p>

            {/* Safety pillars */}
            <ul className="space-y-5 pt-2">
              {[
                { title: t.compliance.humanInLoop,    body: t.compliance.humanInLoopDesc },
                { title: t.compliance.auditTrail,     body: t.compliance.auditTrailDesc },
                { title: t.compliance.protocolBound,  body: t.compliance.protocolBoundDesc },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed pt-1">
              {t.compliance.certNote}
            </p>
          </div>

          {/* Right Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 border border-slate-200 dark:border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
              {certifications.map((cert, index) => {
                const isEven = index % 2 !== 0;
                const isLastRow = index >= certifications.length - 2;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      p-6 sm:p-8 md:p-10 flex flex-col gap-4
                      ${!isLastRow ? 'border-b border-slate-200 dark:border-slate-800' : ''}
                      ${isEven ? '' : 'md:border-r border-slate-200 dark:border-slate-800'}
                    `}
                  >
                    <div className="h-10 w-10 text-[#00122F] dark:text-white mb-2">
                      <cert.icon strokeWidth={1.5} className="w-full h-full" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 dark:text-white">
                      {cert.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      {cert.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Deployment flexibility note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {t.compliance.environments}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
