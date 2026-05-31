import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Sparkles, TrendingUp, Award, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slide]);

  return (
    <>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative w-full h-screen overflow-hidden">

        {/* Slides */}
        {heroImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${slide === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <img src={img} className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[12000ms]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          </div>
        ))}

        {/* Content — pushed below navbar */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-6 pt-[80px] md:pt-[130px] pb-16">

          {/* Slide badge */}
          <div className={`transition-all duration-500 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 backdrop-blur-sm border border-[#d4af37]/40 px-5 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase">
                {heroSlides[slide].badge}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className={`transition-all duration-500 delay-75 ${transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">{t("heroTitlePrefix")}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white via-[#d4af37] to-[#f0d060] bg-clip-text text-transparent drop-shadow-lg">
                {t("heroTitleHighlight")}
              </span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {t("heroDescription")}
            </p>
          </div>

          {/* CTAs */}
          <div className={`flex flex-wrap justify-center gap-4 mb-10 transition-all duration-500 delay-150 ${transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#d4af37] text-[#1e3a5f] font-bold rounded-full hover:bg-[#e0c040] transition shadow-lg hover:shadow-[#d4af37]/30 hover:scale-105"
            >
              {t("exploreMore")} <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3.5 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition"
            >
              {t("register1")}
            </button>
          </div>

          {/* Feature badges */}
          <div className={`grid grid-cols-3 gap-3 max-w-sm mx-auto transition-all duration-500 delay-200 ${transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            {[
              { icon: <Leaf className="w-4 h-4" />, label: t("featureOrganic") },
              { icon: <TrendingUp className="w-4 h-4" />, label: t("featurePrice") },
              { icon: <Award className="w-4 h-4" />, label: t("featureQuality") },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-[#d4af37]">{icon}</div>
                <p className="text-[11px] font-semibold text-white/90 text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next arrows */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition cursor-pointer">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                slide === i ? "w-8 h-2 bg-[#d4af37]" : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Slide label */}
        <div className="absolute bottom-6 right-6 z-30 hidden md:flex items-center gap-2 text-white/60 text-xs font-medium">
          <span className="w-4 h-px bg-white/40" />
          {heroSlides[slide].label}
        </div>
      </section>

      {/* ═══════════════════════ SUB SECTIONS ═══════════════════════ */}
      <TrendingCategories />
      <SeasonalPage />
      <BestOffer />
    </>
  );
}
