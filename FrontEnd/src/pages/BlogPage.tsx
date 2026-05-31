import { useState } from "react";
import { Search, Calendar, Tag, ArrowRight } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const blogs: Blog[] = [
  {
    id: 1, title: "Benefits of Organic Vegetables",
    description: "Organic vegetables are grown without harmful chemicals and pesticides, making them healthier for you and the environment.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    category: "Health", date: "12 Feb 2026", readTime: "4 min read",
  },
  {
    id: 2, title: "Why Organic Fruits Are Better",
    description: "Organic fruits are rich in nutrients and free from synthetic fertilizers, giving you better taste and nutrition.",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&q=80",
    category: "Nutrition", date: "10 Feb 2026", readTime: "3 min read",
  },
  {
    id: 3, title: "Organic Farming and Sustainability",
    description: "Organic farming helps protect soil fertility and supports biodiversity in agriculture.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    category: "Farming", date: "5 Feb 2026", readTime: "5 min read",
  },
  {
    id: 4, title: "Top 10 Organic Foods for Healthy Living",
    description: "Adding organic foods to your diet improves immunity and overall well-being.",
    image: "https://images.unsplash.com/photo-1604908176997-43197a92c02c?w=800&q=80",
    category: "Health", date: "1 Feb 2026", readTime: "6 min read",
  },
];

const categoryColors: Record<string, string> = {
  Health: "bg-[#d4af37]/15 text-[#1e3a5f]",
  Nutrition: "bg-[#1e3a5f]/10 text-[#1e3a5f]",
  Farming: "bg-emerald-100 text-emerald-700",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Health", "Nutrition", "Farming"];
  const filteredBlogs = blogs.filter(
    (b) => (category === "All" || b.category === category) && b.title.toLowerCase().includes(search.toLowerCase())
  );
  const featured = blogs[0];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80"
            className="w-full h-full object-cover scale-105" alt="Blog" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-[#1e3a5f]/10" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-center px-4 text-white pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight">Organic Blog</h1>
          <p className="text-white/70 text-sm sm:text-base max-w-md">Healthy lifestyle tips, farming ideas, and nutrition insights.</p>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] outline-none bg-white transition" />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  category === cat
                    ? "bg-[#1e3a5f] text-[#d4af37] border-[#1e3a5f] shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f]"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
          <div className="relative overflow-hidden">
            <img src={featured.image} alt={featured.title} className="h-72 md:h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full w-fit mb-4">
              ★ Featured
            </span>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3 leading-snug">{featured.title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-5">{featured.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {featured.date}</span>
              <span>{featured.readTime}</span>
            </div>
            <button className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2a4a7c] transition w-fit shadow-sm">
              Read Article <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-[#1e3a5f]">Latest Articles</h2>
          <span className="text-xs font-semibold text-[#d4af37] bg-[#1e3a5f]/8 px-2.5 py-1 rounded-full border border-[#d4af37]/20">{filteredBlogs.length}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No articles match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative overflow-hidden h-48">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${categoryColors[blog.category] || "bg-slate-100 text-slate-600"}`}>
                    {blog.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-2 line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{blog.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {blog.readTime}</span>
                    </div>
                    <button className="text-[#1e3a5f] text-xs font-semibold hover:text-[#d4af37] transition flex items-center gap-1">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
