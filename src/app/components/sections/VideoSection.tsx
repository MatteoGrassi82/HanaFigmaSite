import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
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
 * IT NEVER AUTOPLAYS, not even muted. This page is read by compliance officers
 * in open-plan offices. That also means playback needs no reduced-motion case:
 * nothing moves until a person asks. useReducedMotion governs the entrance and
 * the glow only.
 *
 * PRERENDER SAFETY. preload="metadata" means the headless snapshot fetches a
 * few KB of container, not the file -- and for a remote URL it may fetch
 * nothing at all. Headline, body and note are plain DOM, so the crawler gets
 * the section's text regardless. That text plus the captions track is the ONLY
 * indexable content here; a video itself contributes nothing to a crawler.
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

        <motion.figure {...frameIn} className="m-0 relative">
          {/* Ambient bloom: the poster again, scaled up, blurred, behind the
              frame. Decorative and inert. One <img> the browser has already
              cached for the poster, so it costs a paint and no extra request. */}
          {showGlow && (
            <img
              src={poster}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 h-[calc(100%+3rem)] w-[calc(100%+3rem)] scale-[1.04] rounded-card object-cover opacity-30 blur-[42px] saturate-150"
            />
          )}

          <div
            className="relative overflow-hidden rounded-card border border-rule bg-navy shadow-card"
            style={{ aspectRatio: aspect }}
          >
            <video
              ref={videoRef}
              src={sources ? undefined : src}
              poster={poster}
              controls={started && !failed}
              controlsList="nodownload"
              crossOrigin={crossOrigin}
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onClick={started ? undefined : start}
            >
              {sources?.map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
              {captionsSrc && (
                <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
              )}
            </video>

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
          </div>

          {started && !failed && (
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
