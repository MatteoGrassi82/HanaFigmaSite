import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Lock, BookLock, UserCheck, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocale } from "../../../lib/i18n";

/* ── Safety layers — liquid-glass "defense in depth" ─────────────────────────
   Four coplanar glass cards fanned on a single tilted plane (so each stays a
   uniform square — no lopsided trapezoids), with a subtle liquid-glass sheen.
   Hovering a layer in the list (or a card) lifts its glass card off the plane
   and lights it; the whole stack has a gentle mouse parallax. Desktop = the
   glass stack + a flat interactive list; mobile = a clean flat card stack (no
   3D). Sits above ComplianceSection (which keeps the cert grid). */

const NAVY = "#00122F";
const SKY = "#7CC4F0";
const PEACH = "#FFC091";
const INK_SOFT = "#9DB2CE";
const DOT_GRID = "#7CC4F0";

type Layer = {
  id: string;
  name: string;
  line: string;
  icon: LucideIcon;
  /** glass gradient for the card (Hana palette, back → front) */
  glass: string;
  /** fan offset on the tilted plane */
  tx: number;
  ty: number;
};

/* Ordered back → front to match DOM paint order on the coplanar plane. */
const LAYERS_EN: Layer[] = [
  {
    id: "observability",
    name: "Observability",
    line: "Non-deterministic agents are continuously monitored — every decision logged, anomalies caught and circuit-broken.",
    icon: Activity,
    glass: "linear-gradient(150deg, rgba(0,18,47,0.82), rgba(8,20,70,0.82))",
    tx: 150,
    ty: -108,
  },
  {
    id: "human",
    name: "Human in the loop",
    line: "Anything clinical or out-of-scope is handed to a human in real time, per the escalation rules you set.",
    icon: UserCheck,
    glass: "linear-gradient(150deg, rgba(48,62,200,0.78), rgba(22,34,150,0.80))",
    tx: 50,
    ty: -36,
  },
  {
    id: "protocols",
    name: "Protocols",
    line: "Hana acts only inside the clinical protocols and guardrails you define — never a model's own judgment.",
    icon: BookLock,
    glass: "linear-gradient(150deg, rgba(59,130,246,0.80), rgba(12,58,158,0.80))",
    tx: -50,
    ty: 36,
  },
  {
    id: "encryption",
    name: "Encryption",
    line: "Encrypted in transit (TLS 1.2/1.3) and at rest (AES-256); end-to-end where the channel supports it.",
    icon: Lock,
    glass: "linear-gradient(150deg, rgba(124,196,240,0.82), rgba(40,120,180,0.80))",
    tx: -150,
    ty: 108,
  },
];

/* Italian — same ids/icons/geometry/colors, translated name + line only. */
const LAYERS_IT: Layer[] = [
  {
    id: "observability",
    name: "Osservabilità",
    line: "Gli agenti non deterministici sono monitorati di continuo — ogni decisione registrata, le anomalie intercettate e interrotte automaticamente.",
    icon: Activity,
    glass: "linear-gradient(150deg, rgba(0,18,47,0.82), rgba(8,20,70,0.82))",
    tx: 150,
    ty: -108,
  },
  {
    id: "human",
    name: "Supervisione umana",
    line: "Tutto ciò che è clinico o fuori ambito viene passato a una persona in tempo reale, secondo le regole di escalation che imposti tu.",
    icon: UserCheck,
    glass: "linear-gradient(150deg, rgba(48,62,200,0.78), rgba(22,34,150,0.80))",
    tx: 50,
    ty: -36,
  },
  {
    id: "protocols",
    name: "Protocolli",
    line: "Hana agisce solo all'interno dei protocolli clinici e dei guardrail che definisci tu — mai secondo il giudizio autonomo di un modello.",
    icon: BookLock,
    glass: "linear-gradient(150deg, rgba(59,130,246,0.80), rgba(12,58,158,0.80))",
    tx: -50,
    ty: 36,
  },
  {
    id: "encryption",
    name: "Crittografia",
    line: "Crittografata in transito (TLS 1.2/1.3) e a riposo (AES-256); end-to-end dove il canale lo consente.",
    icon: Lock,
    glass: "linear-gradient(150deg, rgba(124,196,240,0.82), rgba(40,120,180,0.80))",
    tx: -150,
    ty: 108,
  },
];

const LAYERS: Layer[] = getLocale() === "it" ? LAYERS_IT : LAYERS_EN;

/* Heading + intro copy. */
const COPY_EN = {
  eyebrow: "Security & Safety",
  heading: "Defense in depth, on every single call.",
  intro:
    "Four layers between every patient conversation and what could go wrong. Explore each one to see what it does.",
};
const COPY_IT = {
  eyebrow: "Sicurezza e protezione",
  heading: "Difesa in profondità, in ogni singola chiamata.",
  intro:
    "Quattro livelli tra ogni conversazione con il paziente e ciò che potrebbe andare storto. Esplora ciascuno per vedere cosa fa.",
};
const COPY = getLocale() === "it" ? COPY_IT : COPY_EN;

/* Display order for the right-hand list (front → back = Encryption first). */
const LIST_ORDER = ["encryption", "protocols", "human", "observability"];

const CSS = `
.ss-stack {
  position: relative; width: 0; height: 0;
  transform-style: preserve-3d;
  transform: rotateX(var(--ss-rx, -32deg)) rotateZ(var(--ss-rz, -22deg));
  transition: transform .3s cubic-bezier(.2,.7,.2,1);
}
.ss-card {
  position: absolute; left: -120px; top: -120px;
  width: 240px; height: 240px; border-radius: 32px;
  transform-style: preserve-3d;
  /* crisp edge lives HERE (no displacement filter) so it stays neat & straight;
     the liquid wobble is confined to the interior sheen only */
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,.22);
  box-shadow: 0 30px 64px rgba(0,0,0,.5);
  transform: translate3d(var(--tx), var(--ty), var(--lift, 0px));
  transition: transform .38s cubic-bezier(.2,.7,.2,1), border-color .38s ease;
}
.ss-card.is-active { --lift: 64px; border-color: rgba(255,192,145,.6); }
.ss-glass { position:absolute; inset:0; border-radius:inherit; transition:filter .38s ease; }
.ss-card.is-active .ss-glass { filter: brightness(1.3) saturate(1.1); }
.ss-sheen {
  position:absolute; inset:0; border-radius:inherit;
  background: radial-gradient(120% 92% at 26% 16%, rgba(255,255,255,.40), rgba(255,255,255,.06) 42%, transparent 66%);
  filter: url(#ss-liquid);
  mix-blend-mode: screen; opacity:.85;
}
.ss-ico {
  position:absolute; top:20px; left:20px; width:46px; height:46px;
  border-radius:13px; background:rgba(255,255,255,.16);
  border:1px solid rgba(255,255,255,.28);
  display:grid; place-items:center;
}
@media (prefers-reduced-motion: reduce) {
  .ss-stack, .ss-card, .ss-glass, .ss-sheen { transition: none; }
}
`;

/* Order the auto-cycle steps through, back → front. */
const CYCLE_IDS = ["observability", "human", "protocols", "encryption"];

export function SafetyStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [cycled, setCycled] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // calm auto-cycle: when idle, each layer gently lights in sequence (no flying
  // object). Pauses while hovering or if reduced-motion is requested.
  useEffect(() => {
    if (!inView || reduceMotion || hovered) {
      setCycled(null);
      return;
    }
    let i = 0;
    setCycled(CYCLE_IDS[0]);
    const t = setInterval(() => {
      i = (i + 1) % CYCLE_IDS.length;
      setCycled(CYCLE_IDS[i]);
    }, 1600);
    return () => clearInterval(t);
  }, [inView, reduceMotion, hovered]);

  // gentle mouse parallax on the whole stack (±5°)
  const onMove = (e: React.MouseEvent) => {
    const el = sceneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    el.style.setProperty("--ss-rx", `${-32 - my * 5}deg`);
    el.style.setProperty("--ss-rz", `${-22 + mx * 5}deg`);
  };
  const onLeave = () => {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--ss-rx", "-32deg");
    el.style.setProperty("--ss-rz", "-22deg");
  };

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28" style={{ backgroundColor: NAVY }}>
      <style>{CSS}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[800px] w-[800px] -translate-x-1/2"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div ref={ref} className="relative mx-auto max-w-5xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${DOT_GRID} 0.6px, transparent 0.6px)`,
              backgroundSize: "22px 22px",
              opacity: 0.05,
            }}
          />

          {/* Heading */}
          <div className="relative z-10 mx-auto mb-14 max-w-2xl text-center md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: SKY }}
            >
              {COPY.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-3xl leading-tight text-white md:text-[2.6rem] md:leading-[1.15]"
            >
              {COPY.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: INK_SOFT }}
            >
              {COPY.intro}
            </motion.p>
          </div>

          {/* ── Desktop: glass stack (visual) + flat interactive list ──────── */}
          <div className="relative z-10 hidden items-center gap-10 md:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
              className="flex h-[520px] flex-1 items-center justify-center"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div ref={sceneRef} style={{ perspective: "2400px", perspectiveOrigin: "50% 50%" }}>
                <div className="ss-stack">
                  {LAYERS.map((layer) => {
                    const Icon = layer.icon;
                    // hover wins; otherwise the calm auto-cycle lights each in turn
                    const active = hovered ? hovered === layer.id : cycled === layer.id;
                    return (
                      <div
                        key={layer.id}
                        className={`ss-card${active ? " is-active" : ""}`}
                        style={{ ["--tx" as string]: `${layer.tx}px`, ["--ty" as string]: `${layer.ty}px` }}
                        onMouseEnter={() => setHovered(layer.id)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className="ss-glass" style={{ background: layer.glass }} />
                        <div className="ss-sheen" />
                        <div className="ss-ico">
                          <Icon className="h-[22px] w-[22px] text-white" strokeWidth={1.8} />
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </motion.div>

            <div className="flex w-[320px] shrink-0 flex-col gap-2.5">
              {LIST_ORDER.map((id, i) => {
                const layer = LAYERS.find((l) => l.id === id)!;
                return (
                  <LayerRow
                    key={layer.id}
                    layer={layer}
                    index={i}
                    inView={inView}
                    hovered={hovered}
                    setHovered={setHovered}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Mobile: flat card stack ────────────────────────────────────── */}
          <MobileLayers inView={inView} hovered={hovered} setHovered={setHovered} />
        </div>
      </div>

      {/* liquid distortion filter for the glass sheen */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="ss-liquid" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.008" numOctaves="2" seed="4" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2.4" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </section>
  );
}

/* Flat, interactive label row beside the glass stack. */
function LayerRow({
  layer,
  index,
  inView,
  hovered,
  setHovered,
}: {
  layer: Layer;
  index: number;
  inView: boolean;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  const Icon = layer.icon;
  const active = hovered === layer.id;
  const dimmed = hovered !== null && !active;
  return (
    <motion.div
      onMouseEnter={() => setHovered(layer.id)}
      onMouseLeave={() => setHovered(null)}
      initial={{ opacity: 0, x: 16 }}
      animate={inView ? { opacity: dimmed ? 0.45 : 1, x: 0 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
      className="cursor-pointer rounded-2xl border p-4 transition-colors"
      style={{
        backgroundColor: active ? "rgba(255,192,145,0.10)" : "rgba(255,255,255,0.03)",
        borderColor: active ? "rgba(255,192,145,0.45)" : "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: active ? PEACH : "rgba(255,255,255,0.18)",
            backgroundColor: active ? "rgba(255,192,145,0.18)" : "rgba(255,255,255,0.06)",
          }}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} style={{ color: active ? PEACH : "#fff" }} />
        </span>
        <h3 className="text-base font-semibold tracking-tight text-white">{layer.name}</h3>
      </div>
      <motion.p animate={{ opacity: active ? 1 : 0.7 }} className="mt-2 text-[12px] leading-relaxed" style={{ color: INK_SOFT }}>
        {layer.line}
      </motion.p>
    </motion.div>
  );
}

/* ── Mobile: flat stacked cards (no 3D) ──────────────────────────────────────*/
function MobileLayers({
  inView,
  hovered,
  setHovered,
}: {
  inView: boolean;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-3 md:hidden">
      {LIST_ORDER.map((id, i) => {
        const layer = LAYERS.find((l) => l.id === id)!;
        const Icon = layer.icon;
        const isActive = hovered === layer.id;
        const dimmed = hovered !== null && !isActive;
        return (
          <motion.button
            key={layer.id}
            type="button"
            onClick={() => setHovered(isActive ? null : layer.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: dimmed ? 0.5 : 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            className="rounded-2xl border p-4 text-left"
            style={{
              backgroundColor: isActive ? "rgba(255,192,145,0.10)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(255,192,145,0.45)" : "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  borderColor: isActive ? PEACH : "rgba(255,255,255,0.2)",
                  backgroundColor: isActive ? "rgba(255,192,145,0.18)" : "rgba(255,255,255,0.06)",
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} style={{ color: isActive ? PEACH : "#fff" }} />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">{layer.name}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: INK_SOFT }}>
              {layer.line}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

export default SafetyStack;
