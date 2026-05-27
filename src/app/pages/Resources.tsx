import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen, FileText, FlaskConical, ExternalLink } from "lucide-react";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { getPosts, type Post } from "../../lib/sanity";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Static whitepapers registry ───────────────────────────────────────────────
const WHITEPAPERS = [
  {
    id: "adhd-intake",
    title: "ADHD Intake Workflow",
    subtitle: "A Complete Walkthrough for Clinic Partners",
    description: "3-module interview architecture, pediatric & adult intake flows, and Practice Q integration. How HANA automates ADHD assessment intake end-to-end.",
    tags: ["ADHD", "Intake", "Clinical Workflow"],
    href: "/whitepapers/adhd-intake",
    year: "2026",
    badge: "Clinic Partner",
  },
];

// ── Static research links ─────────────────────────────────────────────────────
const RESEARCH_ITEMS = [
  { title: "State of Voice AI", desc: "Interactive landscape of 400+ voice AI companies across infrastructure, platforms, and healthcare applications.", href: "/state-of-ai", internal: true },
  { title: "Academic Research Library", desc: "Curated peer-reviewed studies on voice AI in clinical settings — Parkinson's, depression, chronic care, and more.", href: "/research", internal: true },
];

// ── Category tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "whitepapers", label: "Whitepapers", icon: FileText },
  { id: "blog",        label: "Blog",        icon: BookOpen },
  { id: "research",    label: "Research",    icon: FlaskConical },
] as const;
type Tab = typeof TABS[number]["id"];

// ── Whitepaper card ───────────────────────────────────────────────────────────
function WhitepaperCard({ wp, index }: { wp: typeof WHITEPAPERS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={wp.href}
        className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
      >
        {/* Dark header strip */}
        <div className="bg-[#00122F] px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">{wp.badge} Whitepaper</span>
          <h2 className="text-white text-xl font-black mt-1 leading-tight">{wp.title}</h2>
          <p className="text-slate-400 text-xs mt-1">{wp.subtitle}</p>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {wp.tags.map(t => (
              <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{t}</span>
            ))}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{wp.year}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed flex-1">{wp.description}</p>
          <div className="mt-5 flex items-center gap-1.5 text-blue-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
            Read whitepaper <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link
        to={`/blog/${post.slug.current}`}
        className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-5"
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.categories?.map(c => (
            <span key={c.title} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{c.title}</span>
          ))}
          {post.publishedAt && (
            <span className="text-[11px] text-slate-400">{formatDate(post.publishedAt)}</span>
          )}
        </div>
        <h2 className="font-serif text-lg text-slate-900 leading-snug group-hover:text-blue-700 transition-colors flex-1">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
          Read post <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Research card ─────────────────────────────────────────────────────────────
function ResearchCard({ item, index }: { item: typeof RESEARCH_ITEMS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={item.href}
        className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.title}</h2>
          {!item.internal && <ExternalLink size={15} className="text-slate-400 shrink-0 mt-0.5" />}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{item.desc}</p>
        <div className="mt-5 flex items-center gap-1.5 text-blue-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
          Explore <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function Resources() {
  const [activeTab, setActiveTab] = useState<Tab>("whitepapers");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (activeTab === "blog" && posts.length === 0) {
      setLoadingPosts(true);
      getPosts().then(data => { setPosts(data); setLoadingPosts(false); });
    }
  }, [activeTab]);

  return (
    <>
      <SEO
        title="Resources | HANA"
        description="Whitepapers, blog posts, and research on voice AI in healthcare."
        path="/resources"
      />

      {/* Hero */}
      <div className="bg-[#00122F] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Hana Health</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Resources</h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Whitepapers, clinical research, and insights on voice AI in healthcare.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

          {/* Category tabs */}
          <div className="flex gap-2 mb-10 border-b border-slate-200 pb-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                    active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {tab.id === "whitepapers" && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {WHITEPAPERS.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "whitepapers" && (
              <motion.div key="whitepapers"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {WHITEPAPERS.map((wp, i) => <WhitepaperCard key={wp.id} wp={wp} index={i} />)}
                  {/* Coming soon placeholder */}
                  <motion.div
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center p-8 text-center min-h-[220px]"
                  >
                    <FileText size={28} className="text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-400">More whitepapers coming</p>
                    <p className="text-xs text-slate-400 mt-1">Depression screening, chronic care, and more</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "blog" && (
              <motion.div key="blog"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {loadingPosts ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 h-48" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-24">
                    <p className="text-slate-400">No posts yet — check back soon.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, i) => <BlogCard key={post._id} post={post} index={i} />)}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "research" && (
              <motion.div key="research"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  {RESEARCH_ITEMS.map((item, i) => <ResearchCard key={item.href} item={item} index={i} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </>
  );
}
