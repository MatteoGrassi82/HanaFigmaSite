import { motion } from "motion/react";

/* ── Custom animated icons for the loop diagram ─────────────────────────────
   Each icon performs its VERB when its node activates: Read sweeps a scan beam
   over a document, Reason lights the chosen branch, Engage bounces a voice
   waveform, Write-Back draws a line with a pen. Drawn in a 24×24 box, stroked
   in `color` (white when active on an accent disc, navy at rest). Built with
   motion/react SVG primitives so the animation is driven by the shared
   `active` flag — no extra timers. */

export type LoopIconProps = {
  active: boolean;
  /** stroke/ink color (navy at rest, white when the disc is filled) */
  color: string;
  /** accent used for the moving/active highlight (scan beam, lit branch …) */
  accent: string;
  size?: number;
};

const SW = 1.8; // shared stroke width

/* ── READ: document + sweeping scan beam ───────────────────────────────────*/
export function ReadIcon({ active, color, accent, size = 22 }: LoopIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* page */}
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth={SW}
      />
      {/* text lines */}
      <line x1="8" y1="7.5" x2="16" y2="7.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <line x1="8" y1="14.5" x2="13" y2="14.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      {/* sweeping scan beam (only animates while active) */}
      {active && (
        <motion.line
          x1="5"
          x2="19"
          stroke={accent}
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ y1: 5, y2: 5, opacity: 0 }}
          animate={{ y1: [5, 19, 5], y2: [5, 19, 5], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

/* ── REASON: branching paths, chosen branch lights up ──────────────────────*/
export function ReasonIcon({ active, color, accent, size = 22 }: LoopIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* source node */}
      <circle cx="5" cy="12" r="2.2" stroke={color} strokeWidth={SW} />
      {/* three destination nodes */}
      <circle cx="19" cy="5" r="2" stroke={color} strokeWidth={SW} />
      <circle cx="19" cy="12" r="2" stroke={color} strokeWidth={SW} />
      <circle cx="19" cy="19" r="2" stroke={color} strokeWidth={SW} />
      {/* branches (dim) */}
      <path d="M7 11 L17 5.5" stroke={color} strokeWidth={SW} strokeLinecap="round" opacity={0.5} />
      <path d="M7.2 12 L17 12" stroke={color} strokeWidth={SW} strokeLinecap="round" opacity={0.5} />
      <path d="M7 13 L17 18.5" stroke={color} strokeWidth={SW} strokeLinecap="round" opacity={0.5} />
      {/* chosen branch (middle) lights up when active */}
      {active && (
        <>
          <motion.path
            d="M7.2 12 L17 12"
            stroke={accent}
            strokeWidth={2.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <motion.circle
            cx="19"
            cy="12"
            r="2"
            fill={accent}
            stroke="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: "19px 12px" }}
          />
        </>
      )}
    </svg>
  );
}

/* ── ENGAGE: voice waveform, bars bounce ───────────────────────────────────*/
export function EngageIcon({ active, color, accent, size = 22 }: LoopIconProps) {
  const bars = [
    { x: 5, rest: 6 },
    { x: 9, rest: 10 },
    { x: 12, rest: 14 },
    { x: 15, rest: 9 },
    { x: 19, rest: 5 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {bars.map((b, i) => {
        const cy = 12;
        const half = b.rest / 2;
        return (
          <motion.line
            key={i}
            x1={b.x}
            x2={b.x}
            stroke={active ? accent : color}
            strokeWidth={2.1}
            strokeLinecap="round"
            initial={{ y1: cy - half, y2: cy + half }}
            animate={
              active
                ? {
                    y1: [cy - half, cy - half * 1.9, cy - half * 0.5, cy - half],
                    y2: [cy + half, cy + half * 1.9, cy + half * 0.5, cy + half],
                  }
                : { y1: cy - half, y2: cy + half }
            }
            transition={
              active
                ? { duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </svg>
  );
}

/* ── WRITE-BACK: document, pen draws a line ────────────────────────────────*/
export function WriteIcon({ active, color, accent, size = 22 }: LoopIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* page */}
      <rect x="4" y="3" width="13" height="18" rx="2" stroke={color} strokeWidth={SW} />
      {/* existing lines */}
      <line x1="7" y1="7.5" x2="13" y2="7.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <line x1="7" y1="11" x2="11" y2="11" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      {/* the line being written (draws in when active) */}
      <motion.line
        x1="7"
        y1="14.5"
        x2="13"
        y2="14.5"
        stroke={accent}
        strokeWidth={2.2}
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {/* pen nib that travels with the writing */}
      {active && (
        <motion.g
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [-6, 6], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <path
            d="M16 11 L20 15 L18.5 19 L14.5 15 Z"
            fill={accent}
            stroke={accent}
            strokeWidth={0.5}
            strokeLinejoin="round"
            transform="translate(-2,1) scale(0.55) rotate(0 16 15)"
          />
        </motion.g>
      )}
    </svg>
  );
}

/* Map station id → icon component. */
export const LOOP_ICONS: Record<
  string,
  (p: LoopIconProps) => React.JSX.Element
> = {
  read: ReadIcon,
  reason: ReasonIcon,
  engage: EngageIcon,
  writeback: WriteIcon,
};
