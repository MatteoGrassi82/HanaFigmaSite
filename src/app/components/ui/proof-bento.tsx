import { useRef } from "react";
import { type Variants } from "motion/react";
import { TimelineContent } from "./timeline-animation";

/* ── Proof bento — ported from the ShipTime "ClientFeedback" layout (two
   clusters, placements matched to the Federato reference) and re-skinned to
   HANA: navy tiles, BLUE accents, soft-blue quote cards, blue duotone
   portraits, blue/cream geometric decor. Content is illustrative; portraits and
   "video" thumbnails use the local /avatars photos. ── */

const ACCENT = "#6ea8fe";
const CREAM = "#e8eefb";
const FAINT = "rgba(255,255,255,0.45)";
const WHITE_DIM = "rgba(255,255,255,0.72)";
const INK = "#0f2748";
const SUB = "#5a6b82";
const DUOTONE = "#1c4e93";

const AV = {
  jonathan: "/avatars/jonathan.jpg",
  oprandi: "/avatars/oprandi.webp",
  fakhrudin: "/avatars/fakhrudin.png",
  lorri: "/avatars/lorrish.png",
  katie: "https://assets.headway.co/provider_photos/129044/66574eca-82d2-11f0-bc93-0a58a9feac02-129044-1756250061589.jpeg",
  archie: "https://i1.rgstatic.net/ii/profile.image/272173122191393-1441902537961_Q512/Archie-Defillo.jpg",
  hospital: "/avatars/hopsital.png",
};

const revealVariants: Variants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: (i % 6) * 0.06, duration: 0.5 },
  }),
  hidden: { filter: "blur(10px)", y: -18, opacity: 0 },
};

/* ── decorative geometric motifs (blue + cream, on navy) ── */
function GeoDecor({ variant }: { variant: "bar" | "squares" | "circle" | "rects" }) {
  const dash = { stroke: FAINT, strokeWidth: 1.3, strokeDasharray: "2 6", fill: "none" as const };
  if (variant === "bar")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <rect x="10" y="8" width="15" height="72" rx="4" fill={ACCENT} />
        <line x1="25" y1="40" x2="140" y2="40" {...dash} />
        <circle cx="140" cy="40" r="4" fill={ACCENT} />
        <rect x="120" y="6" width="44" height="70" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      </svg>
    );
  if (variant === "squares")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <path d="M60 78 L150 10" {...dash} />
        <rect x="104" y="8" width="52" height="52" rx="7" fill={ACCENT} />
        <rect x="74" y="34" width="38" height="38" rx="6" fill={CREAM} />
        <circle cx="150" cy="10" r="4" fill={ACCENT} />
      </svg>
    );
  if (variant === "circle")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle cx="52" cy="44" r="34" fill={ACCENT} />
        <circle cx="66" cy="44" r="20" fill={CREAM} />
        <circle cx="18" cy="70" r="3.5" fill={ACCENT} />
        <circle cx="18" cy="18" r="3.5" fill={ACCENT} />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x="30" y="6" width="120" height="74" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      <rect x="108" y="12" width="30" height="62" rx="5" fill={ACCENT} />
      <rect x="86" y="24" width="26" height="50" rx="4" fill={CREAM} />
      <line x1="40" y1="68" x2="150" y2="10" {...dash} />
      <circle cx="150" cy="10" r="4" fill={ACCENT} />
    </svg>
  );
}

function Gauge() {
  return (
    <svg viewBox="0 0 120 120" width="84" height="84" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="none" stroke={FAINT} strokeWidth="1.4" />
      <path d="M60 14 A46 46 0 0 1 88 26" fill="none" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" />
      <circle cx="60" cy="14" r="3.5" fill={ACCENT} />
      <circle cx="60" cy="60" r="34" fill="none" stroke={FAINT} strokeWidth="1.2" strokeDasharray="1.5 5" />
      <circle cx="30" cy="72" r="3" fill={ACCENT} />
    </svg>
  );
}

function Stat({ v, suf, label }: { v: string; suf: string; label: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-5xl leading-none text-white md:text-6xl">{v}</span>
        <span className="font-serif text-3xl" style={{ color: ACCENT }}>{suf}</span>
      </div>
      <p className="mt-2 text-sm leading-snug" style={{ color: WHITE_DIM }}>{label}</p>
    </div>
  );
}

function Duotone({ src }: { src: string | null }) {
  return (
    <div className="relative h-[116px] w-[100px] shrink-0 overflow-hidden rounded-xl bg-[#0f2b56]">
      {src ? (
        <>
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "grayscale(0.55)" }}
          />
          <div className="absolute inset-0" style={{ background: "#6ea8fe", mixBlendMode: "color", opacity: 0.5 }} />
        </>
      ) : (
        <svg viewBox="0 0 80 92" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="40" cy="34" r="17" fill="#123a6e" />
          <path d="M10 92 C10 66 24 55 40 55 C56 55 70 66 70 92 Z" fill="#123a6e" />
        </svg>
      )}
    </div>
  );
}

type Tile =
  | { k: "statDecor"; span: string; bg: string; decor: "bar" | "squares" | "circle" | "rects"; v: string; suf: string; label: React.ReactNode }
  | { k: "gauge"; span: string; bg: string; v: string; suf: string; label: React.ReactNode }
  | { k: "video"; span: string; caption: string; img: string }
  | { k: "quote"; span: string; company: string; quote: string; name: string; role: string; img: string | null }
  | { k: "label"; span: string; text: string }
  | { k: "empty"; span: string };

const NAVY = "bg-[#0f2b56]";
const NAVY2 = "bg-[#0a2143]";

const TILES: Tile[] = [
  // ── cluster 1 ──
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "bar", v: "90", suf: "%", label: <>fewer missed<br />patient calls</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Customer story", img: AV.hospital },
  { k: "quote", span: "col-span-2 lg:col-span-6 lg:row-span-2", company: "Perioperative Services", name: "Dr. Archie DeFillo", role: "Director of Surgical Prep", img: AV.archie,
    quote: "Designed for both Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) programs, HanaSleep enables scalable, intelligent patient engagement while improving adherence, streamlining clinical operations, and lowering the cost of care." },
  { k: "label", span: "col-span-1 lg:col-span-3", text: "Results" },
  { k: "gauge", span: "col-span-1 lg:col-span-3", bg: NAVY2, v: "89", suf: "%", label: <>less time to<br />respond</> },
  // ── cluster 2 ──
  { k: "quote", span: "col-span-2 lg:col-span-6 lg:row-span-2", company: "Care Coordination", name: "Dana Alvarez, RN", role: "Care Coordination Lead", img: AV.fakhrudin,
    quote: "Their Voice AI conducts standardized screening tools, adapts questions based on patient responses, and captures 340% more clinical data while maintaining protocol validity." },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Inside the platform", img: AV.oprandi },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "squares", v: "3", suf: "x", label: <>more slots<br />filled</> },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "squares", v: "30", suf: "%", label: <>fewer<br />no-shows</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "A clinician's take", img: AV.lorri },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "circle", v: "2", suf: "x", label: <>the volume,<br />same headcount</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Behind the front desk", img: AV.katie },
  { k: "empty", span: "col-span-1 lg:col-span-3" },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "rects", v: "11", suf: "%", label: <>higher show<br />rate</> },
];

function Cell({ t, i, timelineRef }: { t: Tile; i: number; timelineRef: React.RefObject<HTMLElement | null> }) {
  const tc = (cls: string) => ({ animationNum: i, customVariants: revealVariants, timelineRef, className: `overflow-hidden rounded-2xl ${cls}` });

  if (t.k === "statDecor")
    return (
      <TimelineContent {...tc(`${t.span} ${t.bg} flex flex-col p-6`)}>
        <div className="min-h-0 flex-1"><GeoDecor variant={t.decor} /></div>
        <Stat v={t.v} suf={t.suf} label={t.label} />
      </TimelineContent>
    );
  if (t.k === "gauge")
    return (
      <TimelineContent {...tc(`${t.span} ${t.bg} flex flex-col justify-between p-6`)}>
        <Gauge />
        <Stat v={t.v} suf={t.suf} label={t.label} />
      </TimelineContent>
    );
  if (t.k === "video")
    return (
      <TimelineContent {...tc(`${t.span} relative`)}>
        <img src={t.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute bottom-5 left-5 text-sm font-medium text-white">{t.caption}</span>
      </TimelineContent>
    );
  if (t.k === "quote")
    return (
      <TimelineContent {...tc(`${t.span} flex flex-col justify-between p-8 bg-[#eef4fc]`)}>
        <div>
          <div className="font-serif text-2xl leading-none" style={{ color: INK }}>{t.company}</div>
          <p className="mt-7 text-[17px] leading-relaxed md:text-lg" style={{ color: INK }}>&ldquo;{t.quote}&rdquo;</p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Duotone src={t.img} />
          <div>
            <div className="text-sm font-semibold" style={{ color: INK }}>{t.name}</div>
            <div className="text-[13px]" style={{ color: SUB }}>{t.role}</div>
          </div>
        </div>
      </TimelineContent>
    );
  if (t.k === "label")
    return (
      <TimelineContent {...tc(`${t.span} ${NAVY} flex items-center p-6`)}>
        <span className="font-sans text-5xl font-bold uppercase tracking-tight text-white md:text-6xl">{t.text}</span>
      </TimelineContent>
    );
  return <TimelineContent {...tc(`${t.span} ${NAVY}`)}><span /></TimelineContent>;
}

export function ProofBento() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tc = (n: number, cls: string, as: "h2" | "p") => ({ animationNum: n, customVariants: revealVariants, timelineRef, className: cls, as });
  return (
    <section ref={timelineRef} className="w-full bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <TimelineContent {...tc(0, "font-serif text-4xl text-slate-900 md:text-5xl", "h2")}>
            Proven by the teams running care <span className="italic text-blue-600">at scale</span>
          </TimelineContent>
          <TimelineContent {...tc(1, "mx-auto text-lg leading-relaxed text-slate-600", "p")}>
            Real outcomes, in the words of the operators and clinicians running HANA.
          </TimelineContent>
        </div>

        <div className="grid grid-cols-2 gap-3 auto-rows-[minmax(215px,1fr)] lg:grid-cols-12">
          {TILES.map((t, i) => (
            <Cell key={i} t={t} i={i} timelineRef={timelineRef} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProofBento;
