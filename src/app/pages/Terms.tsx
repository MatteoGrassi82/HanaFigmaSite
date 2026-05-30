import { Footer } from "../components/Footer";

export function Terms() {
  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              Terms of Service<br />& Security Policy
            </h1>
            <p className="text-slate-400 text-base">
              Effective Date: 1 March 2025 &nbsp;|&nbsp; Version: 2.0
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            These Terms govern access to and use of the HANA patient engagement platform by healthcare providers (Clients) and their patients (End Users). A separate Data Processing Agreement (DPA) governs data protection obligations and is incorporated by reference.
          </p>

          {/* PART A */}
          <div className="border-b border-slate-200 pb-4 mb-10">
            <h2 className="text-2xl font-semibold text-[#1e2a3a] tracking-tight">PART A — TERMS OF SERVICE</h2>
          </div>

          {/* 1. Definitions */}
          <Section number="1" title="Definitions">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-1/3">Term</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="HANA / We / Company" meaning="HANA Health Ltd, the operator of the HANA platform" />
                  <DefRow term="Client / Healthcare Provider" meaning="The licensed healthcare organisation or clinic that has contracted with HANA" />
                  <DefRow term="Patient / End User" meaning="The individual patient who interacts with the HANA platform via voice or SMS" />
                  <DefRow term="Platform" meaning="The HANA AI-powered patient engagement infrastructure, including all AI agents, APIs, integrations, and clinical workflows" />
                  <DefRow term="Clinical Summary" meaning="An AI-assisted structured output generated from patient interactions, for review by a licensed clinician" />
                  <DefRow term="PHI / Health Data" meaning="Protected Health Information as defined under HIPAA; special category personal data as defined under GDPR" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 2. Nature of the Platform */}
          <Section number="2" title="Nature of the Platform">
            <p className="mb-4">
              HANA is a clinical workflow and patient engagement infrastructure platform. It is not a medical device, does not provide diagnoses, and does not prescribe or recommend treatment.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HANA augments, not replaces, clinical relationships and human clinical judgement</li>
              <li>All AI-generated outputs are advisory and must be reviewed by a licensed clinician before clinical decisions are made</li>
              <li>HANA operates on a human-in-the-loop architecture: AI workflows are designed to escalate to clinical staff whenever uncertainty, risk indicators, or safety flags are detected</li>
              <li>HANA is not an emergency service. Patients in acute crisis are directed to emergency services</li>
            </ul>
            <p className="mt-4">
              Patients are always informed they are interacting with an AI system. HANA never impersonates a human clinician.
            </p>
          </Section>

          {/* 3. Client Obligations */}
          <Section number="3" title="Client Obligations">
            <h4 className="font-semibold text-[#1e2a3a] mb-3">3.1 Licensing and Clinical Responsibility</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Clients must hold all relevant licences and regulatory approvals required to deliver healthcare services in their jurisdiction</li>
              <li>Clients retain full clinical and professional responsibility for all patient care decisions, regardless of AI-generated outputs</li>
              <li>Clients must designate a named clinician responsible for reviewing HANA-generated summaries and escalation alerts</li>
              <li>Clients must ensure their deployment of HANA complies with all applicable national and local healthcare regulations</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">3.2 Patient Consent</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Clients are responsible for obtaining informed consent from patients prior to deploying HANA engagement workflows</li>
              <li>Consent must include: notification that interactions are AI-mediated; explanation of data use; right to opt out; escalation procedures</li>
              <li>For minors or patients lacking capacity, clients must obtain consent from an appropriate legal representative</li>
              <li>Clients must provide patients with access to HANA's Privacy Policy at onboarding</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">3.3 Appropriate Use</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>HANA may only be used for legitimate clinical and healthcare operational purposes</li>
              <li>Clients must not use HANA for marketing, commercial profiling, or non-clinical communications</li>
              <li>Clients must promptly notify HANA of any adverse events, safeguarding concerns, or patient safety issues arising from platform use</li>
              <li>Clients must implement and maintain appropriate access controls for the HANA clinical dashboard</li>
            </ul>
          </Section>

          {/* 4. Patient Rights and Opt-Out */}
          <Section number="4" title="Patient Rights and Opt-Out">
            <p className="mb-4">
              Patients may opt out of HANA engagement workflows at any time by replying STOP to any SMS or WhatsApp message, or by informing their healthcare provider. Opting out of HANA does not affect the patient's right to clinical care.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Opt-out requests are processed within 24 hours</li>
              <li>No further automated engagement will be initiated following opt-out</li>
              <li>Data deletion requests are handled under the Privacy Policy and applicable DPA</li>
            </ul>
          </Section>

          {/* 5. AI Transparency and Limitations */}
          <Section number="5" title="AI Transparency and Limitations">
            <p className="mb-4">Clients and patients must understand the following limitations of HANA's AI systems:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI systems may produce outputs that are incomplete, inaccurate, or insufficiently nuanced — clinical review is always required</li>
              <li>HANA's AI performs best within its validated clinical protocols; use outside trained parameters may reduce accuracy</li>
              <li>AI performance may vary across languages, dialects, and patient demographics — HANA conducts ongoing bias monitoring but cannot guarantee uniform performance</li>
              <li>Voice analysis features (tone, pace, acoustic biomarkers) are indicative only and should not be used as standalone clinical evidence</li>
            </ul>
          </Section>

          {/* 6. Intellectual Property */}
          <Section number="6" title="Intellectual Property">
            <ul className="list-disc pl-6 space-y-2">
              <li>The HANA platform, including all AI models, clinical protocols, conversation designs, APIs, and documentation, is the exclusive intellectual property of HANA Health Ltd</li>
              <li>Client-specific data, clinical outputs, and conversation histories generated through the platform belong to the Client and their patients, subject to the DPA</li>
              <li>HANA retains the right to use anonymised, aggregated, non-identifiable data to improve platform performance, subject to applicable law</li>
              <li>Clients may not reverse-engineer, resell, sublicense, or replicate the HANA platform without prior written consent</li>
            </ul>
          </Section>

          {/* 7. Service Levels */}
          <Section number="7" title="Service Levels, Availability, and Support">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">Metric</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Commitment</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Platform Uptime Target" meaning="99.5% monthly (excluding scheduled maintenance)" />
                  <DefRow term="Scheduled Maintenance Window" meaning="Sundays 02:00–06:00 UTC (advance notice provided)" />
                  <DefRow term="Critical Incident Response" meaning="Within 2 hours (P1 — platform unavailable or safety system failure)" />
                  <DefRow term="Support Response (Standard)" meaning="Within 1 business day" />
                  <DefRow term="Clinical Escalation Support" meaning="24/7 escalation routing to designated on-call clinical staff" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 8. Liability and Indemnification */}
          <Section number="8" title="Liability and Indemnification">
            <p className="mb-4">
              HANA's liability to Clients is limited to the total fees paid by the Client in the 12 months preceding the claim, except in cases of gross negligence, wilful misconduct, or breach of data protection obligations.
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">8.1 HANA is not liable for:</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Clinical decisions made by Client clinicians, regardless of whether AI-generated outputs were consulted</li>
              <li>Harm resulting from the Client's failure to review escalation alerts</li>
              <li>Service disruptions caused by third-party infrastructure failures (telephony, cloud), provided HANA has met its own SLA obligations</li>
              <li>Outcomes in deployments where HANA's clinical protocols have been materially modified without HANA's approval</li>
            </ul>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">8.2 Client Indemnification</h4>
            <p>
              Clients agree to indemnify HANA against claims arising from: unlicensed clinical practice; failure to obtain patient consent; breach of these Terms; misuse of the platform for non-clinical purposes.
            </p>
          </Section>

          {/* 9. Term, Termination, and Offboarding */}
          <Section number="9" title="Term, Termination, and Offboarding">
            <ul className="list-disc pl-6 space-y-2">
              <li>Initial contract term: 12 months, renewing automatically unless 60 days' written notice is provided</li>
              <li>Either party may terminate with 30 days' notice in the event of a material breach not remedied within 14 days of written notice</li>
              <li>Upon termination, HANA will provide a full data export within 30 days and will securely delete all Client and patient data within 90 days, unless legal retention obligations apply</li>
              <li>During the offboarding window, clinical access to summaries and escalation logs remains available for continuity of care</li>
            </ul>
          </Section>

          {/* 10. Governing Law */}
          <Section number="10" title="Governing Law">
            <p>
              These Terms are governed by the laws of Ireland. For US-based Clients, HIPAA requirements govern data protection obligations and are incorporated into the BAA. EU Clients: GDPR and applicable national implementing legislation apply. UK Clients: UK GDPR and DCB0129 / DTAC apply. For disputes not resolved by negotiation, the parties agree to binding arbitration in Dublin, Ireland.
            </p>
          </Section>

          {/* PART B */}
          <div className="border-b border-slate-200 pb-4 mb-10 mt-16">
            <h2 className="text-2xl font-semibold text-[#1e2a3a] tracking-tight">PART B — SECURITY POLICY</h2>
          </div>

          {/* 11. Security Governance */}
          <Section number="11" title="Security Governance">
            <p className="mb-6">
              HANA maintains a formal Information Security Management System (ISMS) aligned with ISO 27001 principles. Security governance is the joint responsibility of the CTO and Privacy Lead, with quarterly reviews by the leadership team.
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">Compliance Framework Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Framework</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Scope</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  {[
                    ["GDPR", "Compliant", "EU-wide; data minimisation, privacy by design, DPA with all processors"],
                    ["HIPAA", "Aligned", "BAA available; PHI architecture compliant; access controls in place"],
                    ["SOC 2 Type II", "Completed", "Readiness complete; audit certificate process finalised"],
                    ["EU AI Act", "Implementing", "Use-case risk classification complete; transparency & oversight measures deployed"],
                    ["DCB0129", "Compliant", "Clinical risk management for UK health IT systems"],
                    ["DTAC", "Compliant", "Digital Technology Assessment Criteria (NHS England)"],
                    ["ISO 27001", "Aligned", "ISMS implemented; formal certification roadmap in progress"],
                  ].map(([fw, status, scope]) => (
                    <tr key={fw} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-[#1e2a3a]">{fw}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === "Compliant" || status === "Completed" ? "bg-green-50 text-green-700" :
                          status === "Aligned" ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 12. Data Encryption */}
          <Section number="12" title="Data Encryption">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">Context</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Standard</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Data at Rest" meaning="AES-256 (AWS KMS-managed keys; customer-managed keys available for enterprise)" />
                  <DefRow term="Data in Transit" meaning="TLS 1.2 / TLS 1.3 (mandatory; older protocols disabled)" />
                  <DefRow term="Voice Channels" meaning="End-to-end encrypted where channel supports it; HIPAA-compliant SMS gateways for US" />
                  <DefRow term="Database encryption" meaning="Column-level encryption for PHI fields; full disk encryption on all storage volumes" />
                  <DefRow term="Backup encryption" meaning="AES-256 applied to all backups; cross-region replication for EU only" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 13. Access Control */}
          <Section number="13" title="Access Control">
            <ul className="list-disc pl-6 space-y-2">
              <li>Role-based access control (RBAC) applied to all platform components</li>
              <li>Clinicians access only their own patients' data; cross-clinic data isolation enforced at infrastructure level</li>
              <li>Multi-factor authentication (MFA) mandatory for all clinical dashboard access</li>
              <li>Privileged access management (PAM) controls applied to all infrastructure administration</li>
              <li>Access logs retained for 24 months; anomaly detection alerts are reviewed daily</li>
              <li>Employee access rights reviewed quarterly; terminated immediately upon offboarding</li>
            </ul>
          </Section>

          {/* 14. Vulnerability Management */}
          <Section number="14" title="Vulnerability Management">
            <ul className="list-disc pl-6 space-y-2">
              <li>Automated vulnerability scanning: daily on all production infrastructure</li>
              <li>Penetration testing: annual third-party external pentest; results reviewed within 5 business days</li>
              <li>Patch management: critical vulnerabilities patched within 48 hours; high within 7 days; medium within 30 days</li>
              <li>Dependency scanning: all third-party libraries monitored via automated tooling (CVE tracking)</li>
              <li>Bug bounty programme: responsible disclosure policy available at hanahealth.ai/security</li>
            </ul>
          </Section>

          {/* 15. Incident Response */}
          <Section number="15" title="Incident Response">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">Phase</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">HANA Commitment</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Detection & Triage" meaning="Automated alerting; P1 incidents acknowledged within 30 minutes" />
                  <DefRow term="Containment" meaning="Affected systems isolated within 2 hours of P1 detection" />
                  <DefRow term="Client Notification" meaning="Within 24 hours of confirmed breach (72 hours for GDPR Article 33 notification to DPA)" />
                  <DefRow term="Patient Notification" meaning="As required by GDPR Art. 34 and applicable law; coordinated with Client" />
                  <DefRow term="Post-Incident Review" meaning="Root cause analysis delivered within 5 business days" />
                  <DefRow term="Regulatory Reporting" meaning="HANA supports Clients in fulfilling all mandatory regulatory breach notifications" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* 16. Subprocessor Security */}
          <Section number="16" title="Subprocessor Security">
            <p className="mb-4">
              All sub-processors with access to personal or health data must meet the following minimum standards before engagement:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Signed Data Processing Agreement (DPA) incorporating GDPR Standard Contractual Clauses where required</li>
              <li>Evidence of SOC 2 Type II or ISO 27001 certification, or equivalent</li>
              <li>BAA executed for any US-based processor with access to PHI</li>
              <li>Annual security assessment by HANA's security team</li>
              <li>Right to audit provisions included in all sub-processor contracts</li>
            </ul>
            <p>
              An up-to-date list of active sub-processors is available at hanahealth.ai/subprocessors. Clients will be notified 30 days in advance of any new sub-processor engagement and may object.
            </p>
          </Section>

          {/* 17. Business Continuity and Disaster Recovery */}
          <Section number="17" title="Business Continuity and Disaster Recovery">
            <ul className="list-disc pl-6 space-y-2">
              <li>Recovery Time Objective (RTO): 4 hours for P1 platform failure</li>
              <li>Recovery Point Objective (RPO): 1 hour (continuous replication; point-in-time recovery available)</li>
              <li>Hot standby infrastructure maintained in secondary AWS region</li>
              <li>Full DR tests conducted bi-annually; results reviewed by leadership</li>
              <li>Clinical escalation routing remains operational during platform outages via SMS failover</li>
            </ul>
          </Section>

          {/* 18. AI-Specific Security Measures */}
          <Section number="18" title="AI-Specific Security Measures">
            <p className="mb-4">Given HANA's AI-driven architecture, the following additional security controls apply:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prompt injection prevention: all patient inputs are sanitised and validated before reaching AI models</li>
              <li>Model output filtering: AI responses are passed through safety classifiers before delivery</li>
              <li>Hallucination mitigation: clinical reasoning engine is grounded in clinic-specific protocols and knowledge bases; outputs outside validated parameters are flagged for human review</li>
              <li>Data isolation between clients: AI model inference is stateless; no cross-client data leakage at model layer</li>
              <li>Open-source model deployments (Llama 3.1): run on HANA-controlled infrastructure; no patient data transmitted to external model providers</li>
              <li>AI audit logs: all AI inference requests and outputs are logged with full traceability for auditability</li>
            </ul>
          </Section>

          {/* 19. Physical Security */}
          <Section number="19" title="Physical Security">
            <ul className="list-disc pl-6 space-y-2">
              <li>HANA is a cloud-native company; no patient data is processed on employee devices</li>
              <li>For on-premise deployments (Italy, Middle East): physical server access is controlled by the healthcare institution partner, with HANA providing hardened server configurations and audit logging</li>
              <li>All HANA employees complete mandatory security awareness training on joining and annually thereafter</li>
              <li>Clean desk / clear screen policy enforced for all remote and office workers</li>
            </ul>
          </Section>

          {/* 20. Security Contact */}
          <Section number="20" title="Security Contact">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">Contact Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Details</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Security incidents and breach reports" meaning="security@hanahealth.ai" />
                  <DefRow term="Responsible disclosure / bug reports" meaning="security@hanahealth.ai (PGP key available on request)" />
                  <DefRow term="Compliance and audit requests" meaning="compliance@hanahealth.ai" />
                  <DefRow term="General security questions" meaning="security@hanahealth.ai" />
                </tbody>
              </table>
            </div>
          </Section>

          {/* Footer note */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-[#718096]">
              HANA Health Ltd &nbsp;|&nbsp; <a href="mailto:privacy@hanahealth.ai" className="text-blue-600 hover:text-blue-800 transition-colors">privacy@hanahealth.ai</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* Reusable section wrapper */
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold text-[#1e2a3a] mb-4 tracking-tight">
        {number}. {title}
      </h3>
      <div className="text-[15px] leading-[1.8] text-[#718096]">
        {children}
      </div>
    </section>
  );
}

/* Reusable table row */
function DefRow({ term, meaning }: { term: string; meaning: string }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 font-medium text-[#1e2a3a]">{term}</td>
      <td className="px-4 py-3">{meaning}</td>
    </tr>
  );
}
