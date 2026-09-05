import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

/* ── The proof section, calmed down ────────────────────────────────────────────
 * Matteo, 2026-08-20: the bento is too busy. It carries four stat tiles, two
 * attributed quotes, two unattributed ones, two photo cards and a CTA, in an
 * irregular mosaic, so nothing in it is the thing you read first.
 *
 * Two observations that shaped these variants beyond density.
 *
 * 1. Half the numbers are the wrong product's. "Fewer missed patient calls",
 *    "less time to respond", "more slots filled" and "fewer no-shows" are front
 *    desk outcomes. On a care-coordination page they argue for Contact.
 * 2. The traction numbers are unreconciled (brand architecture doc, migration
 *    step 1: 4M against 2M interactions, 500+ practices against 15 clients).
 *    Until that is settled, a variant that leans on quotes is the safer one.
 *
 * Attributions are left exactly as the bento has them. Two of the quotes are
 * unattributed there, so they stay unattributed here.
 */
type Voice = { quote: string; name?: string; role?: string; img?: string; tag?: string };

const VOICES: Voice[] = [
  {
    quote:
      "Hana … captures the conversation in structured notes that go straight into the chart, and flags anyone who needs a same-day callback.",
    name: "Fakhrudin Mohamed, MD",
    role: "Board-certified physician",
    img: "/avatars/fakhrudin.png",
    tag: "Care coordination",
  },
  {
    quote:
      "Designed for both Remote Patient Monitoring and Remote Therapeutic Monitoring programs, enabling scalable patient engagement while improving adherence and lowering the cost of care.",
    name: "Archie Defillo, MD",
    role: "Neuroscience, sleep and behavioral health",
    img: "/avatars/archie.jpg",
    tag: "Monitoring",
  },
  {
    quote:
      "Getting elderly patients ready for surgery over the phone is nearly impossible. HANA reaches them, walks them through everything, and flags whoever still isn't ready so we can step in.",
    tag: "Before surgery",
  },
];

/* The bento's Archie portrait is a hotlinked ResearchGate URL that returns 403,
   so any portrait here falls back to initials rather than a broken image. */
export function Portrait({ src, name, size = 64 }: { src?: string; name?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "")
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  if (!src || failed || !name)
    return (
      <span
        className="shrink-0 rounded-2xl bg-[#EFF3FF] text-[#2563EB] grid place-items-center font-semibold"
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        {initials || "·"}
      </span>
    );
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      loading="lazy"
      className="shrink-0 rounded-2xl object-cover"
      style={{ width: size, height: size }}
    />
  );
}

/* ── Proof variant A — three voices, nothing else ─────────────────────────── */
export function ProofVoices() {
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1000px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Proof</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            Proven by the teams running care <em className="text-[#2563EB]">at scale.</em>
          </h2>
        </motion.div>

        <div className="mt-12 md:mt-14 border-t border-rule">
          {VOICES.map((v, i) => (
            <motion.figure
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              className="m-0 border-b border-rule py-9 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-6 md:gap-12 items-start"
            >
              <blockquote className="m-0">
                <p className="font-serif text-[21px] md:text-[24px] leading-[1.45] text-[#0A1633] m-0">
                  &ldquo;{v.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-4 md:justify-end">
                {v.name ? (
                  <>
                    <Portrait src={v.img} name={v.name} size={56} />
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold text-[#0A1633]">{v.name}</span>
                      <span className="block text-[13px] leading-[1.5] text-ink-soft mt-0.5">{v.role}</span>
                    </span>
                  </>
                ) : (
                  <span className="text-[13px] font-semibold uppercase tracking-[1.1px] text-ink-mute">
                    {v.tag}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.a
          {...fadeUp}
          href="/case-studies"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] no-underline mt-9"
        >
          See all case studies
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
        </motion.a>
      </div>
    </section>
  );
}

/* ── Proof variant B — one quote, three numbers ───────────────────────────── */
export const PROOF_NUMBERS = [
  { v: "90", suf: "%", label: "fewer missed patient calls" },
  { v: "89", suf: "%", label: "less time to respond" },
  { v: "3", suf: "×", label: "more slots filled" },
];

export function ProofOneQuote() {
  const hero = VOICES[0];
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1000px] mx-auto text-center">
        <motion.div {...fadeUp}>
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-8`}>Proof</p>
          {/* Tailwind preflight makes images block-level, so text-center alone
              will not centre the portrait: it needs its own flex row. */}
          <div className="flex justify-center">
            <Portrait src={hero.img} name={hero.name} size={72} />
          </div>
          <blockquote className="m-0 mt-7">
            <p className="font-serif font-normal text-[26px] sm:text-[32px] md:text-[38px] leading-[1.22] text-[#0A1633] mx-auto max-w-[28ch] m-0">
              &ldquo;{hero.quote}&rdquo;
            </p>
          </blockquote>
          <p className="text-[14.5px] font-semibold text-[#0A1633] mt-7 mb-0">{hero.name}</p>
          <p className="text-[13.5px] text-ink-soft mt-1 mb-0">{hero.role}</p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-14 pt-10 border-t border-rule grid grid-cols-1 sm:grid-cols-3 gap-10"
        >
          {PROOF_NUMBERS.map((n) => (
            <div key={n.label}>
              <p className="font-serif font-normal text-[44px] md:text-[52px] leading-none text-[#0A1633] m-0">
                {n.v}
                <span className="text-[#2563EB] text-[0.5em] align-super ml-0.5">{n.suf}</span>
              </p>
              <p className="text-[14px] leading-[1.55] text-ink-soft mt-3 mb-0 max-w-[18ch] mx-auto">{n.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.a
          {...fadeUp}
          href="/case-studies"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] no-underline mt-11"
        >
          See all case studies
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
        </motion.a>

        <motion.p {...fadeUp} className="text-[12.5px] leading-[1.6] text-ink-soft mt-8 mb-0 max-w-[70ch] mx-auto">
          Note: these three numbers are front-desk outcomes and are among the figures the brand
          architecture note asks us to reconcile before publishing. Variant A avoids them.
        </motion.p>
      </div>
    </section>
  );
}

/* ── Proof variant C — the bento's design language, half the tiles ─────────────
 * Matteo, 2026-08-20: keep the designed look, lose the noise. So this is not the
 * editorial treatment of variant A; it is the same vocabulary as the bento (soft
 * blue and lavender gradient tiles, 24px radii, photo cards with a scrim and a
 * caption, pill tags) with three changes:
 *   · six tiles instead of ten
 *   · a regular 3 x 2 grid, every tile the same height, so the eye has a rhythm
 *     instead of a jagged mosaic
 *   · one quote leads, at twice the size of anything else
 * Gradients are the SOFT_TILES values from proof-bento so the two read as the
 * same family.
 */
export const SOFT_BLUE =
  "bg-gradient-to-br from-[#F7F9FF] via-[#EEF2FC] to-[#E1E9F7] border border-rule/70";
export const SOFT_LAV =
  "bg-gradient-to-br from-[#FAFAFF] via-[#F1EFFB] to-[#E7E3F7] border border-rule/70";
export const SOFT_WARM =
  "bg-gradient-to-br from-[#FFFDF9] via-[#FBF4EC] to-[#F7E9DA] border border-rule/70";

export function ProofCalmBento() {
  const hero = VOICES[0];
  const second = VOICES[2];
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Proof</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            Proven by the teams running care <em className="text-[#2563EB]">at scale.</em>
          </h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft max-w-[52ch] mx-auto mt-5 mb-0">
            In the words of the clinicians running it.
          </p>
        </motion.div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(220px,auto)]">
          {/* the lead quote, twice the footprint of anything else */}
          <motion.figure
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.04 }}
            className={`m-0 md:col-span-2 md:row-span-2 rounded-3xl p-8 md:p-10 flex flex-col ${SOFT_BLUE}`}
          >
            <span className="self-start rounded-full bg-paper-bright/80 border border-rule text-[11px] font-bold uppercase tracking-[1.1px] text-ink-soft px-3 py-1">
              {hero.tag}
            </span>
            <blockquote className="m-0 mt-auto pt-10">
              <p className="font-serif font-normal text-[26px] md:text-[32px] leading-[1.3] text-[#0A1633] m-0 max-w-[26ch]">
                &ldquo;{hero.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-4 mt-8">
              <Portrait src={hero.img} name={hero.name} size={52} />
              <span>
                <span className="block text-[14.5px] font-semibold text-[#0A1633]">{hero.name}</span>
                <span className="block text-[13px] text-ink-soft mt-0.5">{hero.role}</span>
              </span>
            </figcaption>
          </motion.figure>

          {/* a face, so the section has a person in it */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src="/avatars/oprandi.webp"
              alt="Dr. G. Oprandi"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-5 left-5 right-5 text-[13.5px] font-medium text-white">
              Dr. G. Oprandi · Orthopedic Surgeon
            </span>
          </motion.div>

          {/* one number, not four */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.16 }}
            className={`rounded-3xl p-8 flex flex-col justify-end ${SOFT_LAV}`}
          >
            <p className="font-serif font-normal text-[52px] leading-none text-[#0A1633] m-0">
              90<span className="text-[#2563EB] text-[0.42em] align-super ml-0.5">%</span>
            </p>
            <p className="text-[14px] leading-[1.5] text-ink-soft mt-3 mb-0">
              fewer missed patient calls
            </p>
          </motion.div>

          {/* the second voice, small */}
          <motion.figure
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`m-0 md:col-span-2 rounded-3xl p-8 flex flex-col justify-between ${SOFT_WARM}`}
          >
            <p className="text-[15.5px] leading-[1.6] text-[#0A1633] m-0">
              &ldquo;{second.quote}&rdquo;
            </p>
            <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-ink-soft mt-6">
              {second.tag}
            </span>
          </motion.figure>

          {/* the way out */}
          <motion.a
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.24 }}
            href="/case-studies"
            className="group relative rounded-3xl overflow-hidden no-underline"
          >
            <img
              src="/avatars/hopsital.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-0 bg-[#050C1A]/45" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-2 bg-paper-bright text-[#0A1633] text-[14px] font-semibold px-5 py-2.5 rounded-full">
                See all case studies
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
              </span>
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

/* ── Proof variant D — one panel, one voice ────────────────────────────────────
 * The whole section is a single soft-gradient panel instead of a grid. The quote
 * is the object; three small numbers sit on a hairline along the bottom of the
 * same panel, so they read as a footnote to the voice rather than as competing
 * tiles. Calmest of the designed options.
 */
export function ProofOnePanel() {
  const hero = VOICES[0];
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <motion.div {...fadeUp} className={`rounded-[32px] p-10 md:p-16 text-center ${SOFT_BLUE}`}>
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-8`}>Proof</p>
          <div className="flex justify-center">
            <Portrait src={hero.img} name={hero.name} size={64} />
          </div>
          <blockquote className="m-0 mt-7">
            <p className="font-serif font-normal text-[26px] sm:text-[32px] md:text-[36px] leading-[1.26] text-[#0A1633] mx-auto max-w-[30ch] m-0">
              &ldquo;{hero.quote}&rdquo;
            </p>
          </blockquote>
          <p className="text-[14.5px] font-semibold text-[#0A1633] mt-7 mb-0">{hero.name}</p>
          <p className="text-[13.5px] text-ink-soft mt-1 mb-0">{hero.role}</p>

          <div className="mt-12 pt-8 border-t border-rule/60 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PROOF_NUMBERS.map((n) => (
              <div key={n.label}>
                <p className="font-serif font-normal text-[34px] leading-none text-[#0A1633] m-0">
                  {n.v}
                  <span className="text-[#2563EB] text-[0.5em] align-super ml-0.5">{n.suf}</span>
                </p>
                <p className="text-[13px] leading-[1.5] text-ink-soft mt-2 mb-0">{n.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Proof variant E — three equal cards ──────────────────────────────────────
 * The symmetrical option: one card per voice, same size, same height, portrait
 * and tag at the top, quote below. Nothing spans, nothing is emphasised, so the
 * section reads as a set rather than a mosaic. Closest to a conventional
 * testimonial row, in the bento's palette.
 */
export function ProofThreeCards() {
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Proof</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            Proven by the teams running care <em className="text-[#2563EB]">at scale.</em>
          </h2>
        </motion.div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOICES.map((v, i) => (
            <motion.figure
              key={i}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
              className={`m-0 rounded-3xl p-8 flex flex-col min-h-[340px] ${
                [SOFT_BLUE, SOFT_LAV, SOFT_WARM][i % 3]
              }`}
            >
              <div className="flex items-center gap-3.5">
                {v.name ? (
                  <>
                    <Portrait src={v.img} name={v.name} size={44} />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-semibold text-[#0A1633] truncate">{v.name}</span>
                      <span className="block text-[12px] leading-[1.4] text-ink-soft mt-0.5">{v.role}</span>
                    </span>
                  </>
                ) : (
                  <span className="rounded-full bg-paper-bright/80 border border-rule text-[11px] font-bold uppercase tracking-[1.1px] text-ink-soft px-3 py-1">
                    {v.tag}
                  </span>
                )}
              </div>
              <blockquote className="m-0 mt-auto pt-8">
                <p className="text-[16px] leading-[1.6] text-[#0A1633] m-0">&ldquo;{v.quote}&rdquo;</p>
              </blockquote>
            </motion.figure>
          ))}
        </div>

        <motion.a
          {...fadeUp}
          href="/case-studies"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] no-underline mt-9"
        >
          See all case studies
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
        </motion.a>
      </div>
    </section>
  );
}

/* ── Proof variant F — a face and a sentence ──────────────────────────────────
 * The editorial split: a full-height portrait on the left, the quote on a soft
 * tile on the right, and the numbers on a hairline underneath. One person, one
 * claim, big. Best if we ever get a real photograph of a customer's clinic.
 */
export function ProofSplit() {
  const hero = VOICES[0];
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="text-center">
          <p className={`${eyebrow} text-[#2563EB] mt-0 mb-4`}>Proof</p>
          <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-[#0A1633] mx-auto max-w-[26ch] m-0">
            Proven by the teams running care <em className="text-[#2563EB]">at scale.</em>
          </h2>
        </motion.div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 items-stretch">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative rounded-3xl overflow-hidden min-h-[380px]"
          >
            <img
              src="/avatars/oprandi.webp"
              alt="Dr. G. Oprandi"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 to-transparent" />
            <span className="absolute bottom-6 left-6 right-6 text-[14px] font-medium text-white">
              Dr. G. Oprandi · Orthopedic Surgeon
            </span>
          </motion.div>

          <motion.figure
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.12 }}
            className={`m-0 rounded-3xl p-9 md:p-12 flex flex-col justify-between ${SOFT_BLUE}`}
          >
            <blockquote className="m-0">
              <p className="font-serif font-normal text-[24px] md:text-[30px] leading-[1.3] text-[#0A1633] m-0 max-w-[28ch]">
                &ldquo;{hero.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-4 mt-10">
              <Portrait src={hero.img} name={hero.name} size={48} />
              <span>
                <span className="block text-[14px] font-semibold text-[#0A1633]">{hero.name}</span>
                <span className="block text-[12.5px] text-ink-soft mt-0.5">{hero.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-10 pt-8 border-t border-rule grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {PROOF_NUMBERS.map((n) => (
            <div key={n.label} className="flex items-baseline gap-3">
              <p className="font-serif font-normal text-[32px] leading-none text-[#0A1633] m-0">
                {n.v}
                <span className="text-[#2563EB] text-[0.5em] align-super ml-0.5">{n.suf}</span>
              </p>
              <p className="text-[13.5px] leading-[1.45] text-ink-soft m-0">{n.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
