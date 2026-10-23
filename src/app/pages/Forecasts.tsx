import { useEffect, useState } from "react";
import { SEO, breadcrumbSchema } from "../components/SEO";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { CtaBand, DEMO_HREF } from "../components/sections/CtaBand";
import AuthorityForecast, {
  PageJson,
  loadAuthoritySiteForecasts,
  preloadAuthorityForecast,
  readPageJson,
  summarizeForecastHtml,
  type ForecastPoint,
  type ForecastSummary,
  type SiteForecast,
} from "../components/media/AuthorityForecast";
import { getPosts } from "../../lib/sanity";

/**
 * /forecasts — every live Authority forecast for hana.health, on one page.
 *
 * QUESTIONS FIRST, CHARTS SECOND. The top of the page is ours: one card per forecast in the
 * site's own type and colour (area, question, probability, trend, deadline, last move),
 * soonest deadline first. Authority's full blocks follow, each under its own anchor, named
 * after the post it belongs to (/forecasts#aco-reach-ends-lead-model-2027). LinkedIn posts
 * link those anchors, so they land on the chart the post's image shows.
 *
 * Nothing here is typed by hand. The list comes from Authority (/e/site), each card is read
 * out of the same block the full chart renders (summarizeForecastHtml, one fetch per
 * forecast), and the area and title come from the post in Sanity. A new forecast appears at
 * the next build, which runs every morning. What the prerender computed is embedded as JSON
 * (PageJson), so a visitor's browser shows the same numbers without fetching again.
 *
 * The forecasts also stay on their own blog posts. That is where an answer engine cites
 * them, and Authority measures them per post; this page gathers them, it does not replace them.
 */

const COPY = {
  title: "Medicare policy forecasts | HANA Health",
  description:
    "Live probabilities on the CMS decisions that shape care management, value-based care and sleep: what is likely to happen, by when, and the sources behind every move.",
};

const INDEX_ID = "forecast-index";

/** Sanity post category -> the label the site uses for that audience. */
const AREAS: Record<string, string> = {
  "Care Management": "Care management",
  "Value Based Care": "Value-based care",
  "Sleep and PAP Therapy": "Sleep",
};

interface Row extends SiteForecast {
  anchor: string;
  title: string | null;
  area: string | null;
  summary: ForecastSummary | null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string | null) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function pct(p: number) {
  const v = Math.round(p * 1000) / 10;
  return `${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1)}%`;
}

function anchorFor(path: string) {
  return path.split("/").filter(Boolean).pop() || path;
}

async function loadRows(): Promise<Row[]> {
  const [list, posts] = await Promise.all([loadAuthoritySiteForecasts(), getPosts().catch(() => [])]);
  const bySlug = new Map(posts.map((p) => [p.slug.current, p]));
  const rows = await Promise.all(
    list.map(async (f) => {
      const html = await preloadAuthorityForecast({ id: f.forecast_id });
      const anchor = anchorFor(f.path);
      const post = bySlug.get(anchor);
      const area = (post?.categories || []).map((c) => AREAS[c.title]).find(Boolean) || null;
      return { ...f, anchor, title: post?.title || null, area, summary: summarizeForecastHtml(html) };
    })
  );
  return rows.sort((a, b) => (a.summary?.deadline || "9999").localeCompare(b.summary?.deadline || "9999"));
}

/** The probability over time, on an honest 0 to 100% scale, ending on today's value. */
function Trend({ series, label }: { series: ForecastPoint[]; label: string }) {
  if (series.length < 2) return null;
  const W = 260, H = 64, top = 4, bottom = 4;
  const t = (d: string) => Date.parse(d);
  const t0 = t(series[0].date), t1 = t(series[series.length - 1].date) || t0 + 1;
  const x = (d: string) => ((t(d) - t0) / Math.max(1, t1 - t0)) * W;
  const y = (p: number) => top + (1 - p) * (H - top - bottom);
  const line = series.map((s, i) => `${i ? "L" : "M"}${x(s.date).toFixed(1)} ${y(s.p).toFixed(1)}`).join(" ");
  const end = series[series.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full max-w-[260px] h-16 overflow-visible" role="img" aria-label={label}>
      <line x1="0" x2={W} y1={y(0.5)} y2={y(0.5)} stroke="var(--color-rule-soft)" strokeDasharray="3 3" />
      <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke="var(--color-rule)" />
      <path d={`${line} L${W} ${y(0)} L0 ${y(0)} Z`} fill="var(--color-brand-tint)" />
      <path d={line} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(end.date)} cy={y(end.p)} r="3.5" fill="var(--color-brand)" />
    </svg>
  );
}

function QuestionCard({ row }: { row: Row }) {
  const s = row.summary;
  const move = s?.lastMove;
  return (
    <li className="rounded-card border border-rule bg-paper-bright p-6 md:p-8 grid gap-6 md:grid-cols-[1fr_260px] md:gap-12">
      <div className="flex flex-col">
        {row.area && <p className="text-eyebrow font-bold uppercase text-ink-mute m-0">{row.area}</p>}
        <h3 className="mt-3 mb-0 font-serif text-[26px] leading-[1.2] text-ink">{s?.question || row.title}</h3>
        {move && (
          <p className="mt-4 mb-0 text-[15px] leading-[1.65] text-ink-soft">
            Last move, {shortDate(move.date)}:{" "}
            <strong className="font-semibold text-ink">
              {move.deltaPts > 0 ? "+" : "−"}
              {Math.abs(move.deltaPts)} pts
            </strong>
            . {move.title}.
          </p>
        )}
        <div className="mt-auto pt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold">
          <a href={`#${row.anchor}`} className="text-ink underline underline-offset-4 decoration-rule hover:decoration-ink">
            See the full chart
          </a>
          <a href={row.path} className="text-ink-soft underline underline-offset-4 decoration-rule hover:decoration-ink-soft">
            Read the explainer
          </a>
        </div>
      </div>
      {s && s.p != null && (
        <div className="md:border-l md:border-rule-soft md:pl-10">
          <p className="m-0 font-serif text-[56px] leading-none text-ink">{pct(s.p)}</p>
          <p className="mt-2 mb-0 text-[14px] text-ink-soft">chance today</p>
          <Trend series={s.series} label={`Probability since ${shortDate(s.series[0]?.date || null)}, ${pct(s.p)} today`} />
          <p className="mt-3 mb-0 text-[13px] leading-[1.5] text-ink-mute">
            {s.resolves && <>{s.resolves}<br /></>}
            Updated {shortDate(s.asOf)}
          </p>
        </div>
      )}
    </li>
  );
}

const HOW = [
  {
    title: "A probability, not a take.",
    body: "Each number is the chance the question resolves yes by its deadline, as of the date shown. The rules for what counts are spelled out under each chart.",
  },
  {
    title: "Every move is sourced.",
    body: "When a forecast moves, the chart marks the event behind it and links to the source: a CMS rule, a fact sheet, a letter, a filing.",
  },
  {
    title: "Updated every morning.",
    body: "The page rebuilds daily, so the numbers here are at most a day behind Authority's latest version.",
  },
];

export function Forecasts() {
  const [rows, setRows] = useState<Row[] | null>(() => readPageJson<Row[]>(INDEX_ID));

  useEffect(() => {
    if (rows) return;
    let on = true;
    loadRows().then((r) => on && setRows(r));
    return () => {
      on = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // A LinkedIn link lands on one forecast (/forecasts#<post-slug>). The browser's own jump to
  // the anchor is lost when the app takes the page over (and ScrollToTop resets to 0), so
  // scroll there once the list is in, and again while the charts and their fonts settle the
  // layout above it. The first scroll, wheel, touch or key from the reader cancels the rest.
  useEffect(() => {
    if (!rows?.length) return;
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
  }, [rows]);

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
        primaryCta={{ label: "See the questions", href: "#forecasts" }}
        secondaryCta={{ label: "Read the explainers", href: "/blog" }}
        trustLine="Forecasts by Authority.inc. Each one links to the HANA explainer behind the question."
      />

      {rows && <PageJson id={INDEX_ID} data={rows} />}

      <section id="forecasts" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">Live now</p>
          <h2 className="font-serif text-h2 text-ink m-0 mb-3 max-w-[24ch]">The questions we are tracking.</h2>
          <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-10 max-w-[62ch]">
            The CMS decisions practices, ACOs and DMEs are planning around, soonest deadline first.
          </p>

          {rows === null && <p className="text-[16px] text-ink-soft m-0">Loading the forecasts.</p>}
          {rows && rows.length === 0 && (
            <p className="text-[16px] text-ink-soft m-0">New forecasts appear here as they are published.</p>
          )}
          {rows && rows.length > 0 && (
            <ul className="m-0 p-0 list-none grid gap-5">
              {rows.map((r) => (
                <QuestionCard key={r.forecast_id} row={r} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="how" className="scroll-mt-24 bg-band border-y border-rule py-16 md:py-20 px-6 md:px-16">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">How to read them</p>
          <ul className="m-0 p-0 list-none grid gap-8 md:grid-cols-3">
            {HOW.map((h) => (
              <li key={h.title}>
                <p className="m-0 font-serif text-[22px] leading-[1.25] text-ink">{h.title}</p>
                <p className="mt-3 mb-0 text-[15px] leading-[1.65] text-ink-soft">{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {rows && rows.length > 0 && (
        <section id="full" className="scroll-mt-24 bg-paper py-20 md:py-24 px-6 md:px-16">
          <div className="max-w-[860px] mx-auto">
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">The full forecasts</p>
            <h2 className="font-serif text-h2 text-ink m-0 mb-12 max-w-[24ch]">Every move, with its source.</h2>
            <div className="flex flex-col gap-16">
              {rows.map((r) => (
                <article key={r.forecast_id} id={r.anchor} className="scroll-mt-24">
                  {r.area && <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{r.area}</p>}
                  <AuthorityForecast id={r.forecast_id} />
                  <p className="mt-5 mb-0 text-[15px] leading-[1.6] text-ink-soft">
                    The explainer behind this question:{" "}
                    <a href={r.path} className="font-semibold text-ink underline underline-offset-4 decoration-rule hover:decoration-ink">
                      {r.title || "read it on the blog"}
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
