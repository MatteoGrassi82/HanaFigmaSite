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
    .text-slate-900, .text-slate-800 { color: ${t.ink} !important; }
    .text-slate-700, .text-slate-600 { color: ${t.inkSoft} !important; }
    .text-slate-500, .text-slate-400, .text-slate-300 { color: ${t.inkMute} !important; }
    .bg-slate-50, .bg-slate-100 { background-color: ${t.paper2} !important; }
    .bg-slate-200 { background-color: ${t.rule} !important; }
    .bg-slate-800, .bg-slate-900, .bg-slate-950 { background-color: ${t.navy} !important; }
    .border-slate-100, .border-slate-200 { border-color: ${t.ruleSoft} !important; }
    .border-slate-300 { border-color: ${t.rule} !important; }
    section.bg-white, header.bg-white, div.bg-white { background-color: ${t.paper} !important; }
  `;
  document.head.appendChild(style);
}

export function PaletteSwitcher() {
  const [activeId, setActiveId] = useState<string>("current");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let id = "current";
    try {
      id = window.localStorage.getItem(KEY) || "current";
    } catch {
      /* private mode */
    }
    setActiveId(id);
    apply(SYSTEMS.find((s) => s.id === id) ?? null);
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
      <div className="pointer-events-auto mx-auto max-w-[1400px] m-3 rounded-[14px] border border-black/10 bg-white/95 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-slate-500 shrink-0">
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
                      on ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
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
                    <span className={`text-[12.5px] ${on ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto shrink-0 rounded-[9px] border border-slate-200 px-2.5 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {open ? "Hide" : "Show palettes"}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 px-3 py-2 text-[12px] leading-[1.55] text-slate-600">
            <span className="font-semibold text-slate-900">{active.name}</span>
            <span className="text-slate-400"> · {active.temp} · </span>
            <span className="tabular-nums">
              accent {active.t.brand} at {active.contrast.brand}:1
            </span>
            <span className="text-slate-400"> · </span>
            {active.note}
            <div className="mt-1 text-slate-500">
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
