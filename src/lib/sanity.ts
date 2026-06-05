import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "7dkhf6fw",
  dataset: "production",
  apiVersion: "2026-05-12",
  useCdn: false,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: SanityImageSource;
  publishedAt?: string;
  _updatedAt?: string;
  categories?: { title: string }[];
  body?: any[];
  author?: { name: string; image?: SanityImageSource };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
    noIndex?: boolean;
  };
}

/**
 * Build-time prerender cache. The prerender script (scripts/prerender.mjs) fetches
 * post data in Node (no browser CORS limits) and injects it as `window.__PRERENDER__`
 * before the SPA mounts. At runtime on the real domain this is absent, so the app
 * fetches Sanity normally — this only short-circuits the headless prerender pass,
 * where the browser fetch to api.sanity.io is blocked by CORS from localhost.
 */
type PrerenderCache = { posts?: Post[]; postBySlug?: Record<string, Post | null> };
function prerenderCache(): PrerenderCache | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __PRERENDER__?: PrerenderCache }).__PRERENDER__;
}

export async function getPosts(): Promise<Post[]> {
  const cached = prerenderCache()?.posts;
  if (cached) return cached;
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, mainImage, publishedAt, _updatedAt,
      categories[]->{ title },
      author->{ name, image }
    }
  `);
}

export async function getPost(slug: string): Promise<Post | null> {
  const cached = prerenderCache()?.postBySlug;
  if (cached && slug in cached) return cached[slug];
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, mainImage, publishedAt, _updatedAt,
      categories[]->{ title },
      author->{ name, image },
      body,
      seo { metaTitle, metaDescription, ogImage, noIndex }
    }
  `, { slug });
}
