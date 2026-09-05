import { useRef } from "react";
import { type Variants } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { TimelineContent } from "../ui/timeline-animation";

/* ── Proof bento — ported from the ShipTime "ClientFeedback" layout (two
   clusters, placements matched to the Federato reference) and re-skinned to
   HANA. Repainted 2026-09-05 into Newsprint Ultramarine: warm dark tiles,
   band-tinted quote cards, near-neutral warm duotone portraits, cream geometric
   decor. Ultramarine is spent three times in the view and nowhere else: the
   headline, the gauge arc, the case-studies arrow. Content is illustrative;
   portraits and "video" thumbnails use the local /avatars photos. ── */

/* Newsprint Ultramarine, as literal hex with the token name beside it. This is
   artwork, so the values have to hold up outside the page's CSS scope. */
const DECOR = "#E0DBD0";                    /* band: the geometric shapes on navy */
const DECOR_2 = "#FDFCFA";                  /* paper-bright: the shape overlapping it */
const FAINT = "rgba(253,252,250,0.45)";     /* paper-bright: hairlines on navy */
const WHITE_DIM = "rgba(253,252,250,0.72)"; /* paper-bright: secondary type on navy */
const SUF_DARK = "rgba(253,252,250,0.55)";  /* paper-bright: the unit after a stat */
const INK = "#16130F";                      /* ink */
const SUB = "#4A4239";                      /* ink-soft */
const MUTE = "#6F6659";                     /* ink-mute: labels only */
const BRAND_SOFT = "#A9B4FF";               /* brand-soft: the accent on a dark ground */
const DUOTONE_PLATE = "#353029";            /* navy-soft: the silhouette fallback */
const DUOTONE_TINT = "#6F6659";             /* ink-mute: a near-neutral warm duotone */

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

/* ── decorative geometric motifs (two warm steps, on navy). These fill
   rectangles, they do not signal anything, so they take the paper ramp and not
   the accent. ── */
function GeoDecor({ variant }: { variant: "bar" | "squares" | "circle" | "rects" }) {
  const dash = { stroke: FAINT, strokeWidth: 1.3, strokeDasharray: "2 6", fill: "none" as const };
  if (variant === "bar")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <rect x="10" y="8" width="15" height="72" rx="4" fill={DECOR} />
        <line x1="25" y1="40" x2="140" y2="40" {...dash} />
        <circle cx="140" cy="40" r="4" fill={DECOR} />
        <rect x="120" y="6" width="44" height="70" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      </svg>
    );
  if (variant === "squares")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <path d="M60 78 L150 10" {...dash} />
        <rect x="104" y="8" width="52" height="52" rx="7" fill={DECOR} />
        <rect x="74" y="34" width="38" height="38" rx="6" fill={DECOR_2} />
        <circle cx="150" cy="10" r="4" fill={DECOR} />
      </svg>
    );
  if (variant === "circle")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle cx="52" cy="44" r="34" fill={DECOR} />
        <circle cx="66" cy="44" r="20" fill={DECOR_2} />
        <circle cx="18" cy="70" r="3.5" fill={DECOR} />
        <circle cx="18" cy="18" r="3.5" fill={DECOR} />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x="30" y="6" width="120" height="74" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      <rect x="108" y="12" width="30" height="62" rx="5" fill={DECOR} />
      <rect x="86" y="24" width="26" height="50" rx="4" fill={DECOR_2} />
      <line x1="40" y1="68" x2="150" y2="10" {...dash} />
      <circle cx="150" cy="10" r="4" fill={DECOR} />
    </svg>
  );
}

function Gauge() {
  return (
    <svg viewBox="0 0 120 120" width="84" height="84" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="none" stroke={FAINT} strokeWidth="1.4" />
      {/* the filled arc is a progress reading, so it is what gets the accent */}
      <path d="M60 14 A46 46 0 0 1 88 26" fill="none" stroke={BRAND_SOFT} strokeWidth="7" strokeLinecap="round" />
      <circle cx="60" cy="14" r="3.5" fill={BRAND_SOFT} />
      <circle cx="60" cy="60" r="34" fill="none" stroke={FAINT} strokeWidth="1.2" strokeDasharray="1.5 5" />
      <circle cx="30" cy="72" r="3" fill={DECOR} />
    </svg>
  );
}

function Stat({ v, suf, label, soft = false }: { v: string; suf: string; label: React.ReactNode; soft?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-serif text-5xl leading-none md:text-6xl ${soft ? "text-navy" : "text-[#FDFCFA]"}`}>{v}</span>
        <span className="font-serif text-3xl" style={{ color: soft ? MUTE : SUF_DARK }}>{suf}</span>
      </div>
      <p className="mt-2 text-sm leading-snug" style={{ color: soft ? SUB : WHITE_DIM }}>{label}</p>
    </div>
  );
}

/* A quote tile with `img: null` renders no portrait at all. Before, a null src
   still drew the empty navy plate, which read as a missing image. */
function Duotone({ src }: { src: string | null }) {
  if (!src) return null;
  return (
    <div className="relative h-[116px] w-[100px] shrink-0 overflow-hidden rounded-xl bg-[#141210]">
      {src ? (
        <>
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "grayscale(0.9)" }}
          />
          {/* A saturated warm tint turns skin sickly, so the photograph goes
              nearly monochrome and takes a low-chroma warm cast on top of that:
              newsprint halftone rather than sepia. */}
          <div className="absolute inset-0" style={{ background: DUOTONE_TINT, mixBlendMode: "color", opacity: 0.35 }} />
        </>
      ) : (
        <svg viewBox="0 0 80 92" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="40" cy="34" r="17" fill={DUOTONE_PLATE} />
          <path d="M10 92 C10 66 24 55 40 55 C56 55 70 66 70 92 Z" fill={DUOTONE_PLATE} />
        </svg>
      )}
    </div>
  );
}

type Tile =
  | { k: "statDecor"; span: string; bg: string; decor: "bar" | "squares" | "circle" | "rects"; v: string; suf: string; label: React.ReactNode }
  | { k: "gauge"; span: string; bg: string; v: string; suf: string; label: React.ReactNode }
  | { k: "video"; span: string; caption: string; img: string; pos?: string }
  | { k: "quote"; span: string; company: string; quote: string; name: string; role: string; img: string | null }
  | { k: "quoteMini"; span: string; quote: string }
  | { k: "cta"; span: string; text: string; to: string; img: string; pos?: string }
  | { k: "label"; span: string; text: string }
  | { k: "empty"; span: string };

const NAVY = "bg-[#141210]";   /* navy */
const NAVY2 = "bg-[#353029]";  /* navy-soft: the second step of the checkerboard */

const TILES: Tile[] = [
  // ── cluster 1 ──
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "bar", v: "90", suf: "%", label: <>fewer missed<br />patient calls</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Dr. G. Oprandi · Orthopedic Surgeon", img: AV.oprandi },
  { k: "quote", span: "col-span-1 sm:col-span-2 lg:col-span-6 lg:row-span-2", company: "Monitoring", name: "Archie Defillo, MD", role: "Neuroscience & Sleep/Behavioral Health Innovator", img: AV.archie,
    quote: "Designed for both Remote Patient Monitoring (RPM) and Remote Therapeutic Monitoring (RTM) programs, enabling scalable, intelligent patient engagement while improving adherence, streamlining clinical operations, and lowering the cost of care." },
  { k: "quoteMini", span: "col-span-1 lg:col-span-3",
    quote: "Getting elderly patients ready for surgery over the phone is nearly impossible. HANA reaches them, walks them through everything, and flags whoever still isn't ready so we can step in." },
  { k: "gauge", span: "col-span-1 lg:col-span-3", bg: NAVY2, v: "89", suf: "%", label: <>less time to<br />respond</> },
  // ── cluster 2 ──
  { k: "quote", span: "col-span-1 sm:col-span-2 lg:col-span-6 lg:row-span-2", company: "Care Coordination", name: "Fakhrudin Mohamed, MD", role: "Board-Certified Physician", img: AV.fakhrudin,
    // Trimmed with an ellipsis from the approved quote — the elided clause read as
    // though HANA generates the billable touch time. See the guardrail note at the
    // top of pages/HanaRemote.tsx.
    quote: "Hana … captures the conversation in structured notes that go straight into the chart, and flags anyone who needs a same-day callback." },
  { k: "cta", span: "col-span-1 lg:col-span-3", text: "See all case studies", to: "/case-studies", img: AV.hospital },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "squares", v: "3", suf: "x", label: <>more slots<br />filled</> },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "squares", v: "30", suf: "%", label: <>fewer<br />no-shows</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Lorri Hanes · Shoorah", img: AV.lorri },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "circle", v: "2", suf: "x", label: <>the volume,<br />same headcount</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Katie Murphy Psy.D. · Founder of Penry", img: AV.katie },
  { k: "quoteMini", span: "col-span-1 lg:col-span-3",
    quote: "The Hana team understood that quality assessments require both consistency and flexibility. Their Voice AI conducts standardized screening tools, adapts questions based on patient responses, and captures 340% more clinical data while maintaining protocol validity." },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "rects", v: "11", suf: "%", label: <>higher show<br />rate</> },
];

/* `soft` mode (used on /remote-v2): the same bento structure, but the stat tiles
   swap the navy checkerboard for soft gradients and drop the geometric decor, so
   each tile carries one number and nothing else. Default stays the navy look, so
   the homepage is unaffected. */
/* Three steps of the paper ramp instead of three hues, so the depth is stock and
   not colour: paper-bright / paper / paper-2 / band / rule-soft. */
const SOFT_TILES = [
  "bg-gradient-to-br from-[#FDFCFA] via-[#FAF8F4] to-[#F0EDE6] border border-rule/70",
  "bg-gradient-to-br from-[#FAF8F4] via-[#F0EDE6] to-[#E0DBD0] border border-rule/70",
  "bg-gradient-to-br from-[#FDFCFA] via-[#F0EDE6] to-[#D9D3C7] border border-rule/70",
];

/* `compact` (used on /remote-v2): drops the final row of four tiles (2×, Katie's
   portrait, the 340% quote, 11% show rate) and moves Katie's portrait up into
   the photo slot that held Lorri Hanes, so the grid ends on the two-quote
   cluster and Katie still appears once. Home keeps the full 14-tile grid. */
/* Matteo 2026-08-20, on top of that: no portraits on the two quote cards (Archie
   and Fakhrudin), one fewer percentage tile, and the two photographs that stay
   are Oprandi and Katie. Dropping "3x more slots filled" is also what keeps the
   grid full: Katie's photo widens to six columns and closes the last row, so
   there is no hole where the stat used to be. */
const NARROW = "col-span-1 lg:col-span-3";
const WIDE = "col-span-1 sm:col-span-2 lg:col-span-6";

const COMPACT_TILES: Tile[] = (() => {
  const t: Tile[] = TILES.slice(0, -4)
    .filter((x) => !(x.k === "statDecor" && x.v === "3"))
    .map((x) => (x.k === "quote" ? { ...x, img: null } : x));

  /* Matteo 2026-08-20: swap the two photographic tiles. Katie moves into the
     narrow slot the case-studies card had, and the case-studies card drops to
     the wide slot at the bottom, where it gets the bigger button. `pos` pulls
     both crops upward so nobody is cut off at the forehead. */
  const iKatie = t.findIndex((x) => x.k === "video" && x.caption.startsWith("Lorri"));
  const iCta = t.findIndex((x) => x.k === "cta");
  const katie = t[iKatie] as Extract<Tile, { k: "video" }>;
  const cta = t[iCta] as Extract<Tile, { k: "cta" }>;

  t[iCta] = {
    ...katie,
    caption: "Katie Murphy Psy.D. · Founder of Penry",
    img: AV.katie,
    span: NARROW,
    pos: "50% 22%",
  };
  t[iKatie] = { ...cta, span: WIDE, pos: "50% 38%" };

  /* Oprandi sits in the top row and was cropped at the hairline. */
  const iOprandi = t.findIndex((x) => x.k === "video" && x.caption.startsWith("Dr. G. Oprandi"));
  if (iOprandi >= 0)
    t[iOprandi] = { ...(t[iOprandi] as Extract<Tile, { k: "video" }>), pos: "50% 22%" };

  return t;
})();

function Cell({ t, i, timelineRef, soft = false }: { t: Tile; i: number; timelineRef: React.RefObject<HTMLElement | null>; soft?: boolean }) {
  const tc = (cls: string) => ({ animationNum: i, customVariants: revealVariants, timelineRef, className: `overflow-hidden rounded-2xl ${cls}` });
  const tileBg = (orig: string) => (soft ? SOFT_TILES[i % SOFT_TILES.length] : orig);

  if (t.k === "statDecor")
    return (
      <TimelineContent {...tc(`${t.span} ${tileBg(t.bg)} flex flex-col p-6`)}>
        <div className="min-h-0 flex-1">{!soft && <GeoDecor variant={t.decor} />}</div>
        <Stat v={t.v} suf={t.suf} label={t.label} soft={soft} />
      </TimelineContent>
    );
  if (t.k === "gauge")
    return (
      <TimelineContent {...tc(`${t.span} ${tileBg(t.bg)} flex flex-col justify-between p-6`)}>
        {soft ? <span /> : <Gauge />}
        <Stat v={t.v} suf={t.suf} label={t.label} soft={soft} />
      </TimelineContent>
    );
  if (t.k === "video")
    return (
      <TimelineContent {...tc(`${t.span} relative`)}>
        {/* `pos` moves the crop focus so a portrait is not beheaded by object-cover */}
        <img
          src={t.img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={t.pos ? { objectPosition: t.pos } : undefined}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#141210]/60 to-transparent" />
        <span className="absolute bottom-5 left-5 text-sm font-medium text-[#FDFCFA]">{t.caption}</span>
      </TimelineContent>
    );
  if (t.k === "quote")
    return (
      <TimelineContent {...tc(`${t.span} flex flex-col justify-between p-8 bg-[#E0DBD0]`)}>
        <div className="flex items-center gap-4">
          <Duotone src={t.img} />
          <div>
            <div className="font-serif text-2xl leading-tight" style={{ color: INK }}>{t.name}</div>
            <div className="text-[13px]" style={{ color: SUB }}>{t.role}</div>
          </div>
        </div>
        <p className="mt-6 flex-1 text-[19px] leading-relaxed md:text-xl" style={{ color: INK }}>&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-6 inline-flex w-fit items-center rounded-full bg-paper-bright px-3 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: MUTE }}>
          {t.company}
        </div>
      </TimelineContent>
    );
  if (t.k === "quoteMini")
    return (
      <TimelineContent {...tc(`${t.span} flex flex-col justify-center p-6 bg-[#E0DBD0]`)}>
        <p className="text-[15px] leading-relaxed" style={{ color: INK }}>&ldquo;{t.quote}&rdquo;</p>
      </TimelineContent>
    );
  if (t.k === "cta") {
    /* A wide cta tile gets a bigger button: at six columns the small pill looks
       lost in the corner. Home's cta is three columns and keeps the small one. */
    const wide = t.span.includes("lg:col-span-6");
    return (
      <TimelineContent {...tc(`${t.span} relative`)}>
        <img
          src={t.img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={t.pos ? { objectPosition: t.pos } : undefined}
        />
        <Link
          to={t.to}
          className={`group absolute inline-flex items-center rounded-full bg-paper-bright font-medium shadow-md transition-colors hover:bg-[#ECEDFB] ${
            wide ? "bottom-7 left-7 gap-2.5 px-6 py-3.5 text-base" : "bottom-5 left-5 gap-2 px-4 py-2 text-sm"
          }`}
          style={{ color: INK }}
        >
          {t.text}
          {/* the third and last ultramarine in the view */}
          <ArrowRight className={`text-[#2536E6] transition-transform group-hover:translate-x-0.5 ${wide ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
        </Link>
      </TimelineContent>
    );
  }
  if (t.k === "label")
    return (
      <TimelineContent {...tc(`${t.span} ${tileBg(NAVY)} flex items-center p-6`)}>
        <span className={`font-sans text-5xl font-bold uppercase tracking-tight md:text-6xl ${soft ? "text-ink" : "text-[#FDFCFA]"}`}>{t.text}</span>
      </TimelineContent>
    );
  return <TimelineContent {...tc(`${t.span} ${tileBg(NAVY)}`)}><span /></TimelineContent>;
}

export function ProofBento({ soft = false, compact = false }: { soft?: boolean; compact?: boolean } = {}) {
  const tiles = compact ? COMPACT_TILES : TILES;
  const timelineRef = useRef<HTMLDivElement>(null);
  const tc = (n: number, cls: string, as: "h2" | "p") => ({ animationNum: n, customVariants: revealVariants, timelineRef, className: cls, as });
  return (
    <section ref={timelineRef} className="w-full bg-paper-bright py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <TimelineContent {...tc(0, "font-serif text-4xl text-ink md:text-5xl", "h2")}>
            Proven by the teams running care <span className="italic text-[#2536E6]">at scale</span>
          </TimelineContent>
          <TimelineContent {...tc(1, "mx-auto text-lg leading-relaxed text-ink-soft", "p")}>
            Real outcomes, in the words of the operators and clinicians running HANA.
          </TimelineContent>
        </div>

        <div className="grid grid-cols-1 gap-3 auto-rows-[minmax(180px,auto)] sm:grid-cols-2 sm:auto-rows-[minmax(215px,1fr)] lg:grid-cols-12">
          {tiles.map((t, i) => (
            <Cell key={i} t={t} i={i} timelineRef={timelineRef} soft={soft} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProofBento;
