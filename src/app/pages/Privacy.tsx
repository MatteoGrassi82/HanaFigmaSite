import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

/**
 * Privacy Policy for the public hana.health website (site visitors / prospects).
 * Patient PHI processed on behalf of healthcare providers through the HANA
 * platform is governed separately by the Business Associate Agreement (BAA) and
 * Data Processing Agreement (DPA), not by this Site policy.
 */
export function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | HANA Health"
        description="How HANA Health, Inc. collects, uses, discloses, and protects personal information of visitors to the hana.health website, including your privacy rights under GDPR and US state law."
        path="/privacy"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health, Inc.</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-base">
              Effective Date: 14 June 2026 &nbsp;|&nbsp; Last Updated: 14 June 2026
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-6">
            HANA Health, Inc. (&ldquo;HANA,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard personal information when you visit or interact with the <strong className="text-[#1e2a3a]">hana.health</strong> website and related pages (collectively, the &ldquo;Site&rdquo;), and the privacy rights and choices available to you. By using the Site, you agree to this Privacy Policy.
          </p>
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            <strong className="text-[#1e2a3a]">Patient health information.</strong> When HANA processes Protected Health Information (PHI) on behalf of a healthcare provider through the HANA platform, HANA acts as a HIPAA business associate (and, where applicable, a processor under the GDPR). That information is governed by the Business Associate Agreement (BAA) and Data Processing Agreement (DPA) between HANA and the provider, and by the provider&rsquo;s own Notice of Privacy Practices &mdash; not by this Site Privacy Policy. This Site is intended for healthcare organizations and prospective customers, not for patient care.
          </p>

          {/* 1 */}
          <Section number="1" title="Who we are">
            <p>
              The entity responsible for personal information collected through the Site is HANA Health, Inc., a company organized in the United States. You can reach us about privacy at{" "}
              <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a>. If you are located in the European Economic Area (EEA) or the United Kingdom, see Section 11 for how to contact us and your right to lodge a complaint with a supervisory authority.
            </p>
          </Section>

          {/* 2 */}
          <Section number="2" title="Information we collect">
            <p className="mb-4">We collect the following categories of personal information:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-1/3">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Examples &amp; source</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Identifiers & contact data" meaning="First and last name, email address, and organization, when you submit our contact form or request a demo. Provided directly by you." />
                  <DefRow term="Enquiry content" meaning="The subject and free-text message you send us, and any information you include in it. Provided directly by you." />
                  <DefRow term="Scheduling data" meaning="If you book a demo, your name, email, and selected time, processed through our scheduling provider (Calendly)." />
                  <DefRow term="Usage & device data" meaning="IP address, approximate location, device and browser type, pages viewed, referring/exit pages, and interaction events, collected automatically via cookies and analytics (Google Analytics 4 / Google Tag Manager)." />
                  <DefRow term="Interactive media data" meaning="If you engage an embedded VideoAsk (Typeform) widget, the responses and usage data you provide to it." />
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Please do not submit health information, PHI, or other sensitive personal data through the Site&rsquo;s free-text fields. The Site is for general business enquiries only.
            </p>
          </Section>

          {/* 3 */}
          <Section number="3" title="How we use personal information, and our legal bases">
            <p className="mb-4">We use personal information to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>respond to your enquiries and provide the information, demos, or materials you request;</li>
              <li>communicate with you about our products, including sales and account communications;</li>
              <li>operate, maintain, secure, and improve the Site and measure its performance;</li>
              <li>detect, prevent, and respond to fraud, abuse, security incidents, and unlawful activity; and</li>
              <li>comply with legal obligations and enforce our agreements.</li>
            </ul>
            <p className="mb-2">
              Where the GDPR / UK GDPR applies, our legal bases are: <strong className="text-[#1e2a3a]">performance of a contract or pre-contractual steps</strong> (responding to enquiries and demos); <strong className="text-[#1e2a3a]">legitimate interests</strong> (operating, securing, and marketing our business, balanced against your rights); <strong className="text-[#1e2a3a]">consent</strong> (non-essential cookies and certain marketing); and <strong className="text-[#1e2a3a]">legal obligation</strong> (compliance and record-keeping). You may withdraw consent at any time.
            </p>
          </Section>

          {/* 4 */}
          <Section number="4" title="How we disclose personal information">
            <p className="mb-4">
              We do not sell your personal information for money. We disclose personal information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1e2a3a]">Service providers / processors</strong> who perform services on our behalf under contract, including those listed in Section 5;</li>
              <li><strong className="text-[#1e2a3a]">Professional advisers</strong> (lawyers, auditors, accountants) where necessary;</li>
              <li><strong className="text-[#1e2a3a]">Authorities and third parties</strong> when required by law, legal process, or to protect rights, safety, and security; and</li>
              <li><strong className="text-[#1e2a3a]">A successor entity</strong> in connection with a merger, acquisition, financing, or sale of assets, subject to this Privacy Policy.</li>
            </ul>
            <p className="mt-4">
              See Section 8 regarding analytics &ldquo;sharing&rdquo; for cross-context behavioral advertising and your choices.
            </p>
          </Section>

          {/* 5 */}
          <Section number="5" title="Service providers we use">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200 w-2/5">Provider</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <DefRow term="Google LLC" meaning="Website analytics and tag management (Google Analytics 4, Google Tag Manager)." />
                  <DefRow term="Calendly LLC" meaning="Scheduling and booking of demo calls." />
                  <DefRow term="Typeform S.L. (VideoAsk)" meaning="Embedded interactive video, where used." />
                  <DefRow term="FormSubmit" meaning="Delivery of contact-form submissions to our team by email." />
                  <DefRow term="Cloud, email & CRM providers" meaning="Hosting, email delivery, and management of enquiries and customer relationships." />
                </tbody>
              </table>
            </div>
            <p className="mt-4">Each provider is permitted to process personal information only as needed to perform services for us and consistent with this Privacy Policy.</p>
          </Section>

          {/* 6 */}
          <Section number="6" title="Cookies and analytics">
            <p>
              The Site uses cookies and similar technologies for functionality and analytics. For a full inventory, the providers involved, and how to manage your choices, please see our{" "}
              <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>.
            </p>
          </Section>

          {/* 7 */}
          <Section number="7" title="Data retention">
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact and enquiry data: retained for as long as needed to handle your request and for a reasonable follow-up period, generally up to 24 months after our last interaction.</li>
              <li>Scheduling data: retained for the duration of the prospective or active customer relationship.</li>
              <li>Analytics data: retained according to the retention period configured in Google Analytics (generally up to 14 months).</li>
            </ul>
            <p className="mt-4">We retain personal information longer only where required to comply with legal obligations, resolve disputes, or enforce our agreements, and we delete or de-identify it when no longer needed.</p>
          </Section>

          {/* 8 */}
          <Section number="8" title="Your privacy choices (Do Not Sell or Share)">
            <p className="mb-4">
              We use analytics and tag-management tools (such as Google Analytics) that may involve &ldquo;sharing&rdquo; personal information for cross-context behavioral advertising or analytics under certain US state laws. We do not sell personal information for monetary consideration. You can exercise the following choices:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Opt out of analytics/advertising cookies through our cookie controls (see the <a href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</a>) and your browser settings.</li>
              <li>We honor the Global Privacy Control (GPC) signal as a valid opt-out of &ldquo;sale&rdquo;/&ldquo;sharing&rdquo; where required by law.</li>
              <li>Submit a request to <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a>, or use the <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.</li>
            </ul>
          </Section>

          {/* 9 */}
          <Section number="9" title="Data security">
            <p>
              We maintain administrative, technical, and physical safeguards designed to protect personal information, including encryption in transit (TLS 1.2/1.3) and at rest (AES-256), access controls, and monitoring. No method of transmission or storage is completely secure, and we cannot guarantee absolute security. Security measures applicable to the HANA platform and PHI are described in our Terms of Service &amp; Security Policy and the BAA.
            </p>
          </Section>

          {/* 10 */}
          <Section number="10" title="International data transfers">
            <p>
              We are based in the United States and use service providers located in the US and elsewhere. If you access the Site from the EEA, the UK, or another region with data-transfer restrictions, your personal information may be transferred to and processed in the United States. Where required, we rely on appropriate safeguards for such transfers, such as the EU-US Data Privacy Framework and/or the European Commission&rsquo;s Standard Contractual Clauses (with the UK Addendum). You may request more information about these safeguards by contacting <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a>.
            </p>
          </Section>

          {/* 11 */}
          <Section number="11" title="Your rights">
            <h4 className="font-semibold text-[#1e2a3a] mb-3">11.1 EEA / UK residents</h4>
            <p className="mb-3">Subject to applicable law, you have the right to access, rectify, erase, restrict, or object to the processing of your personal information; to data portability; and to withdraw consent. You also have the right to lodge a complaint with your local data protection supervisory authority.</p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">11.2 California, and other US state residents</h4>
            <p className="mb-3">
              Depending on your state of residence (including California, Colorado, Connecticut, Texas, Virginia, and others), you may have the right to: confirm whether we process your personal information and access it; correct inaccuracies; delete it; obtain a portable copy; and opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information and of targeted advertising. California residents may also request the categories of personal information collected, the sources, the business purposes, and the categories of third parties to whom it is disclosed, and may limit the use of sensitive personal information. We will not discriminate against you for exercising these rights.
            </p>

            <h4 className="font-semibold text-[#1e2a3a] mb-3">11.3 How to exercise your rights</h4>
            <p>
              Submit a request by emailing <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a> or using our <a href="/contact" className="text-blue-600 hover:underline">contact form</a>. We will verify your request as required by law and respond within the applicable timeframes. You may use an authorized agent where permitted.
            </p>
          </Section>

          {/* 12 */}
          <Section number="12" title="Children's privacy">
            <p>
              The Site is directed to healthcare organizations and businesses, not to children, and we do not knowingly collect personal information from children through the Site. Health information concerning minor patients that is processed through the HANA platform is handled under the applicable BAA/DPA and the provider&rsquo;s authority, with parental or guardian consent obtained by the provider. If you believe a child has provided us personal information through the Site, contact <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a> and we will delete it.
            </p>
          </Section>

          {/* 13 */}
          <Section number="13" title="Consumer health data">
            <p>
              Certain US state laws, including the Washington My Health My Data Act and Nevada SB370, regulate &ldquo;consumer health data.&rdquo; We do not use the Site to collect consumer health data for advertising, and we do not sell consumer health data. Where these laws apply and require consent before collecting or sharing such data, we will obtain it. To exercise rights regarding consumer health data, contact <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a>.
            </p>
          </Section>

          {/* 14 */}
          <Section number="14" title="Third-party links">
            <p>
              The Site may link to third-party websites and services (for example, scheduling, documentation, or social media). We are not responsible for their privacy practices, and we encourage you to review their privacy notices.
            </p>
          </Section>

          {/* 15 */}
          <Section number="15" title="Changes to this Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version here with a new &ldquo;Last Updated&rdquo; date and, where required, provide additional notice. Your continued use of the Site after an update constitutes acceptance of the revised policy.
            </p>
          </Section>

          {/* 16 */}
          <Section number="16" title="Contact us">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-[15px]">
              <p className="font-semibold text-[#1e2a3a] mb-1">HANA Health, Inc.</p>
              <p>Privacy: <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a></p>
              <p>General: <a href="mailto:hello@hana.health" className="text-blue-600 hover:underline">hello@hana.health</a></p>
              <p>Web: <a href="https://hana.health/privacy" className="text-blue-600 hover:underline">hana.health/privacy</a></p>
            </div>
          </Section>
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
      <td className="px-4 py-3 font-medium text-[#1e2a3a] align-top">{term}</td>
      <td className="px-4 py-3">{meaning}</td>
    </tr>
  );
}
