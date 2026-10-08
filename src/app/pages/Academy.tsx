import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { LatestPosts } from "../components/sections/LatestPosts";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";
import { PUBLISHED_PROGRAMMES } from "../../content/programmes/index";

/**
 * /academy — the learning hub.
 *
 * AN INDEX, NOT AN ARGUMENT. Every other page on this site is trying to
 * persuade someone. This one is trying to get them to the right page, so it has
 * no proof section, no estimator and no comparison. If it starts growing a
 * pitch, it has stopped being useful.
 *
 * THE CURATED BLOCK IS THE CRAWLABLE PART. LatestPosts fetches from Sanity in
 * an effect, so it contributes nothing to the prerendered snapshot: a crawler
 * sees an empty region where those three cards will be. That is why the routes
 * above it are hand-written links rather than another feed. Do not replace the
 * curated block with a second dynamic list or the page becomes a headline and
 * two empty divs in the HTML that actually gets indexed.
 *
 * NO TOPIC FILTERING YET. The blog has 115+ posts and no `topic` field in the
 * Sanity schema, so there is no honest way to show "everything about CCM"
 * here. When the field lands and the backfill runs, this page grows a
 * per-programme reading list and the three-latest feed becomes secondary.
 * Until then it shows the three most recent and says so.
 *
 * NOINDEX with the /programs routes it links into.
 */

const COPY = {
  title: "Care management academy",
  description:
    "How the Medicare care management programmes work, who qualifies, what each month has to show, and what the codes pay. Written for the person who has to run it, not the person who sells it.",
};

const PATHS = [
  {
    href: "/programs",
    kicker: "Start here",
    title: "Which programme is my patient?",
    body: "The single most confusing thing about this category is which of the four a given patient belongs in. Describe the patient and the filter narrows it.",
  },
  {
    href: "/compare/vs-doing-nothing",
    kicker: "The arithmetic",
    title: "What is the gap actually worth?",
    body: "How many of your Medicare patients qualify, how few are enrolled nationally, and what the code pays. Third-party figures, cited, with the dials on your own panel.",
  },
  {
    href: "/for-practices",
    kicker: "For a single practice",
    title: "Running this without hiring anyone",
    body: "What the month looks like, what your team still does, and why the constraint is hours rather than billing knowledge.",
  },
  {
    href: "/for-health-systems",
    kicker: "For a group",
    title: "Rolling it out across sites",
    body: "The same programmes and the same codes, configured once and run clinic by clinic. Including the facility-schedule caveat that catches system readers out.",
  },
];

export function Academy() {
  return (
    <div className="bg-paper text-ink font-sans overflow-x-hidden">
      <SEO
        title={COPY.title}
        description={COPY.description}
        path="/academy"
        useExactTitle
        keywords="care management guides, chronic care management how it works, CCM billing guide, care coordination learning"
        jsonLd={[breadcrumbSchema([{ name: "Academy", url: "https://www.hana.health/academy" }])]}
      />

      <Hero
        tone="orbs"
        eyebrow="Academy"
        headline={<>How these programmes <em>actually work.</em></>}
        body="Who qualifies, what the month has to show, what the codes pay, and where the rules are still open. Written for the person who has to run it."
        primaryCta={{ label: "Start with the programmes", href: "/programs" }}
        secondaryCta={{ label: "Read the blog", href: "/blog" }}
        trustLine="Medicare rules as they stand in October 2026. Figures are CY2026."
      />

      <section id="start" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">Four ways in</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-10 max-w-[24ch]">
            Depending on what you came to work out.
          </h2>
          <ul className="m-0 p-0 list-none grid gap-4 md:grid-cols-2">
            {PATHS.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  className="group flex h-full flex-col rounded-card border border-rule bg-paper-bright p-6 md:p-7 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="text-eyebrow font-bold uppercase text-ink-mute">{p.kicker}</span>
                  <span className="mt-3 font-serif text-[24px] leading-[1.2] text-ink">{p.title}</span>
                  <span className="mt-3 text-[15px] leading-[1.65] text-ink-soft">{p.body}</span>
                  <span className="mt-5 text-[14px] font-semibold text-ink-soft underline underline-offset-4 decoration-rule group-hover:decoration-ink-soft">
                    Read it
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="programmes" className="scroll-mt-24 bg-band border-y border-rule py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">One page each</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3 max-w-[24ch]">
            The four programmes, in full.
          </h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]">
            Each page sets out who is eligible, what the month has to show, what your team still
            does, what the code pays, and the source behind each rule.
          </p>
          <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-2">
            {PUBLISHED_PROGRAMMES.map((p) => (
              <li key={p.id}>
                <a
                  href={p.path}
                  className="group flex items-baseline gap-3 rounded-tile border border-rule bg-paper-bright px-5 py-4 no-underline transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="font-serif text-[20px] leading-none text-ink">{p.code}</span>
                  <span className="text-[15px] text-ink-soft group-hover:text-ink">{p.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LatestPosts />

      <CtaBand
        heading={<>Read enough? <em>Hear it make the call.</em></>}
        body="Bring your panel numbers. We will go through which programmes your patients already qualify for, and what your team would still do."
        buttons={[
          { label: "Book a demo", href: DEMO_HREF },
          { label: "Talk to us", href: "/contact", variant: "ghost" },
        ]}
        reassurances={[
          "Your patients, your claim",
          "Your team reviews and attests",
          "Nothing bills until a person approves",
        ]}
      />

      <Footer />
    </div>
  );
}

export default Academy;
