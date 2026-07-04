import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPosts, type Post } from "../../lib/sanity";
import { PostCover } from "../components/PostCover";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { useTranslations, getLocale } from "../../lib/i18n";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const locale = getLocale() === "it" ? "it-IT" : "en-US";
  return new Date(dateStr).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

export function Blog() {
  const t = useTranslations();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => { setPosts(data); setLoading(false); });
  }, []);

  return (
    <>
      <SEO
        title={t.blog.seoTitle}
        description={t.blog.seoDescription}
        path="/blog"
      />
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="bg-[#00122F] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Hana Health</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-normal mb-4 leading-[1.1]">
              {t.blog.heading}
            </h1>
            <p className="text-slate-400 text-base">
              {t.blog.subheading}
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-100 rounded-2xl h-48 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-400 text-lg">{t.blog.noPosts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug.current}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-200"
                >
                  <PostCover post={post} size="card" className="aspect-[16/9] w-full" />
                  <div className="flex flex-col flex-1 p-5">
                    {/* Category + date */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {post.categories?.map((cat) => (
                        <span key={cat.title} className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {cat.title}
                        </span>
                      ))}
                      {post.publishedAt && (
                        <span className="text-[12px] text-slate-400">{formatDate(post.publishedAt)}</span>
                      )}
                    </div>

                    <h2 className="font-serif text-xl text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {post.author?.name && (
                      <div className="mt-4">
                        <span className="text-xs text-slate-500">{post.author.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
