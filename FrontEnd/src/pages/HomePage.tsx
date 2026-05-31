import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Sparkles, TrendingUp, Award, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import SeasonalPage from "../pages/SeasonalPage";
import TrendingCategories from "./TrendingCategories";
import BestOffer from "../components/product/BestOffer";
import hero1 from "../assets/images/Clothing.png";
import hero2 from "../assets/images/Grocery.png";
import hero3 from "../assets/images/Idle.png";
import hero4 from "../assets/images/Vegetables & Fruits.png";

const heroImages = [
  hero1,
  hero2,
  hero3,
  hero4
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const heroTitleHighlight = String(t("heroTitleHighlight"));
  const words = heroTitleHighlight.split(" ");

  const highlightRef = useRef<HTMLSpanElement>(null);
  const [animateHighlight, setAnimateHighlight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
          setVisible(true);
          setAnimateHighlight(true);
          setTimeout(() => setAnimateHighlight(false), 2000);
            }
        });
      },
      { threshold: 0.3 }
    );

    if (highlightRef.current) observer.observe(highlightRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <section className="relative w-full h-[80vh] mt-28 overflow-hidden flex items-center justify-center">

  {heroImages.map((img, i) => (
    <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-1000 ${
        currentSlide === i ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <img
        src={img}
        className="absolute inset-0 w-full h-full object-cover animate-wave brightness-110"
        alt=""
      />

      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
    </div>
  ))}

        {/* CONTENT */}
        <div className="relative z-20 w-full px-6 lg:px-16">
          <div className="w-full text-center space-y-6">

            {/* BADGE */}
            <div className="mt-3 inline-flex items-center gap-3 
  bg-[#0f172a]/70 backdrop-blur-lg
  border border-[#d4af37]/60
  px-8 py-3 rounded-full shadow-xl mx-auto">

              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#f8f5ec] text-sm lg:text-base font-semibold tracking-wide">
                {t("heroBadge")}
              </span>
            </div>

<h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
  {/* FIRST PART */}
  <span className="text-[#D5D5E3] drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)] font-extrabold">
    {t("heroTitlePrefix")}
  </span>{" "}

              {/* SECOND PART – Premium Gold Gradient */}
    <span
      ref={highlightRef}
      className={`inline-flex gap-3 flex-wrap justify-center transition-all duration-1000
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}
      `}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.15}s` }}
          className={`
            inline-block
            bg-gradient-to-r from-[#D5D5E3] via-[#FFD93D] to-[#6BCB77] 
            bg-clip-text text-transparent
            drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)]
            font-extrabold
            transition-transform duration-700 ease-in-out
            ${animateHighlight ? "animate-gradient-shift scale-105" : "scale-90"}
          `}
        >
          {word}
        </span>
      ))}
    </span>

            </h1>

           <p className="text-[#C3CEDE] text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
  {t("heroDescription")}
</p>
            {/* BUTTONS */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">

              {/* PRIMARY */}
              <button
                onClick={() => navigate("/products")}
                className="px-8 py-3 bg-[#0f172a] text-[#f8f5ec] font-semibold rounded-full
                hover:bg-[#1e293b] transition-all duration-300
                flex items-center gap-2 shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              >
                {t("exploreMore")} <ArrowRight size={18} />
              </button>

              {/* SECONDARY */}
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 border border-[#D5D5E3]/70 text-[#f8f5ec]
                rounded-full hover:bg-[#0f172a]/10 transition duration-300"
              >
                {t("register1")}
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl mx-auto">
              <Feature icon={<Leaf />} label={t("featureOrganic")} />
              <Feature icon={<TrendingUp />} label={t("featurePrice")} />
              <Feature icon={<Award />} label={t("featureQuality")} />
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-3 pt-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === i
                      ? "bg-[#0f172a]"
                      : "bg-[#0f172a]/40"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
      <TrendingCategories />
      <SeasonalPage />
      <BestOffer />

      <style>{`
        @keyframes wave {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-wave {
          animation: wave 14s ease-in-out infinite;
        }

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}
      `}</style>
    </>
  );
}

function Feature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="bg-[#f8f5ec] rounded-xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.25)] text-center backdrop-blur-sm">
      <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-[#d4af37]/25 text-[#0f172a]">
        {icon}
      </div>
      <p className="font-semibold text-sm text-[#0f172a]">{label}</p>
    </div>
  );
}
