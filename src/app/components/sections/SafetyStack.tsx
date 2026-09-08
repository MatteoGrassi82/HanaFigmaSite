import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Lock, BookLock, UserCheck, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocale } from "../../../lib/i18n";

/* ── Safety layers — layered "defense in depth" ──────────────────────────────
   Four coplanar panes fanned on a single tilted plane (so each stays a uniform
   square, no lopsided trapezoids), with a subtle sheen. Repainted to Newsprint
   Ultramarine 2026-09-05: the depth that used to come from four saturated blues
   now comes from four steps of the warm value ramp, and ultramarine is spent
   only on the one layer the frame is about.
   Hovering a layer in the list (or a card) lifts its glass card off the plane
   and lights it; the whole stack has a gentle mouse parallax. Desktop = the
   glass stack + a flat interactive list; mobile = a clean flat card stack (no
   3D). Sits above ComplianceSection (which keeps the cert grid). */

/* Newsprint Ultramarine, as literal hex with the token name beside it. Written
   literally rather than as var() because this scene is also captured headlessly
   (canvas / video export), where the page's custom properties do not resolve. */
/* ── THE LAYER GRADIENTS WERE STILL ON THE REJECTED WARM PALETTE ───────────
 * Fixed 8 Sept 2026 (Matteo: "need and colors are all messed up. They're all
 * like grays and stuff"). The scalar constants below were reverted to the cool
 * palette when warm/beige was tried and dropped on 5 Sept, but the `glass` and
 * `glassLight` gradients on every Layer were missed, so the stack was still
 * built from beige: rgba(143,134,114), rgba(204,196,180), rgba(217,211,199)
 * and friends. Against a navy-and-ultramarine site those read as muddy grey,
 * which is exactly what he saw.
 *
 * The replacement keeps the SAME LIGHTNESS STEPS and changes only the hue, so
 * the depth cue in the stack is unchanged and nothing needed re-tuning: the
 * dark steps now walk navy -> navy-soft and up, the light steps walk
 * brand-soft -> rule -> band -> paper-bright.
 *
 * WHY THESE ARE LITERALS AND NOT TOKENS: they are gradient stops with per-stop
 * alpha, and `linear-gradient(150deg, rgba(...), rgba(...))` cannot take a
 * var() colour and apply an alpha to it without color-mix in every stop, which
 * this file predates. If it is rewritten, color-mix against --color-navy and
 * --color-band is the way, and then a palette change carries automatically.
 * Until then: A PALETTE SWEEP MUST GREP THIS FILE FOR rgba(. */
const PAPER = "#ffffff";                     /* paper: the section ground, light */
const NAVY = "#00122f";                      /* navy: the section ground, dark */
const INK = "#00122f";                       /* ink: type on light */
const INK_SOFT = "#475569";                  /* ink-soft: secondary type on light */
const PAPER_BRIGHT = "#ffffff";              /* paper-bright: type + marks on navy */
const DARK_SOFT = "rgba(253,252,250,0.70)";  /* paper-bright 70%: secondary type on navy */
const RULE = "#cfd8e6";                      /* rule: borders */
const ACCENT = "#2536E6";                    /* brand: the accent on light */
const ACCENT_DARK = "#A9B4FF";               /* brand-soft: the accent on a dark ground */
const DOT_GRID = "#ffffff";                  /* paper-bright: the dot grid on navy */

type Layer = {
  id: string;
  name: string;
  line: string;
  icon: LucideIcon;
  /** pane fill on the dark ground — warm ramp, back (deep) → front (light) */
  glass: string;
  /** the same pane on the light ground — warm ramp, back (tinted) → front (bright) */
  glassLight: string;
  /** fan offset on the tilted plane */
  tx: number;
  ty: number;
};

/* Ordered back → front to match DOM paint order on the coplanar plane. */
const LAYERS_EN: Layer[] = [
  {
    id: "observability",
    name: "Observability",
    line: "Non-deterministic agents are continuously monitored: every decision logged, anomalies caught and circuit-broken.",
    icon: Activity,
    /* deepest pane: navy → navy-soft */
    glass: "linear-gradient(150deg, rgba(0,18,47,0.88), rgba(16,32,56,0.86))",
    /* on paper: rule-strong → ink-mute, the most veiled of the four */
    glassLight: "linear-gradient(150deg, rgba(122,138,176,0.80), rgba(52,68,94,0.78))",
    tx: 150,
    ty: -108,
  },
  {
    id: "human",
    name: "Human in the loop",
    line: "Anything clinical or out-of-scope is handed to a human in real time, per the escalation rules you set.",
    icon: UserCheck,
    /* navy-soft → ink-soft */
    glass: "linear-gradient(150deg, rgba(16,32,56,0.86), rgba(30,42,58,0.84))",
    /* rule → rule-strong */
    glassLight: "linear-gradient(150deg, rgba(180,192,220,0.80), rgba(122,138,176,0.78))",
    tx: 50,
    ty: -36,
  },
  {
    id: "protocols",
    name: "Protocols",
    line: "Hana acts only inside the clinical protocols and guardrails you define, never a model's own judgment.",
    icon: BookLock,
    /* ink-soft → ink-mute */
    glass: "linear-gradient(150deg, rgba(30,42,58,0.84), rgba(52,68,94,0.82))",
    /* rule-soft → rule */
    glassLight: "linear-gradient(150deg, rgba(207,216,230,0.86), rgba(180,192,220,0.82))",
    tx: -50,
    ty: 36,
  },
  {
    id: "encryption",
    name: "Encryption",
    line: "Encrypted in transit (TLS 1.2/1.3) and at rest (AES-256); end-to-end where the channel supports it.",
    icon: Lock,
    /* frontmost pane: ink-mute → rule-strong, the lightest on navy */
    glass: "linear-gradient(150deg, rgba(52,68,94,0.82), rgba(122,138,176,0.80))",
    /* on paper: paper-bright → band, the pane nearest the reader */
    glassLight: "linear-gradient(150deg, rgba(253,252,250,0.92), rgba(228,234,243,0.86))",
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
    /* deepest pane: navy → navy-soft */
    glass: "linear-gradient(150deg, rgba(0,18,47,0.88), rgba(16,32,56,0.86))",
    /* on paper: rule-strong → ink-mute, the most veiled of the four */
    glassLight: "linear-gradient(150deg, rgba(122,138,176,0.80), rgba(52,68,94,0.78))",
    tx: 150,
    ty: -108,
  },
  {
    id: "human",
    name: "Supervisione umana",
    line: "Tutto ciò che è clinico o fuori ambito viene passato a una persona in tempo reale, secondo le regole di escalation che imposti tu.",
    icon: UserCheck,
    /* navy-soft → ink-soft */
    glass: "linear-gradient(150deg, rgba(16,32,56,0.86), rgba(30,42,58,0.84))",
    /* rule → rule-strong */
    glassLight: "linear-gradient(150deg, rgba(180,192,220,0.80), rgba(122,138,176,0.78))",
    tx: 50,
    ty: -36,
  },
  {
    id: "protocols",
    name: "Protocolli",
    line: "Hana agisce solo all'interno dei protocolli clinici e dei guardrail che definisci tu — mai secondo il giudizio autonomo di un modello.",
    icon: BookLock,
    /* ink-soft → ink-mute */
    glass: "linear-gradient(150deg, rgba(30,42,58,0.84), rgba(52,68,94,0.82))",
    /* rule-soft → rule */
    glassLight: "linear-gradient(150deg, rgba(207,216,230,0.86), rgba(180,192,220,0.82))",
    tx: -50,
    ty: 36,
  },
  {
    id: "encryption",
    name: "Crittografia",
    line: "Crittografata in transito (TLS 1.2/1.3) e a riposo (AES-256); end-to-end dove il canale lo consente.",
    icon: Lock,
    /* frontmost pane: ink-mute → rule-strong, the lightest on navy */
    glass: "linear-gradient(150deg, rgba(52,68,94,0.82), rgba(122,138,176,0.80))",
    /* on paper: paper-bright → band, the pane nearest the reader */
    glassLight: "linear-gradient(150deg, rgba(253,252,250,0.92), rgba(228,234,243,0.86))",
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
  border: 1.5px solid var(--ss-edge, rgba(253,252,250,.20));    /* paper-bright 20% */
  box-shadow: var(--ss-shadow, 0 30px 64px rgba(0,18,47,.55)); /* navy 55% */
  transform: translate3d(var(--tx), var(--ty), var(--lift, 0px));
  transition: transform .38s cubic-bezier(.2,.7,.2,1), border-color .38s ease;
}
.ss-card.is-active { --lift: 64px; border-color: var(--ss-edge-active, #A9B4FF); } /* brand-soft */
.ss-glass { position:absolute; inset:0; border-radius:inherit; transition:filter .38s ease; }
.ss-card.is-active .ss-glass { filter: var(--ss-active-filter, brightness(1.3) saturate(1.06)); }
.ss-sheen {
  position:absolute; inset:0; border-radius:inherit;
  background: radial-gradient(120% 92% at 26% 16%, rgba(253,252,250,.40), rgba(253,252,250,.06) 42%, transparent 66%); /* paper-bright */
  filter: url(#ss-liquid);
  mix-blend-mode: var(--ss-sheen-blend, screen); opacity: var(--ss-sheen-op, .85);
}
.ss-ico {
  position:absolute; top:20px; left:20px; width:46px; height:46px;
  border-radius:13px; background: var(--ss-ico-bg, rgba(253,252,250,.14));    /* paper-bright 14% */
  border:1px solid var(--ss-ico-edge, rgba(253,252,250,.26));                 /* paper-bright 26% */
  display:grid; place-items:center;
}
@media (prefers-reduced-motion: reduce) {
  .ss-stack, .ss-card, .ss-glass, .ss-sheen { transition: none; }
}
`;

/* Order the auto-cycle steps through, back → front. */
const CYCLE_IDS = ["observability", "human", "protocols", "encryption"];

/** `light` renders the section on paper for pages that are light end to end.
 *  The stack sat on a navy tile until 2026-08-25 (Matteo: remove the blue
 *  background), then on a cool pastel tile; since the 2026-09-05 repaint it sits
 *  on a warm paper-to-band value ramp, so light pages have no dark panel here. */
export function SafetyStack({ light = false }: { light?: boolean } = {}) {
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
    <section
      className="relative w-full overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: light ? PAPER : NAVY }}
    >
      <style>{CSS}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] z-0 h-[800px] w-[800px] -translate-x-1/2"
        style={{
          background: light
            ? "radial-gradient(circle, rgba(228,234,243,0.55) 0%, transparent 70%)"  /* band */
            : "radial-gradient(circle, rgba(16,32,56,0.55) 0%, transparent 70%)",    /* navy-soft */
        }}
      />
      <div className="relative z-10 mx-auto px-4 md:px-8">
        <div ref={ref} className="relative mx-auto max-w-7xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${light ? INK : DOT_GRID} 0.6px, transparent 0.6px)`,
              backgroundSize: "22px 22px",
              opacity: light ? 0.06 : 0.05,
            }}
          />

          {/* Heading */}
          <div className="relative z-10 mx-auto mb-14 max-w-2xl text-center md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: light ? ACCENT : ACCENT_DARK }}
            >
              {COPY.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-4 font-serif text-3xl leading-tight md:text-[2.6rem] md:leading-[1.15]"
              style={{ color: light ? INK : PAPER_BRIGHT }}
            >
              {COPY.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: light ? INK_SOFT : DARK_SOFT }}
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
              className={`flex h-[520px] flex-1 items-center justify-center ${light ? "rounded-[28px]" : ""}`}
              style={
                light
                  ? {
                      /* three warm washes over a two-step paper ramp; the depth
                         that used to come from three hues now comes from value */
                      background: [
                        "radial-gradient(60% 55% at 18% 12%, rgba(228,234,243,0.55) 0%, rgba(228,234,243,0) 60%)",  /* band */
                        "radial-gradient(65% 60% at 88% 22%, rgba(180,192,220,0.50) 0%, rgba(180,192,220,0) 62%)",  /* rule */
                        "radial-gradient(70% 60% at 16% 92%, rgba(207,216,230,0.60) 0%, rgba(207,216,230,0) 62%)",  /* rule-soft */
                        "linear-gradient(150deg, #ffffff 0%, #f6f7fb 60%, #e4eaf3 100%)",  /* paper-bright → paper-2 → band */
                      ].join(", "),
                    }
                  : undefined
              }
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div ref={sceneRef} style={{ perspective: "2400px", perspectiveOrigin: "50% 50%" }}>
                <div
                  className="ss-stack"
                  style={
                    (light
                      ? {
                          "--ss-edge": "rgba(0, 18, 47,0.14)",              /* ink 14% */
                          "--ss-edge-active": ACCENT,                      /* brand */
                          "--ss-shadow": "0 24px 48px rgba(0, 18, 47,0.16)",
                          "--ss-active-filter": "brightness(1.05) saturate(1.02)",
                          "--ss-sheen-blend": "overlay",
                          "--ss-sheen-op": ".40",
                          "--ss-ico-bg": "rgba(253,252,250,0.62)",         /* paper-bright 62% */
                          "--ss-ico-edge": "rgba(0, 18, 47,0.14)",
                        }
                      : {
                          "--ss-edge": "rgba(253,252,250,0.20)",           /* paper-bright 20% */
                          "--ss-edge-active": ACCENT_DARK,                 /* brand-soft */
                          "--ss-shadow": "0 30px 64px rgba(0,18,47,0.55)",/* navy 55% */
                          "--ss-active-filter": "brightness(1.3) saturate(1.06)",
                          "--ss-sheen-blend": "screen",
                          "--ss-sheen-op": ".85",
                          "--ss-ico-bg": "rgba(253,252,250,0.14)",
                          "--ss-ico-edge": "rgba(253,252,250,0.26)",
                        }) as React.CSSProperties
                  }
                >
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
                        <div className="ss-glass" style={{ background: light ? layer.glassLight : layer.glass }} />
                        <div className="ss-sheen" />
                        <div className="ss-ico">
                          <Icon
                            className="h-[22px] w-[22px]"
                            strokeWidth={1.8}
                            style={{ color: light ? INK : PAPER_BRIGHT }}
                          />
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
                    light={light}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Mobile: flat card stack ────────────────────────────────────── */}
          <MobileLayers inView={inView} hovered={hovered} setHovered={setHovered} light={light} />
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
  light = false,
}: {
  layer: Layer;
  index: number;
  inView: boolean;
  light?: boolean;
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
        backgroundColor: light
          ? active ? "rgba(37,54,230,0.06)" : "#f6f7fb"          /* brand 6% / paper-2 */
          : active ? "rgba(169,180,255,0.10)" : "rgba(253,252,250,0.03)",  /* brand-soft 10% */
        borderColor: light
          ? active ? "rgba(37,54,230,0.35)" : RULE               /* brand 35% / rule */
          : active ? "rgba(169,180,255,0.45)" : "rgba(253,252,250,0.10)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: light
              ? active ? ACCENT : RULE                            /* brand / rule */
              : active ? ACCENT_DARK : "rgba(253,252,250,0.18)",
            backgroundColor: light
              ? active ? "rgba(37,54,230,0.10)" : PAPER_BRIGHT     /* brand 10% / paper-bright */
              : active ? "rgba(169,180,255,0.16)" : "rgba(253,252,250,0.06)",
          }}
        >
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={1.8}
            style={{ color: light ? (active ? ACCENT : INK_SOFT) : active ? ACCENT_DARK : PAPER_BRIGHT }}
          />
        </span>
        <h3 className="text-base font-semibold tracking-tight" style={{ color: light ? INK : PAPER_BRIGHT }}>
          {layer.name}
        </h3>
      </div>
      <motion.p animate={{ opacity: active ? 1 : 0.7 }} className="mt-2 text-[12px] leading-relaxed" style={{ color: light ? INK_SOFT : DARK_SOFT }}>
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
  light = false,
}: {
  inView: boolean;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  light?: boolean;
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
              backgroundColor: light
                ? isActive ? "rgba(37,54,230,0.06)" : "#f6f7fb"        /* brand 6% / paper-2 */
                : isActive ? "rgba(169,180,255,0.10)" : "rgba(253,252,250,0.04)",
              borderColor: light
                ? isActive ? "rgba(37,54,230,0.35)" : RULE             /* brand 35% / rule */
                : isActive ? "rgba(169,180,255,0.45)" : "rgba(253,252,250,0.10)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  borderColor: light
                    ? isActive ? ACCENT : RULE                          /* brand / rule */
                    : isActive ? ACCENT_DARK : "rgba(253,252,250,0.20)",
                  backgroundColor: light
                    ? isActive ? "rgba(37,54,230,0.10)" : PAPER_BRIGHT  /* brand 10% / paper-bright */
                    : isActive ? "rgba(169,180,255,0.16)" : "rgba(253,252,250,0.06)",
                }}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={1.8}
                  style={{ color: light ? (isActive ? ACCENT : INK_SOFT) : isActive ? ACCENT_DARK : PAPER_BRIGHT }}
                />
              </span>
              <span className="text-base font-semibold tracking-tight" style={{ color: light ? INK : PAPER_BRIGHT }}>
                {layer.name}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: light ? INK_SOFT : DARK_SOFT }}>
              {layer.line}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}

export default SafetyStack;
