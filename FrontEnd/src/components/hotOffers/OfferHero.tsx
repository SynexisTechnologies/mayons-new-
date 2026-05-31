import { useLanguage } from "../../context/LanguageContext";

export default function OfferHero() {
  const { t } = useLanguage();

  return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.istockphoto.com/id/2234888340/photo/thanksgiving-celebration-with-fresh-vegetables-and-special-sale-announcement.jpg?s=612x612&w=0&k=20&c=5ODKDkoj8HGNzwE7edkli3DxyeOqnFhsvWenLVoboGI="
            className="w-full h-full object-cover"
            alt="Shopping offers"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/80 via-[#2a4a7c]/60 to-transparent" />
        </div>

 <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_#1e3a5f4d] text-white">

           <span className="inline-block bg-[#d4af37] text-[#1e3a5f] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                🔥 {t("limited_deal")}
              </span>

              <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                {t("hotOffersTitle")}
              </h1>

              <p className="text-sm sm:text-lg opacity-90 mb-8 max-w-xl">
                {t("hotOffersSubtitle")}
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("offers")
                    ?.scrollIntoView({ behavior: "smooth" })
               }
                className="bg-[#1e3a5f] text-[#d4af37] px-8 py-4 rounded-full hover:bg-[#2a4a7c] transition shadow-[0_6px_20px_#1e3a5f4d] font-semibold"
              >
                {t("shop_Hot_Deals")}
              </button>
            </div>

            {/* RIGHT MINI PROMOS */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-5">

              <HeroPromo
                title={t("promo50")}
                subtitle={t("promoFresh")}
              />

              <HeroPromo
                title={t("promoBogo")}
                subtitle={t("promoCare")}
              />

              <HeroPromo
                title={t("promoWeekend")}
                subtitle={t("promoHome")}
              />

            </div>
          </div>
        </div>
      </section>
  );
}

function HeroPromo({ title, subtitle }: { title: string; subtitle: string }) {
  return (
      <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl p-5 shadow-[0_8px_20px_#1e3a5f4d]
                    hover:scale-105 hover:-translate-y-1
                    transition transform duration-300 ease-in-out text-center">
      <h3 className="font-bold text-lg text-[#d4af37]">{title}</h3>
      <p className="text-sm text-white/90">{subtitle}</p>
    </div>
  );
}