/**
 * "Fluid bloom" orb for the Talk-to-Hana live-call section.
 * Five soft egg-shaped petals radiating in a flower, morphing and drifting as a
 * group on a navy field. Keyframes live in src/styles/theme.css (hana-*).
 */

const PETALS = [
  { rotate: 0,   w: 158, h: 226, bg: "#0e3a72", opacity: 0.8,  morph: "hana-morph1", dur: "6.5s", delay: "0s" },
  { rotate: 72,  w: 150, h: 216, bg: "#3f86cf", opacity: 0.78, morph: "hana-morph2", dur: "7.4s", delay: "-1.8s" },
  { rotate: 144, w: 156, h: 222, bg: "#9fcdf0", opacity: 0.76, morph: "hana-morph3", dur: "6.8s", delay: "-3.4s" },
  { rotate: 216, w: 152, h: 218, bg: "#1c4e93", opacity: 0.8,  morph: "hana-morph1", dur: "7.8s", delay: "-2.6s" },
  { rotate: 288, w: 150, h: 214, bg: "#A7BCF5", opacity: 0.76, morph: "hana-morph2", dur: "6.2s", delay: "-4.4s" },
];

export function HanaBloomOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }} aria-hidden="true">
      {/* soft base glow */}
      <div
        className="hana-orb-glow absolute rounded-full"
        style={{
          inset: -6,
          background: "radial-gradient(circle at 50% 54%, rgba(91,118,217,.26), rgba(0,18,47,0) 66%)",
          filter: "blur(20px)",
          animation: "hana-glow 7s ease-in-out infinite",
        }}
      />

      {/* five petals, rotating slowly as a group */}
      <div className="hana-orb-spin absolute inset-0" style={{ animation: "hana-spin-cw 26s linear infinite" }}>
        {PETALS.map((p, i) => (
          <div key={i} className="absolute inset-0" style={{ transform: `rotate(${p.rotate}deg)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="hana-orb-petal"
                style={{
                  width: p.w,
                  height: p.h,
                  background: p.bg,
                  opacity: p.opacity,
                  borderRadius: "50% 50% 50% 50% / 66% 66% 36% 36%",
                  animation: `${p.morph} ${p.dur} ease-in-out infinite`,
                  animationDelay: p.delay,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* inner core highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: 96,
          height: 96,
          background: "radial-gradient(circle, rgba(224,236,250,.6), rgba(224,236,250,0) 72%)",
        }}
      />
    </div>
  );
}
