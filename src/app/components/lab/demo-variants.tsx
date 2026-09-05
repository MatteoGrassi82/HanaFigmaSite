import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Pause, Phone, Play } from "lucide-react";

/**
 * Alternatives for the LEFT PANEL of the live-demo section, for /remote-lab.
 *
 * Matteo, 2026-08-20: keep the section exactly as it is, he just does not want
 * the bloom orb ("the flower thing"). So the shell below is the live section
 * verbatim, same heading, same two-column card, same form on the right, and only
 * the left panel changes. Four options:
 *
 *   1. Waveform   the call plays, with the line being spoken underneath
 *   2. Phone      the patient's screen: the practice calling, captions arriving
 *   3. Pulse      concentric rings from a single point, no audio, pure calm
 *   4. Captions   no graphic at all, just the conversation in large type
 *
 * AUDIO: there is no recording in the repo. Anything with a playhead looks for
 * /audio/demo-call.mp3 and, when it is missing, runs a simulated clock at real
 * speed so the panel still demonstrates itself. Drop a 40 to 60 second consented
 * recording there and it becomes real with no code change.
 *
 * The form in the shell is a static copy for the lab. On the page it stays the
 * real LiveDemoSection form, wired to the same handlers as today.
 */

/* A deterministic waveform. Math.random would differ between the prerender and
   the hydrated page, so this is a cheap hash instead. */
const BARS = Array.from({ length: 72 }, (_, i) => {
  const n = Math.sin(i * 12.9898) * 43758.5453;
  const f = n - Math.floor(n);
  const envelope = 0.45 + 0.55 * Math.sin((i / 71) * Math.PI);
  return Math.max(0.16, Math.min(1, (0.3 + f * 0.7) * envelope));
});

type Turn = { t: number; who: "hana" | "patient"; text: string };

/* An illustrative monthly check-in, not a transcript of a real patient. */
const TRANSCRIPT: Turn[] = [
  { t: 0, who: "hana", text: "Hi Dorothy, it's Hana calling from Dr. Whitfield's office for your monthly check-in. Is now still a good time?" },
  { t: 7, who: "patient", text: "Yes, that's fine. I'm just sitting down." },
  { t: 11, who: "hana", text: "Lovely. Last month you'd started the water tablet in the mornings. How has that been going?" },
  { t: 18, who: "patient", text: "I take it most days. I skip it when I'm going out, because, well, you know." },
  { t: 26, who: "hana", text: "That makes complete sense, and you're not the only one who does that. Roughly how many days a week do you think you skip it?" },
  { t: 34, who: "patient", text: "Two, maybe three." },
  { t: 37, who: "hana", text: "Thank you, that's useful. I'll note that for the nurse so she can talk to you about the timing. Any swelling in your ankles this week?" },
  { t: 46, who: "patient", text: "A bit in the evenings, same as before." },
  { t: 50, who: "hana", text: "I'll flag that too. Everything else I'll write up, and someone from the practice will call you if the nurse wants to change anything." },
];
const DURATION = 58;

function mmss(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/* ── the playhead, shared by every panel that has one ─────────────────────── */
function useCallClock() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const raf = useRef<number | null>(null);
  const simStart = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [hasFile, setHasFile] = useState(true);

  const tick = useCallback(() => {
    const el = audio.current;
    const t = el && !el.error && el.duration ? el.currentTime : (Date.now() - simStart.current) / 1000;
    if (t >= DURATION) {
      setTime(DURATION);
      setPlaying(false);
      return;
    }
    setTime(t);
    raf.current = requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      audio.current?.pause();
      if (raf.current) cancelAnimationFrame(raf.current);
      setPlaying(false);
      return;
    }
    const from = time >= DURATION ? 0 : time;
    if (time >= DURATION) setTime(0);
    simStart.current = Date.now() - from * 1000;
    audio.current?.play().catch(() => setHasFile(false));
    setPlaying(true);
    raf.current = requestAnimationFrame(tick);
  }, [playing, tick, time]);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const idx = TRANSCRIPT.reduce((acc, turn, i) => (time >= turn.t ? i : acc), -1);
  const el = (
    <audio
      ref={audio}
      src="/audio/demo-call.mp3"
      preload="none"
      onError={() => setHasFile(false)}
      onEnded={() => setPlaying(false)}
    />
  );
  return { playing, time, toggle, hasFile, idx, current: idx >= 0 ? TRANSCRIPT[idx] : null, audioEl: el };
}

function PlayButton({ playing, onClick, dark = true }: { playing: boolean; onClick: () => void; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? "Pause" : "Play the call"}
      className={`shrink-0 w-14 h-14 rounded-full grid place-items-center cursor-pointer border-0 hover:scale-[1.04] transition-transform ${
        dark ? "bg-[#00122f]" : "bg-white shadow-md"
      }`}
    >
      {playing ? (
        <Pause className={`w-5 h-5 ${dark ? "text-white" : "text-[#00122f]"}`} strokeWidth={2.4} />
      ) : (
        <Play className={`w-5 h-5 ml-0.5 ${dark ? "text-white" : "text-[#00122f]"}`} strokeWidth={2.4} />
      )}
    </button>
  );
}

/* ── the section shell: everything except the left panel ──────────────────── */
function DemoShell({ left, caption }: { left: React.ReactNode; caption: string }) {
  const inputClass =
    "w-full bg-transparent border-0 border-b-[1.5px] border-[#dfe3ee] py-2 text-[#00122f] text-[17px] placeholder:text-[#b3bdcc] focus:outline-none focus:border-[#5b76d9] transition-colors";
  const labelClass = "block text-[12px] font-bold uppercase tracking-[2.2px] text-[#5b76d9] mb-3";

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-[1.05] text-center mb-4 tracking-tight">
          Don't take our word for it. Take the call.
        </h2>
        <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-14 leading-relaxed">
          Drop your number and Hana calls you right now. The agent works out the right demo as you talk.
        </p>

        <div className="flex flex-col lg:flex-row gap-0 border border-[#e8ebf2] rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,18,47,0.10)]">
          {/* Left — the panel under discussion */}
          <div className="relative lg:w-1/2 bg-white overflow-hidden flex flex-col items-center justify-center min-h-[320px] lg:min-h-[520px] px-10 sm:px-12 py-16">
            {left}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2">
              <span
                className="w-2 h-2 rounded-full bg-[#5b76d9]"
                style={{ animation: "hana-glow 2.4s ease-in-out infinite" }}
              />
              <span className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#64748b]">{caption}</span>
            </div>
          </div>

          {/* Right — the form, unchanged */}
          <div className="lg:w-1/2 bg-[#f6f7fb] border-t lg:border-t-0 lg:border-l border-[#e8ebf2] p-7 sm:p-10 lg:p-14 flex flex-col justify-center">
            <h3 className="font-serif text-[26px] md:text-[30px] leading-tight text-slate-900 m-0">
              Hear Hana handle a real patient conversation.
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-500 mt-3 mb-8">
              Enter your details and Hana texts you first to confirm, then calls within seconds, so
              you can experience the AI live.
            </p>

            <div className="space-y-7">
              <div>
                <span className={labelClass}>Name</span>
                <input className={inputClass} placeholder="Your name" />
              </div>
              <div>
                <span className={labelClass}>Email</span>
                <input className={inputClass} placeholder="you@company.com" />
              </div>
              <div>
                <span className={labelClass}>Phone</span>
                <div className="mb-4 inline-flex items-center gap-1 rounded-[10px] p-1 bg-[#eef0f5] border border-[#e2e6f4]">
                  <span className="rounded-[7px] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#00122f] shadow-sm">
                    🇺🇸 US / Canada
                  </span>
                  <span className="px-3 py-1.5 text-[13px] font-medium text-slate-500">🇪🇺 Europe</span>
                </div>
                <input className={inputClass} placeholder="+1 555 123 4567" />
              </div>
            </div>

            <button className="mt-9 w-full rounded-xl bg-[#111c33] text-white text-[15px] font-semibold py-4 border-0 cursor-pointer inline-flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" strokeWidth={2.2} />
              Text me &amp; call me
            </button>

            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-[#e2e6f4]" />
              <span className="text-[11px] font-bold uppercase tracking-[1.6px] text-slate-400">or</span>
              <span className="flex-1 h-px bg-[#e2e6f4]" />
            </div>

            <button className="w-full rounded-xl bg-white border border-[#e2e6f4] text-[15px] font-semibold text-[#00122f] py-4 cursor-pointer inline-flex items-center justify-center gap-2">
              Prefer to talk now? Start a web call
              <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 1. Waveform: the call plays, the spoken line sits under it ───────────── */
export function DemoWithWaveform() {
  const c = useCallClock();
  const progress = c.time / DURATION;
  return (
    <DemoShell
      caption={c.playing ? "Hana is speaking" : "Hana is listening"}
      left={
        <div className="w-full max-w-[420px]">
          <div className="flex items-end gap-[3px] h-[120px]">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full transition-colors duration-150"
                style={{
                  height: `${h * 100}%`,
                  background: i / BARS.length <= progress ? "#5b76d9" : "#e2e6f4",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-8">
            <PlayButton playing={c.playing} onClick={c.toggle} />
            <span className="text-[14px] tabular-nums text-slate-500">
              {mmss(c.time)} / {mmss(DURATION)}
            </span>
            <span className="ml-auto text-[12px] text-slate-500">
              {c.hasFile ? "Monthly check-in" : "simulated · recording pending"}
            </span>
          </div>
          <div className="mt-7 min-h-[86px]">
            {c.current ? (
              <>
                <p className={`text-[10.5px] font-bold uppercase tracking-[1.6px] m-0 ${c.current.who === "hana" ? "text-[#5b76d9]" : "text-slate-500"}`}>
                  {c.current.who === "hana" ? "Hana" : "Patient"}
                </p>
                <p className="text-[15px] leading-[1.6] text-slate-700 mt-2 mb-0">{c.current.text}</p>
              </>
            ) : (
              <p className="text-[15px] leading-[1.6] text-slate-500 m-0">
                Press play to hear a monthly check-in call.
              </p>
            )}
          </div>
          {c.audioEl}
        </div>
      }
    />
  );
}

/* ── 2. Phone: the patient's screen, which is where the call actually lands ── */
export function DemoWithPhone() {
  const c = useCallClock();
  const bubbles = TRANSCRIPT.slice(Math.max(0, c.idx - 1), c.idx + 1);
  return (
    <DemoShell
      caption={c.playing ? "Call in progress" : "Hana is listening"}
      left={
        <div className="w-full max-w-[300px]">
          <div className="relative mx-auto w-[248px] rounded-[38px] bg-[#00122f] p-[10px] shadow-[0_24px_60px_-18px_rgba(0,18,47,0.45)]">
            <div className="relative rounded-[30px] bg-[#f6f7fb] overflow-hidden h-[430px] flex flex-col">
              {/* status bar + who is calling */}
              <div className="pt-7 pb-5 px-5 text-center bg-white">
                <span className="mx-auto block w-[52px] h-[52px] rounded-full bg-[#e8ecfb] grid place-items-center text-[15px] font-bold text-[#5b76d9]">
                  DW
                </span>
                <p className="text-[14.5px] font-semibold text-[#00122f] mt-3 mb-0">
                  Dr. Whitfield's Office
                </p>
                <p className="text-[12px] tabular-nums text-slate-500 mt-1 mb-0">
                  {c.playing ? `Connected · ${mmss(c.time)}` : "Incoming call"}
                </p>
              </div>

              {/* captions arriving */}
              <div className="flex-1 px-4 py-4 space-y-2.5 overflow-hidden">
                {bubbles.map((turn, i) => (
                  <motion.div
                    key={`${turn.t}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: i === bubbles.length - 1 ? 1 : 0.5, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-[1.45] ${
                      turn.who === "hana"
                        ? "bg-white border border-[#e8ebf2] text-slate-700"
                        : "ml-auto bg-[#5b76d9] text-white"
                    }`}
                  >
                    {turn.text}
                  </motion.div>
                ))}
                {c.idx < 0 && (
                  <p className="text-[12.5px] text-slate-400 text-center mt-10">
                    Press play to watch the call arrive.
                  </p>
                )}
              </div>

              {/* the practice's own caller ID, which is the point of the panel */}
              <div className="px-4 py-3 bg-white border-t border-[#e8ebf2] text-center">
                <p className="text-[10.5px] font-bold uppercase tracking-[1.3px] text-slate-500 m-0">
                  Your practice's number
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-7">
            <PlayButton playing={c.playing} onClick={c.toggle} />
            <span className="text-[13px] tabular-nums text-slate-500">
              {c.hasFile ? `${mmss(c.time)} / ${mmss(DURATION)}` : "simulated"}
            </span>
          </div>
          {c.audioEl}
        </div>
      }
    />
  );
}

/* ── 3. Pulse: rings from one point. A straight swap for the orb, no audio ── */
export function DemoWithPulse() {
  return (
    <DemoShell
      caption="Hana is listening"
      left={
        <div className="relative w-[300px] h-[300px] grid place-items-center">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border border-[#5b76d9]"
              style={{ width: 96, height: 96 }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 3.1], opacity: [0.45, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i, ease: "easeOut" }}
            />
          ))}
          <span
            className="relative w-[96px] h-[96px] rounded-full grid place-items-center"
            style={{
              background:
                "radial-gradient(70% 70% at 35% 30%, #8fa8ee 0%, #5b76d9 55%, #3f56b4 100%)",
              boxShadow: "0 18px 40px -12px rgba(91,118,217,0.55)",
            }}
          >
            <span aria-hidden className="flex items-end gap-[3px] h-5">
              {[8, 14, 20, 12, 7].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-white/90"
                  initial={{ height: h }}
                  animate={{ height: [h, h * 0.5, h] }}
                  transition={{ duration: 1.1 + i * 0.13, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </span>
          </span>
        </div>
      }
    />
  );
}

/* ── 4. Captions: no graphic, the conversation carries the panel ──────────── */
export function DemoWithCaptions() {
  const c = useCallClock();
  return (
    <DemoShell
      caption={c.playing ? "Hana is speaking" : "Hana is listening"}
      left={
        <div className="w-full max-w-[420px] flex flex-col justify-center min-h-[300px]">
          {c.current ? (
            <motion.div key={c.idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <p className={`text-[11px] font-bold uppercase tracking-[2px] m-0 ${c.current.who === "hana" ? "text-[#5b76d9]" : "text-slate-500"}`}>
                {c.current.who === "hana" ? "Hana" : "Patient"}
              </p>
              <p className="font-serif text-[24px] md:text-[28px] leading-[1.32] text-[#00122f] mt-4 mb-0">
                &ldquo;{c.current.text}&rdquo;
              </p>
            </motion.div>
          ) : (
            <p className="font-serif text-[24px] md:text-[28px] leading-[1.32] text-slate-400 m-0">
              A monthly check-in, in the patient's own words. Press play.
            </p>
          )}

          <div className="mt-10">
            <div className="h-[3px] rounded-full bg-[#e2e6f4] overflow-hidden">
              <div
                className="h-full bg-[#5b76d9] transition-[width] duration-100 ease-linear"
                style={{ width: `${(c.time / DURATION) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-4 mt-6">
              <PlayButton playing={c.playing} onClick={c.toggle} />
              <span className="text-[14px] tabular-nums text-slate-500">
                {mmss(c.time)} / {mmss(DURATION)}
              </span>
              <span className="ml-auto text-[12px] text-slate-500">
                {c.hasFile ? "Monthly check-in" : "simulated · recording pending"}
              </span>
            </div>
          </div>
          {c.audioEl}
        </div>
      }
    />
  );
}

/* ── 5, 6, 7: Siri-style circular animations ───────────────────────────────────
 * Matteo, 2026-08-20: "more an animation like a circle like Siri". Three takes,
 * all on the site's palette rather than Siri's rainbow, all animated with cheap
 * transforms so nothing re-renders per frame:
 *   5. radial waveform, bars around a ring, the shape people read as "voice"
 *   6. the liquid orb, blurred colour blobs drifting inside a circular mask
 *   7. the halo, a conic gradient rotating around a thin ring
 * Each one idles slowly and speeds up while the call plays, which is the Siri
 * behaviour: alive when waiting, animated when listening.
 */

/* 5 — radial waveform */
function SiriRadial({ playing }: { playing: boolean }) {
  const N = 56;
  const R = 92;
  return (
    <div className="relative w-[300px] h-[300px] grid place-items-center">
      {Array.from({ length: N }, (_, i) => {
        const seed = BARS[i % BARS.length];
        const base = 10 + seed * 22;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 w-[3px] rounded-full origin-bottom"
            style={{
              background: i % 7 === 0 ? "#8fa8ee" : "#5b76d9",
              transform: `rotate(${(i * 360) / N}deg) translateY(-${R}px)`,
            }}
            initial={{ height: base * 0.5, opacity: 0.55 }}
            animate={
              playing
                ? { height: [base * 0.45, base * 1.55, base * 0.7, base * 1.2], opacity: [0.6, 1, 0.7, 0.95] }
                : { height: [base * 0.5, base * 0.85, base * 0.5], opacity: [0.45, 0.7, 0.45] }
            }
            transition={{
              duration: playing ? 0.9 + (i % 6) * 0.11 : 3.2 + (i % 5) * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 9) * 0.06,
            }}
          />
        );
      })}
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 132,
          height: 132,
          background: "radial-gradient(60% 60% at 40% 35%, rgba(143,168,238,0.30) 0%, rgba(91,118,217,0) 70%)",
        }}
        animate={{ scale: playing ? [1, 1.12, 1] : [1, 1.04, 1] }}
        transition={{ duration: playing ? 1.8 : 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* 6 — the liquid orb */
function SiriOrb({ playing }: { playing: boolean }) {
  const blobs = [
    { c: "#5b76d9", s: 150, x: -26, y: -18, d: 9 },
    { c: "#8fa8ee", s: 130, x: 30, y: 22, d: 11 },
    { c: "#7c5cd6", s: 120, x: 12, y: -34, d: 13 },
    { c: "#E8A06A", s: 82, x: -30, y: 34, d: 15 },
  ];
  return (
    <div className="relative w-[300px] h-[300px] grid place-items-center">
      {/* the halo it sits in */}
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 250,
          height: 250,
          background: "radial-gradient(circle, rgba(91,118,217,0.16) 0%, rgba(91,118,217,0) 68%)",
        }}
        animate={{ scale: playing ? [1, 1.08, 1] : [1, 1.03, 1], opacity: playing ? [0.9, 1, 0.9] : [0.6, 0.8, 0.6] }}
        transition={{ duration: playing ? 2.2 : 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: 196, height: 196, background: "#eef1fb", boxShadow: "0 24px 60px -18px rgba(91,118,217,0.45)" }}
      >
        {blobs.map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.s,
              height: b.s,
              left: "50%",
              top: "50%",
              marginLeft: -b.s / 2,
              marginTop: -b.s / 2,
              background: b.c,
              filter: "blur(26px)",
              opacity: 0.85,
            }}
            animate={{
              x: [b.x, -b.x * 0.7, b.x * 0.4, b.x],
              y: [b.y, b.y * 0.5, -b.y * 0.8, b.y],
              scale: playing ? [1, 1.22, 0.92, 1] : [1, 1.08, 0.98, 1],
            }}
            transition={{ duration: playing ? b.d * 0.45 : b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* the glass over it */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(70% 60% at 32% 24%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        />
      </div>
    </div>
  );
}

/* 7 — the halo: a conic gradient turning around a thin ring */
function SiriHalo({ playing }: { playing: boolean }) {
  const ring = 210;
  const thickness = 10;
  return (
    <div className="relative w-[300px] h-[300px] grid place-items-center">
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: ring,
          height: ring,
          background:
            "conic-gradient(from 0deg, #5b76d9 0deg, #8fa8ee 90deg, #7c5cd6 190deg, #E8A06A 268deg, #5b76d9 360deg)",
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
          filter: "blur(0.4px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: playing ? 4.5 : 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: ring + 34,
          height: ring + 34,
          background: "radial-gradient(circle, rgba(91,118,217,0.18) 40%, rgba(91,118,217,0) 70%)",
        }}
        animate={{ opacity: playing ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4], scale: playing ? [1, 1.05, 1] : [1, 1.02, 1] }}
        transition={{ duration: playing ? 2 : 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* the voice, inside the ring */}
      <span className="relative flex items-end gap-[4px] h-9">
        {[14, 24, 34, 20, 12].map((h, i) => (
          <motion.span
            key={i}
            className="w-[4px] rounded-full bg-[#5b76d9]"
            initial={{ height: h * 0.5 }}
            animate={playing ? { height: [h * 0.4, h, h * 0.6, h * 0.9] } : { height: [h * 0.5, h * 0.7, h * 0.5] }}
            transition={{ duration: playing ? 0.85 + i * 0.12 : 2.6 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </span>
    </div>
  );
}

function SiriPanel({ kind }: { kind: "radial" | "orb" | "halo" }) {
  const c = useCallClock();
  const Art = kind === "radial" ? SiriRadial : kind === "orb" ? SiriOrb : SiriHalo;
  return (
    <DemoShell
      caption={c.playing ? "Hana is speaking" : "Hana is listening"}
      left={
        <div className="w-full flex flex-col items-center">
          <Art playing={c.playing} />
          <div className="flex items-center gap-4 mt-2">
            <PlayButton playing={c.playing} onClick={c.toggle} />
            <span className="text-[14px] tabular-nums text-slate-500">
              {mmss(c.time)} / {mmss(DURATION)}
            </span>
          </div>
          <div className="mt-6 min-h-[64px] max-w-[400px] text-center">
            {c.current ? (
              <p className="text-[14.5px] leading-[1.6] text-slate-700 m-0">
                <span className={`font-bold uppercase tracking-[1.2px] text-[10.5px] mr-2 ${c.current.who === "hana" ? "text-[#5b76d9]" : "text-slate-500"}`}>
                  {c.current.who === "hana" ? "Hana" : "Patient"}
                </span>
                {c.current.text}
              </p>
            ) : (
              <p className="text-[14.5px] leading-[1.6] text-slate-500 m-0">
                Press play to hear a monthly check-in call.
              </p>
            )}
          </div>
          {c.audioEl}
        </div>
      }
    />
  );
}

export function DemoWithSiriRadial() {
  return <SiriPanel kind="radial" />;
}
export function DemoWithSiriOrb() {
  return <SiriPanel kind="orb" />;
}
export function DemoWithSiriHalo() {
  return <SiriPanel kind="halo" />;
}

/* ── 8 and 9: waveforms that cross the panel ───────────────────────────────────
 * Matteo, 2026-08-20: "one like Siri more, another one like a central thing in
 * the middle with the waveform crossing through, long", with the SonicWaveform
 * canvas as the reference.
 *
 * That reference is written for a Next.js full-screen black hero: it sizes to
 * window.innerWidth/innerHeight, paints teal on black, follows the mouse across
 * the whole page and imports framer-motion and an @/ alias. None of that fits
 * here, so both panels below are rewritten rather than pasted:
 *   · the canvas sizes to its own container, with devicePixelRatio handling
 *   · white ground, periwinkle strokes, on the site's palette
 *   · pointer influence is measured inside the panel, not the window
 *   · amplitude swells while the call plays, and prefers-reduced-motion gets a
 *     single static frame
 * No new dependencies: we already have motion/react, so framer-motion is not
 * installed, and there is no @/ alias in this project (relative imports only).
 */
function useCanvasScene(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, amp: number) => void,
  playing: boolean,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t = 0;
    let amp = 0.35;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = box.getBoundingClientRect();
      el.width = Math.max(1, Math.round(width * dpr));
      el.height = Math.max(1, Math.round(height * dpr));
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: width, h: height };
    };

    let dims = size();
    const ro = new ResizeObserver(() => { dims = size(); });
    ro.observe(box);

    const frame = () => {
      const target = playingRef.current ? 1 : 0.32;
      amp += (target - amp) * 0.06; // ease toward the new amplitude
      draw(ctx, dims.w, dims.h, t, amp);
      t += playingRef.current ? 0.032 : 0.012;
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);

  return { wrap, canvas };
}

/* 8 — the Siri ribbons: coloured sine bands crossing the panel */
function SiriRibbons({ playing }: { playing: boolean }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, amp: number) => {
      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;
      const bands = [
        { c: "91,118,217", f: 0.016, s: 1.0, a: 0.42, p: 0 },
        { c: "143,168,238", f: 0.021, s: -1.35, a: 0.34, p: 1.1 },
        { c: "124,92,214", f: 0.013, s: 0.72, a: 0.3, p: 2.3 },
        { c: "232,160,106", f: 0.026, s: -0.9, a: 0.2, p: 3.7 },
      ];
      for (const b of bands) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const taper = Math.sin((x / w) * Math.PI) ** 1.4;
          const wave =
            Math.sin(x * b.f + t * b.s + b.p) * 26 +
            Math.sin(x * b.f * 2.3 + t * b.s * 1.7) * 9;
          const y = mid + wave * taper * amp * (h / 240);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${b.c},${b.a})`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowColor = `rgba(${b.c},0.35)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    },
    [],
  );
  const { wrap, canvas } = useCanvasScene(draw, playing);
  return (
    <div ref={wrap} className="relative w-full h-[240px]">
      <canvas ref={canvas} className="absolute inset-0" />
    </div>
  );
}

/* 9 — stacked lines crossing a node in the middle, the reference effect */
function SonicLines({ playing }: { playing: boolean }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, amp: number) => {
      // a translucent white wash instead of clearRect leaves a soft trail
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(0, 0, w, h);

      const lines = 34;
      const segs = 70;
      const mid = h / 2;
      for (let i = 0; i < lines; i++) {
        const p = i / lines;
        const fade = Math.sin(p * Math.PI);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91,118,217,${fade * 0.34 * (0.5 + amp / 2)})`;
        ctx.lineWidth = 1.2;
        for (let j = 0; j <= segs; j++) {
          const x = (j / segs) * w;
          const noise = Math.sin(j * 0.16 + t + i * 0.22) * 14;
          const spike = Math.cos(j * 0.26 + t + i * 0.1) * Math.sin(j * 0.07 + t) * 34;
          const y = mid + (noise + spike) * amp * (h / 260);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
    [],
  );
  const { wrap, canvas } = useCanvasScene(draw, playing);
  return (
    <div ref={wrap} className="relative w-full h-[260px]">
      <canvas ref={canvas} className="absolute inset-0" />
      {/* the central node the lines run through */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center"
        style={{
          width: 92,
          height: 92,
          background: "radial-gradient(70% 70% at 35% 30%, #8fa8ee 0%, #5b76d9 58%, #3f56b4 100%)",
          boxShadow: "0 16px 38px -10px rgba(91,118,217,0.55), 0 0 0 10px rgba(255,255,255,0.85)",
        }}
      >
        <span className="flex items-end gap-[3px] h-5">
          {[8, 14, 20, 12, 7].map((hh, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-white/90"
              initial={{ height: hh }}
              animate={playing ? { height: [hh * 0.5, hh, hh * 0.6] } : { height: [hh, hh * 0.7, hh] }}
              transition={{ duration: playing ? 0.8 + i * 0.1 : 2.4 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}

function CanvasPanel({ kind }: { kind: "ribbons" | "lines" }) {
  const c = useCallClock();
  return (
    <DemoShell
      caption={c.playing ? "Hana is speaking" : "Hana is listening"}
      left={
        <div className="w-full flex flex-col items-center">
          {kind === "ribbons" ? <SiriRibbons playing={c.playing} /> : <SonicLines playing={c.playing} />}
          <div className="flex items-center gap-4 mt-4">
            <PlayButton playing={c.playing} onClick={c.toggle} />
            <span className="text-[14px] tabular-nums text-slate-500">
              {mmss(c.time)} / {mmss(DURATION)}
            </span>
          </div>
          <div className="mt-5 min-h-[64px] max-w-[400px] text-center">
            {c.current ? (
              <p className="text-[14.5px] leading-[1.6] text-slate-700 m-0">
                <span className={`font-bold uppercase tracking-[1.2px] text-[10.5px] mr-2 ${c.current.who === "hana" ? "text-[#5b76d9]" : "text-slate-500"}`}>
                  {c.current.who === "hana" ? "Hana" : "Patient"}
                </span>
                {c.current.text}
              </p>
            ) : (
              <p className="text-[14.5px] leading-[1.6] text-slate-500 m-0">
                Press play to hear a monthly check-in call.
              </p>
            )}
          </div>
          {c.audioEl}
        </div>
      }
    />
  );
}

export function DemoWithSiriRibbons() {
  return <CanvasPanel kind="ribbons" />;
}
export function DemoWithSonicLines() {
  return <CanvasPanel kind="lines" />;
}

/* ── 10: the SonicWaveform hero itself, with the form where the text was ───────
 * Matteo, 2026-08-20: "do this section as is, instead of the text put the form".
 * So this is the reference hero's own composition: the full-bleed canvas of
 * flowing lines, the dark gradient over it, and one block of content centred on
 * top. The only substitution is that block: instead of the badge, the display
 * headline, the paragraph and the button, it holds the live-demo form.
 *
 * Kept from the reference: the stacked-line noise-plus-spike maths, the pointer
 * influence that bends the lines toward the cursor, the translucent wash that
 * leaves a trail, the bottom-up gradient, the centred content.
 * Changed, because the reference is a Next.js full-screen page and this is a
 * section in a Vite app: the canvas sizes to this section rather than the
 * window, the pointer is tracked inside the section rather than the whole page,
 * devicePixelRatio is handled, the teal is swapped for the site's periwinkle,
 * and reduced motion gets a single frame. No framer-motion, no @/ alias, no new
 * dependencies: this project already has motion/react and relative imports.
 */
/* Matteo, 2026-08-20: he likes the section but not the blue ground. So the
   canvas and the section take a theme. "paper" is white with periwinkle lines,
   "ink" is a neutral near-black with no blue in the ground at all. */
type SonicTheme = "paper" | "ink" | "navy";

const SONIC_THEME: Record<SonicTheme, { ground: string; wash: string; line: string; alpha: number }> = {
  paper: { ground: "#ffffff", wash: "rgba(255,255,255,0.13)", line: "91,118,217", alpha: 0.30 },
  ink: { ground: "#0c0c0e", wash: "rgba(12,12,14,0.11)", line: "168,178,204", alpha: 0.38 },
  navy: { ground: "#050c1a", wash: "rgba(5,12,26,0.11)", line: "138,180,255", alpha: 0.42 },
};

function SonicHeroCanvas({ playing, theme }: { playing: boolean; theme: SonicTheme }) {
  const T = SONIC_THEME[theme];
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let time = 0;
    let amp = 0.55;
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
      ctx.fillStyle = T.ground;
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
      // the reference's translucent wash, so the lines leave a trail
      ctx.fillStyle = T.wash;
      ctx.fillRect(0, 0, w, h);

      const lineCount = 46;
      const segmentCount = 78;
      const mid = h / 2;
      amp += ((playingRef.current ? 1 : 0.62) - amp) * 0.05;

      for (let i = 0; i < lineCount; i++) {
        const p = i / lineCount;
        const intensity = Math.sin(p * Math.PI);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${T.line},${intensity * T.alpha})`;
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

      time += playingRef.current ? 0.026 : 0.014;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [T]);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" style={{ background: T.ground }}>
      <canvas ref={canvas} className="absolute inset-0" />
    </div>
  );
}

function SonicHeroForm({ theme }: { theme: SonicTheme }) {
  const c = useCallClock();
  const dark = theme !== "paper";
  const inputClass = dark
    ? "w-full bg-transparent border-0 border-b-[1.5px] border-white/25 py-2 text-white text-[17px] placeholder:text-white/35 focus:outline-none focus:border-[#8ab4ff] transition-colors"
    : "w-full bg-transparent border-0 border-b-[1.5px] border-[#dfe3ee] py-2 text-[#00122f] text-[17px] placeholder:text-[#b3bdcc] focus:outline-none focus:border-[#5b76d9] transition-colors";
  const labelClass = `block text-[12px] font-bold uppercase tracking-[2.2px] mb-3 ${dark ? "text-[#8ab4ff]" : "text-[#5b76d9]"}`;

  return (
    <section className="relative overflow-hidden">
      <SonicHeroCanvas playing={c.playing} theme={theme} />

      {/* the reference's bottom-up gradient */}
      <div
        aria-hidden
        className="absolute inset-0 z-10"
        style={{
          background: dark
            ? theme === "ink"
              ? "linear-gradient(to top, #0c0c0e 0%, rgba(12,12,14,0.55) 42%, rgba(12,12,14,0.10) 100%)"
              : "linear-gradient(to top, #050c1a 0%, rgba(5,12,26,0.55) 42%, rgba(5,12,26,0.10) 100%)"
            : "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.62) 40%, rgba(255,255,255,0.05) 100%)",
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
          <span className={`inline-flex items-center gap-2.5 rounded-full backdrop-blur-sm px-4 py-1.5 ${dark ? "bg-white/[0.10] border border-white/15" : "bg-white/70 border border-[#e2e6f4]"}`}>
            <span
              className={`w-2 h-2 rounded-full ${dark ? "bg-[#8ab4ff]" : "bg-[#5b76d9]"}`}
              style={{ animation: "hana-glow 2.4s ease-in-out infinite" }}
            />
            <span className={`text-[13px] font-medium ${dark ? "text-white/85" : "text-slate-600"}`}>
              {c.playing ? "Hana is speaking" : "Hana is listening"}
            </span>
          </span>

          <h2 className={`font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mt-7 mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
            Don't take our word for it. Take the call.
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed mb-10 ${dark ? "text-white/65" : "text-slate-500"}`}>
            Drop your number and Hana calls you right now. The agent works out the right demo as you
            talk.
          </p>
        </motion.div>

        {/* where the headline block used to sit: the form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-[560px] rounded-[24px] backdrop-blur-xl p-7 sm:p-9 ${dark ? "bg-white/[0.07] border border-white/15 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]" : "bg-white/85 border border-[#e8ebf2] shadow-[0_30px_70px_-24px_rgba(0,18,47,0.22)]"}`}
        >
          <div className="space-y-7">
            <div>
              <span className={labelClass}>Name</span>
              <input className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <span className={labelClass}>Email</span>
              <input className={inputClass} placeholder="you@company.com" />
            </div>
            <div>
              <span className={labelClass}>Phone</span>
              <div className={`mb-4 inline-flex items-center gap-1 rounded-[10px] p-1 ${dark ? "bg-white/[0.08] border border-white/15" : "bg-[#eef0f5] border border-[#e2e6f4]"}`}>
                <span className="rounded-[7px] bg-white text-[#00122f] px-3 py-1.5 text-[13px] font-semibold shadow-sm">
                  🇺🇸 US / Canada
                </span>
                <span className={`px-3 py-1.5 text-[13px] font-medium ${dark ? "text-white/60" : "text-slate-500"}`}>🇪🇺 Europe</span>
              </div>
              <input className={inputClass} placeholder="+1 555 123 4567" />
            </div>
          </div>

          <button className={`mt-9 w-full rounded-xl text-[15px] font-semibold py-4 border-0 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors ${dark ? "bg-white text-[#00122f] hover:bg-[#eef1fb]" : "bg-[#111c33] text-white hover:bg-[#00122f]"}`}>
            <Phone className="w-4 h-4" strokeWidth={2.2} />
            Text me &amp; call me
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className={`flex-1 h-px ${dark ? "bg-white/15" : "bg-[#e2e6f4]"}`} />
            <span className={`text-[11px] font-bold uppercase tracking-[1.6px] ${dark ? "text-white/45" : "text-slate-400"}`}>or</span>
            <span className={`flex-1 h-px ${dark ? "bg-white/15" : "bg-[#e2e6f4]"}`} />
          </div>

          <button className={`w-full rounded-xl text-[15px] font-semibold py-4 cursor-pointer inline-flex items-center justify-center gap-2 transition-colors ${dark ? "bg-transparent border border-white/25 text-white hover:bg-white/[0.08]" : "bg-white border border-[#e2e6f4] text-[#00122f] hover:bg-[#f6f7fb]"}`}>
            Prefer to talk now? Start a web call
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </button>

          {/* the play control, so the lines have something to react to */}
          <div className={`flex items-center justify-center gap-4 mt-7 pt-6 border-t ${dark ? "border-white/12" : "border-[#e8ebf2]"}`}>
            <button
              onClick={c.toggle}
              aria-label={c.playing ? "Pause" : "Play the call"}
              className={`shrink-0 w-11 h-11 rounded-full grid place-items-center cursor-pointer transition-colors ${dark ? "bg-white/15 border border-white/20 hover:bg-white/25" : "bg-[#00122f] hover:bg-[#111c33]"}`}
            >
              {c.playing ? (
                <Pause className="w-4 h-4 text-white" strokeWidth={2.4} />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" strokeWidth={2.4} />
              )}
            </button>
            <span className={`text-[13px] ${dark ? "text-white/60" : "text-slate-500"}`}>
              {c.current ? c.current.text.slice(0, 54) + "…" : "Hear a monthly check-in first"}
            </span>
            <span className={`text-[12.5px] tabular-nums ml-auto ${dark ? "text-white/45" : "text-slate-400"}`}>
              {mmss(c.time)} / {mmss(DURATION)}
            </span>
          </div>
          {c.audioEl}
        </motion.div>
      </div>
    </section>
  );
}

export function DemoSonicHeroForm() {
  return <SonicHeroForm theme="paper" />;
}
export function DemoSonicHeroFormInk() {
  return <SonicHeroForm theme="ink" />;
}
export function DemoSonicHeroFormNavy() {
  return <SonicHeroForm theme="navy" />;
}
