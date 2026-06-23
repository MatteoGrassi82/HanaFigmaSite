import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getLocale } from "../../lib/i18n";

const IT = getLocale() === "it";

// ── Container-level InView (works across tab switches) ────────────────────────
function useContainerInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

// ── SVG text with word-wrap via tspan ─────────────────────────────────────────
function WrapText({
  x, y, text, maxChars, lineH, fontSize = 10, fill, fontWeight = "400", opacity = 1,
}: {
  x: number; y: number; text: string; maxChars: number; lineH: number;
  fontSize?: number; fill: string; fontWeight?: string; opacity?: number;
}) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return (
    <text fontSize={fontSize} fill={fill} fontWeight={fontWeight} opacity={opacity}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y + i * lineH}>{l}</tspan>
      ))}
    </text>
  );
}

// ── Self-drawing path ─────────────────────────────────────────────────────────
function DrawPath({ d, stroke, strokeWidth = 2, delay = 0, duration = 0.7 }: {
  d: string; stroke: string; strokeWidth?: number; delay?: number; duration?: number;
}) {
  return (
    <motion.path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration, delay, ease: "easeInOut" }, opacity: { duration: 0.05, delay } }}
    />
  );
}

// ── Dot traveling along a path ────────────────────────────────────────────────
function Dot({ d, fill, dur, begin = "0s" }: { d: string; fill: string; dur: string; begin?: string }) {
  return (
    <circle r="5" fill={fill} opacity={0.9}>
      <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={d} calcMode="linear" />
    </circle>
  );
}

// ── Shared arrowhead markers ──────────────────────────────────────────────────
function Defs() {
  return (
    <defs>
      <filter id="cardglow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="reportglow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {[
        { id: "a-slate", c: "#94a3b8" },
        { id: "a-blue",  c: "#3b82f6" },
        { id: "a-indigo",c: "#6366f1" },
        { id: "a-violet",c: "#8b5cf6" },
      ].map(({ id, c }) => (
        <marker key={id} id={id} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L9,3.5 z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGRAM 1: PATIENT JOURNEY
// Snake layout: 01–04 left→right on row 1, 05–08 right→left on row 2
// ═══════════════════════════════════════════════════════════════════════════════
const J = {
  ml: 30,      // left/right margin
  tp: 52,      // top padding (space for badge)
  cw: 188,     // card width
  ch: 108,     // card height
  gap: 48,     // gap between cards
  rowGap: 110, // vertical gap between rows
};
const jRowY = (row: 1 | 2) => J.tp + (row - 1) * (J.ch + J.rowGap);
const jCardX = (col: number) => J.ml + col * (J.cw + J.gap); // col 0-3
const jMidX = (col: number) => jCardX(col) + J.cw / 2;
const jMidY = (row: 1 | 2) => jRowY(row) + J.ch / 2;
const J_W = J.ml * 2 + 4 * J.cw + 3 * J.gap;
const J_H = J.tp + 2 * J.ch + J.rowGap + 30;

// Row 1: cards 0-3 (steps 01-04). Row 2: step 05 at col 3, 06 at col 2, 07 at col 1, 08 at col 0
const JOURNEY_CARDS_EN = [
  { num:"01", title:"Initial Contact",     desc:"10-min screening call, eligibility confirmed, intake packet sent", row:1 as const, col:0, hana:false },
  { num:"02", title:"Registration",        desc:"Family registers in Practice Q — demographics, history, insurance", row:1 as const, col:1, hana:false },
  { num:"03", title:"Assessment Dispatch", desc:"HANA auto-sends NICHQ, BASC-3, Conners 3 and BRIEF-2 packets",    row:1 as const, col:2, hana:false },
  { num:"04", title:"HANA Interview",      desc:"Parent completes 3-module voice interview — 30 to 45 min, 24/7",  row:1 as const, col:3, hana:true  },
  { num:"05", title:"Data Compilation",    desc:"HANA structures transcript and all rating scale data into a report",row:2 as const, col:3, hana:true  },
  { num:"06", title:"Report Published",    desc:"Clinician receives complete intake report in Practice Q",         row:2 as const, col:2, hana:false },
  { num:"07", title:"Clinician Review",    desc:"Clinician reviews report and flags items for deeper exploration",  row:2 as const, col:1, hana:false },
  { num:"08", title:"Diagnostic Session",  desc:"Clinician focuses entirely on interpretation — intake is complete",row:2 as const, col:0, hana:false },
];

const JOURNEY_CARDS_IT: typeof JOURNEY_CARDS_EN = [
  { num:"01", title:"Primo Contatto",        desc:"Screening di 10 min, idoneità confermata, pacchetto di accoglienza inviato", row:1 as const, col:0, hana:false },
  { num:"02", title:"Registrazione",         desc:"La famiglia si registra in Practice Q — anagrafica, anamnesi, assicurazione", row:1 as const, col:1, hana:false },
  { num:"03", title:"Invio Valutazioni",     desc:"HANA invia in automatico i pacchetti NICHQ, BASC-3, Conners 3 e BRIEF-2",   row:1 as const, col:2, hana:false },
  { num:"04", title:"Intervista HANA",       desc:"Il genitore completa l'intervista vocale a 3 moduli — 30-45 min, 24/7",     row:1 as const, col:3, hana:true  },
  { num:"05", title:"Compilazione Dati",     desc:"HANA struttura trascrizione e dati delle scale in un referto",             row:2 as const, col:3, hana:true  },
  { num:"06", title:"Referto Pubblicato",    desc:"Il clinico riceve il referto di accoglienza completo in Practice Q",       row:2 as const, col:2, hana:false },
  { num:"07", title:"Revisione Clinico",     desc:"Il clinico esamina il referto e segnala gli elementi da approfondire",     row:2 as const, col:1, hana:false },
  { num:"08", title:"Seduta Diagnostica",    desc:"Il clinico si concentra sull'interpretazione — accoglienza già completa",  row:2 as const, col:0, hana:false },
];

const JOURNEY_CARDS = IT ? JOURNEY_CARDS_IT : JOURNEY_CARDS_EN;

// Connector paths
const jPaths = [
  // Row 1 →→→
  { d:`M${jCardX(0)+J.cw+6},${jMidY(1)} L${jCardX(1)-6},${jMidY(1)}`,       stroke:"#94a3b8", marker:"a-slate", delay:0.4 },
  { d:`M${jCardX(1)+J.cw+6},${jMidY(1)} L${jCardX(2)-6},${jMidY(1)}`,       stroke:"#94a3b8", marker:"a-slate", delay:0.6 },
  { d:`M${jCardX(2)+J.cw+6},${jMidY(1)} L${jCardX(3)-6},${jMidY(1)}`,       stroke:"#94a3b8", marker:"a-slate", delay:0.8 },
  // Snake down (right side of col 3)
  { d:`M${jMidX(3)},${jRowY(1)+J.ch+6} L${jMidX(3)},${jRowY(2)-6}`,         stroke:"#3b82f6", marker:"a-blue",  delay:1.0 },
  // Row 2 ←←← (right to left)
  { d:`M${jCardX(3)-6},${jMidY(2)} L${jCardX(2)+J.cw+6},${jMidY(2)}`,       stroke:"#94a3b8", marker:"a-slate", delay:1.2 },
  { d:`M${jCardX(2)-6},${jMidY(2)} L${jCardX(1)+J.cw+6},${jMidY(2)}`,       stroke:"#94a3b8", marker:"a-slate", delay:1.4 },
  { d:`M${jCardX(1)-6},${jMidY(2)} L${jCardX(0)+J.cw+6},${jMidY(2)}`,       stroke:"#94a3b8", marker:"a-slate", delay:1.6 },
];

const jDots = [
  { d:`M${jCardX(0)+J.cw},${jMidY(1)} L${jCardX(1)},${jMidY(1)}`,           fill:"#94a3b8", dur:"1.4s", begin:"2.0s" },
  { d:`M${jCardX(1)+J.cw},${jMidY(1)} L${jCardX(2)},${jMidY(1)}`,           fill:"#94a3b8", dur:"1.4s", begin:"2.3s" },
  { d:`M${jCardX(2)+J.cw},${jMidY(1)} L${jCardX(3)},${jMidY(1)}`,           fill:"#94a3b8", dur:"1.4s", begin:"2.6s" },
  { d:`M${jMidX(3)},${jRowY(1)+J.ch} L${jMidX(3)},${jRowY(2)}`,             fill:"#3b82f6", dur:"1.0s", begin:"2.8s" },
  { d:`M${jCardX(3)},${jMidY(2)} L${jCardX(2)+J.cw},${jMidY(2)}`,           fill:"#94a3b8", dur:"1.4s", begin:"3.0s" },
  { d:`M${jCardX(2)},${jMidY(2)} L${jCardX(1)+J.cw},${jMidY(2)}`,           fill:"#94a3b8", dur:"1.4s", begin:"3.2s" },
  { d:`M${jCardX(1)},${jMidY(2)} L${jCardX(0)+J.cw},${jMidY(2)}`,           fill:"#94a3b8", dur:"1.4s", begin:"3.4s" },
];

function JourneyDiagram({ visible }: { visible: boolean }) {
  return (
    <g>
      {/* HANA badge row 1 */}
      <motion.rect x={jCardX(3)-3} y={J.tp-28} width={J.cw+6} height={22} rx={11}
        fill="#1e3a8a" initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.3 }} />
      <motion.text x={jMidX(3)} y={J.tp-13} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#93c5fd" letterSpacing="0.1em"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.4 }}>
        {IT ? "AUTOMATIZZATO DA HANA" : "HANA AUTOMATED"}
      </motion.text>
      {/* HANA badge row 2 */}
      <motion.rect x={jCardX(3)-3} y={jRowY(2)-28} width={J.cw+6} height={22} rx={11}
        fill="#1e3a8a" initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.3 }} />
      <motion.text x={jMidX(3)} y={jRowY(2)-13} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#93c5fd" letterSpacing="0.1em"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.4 }}>
        {IT ? "AUTOMATIZZATO DA HANA" : "HANA AUTOMATED"}
      </motion.text>

      {/* Cards */}
      {JOURNEY_CARDS.map((c, i) => {
        const x = jCardX(c.col);
        const y = jRowY(c.row);
        return (
          <g key={c.num}>
            <motion.rect x={x} y={y} width={J.cw} height={J.ch} rx={12}
              fill={c.hana ? "#1d4ed8" : "#1e293b"}
              stroke={c.hana ? "#3b82f6" : "#334155"}
              strokeWidth={c.hana ? 1.5 : 1}
              filter={c.hana ? "url(#cardglow)" : undefined}
              initial={{ opacity:0, scale:0.88 }}
              animate={visible ? { opacity:1, scale:1 } : {}}
              transition={{ duration:0.4, delay: i * 0.08 }}
              style={{ transformOrigin: `${x+J.cw/2}px ${y+J.ch/2}px` }}
            />
            {/* Step number */}
            <motion.text x={x+14} y={y+22} fontSize={10} fontWeight="700" letterSpacing="0.08em"
              fill={c.hana ? "#93c5fd" : "#475569"}
              initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay: i*0.08+0.18 }}>
              {c.num}
            </motion.text>
            {/* Title */}
            <motion.text x={x+14} y={y+40} fontSize={13} fontWeight="700"
              fill={c.hana ? "white" : "#f1f5f9"}
              initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay: i*0.08+0.22 }}>
              {c.title}
            </motion.text>
            {/* Divider */}
            <motion.line x1={x+14} y1={y+50} x2={x+J.cw-14} y2={y+50}
              stroke={c.hana ? "#3b82f6" : "#334155"} strokeWidth={0.8}
              initial={{ scaleX:0 }} animate={visible?{scaleX:1}:{}}
              transition={{ delay: i*0.08+0.26 }}
              style={{ transformOrigin: `${x+14}px ${y+50}px` }}
            />
            {/* Desc */}
            <motion.g initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay: i*0.08+0.3 }}>
              <WrapText x={x+14} y={y+65} text={c.desc} maxChars={22} lineH={14}
                fontSize={10} fill={c.hana ? "#bfdbfe" : "#94a3b8"} />
            </motion.g>
          </g>
        );
      })}

      {/* Paths */}
      {visible && jPaths.map((p, i) => (
        <g key={i}>
          <DrawPath d={p.d} stroke={p.stroke} strokeWidth={2} delay={p.delay} duration={0.4} />
          <motion.path d={p.d} fill="none" stroke="none"
            markerEnd={`url(#${p.marker})`} strokeWidth={2}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: p.delay+0.38 }}
          />
        </g>
      ))}

      {/* Traveling dots */}
      {visible && jDots.map((dot, i) => (
        <Dot key={i} d={dot.d} fill={dot.fill} dur={dot.dur} begin={dot.begin} />
      ))}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGRAM 2: INTERVIEW ARCHITECTURE
// Fan: trigger → 3 modules → report
// ═══════════════════════════════════════════════════════════════════════════════
const A = {
  svgW: 860,
  trigX: 300, trigY: 22, trigW: 260, trigH: 52,
  modY: 130, modW: 240, modH: 228, modGap: 40,
  repY: 418, repW: 300, repH: 62,
};
const A_H = A.repY + A.repH + 28;
const aMods_EN = [
  { x: 20,                  color:"#1d4ed8", border:"#3b82f6", label:"#93c5fd", dot:"#60a5fa", title:"Module 01", sub:"Opening & Rapport",       items:["State & Consent","Chief Complaint","Primary Goal","Symptom Diversity","Background Context"] },
  { x: 20+A.modW+A.modGap,  color:"#3730a3", border:"#6366f1", label:"#a5b4fc", dot:"#818cf8", title:"Module 02", sub:"Diagnostic Decision",      items:["Cross-Setting Review","Peer & Social","School Follow-up","Goal-Setting","Functional Impairment"] },
  { x: 20+2*(A.modW+A.modGap),color:"#4c1d95",border:"#8b5cf6",label:"#c4b5fd",dot:"#a78bfa", title:"Module 03", sub:"Developmental Context",    items:["Strengths & Resources","Motivation Patterns","Emotional Regulation","Dev. History","Hyperfocus Patterns"] },
];
const aMods_IT: typeof aMods_EN = [
  { x: 20,                  color:"#1d4ed8", border:"#3b82f6", label:"#93c5fd", dot:"#60a5fa", title:"Modulo 01", sub:"Apertura e Rapporto",      items:["Avvio e Consenso","Motivo Principale","Obiettivo Primario","Varietà dei Sintomi","Contesto e Anamnesi"] },
  { x: 20+A.modW+A.modGap,  color:"#3730a3", border:"#6366f1", label:"#a5b4fc", dot:"#818cf8", title:"Modulo 02", sub:"Decisione Diagnostica",    items:["Analisi Multi-Contesto","Pari e Socialità","Approfondimento Scuola","Definizione Obiettivi","Compromissione Funzionale"] },
  { x: 20+2*(A.modW+A.modGap),color:"#4c1d95",border:"#8b5cf6",label:"#c4b5fd",dot:"#a78bfa", title:"Modulo 03", sub:"Contesto Evolutivo",       items:["Punti di Forza e Risorse","Pattern Motivazionali","Regolazione Emotiva","Anamnesi Evolutiva","Iperfocalizzazione"] },
];
const aMods = IT ? aMods_IT : aMods_EN;
const trigCX = A.trigX + A.trigW / 2;
const repCX = (A.svgW - A.repW) / 2;
const repCXmid = repCX + A.repW / 2;

const aFanPaths = aMods.map(m => {
  const mx = m.x + A.modW / 2;
  const tBot = A.trigY + A.trigH;
  const mTop = A.modY;
  const cy = (tBot + mTop) / 2;
  return { d:`M${trigCX},${tBot+5} C${trigCX},${cy} ${mx},${cy} ${mx},${mTop-5}`, color:m.border, dot:m.dot };
});

const aConvergePaths = aMods.map(m => {
  const mx = m.x + A.modW / 2;
  const mBot = A.modY + A.modH;
  const rTop = A.repY;
  const cy = (mBot + rTop) / 2;
  return { d:`M${mx},${mBot+5} C${mx},${cy} ${repCXmid},${cy} ${repCXmid},${rTop-5}`, color:m.border, dot:m.dot };
});

function ArchDiagram({ visible }: { visible: boolean }) {
  return (
    <g>
      {/* Trigger */}
      <motion.rect x={A.trigX} y={A.trigY} width={A.trigW} height={A.trigH} rx={26}
        fill="#0f172a" stroke="#334155" strokeWidth={1.5}
        initial={{ opacity:0, scale:0.9 }} animate={visible?{opacity:1,scale:1}:{}}
        transition={{ duration:0.4 }}
        style={{ transformOrigin:`${trigCX}px ${A.trigY+A.trigH/2}px` }}
      />
      <motion.text x={trigCX} y={A.trigY+18} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#475569" letterSpacing="0.12em"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.2 }}>
        {IT ? "IL PAZIENTE CONTATTA LO STUDIO" : "PATIENT CONTACTS PRACTICE"}
      </motion.text>
      <motion.text x={trigCX} y={A.trigY+36} textAnchor="middle" fontSize={14} fontWeight="700" fill="white"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.25 }}>
        {IT ? "Intervista HANA Avviata" : "HANA Interview Initiated"}
      </motion.text>

      {/* Fan paths */}
      {visible && aFanPaths.map((p, i) => (
        <DrawPath key={i} d={p.d} stroke={p.color} strokeWidth={2} delay={0.5+i*0.12} duration={0.6} />
      ))}
      {visible && aFanPaths.map((p, i) => (
        <Dot key={i} d={p.d} fill={p.dot} dur="2.2s" begin={`${1.8+i*0.3}s`} />
      ))}

      {/* Module cards */}
      {aMods.map((m, i) => (
        <g key={m.title}>
          <motion.rect x={m.x} y={A.modY} width={A.modW} height={A.modH} rx={14}
            fill={m.color} stroke={m.border} strokeWidth={1.5}
            initial={{ opacity:0, y:18 }} animate={visible?{opacity:1,y:0}:{}}
            transition={{ duration:0.45, delay:0.6+i*0.12 }}
          />
          {/* Module label */}
          <motion.text x={m.x+16} y={A.modY+22} fontSize={9} fontWeight="700"
            fill={m.label} letterSpacing="0.1em"
            initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.7+i*0.12 }}>
            {m.title.toUpperCase()}
          </motion.text>
          {/* Subtitle */}
          <motion.text x={m.x+16} y={A.modY+40} fontSize={13} fontWeight="700" fill="white"
            initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.75+i*0.12 }}>
            {m.sub}
          </motion.text>
          {/* Divider */}
          <motion.line x1={m.x+16} y1={A.modY+52} x2={m.x+A.modW-16} y2={A.modY+52}
            stroke={m.label} strokeWidth={0.8} opacity={0.35}
            initial={{ scaleX:0 }} animate={visible?{scaleX:1}:{}}
            transition={{ delay:0.8+i*0.12 }}
            style={{ transformOrigin:`${m.x+16}px ${A.modY+52}px` }}
          />
          {/* Items */}
          {m.items.map((item, j) => (
            <g key={item}>
              <motion.circle cx={m.x+23} cy={A.modY+73+j*28} r={3}
                fill={m.label} opacity={0.5}
                initial={{ opacity:0 }} animate={visible?{opacity:0.5}:{}} transition={{ delay:0.85+i*0.1+j*0.06 }}
              />
              <motion.text x={m.x+34} y={A.modY+77+j*28} fontSize={11} fill="rgba(255,255,255,0.88)"
                initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:0.85+i*0.1+j*0.06 }}>
                {item}
              </motion.text>
            </g>
          ))}
        </g>
      ))}

      {/* Converge paths */}
      {visible && aConvergePaths.map((p, i) => (
        <DrawPath key={i} d={p.d} stroke={p.color} strokeWidth={2} delay={1.3+i*0.1} duration={0.55} />
      ))}
      {visible && aConvergePaths.map((p, i) => (
        <Dot key={i} d={p.d} fill={p.dot} dur="2.2s" begin={`${2.5+i*0.3}s`} />
      ))}

      {/* Report node */}
      <motion.rect x={repCX} y={A.repY} width={A.repW} height={A.repH} rx={14}
        fill="#0f172a" stroke="#334155" strokeWidth={1.5}
        filter="url(#reportglow)"
        initial={{ opacity:0, scale:0.9 }} animate={visible?{opacity:1,scale:1}:{}}
        transition={{ duration:0.4, delay:1.8 }}
        style={{ transformOrigin:`${repCXmid}px ${A.repY+A.repH/2}px` }}
      />
      <motion.text x={repCXmid} y={A.repY+20} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#475569" letterSpacing="0.12em"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:2.0 }}>
        {IT ? "OUTPUT" : "OUTPUT"}
      </motion.text>
      <motion.text x={repCXmid} y={A.repY+38} textAnchor="middle" fontSize={14} fontWeight="700" fill="white"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:2.05 }}>
        {IT ? "Referto Clinico Strutturato" : "Structured Clinical Report"}
      </motion.text>
      <motion.text x={repCXmid} y={A.repY+55} textAnchor="middle" fontSize={10} fill="#64748b"
        initial={{ opacity:0 }} animate={visible?{opacity:1}:{}} transition={{ delay:2.1 }}>
        {IT ? "Consegnato in Practice Q prima dell'appuntamento" : "Delivered to Practice Q before appointment"}
      </motion.text>
      {/* Pulse ring */}
      {visible && (
        <motion.rect x={repCX-6} y={A.repY-6} width={A.repW+12} height={A.repH+12} rx={18}
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
          animate={{ opacity:[0, 0.6, 0] }}
          transition={{ duration:2, repeat:Infinity, delay:2.4 }}
        />
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function WhitepaperFlows() {
  const [tab, setTab] = useState<"journey" | "modules">("journey");
  const [containerRef, visible] = useContainerInView();

  return (
    <div ref={containerRef}>
      {/* Tab switcher */}
      <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit mb-5 shadow-sm">
        {(["journey", "modules"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-800"
            }`}>
            {t === "journey"
              ? (IT ? "Percorso del Paziente" : "Patient Journey")
              : (IT ? "Architettura dell'Intervista" : "Interview Architecture")}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}>
          <div className="rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden shadow-lg">
            {tab === "journey" ? (
              <svg viewBox={`0 0 ${J_W} ${J_H}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
                <Defs />
                <rect width="100%" height="100%" fill="#0f172a" />
                {/* Subtle grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40,0 L0,0 L0,40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <JourneyDiagram visible={visible} />
              </svg>
            ) : (
              <svg viewBox={`0 0 ${A.svgW} ${A_H}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
                <Defs />
                <rect width="100%" height="100%" fill="#0f172a" />
                <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40,0 L0,0 L0,40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid2)" />
                <ArchDiagram visible={visible} />
              </svg>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
