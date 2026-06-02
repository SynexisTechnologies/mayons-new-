import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

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
        <div className="grid md:grid-cols-3 gap-6">
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

      </div>
    </section>
  );
}
