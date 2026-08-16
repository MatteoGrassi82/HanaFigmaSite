import { Check, Phone, PhoneOff } from "lucide-react";
import { ImageItem, PhoneCarousel } from "./phone-mockups-1-utils/phone-carousel";

/**
 * HANA phone mockups — the patient side of an integration.
 *
 * The upstream example loaded Behance/Notion/Reddit screenshots from a public
 * Cloudinary account; those are replaced with rendered HANA screens (branded
 * caller ID, the live check-in, the note landing in the chart). No external
 * image host, sharp on retina, and the copy is editable in place.
 */

const BLUE = "#2563EB";
const ORANGE = "#F59E42";
const INK = "#0A1633";

function StatusBar({ label = "9:41" }: { label?: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-3.5 text-[11px] font-semibold text-[#0A1633]">
      <span>{label}</span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2 w-2 rounded-full bg-[#0A1633]/70" />
        <span className="inline-block h-2.5 w-4 rounded-[3px] border border-[#0A1633]/60" />
      </span>
    </div>
  );
}

/** 1 — Incoming call with a branded caller ID: the patient sees the clinic. */
function IncomingCallScreen() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#EFF3FF] via-white to-[#FDF1E6]">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full text-white"
          style={{ background: BLUE }}
        >
          <Phone className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <p className="mt-4 mb-0 text-[11px] font-semibold uppercase tracking-[1.4px] text-slate-500">
          Incoming call
        </p>
        <p className="mt-1.5 mb-0 text-[17px] font-bold leading-tight" style={{ color: INK }}>
          Dr. Reyes' Office
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
          style={{ background: "rgba(37,99,235,0.10)", color: BLUE }}
        >
          <Check className="h-3 w-3" strokeWidth={3.2} /> Verified caller
        </span>
      </div>
      <div className="flex items-center justify-center gap-10 pb-9">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E05252] text-white">
          <PhoneOff className="h-4 w-4" strokeWidth={2.6} />
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#22A15C] text-white">
          <Phone className="h-4 w-4" strokeWidth={2.6} />
        </span>
      </div>
    </div>
  );
}

/** 2 — The check-in itself, in the patient's own language. */
function InCallScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar label="01:12" />
      <div className="border-b border-slate-100 px-5 pb-3 pt-4">
        <p className="m-0 text-[13px] font-bold" style={{ color: INK }}>
          HANA · evening check-in
        </p>
        <p className="m-0 mt-0.5 text-[10.5px] text-slate-500">CPAP adherence · day 6 on program</p>
      </div>
      <div className="flex-1 space-y-2 px-4 py-4">
        <div className="max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 text-[11.5px] leading-[1.45] text-white" style={{ background: INK }}>
          How many hours did you wear the CPAP last night?
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11.5px] leading-[1.45]" style={{ color: INK }}>
          Only about two. It felt too tight.
        </div>
        <div className="max-w-[88%] rounded-2xl rounded-bl-md px-3 py-2 text-[11.5px] leading-[1.45] text-white" style={{ background: INK }}>
          That's common in week one. Let's loosen the top strap one notch tonight.
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 pb-8">
        {[10, 18, 26, 20, 12, 22, 15].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{ height: h, background: BLUE, opacity: 0.35 + (i % 3) * 0.22 }}
          />
        ))}
      </div>
    </div>
  );
}

/** 3 — The same facts arriving in the chart, as blue and orange chips. */
function WriteBackScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />
      <div className="border-b border-slate-100 px-5 pb-3 pt-4">
        <p className="m-0 text-[13px] font-bold" style={{ color: INK }}>
          Structured note
        </p>
        <p className="m-0 mt-0.5 text-[10.5px] text-slate-500">Written to your EHR</p>
      </div>
      <div className="flex-1 space-y-2.5 px-4 py-4 text-[11px] text-slate-600">
        {[
          { k: "Patient", v: "Maria R.", bg: BLUE, ink: "#fff" },
          { k: "Finding", v: "CPAP · 2 hrs", bg: BLUE, ink: "#fff" },
          { k: "Risk", v: "Below 4-hr threshold", bg: ORANGE, ink: "#3D2408" },
        ].map((r) => (
          <div key={r.k} className="flex items-center gap-2">
            <span className="w-[46px] shrink-0">{r.k}</span>
            <span className="flex h-[22px] flex-1 items-center rounded-md bg-slate-100 px-1">
              <span
                className="rounded px-1.5 py-0.5 text-[10.5px] font-bold"
                style={{ background: r.bg, color: r.ink }}
              >
                {r.v}
              </span>
            </span>
          </div>
        ))}
        <p className="m-0 pt-1 leading-[1.5]">Plan · strap adjustment, follow-up call tomorrow</p>
      </div>
      <div className="border-t border-slate-100 px-4 py-3.5">
        <p className="m-0 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: BLUE }}>
          <Check className="h-3.5 w-3.5" strokeWidth={3} /> Ready for Dr. Reyes to attest
        </p>
      </div>
    </div>
  );
}

export const HANA_PHONE_SCREENS: ImageItem[] = [
  {
    alt: "Incoming call from the clinic on a patient's phone",
    caption: "Your clinic's name on the caller ID, not an unknown number.",
    screen: <IncomingCallScreen />,
  },
  {
    alt: "HANA running a CPAP check-in call",
    caption: "The check-in runs on the phone they already own.",
    screen: <InCallScreen />,
  },
  {
    alt: "The structured note arriving in the EHR",
    caption: "The moment it ends, the note is in your chart.",
    screen: <WriteBackScreen />,
  },
];

export default function PhoneMockupBasic() {
  return <PhoneCarousel images={HANA_PHONE_SCREENS} />;
}
