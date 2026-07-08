"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, Sparkle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link } from "react-router";
import logoImage from 'figma:asset/55130a9cc9a8f890dc08e580a5cf6dd0df0df413.png';
import { useTranslations, getLocale } from "../../lib/i18n";

// --- Types ---
type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type NavLink = {
  url: string;
  title: string;
  subMenuLinks?: NavLink[];
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  variant?: "primary" | "white" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
};

type Props = {
  logo: ImageProps;
  navLinks: NavLink[];
  button: ButtonProps;
  signInButton: ButtonProps;
};

export type NavbarProps = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

// --- Defaults ---
export const NavbarDefaults: Props = {
  logo: {
    url: "/",
    src: logoImage,
    alt: "Hana Health",
  },
  navLinks: [
    {
      url: "/case-studies",
      title: "Case Studies",
    },
    {
      url: "https://docs.hana.health/getting-started/overview",
      title: "Docs",
    },
    {
      url: "#",
      title: "Resources",
      subMenuLinks: [
        { url: "/whitepapers", title: "Whitepapers" },
        { url: "/blog", title: "Blog" },
        { url: "/labs", title: "Labs" },
        { url: "/pricing", title: "Savings Calculator" },
      ],
    },
    {
      url: "/labs",
      title: "Labs",
    },
  ],
  signInButton: {
    title: "Sign in",
    size: "md",
    variant: "white" as const,
    href: "https://app.hana.health",
  },
  button: {
    title: "Book a Demo",
    size: "md",
    variant: "primary",
    href: "https://calendly.com/matteowastaken/discoverycall",
  },
};

// --- Helper Hook ---
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

// --- Helper for Links ---
interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

const SmartLink = ({ href, children, className, target, ...props }: SmartLinkProps) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target={target || "_blank"} rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

// --- Component ---
export const Navbar = (props: NavbarProps) => {
  const t = useTranslations();
  // Case Studies is US-specific and dropped on the Italian site.
  const isItalian = getLocale() === "it";
  const defaults: Props = {
    ...NavbarDefaults,
    navLinks: [
      {
        url: "#",
        title: isItalian ? "Soluzioni" : "Solutions",
        subMenuLinks: [
          { url: "/hana-contact", title: "HANA Contact" },
          { url: "/hana-remote", title: "HANA Remote" },
          { url: "/hana-sleep", title: "HANA Sleep" },
          { url: "/hana-sleep/analysis", title: "— Sleep Analysis" },
          { url: "/hana-sleep/cpap", title: "— CPAP Adherence Program" },
        ],
      },
      ...(isItalian ? [] : [{ url: "/case-studies", title: t.nav.caseStudies }]),
      {
        url: "#",
        title: t.nav.resources,
        subMenuLinks: [
          { url: "https://docs.hana.health/getting-started/overview", title: t.nav.docs },
          { url: "/whitepapers", title: t.nav.whitepapers },
          { url: "/blog", title: t.nav.blog },
          { url: "/labs", title: t.nav.labs },
          { url: "/pricing", title: t.nav.savingsCalculator },
        ],
      },
    ],
    signInButton: { ...NavbarDefaults.signInButton, title: t.nav.signIn },
    button: { ...NavbarDefaults.button, title: t.nav.bookDemo },
  };
  const { logo, navLinks, button, signInButton } = {
    ...defaults,
    ...props,
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023.98px)");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="sticky top-0 z-[999] w-full border-b border-[#e2e8f0] bg-[#f5f6f8]/90 backdrop-blur-md">
      <div className="flex min-h-[80px] w-full max-w-7xl mx-auto items-center justify-between px-6 md:px-10 relative">
        
        {/* Left Side: Logo */}
        <div className="flex-shrink-0 flex items-center">
           <SmartLink href={logo.url} className="flex items-center" target="_self">
             <img src={logo.src} alt={logo.alt} className="h-10 md:h-12 w-auto object-contain" />
           </SmartLink>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((navLink, index) =>
            navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
              <SubMenu key={index} navLink={navLink} isMobile={isMobile} />
            ) : (
              <SmartLink
                key={index}
                href={navLink.url}
                className="text-[15px] font-medium text-[#1e2a3a] hover:text-[#2d3f54] transition-colors font-['DM_Sans']"
              >
                {navLink.title}
              </SmartLink>
            )
          )}
        </div>

        {/* Right Side: Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <Button {...signInButton} />
            <Button {...button} />
          </div>
          
          <button
            ref={buttonRef}
            className="flex items-center justify-center lg:hidden min-h-[44px] min-w-[44px] p-2 text-[#1e2a3a]"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#e2e8f0] bg-[#f5f6f8] overflow-hidden lg:hidden"
          >
            <div ref={menuRef} className="flex flex-col p-6 gap-4 max-h-[calc(100dvh-80px)] overflow-y-auto">
              {navLinks.map((navLink, index) =>
                navLink.subMenuLinks && navLink.subMenuLinks.length > 0 ? (
                  <SubMenu key={index} navLink={navLink} isMobile={true} />
                ) : (
                  <SmartLink
                    key={index}
                    href={navLink.url}
                    className="text-lg font-medium text-[#1e2a3a] py-3 font-['DM_Sans']"
                  >
                    {navLink.title}
                  </SmartLink>
                )
              )}
              <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex flex-col gap-3">
                <Button {...signInButton} className="w-full justify-center" />
                <Button {...button} className="w-full justify-center" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SubMenu = ({ navLink, isMobile }: { navLink: NavLink; isMobile: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <button
          className="flex w-full items-center justify-between text-lg font-medium text-[#1e2a3a] py-3 font-['DM_Sans']"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span>{navLink.title}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col pl-4 border-l-2 border-[#e2e8f0] ml-2 overflow-hidden"
            >
              {navLink.subMenuLinks?.map((subMenuLink, index) => (
                <SmartLink
                  key={index}
                  href={subMenuLink.url}
                  className="flex items-center min-h-[44px] py-3 text-[#718096] hover:text-[#1e2a3a] font-['DM_Sans']"
                >
                  {subMenuLink.title}
                </SmartLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-[15px] font-medium text-[#1e2a3a] hover:text-[#2d3f54] transition-colors font-['DM_Sans']"
      >
        <span>{navLink.title}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
          >
            <div className="w-48 rounded-xl bg-white border border-[#e2e8f0] shadow-lg p-2 overflow-hidden">
              {navLink.subMenuLinks?.map((subMenuLink, index) => (
                <SmartLink
                  key={index}
                  href={subMenuLink.url}
                  className="block px-4 py-2 text-sm text-[#718096] hover:bg-[#f5f6f8] hover:text-[#1e2a3a] rounded-lg transition-colors font-['DM_Sans']"
                >
                  {subMenuLink.title}
                </SmartLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Button Component ---
const Button = ({ className, title, variant = "primary", href, ...props }: ButtonProps) => {
    // Styles matching the "Book a demo" button from the other component
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[15px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-[44px] group";
    const variants = {
        primary: "bg-[#1e2a3a] text-white hover:bg-[#2d3f54] hover:-translate-y-[2px] shadow-sm hover:shadow-[0_8px_24px_rgba(30,42,58,0.2)]",
        white: "bg-white text-[#1e2a3a] border border-[#e2e8f0] hover:bg-[#f5f6f8] hover:-translate-y-[2px] shadow-sm hover:shadow-[0_8px_24px_rgba(30,42,58,0.08)]",
        secondary: "bg-[#f5f6f8] text-[#1e2a3a] hover:bg-[#e2e8f0]",
        link: "text-[#1e2a3a] underline-offset-4 hover:underline",
    };
    // sparkle shown only on the white "Sign in" button (Book a Demo stays clean)
    const showSparkle = variant === 'white';
    const sparkle = showSparkle ? (
      <Sparkle className="w-4 h-4 fill-current transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
    ) : null;

    if (href) {
      const external = href.startsWith('http');
      return (
        <a
          href={href}
          className={cn(baseStyles, variants[variant], className)}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {title}
            {sparkle}
        </a>
      );
    }

    return (
        <button className={cn(baseStyles, variants[variant], className)} {...props}>
            {title}
            {sparkle}
        </button>
    );
}