import { useEffect } from 'react';
import ogImage from 'figma:asset/7dab76c8bd67019090a5609cf9a1a41e8c727fbb.png';
import { getLocale } from '../../lib/i18n';

const SITE_NAME = "Hana Voice AI";
const EN_DOMAIN = "https://www.hana.health";
const IT_DOMAIN = "https://ita.hana.health";

function getSiteDomain(): string {
  return getLocale() === "it" ? IT_DOMAIN : EN_DOMAIN;
}

const SITE_DOMAIN = EN_DOMAIN; // used for static schema objects only
const DEFAULT_KEYWORDS_EN = "Voice AI, Patient Engagement, Clinical AI, Remote Patient Monitoring, AI Receptionist, Healthcare Automation, Intelligent Intake, Care Coordination, Healthcare Voice Technology, Medical AI Assistant";
const DEFAULT_KEYWORDS_IT = "AI vocale, coinvolgimento dei pazienti, AI clinica, monitoraggio remoto dei pazienti, segreteria AI, automazione sanitaria, accoglienza intelligente, coordinamento delle cure, tecnologia vocale per la sanità, assistente medico AI";
const DEFAULT_KEYWORDS = getLocale() === "it" ? DEFAULT_KEYWORDS_IT : DEFAULT_KEYWORDS_EN;

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  useExactTitle?: boolean;
  keywords?: string;
  /** Path portion of the URL, e.g. "/about" — used to auto-generate canonical URL */
  path?: string;
  /** Robots directive, defaults to "index, follow" */
  robots?: string;
  /** Page type for structured data: "website" | "article" | "product" */
  type?: "website" | "article" | "product";
  /** Additional JSON-LD structured data to inject */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/** Helper to set or create a <meta> tag */
function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SEO({ 
  title = "Hana Voice AI | Intelligent Patient Engagement",
  description = "Automate patient intake, monitoring, and care coordination with Hana's clinical Voice AI. Engage patients naturally, improve outcomes, and reduce administrative burden by 85%.",
  image = ogImage,
  url,
  useExactTitle = false,
  keywords,
  path,
  robots = "index, follow",
  type = "website",
  jsonLd,
}: SEOProps) {
  // Construct the full title. Only append the brand suffix when the title
  // doesn't already mention the brand (covers "Hana Voice AI", "Hana Health",
  // and Sanity-authored titles ending in "| Hana …") — avoids double-branding.
  let fullTitle = title;
  if (!useExactTitle && !/\bHana\b/i.test(title)) {
    fullTitle = `${title} | ${SITE_NAME}`;
  }

  // Auto-generate canonical URL from path if url is not explicitly provided
  const domain = getSiteDomain();
  const canonicalUrl = url || (path ? `${domain}${path}` : undefined);

  // Merge keywords
  const allKeywords = keywords 
    ? `${keywords}, ${DEFAULT_KEYWORDS}` 
    : DEFAULT_KEYWORDS;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Set lang attribute based on detected locale
    document.documentElement.lang = getLocale() === 'it' ? 'it' : 'en';

    // Basic meta tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', allKeywords);
    setMeta('name', 'author', 'Hana Health, Inc.');
    setMeta('name', 'robots', robots);
    setMeta('name', 'viewport', 'width=device-width, initial-scale=1, maximum-scale=5');

    // Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    // Hreflang alternate links (en ↔ it) for Google cross-domain SEO
    if (path) {
      const setHreflang = (hreflang: string, href: string) => {
        const sel = `link[rel="alternate"][hreflang="${hreflang}"]`;
        let el = document.querySelector(sel) as HTMLLinkElement | null;
        if (!el) {
          el = document.createElement('link');
          el.rel = 'alternate';
          el.setAttribute('hreflang', hreflang);
          document.head.appendChild(el);
        }
        el.href = href;
      };
      setHreflang('en', `${EN_DOMAIN}${path}`);
      setHreflang('it', `${IT_DOMAIN}${path}`);
      setHreflang('x-default', `${EN_DOMAIN}${path}`);
    }

    // Open Graph meta tags
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', `${SITE_NAME} - ${title}`);
    setMeta('property', 'og:locale', getLocale() === 'it' ? 'it_IT' : 'en_US');
    if (canonicalUrl) {
      setMeta('property', 'og:url', canonicalUrl);
    }

    // Twitter meta tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', '@hanahealth');
    setMeta('name', 'twitter:creator', '@hanahealth');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', `${SITE_NAME} - ${title}`);

    // Theme color
    setMeta('name', 'theme-color', '#00122F');

    // Application name
    setMeta('name', 'application-name', SITE_NAME);
    setMeta('name', 'apple-mobile-web-app-title', SITE_NAME);

    // JSON-LD Structured Data
    if (jsonLd) {
      // Remove any previously injected LD+JSON script from SEO component
      const oldScript = document.querySelector('script[data-seo-jsonld]');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, allKeywords, robots, canonicalUrl, type, image, title, jsonLd]);

  return null;
}

// ─── Pre-built Structured Data Helpers ────────────────────────────────────────

/** Organization schema for Hana Health */
export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hana Health",
  "alternateName": "Hana Voice AI",
  "url": SITE_DOMAIN,
  "logo": `${SITE_DOMAIN}/logo.png`,
  "description": "Hana Health builds clinical Voice AI agents that automate patient engagement, intake, monitoring, and care coordination for healthcare organizations.",
  "sameAs": [
    "https://www.linkedin.com/company/usehana"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@hana.health",
    "availableLanguage": ["English"]
  }
};

/** WebSite schema with search action */
export const websiteSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_DOMAIN,
  "description": "Clinical Voice AI for intelligent patient engagement, remote monitoring, and care coordination.",
  "publisher": {
    "@type": "Organization",
    "name": "Hana Health"
  }
};

/** SoftwareApplication schema for the product */
export const softwareApplicationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hana Voice AI",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "description": "AI-powered clinical voice agents for patient engagement, intake automation, remote monitoring, and care coordination.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Contact us for enterprise pricing"
  },
  "creator": {
    "@type": "Organization",
    "name": "Hana Health"
  }
};

/** Helper to generate BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/** Helper to generate FAQ schema for a page */
export function faqSchema(questions: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}