import { useEffect, useState, useMemo } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import { Product } from "../components/product/types";
import { productService } from "../services/ProductServices";
import { megaCategories } from "../data/categories";
import { useLanguage } from "../context/LanguageContext";

export default function ProductPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Get category from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "all";
    const s = params.get("search") || "";
setCategory(cat.toLowerCase());
    setSearchQuery(s);
  }, [location.search]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        const formatted = data.map((p: any) => ({
          ...p,
          category: typeof p.category === "string"
            ? p.category.toLowerCase()
            : p.category?.name?.toLowerCase() || "",
          subCategory: typeof p.subCategory === "string"
            ? p.subCategory.toLowerCase()
            : p.subCategory?.name?.toLowerCase() || "",
        }));
        setProducts(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

const mainCategories = [
  { key: "all", label: "all" },
  ...megaCategories.map((c) => ({
    key: t(c.titleKey).toLowerCase(),   // REAL category name
    label: c.titleKey,                  // for translation display
  })),
];
 
  const getProductPrice = (p: any) => {
  if (p.discount && p.newPrice) return Number(p.newPrice);
  if (p.price) return Number(p.price);
  if (p.newPrice) return Number(p.newPrice);
  return 0;
};

const normalizeString = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const filteredProducts = useMemo(() => {
  let filtered = [...products];

  // If there's a search query, filter by product name, category or subCategory
  if (searchQuery && searchQuery.trim() !== "") {
    const normSearch = normalizeString(searchQuery);

    // try to detect if search matches a translated subcategory label
    let matchedSubKey: string | null = null;
    for (const group of megaCategories) {
      for (const item of group.items || []) {
        const subKey = typeof item === "string" ? item : item.titleKey;
        if (normalizeString(t(subKey)) === normSearch) {
          matchedSubKey = subKey;
          break;
        }
      }
      if (matchedSubKey) break;
    }

    filtered = filtered.filter((p) => {
      const nameEn = (p.nameEn || "").toLowerCase();
      const nameSi = (p.nameSi || "").toLowerCase();

      if (nameEn.includes(searchQuery.toLowerCase()) || nameSi.includes(searchQuery.toLowerCase())) return true;

      if (matchedSubKey) {
        return (
          normalizeString(p.category || "") === normalizeString(matchedSubKey) ||
          normalizeString(p.subCategory || "") === normalizeString(matchedSubKey)
        );
      }

      return (
        normalizeString(p.category || "").includes(normSearch) ||
        normalizeString(p.subCategory || "").includes(normSearch)
      );
    });
  } else if (category !== "all") {
    filtered = filtered.filter(
      (p) =>
        normalizeString(p.category || "") === normalizeString(category) ||
        normalizeString(p.subCategory || "") === normalizeString(category)
    );
  }

  // Sorting code remains the same
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      break;

    case "price-high":
      filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      break;

    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
      break;

    case "featured":
    default:
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }

  return filtered;
}, [products, category, sortBy, t]);

// Get subcategories of selected main category
const selectedMainCategory = megaCategories.find(
  (c) => t(c.titleKey).toLowerCase() === category
);

const groupedProducts = useMemo(() => {
  if (!selectedMainCategory) return null;

  const groups: Record<string, Product[]> = {};

  (selectedMainCategory.items || []).forEach((item) => {
    const subKey = typeof item === "string" ? item : item.titleKey;
    groups[subKey] = filteredProducts.filter(
      (p) => normalizeString(p.subCategory || "") === normalizeString(subKey)
    );
  });

  return groups;
}, [filteredProducts, selectedMainCategory]);

  return (
    <main className="bg-[#1e3a5f]/5 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Products background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 via-[#2a4a7c]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-white">
          <div className="max-w-2xl backdrop-blur-md bg-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_#1e3a5f4d] text-center mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              {t("allProducts")}
            </h1>
            <p className="text-sm sm:text-lg opacity-90 mb-8">{t("browse")}</p>
            <button
              onClick={() =>
                document
                  .getElementById("products-grid")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[#1e3a5f] px-8 py-4 rounded-full hover:bg-[#2a4a7c] transition shadow-[0_6px_20px_#1e3a5f4d] text-[#d4af37] font-semibold"
            >
              {t("explore_products")}
            </button>
          </div>
        </div>
      </section>

      {/* FILTER + PRODUCT GRID */}
      <section id="products-grid" className="max-w-7xl mx-auto px-4 py-12">
        {/* FILTER BAR */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {mainCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key.toLowerCase())}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition shadow-[0_4px_12px_#1e3a5f4d]
                ${
                  category === cat.key.toLowerCase()
                    ? "bg-[#1e3a5f] text-[#d4af37]"
                    : "bg-white text-[#2a4a7c] hover:bg-[#1e3a5f]/10"
                }`}
            >
              {t(cat.label)}
            </button>
          ))}
          <button
            onClick={() => navigate("/favorites")}
            className="px-6 py-3 rounded-full text-sm font-semibold transition shadow-[0_4px_12px_#1e3a5f4d] bg-[#d4af37] text-[#1e3a5f] hover:scale-105"
          >
            ❤️ {t("favorites")} ({favorites.length})
          </button>
        </div>

        {/* SORT SELECT */}
        <div className="flex justify-end mb-6">
          <span className="text-[#2a4a7c] mr-2">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-[#2a4a7c]/30 rounded-lg focus:ring-[#d4af37]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {/* PRODUCT GRID */}
{selectedMainCategory && groupedProducts ? (
  <div className="space-y-12">
    {(selectedMainCategory.items || []).map((item) => {
      const subKey = typeof item === "string" ? item : item.titleKey;
      const subProducts = groupedProducts[subKey];

      if (!subProducts || subProducts.length === 0) return null;

      return (
        <div key={subKey}>
          {/* Subcategory Title */}
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 border-b pb-2">
            {t(subKey)}
          </h2>

          {/* Products Under Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subProducts.map((p: Product) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {filteredProducts.map((p) => (
      <ProductCard key={p._id} product={p} />
    ))}
  </div>
)}

        {/* FOOTER TEXT */}
        <p className="text-center text-[#2a4a7c] mt-10">
          {t("showing")} {filteredProducts.length} / {products.length}
        </p>
      </section>
    </main>
  );
}
