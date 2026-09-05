import { useEffect, useState } from "react";
import { SYSTEMS, type PaletteSystem } from "./palettes";

/**
 * PaletteSwitcher — reskin the whole page, live, to compare palettes.
 *
 * A fixed bar at the bottom of the noindex lab pages. Clicking a system writes
 * its tokens onto <html>, so every section on the page repaints at once. This is
 * the honest way to judge a palette: not on a swatch and not on a hero, but on a
 * whole page with photographs, a dark band and a product panel in it.
 *
 * WHY IT ALSO REWRITES THE SLATE CLASSES
 * 1,198 Tailwind slate-* utilities are still the site's real grey ramp and are
 * not on tokens yet. Swapping only the token variables would repaint the accent
 * and the headings while leaving every secondary paragraph, border and band on
 * the old cool grey, which makes a warm system look broken for reasons that have
 * nothing to do with the system. So the switcher maps them at runtime. That
 * mapping is a PREVIEW DEVICE, not the fix: the fix is tokenising those 1,198
 * occurrences, which also closes the 193 places using slate-400 and slate-300
 * for body text at 2.56:1 and 1.48:1, both far below the 4.5:1 minimum.
 *
 * WHAT IT CANNOT REACH, and this is the real cost of any non-blue choice:
 * roughly 560 hardcoded colour values live in the artwork. The seven Remotion
 * compositions hold 397, SafetyStack's layered glass cards 70, LoopDiagram 43,
 * ProofBento 25. Those stay blue whatever you pick here, which is why a warm
 * system looks wrong on the dark band until that artwork is repainted.
 *
 * Lab only. Never import this into a page that ships.
 */

const KEY = "hana-lab-palette";

function apply(sys: PaletteSystem | null) {
  const root = document.documentElement;
  document.getElementById("hana-palette-map")?.remove();
  const vars = [
    "ink", "ink-soft", "ink-mute", "paper", "paper-2", "paper-bright",
    "rule", "rule-soft", "navy", "navy-soft", "brand", "brand-soft", "brand-tint",
  ];

  if (!sys) {
    vars.forEach((v) => root.style.removeProperty(`--color-${v}`));
    return;
  }

  const t = sys.t;
  const set: Record<string, string> = {
    ink: t.ink, "ink-soft": t.inkSoft, "ink-mute": t.inkMute,
    paper: t.paper, "paper-2": t.paper2, "paper-bright": t.paperBright,
    rule: t.rule, "rule-soft": t.ruleSoft,
    navy: t.navy, "navy-soft": t.navySoft,
    brand: t.brand, "brand-soft": t.brandSoft, "brand-tint": t.brandTint,
  };
  Object.entries(set).forEach(([k, v]) => root.style.setProperty(`--color-${k}`, v));

  // The slate ramp is not on tokens yet. Map it so the preview tells the truth.
  const style = document.createElement("style");
  style.id = "hana-palette-map";
  style.textContent = `
    body { background-color: ${t.paper}; }
    .text-ink, .text-ink { color: ${t.ink} !important; }
    .text-ink-soft, .text-ink-soft { color: ${t.inkSoft} !important; }
    .text-ink-mute, .text-slate-400, .text-slate-300 { color: ${t.inkMute} !important; }
    .bg-paper-2, .bg-paper-2 { background-color: ${t.paper2} !important; }
    .bg-rule-soft { background-color: ${t.rule} !important; }
    .bg-navy, .bg-navy, .bg-navy { background-color: ${t.navy} !important; }
    .border-rule-soft, .border-rule { border-color: ${t.ruleSoft} !important; }
    .border-rule { border-color: ${t.rule} !important; }
    section.bg-paper-bright, header.bg-paper-bright, div.bg-paper-bright { background-color: ${t.paper} !important; }
  `;
  document.head.appendChild(style);
}

export function PaletteSwitcher({ startOpen = true }: { startOpen?: boolean } = {}) {
  const [activeId, setActiveId] = useState<string>("current");
  // Closed by default on /remote-v2: that page is being judged as a page, and a
  // bar across the bottom is the wrong thing to have in shot. Open on the lab,
  // where comparing IS the job.
  const [open, setOpen] = useState(startOpen);

  useEffect(() => {
    let id = "current";
    try {
      id = window.localStorage.getItem(KEY) || "current";
    } catch {
      /* private mode */
    }
    setActiveId(id);
    // "current" means NO override: let the real tokens.css values show through,
    // otherwise the switcher would pin the page to whatever this file thinks the
    // live palette is, which goes stale the moment tokens.css changes.
    apply(id === "current" ? null : SYSTEMS.find((s) => s.id === id) ?? null);
  }, []);

  const pick = (s: PaletteSystem) => {
    setActiveId(s.id);
    apply(s.id === "current" ? null : s);
    try {
      window.localStorage.setItem(KEY, s.id);
    } catch {
      /* ignore */
    }
  };

  const active = SYSTEMS.find((s) => s.id === activeId) ?? SYSTEMS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[1400px] m-3 rounded-[14px] border border-black/10 bg-paper-bright/95 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-ink-mute shrink-0">
            Palette
          </span>

          {open && (
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {SYSTEMS.map((s) => {
                const on = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => pick(s)}
                    aria-pressed={on}
                    title={s.note}
                    className={`flex items-center gap-1.5 rounded-[9px] border px-2 py-1.5 cursor-pointer transition-colors ${
                      on ? "border-navy bg-paper-2" : "border-rule hover:bg-paper-2"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-[4px] shrink-0 ring-1 ring-black/10"
                      style={{ backgroundColor: s.t.brand }}
                      aria-hidden
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-[4px] shrink-0 ring-1 ring-black/10"
                      style={{ backgroundColor: s.t.paper }}
                      aria-hidden
                    />
                    <span className={`text-[12.5px] ${on ? "font-semibold text-ink" : "text-ink-soft"}`}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto shrink-0 rounded-[9px] border border-rule px-2.5 py-1.5 text-[12px] text-ink-soft hover:bg-paper-2 cursor-pointer"
          >
            {open ? "Hide" : "Show palettes"}
          </button>
        </div>

        {open && (
          <div className="border-t border-rule-soft px-3 py-2 text-[12px] leading-[1.55] text-ink-soft">
            <span className="font-semibold text-ink">{active.name}</span>
            <span className="text-slate-400"> · {active.temp} · </span>
            <span className="tabular-nums">
              accent {active.t.brand} at {active.contrast.brand}:1
            </span>
            <span className="text-slate-400"> · </span>
            {active.note}
            <div className="mt-1 text-ink-mute">
              The artwork does not follow: ~560 hardcoded colours in the Remotion panels, the
              SafetyStack glass cards and the loop diagram stay blue whatever you pick. Repainting
              those is the real cost of moving off blue.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
