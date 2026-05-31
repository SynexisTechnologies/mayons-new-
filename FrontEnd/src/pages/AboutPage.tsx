import { useLanguage } from "../context/LanguageContext";
import { Leaf, Heart, Truck, Shield, Users, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VALUES = [
  { icon: Leaf,   key: 1 },
  { icon: Shield, key: 2 },
  { icon: Heart,  key: 3 },
  { icon: Users,  key: 4 },
  { icon: Truck,  key: 5 },
  { icon: Award,  key: 6 },
];

export default function AboutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            className="w-full h-full object-cover" alt="Organic" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-[#1e3a5f]/20" />
        </div>
        <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <Heart className="w-3.5 h-3.5" /> Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 drop-shadow tracking-tight">{t("aboutTitle")}</h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">{t("aboutDescription")}</p>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-5">
              <Leaf className="w-3.5 h-3.5 text-[#d4af37]" /> The Beginning
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-5">{t("ourStoryTitle")}</h2>
            <div className="space-y-4 text-slate-500 leading-relaxed text-sm">
              <p>{t("ourStoryP1")}</p>
              <p>{t("ourStoryP2")}</p>
              <p>{t("ourStoryP3")}</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#d4af37]/10 rounded-3xl -rotate-2" />
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"
              alt="Organic products"
              className="relative rounded-2xl shadow-xl h-80 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" /> What We Stand For
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-3">{t("coreValuesTitle")}</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{t("coreValuesDescription")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, key }) => (
              <div key={key} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 bg-[#1e3a5f]/8 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-base font-bold text-[#1e3a5f] mb-2">{t(`value${key}Title`)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t(`value${key}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / STATS ── */}
      <section className="py-20 bg-[#1e3a5f] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#d4af37] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
            <Leaf className="w-3.5 h-3.5" /> Our Mission
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{t("missionTitle")}</h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto">{t("missionDescription")}</p>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4">
          {[1,2,3,4].map(i => (
            <div key={i}>
              <p className="text-4xl font-extrabold text-[#d4af37] mb-1">{t(`stats${i}`)}</p>
              <p className="text-white/50 text-xs font-medium">{t(`stats${i}Label`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-[#1e3a5f]/5 rounded-3xl rotate-2" />
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop"
              alt="Fresh vegetables"
              className="relative z-10 w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl" />
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-5">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" /> {t("whyChooseBadge")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-8">{t("whyChooseTitle")}</h2>
            <div className="space-y-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
                    <span className="text-[#d4af37] font-extrabold text-sm">{i}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-1 text-sm">{t(`why${i}Title`)}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{t(`why${i}Text`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">{t("ctaTitle")}</h2>
          <p className="text-slate-400 text-sm mb-10 max-w-xl mx-auto">{t("ctaDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#2a4a7c] transition shadow-md cursor-pointer text-sm">
              {t("ctaButton1")} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 border-2 border-[#d4af37] text-[#1e3a5f] px-8 py-3.5 rounded-full font-bold hover:bg-[#d4af37]/10 transition cursor-pointer text-sm">
              {t("ctaButton2")}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
