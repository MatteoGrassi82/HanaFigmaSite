import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";
import { LoopDiagram } from "../components/ui/loop-diagram";
import { ClientFeedback } from "../components/ui/testimonial";

/**
 * Scratch preview page for sections in progress.
 *
 * This route ("/preview") is a sandbox — it is intentionally NOT linked from
 * the navbar and is excluded from search engines (robots: noindex). Drop any
 * in-progress section here to see it live in isolation without touching Home
 * or any other live page. Once a section is finalized, mount it on its real
 * page and remove it from here.
 */
export function Preview() {
  return (
    <>
      <SEO
        title="Preview"
        useExactTitle
        path="/preview"
        robots="noindex, nofollow"
      />

      {/* ── Sections under construction ──────────────────────────────────── */}
      {/* ProductsIntro graduated to Home §1c (2026-08-04). */}
      <LoopDiagram />
      <ClientFeedback />

      <Footer />
    </>
  );
}

export default Preview;
