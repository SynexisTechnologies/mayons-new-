import { useState } from "react";
import { Search, Calendar, Tag, ArrowRight, BookOpen, Star } from "lucide-react";

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
    id: 1,
    title: "Benefits of Organic Vegetables",
    description:
      "Organic vegetables are grown without harmful chemicals and pesticides, making them healthier for you and the environment.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    category: "Health",
    date: "12 Feb 2026",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Why Organic Fruits Are Better",
    description:
      "Organic fruits are rich in nutrients and free from synthetic fertilizers, giving you better taste and nutrition.",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&q=80",
    category: "Nutrition",
    date: "10 Feb 2026",
    readTime: "3 min read",
  },
  {
    id: 3,
    title: "Organic Farming and Sustainability",
    description:
      "Organic farming helps protect soil fertility and supports biodiversity in agriculture.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    category: "Farming",
    date: "5 Feb 2026",
    readTime: "5 min read",
  },
  {
    id: 4,
    title: "Top 10 Organic Foods for Healthy Living",
    description: "Adding organic foods to your diet improves immunity and overall well-being.",
    image: "https://images.unsplash.com/photo-1604908176997-43197a92c02c?w=800&q=80",
    category: "Health",
    date: "1 Feb 2026",
    readTime: "6 min read",
  },
];

const categoryColors: Record<string, string> = {
  Health: "bg-honey-soft text-honey",
  Nutrition: "bg-mist text-evergreen",
  Farming: "bg-pine/10 text-pine",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Health", "Nutrition", "Farming"];
  const filteredBlogs = blogs.filter(
    (b) =>
      (category === "All" || b.category === category) &&
      b.title.toLowerCase().includes(search.toLowerCase())
  );
  const featured = blogs[0];

  return (
    <div className="min-h-screen bg-canvas">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[440px] md:min-h-[520px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80"
            className="w-full h-full object-cover scale-105"
            alt="Blog"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[440px] md:min-h-[520px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-14">
          <p className="eyebrow text-honey-light mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Knowledge Hub
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight leading-[1.02]">
            Organic Blog
          </h1>
          <p className="text-white/70 text-base max-w-md">
            Healthy lifestyle tips, farming ideas, and nutrition insights.
          </p>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-full px-4 py-2.5 pl-10 text-sm focus:ring-4 focus:ring-evergreen/10 focus:border-evergreen outline-none transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  category === cat
                    ? "bg-evergreen text-white border-evergreen shadow-sm"
                    : "bg-white border-stone-200 text-stone-600 hover:border-evergreen/40 hover:text-evergreen"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid md:grid-cols-2 card overflow-hidden">
          <div className="relative overflow-hidden min-h-[280px]">
            <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-honey bg-honey-soft px-3 py-1 rounded-full w-fit mb-4">
              <Star className="w-3 h-3 fill-honey" /> Featured
            </span>
            <h2 className="font-display text-3xl font-semibold text-ink mb-3 leading-snug">
              {featured.title}
            </h2>
            <p className="text-stone-500 text-[15px] leading-relaxed mb-5">{featured.description}</p>
            <div className="flex items-center gap-4 text-xs text-stone-400 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {featured.date}
              </span>
              <span>{featured.readTime}</span>
            </div>
            <button className="btn btn-primary w-fit">
              Read Article <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Latest Articles</h2>
          <span className="text-xs font-semibold text-honey bg-honey-soft px-2.5 py-1 rounded-full border border-honey/20">
            {filteredBlogs.length}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-honey/30 to-transparent" />
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No articles match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="group card overflow-hidden hover-lift">
                <div className="relative overflow-hidden h-52">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      categoryColors[blog.category] || "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {blog.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2 line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {blog.readTime}
                      </span>
                    </div>
                    <button className="text-evergreen text-xs font-semibold hover:text-honey transition flex items-center gap-1">
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
