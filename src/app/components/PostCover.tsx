import { urlFor, type Post } from "../../lib/sanity";

/**
 * PostCover
 * ─────────
 * Blog hero / thumbnail. Renders a post's `mainImage` when present; otherwise
 * draws a deterministic, on-brand navy cover with a per-topic accent inferred
 * from the title/slug. Fills its parent — the caller sets the aspect ratio
 * (e.g. `aspect-[16/9]` for cards, `aspect-[2/1]` for the article hero).
 */

type TopicKey = "voice" | "readmissions" | "infrastructure" | "engagement" | "insights";

/** accent = eyebrow/text color · a & b = gradient-mesh blob colors */
const TOPICS: { key: TopicKey; test: RegExp; label: string; accent: string; a: string; b: string }[] = [
  { key: "voice", test: /voice|outbound|\bagent|\bcall\b|inbound|receptionist/i, label: "Voice AI", accent: "#c4b5fd", a: "#7c6cf0", b: "#4338ca" },
  { key: "readmissions", test: /readmission|discharge|follow-?up|reminder|behav|communication/i, label: "Readmissions", accent: "#5eead4", a: "#22d3ee", b: "#0e7490" },
  { key: "infrastructure", test: /architect|infrastructure|production|pilot|never reach|scale|89%|70%|11%|3\.7/i, label: "AI Infrastructure", accent: "#A7BCF5", a: "#5b76d9", b: "#3b3f8f" },
  { key: "engagement", test: /engage|patient|outreach/i, label: "Patient Engagement", accent: "#7dd3fc", a: "#38bdf8", b: "#1d4ed8" },
];
const DEFAULT_TOPIC = { key: "insights" as TopicKey, label: "Insights", accent: "#A7BCF5", a: "#5b76d9", b: "#3b3f8f" };

function topicFor(post: Post) {
  const haystack = `${post.title} ${post.slug?.current ?? ""}`;
  return TOPICS.find((t) => t.test.test(haystack)) ?? DEFAULT_TOPIC;
}

/** urlFor() throws on unresolvable image records — guard so a bad record can't crash the page. */
function safeImageUrl(src: Post["mainImage"], w: number, h: number): string | null {
  if (!src) return null;
  try {
    return urlFor(src).width(w).height(h).fit("crop").url();
  } catch {
    return null;
  }
}

export function PostCover({
  post,
  size = "card",
  eager = false,
  className = "",
}: {
  post: Post;
  size?: "card" | "hero";
  eager?: boolean;
  className?: string;
}) {
  const isHero = size === "hero";
  const imageUrl = safeImageUrl(post.mainImage, isHero ? 1200 : 640, isHero ? 600 : 360);

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={post.title}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  // ── Generated per-topic gradient-mesh cover (abstract — the headline lives in the card body / <h1>) ──
  const topic = topicFor(post);
  const eyebrowSize = isHero ? "text-[12px]" : "text-[10.5px]";
  const pad = isHero ? "p-8 sm:p-10" : "p-6";

  // layered radial "mesh" blobs over a navy base (8-digit hex = color + alpha)
  const mesh = [
    `radial-gradient(85% 85% at 82% 12%, ${topic.a}cc, transparent 55%)`,
    `radial-gradient(80% 80% at 68% 108%, ${topic.b}bb, transparent 55%)`,
    `radial-gradient(70% 70% at 12% 92%, ${topic.a}44, transparent 60%)`,
    `linear-gradient(140deg, #00122F 0%, #051d3b 55%, #082647 100%)`,
  ].join(", ");

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: mesh }}>
      {/* soft hover lift on the mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(90% 90% at 82% 12%, ${topic.a}55, transparent 55%)` }}
      />
      {/* top sheen for depth */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 8% 4%, rgba(255,255,255,0.06), transparent 45%)" }}
      />

      <div className={`relative flex h-full flex-col justify-between ${pad}`}>
        {/* eyebrow: accent bar + topic */}
        <div className="flex items-center gap-2.5">
          <span className="h-[3px] w-6 rounded-full" style={{ background: topic.accent }} />
          <span className={`font-bold uppercase tracking-[2px] ${eyebrowSize}`} style={{ color: topic.accent }}>
            {topic.label}
          </span>
        </div>

        {/* Hana wordmark */}
        <div className="flex items-center gap-2">
          <svg width={isHero ? 20 : 16} height={isHero ? 13 : 11} viewBox="0 0 46 30" fill="none" aria-hidden="true">
            <ellipse cx="9" cy="15" rx="7" ry="15" fill={topic.accent} opacity="0.5" />
            <ellipse cx="23" cy="15" rx="7" ry="15" fill={topic.accent} opacity="0.78" />
            <ellipse cx="37" cy="15" rx="7" ry="15" fill={topic.accent} />
          </svg>
          <span className={`font-semibold text-white/60 ${isHero ? "text-[12px]" : "text-[10.5px]"}`}>Hana Health</span>
        </div>
      </div>
    </div>
  );
}
