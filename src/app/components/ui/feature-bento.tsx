import React from "react";
import {
  ArrowRight,
  Mic,
  MessageSquare,
  Cpu,
  Activity,
  ShieldCheck,
  PhoneForwarded,
  LayoutDashboard,
  Check,
} from "lucide-react";

/**
 * HANA feature bento — "hybrid Next.js" aesthetic, dialed up.
 *
 * No brand hero tile. The multilingual card is the tall showpiece on the left —
 * a globe orbited by two counter-rotating rings of country flags — with the
 * remaining feature tiles clustered to the right in a 2×2.
 *
 * Warmed for a clinical brand (soft-blue glow, light accents) rather than the
 * cold grayscale of a developer tool. Illustrative numbers are tagged as such.
 * Self-contained: SVG/CSS/lucide + emoji flags, so it prerenders identically.
 */
export function FeatureBento() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 overflow-hidden bg-white text-slate-900">
      {/* faint top glow */}
      <div className="absolute top-[-160px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* modest header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-[12.5px] font-medium tracking-[0.09em] uppercase text-blue-700 mb-4">
            <span className="w-5 h-px bg-blue-700/40" />
            Built for healthcare
            <span className="w-5 h-px bg-blue-700/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.1] text-slate-900">
            Everything your front desk can&rsquo;t get to
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
          <LanguageCard />
          <InfraCard />
          <ObservabilityCard />
          <DashboardCard />
          <WhiteGloveCard />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared shell                                                        */
/* ------------------------------------------------------------------ */

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "relative rounded-[26px] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/40 " +
        "shadow-[0_2px_14px_-6px_rgba(15,23,42,0.10)] overflow-hidden " +
        className
      }
    >
      {children}
    </div>
  );
}

function PoweredPill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-500">
      {icon}
      {children}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5">
      {children}
    </span>
  );
}

function FeatureTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[19px] sm:text-[21px] font-semibold text-slate-900 leading-snug">
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Speaks every language (tall showpiece: flag marquee wall)      */
/* ------------------------------------------------------------------ */

type Lang = { flag: string; name: string };

// US-relevant patient languages, paired with a representative flag. Split into
// rows that scroll in alternating directions (the site's marquee motion).
const LANG_ROW_1: Lang[] = [
  { flag: "🇺🇸", name: "English" },
  { flag: "🇲🇽", name: "Español" },
  { flag: "🇨🇳", name: "中文" },
  { flag: "🇻🇳", name: "Tiếng Việt" },
  { flag: "🇰🇷", name: "한국어" },
  { flag: "🇸🇦", name: "العربية" },
];
const LANG_ROW_2: Lang[] = [
  { flag: "🇵🇭", name: "Tagalog" },
  { flag: "🇧🇷", name: "Português" },
  { flag: "🇫🇷", name: "Français" },
  { flag: "🇷🇺", name: "Русский" },
  { flag: "🇮🇹", name: "Italiano" },
  { flag: "🇮🇳", name: "हिन्दी" },
];

function FlagChip({ flag, name }: Lang) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-[0_1px_4px_-1px_rgba(15,23,42,0.10)] px-3 py-1.5 text-[13px] font-medium text-slate-700 shrink-0 whitespace-nowrap">
      <span className="text-[15px] leading-none" aria-hidden="true">
        {flag}
      </span>
      {name}
    </span>
  );
}

function FlagMarquee({
  items,
  duration,
  reverse = false,
}: {
  items: Lang[];
  duration: string;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <div
        className="flag-mq-track flex w-max items-center gap-2.5"
        style={{ animation: `${reverse ? "flag-mq-rev" : "flag-mq"} ${duration} linear infinite` }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
      >
        {doubled.map((f, i) => (
          <FlagChip key={i} flag={f.flag} name={f.name} />
        ))}
      </div>
    </div>
  );
}

function LanguageCard() {
  return (
    <Card className="lg:row-span-2 flex flex-col p-7 sm:p-8">
      <style>{`
        @keyframes flag-mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes flag-mq-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { .flag-mq-track { animation: none !important; } }
      `}</style>

      {/* live translation demo */}
      <div className="relative rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-4 sm:p-5 overflow-hidden">
        <div className="absolute inset-x-6 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_70%)] pointer-events-none" />

        <div className="relative flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live call · auto-detected
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[12px] font-semibold text-blue-700">
            <span className="text-[14px] leading-none" aria-hidden="true">🇲🇽</span> Español
          </span>
        </div>

        <div className="relative space-y-2.5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-blue-600 text-white text-[13px] leading-snug px-3.5 py-2 shadow-sm">
              ¿Puedo adelantar mi cita de la próxima semana?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white border border-slate-200 text-slate-800 text-[13px] leading-snug px-3.5 py-2 shadow-sm">
              Claro, Sofía. Tengo el martes a las 9:40 o el jueves a las 15:00 — ¿cuál le viene mejor?
            </div>
          </div>
        </div>
      </div>

      {/* flag wall */}
      <div className="mt-3">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.06em] mb-2 px-1">
          30+ languages, one agent
        </p>
        <div className="space-y-2.5">
          <FlagMarquee items={LANG_ROW_1} duration="36s" />
          <FlagMarquee items={LANG_ROW_2} duration="44s" reverse />
        </div>
      </div>

      {/* copy */}
      <div className="mt-6 lg:mt-auto lg:pt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl text-slate-900 leading-none">3+</span>
          <span className="text-[15px] font-medium text-slate-400">languages</span>
        </div>
        <h3 className="mt-3 text-[19px] sm:text-[21px] font-semibold text-slate-900 leading-snug">
          Speaks 3+ languages
        </h3>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-500">
          Detects the caller&rsquo;s language automatically and replies in it — switching mid-conversation, no interpreter line, no wait.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <PoweredPill icon={<Mic className="w-3.5 h-3.5 text-blue-600" />}>Voice</PoweredPill>
          <PoweredPill icon={<MessageSquare className="w-3.5 h-3.5 text-blue-600" />}>
            SMS · WhatsApp
          </PoweredPill>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Clinical AI we run ourselves (own infra)                       */
/* ------------------------------------------------------------------ */

const STACK: { label: string; icon: React.ElementType }[] = [
  { label: "Clinical models", icon: Cpu },
  { label: "Real-time eval", icon: Activity },
  { label: "Guardrails", icon: ShieldCheck },
  { label: "Escalation", icon: PhoneForwarded },
];

function InfraCard() {
  return (
    <Card className="p-7 sm:p-8 flex flex-col">
      <div className="text-center mb-1">
        <FeatureTitle>Clinical AI we run ourselves</FeatureTitle>
        <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-500 max-w-[340px] mx-auto">
          Not a thin wrapper over a general-purpose API — our own healthcare stack, watched on every call.
        </p>
      </div>

      <div className="mt-6 mb-5 flex items-center justify-center gap-1.5">
        {STACK.map((s, i) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-700">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                  {s.label}
                </span>
              </div>
              {i < STACK.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 -mt-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-auto flex justify-center">
        <PoweredPill icon={<Cpu className="w-3.5 h-3.5 text-blue-600" />}>
          Powered by our clinical model
        </PoweredPill>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Observability & call intelligence                              */
/* ------------------------------------------------------------------ */

// Risk-ranked call queue — echoes the Compass dashboard's TaskQueuePane.
const CALL_ROWS = [
  { initials: "MA", level: "high", name: "M. Alvarez", reason: "Refill overdue · flagged for callback", score: 98 },
  { initials: "JO", level: "low", name: "J. Okafor", reason: "Recall booked · confirmed Tue 10:30", score: 95 },
  { initials: "LT", level: "high", name: "L. Tran", reason: "Prior auth · escalated to staff", score: 91 },
];
const LEVEL_COLOR: Record<string, string> = { high: "#ef4444", med: "#f59e0b", low: "#10b981" };

function ObservabilityCard() {
  return (
    <Card className="p-7 sm:p-8 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <FeatureTitle>Call intelligence on every conversation</FeatureTitle>
          <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-500">
            Every call transcribed, scored, and ranked by risk — a live queue of who needs a human next.
          </p>
        </div>
        <Tag>Illustrative</Tag>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
        {/* stat strip */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-[#fbfcfe]">
          {[
            { v: "412", l: "calls today" },
            { v: "38", l: "need action" },
            { v: "96", l: "avg QA" },
          ].map((s, i) => (
            <div key={s.l} className={"px-3 py-2.5 " + (i > 0 ? "border-l border-slate-100" : "")}>
              <div className="font-serif text-[20px] leading-none text-slate-900">{s.v}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* queue header */}
        <div className="px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[1px] text-slate-500 border-b border-slate-100 bg-[#fbfcfe]">
          Priority queue · ranked by risk
        </div>

        {/* ranked rows */}
        {CALL_ROWS.map((r, i) => (
          <div
            key={r.name}
            className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-slate-100 last:border-b-0"
          >
            <span className="text-[10px] font-semibold text-slate-300 w-3 shrink-0 tabular-nums">{i + 1}</span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#eef1fb] text-[#5b76d9] text-[10px] font-bold shrink-0">
              {r.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LEVEL_COLOR[r.level] }} />
                <span className="text-[12px] font-semibold text-slate-900 truncate">{r.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{r.reason}</p>
            </div>
            <div className="w-14 shrink-0">
              <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${r.score}%` }} />
              </div>
              <div className="text-[10px] font-semibold text-slate-500 tabular-nums text-right mt-1">QA {r.score}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Your own custom dashboard                                      */
/* ------------------------------------------------------------------ */

const DASH_CALLS: { initials: string; name: string; dur: string; status: string; tone: string }[] = [
  { initials: "RD", name: "Intake · R. Diaz", dur: "2:14", status: "Reviewed", tone: "emerald" },
  { initials: "SP", name: "Recall · S. Patel", dur: "1:47", status: "Flagged", tone: "amber" },
];

function DashboardCard() {
  return (
    <Card className="p-7 sm:p-8 flex flex-col">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50/60">
          <span className="w-2 h-2 rounded-full bg-slate-200" />
          <span className="w-2 h-2 rounded-full bg-slate-200" />
          <span className="w-2 h-2 rounded-full bg-slate-200" />
          <span className="ml-2 text-[10px] text-slate-400">yourclinic.hana.health</span>
        </div>
        <div className="p-3.5">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-lg bg-[#fbfcfe] border border-slate-100 px-2.5 py-2">
              <p className="text-[9.5px] text-slate-400 leading-tight">Calls today</p>
              <p className="font-serif text-[19px] leading-none text-slate-900 tabular-nums mt-0.5">142</p>
            </div>
            <div className="rounded-lg bg-[#fbfcfe] border border-slate-100 px-2.5 py-2">
              <p className="text-[9.5px] text-slate-400 leading-tight">Avg QA</p>
              <p className="font-serif text-[19px] leading-none text-slate-900 tabular-nums mt-0.5">96</p>
            </div>
            <div className="rounded-lg bg-[#eef1fb] border border-blue-100 px-2.5 py-2">
              <p className="text-[9.5px] text-[#5b76d9] leading-tight">Recovered</p>
              <p className="font-serif text-[19px] leading-none text-[#3a55b8] tabular-nums mt-0.5">18</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9.5px] font-medium text-slate-400 uppercase tracking-[0.06em]">
              Recent calls
            </p>
            <span className="text-[9.5px] text-blue-600 font-medium">Review all</span>
          </div>
          <div className="space-y-1.5">
            {DASH_CALLS.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#eef1fb] text-[#5b76d9] text-[9px] font-bold shrink-0">
                  {c.initials}
                </span>
                <span className="flex-1 truncate text-[11.5px] font-medium text-slate-700">
                  {c.name}
                </span>
                <span className="text-[10.5px] text-slate-400 tabular-nums">{c.dur}</span>
                <span
                  className={
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full " +
                    (c.tone === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : c.tone === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600")
                  }
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FeatureTitle>Your own custom dashboard</FeatureTitle>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-500">
        A cockpit branded to your practice — review any call, track outcomes, and spot trends, live.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PoweredPill icon={<LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />}>
          Included
        </PoweredPill>
        <Tag>Illustrative</Tag>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — White-glove partnership                                        */
/* ------------------------------------------------------------------ */

function WhiteGloveCard() {
  return (
    <Card className="p-7 sm:p-8 flex flex-col">
      <FeatureTitle>A partnership, not a purchase</FeatureTitle>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-500">
        A dedicated success lead maps HANA to your protocols, gets you live in days, and keeps tuning it as you grow.
      </p>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://assets.headway.co/provider_photos/129044/66574eca-82d2-11f0-bc93-0a58a9feac02-129044-1756250061589.jpeg"
            alt="Katie, your HANA success lead"
            loading="lazy"
            className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.25)]"
          />
          <div>
            <p className="text-[14px] font-semibold text-slate-900">Katie R. · Success lead</p>
            <p className="text-[12.5px] text-slate-400">Named contact, not a ticket queue</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {["White-glove onboarding, live in days", "Protocol tuning + weekly reviews early on", "Direct line, always"].map(
            (line) => (
              <div key={line} className="flex items-center gap-2 text-[13px] text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {line}
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
}

export default FeatureBento;
