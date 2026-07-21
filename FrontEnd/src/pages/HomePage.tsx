import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import TrendingCategories from "./TrendingCategories";
import BestOffer from "../components/product/BestOffer";
import { megaCategories } from "../data/categories";
import hero1 from "../assets/images/Clothing.png";
import hero2 from "../assets/images/Grocery.png";
import hero3 from "../assets/images/Idle.png";
import hero4 from "../assets/images/Vegetables & Fruits.png";

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

const heroImages = [hero1, hero2, hero3, hero4];

const heroSlides = [
  { label: "Clothing & Apparel", badge: "NEW ARRIVALS", title: "Clothing", tagline: "Your style starts here", categoryKey: "clothing" },
  { label: "Grocery & Essentials", badge: "DAILY FRESH", title: "Grocery", tagline: "Shop fresh. Live better", categoryKey: "groceryShop" },
  { label: "Natural Lifestyle", badge: "PURE ORGANIC", title: "Natural Lifestyle", tagline: "Everything at your fingertips", categoryKey: null },
  { label: "Vegetables & Fruits", badge: "FARM FRESH", title: "Vegetables & Fruits", tagline: "The art of nature", categoryKey: "vegetablesFruits" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setSlide(idx);
      setTransitioning(false);
    }, 300);
  };

  const next = () => goTo((slide + 1) % heroImages.length);
  const prev = () => goTo((slide - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  return (
    <>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative w-full h-screen min-h-[640px] overflow-hidden bg-evergreen">
        {/* Slides */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${
              slide === i ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                slide === i ? "scale-110" : "scale-100"
              }`}
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content — editorial left-aligned */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pt-[100px] md:pt-[122px]">
          <div className="max-w-2xl text-white">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-white/60 text-sm font-medium tracking-[0.2em] uppercase mb-3"
            >
              {t("heroTitlePrefix")}
            </motion.p>

            <motion.h1
              key={`title-${slide}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: transitioning ? 0 : 1, y: transitioning ? 24 : 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-[5.2rem] font-semibold leading-[1.02] tracking-tight mb-5"
            >
              <span className="text-gradient-gold drop-shadow-sm">
                {heroSlides[slide].title}
              </span>
            </motion.h1>

            <motion.p
              key={`tagline-${slide}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: transitioning ? 0 : 1, y: transitioning ? 14 : 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-honey-light text-xl md:text-3xl font-medium mb-9 text-pretty"
            >
              {heroSlides[slide].tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="flex flex-wrap gap-3.5 mb-12"
            >
              <button
                onClick={() =>
                  navigate(
                    heroSlides[slide].categoryKey
                      ? `/products?category=${heroSlides[slide].categoryKey!.toLowerCase()}`
                      : "/products"
                  )
                }
                className="btn btn-accent text-base"
              >
                {t("exploreMore")} <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Vertical slide rail (desktop) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-4">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group flex items-center gap-3"
            >
              <span
                className={`text-[11px] font-medium tracking-wide transition-all ${
                  slide === i ? "text-honey-light opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {heroSlides[i].label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  slide === i ? "w-2.5 h-8 bg-honey" : "w-2.5 h-2.5 bg-white/40 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Prev/Next */}
        <div className="absolute bottom-8 left-6 z-30 flex items-center gap-3">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full glass-dark flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full glass-dark flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════ ALL CATEGORIES ═══════════════════════ */}
      <section className="bg-canvas py-14 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-stone-400">
              All Categories
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {megaCategories.map((cat) => (
              <motion.button
                key={cat.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate(`/products?category=${cat.titleKey.toLowerCase()}`)}
                className="flex flex-col items-center text-center gap-2.5 p-3 rounded-2xl hover:bg-white transition-colors group"
              >
                <div className="w-16 h-16 rounded-[1.1rem] overflow-hidden ring-2 ring-stone-200 group-hover:ring-honey-light group-hover:scale-105 transition-all shadow-sm">
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
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VALUE PROPS ═══════════════════════ */}
      <section className="bg-canvas py-14 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Truck className="w-6 h-6" />,
              title: "Shipping",
              text: "Delivery starts from Rs. 500.00",
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Delivery Area",
              text: "Grocery items are delivered within Colombo only.",
            },
            {
              icon: <Clock className="w-6 h-6" />,
              title: "Delivery Time",
              text: "We deliver within 48 hours.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="card hover-lift p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-mist text-evergreen flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-ink mb-1">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ SUB SECTIONS ═══════════════════════ */}
      <TrendingCategories />
      <BestOffer />
    </>
  );
}
