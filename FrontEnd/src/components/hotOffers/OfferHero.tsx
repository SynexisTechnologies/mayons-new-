import { useLanguage } from "../../context/LanguageContext";
import { Flame } from "lucide-react";

export default function OfferHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Hot Offers"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-[#1e3a5f]/10" />
      </div>

      <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
        <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
          <Flame className="w-3.5 h-3.5" />
          {t("limited_deal")}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow max-w-2xl">
          {t("hotOffersTitle")}
        </h1>
        <p className="text-white/70 text-sm sm:text-base max-w-xl mb-8">
          {t("hotOffersSubtitle")}
        </p>
        <button
          onClick={() => document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-3 bg-[#d4af37] text-[#1e3a5f] rounded-full font-bold hover:bg-[#e0c040] transition shadow-lg cursor-pointer text-sm"
        >
          {t("shop_Hot_Deals")}
        </button>
      </div>
    </section>
  );
}
