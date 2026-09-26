import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Player, type PlayerRef } from "@remotion/player";
import { ArrowRight, Minus, Plus } from "lucide-react";
import {
  OnboardingShowcaseComp,
  ONBOARDING_CHAPTER_LEN,
  ONBOARDING_DURATION,
} from "../remotion/OnboardingShowcaseComp";

/**
 * "Meet your onboarding team" — the answer to the objection that sells the
 * staffing model.
 *
 * From the Matteo / Dr Mohamed call, 2026-08-25: he tried CCM and RPM on
 * eClinicalWorks four years ago and abandoned it because "so many buttons and so
 * many clicks, this is just gonna be too much for us to learn". Not the software,
 * the learning. That is the gap "you do zero, we do everything" fills, and it is
 * the model CY2027 makes unpayable.
 *
 * His spec: one named person per clinic (he cited OpenLoop, a single contact plus
 * their own LMS), and a course layer covering when you run CCM, what PCM
 * requires, where BHI differs. Matteo already runs an AI-tutored LMS.
 *
 * Built exactly like the Compass section (Matteo 2026-08-25: "the onboarding
 * should be like the Compass section"): headline on top, synced accordion left,
 * a Remotion player right on the same gradient tile, three chapters, playing
 * itself while in view and seeking when an item is clicked. The composition is
 * OnboardingShowcaseComp.
 *
 * NO TIME PROMISE anywhere: the labels are sequence, not an SLA. Confirm real
 * timings with Sthita before any "live in N days" claim ships.
 */
type Step = {
  title: string;
  body: string;
  meta: string;
};

const STEPS: Step[] = [
  {
    title: "One owner, named on day one",
    body: "A person, not a ticket queue. They take your clinic from the first call to the first billed month, and they are who you ring when something is unclear.",
    meta: "Your onboarding lead",
  },
  {
    title: "The teaching arrives while you work",
    body: "Not a course you have to find time for. Short lessons that land as you reach each step: when you bill chronic care management, what principal care management needs, where behavioral health integration differs. Watchable between patients, with a tutor to ask when a rule is not obvious.",
    meta: "Learn in the gaps",
  },
  {
    title: "One cohort first, then the panel",
    body: "One program, one group of patients, so your team can read the documentation before anything scales. Expand when the numbers hold, not because a contract says so.",
    meta: "Proof before scale",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
} as const;

const eyebrow = "text-[13px] font-bold tracking-[2.5px] uppercase";

type GetYouLiveStat = { value: string; label: string };

/* `faces`, `note` and `stats` are the merge slots (Matteo 2026-09-26). Passing
   none of them renders the section exactly as it always has, which is what
   RemoteV2 still does. Passing them folds the team roster into this section
   instead of standing a second one up underneath it, because "You're not buying
   software, you're getting a team" and the faces that prove it are one
   argument. Decided on a throwaway trial page, 2026-09-26, and adopted. */
export function GetYouLive({
  faces,
  note,
  stats = [],
}: {
  faces?: ReactNode;
  note?: string;
  stats?: GetYouLiveStat[];
} = {}) {
  const reduce = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const [open, setOpen] = useState(0);

  // Follow playback: derive the open accordion item from the current frame.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reduce) {
      p.pause();
      p.seekTo(70); // hold the named-lead beat as a still
      return;
    }
    if (!inView) {
      p.pause();
      return;
    }
    p.play();
    const retry = setTimeout(() => playerRef.current?.play(), 350);
    const id = setInterval(() => {
      const f = playerRef.current?.getCurrentFrame() ?? 0;
      setOpen(Math.min(2, Math.floor(f / ONBOARDING_CHAPTER_LEN)));
    }, 250);
    return () => {
      clearTimeout(retry);
      clearInterval(id);
    };
  }, [inView, reduce]);

  // Drive playback: clicking an item seeks its chapter.
  const select = (i: number) => {
    setOpen(i);
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(i * ONBOARDING_CHAPTER_LEN + 2);
    if (!reduce) p.play();
  };
  /* The three pieces, built once and placed by whichever layout runs. */
  const accordion = (
    <>
      <div className="border-t border-rule">
        {STEPS.map((step, i) => {
          const on = open === i;
          return (
            <div key={step.title} className="border-b border-rule">
              <button
                onClick={() => select(i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-4 py-5 text-left group bg-transparent border-0 cursor-pointer"
              >
                <span
                  className={`text-[17px] md:text-[18px] font-semibold leading-snug transition-colors duration-300 ${
                    on ? "text-brand" : "text-navy group-hover:text-brand"
                  }`}
                >
                  {step.title}
                </span>
                <span className="shrink-0 mt-0.5 text-slate-400">
                  {on ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-[400ms] ease-out"
                style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="text-[15px] leading-[1.7] text-ink-soft pb-6 pr-6 m-0">{step.body}</p>
                  <p className="text-[12.5px] font-semibold uppercase tracking-[1.2px] text-ink-mute pb-6 m-0">
                    {step.meta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <a
        href="/contact"
        className="group inline-flex items-center gap-2 bg-navy text-white text-[15px] font-semibold pl-6 pr-5 py-3.5 rounded-full no-underline hover:opacity-90 transition-opacity mt-9"
      >
        Talk to us about onboarding
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
      </a>
    </>
  );

  const visual = (
    <div
      className="rounded-[28px] p-4 sm:p-8 md:p-10"
      style={{
        background: [
          "radial-gradient(60% 55% at 18% 12%, rgba(245,158,66,0.18) 0%, rgba(245,158,66,0) 60%)",
          "radial-gradient(65% 60% at 88% 22%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 62%)",
          "radial-gradient(70% 60% at 16% 92%, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 62%)",
          "linear-gradient(150deg, #FAFBFF 0%, #F0F3FA 60%, #EDF0F8 100%)",
        ].join(", "),
      }}
    >
      <Player
        ref={playerRef}
        component={OnboardingShowcaseComp}
        durationInFrames={ONBOARDING_DURATION}
        compositionWidth={760}
        compositionHeight={620}
        fps={30}
        loop
        autoPlay
        initiallyMuted
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        style={{ width: "100%" }}
      />
    </div>
  );

  const intro = (
    <>
      {/* HEADLINE: "a partner", not "a team" (Matteo 2026-09-26). The warmth is
          the point and is safe to say: coming in, meeting people, training
          staff and staying after go-live are none of them furnishing a billable
          service. The one word that was not safe is "team", because a team is
          people, and supplied people who do clinical work is the managed-service
          model the Aug brief bans from the site and HANA's own customer compliance brief
          spends nine pages distancing from. A partner is a relationship, not
          personnel. Keep the warmth, keep the boundary line below it, and do not
          put "a team" back.

          "We build it with you" is the strongest version of the same idea and is
          not just warmer, it is what HANA's pilot proposals already commit to: care
          plans built with the practice's physicians, eligibility and alert
          criteria set by them. Co-design is the opposite of supplying staff, so
          it buys warmth and safety at once. */}
      <p className={`${eyebrow} text-brand mt-0 mb-4`}>The partnership</p>
      <h2 className="font-serif font-normal text-[32px] sm:text-[40px] md:text-[46px] leading-[1.1] text-navy m-0 max-w-[20ch]">
        You're not buying software. <em className="text-ink">You're getting a partner.</em>
      </h2>
      <p className="text-[17px] leading-[1.7] text-ink-soft mt-6 mb-0 max-w-[50ch]">
        Practices don't quit these programs over the billing rules. They quit over a hundred clicks
        and a manual nobody had time to read. So we build it with you. Your clinicians set the
        protocols, we come to you and train your staff, and we stay on it long after you're live.
      </p>
      {note ? (
        <p className="text-[15px] leading-[1.6] text-ink-soft mt-6 mb-0 max-w-[44ch] border-l-2 border-brand/30 pl-4">
          {note}
        </p>
      ) : null}
    </>
  );

  const footnote = (
    <p className="text-[14px] leading-[1.6] text-ink-soft m-0 max-w-[64ch]">
      The staffing model answers this by doing it all for you. If the proposed CY2027 rule is
      finalized, Medicare stops paying for that.
    </p>
  );

  /* MERGED: one grid, two columns, nothing stacked underneath. The claim, the
     steps and the CTA run down the left; the faces sit beside the claim they
     prove and the motion graphic fills the column under them, which is where
     the dead space used to be. Stats and the footnote share one bottom strip on
     the same column rule, so the section reads as a single block rather than
     three. */
  if (faces) {
    return (
      <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
        <div ref={ref} className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,44%)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
            <motion.div {...fadeUp}>
              {intro}
              <div className="mt-10 md:mt-12">{accordion}</div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}>
              <div className="flex lg:justify-end">{faces}</div>
              <div className="mt-10 md:mt-12">{visual}</div>
            </motion.div>
          </div>

          <motion.div
            {...fadeUp}
            className="mt-14 md:mt-16 pt-10 border-t border-rule grid grid-cols-1 lg:grid-cols-[minmax(0,60%)_minmax(0,1fr)] gap-10 lg:gap-12 items-end"
          >
            {stats.length > 0 ? (
              <div className="grid grid-cols-2 gap-8 sm:gap-10">
                {stats.map((st) => (
                  <div key={st.label}>
                    <p className="font-serif text-[42px] md:text-[48px] leading-[0.9] text-navy m-0">
                      {st.value}
                    </p>
                    <span className="inline-block mt-4 rounded-pill bg-paper px-4 py-2 text-[13px] leading-snug text-ink-soft">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div />
            )}
            {footnote}
          </motion.div>
        </div>
      </section>
    );
  }

  /* ORIGINAL: header full width, then accordion beside the graphic. Unchanged,
     and still what /remote-v2 renders. */
  return (
    <section className="bg-paper-bright py-24 md:py-32 px-6 md:px-16">
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <motion.div {...fadeUp} className="mb-12 md:mb-16">
          {intro}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }} className="self-start">
            {accordion}
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}>
            {visual}
          </motion.div>
        </div>

        <motion.div {...fadeUp} className="mt-10">
          {footnote}
        </motion.div>
      </div>
    </section>
  );
}
