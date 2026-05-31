import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const featureCards = [
  {
    tag: "Daily Essentials",
    titleKey: "cat_products",
    subtitleKey: "cat_products_sub",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    href: "/products?category=groceryshop",
  },
  {
    tag: "Wellness & Beauty",
    titleKey: "cat_beauty",
    subtitleKey: "cat_beauty_sub",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    href: "/products?category=cosmetics",
  },
  {
    tag: "Home & Living",
    titleKey: "cat_home",
    subtitleKey: "cat_home_sub",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    href: "/products?category=kitchenitems",
  },
];

const allCategories = [
  { key: "Meat and Poultry",     image: "https://img.freepik.com/free-photo/raw-chicken-fillet-with-garlic-pepper-rosemary-wooden-chopping-board_1150-37784.jpg" },
  { key: "Fruits and Vegetables",image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80" },
  { key: "Grains and Minerals",  image: "https://img.freepik.com/premium-photo/collection-grains-isolated-white-background_999327-76532.jpg?w=400" },
  { key: "Dairy Products",       image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80" },
  { key: "Herbs and Spices",     image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80" },
  { key: "Packaged Foods",       image: "https://images.unsplash.com/photo-1604908176997-43197a92c02c?w=200&q=80" },
  { key: "Snacks",               image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200&q=80" },
  { key: "Oilseeds and Oils",    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80" },
  { key: "Sweeteners",           image: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=200&q=80" },
  { key: "Cosmetics",            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80" },
  { key: "Skincare",             image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=80" },
  { key: "Essential Oils",       image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=80" },
  { key: "Tea & Coffee",         image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80" },
  { key: "Home Textiles",        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=80" },
  { key: "Apparel",              image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80" },
  { key: "Hoodies",              image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=200&q=80" },
  { key: "Baby Clothing",        image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&q=80" },
  { key: "Pet Products",         image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80" },
  { key: "Cleaning Products",    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80" },
  { key: "Garden Supplies",      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80" },
];

export default function TrendingCategories() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            {t("trendingBadge")}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] mb-3">
            {t("trendingTitle")}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Explore our curated collections across lifestyle, beauty, and home essentials.
          </p>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featureCards.map((card) => (
            <div
              key={card.titleKey}
              onClick={() => navigate(card.href)}
              className="relative rounded-3xl overflow-hidden h-72 group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={card.image}
                alt={t(card.titleKey)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/90 via-[#1e3a5f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4af37] mb-1">{card.tag}</p>
                <h3 className="text-xl font-extrabold mb-1 leading-tight">{t(card.titleKey)}</h3>
                <p className="text-white/65 text-xs mb-3">{t(card.subtitleKey)}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#d4af37] group-hover:gap-3 transition-all">
                  {t("shopNow")} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">All Categories</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* ── Category Icon Grid ── */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
          {allCategories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => navigate(`/products?search=${encodeURIComponent(cat.key)}`)}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-100 group-hover:ring-[#d4af37]/50 transition-all shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.key}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 group-hover:text-[#1e3a5f] leading-tight transition-colors">
                {t(cat.key) || cat.key}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
