/* Monochrome brand logo row.
   Logos live in /public/logos and are recolored at render time (brightness(0)
   → solid ink, dropped to a slate opacity) so a mixed bag of colored SVG/PNG
   wordmarks reads as one uniform, calm logo wall. Dark mode inverts to white.
   Hover lifts the opacity so the mark firms up without breaking the monochrome. */

export type Brand = { src: string; alt: string };

export const EHR_LOGOS: Brand[] = [
  { src: "/logos/athenahealth.png",  alt: "athenahealth" },
  { src: "/logos/epic.png",          alt: "Epic" },
  { src: "/logos/oracle.svg",        alt: "Oracle Health" },
  { src: "/logos/eclinicalworks.png",alt: "eClinicalWorks" },
  { src: "/logos/nextgen.svg",       alt: "NextGen Healthcare" },
  { src: "/logos/elation.png",       alt: "Elation Health" },
  { src: "/logos/drchrono.png",      alt: "DrChrono" },
  { src: "/logos/charm.png",         alt: "CharmHealth" },
  { src: "/logos/practiceq.svg",     alt: "practiceQ" },
  { src: "/logos/healthie.svg",      alt: "Healthie" },
];

/* "Built into the systems you already run" band — EHRs + telephony + tools. */
export const TRUST_LOGOS: Brand[] = [
  { src: "/logos/athenahealth.png",   alt: "athenahealth" },
  { src: "/logos/eclinicalworks.png", alt: "eClinicalWorks" },
  { src: "/logos/epic.png",           alt: "Epic" },
  { src: "/logos/meditech.svg",       alt: "MEDITECH" },
  { src: "/logos/elation.png",        alt: "Elation Health" },
  { src: "/logos/nextgen.svg",        alt: "NextGen Healthcare" },
  { src: "/logos/twilio.svg",         alt: "Twilio" },
  { src: "/logos/telnyx.svg",         alt: "Telnyx" },
  { src: "/logos/vonage.svg",         alt: "Vonage" },
  { src: "/logos/slack.svg",          alt: "Slack" },
  { src: "/logos/zoho.svg",           alt: "Zoho" },
];

/* Infinite horizontal logo marquee (matches the site's RecipesMarquee pattern:
   doubled track translated -50%, pause on hover, edge fade, reduced-motion safe). */
export function LogoMarquee({ brands, className = "" }: { brands: Brand[]; className?: string }) {
  const doubled = [...brands, ...brands];
  const duration = `${Math.max(24, brands.length * 3.2)}s`;
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <style>{`
        @keyframes logo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .logo-marquee-track { animation: none !important; } }
      `}</style>
      <div
        className="logo-marquee-track flex w-max items-center gap-x-14 sm:gap-x-20 py-1"
        style={{ animation: `logo-marquee ${duration} linear infinite` }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")}
      >
        {doubled.map((b, i) => (
          <img
            key={i}
            src={b.src}
            alt={i < brands.length ? b.alt : ""}
            aria-hidden={i >= brands.length}
            loading="lazy"
            className="h-7 sm:h-8 w-auto max-w-[150px] shrink-0 object-contain opacity-50 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
          />
        ))}
      </div>
    </div>
  );
}

export function BrandRow({
  brands,
  size = "md",
  className = "",
}: {
  brands: Brand[];
  size?: "sm" | "md";
  className?: string;
}) {
  const h = size === "sm" ? "h-5" : "h-7";
  const maxW = size === "sm" ? "max-w-[96px]" : "max-w-[120px]";
  return (
    <div className={`flex flex-wrap items-center gap-x-7 gap-y-4 ${className}`}>
      {brands.map((b) => (
        <img
          key={b.src}
          src={b.src}
          alt={b.alt}
          loading="lazy"
          className={`${h} ${maxW} w-auto object-contain opacity-60 transition-opacity duration-200 hover:opacity-90 [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]`}
        />
      ))}
    </div>
  );
}
