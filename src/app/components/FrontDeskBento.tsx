import { Fragment } from "react";
import { Cpu, Activity, ShieldCheck, PhoneForwarded } from "lucide-react";
import { useTranslations } from "../../lib/i18n";

export function FrontDeskBento() {
  const t = useTranslations();
  const f = t.frontDeskBento;

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-3 text-[12px] font-bold tracking-[0.15em] uppercase text-[#5b76d9]
            before:content-[''] before:w-7 before:h-px before:bg-[#5b76d9] before:opacity-50
            after:content-[''] after:w-7 after:h-px after:bg-[#5b76d9] after:opacity-50
          ">
            {f.tag}
          </div>
          <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.01em] text-[#00122F] mt-4">
            {f.heading}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

          {/* ── Languages (tall) ── */}
          <div className="md:row-span-2 bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[26px] leading-[1.1] tracking-[-0.01em] text-[#00122F]">
              {f.languagesHeadingPre} <em className="italic text-[#5b76d9]">{f.languagesHeadingEm}</em> {f.languagesHeadingPost}
            </h3>

            {/* live-call mockup */}
            <div className="bg-[#f6f7fb] border border-[#e8ebf2] rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#64748b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {f.languagesLiveLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#5b76d9] bg-white border border-[#e2e6f4] rounded-full px-2 py-1">
                  <span className="text-[12px] leading-none">🇪🇸</span>
                  {f.languagesLangBadge}
                </span>
              </div>
              <div className="flex justify-end mb-2">
                <div className="bg-blue-600 text-white text-[12px] font-medium leading-[1.4] px-3 py-2 rounded-[12px_12px_3px_12px] max-w-[85%]">
                  {f.languagesMsg1}
                </div>
              </div>
              <div className="flex">
                <div className="bg-white border border-[#e8ebf2] text-[#00122F] text-[12px] leading-[1.45] px-3 py-2 rounded-[12px_12px_12px_3px] max-w-[88%]">
                  {f.languagesMsg2}
                </div>
              </div>
            </div>

            <p className="text-[14.5px] leading-[1.6] text-[#64748b]">{f.languagesBody}</p>

            {/* language flags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[19px] leading-none">
              {["🇺🇸", "🇪🇸", "🇨🇳", "🇻🇳", "🇸🇦", "🇧🇷", "🇫🇷", "🇭🇹", "🇰🇷", "🇮🇳"].map((flag) => (
                <span key={flag}>{flag}</span>
              ))}
            </div>

            <div className="mt-auto flex items-baseline gap-2 border-t border-[#e8ebf2] pt-3.5">
              <span className="font-serif text-[26px] leading-none text-[#00122F]">{f.languagesStatNumber}</span>
              <span className="text-[14.5px] text-[#64748b]">{f.languagesStatLabel}</span>
            </div>
          </div>

          {/* ── Clinical AI (stack strip) ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <div className="text-center">
              <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
                Clinical AI <em className="italic text-[#5b76d9]">we run ourselves</em>
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#64748b]">
                Not a thin wrapper over a general-purpose API — our own healthcare stack, watched on every call.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {[
                { label: "Clinical models", Icon: Cpu },
                { label: "Real-time eval", Icon: Activity },
                { label: "Guardrails", Icon: ShieldCheck },
                { label: "Escalation", Icon: PhoneForwarded },
              ].map((s, i, arr) => (
                <Fragment key={s.label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#e8ebf2] shadow-sm flex items-center justify-center text-[#5b76d9]">
                      <s.Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-[#64748b] whitespace-nowrap">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-[#cbd5e1] -mt-4 text-sm">→</span>}
                </Fragment>
              ))}
            </div>
            <div className="mt-auto flex justify-center pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8ebf2] bg-white px-3 py-1 text-[12px] font-medium text-[#64748b]">
                <Cpu className="w-3.5 h-3.5 text-[#5b76d9]" /> Powered by Hana 2
              </span>
            </div>
          </div>

          {/* ── Call intelligence ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
              {f.intelHeadingPre} <em className="italic text-[#5b76d9]">{f.intelHeadingEm}</em> {f.intelHeadingPost}
            </h3>
            <div className="mt-auto flex flex-col">
              {[
                { label: f.intelRow1Label, badge: f.intelRow1Badge, score: f.intelRow1Score, tone: "positive" as const },
                { label: f.intelRow2Label, badge: f.intelRow2Badge, score: f.intelRow2Score, tone: "neutral" as const },
                { label: f.intelRow3Label, badge: f.intelRow3Badge, score: f.intelRow3Score, tone: "concern" as const },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2.5 border-t border-[#e8ebf2] text-[13px] font-medium text-[#00122F]">
                  <span>{row.label}</span>
                  <span
                    className={
                      "text-[11px] font-semibold rounded-md px-2 py-1 whitespace-nowrap " +
                      (row.tone === "positive"
                        ? "text-green-600 bg-green-50"
                        : row.tone === "neutral"
                        ? "text-[#64748b] bg-[#f1f3fb]"
                        : "text-amber-600 bg-amber-50")
                    }
                  >
                    {row.badge} · {row.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Dashboard (browser mockup) ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
              Your own <em className="italic text-[#5b76d9]">custom dashboard</em>
            </h3>
            <p className="text-[14px] leading-[1.55] text-[#64748b]">
              A cockpit branded to your practice — review any call, track outcomes, and spot trends, live.
            </p>
            <div className="mt-auto rounded-xl border border-[#e8ebf2] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#e8ebf2] bg-[#f6f7fb]">
                <span className="w-2 h-2 rounded-full bg-[#d7dbe8]" />
                <span className="w-2 h-2 rounded-full bg-[#d7dbe8]" />
                <span className="w-2 h-2 rounded-full bg-[#d7dbe8]" />
                <span className="ml-2 text-[10px] text-[#94a3b8]">yourclinic.hana.health</span>
              </div>
              <div className="p-3.5">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: f.dashboardStat1Label, value: f.dashboardStat1Value, accent: false },
                    { label: f.dashboardStat2Label, value: f.dashboardStat2Value, accent: false },
                    { label: f.dashboardStat3Label, value: f.dashboardStat3Value, accent: true },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={
                        "rounded-lg border px-2.5 py-2 " +
                        (s.accent ? "bg-[rgba(167,188,245,0.16)] border-[#e2e6f4]" : "bg-[#f6f7fb] border-[#e8ebf2]")
                      }
                    >
                      <p className={"text-[9.5px] leading-tight " + (s.accent ? "text-[#5b76d9]" : "text-[#94a3b8]")}>{s.label}</p>
                      <p className={"font-serif text-[19px] leading-none mt-0.5 " + (s.accent ? "text-[#5b76d9]" : "text-[#00122F]")}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em]">Recent calls</p>
                  <span className="text-[9.5px] text-[#5b76d9] font-medium">Review all</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { initials: "RD", name: "Intake · R. Diaz", dur: "2:14", status: "Reviewed", tone: "positive" },
                    { initials: "SP", name: "Recall · S. Patel", dur: "1:47", status: "Flagged", tone: "concern" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-2 rounded-lg border border-[#e8ebf2] bg-white px-2 py-1.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#eef1fb] text-[#5b76d9] text-[9px] font-bold shrink-0">
                        {c.initials}
                      </span>
                      <span className="flex-1 truncate text-[11.5px] font-medium text-[#00122F]">{c.name}</span>
                      <span className="text-[10.5px] text-[#94a3b8] tabular-nums">{c.dur}</span>
                      <span
                        className={
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full " +
                          (c.tone === "positive" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")
                        }
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Partnership ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
              {f.partnershipHeadingPre} <em className="italic text-[#5b76d9]">{f.partnershipHeadingEm}</em>
            </h3>
            <div className="mt-auto flex flex-col">
              {[f.partnershipRow1, f.partnershipRow2, f.partnershipRow3].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-t border-[#e8ebf2] text-[13px] font-medium text-[#00122F]"
                >
                  {i === 0 && (
                    <img
                      src="https://assets.headway.co/provider_photos/129044/66574eca-82d2-11f0-bc93-0a58a9feac02-129044-1756250061589.jpeg"
                      alt="Your named success lead"
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-white shadow-[0_2px_8px_-2px_rgba(0,18,47,0.25)]"
                    />
                  )}
                  {row}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
