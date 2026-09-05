import { Suspense, lazy, useMemo } from "react";

/* ── Night-sky backdrop ───────────────────────────────────────────────────────
   A self-contained, aria-hidden hero backdrop for HANA Sleep: a deep indigo →
   brand-navy gradient, a subtle aurora drift (the same @paper-design Dithering
   shader the home hero uses, in a night palette), a twinkling starfield, a soft
   moonlight glow, and a bottom fade that seams into the #00122F section below.
   Star positions are deterministic (seeded, no Math.random) so server-prerender
   and client hydration match. Twinkle + shooting star respect reduced-motion. */

// Lazy-load the heavy WebGL shader — falls back to the flat gradient if it can't
// load (or during SSR prerender), exactly like the home hero.
const Dithering = lazy(() =>
  import("@paper-design/shaders-react")
    .then((m) => ({ default: m.Dithering }))
    .catch(() => ({ default: () => null }))
);

const NAVY = "#00122F";
const STAR_COUNT = 72;

// Deterministic pseudo-random in [0,1) from an index + salt (sine hash).
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const CSS = `
.ns-star {
  position: absolute; border-radius: 9999px; background: #eaf0ff;
  animation-name: ns-twinkle; animation-iteration-count: infinite;
  animation-timing-function: ease-in-out; will-change: opacity;
}
@keyframes ns-twinkle { 0%, 100% { opacity: var(--o0); } 50% { opacity: var(--o1); } }
.ns-shoot {
  position: absolute; top: 12%; left: 62%; width: 160px; height: 1.5px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(230,238,255,0.9) 60%, #fff 100%);
  border-radius: 9999px; opacity: 0; transform: rotate(18deg);
  animation: ns-shoot 11s ease-in infinite; animation-delay: 4s;
}
@keyframes ns-shoot {
  0% { opacity: 0; transform: translate(0, 0) rotate(18deg) scaleX(0.2); }
  3% { opacity: 1; }
  9% { opacity: 0; transform: translate(-260px, 84px) rotate(18deg) scaleX(1); }
  100% { opacity: 0; transform: translate(-260px, 84px) rotate(18deg) scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ns-star { animation: none !important; }
  .ns-shoot { display: none; }
}
`;

export function NightSky({ className = "" }: { className?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const x = seeded(i, 1) * 100;
        // bias density toward the top; the copy sits lower where it's sparse
        const y = Math.pow(seeded(i, 2), 1.6) * 90;
        const size = 0.6 + seeded(i, 3) * 1.9;
        const bright = seeded(i, 4) > 0.84;
        const o0 = 0.12 + seeded(i, 5) * 0.28;
        const o1 = 0.68 + seeded(i, 6) * 0.32;
        const dur = 2.4 + seeded(i, 7) * 4.5;
        const delay = seeded(i, 8) * 6;
        return { x, y, size, bright, o0, o1, dur, delay };
      }),
    []
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <style>{CSS}</style>

      {/* Base night gradient — deep indigo at top center → brand navy */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(125% 95% at 50% 0%, #16265a 0%, #08183a 44%, ${NAVY} 100%)` }}
      />

      {/* Aurora shader drift — subtle, glowing (screen blend) over the navy */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-[0.45] mix-blend-screen">
          <Dithering
            colorBack="#00122F"
            colorFront="#3a4da0"
            shape="warp"
            type="4x4"
            speed={0.14}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      {/* Moonlight glow — top-right ambient light */}
      <div
        className="absolute"
        style={{
          top: "-14%",
          right: "6%",
          width: 420,
          height: 420,
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(199,214,255,0.30) 0%, rgba(167,188,245,0.10) 40%, rgba(167,188,245,0) 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="ns-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.o1,
              ["--o0" as string]: s.o0,
              ["--o1" as string]: s.o1,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
              boxShadow: s.bright ? `0 0 ${s.size * 3}px ${s.size}px rgba(199,214,255,0.75)` : undefined,
            }}
          />
        ))}
        <span className="ns-shoot" />
      </div>

      {/* Bottom fade — seams the hero into the #00122F section below */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 md:h-52"
        style={{ background: `linear-gradient(to bottom, rgba(0,18,47,0) 0%, ${NAVY} 100%)` }}
      />
    </div>
  );
}

export default NightSky;
