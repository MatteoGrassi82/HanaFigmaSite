import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * "What is Hana?" — share of patients actually reached, by channel.
 * Ported from the Claude Design bundle; uses HANA tokens (navy #00122F,
 * periwinkle accent #A7BCF5, DM Sans + Instrument Serif). Bars grow and the
 * percentages count up when the section scrolls into view.
 */

type Bar = { value: number; label: string; sub: string; highlight?: boolean };

const BARS: Bar[] = [
  { value: 58, label: "IVR phone tree", sub: "Touch-tone menus — most hang up before getting help" },
  { value: 30, label: "Patient portals", sub: "Inbound only — the rest never log in" },
  { value: 85, label: "3rd-gen voice AI", sub: "Natural, multi-turn — and the call actually finishes", highlight: true },
  { value: 33, label: "SMS reminders", sub: "One-turn texts that can't handle follow-up" },
];

export function WhyHana() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(false);
  const [counts, setCounts] = useState<number[]>(() => BARS.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setFilled(true);
      setCounts(BARS.map((b) => b.value));
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setFilled(true);
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setCounts(BARS.map((b) => Math.round(b.value * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 350);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <section ref={ref} className="bg-white py-20 md:py-[120px] px-6 md:px-8">
      {/* Header */}
      <div className="max-w-[640px] mx-auto text-center">
        <div className="text-[12px] font-bold uppercase tracking-[2.5px] text-[#5b76d9] mb-5">
          Overview
        </div>
        <h2 className="font-sans font-medium text-[38px] md:text-[56px] leading-[1.04] tracking-[-0.025em] text-[#00122F] m-0">
          What is <span className="font-serif italic font-normal">Hana?</span>
        </h2>
        <p className="mt-5 mx-auto max-w-[540px] text-[16px] leading-[1.7] text-[#5b6472] tracking-[-0.01em]">
          Share of patients actually reached, by channel. Legacy systems wait for the patient to
          act — most never do. Hana reaches out, and the conversation finishes.
        </p>
      </div>

      {/* Bars */}
      <div className="relative max-w-[900px] mx-auto mt-14 md:mt-20 flex items-start justify-center gap-2.5 sm:gap-4">
        {BARS.map((bar, i) => (
          <div key={bar.label} className="relative flex-1 flex flex-col min-w-0">
            <div
              className="relative overflow-hidden rounded-[20px] md:rounded-[32px] h-[260px] md:h-[420px]"
              style={{
                backgroundColor: "#f6f7fb",
                backgroundImage:
                  "linear-gradient(135deg, #eef0f7 25%, transparent 25.5%, transparent 50%, #eef0f7 50.5%, #eef0f7 75%, transparent 75.5%, transparent)",
                backgroundSize: "12px 12px",
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-[20px] md:rounded-[32px]"
                style={{
                  height: filled ? `${bar.value}%` : "0%",
                  background: bar.highlight ? "#A7BCF5" : "rgba(0,18,47,0.82)",
                  transition: reduce ? undefined : "height 1s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <div className="absolute top-3 md:top-4 left-0 right-0 text-center text-[20px] md:text-[26px] font-semibold tracking-[-0.02em] text-white">
                  {counts[i]}%
                </div>
                {bar.highlight && (
                  <div className="absolute -top-[42px] left-1/2 -translate-x-1/2 bg-[#00122F] text-white text-[12px] md:text-[13px] font-semibold px-3 py-1.5 rounded-[10px] whitespace-nowrap">
                    patients reached
                  </div>
                )}
              </div>
            </div>
            <p className="mt-4 mb-1 text-center text-[13px] md:text-[15px] font-semibold tracking-[-0.01em] text-[#00122F]">
              {bar.label}
            </p>
            <p className="m-0 text-center text-[11px] md:text-[13px] leading-[1.45] tracking-[-0.01em] text-[#8a919c]">
              {bar.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyHana;
