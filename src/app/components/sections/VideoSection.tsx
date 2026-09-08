import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "../../../lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * VideoSection — a real video file, in a native <video>.
 *
 * WHY NOT REMOTION, GIVEN THE REPO HAS IT AND USES IT.
 * @remotion/player renders a Remotion COMPOSITION: a React component drawn per
 * frame. It is not a file player. You can wrap an mp4 in <OffthreadVideo>
 * inside a composition and drive that through <Player>, and on a marketing page
 * that is a bad trade -- it ships the Remotion runtime to do what the browser
 * does natively, and costs native fullscreen, picture-in-picture, captions,
 * hardware decode and the browser's own buffering. AccordionPlayer keeps
 * <Player> because there the thing played genuinely IS a composition.
 *
 * BUILT FOR A REMOTE FILE, NOT A COMMITTED ONE.
 * The explainer is expected to live on object storage (Vercel Blob or similar)
 * and arrive here as an absolute URL, because this repo is PUBLIC, has no
 * git-lfs, and the largest blob ever committed to it is 1.56 MB -- a 15 MB
 * video would enter git history permanently, once per re-encode. `sources`
 * takes several encodings so the browser can pick (put the modern codec first,
 * h264 last as the guaranteed fallback).
 *
 * A REMOTE FILE IS WHY THIS COMPONENT HAS STATES A LOCAL ONE WOULD NOT NEED:
 *  · BUFFERING. Tapping play on a 15 MB file over a bad connection does nothing
 *    visible for several seconds. Without a spinner that reads as a dead
 *    button and people tap it again. Driven by `waiting`/`playing`/`canplay`.
 *  · ERROR. A URL can 404, expire, or be blocked by a corporate proxy -- which
 *    is a realistic failure for exactly this audience. On error the frame says
 *    so and offers the direct link, rather than leaving a poster with a play
 *    button that silently does nothing.
 * Both are load-bearing for a hosted file. Do not simplify them away.
 *
 * THE IDLE STATE IS DESIGNED, THE PLAYING STATE IS NATIVE. Before first play:
 * poster, ambient glow, one large play target. On first play `controls` goes on
 * and stays on, handing over the whole native control set rather than a
 * half-built custom one. A second always-visible play/mute pair sits under the
 * frame because the native bar lives inside a dark frame and vanishes between
 * taps on some mobile browsers.
 *
 * AUTOPLAY IS OPT-IN, MUTED, AND GATED ON SCROLL. The rule here used to be
 * "never autoplays, not even muted", on the grounds that this page is read by
 * compliance officers in open-plan offices. That objection was about SOUND, and
 * it still holds: nothing here ever plays audio unasked. What changed is the
 * footage -- the demo now carries BURNED-IN CAPTIONS, so a muted play still
 * communicates, which it would not have when the file was a silent loop with
 * narration to come. Matteo asked for it on 8 Sept 2026 and it is defensible
 * now in a way it was not before.
 *
 * FOUR CONSTRAINTS IT IS BUILT AROUND, none of them optional:
 *  · MUTED OR NOTHING. Every current browser blocks autoplay with audio, so
 *    `autoPlay` implies muted. play() is still wrapped: a rejection falls back
 *    to the poster and the play button rather than leaving a dead frame.
 *  · GATED ON INTERSECTION, NOT ON LOAD. The file is 16MB. Autoplaying at page
 *    load would spend that on every visitor including the ones who never reach
 *    the section. It starts at 45% visibility and PAUSES when scrolled away,
 *    which also stops a decode running behind six other sections.
 *  · REDUCED MOTION MEANS NO AUTOPLAY. A 2.5-minute moving image is exactly
 *    what that preference is for, so the poster holds and the viewer presses
 *    play. This is the reduced-motion case playback did not previously need.
 *  · THE VIEWER MUST BE ABLE TO GET THE SOUND. There IS narration, so a muted
 *    autoplay silently withholds half the content. The unmute control is
 *    promoted into the frame while muted rather than sitting under it, and
 *    unmuting once is remembered for the session so scrolling back does not
 *    re-mute.
 *
 * PRERENDER SAFETY. preload="metadata" means the headless snapshot fetches a
 * few KB of container, not the file -- and for a remote URL it may fetch
 * nothing at all. Headline, body and note are plain DOM, so the crawler gets
 * the section's text regardless. That text plus the captions track is the ONLY
 * indexable content here; a video itself contributes nothing to a crawler.
 *
 * PARALLAX IS DIFFERENTIAL, WHICH IS THE ONLY VERSION THAT READS AS DEPTH.
 * Three layers move at three rates off one scroll progress: the glow furthest
 * (it is the notional "background"), the frame a little, and the video inside
 * the frame a little the other way. One element sliding is not parallax, it is
 * a moving div, and it looks cheap at any amplitude. Amplitudes are small on
 * purpose -- this is a 12,000-word billing site, not a product launch, and a
 * frame that visibly swims while someone reads a CPT code is worse than no
 * effect at all.
 *
 * MECHANICS, AND WHY EACH CHOICE.
 *  · useScroll(target, ["start end", "end start"]) gives 0 as the section's top
 *    enters the viewport bottom and 1 as its bottom leaves the top, so the
 *    midpoint is "section centred" and every layer's rest position is its
 *    designed position. Offsets keyed to the viewport instead would drift with
 *    viewport height.
 *  · useSpring over the raw progress. A transform bound straight to scroll
 *    reproduces every trackpad tick, which on a 60fps display reads as jitter
 *    rather than motion. Low stiffness, high damping: it smooths without
 *    lagging behind the thumb.
 *  · TRANSFORM ONLY. y and scale, never top/margin/height, so the browser
 *    stays on the compositor and the effect cannot cause layout shift or move
 *    anything the aspect box already reserved.
 *  · The inner layer is scaled slightly so it has room to travel without
 *    exposing an edge inside the frame. THAT SCALE COSTS EXTRA CROP on top of
 *    whatever `aspect` already crops, which is the real price of inner
 *    parallax -- kept at 1.06 so it is a few percent, not a reframe.
 *  · OFF ENTIRELY under prefers-reduced-motion, where every layer renders at
 *    its rest position rather than at progress 0. A parallax that merely
 *    slows down is still parallax.
 *
 * ASPECT RATIO IS A PROP, AND IT DECIDES THE CROP.
 * The frame reserves its space from `aspect`, and the video is object-cover
 * inside it. So a value that does not match the file does NOT letterbox and
 * does NOT shift the layout -- it silently CROPS, centred, losing the top and
 * bottom (or the sides) of every frame. That is the failure to watch for: a
 * 16/9 box over a square file looks intentional and quietly cuts the subject's
 * head off. Set it from the real file's dimensions, and if you deliberately
 * mismatch it (a square placeholder previewed at 16/9, say) know that you are
 * choosing a crop.
 * ─────────────────────────────────────────────────────────────────────────── */

export interface VideoSource {
  src: string;
  /** e.g. 'video/mp4; codecs="avc1.42E01E"' or just 'video/webm'. The browser
   *  picks the first it can play, so order matters: modern first, h264 last. */
  type?: string;
}

export interface VideoSectionProps {
  /** A single file: path under public/, or an absolute URL (the expected case). */
  src?: string;
  /** Several encodings, tried in order. Use instead of `src`, not alongside. */
  sources?: VideoSource[];
  /** Still frame shown before first play. Without one the browser shows a black
   *  rectangle until it has decoded a frame, and the glow has nothing to sample. */
  poster?: string;
  /** CSS aspect-ratio for the frame. MUST match the file. */
  aspect?: string;
  /** WebVTT captions. Also the transcript, and the only part a crawler reads. */
  captionsSrc?: string;
  /** Set when the video and captions are cross-origin AND you need canvas or
   *  text-track access. Requires CORS headers on the bucket; if they are
   *  missing this BLOCKS playback, so leave it undefined unless needed. */
  crossOrigin?: "anonymous" | "use-credentials";
  eyebrow?: string;
  heading?: ReactNode;
  body?: string;
  /** Text under the frame: what the viewer is about to see, for anyone who
   *  will not or cannot play it. */
  note?: ReactNode;
  /** Length beside the play button, e.g. "1:20". Sets expectations. */
  duration?: string;
  /** Start playing, muted, once the frame is 45% visible. Implies muted, is
   *  ignored under prefers-reduced-motion, and pauses when scrolled away.
   *  Only sensible for footage that reads without sound. */
  autoPlay?: boolean;
  /** Centre the eyebrow, heading, body and note, and centre their measures.
   *  Left-aligned is the site default and stays the default; centring suits a
   *  section whose subject is one object under the text. */
  align?: "start" | "center";
  /** Differential scroll parallax across glow, frame and video. Off under
   *  prefers-reduced-motion regardless. See the docblock. */
  parallax?: boolean;
  /** The blurred poster bloom behind the frame. Cheap (one scaled <img>, no
   *  per-frame canvas work) and it is what makes the frame read as placed
   *  rather than pasted. Off automatically with no poster or reduced motion. */
  glow?: boolean;
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
  sources,
  poster,
  aspect = "16 / 9",
  captionsSrc,
  crossOrigin,
  eyebrow = "See it work",
  heading,
  body,
  note,
  duration,
  autoPlay = false,
  align = "start",
  parallax = false,
  glow = true,
  tone = "band",
  className,
  id,
}: VideoSectionProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  /** True while autoplay is driving playback and the viewer has not unmuted. */
  const [autoMuted, setAutoMuted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  /** Once the viewer unmutes, never re-mute on a later scroll-in. */
  const unmutedOnce = useRef(false);

  /* Scroll-gated muted autoplay. Deliberately keyed to the FIGURE rather than
     the section, so it fires on the frame being visible and not on the heading
     scrolling past. 45% keeps it from starting on a sliver. */
  useEffect(() => {
    if (!autoPlay || reduce) return;
    const el = figureRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        const vid = videoRef.current;
        if (!vid || failed) return;
        if (e.isIntersecting) {
          if (!unmutedOnce.current) { vid.muted = true; setAutoMuted(true); }
          vid.play().catch(() => { setStarted(false); setAutoMuted(false); });
        } else if (!vid.paused) {
          vid.pause();
        }
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlay, reduce, failed]);

  /* 0 as the section enters from the bottom, 1 as it leaves past the top, so
     0.5 is "centred" and every layer rests where it was designed to sit. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  /* Smoothed, or each trackpad tick shows up as jitter. */
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 });

  const glowY = useTransform(p, [0, 1], [56, -56]);
  const frameY = useTransform(p, [0, 1], [22, -22]);
  const innerY = useTransform(p, [0, 1], ["-2.5%", "2.5%"]);

  /** The direct link offered when playback fails. */
  const directHref = src ?? sources?.[sources.length - 1]?.src;

  const start = useCallback(() => {
    const v = videoRef.current;
    if (!v || failed) return;
    setStarted(true);
    setBuffering(true);
    v.play().catch(() => {
      /* A blocked or failed play() must not leave the overlay hidden over a
         dead frame: put the poster back so the viewer can try again. */
      setStarted(false);
      setPlaying(false);
      setBuffering(false);
    });
  }, [failed]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) start();
    else v.pause();
  }, [start]);

  /* Mirror the element rather than tracking state ourselves: native controls,
     the keyboard, PiP and the network all change it behind our back. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => { setPlaying(true); setStarted(true); };
    const onPlaying = () => { setPlaying(true); setBuffering(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    const onVol = () => setMuted(v.muted);
    const onError = () => { setFailed(true); setBuffering(false); setStarted(false); };
    v.addEventListener("play", onPlay);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("volumechange", onVol);
    v.addEventListener("error", onError);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("volumechange", onVol);
      v.removeEventListener("error", onError);
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

  /* The frame gets a slightly later, slightly scaled entrance so it settles
     after the copy rather than with it. */
  const frameIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28, scale: 0.985 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] as const },
      };

  const showGlow = glow && !!poster && !reduce;
  const px = parallax && !reduce;
  const mid = align === "center";
  /* Centring is three coordinated changes, not one: the text-align, the
     auto-margins on each measure, and the figcaption. Miss the margins and a
     62ch paragraph stays left while its words centre inside it. */
  const centre = mid ? "text-center" : "";
  const measure = mid ? "mx-auto" : "";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("scroll-mt-24 py-20 md:py-24 px-6 md:px-16", TONE[tone], className)}
    >
      <div className="max-w-[1000px] mx-auto">
        <motion.div {...fade} className={centre}>
          {eyebrow && (
            <p className="text-eyebrow font-bold uppercase text-ink-mute m-0 mb-4">{eyebrow}</p>
          )}
          {heading && (
            <h2 className={cn("font-serif text-h2 text-ink m-0 mb-3 max-w-[24ch]", measure)}>
              {heading}
            </h2>
          )}
          {body && (
            <p className={cn("text-[16.5px] leading-[1.7] text-ink-soft m-0 mb-8 max-w-[62ch]", measure)}>
              {body}
            </p>
          )}
        </motion.div>

        <motion.figure ref={figureRef} {...frameIn} className="m-0 relative">
          {/* Ambient bloom: the poster again, scaled up, blurred, behind the
              frame. Decorative and inert. One <img> the browser has already
              cached for the poster, so it costs a paint and no extra request. */}
          {showGlow && (
            <motion.img
              src={poster}
              alt=""
              aria-hidden
              style={px ? { y: glowY } : undefined}
              className="pointer-events-none absolute -inset-6 -z-10 h-[calc(100%+3rem)] w-[calc(100%+3rem)] scale-[1.04] rounded-card object-cover opacity-30 blur-[42px] saturate-150"
            />
          )}

          <motion.div
            className="relative overflow-hidden rounded-card border border-rule bg-navy shadow-card"
            style={px ? { aspectRatio: aspect, y: frameY } : { aspectRatio: aspect }}
          >
            {/* The inner layer travels the opposite way to the frame. Scaled
                so it has room to move without exposing an edge; that scale is
                extra crop on top of `aspect`, hence 1.06 and not more. */}
            <motion.video
              ref={videoRef}
              src={sources ? undefined : src}
              poster={poster}
              controls={started && !failed}
              controlsList="nodownload"
              crossOrigin={crossOrigin}
              playsInline
              preload="metadata"
              style={px ? { y: innerY, scale: 1.06 } : undefined}
              className="absolute inset-0 h-full w-full object-cover"
              onClick={started ? undefined : start}
            >
              {sources?.map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
              {captionsSrc && (
                <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
              )}
            </motion.video>

            {/* Idle state. Unmounted for good on first play so native controls
                never fight an overlay for the pointer. */}
            {!started && !failed && (
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

            {/* THE UNMUTE PROMPT. A muted autoplay withholds the narration, so
                this sits IN the frame rather than under it, and only while the
                autoplay is the thing that muted it. Clicking it also sets
                unmutedOnce, so scrolling away and back does not re-mute. */}
            {autoMuted && started && !failed && (
              <button
                type="button"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = false;
                  unmutedOnce.current = true;
                  setAutoMuted(false);
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-pill bg-paper-bright/95 px-5 py-2.5 text-[14px] font-semibold text-ink shadow-float backdrop-blur-sm hover:bg-paper-bright transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <VolumeX size={15} className="text-brand" aria-hidden />
                Tap for sound
              </button>
            )}

            {/* Buffering. The reason this exists: on a hosted file, play() can
                take seconds before a frame moves, and a play button that
                appears to do nothing gets tapped again. */}
            {buffering && !failed && (
              <div
                role="status"
                aria-live="polite"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/25"
              >
                <span className="flex items-center gap-3 rounded-pill bg-paper-bright px-5 py-3 shadow-float">
                  <Loader2 size={17} className="animate-spin text-brand" aria-hidden />
                  <span className="text-[14.5px] font-semibold text-ink">Loading</span>
                </span>
              </div>
            )}

            {/* Error. A hosted URL can 404, expire, or be stopped by a
                corporate proxy, which is a real failure mode for this audience. */}
            {failed && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-[42ch] rounded-tile border border-rule bg-paper-bright p-5 text-center">
                  <TriangleAlert size={20} className="mx-auto mb-2 text-signal-amber" aria-hidden />
                  <p className="text-[15px] font-semibold text-ink m-0">The video would not load.</p>
                  <p className="text-[14px] leading-[1.55] text-ink-soft m-0 mt-1.5">
                    Some networks block video. The note below says what it shows.
                  </p>
                  {directHref && (
                    <a
                      href={directHref}
                      className="mt-3 inline-block text-[14px] font-semibold text-ink underline underline-offset-4 decoration-rule hover:decoration-ink-soft"
                    >
                      Open the file directly
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {started && !failed && (
            <div className={cn("mt-3 flex items-center gap-2", mid && "justify-center")}>
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
                  if (!v) return;
                  v.muted = !v.muted;
                  if (!v.muted) { unmutedOnce.current = true; setAutoMuted(false); }
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
            <figcaption
              className={cn("mt-5 text-[14.5px] leading-[1.65] text-ink-soft max-w-[70ch]", measure, centre)}
            >
              {note}
            </figcaption>
          )}
        </motion.figure>
      </div>
    </section>
  );
}

export default VideoSection;
