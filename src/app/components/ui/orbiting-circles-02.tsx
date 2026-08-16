"use client";

import React from "react";
import { Plug, Webhook } from "lucide-react";
import ParticleSphereAnimation from "./orbiting-circles-02-utils/particalsphear";

/**
 * OrbitingCirclesGlobe — integration logos orbiting a glowing core.
 *
 * Adapted from the shadcnspace "orbiting-circles-02" block. Changes made for
 * this codebase:
 *   - relative imports (no `@/` alias in this project)
 *   - the demo's Supabase/Figma/Slack/React SVGs, hotlinked from an external
 *     host, are replaced by the EHR logos already in /public/logos plus two
 *     lucide nodes for the API and webhooks. Nothing loads off-site.
 *   - explicit arbitrary sizes rather than `w-110`/`w-265`, so the ring
 *     geometry doesn't depend on the Tailwind spacing scale
 *   - icons are NOT mirrored around the ring: with real brand marks, the
 *     original's duplicate-at-+180° trick reads as a mistake
 *   - `border-border` / `bg-background` swapped for explicit palette values
 */

export type OrbitIcon = {
  /** Bitmap logo from /public. Ignored when `node` is set. */
  src?: string;
  alt: string;
  /** Rendered node (e.g. a lucide icon), preferred over `src`. */
  node?: React.ReactNode;
  /** Position on the ring, in degrees. 0 is top. */
  angle: number;
};

export type Orbit = {
  /** Tailwind size classes for the ring. */
  size: string;
  /** Seconds per revolution. */
  duration: number;
  icons: OrbitIcon[];
};

const EHR_ORBITS: Orbit[] = [
  {
    size: "w-[24rem] h-[24rem] md:w-[38rem] md:h-[38rem]",
    duration: 34,
    icons: [
      { src: "/logos/epic.png", alt: "Epic", angle: -58 },
      { src: "/logos/athenahealth.png", alt: "athenahealth", angle: 0 },
      { src: "/logos/eclinicalworks.png", alt: "eClinicalWorks", angle: 58 },
    ],
  },
  {
    size: "w-[32rem] h-[32rem] md:w-[48rem] md:h-[48rem]",
    duration: 44,
    icons: [
      { src: "/logos/drchrono.png", alt: "DrChrono", angle: -78 },
      { src: "/logos/elation.png", alt: "Elation Health", angle: 78 },
    ],
  },
  {
    size: "w-[40rem] h-[40rem] md:w-[58rem] md:h-[58rem]",
    duration: 56,
    icons: [
      { src: "/logos/charm.png", alt: "CharmHealth", angle: -56 },
      { node: <Plug className="h-5 w-5 md:h-6 md:w-6 text-[#2563EB]" strokeWidth={1.8} />, alt: "API", angle: 0 },
      { node: <Webhook className="h-5 w-5 md:h-6 md:w-6 text-[#2563EB]" strokeWidth={1.8} />, alt: "Webhooks", angle: 56 },
    ],
  },
];

export default function OrbitingCirclesGlobe({ orbits = EHR_ORBITS }: { orbits?: Orbit[] }) {
  return (
    <div className="relative flex w-full justify-center overflow-hidden h-[22rem] md:h-[32rem]">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
        @media (prefers-reduced-motion: reduce) {
          .hana-orbit-node, .hana-orbit-chip { animation: none !important; }
        }
      `}</style>

      {/* the core */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-[16rem] -translate-x-1/2 translate-y-1/2 md:w-[26rem]">
        <ParticleSphereAnimation />
      </div>

      {/* rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-slate-200 ${orbit.size}`}
          >
            {orbit.icons.map((iconData) => (
              <div
                key={iconData.alt}
                className="hana-orbit-node absolute left-1/2 top-0 -ml-8 flex h-1/2 origin-bottom flex-col items-center justify-start"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                {/* counter-rotates so the logo never appears upside down */}
                <div
                  className="hana-orbit-chip relative z-10 -mt-8 rounded-full border border-slate-200 bg-white p-3 shadow-[0_6px_18px_-8px_rgba(10,22,51,0.25)] sm:p-4"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                  title={iconData.alt}
                >
                  {iconData.node ?? (
                    <img
                      src={iconData.src}
                      alt={iconData.alt}
                      width={32}
                      height={32}
                      loading="lazy"
                      className="h-5 w-auto max-w-[4.5rem] object-contain md:h-6"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
