import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { PortableText } from "@portabletext/react";
import { getPost, type Post } from "../../lib/sanity";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { ArrowLeft } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ""}
            className="w-full rounded-xl"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-slate-400 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="font-serif text-4xl text-slate-900 mt-10 mb-4 leading-tight">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-serif text-3xl text-slate-900 mt-10 mb-4 leading-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-2xl text-slate-900 mt-8 mb-3 leading-tight">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[17px] leading-[1.8] text-slate-600 mb-5">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-slate-500 text-lg">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-2 mb-5 text-[17px] text-slate-600">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-2 mb-5 text-[17px] text-slate-600">{children}</ol>,
  },
};

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getPost(slug).then((data) => {
      if (!data) setNotFound(true);
      else setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-lg">Post not found.</p>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const seoTitle = post.seo?.metaTitle || `${post.title} | Hana Health`;
  const seoDescription = post.seo?.metaDescription || post.excerpt || "";
  const seoImage = post.seo?.ogImage ? urlFor(post.seo.ogImage).width(1200).height(630).url() : undefined;
  const seoRobots = post.seo?.noIndex ? "noindex, nofollow" : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || "",
    "url": `https://www.hana.health/blog/${slug}`,
    "datePublished": post.publishedAt || undefined,
    "dateModified": post._updatedAt || post.publishedAt || undefined,
    "author": post.author
      ? { "@type": "Person", "name": post.author.name }
      : { "@type": "Organization", "name": "Hana Health" },
    "publisher": {
      "@type": "Organization",
      "name": "Hana Health",
      "logo": { "@type": "ImageObject", "url": "https://www.hana.health/logo.png" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.hana.health/blog/${slug}` },
    ...(post.categories?.length ? { "keywords": post.categories.map(c => c.title).join(", ") } : {}),
  };

  return (
    <>
      <SEO
        title={seoTitle}
        useExactTitle={!!post.seo?.metaTitle}
        description={seoDescription}
        path={`/blog/${slug}`}
        type="article"
        jsonLd={articleSchema}
        {...(seoImage ? { image: seoImage } : {})}
        {...(seoRobots ? { robots: seoRobots } : {})}
      />
      <div className="bg-white min-h-screen">
        {/* Cover */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.categories?.map((cat) => (
              <span key={cat.title} className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {cat.title}
              </span>
            ))}
            {post.publishedAt && (
              <span className="text-sm text-slate-400">{formatDate(post.publishedAt)}</span>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {post.author && (
            <div className="mb-10 pb-8 border-b border-slate-100">
              <span className="text-sm text-slate-600 font-medium">{post.author.name}</span>
            </div>
          )}

          {post.body && (
            <div>
              <PortableText value={post.body} components={portableTextComponents} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
