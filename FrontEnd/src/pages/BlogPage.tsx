import { useState } from "react";
import { Search } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Benefits of Organic Vegetables",
    description:
      "Organic vegetables are grown without harmful chemicals and pesticides, making them healthier for you and the environment.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e",
    category: "Health",
    date: "12 Feb 2026",
  },
  {
    id: 2,
    title: "Why Organic Fruits Are Better",
    description:
      "Organic fruits are rich in nutrients and free from synthetic fertilizers, giving you better taste and nutrition.",
    image:
      "https://images.unsplash.com/photo-1576402187878-974f70c890a5",
    category: "Nutrition",
    date: "10 Feb 2026",
  },
  {
    id: 3,
    title: "Organic Farming and Sustainability",
    description:
      "Organic farming helps protect soil fertility and supports biodiversity in agriculture.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    category: "Farming",
    date: "5 Feb 2026",
  },
  {
    id: 4,
    title: "Top 10 Organic Foods for Healthy Living",
    description:
      "Adding organic foods to your diet improves immunity and overall well-being.",
    image:
      "https://images.unsplash.com/photo-1604908176997-43197a92c02c",
    category: "Health",
    date: "1 Feb 2026",
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Health", "Nutrition", "Farming"];

  const filteredBlogs = blogs.filter((blog) => {
    const matchCategory =
      category === "All" || blog.category === category;

    const matchSearch =
      blog.title.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const featured = blogs[0];

  return (
    <div className="min-h-screen bg-gray-50 mt-28">

      {/* HERO */}
      <section className="bg-[#1e3a5f] text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Organic Blog</h1>
        <p className="max-w-2xl mx-auto text-gray-200">
          Discover healthy lifestyle tips, organic farming ideas,
          and nutrition knowledge from our experts.
        </p>
      </section>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-4 mt-10">

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search blog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 text-gray-400" />
          </div>

          {/* Categories */}
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  category === cat
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-green-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* FEATURED BLOG */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-md overflow-hidden">

          <img
            src={featured.image}
            alt={featured.title}
            className="h-72 md:h-full w-full object-cover"
          />

          <div className="p-6 flex flex-col justify-center">
            <span className="text-green-600 text-sm font-semibold">
              Featured
            </span>

            <h2 className="text-2xl font-bold mt-2">
              {featured.title}
            </h2>

            <p className="text-gray-600 mt-3">
              {featured.description}
            </p>

            <p className="text-gray-400 text-sm mt-4">
              {featured.date}
            </p>

            <button className="mt-4 w-fit bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-4 py-14">

        <h2 className="text-2xl font-bold mb-8 text-center">
          Latest Articles
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <span className="text-green-600 text-xs font-semibold">
                  {blog.category}
                </span>

                <h3 className="text-lg font-semibold mt-2">
                  {blog.title}
                </h3>

                <p className="text-gray-600 text-sm mt-2">
                  {blog.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-xs">
                    {blog.date}
                  </span>

                  <button className="text-green-600 font-medium hover:underline">
                    Read
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}