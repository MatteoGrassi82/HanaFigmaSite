import { FeatureBento } from "../components/ui/feature-bento";
import { PatientEngagement } from "../components/PatientEngagement";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";

/**
 * Standalone preview route (/bento) for the Decagon-style feature bento.
 * Not linked in the nav — it exists so we can review the section in isolation
 * before deciding where (if anywhere) it lands on the live pages.
 */
export function BentoShowcase() {
  return (
    <div className="overflow-x-hidden">
      {/* Internal preview: must never be indexed. Without an <SEO> block the
          prerender snapshot inherits the homepage's head — canonical "/" and
          index,follow — which is what turned these sandbox routes into homepage
          duplicates in Search Console. */}
      <SEO
        title="Internal preview: /bento"
        description="Internal preview route. Not part of the public site."
        path="/bento"
        robots="noindex, nofollow"
      />
      <div className="pt-10 text-center">
        <span className="inline-block rounded-full bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1">
          Preview · /bento
        </span>
      </div>
      <FeatureBento />
      <PatientEngagement />
      <Footer />
    </div>
  );
}
