import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * VideoSection — a real .mp4, in a native <video>.
 *
 * WHY NOT REMOTION, SINCE THE REPO ALREADY HAS IT.
 * @remotion/player renders a Remotion COMPOSITION: a React component drawn per
 * frame. It is not an .mp4 player. You can wrap a file in <OffthreadVideo>
 * inside a composition and drive that through <Player>, and on a marketing page
 * that is a bad trade: it ships the Remotion runtime to do what the browser
 * does natively, and it costs you native fullscreen, picture-in-picture,
 * captions, hardware decode and the browser's own buffering. AccordionPlayer is
 * the right home for <Player>, because there the thing being played genuinely
 * IS a composition. Here it is a file. Different tool.
 *
 * THE IDLE STATE IS THE DESIGNED ONE, THE PLAYING STATE IS THE NATIVE ONE.
 * Before first play the video is covered by a poster and one large play target,
 * so the section looks composed rather than like a browser widget parked in a
 * page. On first play `controls` is switched on and stays on, which hands the
 * viewer the whole native control set (scrub, fullscreen, PiP, speed, captions,
 * download-block honouring) instead of a half-built custom one. Custom chrome
 * for a marketing video is a lot of code to end up worse than the platform.
 *
 * IT NEVER AUTOPLAYS. Not muted-autoplay either. A care-coordination page is
 * read by compliance officers in open-plan offices, and an explainer that
 * starts talking on scroll is the kind of thing that gets a site closed. It
 * also means no reduced-motion special case is needed for playback: nothing
 * moves until a person asks it to. `useReducedMotion` here only governs the
 * section's own entrance.
 *
 * PRERENDER SAFETY. preload="metadata" means the headless snapshot fetches a
 * few KB of container, not the file. The headline, body and transcript slot are
 * plain DOM, so the crawler gets the section's text whether or not it can play
 * video, which is the only part of this section that is indexable at all.
 *
 * ASPECT RATIO IS A PROP AND MUST MATCH THE FILE. The wrapper reserves space
 * with `aspect-ratio` so nothing reflows when the file loads. Pass the real
 * ratio: public/video1.mp4 is 1080x1080, which is "1 / 1", NOT the 16/9 a
 * default would assume. Getting this wrong letterboxes the video inside a box
 * of the wrong shape and the layout shifts on load.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface VideoSectionProps {
  /** Path under public/, or an absolute URL. */
  src: string;
  /** Still frame shown before first play. Strongly recommended: without one the
   *  browser shows a black rectangle until it has decoded a frame. */
  poster?: string;
  /** CSS aspect-ratio for the frame. MUST match the file. */
  aspect?: string;
  /** WebVTT captions. A spoken explainer without these is not accessible, and
   *  on this site it is also a lost transcript the crawler could have read. */
  captionsSrc?: string;
  eyebrow?: string;
  heading?: ReactNode;
  body?: string;
  /** Text under the frame: what the viewer is about to see, in words, for
   *  anyone who will not or cannot play it. */
  note?: ReactNode;
  /** Length shown beside the play button, e.g. "1:20". Set expectations. */
  duration?: string;
  tone?: "light" | "band";
  className?: string;
  id?: string;
}

const TONE = {
  light: "bg-paper",
  band: "bg-band border-y border-rule",
} as const;

export function VideoSection({
  src,
  poster,
  aspect = "16 / 9",
  captionsSrc,
  eyebrow = "See it work",
  heading,
  body,
  note,
  duration,
  tone = "band",
  className,
  id,
}: VideoSectionProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  /* One play path, used by the overlay button and by the keyboard. */
  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => {
      /* A blocked play() must not leave the overlay hidden over a dead frame:
         put the poster back so the viewer can try again. */
      setStarted(false);
      setPlaying(false);
    });
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) start();
    else v.pause();
  }, [start]);

  /* Mirror the element's own state rather than tracking it ourselves: the
     native controls, the keyboard and PiP can all change it behind our back. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => { setPlaying(true); setStarted(true); };
    const onPause = () => setPlaying(false);
    const onVol = () => setMuted(v.muted);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVol);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVol);
    };
  }, []);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.5 },
      };

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", TONE[tone], className)}
    >
      <div className="max-w-[1000px] mx-auto">
        <motion.div {...fade}>
          {eyebrow && (
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="font-serif text-h2 text-ink m-0 mb-3 max-w-[24ch]">{heading}</h2>
          )}
          {body && (
            <p className="text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]">{body}</p>
          )}
        </motion.div>

        <motion.figure {...fade} className="m-0">
          <div
            className="relative overflow-hidden rounded-card border border-rule bg-navy shadow-card"
            style={{ aspectRatio: aspect }}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls={started}
              controlsList="nodownload"
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onClick={started ? undefined : start}
            >
              {captionsSrc && (
                <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
              )}
            </video>

            {/* The designed idle state. Removed for good on first play so the
                native controls are never fighting an overlay for the pointer. */}
            {!started && (
              <button
                type="button"
                onClick={start}
                aria-label={`Play the video${duration ? `, ${duration}` : ""}`}
                className="group absolute inset-0 flex items-center justify-center bg-navy/35 transition-colors hover:bg-navy/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-soft"
              >
                <span className="flex items-center gap-4 rounded-pill bg-paper-bright px-6 py-4 shadow-float transition-transform group-hover:scale-[1.03]">
                  <Play size={20} className="text-brand" aria-hidden />
                  <span className="text-[16px] font-semibold text-ink">Play</span>
                  {duration && (
                    <span className="text-[14px] tabular-nums text-ink-mute">{duration}</span>
                  )}
                </span>
              </button>
            )}
          </div>

          {/* A second, always-present control pair. The native bar is inside a
              dark frame and disappears on some mobile browsers between taps;
              these stay put and stay keyboard-reachable. */}
          {started && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="inline-flex items-center gap-2 rounded-pill border border-rule bg-paper-bright px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const v = videoRef.current;
                  if (v) v.muted = !v.muted;
                }}
                aria-label={muted ? "Unmute" : "Mute"}
                className="inline-flex items-center gap-2 rounded-pill border border-rule bg-paper-bright px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {muted ? <VolumeX size={15} aria-hidden /> : <Volume2 size={15} aria-hidden />}
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
          )}

          {note && (
            <figcaption className="mt-5 text-[14.5px] leading-[1.65] text-ink-soft max-w-[70ch]">
              {note}
            </figcaption>
          )}
        </motion.figure>
      </div>
    </section>
  );
}

export default VideoSection;
