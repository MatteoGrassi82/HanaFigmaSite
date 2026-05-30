import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

function Section({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="border-b border-slate-200 pb-3 mb-6">
        <h2 className="text-xl font-semibold text-[#1e2a3a] tracking-tight">
          {number ? `${number}. ${title}` : title}
        </h2>
      </div>
      <div className="space-y-4 text-[15px] leading-[1.8] text-[#718096]">
        {children}
      </div>
    </div>
  );
}

function Sub({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-[#1e2a3a] mb-3">{number} {title}</h3>
      {children}
    </div>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2">{children}</ul>;
}

export function AUP() {
  return (
    <>
      <SEO
        title="Acceptable Use Policy | HANA Health"
        description="HANA Health Acceptable Use Policy — describes prohibited and restricted uses of HANA's services, products, and platform."
        path="/aup"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health, Inc.</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              Acceptable Use Policy
            </h1>
            <p className="text-slate-400 text-base">
              Effective Date: 10 May 2026 &nbsp;|&nbsp; Last Updated: 10 May 2026
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            This Acceptable Use Policy (the "AUP") describes prohibited and restricted uses of HANA Health, Inc.'s services, products, and platform (the "Services"). This AUP is incorporated by reference into the HANA Master Services Agreement (the "Agreement") between HANA and Customer. Capitalized terms not defined here have the meanings given in the Agreement.
          </p>
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            By using the Services, Customer and its Users agree to comply with this AUP. Violation of this AUP is a material breach of the Agreement and may result in suspension or termination of the Services.
          </p>

          <Section number="1" title="General principles">
            <p>
              Customer and its Users must use the Services lawfully, ethically, and in accordance with the Agreement. Customer is responsible for all activity conducted through Customer's account, including activity by Customer's personnel, contractors, and patients.
            </p>
          </Section>

          <Section number="2" title="Prohibited uses">
            <p>Customer and its Users <strong className="text-[#1e2a3a]">must not</strong>, and must not allow any third party to:</p>

            <Sub number="2.1" title="Unlawful conduct">
              <Ul>
                <li>Use the Services to violate any applicable law, regulation, or order, including the Telephone Consumer Protection Act (TCPA), the Telemarketing Sales Rule (TSR), the Do-Not-Call Implementation Act, the CAN-SPAM Act, the Health Insurance Portability and Accountability Act (HIPAA), the Gramm-Leach-Bliley Act (GLBA), the Fair Credit Reporting Act (FCRA), or applicable state privacy, consumer protection, or biometric privacy laws.</li>
                <li>Use the Services to perpetrate fraud, deception, or any unfair or abusive practice.</li>
                <li>Use the Services to make calls or send messages to recipients who have not provided required consent under applicable law, or who have opted out of communications.</li>
              </Ul>
            </Sub>

            <Sub number="2.2" title="Harm and abuse">
              <Ul>
                <li>Use the Services to harass, threaten, intimidate, defame, or otherwise harm any individual or organization.</li>
                <li>Use the Services to discriminate against any individual or group on the basis of any protected characteristic.</li>
                <li>Use the Services to communicate with minors in any context where such communication is restricted or prohibited by law.</li>
              </Ul>
            </Sub>

            <Sub number="2.3" title="Misrepresentation and impersonation">
              <Ul>
                <li>Use the Services to impersonate any individual, organization, or governmental authority without lawful authorization or, where required, the express written consent of the person being impersonated.</li>
                <li>Use the Services to generate synthesized or cloned voices that mimic real individuals without proper authorization.</li>
                <li>Misrepresent the AI-assisted nature of communications where disclosure is required by law (including under FCC rules regarding AI-generated voice communications).</li>
              </Ul>
            </Sub>

            <Sub number="2.4" title="High-risk applications">
              <Ul>
                <li>Use the Services in connection with any High-Risk Activity, including emergency response, life-support systems, medical diagnosis or treatment decisions, or any application where failure of the Services could reasonably be expected to result in death, personal injury, financial loss to a third party, or environmental damage.</li>
                <li>Use the Services as a substitute for professional medical, legal, or financial judgment.</li>
                <li>Direct the Services to provide medical advice, diagnosis, or treatment recommendations to patients.</li>
              </Ul>
            </Sub>

            <Sub number="2.5" title="Technical restrictions">
              <Ul>
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Services.</li>
                <li>Copy, modify, or create derivative works of the Services or any HANA Technology, except as expressly permitted by the Agreement.</li>
                <li>Conduct security testing, penetration testing, vulnerability scanning, load testing, or benchmarking of the Services without HANA's prior written consent.</li>
                <li>Interfere with the operation of, cause performance degradation of, or impose an unreasonable load on the Services.</li>
                <li>Attempt to gain unauthorized access to the Services, accounts, or systems other than those for which Customer has been granted access.</li>
                <li>Use any other person's account credentials or share Customer's credentials with unauthorized third parties.</li>
                <li>Submit malicious code, viruses, worms, or content that infringes any third party's rights to or through the Services.</li>
              </Ul>
            </Sub>

            <Sub number="2.6" title="Competitive use">
              <Ul>
                <li>Use the Services to develop, train, fine-tune, validate, or improve any artificial intelligence or machine-learning model that competes with the Services or any HANA Technology.</li>
                <li>Use Outputs of the Services to compile a database for the purpose of competing with or replacing the Services.</li>
              </Ul>
            </Sub>

            <Sub number="2.7" title="Resale and sublicensing">
              <Ul>
                <li>Resell, sublicense, lease, distribute, or otherwise make the Services available to any third party without HANA's prior written consent, except for use by Customer's authorized Users in accordance with the Agreement.</li>
              </Ul>
            </Sub>
          </Section>

          <Section number="3" title="Customer obligations specific to voice AI">
            <p>Customer acknowledges that the Services include AI-generated voice communications and assumes the following responsibilities:</p>

            <Sub number="3.1" title="Patient consent">
              <Ul>
                <li>Obtain and maintain all consents, authorizations, and approvals required by law for HANA to make and receive calls or send messages on Customer's behalf, including any consents required for AI-generated voice communications under the TCPA and FCC rules.</li>
                <li>Maintain auditable records of such consents and provide them to HANA upon reasonable request.</li>
              </Ul>
            </Sub>

            <Sub number="3.2" title="Disclosure">
              <Ul>
                <li>Ensure that the AI-assisted nature of communications is disclosed to recipients where required by law.</li>
                <li>Ensure that all call scripts, prompts, and knowledge base content used with the Services accurately represent Customer and the nature of the communications.</li>
              </Ul>
            </Sub>

            <Sub number="3.3" title="Human oversight">
              <Ul>
                <li>Maintain appropriate human oversight of Outputs generated by the Services before acting upon or communicating any Output to any patient or third party.</li>
                <li>Direct callers with emergency or urgent medical needs to appropriate emergency services.</li>
              </Ul>
            </Sub>

            <Sub number="3.4" title="Do-not-call compliance">
              <Ul>
                <li>Maintain and honor internal and national do-not-call lists, opt-out preferences, and applicable calling-time restrictions.</li>
              </Ul>
            </Sub>
          </Section>

          <Section number="4" title="Healthcare and PHI">
            <p>
              When the Services process Protected Health Information (PHI), Customer must comply with HIPAA, the Business Associate Agreement (BAA) executed between the parties, and all applicable state medical privacy laws. Customer must not transmit PHI to the Services through any channel not authorized by the Agreement and the BAA.
            </p>
          </Section>

          <Section number="5" title="Reporting violations">
            <p>
              If Customer becomes aware of any actual or suspected violation of this AUP, Customer must promptly notify HANA in writing at{" "}
              <a href="mailto:abuse@hana.health" className="text-blue-600 hover:underline">abuse@hana.health</a>.
              Reports should include sufficient detail for HANA to investigate.
            </p>
          </Section>

          <Section number="6" title="Enforcement">
            <p>HANA may, in its sole discretion and consistent with the Agreement:</p>
            <Ul>
              <li>Investigate any actual or suspected violation of this AUP</li>
              <li>Suspend or restrict access to the Services</li>
              <li>Remove or refuse to process content or communications</li>
              <li>Cooperate with law enforcement and regulatory authorities</li>
              <li>Terminate the Agreement for material breach</li>
            </Ul>
            <p className="mt-4">
              HANA will use commercially reasonable efforts to provide notice of suspension or restriction where practicable, except where immediate action is required to protect HANA, the Services, or third parties.
            </p>
          </Section>

          <Section number="7" title="Modifications">
            <p>
              HANA may update this AUP from time to time to reflect changes in applicable law, the Services, or operational requirements. Material changes will be posted at{" "}
              <a href="https://hana.health/aup" className="text-blue-600 hover:underline">hana.health/aup</a>{" "}
              with reasonable advance notice (typically thirty (30) days), except where shorter notice is necessary to address a security, legal, or regulatory issue.
            </p>
          </Section>

          <Section number="8" title="Contact">
            <p>Questions regarding this AUP can be directed to:</p>
            <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 text-[15px]">
              <p className="font-semibold text-[#1e2a3a] mb-1">HANA Health, Inc.</p>
              <p>Email: <a href="mailto:legal@hana.health" className="text-blue-600 hover:underline">legal@hana.health</a></p>
              <p>Web: <a href="https://hana.health/aup" className="text-blue-600 hover:underline">hana.health/aup</a></p>
            </div>
          </Section>

          <div className="border-t border-slate-200 pt-8 mt-4">
            <p className="text-[13px] text-slate-400 italic">
              This AUP is incorporated by reference into the HANA Master Services Agreement and the Order Form executed between HANA Health, Inc. and Customer. In the event of conflict, the Agreement governs.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
