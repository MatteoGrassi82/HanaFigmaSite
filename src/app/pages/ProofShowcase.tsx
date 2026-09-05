import { ProofBento } from "../components/sections/ProofBento";
import { Footer } from "../components/layout/Footer";
import { SEO } from "../components/SEO";

/**
 * Standalone preview route (/proof) for the Federato-style customer-proof bento.
 * Not linked in the nav — a sandbox to evaluate the section style.
 */
export function ProofShowcase() {
  return (
    <div className="overflow-x-hidden">
      {/* Internal preview: must never be indexed. See the note in BentoShowcase. */}
      <SEO
        title="Internal preview: /proof"
        description="Internal preview route. Not part of the public site."
        path="/proof"
        robots="noindex, nofollow"
      />
      <div className="pt-10 text-center bg-white">
        <span className="inline-block rounded-full bg-slate-50 text-slate-500 border border-slate-200 text-xs font-medium px-3 py-1">
          Preview · /proof
        </span>
      </div>
      <ProofBento />
      <Footer />
    </div>
  );
}
