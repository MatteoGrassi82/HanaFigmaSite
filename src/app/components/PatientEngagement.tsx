import foundersImage from "figma:asset/77a7976bf5ac7a4d6dd84ca175d8ece4a749f268.png";
import { Check } from "lucide-react";

/**
 * PatientEngagement
 * ─────────────────
 * Implementation of the "Patient Engagement.dc.html" Claude Design export.
 * A 2×2 bento grid of capabilities followed by a full-width founders
 * "partnership" bento. Built to the Hana design language (Instrument Serif
 * display via `font-serif`, DM Sans body, navy #00122F ink, #5b76d9 accent).
 */
export function PatientEngagement() {
  return (
    <section className="bg-[#f6f7fb] py-20 sm:py-24 lg:py-[100px] px-5 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12 sm:mb-14">
          <div
            className="inline-flex items-center gap-3.5 mb-5 text-[12px] font-bold tracking-[2.5px] uppercase text-[#5b76d9]
              before:content-[''] before:w-7 before:h-px before:bg-[#5b76d9] before:opacity-50
              after:content-[''] after:w-7 after:h-px after:bg-[#5b76d9] after:opacity-50"
          >
            Patient engagement
          </div>
          <h2 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[60px] leading-[1.04] tracking-[-0.01em] text-[#00122F]">
            Every patient conversation, handled
          </h2>
        </div>

        {/* ── 2×2 grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1 · Languages */}
          <Card>
            <Illustration>
              <div className="flex items-center justify-center gap-5">
                {/* overlapping call bubbles */}
                <span className="relative block w-[46px] h-[30px]">
                  <span className="absolute left-0 top-0 w-[30px] h-[30px] rounded-full bg-[#00122F]" />
                  <span className="absolute right-0 top-0 w-[30px] h-[30px] rounded-full bg-[#00122F] opacity-80 mix-blend-multiply" />
                </span>
                <span className="w-[42px] border-t-2 border-dotted border-[#c3cbdb]" />
                {/* live language list */}
                <span className="flex flex-col gap-1.5 text-[13px] leading-none">
                  <span className="text-[#c3cbdb]">English</span>
                  <span className="text-[#c3cbdb]">中文</span>
                  <span className="text-[#00122F] font-semibold">Español</span>
                  <span className="text-[#c3cbdb]">Tiếng Việt</span>
                  <span className="text-[#c3cbdb]">العربية</span>
                </span>
              </div>
            </Illustration>
            <Caption>
              Speaks <Em>30+ languages</Em>, live on the call
            </Caption>
          </Card>

          {/* 2 · Clinical AI */}
          <Card>
            <Illustration>
              <svg width="248" height="76" viewBox="0 0 248 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="60" y1="38" x2="94" y2="38" stroke="#00122F" strokeWidth="1.5" />
                <line x1="154" y1="38" x2="180" y2="38" stroke="#c3cbdb" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
                <circle cx="34" cy="38" r="26" stroke="#00122F" strokeWidth="1.5" />
                <circle cx="124" cy="38" r="26" stroke="#00122F" strokeWidth="1.5" />
                <circle cx="214" cy="38" r="26" stroke="#00122F" strokeWidth="1.5" />
                <polyline points="23,40 30,40 34,30 39,48 42,40 46,40" stroke="#00122F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M124 26 l10 4 v6 c0 6 -4 9 -10 11 c-6 -2 -10 -5 -10 -11 v-6 z" stroke="#5b76d9" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M205 30 h11 l3 7 -3 3 a13 13 0 0 0 6 6 l3 -3 7 3" stroke="#00122F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="translate(-3 3)" />
              </svg>
            </Illustration>
            <Caption>
              Clinical AI <Em>we run ourselves</Em> — not a wrapper
            </Caption>
          </Card>

          {/* 3 · Call intelligence */}
          <Card>
            <Illustration>
              <div className="flex flex-col justify-center gap-2.5 w-[216px]">
                {[
                  { label: "Refill · M. Alvarez", score: "98", tone: "positive" as const },
                  { label: "Recall · J. Okafor", score: "95", tone: "neutral" as const },
                  { label: "Prior auth · L. Tran", score: "91", tone: "concern" as const },
                ].map((row, i, arr) => (
                  <div key={row.label} className="contents">
                    <span className="flex items-center justify-between text-[13px] text-[#00122F]">
                      {row.label}
                      <span
                        className={
                          "text-[12px] font-semibold rounded-full px-2.5 py-[3px] " +
                          (row.tone === "positive"
                            ? "text-green-600 bg-green-50"
                            : row.tone === "neutral"
                            ? "text-[#718096] bg-[#f1f3fb]"
                            : "text-amber-700 bg-amber-50")
                        }
                      >
                        {row.score}
                      </span>
                    </span>
                    {i < arr.length - 1 && <span className="border-t border-[#e8ebf2]" />}
                  </div>
                ))}
              </div>
            </Illustration>
            <Caption>
              Scored on <Em>every</Em> conversation — sentiment, QA, outcomes
            </Caption>
          </Card>

          {/* 4 · Dashboard */}
          <Card>
            <Illustration>
              <span className="w-[232px] border-[1.5px] border-[#00122F] rounded-xl overflow-hidden bg-white block">
                <span className="flex items-center gap-1.5 px-3 py-[9px] border-b-[1.5px] border-[#e8ebf2]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3cbdb]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3cbdb]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3cbdb]" />
                  <span className="ml-1.5 text-[10.5px] text-[#94a3b8]">yourclinic.hana.health</span>
                </span>
                <span className="flex gap-2 px-3 py-3.5">
                  {[
                    { label: "Calls", value: "142", accent: false },
                    { label: "Avg QA", value: "96", accent: false },
                    { label: "Recovered", value: "18", accent: true },
                  ].map((s) => (
                    <span key={s.label} className="flex-1 border border-[#e8ebf2] rounded-[7px] px-[9px] py-2 block">
                      <span className="block text-[9px] text-[#94a3b8] mb-[3px]">{s.label}</span>
                      <span className={"font-serif text-[17px] block " + (s.accent ? "text-[#5b76d9]" : "text-[#00122F]")}>
                        {s.value}
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            </Illustration>
            <Caption>
              Your own <Em>custom dashboard</Em>, branded to your practice
            </Caption>
          </Card>

        </div>

        {/* ── Partnership · long bento ── */}
        <div className={`${cardHover} mt-6 bg-white border border-[#e8ebf2] rounded-[18px] overflow-hidden grid grid-cols-1 md:grid-cols-[0.72fr_1.28fr] items-center`}>
          {/* founders */}
          <div className="flex flex-col items-center justify-center gap-4 px-8 md:pl-12 md:pr-8 pt-10 md:py-12">
            <img
              src={foundersImage}
              alt="Matteo Grassi and Sthita Pragyan Pujari, co-founders of Hana"
              loading="lazy"
              className="w-[168px] h-[168px] rounded-full object-cover block bg-[#eef1fb] shadow-[0_4px_16px_rgba(0,18,47,0.12)]"
            />
            <div className="text-center">
              <div className="text-[15px] font-semibold text-[#00122F]">Matteo &amp; Sthita</div>
              <div className="text-[13.5px] text-[#64748b] mt-[3px]">Co-founders of Hana</div>
            </div>
          </div>
          {/* copy */}
          <div className="px-8 sm:px-11 py-10 md:py-12">
            <div className="inline-flex items-center gap-3 mb-[18px] text-[11.5px] font-bold tracking-[2.5px] uppercase text-[#5b76d9]">
              <span className="w-6 h-px bg-[#5b76d9] opacity-60" />
              Partnership
            </div>
            <h3 className="font-serif font-normal text-3xl sm:text-[38px] leading-[1.08] text-[#00122F] mb-3.5">
              A partnership, <Em>not a purchase</Em>
            </h3>
            <p className="text-[15.5px] leading-[1.7] text-[#64748b] mb-6 max-w-[42ch] text-pretty">
              You get a team, not a license key. We stand up your workflows and stay in the loop as they evolve.
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                "Live in days, not months",
                "A named success lead on your account",
                "Protocol tuning from week one",
              ].map((point) => (
                <span key={point} className="flex items-center gap-3 text-[15px] text-[#00122F]">
                  <Check className="w-[17px] h-[17px] text-[#5b76d9] shrink-0" strokeWidth={2.2} />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── local building blocks ── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cardHover} bg-white border border-[#e8ebf2] rounded-[18px] px-8 pt-9 pb-8 flex flex-col items-center`}>
      {children}
    </div>
  );
}

function Illustration({ children }: { children: React.ReactNode }) {
  return <div className="h-[168px] flex items-center justify-center">{children}</div>;
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] leading-[1.55] text-[#00122F] text-center mt-6 max-w-[26ch] text-pretty">
      {children}
    </p>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return <em className="italic text-[#5b76d9]">{children}</em>;
}

/** Card hover-lift, matching the export's `.hana-card` interaction. */
const cardHover =
  "transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(.4,0,.2,1)] " +
  "hover:shadow-[0_12px_30px_rgba(0,18,47,0.08)] hover:-translate-y-0.5";
