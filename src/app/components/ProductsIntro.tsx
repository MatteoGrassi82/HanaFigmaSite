import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

/**
 * ProductsIntro
 * ─────────────
 * Homepage introduction of the two products: HANA Contact (the AI front desk)
 * and HANA Remote (the engagement layer for care-management programs).
 *
 * Copy is Matteo's (2026-08-04), built on the question-framed spec from the
 * Tile Health teardown: each card answers "is this for me?" — a photo of the
 * person it serves, the activity feed as the product's answer, a pain headline
 * in the visitor's words ("didn't get hired to be a call center / dialer"),
 * one line of copy, a proof stat, and an audio-flavored CTA. Kept deliberately
 * sparse (Matteo: "too busy too much text" on the fuller version — the cut
 * "this is you if" bullets live on in the product pages). A footer band
 * carries the shared one-engine line and the "What Hana never does" boundary.
 *
 * Built to the Hana design language (Instrument Serif display via `font-serif`,
 * DM Sans body, navy #00122F ink, #5b76d9 accent, white cards on #f6f7fb).
 *
 * COPY GUARDRAILS —
 *  - HANA Remote follows the positioning rules documented at the top of
 *    pages/HanaRemote.tsx: never "device-less RPM", never "generates billable
 *    minutes"; HANA prepares documentation, a named clinician attests.
 *  - ACCESS is pulled from all public Remote copy (Matteo, 2026-08-04) — do
 *    not list it as a supported program here.
 *  - Language claim is "3+ languages", never "any language".
 */

type Row = { label: string; chip: string; tone: "positive" | "neutral" | "accent" };

type Product = {
  eyebrow: string;
  headline: React.ReactNode;
  body: string;
  rows: Row[];
  stat: string;
  href: string;
  cta: string;
  img: string;
  imgAlt: string;
  /** object-position for the card crop — keeps faces in frame at wide aspect */
  imgPos: string;
};

// Card photos: Matteo's AI-generated set (2026-08-04), self-hosted in
// public/products — clinic team for Contact, patient on the call for Remote.
const PRODUCTS: Product[] = [
  {
    eyebrow: "HANA Contact · The AI front desk",
    img: "/products/contact-front-desk.webp",
    imgAlt: "Two clinicians talking in a clinic corridor, away from the phones",
    imgPos: "center 28%",
    headline: (
      <>
        Your front desk didn&rsquo;t get hired to be a <Em>call center.</Em>
      </>
    ),
    body: "Hana takes the phones. Answered on the first ring, booked in your EHR, note written back. Nights, weekends, and the Monday morning wall.",
    rows: [
      { label: "Incoming · 7:42 PM, after hours", chip: "Answered", tone: "positive" },
      { label: "No-show · J. Rivera", chip: "Rebooked", tone: "positive" },
      { label: "Refill request · M. Chen", chip: "Note → EHR", tone: "accent" },
    ],
    stat: "53% fewer day-of cancellations · live in a week",
    href: "/hana-contact",
    cta: "Hear it take a call",
  },
  {
    eyebrow: "HANA Remote · Full-stack care coordination",
    img: "/products/remote-patient-call.webp",
    imgAlt: "An older patient taking a phone call",
    imgPos: "center 32%",
    headline: (
      <>
        Your care team didn&rsquo;t get hired to be a <Em>dialer.</Em>
      </>
    ),
    body: "Hana makes the between-visit calls your CCM, APCM, BHI and RTM programs need. Every call scored against your protocol, every flag to your clinician with the full call on screen.",
    rows: [
      { label: "Wk 1 · Voice check-in", chip: "On plan", tone: "positive" },
      { label: "Wk 2 · Symptoms worsening", chip: "Flagged", tone: "neutral" },
      { label: "Escalation, full call context", chip: "→ Worklist", tone: "accent" },
    ],
    stat: "2.3x the patients per coordinator · 340% more clinical data captured",
    href: "/hana-remote",
    cta: "Hear it run a check-in",
  },
];

export function ProductsIntro() {
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
            Two products · one platform
          </div>
          <h2 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[60px] leading-[1.04] tracking-[-0.01em] text-[#00122F]">
            The front desk, <Em>and the care programs.</Em>
          </h2>
        </div>

        {/* ── The two cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((p) => (
            <div
              key={p.href}
              className={`${cardHover} bg-white border border-[#e8ebf2] rounded-[18px] overflow-hidden flex flex-col`}
            >
              {/* photo header — real people, the human side of each product */}
              <div className="relative">
                <img
                  src={p.img}
                  alt={p.imgAlt}
                  loading="lazy"
                  className="w-full h-[170px] sm:h-[190px] object-cover block"
                  style={{ objectPosition: p.imgPos }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#00122F]/30 via-transparent to-transparent"
                />
              </div>

              {/* activity feed — floats up over the photo's bottom edge */}
              <div className="relative z-10 mx-6 sm:mx-8 -mt-14 bg-white rounded-[12px] border border-[#e8ebf2] shadow-[0_12px_30px_rgba(0,18,47,0.14)] px-5 py-1.5">
                {p.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-3 py-3 ${
                      i > 0 ? "border-t border-[#e8ebf2]" : ""
                    }`}
                  >
                    <span className="text-[13.5px] text-[#00122F] truncate">{row.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#475569] whitespace-nowrap">
                      <span
                        aria-hidden
                        className={
                          "w-[5px] h-[5px] rounded-full shrink-0 " +
                          (row.tone === "positive"
                            ? "bg-emerald-500"
                            : row.tone === "accent"
                            ? "bg-[#5b76d9]"
                            : "bg-amber-500")
                        }
                      />
                      {row.chip}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-8 sm:px-10 pt-7 pb-8 flex flex-col grow">
                <div className="inline-flex items-center gap-3 mb-[18px] text-[11.5px] font-bold tracking-[2.5px] uppercase text-[#5b76d9]">
                  <span className="w-6 h-px bg-[#5b76d9] opacity-60 shrink-0" />
                  {p.eyebrow}
                </div>

                {/* the pain headline — the "is this for me?" hook */}
                <h3 className="font-serif font-normal text-3xl sm:text-[36px] leading-[1.12] text-[#00122F] mb-3.5 max-w-[20ch]">
                  {p.headline}
                </h3>
                <p className="text-[15.5px] leading-[1.7] text-[#475569] mb-7 max-w-[52ch] text-pretty">
                  {p.body}
                </p>

                {/* proof stat — bottom-pinned with the CTA so cards align */}
                <div className="mt-auto text-[13px] font-semibold text-[#00122F] mb-6">{p.stat}</div>

                <Link
                to={p.href}
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#00122F] hover:text-[#5b76d9] transition-colors"
              >
                  {p.cta}
                  <ArrowRight className="w-4 h-4 text-[#5b76d9] transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ── One-engine footer band + the trust boundary ── */}
        <div className="mt-12 pt-9 border-t border-[#e8ebf2] text-center max-w-[720px] mx-auto">
          <p className="text-[16px] leading-[1.7] font-medium text-[#00122F] m-0">
            One engine. Same voice, same clinical guardrails, same note in the same chart.
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#475569] m-0 text-pretty">
            <strong className="font-semibold text-[#00122F]">What Hana never does:</strong> clinical
            judgment, bad news, or a patient who is upset. Those go to your clinician mid-call, with
            the full context already on screen.
          </p>
        </div>
      </div>
    </section>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return <em className="italic text-[#5b76d9]">{children}</em>;
}


/** Card hover-lift, matching PatientEngagement's `.hana-card` interaction. */
const cardHover =
  "transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(.4,0,.2,1)] " +
  "hover:shadow-[0_12px_30px_rgba(0,18,47,0.08)] hover:-translate-y-0.5";
