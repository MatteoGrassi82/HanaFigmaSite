import { useEffect, useRef, useState } from "react";
import { SEO } from "../components/SEO";

/**
 * /go — the destination of the QR code printed on 247 physical letters.
 *
 * THE URL IS PERMANENT. Once those letters are posted the path can never move,
 * be renamed, or be folded into another page. Everything else here is swappable;
 * `/go` is not. It is in NOINDEX_ROUTES in scripts/lib/route-seo.mjs so that it
 * prerenders (a route that is in App.tsx but in neither route list 404s on a hard
 * navigation — see api/not-found.ts) while staying out of the index: this page is
 * for 247 named people, not for search.
 *
 * WHO LANDS HERE
 * An independent primary-care physician in FL/TX/GA/MS, 50s to 60s, who has just
 * scanned a code on a plain typed letter about unbilled Medicare care-management
 * codes. They have never heard of HANA. They are on a phone, one-handed, with
 * about forty seconds of patience.
 *
 * WHY THERE IS NOTHING ELSE ON IT
 * The letter's first line is "This letter is plain on purpose." A page that opens
 * into the full marketing site breaks the promise the letter made. So: no navbar
 * (App.tsx renders the chrome conditionally for this route and this route only),
 * no footer, no feature grid, no logos, and no link that leaves the page except
 * the booking itself. The phone number is a tel: link, which places a call rather
 * than navigating away. Resist adding to this page. Every addition costs the
 * letter its credibility.
 *
 * THE FILM IS SILENT AND THE CAPTIONS ARE THE SOUNDTRACK
 * public/video/hana-part1.mp4 has no audio track yet. Captions are therefore not
 * an accessibility nicety here: without them the video says nothing at all. The
 * <track> is marked default AND forced to mode "showing" on mount, because
 * `default` alone is not honoured everywhere (iOS Safari defers to the system
 * caption setting). When the voiceover is laid in, swap the mp4 and nothing else:
 * the VTT timings are cut to the same 57.000s and still hold.
 *
 * WHAT COMES BACK
 * The QR carries ?r=143, unique per letter, 1 to 247. It is read, recorded via
 * /api/go and never displayed. A visit with no booking is the signal that matters
 * most: those are the practices that read the letter, went to the page, and
 * stopped, and they are the first calls the sales team should make.
 */

/* ── The booking ───────────────────────────────────────────────────────────
 * INTERIM LINK. The brief asks for a twenty-minute event and left the URL as a
 * placeholder; this is the discovery call the rest of the site already books
 * (Navbar, Hero, Pricing, CtaBand all point at it), so the page works today
 * rather than shipping a dead embed. Replace the line below with the twenty-
 * minute event when it exists and nothing else on the page changes.
 *
 * Note it can be changed at any time, including after the letters are posted:
 * the thing that must never move is /go, not what /go embeds. */
const CALENDLY_URL = "https://calendly.com/matteowastaken/discoverycall";

/* The number printed in the letter. Kept as two constants so the dialled string
 * and the read string can never drift apart. */
const PHONE_DISPLAY = "+1 (517) 300-7189";
const PHONE_TEL = "+15173007189";

/* HANA, part one. 57.000s, 1280x720, no audio track, +faststart so it streams
 * rather than waiting on the whole file. Encoded from the 41.8MB 1080p picture
 * master in ~/Downloads/HANA-part1-FOR-EDITOR at CRF 32, which lands at 2.6MB:
 * checked frame by frame against the master, the typeset "400" stays crisp and
 * the flat clay backgrounds show no banding, which is the only quality bar a
 * matte stop-motion film has. Committed rather than hosted because this page
 * has to work in production and the video IS the page; if it moves to Vercel
 * Blob later, only `src` changes. */
const FILM = {
  src: "/video/hana-part1.mp4",
  poster: "/video/hana-part1-poster.jpg",
  captions: "/video/hana-part1.en.vtt",
} as const;

/** Letters are numbered 1 to 247. Anything else is treated as absent. */
const LETTERS_PRINTED = 247;

/**
 * Read the letter code, record the visit, show nothing.
 *
 * Deliberately never throws and never blocks a render: an absent or malformed
 * `r` is a normal page load, and so is a failed beacon. The row is written
 * server-side (api/go.ts) so that the timestamp and the user-agent come from the
 * request rather than from anything the page could get wrong.
 */
function useRecordVisit() {
  const sent = useRef(false);

  useEffect(() => {
    // React 18 StrictMode mounts twice in development. One visit, one row.
    if (sent.current) return;
    sent.current = true;

    let r: number | null = null;
    try {
      const raw = new URLSearchParams(window.location.search).get("r");
      if (raw && /^\d{1,3}$/.test(raw)) {
        const n = Number(raw);
        if (n >= 1 && n <= LETTERS_PRINTED) r = n;
      }
    } catch {
      // A search string we cannot parse is simply a visit without a code.
    }

    // A visit with no usable code is still a visit and still gets a row; the
    // row just says the code was missing. Someone typing the URL by hand is a
    // real signal too.
    const body = JSON.stringify({ r, ref: document.referrer || null });

    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/go", blob)) return;
    } catch {
      // sendBeacon is unavailable or refused the payload; fall through.
    }

    fetch("/api/go", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Recording a view must never surface to the visitor.
    });
  }, []);
}

/**
 * The Calendly inline embed, loaded only when it is nearly in view.
 *
 * The script is ~40KB plus the iframe it builds, and this page has a two-second
 * budget on 4G with a video in it. Nothing here is needed until the reader has
 * scrolled past the film, so the observer arms it 600px early: by the time the
 * embed is on screen it has been ready for a while, and a reader who never
 * scrolls never pays for it.
 *
 * The <a> underneath is not decoration. It is the booking as a plain link, and
 * it is what a reader gets if the script is blocked, fails, or is simply slow;
 * Calendly's iframe covers it once it mounts. It is also the only link on the
 * page that leaves it, which the brief allows precisely because it is the
 * booking.
 */
function CalendlyInline({ url }: { url: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = holder.current;
    if (!el) return;

    const SRC = "https://assets.calendly.com/assets/external/widget.js";
    const w = window as unknown as {
      Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
    };

    // Already loaded — an in-app navigation back to /go, say. widget.js only
    // scans the document once, on load, so the second visit has to ask.
    if (w.Calendly) {
      w.Calendly.initInlineWidget({ url, parentElement: el });
      return;
    }
    if (document.querySelector(`script[src="${SRC}"]`)) return;

    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [armed, url]);

  return (
    <div
      ref={holder}
      /* The iframe is lifted above the fallback link below it. Without this the
         absolutely-positioned <a> paints over Calendly's own (statically
         positioned) iframe, and "Open the calendar" sits on top of the rendered
         calendar. Verified on a 390px viewport: it read as a stray link across
         the date grid. */
      className="calendly-inline-widget relative w-full overflow-hidden rounded-xl border border-rule bg-paper-bright h-[1040px] sm:h-[760px] [&_iframe]:relative [&_iframe]:z-10"
      /* widget.js scans for .calendly-inline-widget + data-url when it loads,
         which is what initialises this on a first visit. */
      data-url={url}
    >
      <a
        href={url}
        className="absolute inset-0 flex items-center justify-center px-6 text-center text-[16px] text-ink-soft underline underline-offset-4 decoration-rule-strong hover:decoration-brand"
      >
        Open the calendar
      </a>
    </div>
  );
}

export function Go() {
  useRecordVisit();
  const video = useRef<HTMLVideoElement>(null);

  /* Force the captions on. The film is silent, so a viewer who does not see
   * captions sees 57 seconds of clay and learns nothing. `default` on the
   * <track> is the declaration; this is the enforcement. */
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    /* React sets `muted` as a DOM PROPERTY and never writes the attribute, so the
     * prerendered HTML shipped `<video autoplay …>` with no `muted` on it. A
     * browser parsing that markup — which happens before any of this JavaScript
     * arrives — refuses to autoplay, and on a phone that is the whole page failing
     * to start. Writing the attribute here fixes both ends at once: at runtime it
     * is correct, and headless Chrome serialises it into dist/go/index.html, so
     * the static file that a QR scan actually receives carries it too. */
    v.muted = true;
    v.setAttribute("muted", "");

    const show = () => {
      const track = v.textTracks?.[0];
      if (track) track.mode = "showing";
    };
    show();
    v.addEventListener("loadedmetadata", show);
    return () => v.removeEventListener("loadedmetadata", show);
  }, []);

  /* index.html boots Gleap site-wide and it floats a feedback bubble over every
   * page. Here it is an unexplained widget on a page that has just promised to be
   * plain, and a second thing to tap that is not the booking.
   *
   * showFeedbackButton(false) is the documented way to do this and it is NOT
   * enough on its own: the call lands (Gleap marks the button
   * bb-feedback-button--disabled) and then Gleap's own initialisation finishes a
   * few seconds later and puts it back. Measured, not guessed — the button was
   * visible again at the five-second mark. So the API call states the intent and
   * the stylesheet enforces it, and the style element is removed on unmount so
   * the bubble returns everywhere else in the SPA. */
  useEffect(() => {
    try {
      (window as unknown as { Gleap?: { showFeedbackButton?: (v: boolean) => void } })
        .Gleap?.showFeedbackButton?.(false);
    } catch {
      // Never let a third-party widget break the page.
    }

    const style = document.createElement("style");
    style.setAttribute("data-go-page", "gleap-off");
    style.textContent =
      ".bb-feedback-button,.gleap-notification-container{display:none !important}";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    /* data-rendered tells scripts/prerender.mjs that this page is finished.
       Its "real content" test is a 200-character floor on visible text, and this
       page carries about 147 characters by design, so without the marker the
       prerender waits 25 seconds and gives up on it. */
    <div className="min-h-screen bg-paper font-sans text-ink" data-rendered="true">
      <SEO
        title="HANA Health"
        useExactTitle
        path="/go"
        robots="noindex, nofollow"
        description="The ninety seconds the letter was too short to include."
      />

      <div className="mx-auto w-full max-w-[680px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        {/* The letter, answered. Nothing above this line. */}
        <h1 className="font-serif text-[34px] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-[46px]">
          You got a letter.
        </h1>
        <p className="mt-4 text-[17px] leading-[1.5] text-ink-soft sm:text-[19px]">
          Here is the ninety seconds it was too short to include.
        </p>

        {/* The film. Muted autoplay so it starts on its own on a phone held in
            one hand, controls visible so it can be stopped, captions on because
            they are the only voice it has. */}
        <div className="mt-8 overflow-hidden rounded-xl border border-rule bg-navy sm:mt-10">
          <video
            ref={video}
            className="block aspect-video w-full"
            src={FILM.src}
            poster={FILM.poster}
            autoPlay
            muted
            playsInline
            controls
            preload="metadata"
          >
            <track
              kind="captions"
              src={FILM.captions}
              srcLang="en"
              label="English"
              default
            />
          </video>
        </div>

        {/* The booking. */}
        <h2 className="mt-14 font-serif text-[26px] font-medium leading-[1.2] text-ink sm:mt-16 sm:text-[30px]">
          Twenty minutes, whenever suits.
        </h2>

        <div className="mt-6">
          <CalendlyInline url={CALENDLY_URL} />
        </div>

        <p className="mt-8 text-[16px] leading-[1.5] text-ink-soft">
          Or call{" "}
          <a
            href={`tel:${PHONE_TEL}`}
            className="whitespace-nowrap font-medium text-brand underline underline-offset-4"
          >
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
