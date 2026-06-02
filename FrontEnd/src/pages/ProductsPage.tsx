import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import ProductCard from "../components/product/ProductCard";
import ProductDetailsModal from "../components/product/ProductDetailsModel";
import { Product } from "../components/product/types";
import { productService } from "../services/ProductServices";
import { megaCategories } from "../data/categories";
import { useLanguage } from "../context/LanguageContext";
import { SlidersHorizontal, ChevronDown, SearchX, Heart, ShoppingBag, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORY_IMAGES: Record<string, string> = {
  groceryShop: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=70",
  cakes: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=70",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=70",
  clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=70",
  bookShop: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&q=70",
  pharmacy: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&q=70",
  partyReligious: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&q=70",
  vegetablesFruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=70",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=70",
  toys: "https://images.unsplash.com/photo-1558877385-8c1b8e6e6b3e?w=200&q=70",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=70",
  kitchenItems: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70",
  plastic: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=200&q=70",
  petCare: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=70",
  handBagsShoes: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=70",
  cosmetics: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=70",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&q=70",
  handwearShop: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=200&q=70",
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=70";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);

  const scrollCats = (dir: "left" | "right") => {
    catScrollRef.current?.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
  };

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
          (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
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

  const subCategoryPills = useMemo(() => {
    if (!selectedMainCategory) return [];
    return (selectedMainCategory.items || []).map((item) => ({
      key: (typeof item === "string" ? item : item.titleKey).toLowerCase(),
      label: typeof item === "string" ? item : item.titleKey,
    }));
  }, [selectedMainCategory]);

  const activeSubKey = useMemo(() => {
    if (category === "all" || mainCategories.some((c) => c.key === category)) return null;
    return category;
  }, [category, mainCategories]);

  const groupedProducts = useMemo(() => {
    if (!selectedMainCategory) return null;
    const groups: Record<string, Product[]> = {};
    (selectedMainCategory.items || []).forEach((item) => {
      const subKey = typeof item === "string" ? item : item.titleKey;
      groups[subKey] = filteredProducts.filter((p) => norm(p.subCategory || "") === norm(subKey));
    });
    return groups;
  }, [filteredProducts, selectedMainCategory]);

  const hasGroupedProducts = groupedProducts
    ? Object.values(groupedProducts).some((arr) => arr.length > 0)
    : false;

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "newest", label: "Newest First" },
  ];

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label ?? "Sort";

  return (
    <main className="min-h-screen bg-canvas">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            className="w-full h-full object-cover scale-105"
            alt="Products"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[480px] md:min-h-[560px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-16">
          <p className="eyebrow text-honey-light mb-4">
            <ShoppingBag className="w-3.5 h-3.5" /> Our Collection
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight max-w-2xl leading-[1.02]">
            {t("allProducts")}
          </h1>
          <p className="text-white/70 text-base max-w-md mb-8">{t("browse")}</p>
          <button
            onClick={() =>
              document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn btn-accent self-start"
          >
            {t("explore_products")}
          </button>
        </div>
      </section>

      {/* STICKY CATEGORY BAR */}
      <div className="sticky top-[70px] md:top-[122px] z-20 bg-canvas/95 backdrop-blur-xl border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollCats("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full shadow-md text-stone-400 hover:text-evergreen hover:border-evergreen/40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={catScrollRef}
            className="flex items-center gap-2 overflow-x-scroll scrollbar-hide px-10 py-3"
            style={{ touchAction: "pan-x" }}
          >
            {/* All */}
            <button
              onClick={() => handleCategorySelect("all")}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategoryKey === "all"
                  ? "bg-evergreen text-white shadow-md shadow-evergreen/25"
                  : "bg-white border border-stone-200 text-stone-500 hover:border-evergreen/40 hover:text-evergreen"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />
              {t("all")}
            </button>

            <div className="w-px h-5 bg-stone-200 flex-shrink-0" />

            {/* Category pills with mini thumbnail */}
            {megaCategories.map((cat) => {
              const active = activeCategoryKey === cat.titleKey.toLowerCase();
              return (
                <button
                  key={cat.titleKey}
                  onClick={() => handleCategorySelect(cat.titleKey.toLowerCase())}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-evergreen text-white shadow-md shadow-evergreen/25"
                      : "bg-white border border-stone-200 text-stone-500 hover:border-evergreen/40 hover:text-evergreen"
                  }`}
                >
                  <img
                    src={CATEGORY_IMAGES[cat.titleKey] || FALLBACK_IMG}
                    alt=""
                    className={`w-5 h-5 rounded-full object-cover flex-shrink-0 ${active ? "opacity-90" : "opacity-80"}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  {t(cat.titleKey)}
                </button>
              );
            })}

            <div className="w-px h-5 bg-stone-200 flex-shrink-0" />

            {/* Favorites */}
            <button
              onClick={() => navigate("/favorites")}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-rose-200 text-rose-400 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-400 flex-shrink-0" />
              {t("favorites")}
              {favorites.length > 0 && (
                <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[10px] leading-none">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollCats("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-full shadow-md text-stone-400 hover:text-evergreen hover:border-evergreen/40 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-category strip */}
        {subCategoryPills.length > 0 && (
          <div className="border-t border-stone-100 bg-stone-50/70 relative">
            <div
              className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-scroll scrollbar-hide px-4 py-2"
              style={{ touchAction: "pan-x" }}
            >
              <span className="flex-shrink-0 text-[9px] font-black uppercase tracking-widest text-stone-300 mr-1.5">
                Filter
              </span>
              {subCategoryPills.map((sub) => {
                const active = activeSubKey === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => handleCategorySelect(sub.key)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                      active
                        ? "bg-honey text-white shadow-sm"
                        : "bg-white border border-stone-200 text-stone-500 hover:border-honey/50 hover:text-honey"
                    }`}
                  >
                    {t(sub.label)}
                  </button>
                );
              })}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-stone-50 to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <section id="products-grid" className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="text-sm text-stone-500">
            {loading ? (
              <span className="animate-pulse">Loading products…</span>
            ) : (
              <>
                <span className="font-display font-bold text-evergreen text-lg">
                  {filteredProducts.length}
                </span>
                <span> product{filteredProducts.length !== 1 ? "s" : ""}</span>
                {category !== "all" && !searchQuery && (
                  <>
                    <span className="mx-1.5 text-stone-300">·</span>
                    <span className="text-honey font-semibold">{t(category) || category}</span>
                  </>
                )}
                {searchQuery && (
                  <>
                    <span className="mx-1.5 text-stone-300">·</span>
                    <span className="text-stone-600">"{searchQuery}"</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-evergreen bg-white border border-stone-200 rounded-full hover:border-evergreen/40 transition shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-honey" />
              {activeSortLabel}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50 animate-scaleIn p-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition ${
                      sortBy === opt.value
                        ? "bg-evergreen text-white font-semibold"
                        : "text-ink hover:bg-mist/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SKELETON */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 skeleton rounded-full w-3/4" />
                  <div className="h-3 skeleton rounded-full w-1/2" />
                  <div className="h-3 skeleton rounded-full w-2/3" />
                  <div className="h-9 skeleton rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-5">
              <SearchX className="w-9 h-9 text-stone-400" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-2">No products found</h3>
            <p className="text-stone-400 text-sm mb-7">Try a different category or clear your search</p>
            <button onClick={() => navigate("/products")} className="btn btn-primary">
              View all products
            </button>
          </div>
        )}

        {/* GROUPED BY SUBCATEGORY */}
        {!loading && filteredProducts.length > 0 && selectedMainCategory && groupedProducts && hasGroupedProducts && (
          <div className="space-y-16">
            {(selectedMainCategory.items || []).map((item) => {
              const subKey = typeof item === "string" ? item : item.titleKey;
              const subProducts = groupedProducts[subKey];
              if (!subProducts || subProducts.length === 0) return null;
              return (
                <div key={subKey}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="font-display text-2xl font-semibold text-ink whitespace-nowrap">
                      {t(subKey)}
                    </h2>
                    <span className="text-xs font-semibold text-honey bg-honey-soft px-2.5 py-1 rounded-full border border-honey/20">
                      {subProducts.length}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-honey/30 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {subProducts.map((p) => (
                      <ProductCard key={p._id} product={p} onViewDetails={() => setSelectedProduct(p)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FLAT GRID */}
        {!loading && filteredProducts.length > 0 && (!selectedMainCategory || !hasGroupedProducts) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} onViewDetails={() => setSelectedProduct(p)} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <p className="text-center text-stone-400 text-sm mt-14">
            {t("showing")} {filteredProducts.length} / {products.length}
          </p>
        )}
      </section>

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
