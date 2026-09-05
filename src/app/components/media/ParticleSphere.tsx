"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleSphereAnimation — the glowing core the integration logos orbit.
 *
 * This file was referenced by orbiting-circles-02.tsx but not supplied with it,
 * so it's written from scratch: points distributed evenly on a sphere via the
 * Fibonacci lattice, spun on a tilted axis, projected with a light perspective
 * so the far side reads dimmer and smaller. Canvas rather than 800 DOM nodes.
 *
 * Honours prefers-reduced-motion by drawing a single static frame.
 * Imports are relative — this project has no `@/` path alias.
 */

type Props = {
  /** Core colour. Defaults to the site's Retell-derived blue. */
  color?: string;
  /** Point count. 700 reads dense without costing much. */
  count?: number;
  /** Seconds per full revolution. */
  period?: number;
};

export default function ParticleSphereAnimation({
  color = "#2563EB",
  count = 700,
  period = 26,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fibonacci lattice: even coverage without clustering at the poles.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const TILT = 0.42; // radians, so the axis isn't dead vertical
    const sinT = Math.sin(TILT);
    const cosT = Math.cos(TILT);

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (yaw: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;
      const sinY = Math.sin(yaw);
      const cosY = Math.cos(yaw);

      // Soft inner glow so the core reads as a body, not just dots.
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.15);
      glow.addColorStop(0, `${color}26`);
      glow.addColorStop(0.62, `${color}14`);
      glow.addColorStop(1, `${color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      for (const p of pts) {
        // spin around Y, then tilt around X
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        // perspective: z2 in [-1, 1], nearer points larger and brighter
        const persp = 1 / (2.6 - z2);
        const sx = cx + x1 * radius * persp * 2.6;
        const sy = cy + y2 * radius * persp * 2.6;
        const depth = (z2 + 1) / 2; // 0 far … 1 near

        ctx.globalAlpha = 0.12 + depth * 0.78;
        ctx.fillStyle = color;
        const size = 0.5 + depth * 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    resize();
    if (reduce) {
      draw(0.6);
    } else {
      const start = performance.now();
      const loop = (now: number) => {
        const yaw = (((now - start) / 1000) / period) * Math.PI * 2;
        draw(yaw);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0.6);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, count, period]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
