import { useEffect } from "react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";
import AuthorityForecast, { AuthoritySiteData, useAuthoritySiteForecasts } from "../components/media/AuthorityForecast";

/**
 * /forecasts — every live Authority forecast for hana.health, on one page.
 *
 * Built to be linked from LinkedIn posts: each forecast has its own anchor, named after the
 * post it belongs to (/forecasts#aco-reach-ends-lead-model-2027), so a post about one
 * forecast lands the reader on that chart. The list comes from Authority by itself
 * (useAuthoritySiteForecasts), so a new forecast appears here at the next build with no edit.
 *
 * The forecasts also stay on their own blog posts. That is where an answer engine cites
 * them, and Authority measures them per post; this page gathers them, it does not replace them.
 */

const COPY = {
  title: "Medicare policy forecasts | HANA Health",
  description:
    "Live probabilities on the CMS decisions that shape care management, value-based care and sleep: what is likely to happen, by when, and the sources behind every move.",
};

function anchorFor(path: string) {
  return path.split("/").filter(Boolean).pop() || path;
}

export function Forecasts() {
  const forecasts = useAuthoritySiteForecasts();

  // A LinkedIn link lands on one forecast (/forecasts#<post-slug>). The browser's own jump to
  // the anchor is lost when the app takes the page over (and ScrollToTop resets to 0), so
  // scroll there once the list is in, and again while the charts and their fonts settle the
  // layout above it. The first scroll, wheel, touch or key from the reader cancels the rest.
  useEffect(() => {
    if (!forecasts?.length) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let readerMoved = false;
    const stop = () => {
      readerMoved = true;
    };
    const go = () => {
      if (!readerMoved) document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    const events = ["wheel", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    const timers = [300, 1200, 2500].map((ms) => setTimeout(go, ms));
    return () => {
      timers.forEach(clearTimeout);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [forecasts]);

  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/forecasts"
        useExactTitle
        keywords="CMS forecast, Medicare policy forecast, CCM staffing rule 2027, LEAD model ACOs, APP Plus measures"
        jsonLd={[breadcrumbSchema([{ name: "Forecasts", url: "https://www.hana.health/forecasts" }])]}
      />

      <Hero
        tone="orbs"
        eyebrow="Forecasts"
        headline={<>What CMS is likely <em>to do next.</em></>}
        body="Live probabilities on the Medicare decisions that shape care management, value-based care and sleep. Each one moves as the evidence lands, with the source behind every move."
        primaryCta={{ label: "See the forecasts", href: "#forecasts" }}
        secondaryCta={{ label: "Read the explainers", href: "/blog" }}
        trustLine="Forecasts by Authority. Each one links to the HANA explainer behind the question."
      />

      <section id="forecasts" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[860px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">Live now</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-12 max-w-[24ch]">The questions we are tracking.</h2>

          {forecasts && <AuthoritySiteData forecasts={forecasts} />}

          {forecasts === null && <p className="text-[16px] text-ink-soft m-0">Loading the forecasts.</p>}
          {forecasts && forecasts.length === 0 && (
            <p className="text-[16px] text-ink-soft m-0">New forecasts appear here as they are published.</p>
          )}

          <div className="flex flex-col gap-16">
            {(forecasts || []).map((f) => (
              <article key={f.forecast_id} id={anchorFor(f.path)} className="scroll-mt-24">
                <AuthorityForecast id={f.forecast_id} />
                <a
                  href={f.path}
                  className="mt-5 inline-block text-[15px] font-semibold text-ink-soft underline underline-offset-4 decoration-rule hover:decoration-ink-soft"
                >
                  Read the explainer behind this forecast
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading={<>Planning around these rules? <em>Talk it through.</em></>}
        body="Bring your programmes and your panel. We will go through what each decision means for the calls your team has to make."
        buttons={[
          { label: "Book a demo", href: DEMO_HREF },
          { label: "Talk to us", href: "/contact", variant: "ghost" },
        ]}
        reassurances={[]}
      />

      <Footer />
    </div>
  );
}

export default Forecasts;
