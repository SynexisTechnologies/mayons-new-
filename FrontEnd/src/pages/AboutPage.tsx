import { useLanguage } from "../context/LanguageContext";
import { Leaf, Heart, Truck, Shield, Users, Award } from "lucide-react"
import { useNavigate } from "react-router-dom";


export default function AboutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            className="w-full h-full object-cover"
            alt="Organic background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-[#1e3a5f]/20" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 drop-shadow tracking-tight">
            {t("aboutTitle")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
            {t("aboutDescription")}
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-4">
              {t("ourStoryTitle")}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t("ourStoryP1")}</p>
              <p>{t("ourStoryP2")}</p>
              <p>{t("ourStoryP3")}</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-3xl rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"
              alt="Organic products"
              className="rounded-2xl shadow-[0_6px_20px_#1e3a5f4d] h-80 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-3">
              {t("coreValuesTitle")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("coreValuesDescription")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: t("value1Title"), text: t("value1Text"), color: "text-green-600", bg: "bg-green-100" },
              { icon: Shield, title: t("value2Title"), text: t("value2Text"), color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Heart, title: t("value3Title"), text: t("value3Text"), color: "text-red-600", bg: "bg-red-100" },
              { icon: Users, title: t("value4Title"), text: t("value4Text"), color: "text-purple-600", bg: "bg-purple-100" },
              { icon: Truck, title: t("value5Title"), text: t("value5Text"), color: "text-yellow-600", bg: "bg-yellow-100" },
              { icon: Award, title: t("value6Title"), text: t("value6Text"), color: "text-orange-600", bg: "bg-orange-100" },
            ].map(({ icon: Icon, title, text, color, bg }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     <section className="py-16 bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("missionTitle")}
          </h2>
          <p className="text-lg opacity-90">
            {t("missionDescription")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4">
          {[
            [t("stats1"), t("stats1Label")],
            [t("stats2"), t("stats2Label")],
            [t("stats3"), t("stats3Label")],
            [t("stats4"), t("stats4Label")],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="text-4xl font-bold">{value}</div>
              <p className="text-green-100 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

{/* Why Choose Us */}
<section className="py-16 sm:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      <div className="order-2 lg:order-1 relative">
        <div className="absolute inset-0 bg-[#2a4a7c] rounded-2xl blur-3xl opacity-20 transform -rotate-6"></div>
        <img
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop"
          alt="Fresh vegetables"
          className="relative z-10 w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
        />
      </div>

      <div className="order-1 lg:order-2">
        <span className="inline-block px-4 py-1 bg-[#d4af37]/10 text-[#d4af37] text-sm rounded-full mb-4">
          {t("whyChooseBadge")}
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          {t("whyChooseTitle")}
        </h2>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
                <span className="text-[#d4af37] font-bold">{i}</span>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {t(`why${i}Title`)}
                </h4>
                <p className="text-gray-600">
                  {t(`why${i}Text`)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
</section>


      {/* CTA */}
      <section className="py-16 text-center bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a5f] mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("ctaDescription")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
  {/* CTA 1 → Login */}
  <button
    onClick={() => navigate("/login")}
              className="bg-[#2a4a7c] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1e3a5f] transition shadow-[0_4px_12px_#1e3a5f4d]"
          >
    {t("ctaButton1")}
  </button>

  {/* CTA 2 → Learn More (Contact) */}
  <button
    onClick={() => navigate("/contact")}
     className="border-2 border-[#d4af37] text-[#d4af37] px-8 py-4 rounded-full font-semibold hover:bg-[#d4af37]/10 transition"
          >
    {t("ctaButton2")}
  </button>
</div>
        </div>
      </section>

    </div>
  );
}
