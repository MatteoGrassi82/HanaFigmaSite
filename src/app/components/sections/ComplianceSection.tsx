import {
  ShieldCheck,
  Command,
  Shield,
  Stethoscope
} from "lucide-react";
import { useTranslations } from "../../../lib/i18n";

/**
 * The credentials view: certifications plus the deployment note.
 *
 * `white` is opt-in for pages that standardise on a white background (Remote):
 * it drops the grey section fill. The certification grid already carries its own
 * hairline and shadow, so it still reads as a panel on white. Home passes
 * nothing and is unchanged.
 */
export function ComplianceSection({ white = false }: { white?: boolean } = {}) {
  const t = useTranslations();
  const certifications = [
    { icon: Shield,      title: t.compliance.iso,    description: t.compliance.isoDesc },
    { icon: Stethoscope, title: t.compliance.soc2,   description: t.compliance.soc2Desc },
    { icon: Command,     title: t.compliance.hipaa,  description: t.compliance.hipaaDesc },
    { icon: ShieldCheck, title: t.compliance.gdpr,   description: t.compliance.gdprDesc },
  ];
  return (
    <section
      className={`py-16 sm:py-20 lg:py-24 ${
        white ? "bg-paper-bright dark:bg-navy" : "bg-[#F5F5F5] dark:bg-navy"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-24">

          {/* Left Content */}
          <div className="flex-1 lg:max-w-sm space-y-8 lg:sticky lg:top-24 self-start">
            <div className="inline-flex items-center rounded-full border border-rule dark:border-navy-soft bg-paper-bright dark:bg-navy px-4 py-1.5 text-sm font-medium text-ink-soft dark:text-white/75 shadow-sm">
              {t.compliance.tag}
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-ink dark:text-white leading-[1.1]">
              {t.compliance.heading}
            </h2>

            {/* Deployment flexibility note */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-ink dark:text-white">
                {t.compliance.environmentsTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-white/75">
                {t.compliance.environments}
              </p>
            </div>
          </div>

          {/* Right Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 border border-rule dark:border-navy-soft bg-paper-bright dark:bg-navy rounded-2xl overflow-hidden shadow-sm">
              {certifications.map((cert, index) => {
                const isRightCol = index % 2 !== 0;
                const isLastRow = index >= certifications.length - 2;

                return (
                  <div
                    key={index}
                    className={`
                      p-6 sm:p-8 md:p-10 flex flex-col gap-4
                      ${!isLastRow ? 'border-b border-rule dark:border-navy-soft' : ''}
                      ${isRightCol ? '' : 'md:border-r border-rule dark:border-navy-soft'}
                    `}
                  >
                    <div className="h-10 w-10 text-navy dark:text-white mb-2">
                      <cert.icon strokeWidth={1.5} className="w-full h-full" />
                    </div>
                    <h3 className="text-xl font-medium text-ink dark:text-white">
                      {cert.title}
                    </h3>
                    <p className="text-ink-soft dark:text-white/75 leading-relaxed text-sm">
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
