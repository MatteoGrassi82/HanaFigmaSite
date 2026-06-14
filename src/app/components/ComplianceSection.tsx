import {
  ShieldCheck,
  FileCheck,
  Lock,
  GlobeLock,
  Command,
  Shield,
  Stethoscope
} from "lucide-react";

const certifications = [
  {
    icon: Shield,
    title: "ISO 27001-aligned",
    description: "ISMS implemented against ISO 27001 information security controls across EHR systems, with certification on our roadmap."
  },
  {
    icon: Stethoscope,
    title: "SOC 2 Type II (audit in progress)",
    description: "Readiness assessment complete and a Type II audit underway, with continuous monitoring and automated evidence collection across EHR environments."
  },
  {
    icon: Command,
    title: "HIPAA-aligned",
    description: "HIPAA controls in place — encryption, access controls, and audit logging across EHR integrations — with a BAA available."
  },
  {
    icon: ShieldCheck,
    title: "GDPR",
    description: "Providing GDPR-compliant data processing with automated data mapping, consent management, and data subject request tools for EHR systems."
  }
];

export function ComplianceSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F5F5] dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 lg:max-w-sm space-y-7 lg:sticky lg:top-24 self-start">
            <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              Safety &amp; Security
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white leading-[1.1]">
              A human on every clinical call that needs one.
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Hana never decides care on its own. You set the escalation rules; it follows them — and logs everything.
            </p>

            {/* Safety pillars */}
            <ul className="space-y-5 pt-2">
              {[
                {
                  title: "Human-in-the-loop",
                  body: "Clinical risk is routed to your nurse or on-call clinician with a warm hand-off — live, or next business day, per your rules.",
                },
                {
                  title: "Full audit trail",
                  body: "Every call is recorded, transcribed, and logged to the chart. Who said what, what was decided, and why — reviewable any time.",
                },
                {
                  title: "Protocol-bound",
                  body: "Hana follows your clinical protocols and screening logic. It works inside guardrails you define, not a generic model's judgment.",
                },
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
              And the controls behind it: HIPAA-aligned, SOC 2 Type II (audit in progress), ISO 27001-aligned, GDPR. Not bolted on — built in.
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
                Cloud, private cloud, or dedicated environments. Same standards.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
