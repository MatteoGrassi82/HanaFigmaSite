import {
  ShieldCheck,
  HeartPulse,
  Plus,
  Command,
  Shield,
  Stethoscope
} from "lucide-react";
import { useTranslations } from "../../lib/i18n";

export function ComplianceSection() {
  const t = useTranslations();
  const certifications = [
    { icon: Shield,      title: t.compliance.iso,    description: t.compliance.isoDesc },
    { icon: Stethoscope, title: t.compliance.soc2,   description: t.compliance.soc2Desc },
    { icon: Command,     title: t.compliance.hipaa,  description: t.compliance.hipaaDesc },
    { icon: HeartPulse,  title: t.compliance.pdl,    description: t.compliance.pdlDesc },
    { icon: ShieldCheck, title: t.compliance.gdpr,   description: t.compliance.gdprDesc },
    { icon: Plus,        title: t.compliance.pipeda, description: t.compliance.pipedaDesc },
  ];
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F5F5] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-24">

          {/* Left Content */}
          <div className="flex-1 lg:max-w-sm space-y-8 lg:sticky lg:top-24 self-start">
            <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              {t.compliance.tag}
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white leading-[1.1]">
              {t.compliance.heading}
            </h2>

            {/* Deployment flexibility note */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.compliance.environmentsTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t.compliance.environments}
              </p>
            </div>
          </div>

          {/* Right Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
              {certifications.map((cert, index) => {
                const isRightCol = index % 2 !== 0;
                const isLastRow = index >= certifications.length - 2;

                return (
                  <div
                    key={index}
                    className={`
                      p-6 sm:p-8 md:p-10 flex flex-col gap-4
                      ${!isLastRow ? 'border-b border-slate-200 dark:border-slate-800' : ''}
                      ${isRightCol ? '' : 'md:border-r border-slate-200 dark:border-slate-800'}
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
          </div>

        </div>
      </div>
    </section>
  );
}
