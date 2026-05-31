import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import { Product } from "../components/product/types";
import { productService } from "../services/ProductServices";
import { megaCategories } from "../data/categories";
import { useLanguage } from "../context/LanguageContext";
import { SlidersHorizontal, ChevronDown, SearchX, Heart, ChevronRight } from "lucide-react";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function findParentTitleKey(subKey: string): string | null {
  const n = norm(subKey);
  function search(items: any[]): boolean {
    for (const item of items) {
      if (typeof item === "string") {
        if (norm(item) === n) return true;
      } else if (item?.titleKey) {
        if (norm(item.titleKey) === n) return true;
        if (search(item.items || [])) return true;
      }
    }
    return false;
  }
  for (const group of megaCategories) {
    if (search(group.items || [])) return group.titleKey.toLowerCase();
  }
  return null;
}

function getProductPrice(p: Product) {
  if (p.discount && p.newPrice) return Number(p.newPrice);
  if (p.price) return Number(p.price);
  if (p.newPrice) return Number(p.newPrice);
  return 0;
}

export default function ProductPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "all";
    const s = params.get("search") || "";
    setCategory(cat.toLowerCase());
    setSearchQuery(s);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    productService
      .getAll()
      .then((data: any[]) => {
        setProducts(
          data.map((p) => ({
            ...p,
            category:
              typeof p.category === "string"
                ? p.category.toLowerCase()
                : p.category?.name?.toLowerCase() || "",
            subCategory:
              typeof p.subCategory === "string"
                ? p.subCategory.toLowerCase()
                : p.subCategory?.name?.toLowerCase() || "",
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const mainCategories = useMemo(
    () => [
      { key: "all", label: "all" },
      ...megaCategories.map((c) => ({ key: c.titleKey.toLowerCase(), label: c.titleKey })),
    ],
    []
  );

  const handleCategorySelect = useCallback(
    (key: string) => {
      navigate(key === "all" ? "/products" : `/products?category=${key}`);
    },
    [navigate]
  );

  const activeCategoryKey = useMemo(() => {
    if (category === "all") return "all";
    if (mainCategories.some((c) => c.key === category)) return category;
    return findParentTitleKey(category) || "all";
  }, [category, mainCategories]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const normSearch = norm(searchQuery);
      let matchedSubKey: string | null = null;
      outer: for (const group of megaCategories) {
        for (const item of group.items || []) {
          const subKey = typeof item === "string" ? item : item.titleKey;
          if (norm(t(subKey)) === normSearch) {
            matchedSubKey = subKey;
            break outer;
          }
        }
      }
      filtered = filtered.filter((p) => {
        if ((p.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase())) return true;
        if ((p.nameSi || "").toLowerCase().includes(searchQuery.toLowerCase())) return true;
        if (matchedSubKey) {
          return (
            norm(p.category || "") === norm(matchedSubKey) ||
            norm(p.subCategory || "") === norm(matchedSubKey)
          );
        }
        return (
          norm(p.category || "").includes(normSearch) ||
          norm(p.subCategory || "").includes(normSearch)
        );
      });
    } else if (category !== "all") {
      filtered = filtered.filter(
        (p) =>
          norm(p.category || "") === norm(category) ||
          norm(p.subCategory || "") === norm(category)
      );
    }

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
            new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        );
        break;
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, category, sortBy, t, searchQuery]);

  const selectedMainCategory = useMemo(
    () => megaCategories.find((c) => c.titleKey.toLowerCase() === category),
    [category]
  );

  // Sub-category pills: first-level items of the selected main category
  const subCategoryPills = useMemo(() => {
    if (!selectedMainCategory) return [];
    return (selectedMainCategory.items || []).map((item) => ({
      key: (typeof item === "string" ? item : item.titleKey).toLowerCase(),
      label: typeof item === "string" ? item : item.titleKey,
    }));
  }, [selectedMainCategory]);

  // Whether the current category is a sub-category (not main, not all)
  const activeSubKey = useMemo(() => {
    if (category === "all" || mainCategories.some((c) => c.key === category)) return null;
    return category;
  }, [category, mainCategories]);

  const groupedProducts = useMemo(() => {
    if (!selectedMainCategory) return null;
    const groups: Record<string, Product[]> = {};
    (selectedMainCategory.items || []).forEach((item) => {
      const subKey = typeof item === "string" ? item : item.titleKey;
      groups[subKey] = filteredProducts.filter(
        (p) => norm(p.subCategory || "") === norm(subKey)
      );
    });
    return groups;
  }, [filteredProducts, selectedMainCategory]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "newest", label: "Newest First" },
  ];

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label ?? "Sort";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover scale-105"
            alt="Products"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-[#1e3a5f]/10" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Our Collection
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow">
            {t("allProducts")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-md mb-6">{t("browse")}</p>
          <button
            onClick={() => document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-2.5 bg-[#d4af37] text-[#1e3a5f] rounded-full text-sm font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer"
          >
            {t("explore_products")}
          </button>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <div className="sticky top-[72px] md:top-[116px] z-20 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main category row */}
          <div className="relative">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 pr-10">
              {mainCategories.map((cat) => {
                const active = activeCategoryKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => handleCategorySelect(cat.key)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200
                      ${active
                        ? "bg-[#1e3a5f] text-[#d4af37] shadow-md"
                        : "bg-slate-100 text-[#1e3a5f]/70 hover:bg-[#1e3a5f]/10 hover:text-[#1e3a5f]"
                      }`}
                  >
                    {cat.key === "all" ? t("all") : t(cat.label)}
                  </button>
                );
              })}
              <div className="w-px h-5 bg-gray-200 flex-shrink-0 mx-1" />
              <button
                onClick={() => navigate("/favorites")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-rose-50 text-rose-600 hover:bg-rose-100 transition border border-rose-100"
              >
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                {t("favorites")}
                {favorites.length > 0 && (
                  <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[10px] leading-none">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
            {/* Scroll indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1.5">
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Sub-category row — only when main category is active */}
          {subCategoryPills.length > 0 && (
            <div className="relative border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-2 pr-10">
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-1">
                  Refine:
                </span>
                {subCategoryPills.map((sub) => {
                  const active = activeSubKey === sub.key;
                  return (
                    <button
                      key={sub.key}
                      onClick={() => handleCategorySelect(sub.key)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200
                        ${active
                          ? "bg-[#d4af37] text-[#1e3a5f] shadow-sm"
                          : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-[#d4af37]/50 hover:text-[#1e3a5f]"
                        }`}
                    >
                      {t(sub.label)}
                    </button>
                  );
                })}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <section id="products-grid" className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div className="text-sm text-slate-500">
            {loading ? (
              <span className="animate-pulse">Loading products…</span>
            ) : (
              <>
                <span className="font-bold text-[#1e3a5f] text-base">{filteredProducts.length}</span>
                <span> product{filteredProducts.length !== 1 ? "s" : ""}</span>
                {category !== "all" && !searchQuery && (
                  <>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="text-[#d4af37] font-semibold">{t(category) || category}</span>
                  </>
                )}
                {searchQuery && (
                  <>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="text-slate-600">"{searchQuery}"</span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1e3a5f] bg-white border border-slate-200 rounded-xl hover:border-[#1e3a5f]/40 transition shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" />
              {activeSortLabel}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-scaleIn">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition
                      ${sortBy === opt.value
                        ? "bg-[#1e3a5f] text-[#d4af37] font-semibold"
                        : "text-[#1e3a5f] hover:bg-slate-50"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="aspect-square bg-slate-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-3 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-9 bg-slate-200 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
              <SearchX className="w-9 h-9 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">No products found</h3>
            <p className="text-slate-400 text-sm mb-7">
              Try a different category or clear your search
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-full text-sm font-semibold hover:bg-[#2a4a7c] transition shadow-md"
            >
              View all products
            </button>
          </div>
        )}

        {/* ── GROUPED BY SUBCATEGORY ── */}
        {!loading && filteredProducts.length > 0 && selectedMainCategory && groupedProducts && (
          <div className="space-y-14">
            {(selectedMainCategory.items || []).map((item) => {
              const subKey = typeof item === "string" ? item : item.titleKey;
              const subProducts = groupedProducts[subKey];
              if (!subProducts || subProducts.length === 0) return null;
              return (
                <div key={subKey}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-bold text-[#1e3a5f] whitespace-nowrap">{t(subKey)}</h2>
                    <span className="text-xs font-semibold text-[#d4af37] bg-[#1e3a5f]/8 px-2.5 py-1 rounded-full border border-[#d4af37]/20">
                      {subProducts.length}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {subProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FLAT GRID ── */}
        {!loading && filteredProducts.length > 0 && !selectedMainCategory && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && filteredProducts.length > 0 && (
          <p className="text-center text-slate-400 text-sm mt-12">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}
      </section>
    </main>
  );
}
