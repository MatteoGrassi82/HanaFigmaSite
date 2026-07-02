import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { HanaBloomOrb } from "../ui/hana-bloom-orb";

// ── "How it works" flow diagram ──────────────────────────────────────────────
// A cinematic, calm-and-premium reveal told in three acts, played once on scroll:
//
//   ACT 1 — INGEST (≈0–3.4s): the dim, dormant hub waits. Input cards fade in,
//     their connectors draw, then each input sends a *burst* of glowing packets
//     (a stream of calls/texts/transfers pouring in), all converging on the orb.
//   ACT 2 — ACTIVATE (≈3.4–4.6s): the streams land and the orb ignites — a
//     brightness + scale surge, two ripple rings burst outward, glow swells. A
//     held beat: nothing flows out yet. This is the central "moment".
//   ACT 3 — ACT ON IT (≈4.6–7s): outbound connectors draw, packets fire from the
//     hub into the EHR/actions, and each destination node lights up and *stays*
//     activated (locks to a brighter "done" state), reading as work completed.
//
// Techniques: packets ride their connector via CSS `offsetPath` (motion animates
// `offsetDistance` 0→100%); an SVG blur filter makes packets bleed light; line
// draw is `pathLength`. Inspiration: Magic UI's AnimatedBeam (MIT), but the motion
// is built around the reveal rather than a constant loop.
// All motion is gated behind prefers-reduced-motion.

// Compact lucide-style icon paths (24×24 viewBox) for the node icon wells.
// Duplicated from HanaContact's shared ICONS (also used by its integrations
// section) so this diagram stays self-contained without a circular import.
const ICONS = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  transfer: "M16 3h5v5 M4 20 21 3 M21 16v5h-5 M15 15l6 6 M4 4l5 5",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5 M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  alert: "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  megaphone: "M3 11l18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6",
};

const INPUT_NODES = [
  { y: 16, label: "Inbound patient calls", icon: ICONS.phone },
  { y: 88, label: "Patient texts & SMS", icon: ICONS.message },
  { y: 160, label: "Transfers from staff", icon: ICONS.transfer },
  { y: 232, label: "After-hours overflow", icon: ICONS.moon },
];

const OUTPUT_NODES = [
  { y: 16, label: "EHR write-back", icon: ICONS.database },
  { y: 88, label: "Appointment booked", icon: ICONS.calendar },
  { y: 160, label: "Staff escalation", icon: ICONS.alert },
  { y: 232, label: "Follow-up & outreach", icon: ICONS.megaphone },
];

// Connector geometry: inbound (left node → orb edge) and outbound (orb edge →
// right node). Lines run all the way to the orb (x≈430 / x≈510) so they visually
// flow into the circle instead of stopping short in empty space.
const INBOUND_PATHS = [
  "M 220,40 C 330,40 380,120 424,128",
  "M 220,112 C 340,112 380,146 420,150",
  "M 220,184 C 340,184 380,164 420,160",
  "M 220,256 C 330,256 380,190 424,182",
];
const OUTBOUND_PATHS = [
  "M 516,128 C 560,120 610,40 720,40",
  "M 520,150 C 560,146 600,112 720,112",
  "M 520,160 C 560,164 600,184 720,184",
  "M 516,182 C 560,190 610,256 720,256",
];

// Reveal timeline (seconds). Three acts: ingest → activate → act on it.
const T = {
  hub: 0.2, // hub appears (dim/dormant)
  inputs: 0.7, // input cards begin fading in
  inDraw: 1.2, // inbound lines start drawing
  inPacket: 1.9, // first wave of inbound packets leaves the inputs
  activate: 3.4, // ACT 2 — orb ignites as the streams land
  outDraw: 4.3, // outbound lines start drawing
  outPacket: 4.7, // packets fire from the hub toward the EHR/actions
  nodeHit: 5.7, // destination nodes light up and lock to "done"
};
const PACKET_DUR = 1.1; // how long a packet takes to traverse a connector
const IN_BURST = 3; // packets per input line — reads as a stream pouring in
const BURST_GAP = 0.32; // spacing between packets within one input's burst

// A node icon: the 24×24 lucide path scaled ~0.62 and centered in a 14px well.
function NodeGlyph({ cx, cy, icon }: { cx: number; cy: number; icon: string }) {
  return (
    <g transform={`translate(${cx - 7.4}, ${cy - 7.4}) scale(0.62)`}>
      <path d={icon} fill="none" stroke="#5b76d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// A polished node card: rounded white rect + periwinkle icon well + label.
// Shared by both input and output columns so the two sides feel like a pair.
function NodeCard({ x, y, label, icon }: { x: number; y: number; label: string; icon: string }) {
  return (
    <g>
      <rect x={x} y={y} width="220" height="48" rx="12" fill="#fff" stroke="#e2e6f0" strokeWidth="1" />
      <circle cx={x + 26} cy={y + 24} r="14" fill="#eef1fb" />
      <NodeGlyph cx={x + 26} cy={y + 24} icon={icon} />
      <text x={x + 52} y={y + 29} fontFamily="DM Sans, sans-serif" fontSize="13" fill="#00122F" fontWeight="500">{label}</text>
    </g>
  );
}

function FrontDeskDiagram() {
  const reduce = useReducedMotion();

  // A glowing data-packet that rides a connector path via offset-path. The bright
  // core sits inside a blurred halo (filter) so it reads as a bead of light.
  // `r` lets inbound stream-packets run a touch smaller than the outbound "actions".
  const packet = (id: string, d: string, delay: number, r = 4, dur = PACKET_DUR) => (
    <motion.circle
      key={id}
      r={r}
      fill="#5b76d9"
      filter="url(#packetGlow)"
      initial={{ offsetDistance: "0%", opacity: 0 }}
      whileInView={{
        offsetDistance: "100%",
        opacity: [0, 1, 1, 0],
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        offsetDistance: { delay, duration: dur, ease: [0.45, 0, 0.55, 1] },
        opacity: { delay, duration: dur, times: [0, 0.12, 0.82, 1] },
      }}
      style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
    />
  );

  return (
    <div className="relative">
    <motion.svg
      viewBox="0 0 940 310"
      className="w-full block"
      role="img"
      aria-label="Flow diagram: inbound patient calls, texts, staff transfers, and after-hours overflow flow into HANA Contact, which writes back to the EHR, books appointments, escalates to staff, and runs follow-up outreach."
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#5b76d9" opacity="0.7" />
        </marker>
        {/* Soft glow used by packets and the hub core — makes light bleed. */}
        <filter id="packetGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connector lines — draw inbound first, then outbound, via pathLength */}
      <g stroke="#5b76d9" strokeWidth="1.5" fill="none" opacity="0.55" markerEnd="url(#arr)">
        {INBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.55 : 0 },
              show: { pathLength: 1, opacity: 0.55 },
            }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : T.inDraw + i * 0.1 }}
          />
        ))}
        {OUTBOUND_PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0.55 : 0 },
              show: { pathLength: 1, opacity: 0.55 },
            }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : T.outDraw + i * 0.1 }}
          />
        ))}
      </g>

      {/* Traveling data-packets (skipped entirely under reduced-motion) */}
      {!reduce && (
        <>
          {/* ACT 1 — INGEST: each input fires a burst of small packets, so it reads
              as a stream of calls/texts pouring in and converging on the orb. The
              last packet of every line lands just as ACT 2 (activate) begins. */}
          {INBOUND_PATHS.map((d, i) =>
            Array.from({ length: IN_BURST }, (_, k) =>
              packet(`pin-${i}-${k}`, d, T.inPacket + i * 0.1 + k * BURST_GAP, 3, 0.95),
            ),
          )}
          {/* ACT 3 — ACT ON IT: one strong packet fires from the hub into each
              action/EHR node, slightly larger so it reads as a committed action. */}
          {OUTBOUND_PATHS.map((d, i) => packet(`pout-${i}`, d, T.outPacket + i * 0.16, 4.5))}
        </>
      )}

      {/* Input nodes — icon well + label, fade in from the left, staggered */}
      {INPUT_NODES.map((n, i) => (
        <motion.g
          key={n.label}
          variants={{
            hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -14 },
            show: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.5, delay: reduce ? 0 : T.inputs + i * 0.1 }}
        >
          <NodeCard x={0} y={n.y} label={n.label} icon={n.icon} />
        </motion.g>
      ))}

      {/* Center — just the orb (HTML overlay in the return below). The only SVG
          here is the ACT 2 activation ripple that bursts from the orb's center. */}
      {!reduce &&
        [0, 0.18, 0.36].map((off, i) => (
          <motion.circle
            key={i}
            cx="470"
            cy="155"
            fill="none"
            stroke="#5b76d9"
            strokeWidth="1.5"
            initial={{ r: 20, opacity: 0 }}
            whileInView={{ r: [20, 110], opacity: [0.4, 0] }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: T.activate + off, duration: 1.5, ease: "easeOut" }}
          />
        ))}


      {/* ACT 3 — ACT ON IT: outputs fade in from the right, then as each packet
          lands the node flares and LOCKS to a brighter "done" state (a checkmark
          replaces its icon), reading as a completed action rather than a blink. */}
      {OUTPUT_NODES.map((n, i) => {
        const hit = T.nodeHit + i * 0.16; // when this node's packet lands
        return (
          <motion.g
            key={n.label}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : 14 },
              show: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5, delay: reduce ? 0 : T.outDraw + i * 0.1 }}
          >
            {/* Base card — flares on impact, then settles to a lit periwinkle tint. */}
            <motion.rect
              x="720"
              y={n.y}
              width="220"
              height="48"
              rx="12"
              stroke="#e2e6f0"
              strokeWidth="1"
              initial={{ fill: "#ffffff" }}
              whileInView={
                reduce
                  ? { fill: "rgba(91,118,217,0.08)" }
                  : { fill: ["#ffffff", "rgba(91,118,217,0.22)", "rgba(91,118,217,0.08)"] }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit, duration: 1.0, times: [0, 0.35, 1], ease: "easeOut" }}
            />
            {/* Icon well + icon (shared look with inputs) */}
            <circle cx="746" cy={n.y + 24} r="14" fill="#eef1fb" />
            <NodeGlyph cx={746} cy={n.y + 24} icon={n.icon} />
            <text x="772" y={n.y + 29} fontFamily="DM Sans, sans-serif" fontSize="13" fill="#00122F" fontWeight="500">{n.label}</text>
            {/* Confirmation check — pops in at the right edge as the action completes */}
            <motion.g
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { delay: hit + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `926px ${n.y + 24}px`, transformBox: "fill-box" }}
            >
              <circle cx="926" cy={n.y + 24} r="7" fill="#5b76d9" />
              <path
                d={`M ${926 - 3},${n.y + 24} l 1.9,2 l 3.7,-4`}
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </motion.g>
        );
      })}
    </motion.svg>

      {/* "Talk to Hana" bloom orb — the center of the diagram (no card behind it).
          Positioned at the SVG center: cx 470/940 = 50%, cy 155/310 = 50%.
          Fades in dim during ACT 1, then ignites (brightness + scale) at ACT 2. */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "50%", translate: "-50% -50%" }}
        initial={{ opacity: 0, scale: 0.82, filter: "saturate(0.5) brightness(0.8)" }}
        whileInView={
          reduce
            ? { opacity: 1, scale: 1, filter: "saturate(1) brightness(1)" }
            : {
                opacity: [0, 0.55, 0.55, 1, 0.95],
                scale: [0.82, 0.9, 0.9, 1.06, 1],
                filter: [
                  "saturate(0.5) brightness(0.8)",
                  "saturate(0.6) brightness(0.85)",
                  "saturate(0.6) brightness(0.85)",
                  "saturate(1.15) brightness(1.15)",
                  "saturate(1) brightness(1)",
                ],
              }
        }
        viewport={{ once: true, margin: "-80px" }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: T.activate + 1.2,
                times: [0, T.hub / (T.activate + 1.2), (T.activate - 0.3) / (T.activate + 1.2), (T.activate + 0.5) / (T.activate + 1.2), 1],
                ease: "easeInOut",
              }
        }
        aria-hidden="true"
      >
        {/* HanaBloomOrb renders a fixed 300px square; scale it to fill the upper
            hub area. transform-scale keeps the center pinned to the hub core. */}
        <div
          style={{ transformOrigin: "center center" }}
          className="scale-[0.2] sm:scale-[0.34] md:scale-[0.46] lg:scale-[0.56]"
        >
          <HanaBloomOrb />
        </div>
      </motion.div>
    </div>
  );
}

// Vertical variant of the flow for phones: input chips stack above the orb,
// output chips (with "done" checks) below, joined by short connector stems.
// The wide SVG diagram is unreadable at phone scale — this replaces it under md.
function FrontDeskDiagramMobile() {
  const reduce = useReducedMotion();
  const chip = (label: string, icon: string, i: number, done = false) => (
    <motion.div
      key={label}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.08 }}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 ${
        done ? "bg-[#5b76d9]/10 border-[#dfe3ee]" : "bg-white border-[#e2e6f0]"
      }`}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eef1fb] shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#5b76d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </span>
      <span className="text-[13px] font-medium text-[#00122F] leading-tight flex-1">{label}</span>
      {done && (
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#5b76d9] shrink-0">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
    </motion.div>
  );

  const stem = (delay: number) => (
    <motion.div
      initial={{ scaleY: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: reduce ? 0 : delay }}
      style={{ transformOrigin: "top" }}
      className="w-px h-8 bg-gradient-to-b from-[#5b76d9]/20 via-[#5b76d9]/60 to-[#5b76d9]/20 my-1"
      aria-hidden="true"
    />
  );

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label="Flow: inbound patient calls, texts, staff transfers, and after-hours overflow flow into HANA Contact, which writes back to the EHR, books appointments, escalates to staff, and runs follow-up outreach."
    >
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {INPUT_NODES.map((n, i) => chip(n.label, n.icon, i))}
      </div>
      {stem(0.35)}
      <motion.div
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
        style={{ width: 132, height: 132 }}
        aria-hidden="true"
      >
        <div className="absolute scale-[0.44]" style={{ transformOrigin: "center center" }}>
          <HanaBloomOrb />
        </div>
      </motion.div>
      {stem(0.6)}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {OUTPUT_NODES.map((n, i) => chip(n.label, n.icon, i + 6, true))}
      </div>
    </div>
  );
}

// Responsive wrapper: the wide SVG diagram above md, the stacked variant below.
export function ContactFlow() {
  return (
    <>
      <div className="hidden md:block">
        <FrontDeskDiagram />
      </div>
      <div className="md:hidden">
        <FrontDeskDiagramMobile />
      </div>
    </>
  );
}
