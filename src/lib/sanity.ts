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

export async function getPosts(): Promise<Post[]> {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, mainImage, publishedAt,
      categories[]->{ title },
      author->{ name, image }
    }
  `);
}

export async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, mainImage, publishedAt,
      categories[]->{ title },
      author->{ name, image },
      body,
      seo { metaTitle, metaDescription, ogImage, noIndex }
    }
  `, { slug });
}
