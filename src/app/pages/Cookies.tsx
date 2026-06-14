import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

/**
 * Cookie Policy for hana.health. Inventory reflects the trackers currently
 * loaded by the Site (Google Tag Manager + GA4, VideoAsk, Calendly).
 */
export function Cookies() {
  return (
    <>
      <SEO
        title="Cookie Policy | HANA Health"
        description="How HANA Health, Inc. uses cookies and similar tracking technologies on the hana.health website, and how to manage your preferences."
        path="/cookies"
      />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">HANA Health, Inc.</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-6 leading-[1.1]">
              Cookie Policy
            </h1>
            <p className="text-slate-400 text-base">
              Effective Date: 14 June 2026 &nbsp;|&nbsp; Last Updated: 14 June 2026
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-16 text-[#1e2a3a]">
          <p className="text-[15px] leading-[1.8] text-[#718096] mb-12">
            This Cookie Policy explains how HANA Health, Inc. (&ldquo;HANA,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) uses cookies and similar technologies (such as pixels, SDKs, and local storage) on the <strong className="text-[#1e2a3a]">hana.health</strong> website (the &ldquo;Site&rdquo;), and how you can control them. It supplements our{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

          {/* 1 */}
          <Section number="1" title="What cookies are">
            <p>
              Cookies are small text files placed on your device when you visit a website. They help sites function, remember your preferences, and understand how the site is used. &ldquo;First-party&rdquo; cookies are set by us; &ldquo;third-party&rdquo; cookies are set by our service providers. Cookies may be &ldquo;session&rdquo; cookies (deleted when you close your browser) or &ldquo;persistent&rdquo; cookies (which remain until they expire or you delete them).
            </p>
          </Section>

          {/* 2 */}
          <Section number="2" title="Categories of cookies we use">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1e2a3a]">Strictly necessary</strong> &mdash; required for the Site to load and function. These do not require consent.</li>
              <li><strong className="text-[#1e2a3a]">Analytics / performance</strong> &mdash; help us measure traffic and improve the Site (e.g., Google Analytics).</li>
              <li><strong className="text-[#1e2a3a]">Functional</strong> &mdash; enable embedded features such as scheduling and interactive video.</li>
            </ul>
            <p className="mt-4">
              Analytics and functional cookies are non-essential. For visitors in the EEA/UK, we ask for your consent before setting non-essential cookies; for US visitors, you may opt out as described in Section 5.
            </p>
          </Section>

          {/* 3 */}
          <Section number="3" title="Cookies and trackers on this Site">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Name / provider</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#1e2a3a] border-b border-slate-200">Category</th>
                  </tr>
                </thead>
                <tbody className="text-[#718096]">
                  <Row a="_ga (Google)" b="Distinguishes unique users for analytics" c="2 years" d="Analytics" />
                  <Row a="_ga_<container> (Google)" b="Persists analytics session state (GA4)" c="2 years" d="Analytics" />
                  <Row a="Google Tag Manager (GTM-PV2V5846)" b="Loads and manages tags; does not itself set cookies by default" c="—" d="Functional" />
                  <Row a="VideoAsk / Typeform" b="Enables the embedded interactive video widget; sets its own cookies/storage when loaded" c="Session – up to 1 year" d="Functional" />
                  <Row a="Calendly" b="Supports the demo-scheduling widget/links when you interact with booking" c="Session – up to 1 year" d="Functional" />
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-slate-400">
              Exact cookie names and lifetimes are set by each provider and may change. For the definitive, current list, consult each provider&rsquo;s own cookie documentation.
            </p>
          </Section>

          {/* 4 */}
          <Section number="4" title="Third-party cookies">
            <p>
              Some cookies are set by third parties when their content or tools load on the Site, including Google (analytics), Typeform/VideoAsk (interactive video), and Calendly (scheduling). These providers process data under their own privacy and cookie policies. We encourage you to review them.
            </p>
          </Section>

          {/* 5 */}
          <Section number="5" title="Managing your cookie choices">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1e2a3a]">Consent controls:</strong> Where required, we provide a cookie banner / preference center that lets you accept or reject non-essential cookies before they are set, and to change your choice later.</li>
              <li><strong className="text-[#1e2a3a]">Browser settings:</strong> Most browsers let you block or delete cookies and notify you when cookies are set. Blocking some cookies may affect how the Site works.</li>
              <li><strong className="text-[#1e2a3a]">Google Analytics opt-out:</strong> You can install Google&rsquo;s Analytics Opt-out Browser Add-on.</li>
              <li><strong className="text-[#1e2a3a]">Global Privacy Control (GPC):</strong> Where required by law, we honor GPC signals as an opt-out of the &ldquo;sale&rdquo;/&ldquo;sharing&rdquo; of personal information.</li>
            </ul>
          </Section>

          {/* 6 */}
          <Section number="6" title="Changes and contact">
            <p className="mb-4">
              We may update this Cookie Policy to reflect changes to the technologies we use or to applicable law. We will post the updated version here with a new &ldquo;Last Updated&rdquo; date.
            </p>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-[15px]">
              <p className="font-semibold text-[#1e2a3a] mb-1">HANA Health, Inc.</p>
              <p>Privacy: <a href="mailto:privacy@hana.health" className="text-blue-600 hover:underline">privacy@hana.health</a></p>
              <p>Related: <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></p>
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </>
  );
}

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

function Row({ a, b, c, d }: { a: string; b: string; c: string; d: string }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 font-medium text-[#1e2a3a] align-top">{a}</td>
      <td className="px-4 py-3 align-top">{b}</td>
      <td className="px-4 py-3 align-top whitespace-nowrap">{c}</td>
      <td className="px-4 py-3 align-top">{d}</td>
    </tr>
  );
}
