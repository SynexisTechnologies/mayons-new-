import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import SeasonalPage from "../pages/SeasonalPage";
import TrendingCategories from "./TrendingCategories";
import BestOffer from "../components/product/BestOffer";
import hero1 from "../assets/images/Clothing.png";
import hero2 from "../assets/images/Grocery.png";
import hero3 from "../assets/images/Idle.png";
import hero4 from "../assets/images/Vegetables & Fruits.png";

const heroImages = [hero1, hero2, hero3, hero4];

const heroSlides = [
  { label: "Clothing & Apparel", badge: "NEW ARRIVALS" },
  { label: "Grocery & Essentials", badge: "DAILY FRESH" },
  { label: "Natural Lifestyle", badge: "PURE ORGANIC" },
  { label: "Vegetables & Fruits", badge: "FARM FRESH" },
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

  const marqueeItems = [
    t("featureOrganic"),
    t("featurePrice"),
    t("featureQuality"),
    "Farm to Table",
    "Eco Packaging",
    "Island-wide Delivery",
  ];

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
            <motion.div
              key={`badge-${slide}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: transitioning ? 0 : 1, y: transitioning ? 14 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-honey-light" />
              <span className="text-honey-light text-[11px] font-bold tracking-[0.22em] uppercase">
                {heroSlides[slide].badge}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-white/60 text-sm font-medium tracking-[0.2em] uppercase mb-3"
            >
              {t("heroTitlePrefix")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl lg:text-[5.2rem] font-semibold leading-[1.02] tracking-tight mb-5"
            >
              <span className="text-gradient-gold drop-shadow-sm">
                {t("heroTitleHighlight")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed mb-9 text-pretty"
            >
              {t("heroDescription")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="flex flex-wrap gap-3.5 mb-12"
            >
              <button onClick={() => navigate("/products")} className="btn btn-accent text-base">
                {t("exploreMore")} <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/signup")} className="btn btn-light text-base">
                {t("register1")}
              </button>
            </motion.div>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="flex flex-wrap gap-3 max-w-lg"
            >
              {[
                { icon: <Sprout className="w-4 h-4" />, label: t("featureOrganic") },
                { icon: <TrendingUp className="w-4 h-4" />, label: t("featurePrice") },
                { icon: <Award className="w-4 h-4" />, label: t("featureQuality") },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 glass-dark rounded-full px-4 py-2.5"
                >
                  <span className="text-honey-light">{icon}</span>
                  <p className="text-[12.5px] font-semibold text-white/90">{label}</p>
                </div>
              ))}
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

      {/* ═══════════════════════ MARQUEE STRIP ═══════════════════════ */}
      <div className="bg-evergreen text-white py-3.5 overflow-hidden border-y border-white/10">
        <div className="flex w-max animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 px-8 text-sm font-medium whitespace-nowrap">
              <Leaf className="w-4 h-4 text-honey-light" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════ VALUE PROPS ═══════════════════════ */}
      <section className="bg-canvas py-14 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Truck className="w-6 h-6" />,
              title: "Island-wide Delivery",
              text: "Fresh to your doorstep, Colombo same-day available.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Certified Organic",
              text: "Every product meets international organic standards.",
            },
            {
              icon: <Sprout className="w-6 h-6" />,
              title: "Farm Direct",
              text: "Sourced straight from trusted local farmers.",
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
      <SeasonalPage />
      <BestOffer />
    </>
  );
}
