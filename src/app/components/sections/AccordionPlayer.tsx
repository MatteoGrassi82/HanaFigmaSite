import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { Player, type PlayerRef } from "@remotion/player";
import {
  CompassShowcaseComp,
  COMPASS_CHAPTER_LEN,
  COMPASS_DURATION,
} from "../remotion/CompassShowcaseComp";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * AccordionPlayer — one accordion wired to one Remotion <Player>.
 *
 * Replaces three near-identical copies of the same pattern: CompassShowcase and
 * CompanionShowcase (both inline in RemoteV2.tsx) and GetYouLive. Each had its
 * own copy of the two-way sync, its own gradient tile and its own accordion
 * markup, and they had already drifted apart in three places (see below).
 *
 * THE TWO-WAY SYNC, which is the whole point of the section
 *  · PLAYBACK DRIVES THE ACCORDION. A 250ms poll reads
 *    playerRef.current.getCurrentFrame() and derives the open row from
 *    floor(frame / chapterLen). Remotion's Player has no per-frame subscription
 *    worth using here, so polling is the mechanism, not a shortcut.
 *  · THE ACCORDION DRIVES PLAYBACK. Clicking row i seeks to
 *    i * chapterLen + 2. The +2 IS LOAD-BEARING: seeking to the exact chapter
 *    boundary lands on a frame the next poll can still floor into the previous
 *    chapter (and the compositions animate their entrance from t0, so frame 0 of
 *    a chapter is its empty state). Two frames in, the chapter is unambiguous
 *    and the poll agrees with the click. Do not "tidy" it away.
 *  · The player runs only while in view, and reduced motion pins it to a still
 *    frame instead (stillFrame).
 *
 * THE PLAYER TAKES A WIDTH-ONLY STYLE. `style={{ width: "100%" }}`, never a
 * height. Giving it height:"auto" collapses the Player to an ~80px sliver, which
 * is how the Compass version ended up the reference implementation.
 *
 * PRERENDER. The build snapshots every route in headless Chrome at 800x600 and
 * never scrolls, so this section is below the fold when the HTML is captured.
 * Two things follow, and both were wrong in the originals:
 *  · NO `whileInView` ENTRANCE. All three wrapped the heading, the accordion and
 *    the tile in motion fadeUp. The observer never fires in the snapshot, so
 *    Motion baked opacity:0 onto the heading and onto every row. The header and
 *    the columns render static here. The animation this section is actually
 *    about (the Player, the row colour transition, the disclosure) is untouched.
 *  · THE ROW BODY IS ALWAYS MOUNTED. Compass and Companion rendered it as
 *    {open && <motion.div>} inside AnimatePresence, so none of that copy existed
 *    in the prerendered HTML. It collapses the FaqSection way instead: a CSS
 *    grid row animated 0fr → 1fr over overflow-hidden content, no opacity on the
 *    collapsed state. Do not turn this back into {open && …}.
 *
 * TOKENS. No hex, except the two gradient presets: those are artwork values with
 * no token equivalent, carried over verbatim so the tiles look identical. They
 * want lifting into tokens.css as --gradient-tile-cool / --gradient-tile-warm;
 * that is a second-file change, so it has not been done here.
 *
 * CALL-SITE DELTAS, so the merge is deliberate rather than a surprise. Compass
 * and Companion port with no visual change at all. GetYouLive picks up three:
 *  · Its section ground was `bg-paper-bright`; tone="light" is `bg-paper`. Both
 *    resolve to #ffffff today, so nothing moves. If the two ever diverge, the
 *    call site passes className="bg-paper-bright" and cn merges it last.
 *  · Its row body was `pb-6 pr-6`; this uses Compass's `pb-5 pr-8`, which is
 *    also FaqSection's.
 *  · Its disclosure ran 400ms ease-out; this runs Compass's 300ms, and keeps
 *    ease-in-out because that is what two of the three originals used.
 * Nothing else differs. The two-way sync, the +2, the geometry, the tiles, the
 * player sizes, the still frame and every word of copy are carried verbatim.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface AccordionPlayerItem {
  /** The row label. Also the React key, so keep them distinct. */
  title: string;
  body: string;
  /** Small caps line under the body (the onboarding rows use it). */
  meta?: string;
  /**
   * Anything else that belongs to THIS row: the language pills, a chip row.
   * It is ALWAYS MOUNTED, including while the row is collapsed (see the
   * PRERENDER note above), so keep it inert: text, pills, chips. A link or a
   * button here stays in the tab order behind a zero-height row. A CTA goes in
   * `accordionFooter`, which sits outside every panel.
   */
  extra?: ReactNode;
}

/** A gradient tile behind the Player. Two presets, or bring your own. */
export type AccordionPlayerTile =
  | "cool"
  | "warm"
  | { background?: string; className?: string };

export interface AccordionPlayerProps {
  eyebrow?: string;
  /** ReactNode so a page can accent part of it with an <em>. */
  heading?: ReactNode;
  body?: string;
  /** The rows. One per chapter of the composition, in chapter order. */
  items?: AccordionPlayerItem[];
  /** The Remotion composition. Defaults to the Compass one. */
  comp?: ComponentType<Record<string, never>>;
  /** Frames per chapter. Must be the composition's own CHAPTER_LEN. */
  chapterLen?: number;
  /** Total frames. Must be the composition's own DURATION. */
  duration?: number;
  /** compositionWidth / compositionHeight. The Player is width-fitted. */
  playerSize?: { width: number; height: number };
  fps?: number;
  /** The frame held as a still for reduced-motion visitors. */
  stillFrame?: number;
  /** Which side the Player sits on. The accordion takes the other. */
  side?: "left" | "right";
  /** Vertical alignment of the accordion against the taller Player tile. */
  accordionAlign?: "center" | "start";
  tile?: AccordionPlayerTile;
  /** Extra width class for the heading, e.g. "max-w-[20ch]". */
  headingClassName?: string;
  /** Sits under the accordion, inside its column. A CTA, usually. */
  accordionFooter?: ReactNode;
  /** Sits under the whole grid, full width. */
  footnote?: ReactNode;
  /** "light" is paper ground; "band" is the tinted section ground with rules. */
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

/* The Compass / onboarding tile: cool paper with three soft blooms. The tile has
   padding, so the composition floats inside it. */
const TILE_COOL = {
  className: "p-4 sm:p-8 md:p-10",
  background: [
    "radial-gradient(60% 55% at 18% 12%, rgba(245,158,66,0.18) 0%, rgba(245,158,66,0) 60%)",
    "radial-gradient(65% 60% at 88% 22%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 62%)",
    "radial-gradient(70% 60% at 16% 92%, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 62%)",
    "linear-gradient(150deg, #FAFBFF 0%, #F0F3FA 60%, #EDF0F8 100%)",
  ].join(", "),
};

/* The companion tile: warm pastel, and NO padding. The composition bleeds to the
   rounded edge, which is why this one clips instead. */
const TILE_WARM = {
  className: "overflow-hidden",
  background: [
    "radial-gradient(120% 90% at 12% 88%, #F2DCEF 0%, rgba(242,220,239,0) 55%)",
    "radial-gradient(110% 80% at 88% 14%, #B9CDF5 0%, rgba(185,205,245,0) 58%)",
    "radial-gradient(90% 70% at 42% 34%, #F6E3CE 0%, rgba(246,227,206,0) 60%)",
    "#EDEFF6",
  ].join(", "),
};

const TONE = {
  light: {
    section: "bg-paper",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
    rule: "border-rule",
    title: "text-navy group-hover:text-brand",
    titleOn: "text-brand",
    icon: "text-ink-mute",
    answer: "text-ink-soft",
    meta: "text-ink-mute",
    ring: "focus-visible:ring-brand",
  },
  band: {
    section: "bg-band border-y border-rule",
    eyebrow: "text-brand",
    heading: "text-navy [&_em]:italic [&_em]:font-normal [&_em]:text-brand",
    body: "text-ink-soft",
    rule: "border-rule",
    title: "text-navy group-hover:text-brand",
    titleOn: "text-brand",
    icon: "text-ink-mute",
    answer: "text-ink-soft",
    meta: "text-ink-mute",
    ring: "focus-visible:ring-brand",
  },
} as const;

/** The Compass rows. Safe defaults: no pricing, no codes, no competitor. */
const DEFAULT_ITEMS: AccordionPlayerItem[] = [
  {
    title: "One flagged worklist, not a phone queue",
    body: "Every call is scored against your protocol. Only the flags surface, each with the call behind it and a named owner.",
  },
  {
    title: "Billing documentation, ready to attest",
    body: "The note is written the moment the call ends, and the minutes are attributed to whoever earned them. You see what is ready to sign, across every program you run.",
  },
  {
    title: "An audit trail that assembles itself",
    body: "Who was flagged, who got it, what they did, when they signed. Any month, any patient, one export.",
  },
];

export function AccordionPlayer({
  eyebrow = "For your clinic",
  heading = (
    <>
      Your team sees four patients. <em>HANA called two hundred.</em>
    </>
  ),
  body,
  items = DEFAULT_ITEMS,
  comp = CompassShowcaseComp,
  chapterLen = COMPASS_CHAPTER_LEN,
  duration = COMPASS_DURATION,
  playerSize = { width: 760, height: 620 },
  fps = 30,
  stillFrame = 70,
  side = "right",
  accordionAlign = "center",
  tile = "cool",
  headingClassName = "max-w-[16ch]",
  accordionFooter,
  footnote,
  tone = "light",
  className,
  id,
}: AccordionPlayerProps = {}) {
  const reduce = useReducedMotion();
  const playerRef = useRef<PlayerRef>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const [open, setOpen] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId();
  const headingId = `${uid}-ap-heading`;
  const skin = TONE[tone];
  const last = items.length - 1;
  const tileSkin = tile === "cool" ? TILE_COOL : tile === "warm" ? TILE_WARM : tile;

  // PLAYBACK DRIVES THE ACCORDION. Poll the frame while the section is on
  // screen; reduced motion holds a still instead of ever playing.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reduce) {
      p.pause();
      p.seekTo(stillFrame);
      return;
    }
    if (!inView) {
      p.pause();
      return;
    }
    p.play();
    // Remotion's play() can no-op before the Player is fully mounted, so retry once.
    const retry = setTimeout(() => playerRef.current?.play(), 350);
    const poll = setInterval(() => {
      const f = playerRef.current?.getCurrentFrame() ?? 0;
      setOpen(Math.min(last, Math.floor(f / chapterLen)));
    }, 250);
    return () => {
      clearTimeout(retry);
      clearInterval(poll);
    };
  }, [inView, reduce, chapterLen, last, stillFrame]);

  // THE ACCORDION DRIVES PLAYBACK. See the +2 note at the top of the file.
  const select = useCallback(
    (i: number) => {
      setOpen(i);
      const p = playerRef.current;
      if (!p) return;
      p.seekTo(i * chapterLen + 2);
      if (!reduce) p.play();
    },
    [chapterLen, reduce],
  );

  // Arrow keys walk the rows, Home and End jump to the ends.
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      let next = -1;
      if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next < 0) return;
      e.preventDefault();
      buttons.current[next]?.focus();
    },
    [last],
  );

  const accordion = (
    <div className={cn("border-t", skin.rule, accordionAlign === "start" && "self-start")}>
      {items.map((item, i) => {
        const on = open === i;
        const btnId = `${uid}-ap-q-${i}`;
        const panelId = `${uid}-ap-a-${i}`;
        return (
          <div key={item.title} className={cn("border-b", skin.rule)}>
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-expanded={on}
                aria-controls={panelId}
                className={cn(
                  "group w-full flex items-start justify-between gap-4 py-5 text-left",
                  "bg-transparent border-0 cursor-pointer rounded-tile",
                  // outline-hidden, not outline-none: in Tailwind 4 outline-none
                  // is outline-style:none, which kills the ring in forced colors.
                  "focus-visible:outline-hidden focus-visible:ring-2",
                  skin.ring,
                )}
              >
                <span
                  className={cn(
                    "text-[17px] md:text-[18px] font-semibold leading-snug transition-colors duration-300",
                    on ? skin.titleOn : skin.title,
                  )}
                >
                  {item.title}
                </span>
                <span className={cn("shrink-0 mt-0.5", skin.icon)}>
                  {on ? (
                    <Minus aria-hidden="true" className="w-4 h-4" />
                  ) : (
                    <Plus aria-hidden="true" className="w-4 h-4" />
                  )}
                </span>
              </button>
            </h3>

            {/* ALWAYS MOUNTED. Collapsed is a 0fr grid row over overflow-hidden
                content, so every word is in the prerendered HTML. No opacity on
                the collapsed state, and never {on && …}. */}
            <div
              id={panelId}
              aria-labelledby={btnId}
              className={cn(
                "grid motion-reduce:transition-none",
                reduce ? "" : "transition-[grid-template-rows] duration-300 ease-in-out",
              )}
              style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className={cn("text-[15px] leading-[1.7] pb-5 pr-8 m-0", skin.answer)}>
                  {item.body}
                </p>
                {item.meta ? (
                  <p
                    className={cn(
                      "text-[12.5px] font-semibold uppercase tracking-[1.2px] pb-6 m-0",
                      skin.meta,
                    )}
                  >
                    {item.meta}
                  </p>
                ) : null}
                {item.extra}
              </div>
            </div>
          </div>
        );
      })}
      {accordionFooter}
    </div>
  );

  const stage = (
    <div>
      <div
        className={cn("rounded-[28px]", tileSkin.className)}
        style={{ background: tileSkin.background } as CSSProperties}
      >
        {/* WIDTH ONLY. A height here collapses the Player to a sliver. */}
        <Player
          ref={playerRef}
          component={comp}
          durationInFrames={duration}
          compositionWidth={playerSize.width}
          compositionHeight={playerSize.height}
          fps={fps}
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
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(skin.section, "py-24 md:py-32 px-6 md:px-16 scroll-mt-24", className)}
    >
      <div ref={ref} className="max-w-[1200px] mx-auto">
        {/* Plain <div>, not motion.div. See the PRERENDER note at the top. */}
        <div className="mb-12 md:mb-16">
          {eyebrow ? (
            <p className={cn("text-eyebrow font-bold uppercase mt-0 mb-4", skin.eyebrow)}>
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              "font-serif font-normal m-0 text-[32px]/[1.1] sm:text-[40px]/[1.1] md:text-h2 md:leading-[1.1]",
              skin.heading,
              headingClassName,
            )}
          >
            {heading}
          </h2>
          {body ? (
            <p className={cn("text-[17px] leading-[1.7] mt-6 mb-0 max-w-[54ch]", skin.body)}>
              {body}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-12 lg:gap-16 items-center",
            side === "right"
              ? "lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)]",
          )}
        >
          {side === "right" ? (
            <>
              {accordion}
              {stage}
            </>
          ) : (
            <>
              {stage}
              {accordion}
            </>
          )}
        </div>

        {footnote}
      </div>
    </section>
  );
}
