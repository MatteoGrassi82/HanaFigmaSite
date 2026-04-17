import { 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  HeartPulse, 
  GlobeLock, 
  Plus,
  Command,
  Shield,
  Stethoscope
} from "lucide-react";

const certifications = [
  {
    icon: Shield,
    title: "ISO 27001",
    description: "Implementing ISO 27001 information security controls across EHR systems with real-time monitoring and compliance reporting."
  },
  {
    icon: Stethoscope,
    title: "SOC 2 Type II",
    description: "Delivering continuous monitoring and automated evidence collection for SOC 2 Type II audits across different EHR environments."
  },
  {
    icon: Command,
    title: "HIPAA",
    description: "Ensuring HIPAA compliance through encryption, access controls, and audit logging across EHR integrations."
  },
  {
    icon: HeartPulse,
    title: "PDL",
    description: "Maintaining comprehensive data governance controls for Personal Data Law compliance across EHR systems."
  },
  {
    icon: ShieldCheck,
    title: "GDPR",
    description: "Providing GDPR-compliant data processing with automated data mapping, consent management, and data subject request tools for EHR systems."
  },
  {
    icon: Plus,
    title: "PIPEDA",
    description: "Meeting Canadian privacy requirements through automated privacy assessments and consent tracking across EHR platforms."
  }
];

export function ComplianceSection() {
  return (
    <section className="py-24 bg-[#F5F5F5] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 lg:max-w-sm space-y-8 sticky top-24 self-start">
            <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              Enterprise Compliance
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white leading-[1.2]">
              Healthcare compliance isn't an add-on. It's the foundation.
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Built for healthcare from day one. HIPAA, GDPR, SOC 2, EU AI Act — across the US, UK, Ireland, and Italy. Every deployment. Every country.
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
                      p-8 md:p-10 flex flex-col gap-4
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
                Cloud, private cloud, or dedicated environments. Same standards.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
