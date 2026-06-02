import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { megaCategories } from "../data/categories";

/* Representative imagery per real top-level category (from data/categories.ts) */
const CATEGORY_IMAGES: Record<string, string> = {
  groceryShop: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
  cakes: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80",
  clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
  bookShop: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80",
  pharmacy: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
  partyReligious: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80",
  vegetablesFruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  toys: "https://images.unsplash.com/photo-1558877385-8c1b8e6e6b3e?w=400&q=80",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  kitchenItems: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  plastic: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80",
  petCare: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
  handBagsShoes: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
  cosmetics: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  perfumes: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  handwearShop: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=80",
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

/* Three curated hero tiles — all point at real categories */
const featureCards = [
  {
    tag: "Daily Essentials",
    titleKey: "groceryShop",
    subtitleKey: "cat_products_sub",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  },
  {
    tag: "Farm Fresh",
    titleKey: "vegetablesFruits",
    subtitleKey: "cat_home_sub",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
  },
  {
    tag: "Lifestyle",
    titleKey: "clothing",
    subtitleKey: "cat_beauty_sub",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
  },
];

export default function TrendingCategories() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goToCategory = (titleKey: string) =>
    navigate(`/products?category=${titleKey.toLowerCase()}`);

  return (
    <section className="bg-canvas py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow text-honey justify-center mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t("trendingBadge")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4 text-balance">
            {t("trendingTitle")}
          </h2>
          <p className="text-stone-500 text-[15px] max-w-xl mx-auto leading-relaxed">
            Shop straight from our catalog — groceries, fresh produce, lifestyle and more.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              onClick={() => goToCategory(card.titleKey)}
              className="relative rounded-[1.75rem] overflow-hidden h-80 group cursor-pointer shadow-[0_20px_50px_-30px_rgba(36,21,38,0.6)]"
            >
              <img
                src={card.image}
                alt={t(card.titleKey)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="chip bg-white/15 text-white backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase font-bold">
                  {card.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold mb-1.5 leading-tight">
                  {t(card.titleKey)}
                </h3>
                <p className="text-white/65 text-sm mb-4">{t(card.subtitleKey)}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-honey-light group-hover:gap-3.5 transition-all">
                  {t("shopNow")} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 rule" />
          <span className="eyebrow text-stone-400">{t("allCategory")}</span>
          <div className="flex-1 rule" />
        </div>

        {/* Real category grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          {megaCategories.map((cat) => (
            <button
              key={cat.titleKey}
              onClick={() => goToCategory(cat.titleKey)}
              className="flex flex-col items-center text-center gap-2.5 p-3 rounded-2xl hover:bg-white transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-stone-200 group-hover:ring-honey-light group-hover:scale-105 transition-all shadow-sm">
                <img
                  src={CATEGORY_IMAGES[cat.titleKey] || FALLBACK_IMG}
                  alt={t(cat.titleKey)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMG;
                  }}
                />
              </div>
              <p className="text-[11.5px] font-semibold text-stone-500 group-hover:text-evergreen leading-tight transition-colors">
                {t(cat.titleKey)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
