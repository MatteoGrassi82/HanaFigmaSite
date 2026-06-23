import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { getPosts, urlFor, type Post } from "../../lib/sanity";
import { getLocale } from "../../lib/i18n";

/* ── Latest from the blog ───────────────────────────────────────────────────
   Pulls the 3 most recent posts from Sanity (getPosts already returns them
   ordered by publishedAt desc) and renders them as cards matching the /blog
   page style. Renders nothing while loading or if no posts exist. */

/* urlFor() throws if a Sanity image source can't be resolved — guard it so a
   bad/partial image record can never crash the whole page. */
function safeImageUrl(src: Post["mainImage"]): string | null {
  if (!src) return null;
  try {
    return urlFor(src).width(640).height(360).url();
  } catch {
    return null;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(getLocale() === "it" ? "it-IT" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getPosts()
      .then((all) => {
        if (active) setPosts(all.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Nothing to show — don't render an empty section.
  if (loaded && posts.length === 0) return null;

  const it = getLocale() === "it";

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[2.5px] text-slate-400">
              {it ? "Dal blog" : "From the blog"}
            </p>
            <h2 className="font-serif text-3xl leading-tight text-slate-900 md:text-4xl">
              {it ? "Come le cliniche mettono Hana al lavoro." : "How clinics are putting Hana to work."}
            </h2>
          </div>
          <Link
            to="/blog"
            className="group inline-flex shrink-0 items-center gap-1.5 -mx-2 px-2 py-2 sm:p-0 text-sm font-semibold text-blue-600 hover:text-blue-700 active:text-blue-700 focus-visible:text-blue-700"
          >
            {it ? "Tutti gli articoli" : "All posts"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(loaded ? posts : Array.from({ length: 3 })).map((post, i) =>
            post ? (
              <Link
                key={(post as Post)._id}
                to={`/blog/${(post as Post).slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 transition-all duration-200 hover:border-slate-200 hover:shadow-lg"
              >
                {safeImageUrl((post as Post).mainImage) && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={safeImageUrl((post as Post).mainImage)!}
                      alt={(post as Post).title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {(post as Post).categories?.map((cat) => (
                      <span
                        key={cat.title}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-blue-600"
                      >
                        {cat.title}
                      </span>
                    ))}
                    {(post as Post).publishedAt && (
                      <span className="text-[12px] text-slate-400">
                        {formatDate((post as Post).publishedAt)}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-serif text-xl leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                    {(post as Post).title}
                  </h3>
                  {(post as Post).excerpt && (
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                      {(post as Post).excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              // loading skeleton
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-100"
              >
                <div className="aspect-[16/9] w-full animate-pulse bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestPosts;
