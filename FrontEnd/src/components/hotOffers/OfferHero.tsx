import { useLanguage } from "../../context/LanguageContext";
import { Flame } from "lucide-react";

export default function OfferHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Hot Offers"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      <div className="relative z-10 min-h-[480px] md:min-h-[560px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-14">
        <p className="eyebrow text-honey-light mb-4">
          <Flame className="w-3.5 h-3.5" />
          {t("limited_deal")}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight max-w-2xl leading-[1.02]">
          {t("hotOffersTitle")}
        </h1>
        <p className="text-white/70 text-base max-w-xl mb-8">{t("hotOffersSubtitle")}</p>
        <button
          onClick={() => document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" })}
          className="btn btn-accent self-start"
        >
          {t("shop_Hot_Deals")}
        </button>
      </div>
    </section>
  );
}
