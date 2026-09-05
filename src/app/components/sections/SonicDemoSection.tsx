import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { LiveDemoSection } from "./LiveDemoSection";

/**
 * The live-demo section, rebuilt on the sonic-waveform canvas.
 *
 * Matteo, 2026-08-20: replace "Don't take our word for it. Take the call." on
 * /remote-v2 with the white-ground version of the waveform section, "and make
 * sure it works". So the form here is not a copy: this section renders the real
 * LiveDemoSection in `bare` mode, which is the same component Home uses, with
 * the same validation, the same /api endpoints, the same callback flow and the
 * same Vapi web-call handlers. Only the surroundings are new.
 *
 * Canvas credit and the changes made to it: the reference is a Next.js
 * full-screen hero that sizes to window.innerWidth/innerHeight, paints teal on
 * black and listens on window for mousemove. Here it sizes to this section via
 * ResizeObserver, handles devicePixelRatio, tracks the pointer inside the
 * section only, paints periwinkle on white, and renders a single static frame
 * under prefers-reduced-motion.
 */

/* The scenario picker was here and came out on 2026-08-25: the prospect picks
   the call type in the SMS flow after they get the text, so putting the choice on
   the page duplicated it. Ideas kept for that flow: monthly check-in (CCM),
   CPAP week one (sleep), after a discharge (transitions). No enrollment option,
   because enrollment is the TCPA-constrained step a human owns. */

type Props = {
  activeAgentId: string | null;
  webCallStatus: "idle" | "connecting" | "active";
  handleStartWebCall: (agentId: string, assistantId: string) => void;
  handleEndWebCall: () => void;
};

function WaveCanvas({ active }: { active: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let time = 0;
    let amp = 0.62;
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = box.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el.width = Math.max(1, Math.round(w * dpr));
      el.height = Math.max(1, Math.round(h * dpr));
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(box);

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);

    const draw = () => {
      // a translucent white wash rather than clearRect, so the lines trail
      ctx.fillStyle = "rgba(255,255,255,0.13)";
      ctx.fillRect(0, 0, w, h);

      const lineCount = 46;
      const segmentCount = 78;
      const mid = h / 2;
      amp += ((activeRef.current ? 1 : 0.62) - amp) * 0.05;

      for (let i = 0; i < lineCount; i++) {
        const intensity = Math.sin((i / lineCount) * Math.PI);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91,118,217,${intensity * 0.3})`;
        ctx.lineWidth = 1.4;
        for (let j = 0; j <= segmentCount; j++) {
          const x = (j / segmentCount) * w;
          const dist = Math.hypot(x - mouse.x, mid - mouse.y);
          const pull = Math.max(0, 1 - dist / 380);
          const noise = Math.sin(j * 0.1 + time + i * 0.2) * 18;
          const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 46;
          const y = mid + (noise + spike * (1 + pull * 2)) * amp * (h / 520);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += activeRef.current ? 0.026 : 0.014;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0 overflow-hidden bg-white">
      <canvas ref={canvas} className="absolute inset-0" />
    </div>
  );
}

export function SonicDemoSection({
  activeAgentId,
  webCallStatus,
  handleStartWebCall,
  handleEndWebCall,
}: Props) {
  const live = webCallStatus !== "idle";
  return (
    <section className="relative overflow-hidden bg-white">
      <WaveCanvas active={live} />

      {/* white, bottom-up, so the card sits on clean ground and the waves fade */}
      <div
        aria-hidden
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.62) 40%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      <div className="relative z-20 px-6 md:px-10 py-20 md:py-28 flex flex-col items-center justify-center min-h-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full bg-white/70 border border-[#e2e6f4] backdrop-blur-sm px-4 py-1.5">
            <span
              className="w-2 h-2 rounded-full bg-[#5b76d9]"
              style={{ animation: "hana-glow 2.4s ease-in-out infinite" }}
            />
            <span className="text-[13px] font-medium text-slate-600">
              {webCallStatus === "active"
                ? "Hana is listening"
                : webCallStatus === "connecting"
                  ? "Connecting"
                  : "Hana is ready"}
            </span>
          </span>

          <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] tracking-tight mt-7 mb-4">
            Have a chat with HANA.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Give us your number. It calls in about ten seconds. Talk to it like a patient would, then
            let your team try it.
          </p>
        </motion.div>

        {/* the real form, on glass */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[560px] rounded-[24px] bg-white/85 backdrop-blur-xl border border-[#e8ebf2] p-7 sm:p-9 shadow-[0_30px_70px_-24px_rgba(0,18,47,0.22)]"
        >
          <LiveDemoSection
            bare
            bareSurface="glass"
            activeAgentId={activeAgentId}
            webCallStatus={webCallStatus}
            handleStartWebCall={handleStartWebCall}
            handleEndWebCall={handleEndWebCall}
          />
        </motion.div>
      </div>
    </section>
  );
}
