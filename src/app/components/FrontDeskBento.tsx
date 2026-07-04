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

          {/* ── Clinical AI (navy) ── */}
          <div className="bg-[#00122F] border border-[#00122F] rounded-2xl p-7 flex flex-col justify-center gap-4">
            <h3 className="font-serif font-normal text-[27px] leading-[1.15] tracking-[-0.01em] text-white">
              {f.clinicalHeadingPre} <em className="italic text-[#A7BCF5]">{f.clinicalHeadingEm}</em>
            </h3>
            <p className="text-[14.5px] leading-[1.6] text-[#94a3b8]">{f.clinicalBody}</p>
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

          {/* ── Dashboard ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
              <em className="italic text-[#5b76d9]">{f.dashboardHeadingEm}</em> {f.dashboardHeadingPost}
            </h3>
            <div className="mt-auto grid grid-cols-3 gap-2.5">
              {[
                { label: f.dashboardStat1Label, value: f.dashboardStat1Value, accent: false },
                { label: f.dashboardStat2Label, value: f.dashboardStat2Value, accent: false },
                { label: f.dashboardStat3Label, value: f.dashboardStat3Value, accent: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={
                    "rounded-[10px] border p-3 flex flex-col gap-1.5 " +
                    (stat.accent
                      ? "bg-[rgba(167,188,245,0.16)] border-[#e2e6f4]"
                      : "bg-[#f6f7fb] border-[#e8ebf2]")
                  }
                >
                  <span className={"text-[10.5px] font-medium " + (stat.accent ? "text-[#5b76d9]" : "text-[#64748b]")}>
                    {stat.label}
                  </span>
                  <span className={"font-serif text-2xl leading-none " + (stat.accent ? "text-[#5b76d9]" : "text-[#00122F]")}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Partnership ── */}
          <div className="bg-white border border-[#e8ebf2] rounded-2xl p-7 flex flex-col gap-4">
            <h3 className="font-serif font-normal text-[23px] leading-[1.12] tracking-[-0.01em] text-[#00122F]">
              {f.partnershipHeadingPre} <em className="italic text-[#5b76d9]">{f.partnershipHeadingEm}</em>
            </h3>
            <div className="mt-auto flex flex-col">
              {[f.partnershipRow1, f.partnershipRow2, f.partnershipRow3].map((row, i) => (
                <div key={i} className="py-2.5 border-t border-[#e8ebf2] text-[13px] font-medium text-[#00122F]">
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
