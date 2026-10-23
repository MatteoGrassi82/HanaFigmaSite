/**
 * Data a prerendered page carries that the app would otherwise fetch again: Authority forecast
 * blocks (data-authority-forecast-page) and JSON a page embedded with <PageJson>.
 *
 * Routes are lazy, so React swaps the prerendered snapshot for a loading state before a page's
 * code has run. By the time AuthorityForecast or a page looks for its data in the DOM, it is
 * gone, and the browser fetches all of it again (a forecast block is ~195KB). Copying it out
 * here, once, before createRoot, puts it in the caches those components read first.
 *
 * The prerender itself loads head-only skeletons, so at build time this finds nothing and
 * everything is fetched fresh from Authority, which is what the daily rebuild relies on.
 */
type Store = typeof globalThis & {
  __authorityForecasts?: Map<string, string>;
  __pageJson?: Map<string, string>;
};

export function capturePrerenderedData(): void {
  if (typeof document === "undefined") return;
  const g = globalThis as Store;

  const forecasts = (g.__authorityForecasts ??= new Map());
  document.querySelectorAll("[data-authority-forecast-page]").forEach((el) => {
    const url = el.getAttribute("data-authority-forecast-page");
    if (!url || el.getAttribute("data-authority-source") !== "live" || forecasts.has(url)) return;
    // the prerender drops executed script copies; strip any a snapshot still carried
    forecasts.set(url, el.innerHTML.replace(/<script data-authority-run[^>]*>[\s\S]*?<\/script>/gi, ""));
  });

  const json = (g.__pageJson ??= new Map());
  document.querySelectorAll('#root script[type="application/json"][id]').forEach((el) => {
    if (!json.has(el.id)) json.set(el.id, el.textContent || "");
  });
}
