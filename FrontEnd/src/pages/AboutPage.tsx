import { useLanguage } from "../context/LanguageContext";
import { Leaf, Heart, Truck, Shield, Users, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VALUES = [
  { icon: Leaf, key: 1 },
  { icon: Shield, key: 2 },
  { icon: Heart, key: 3 },
  { icon: Users, key: 4 },
  { icon: Truck, key: 5 },
  { icon: Award, key: 6 },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55 },
};

export default function AboutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-canvas">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            className="w-full h-full object-cover"
            alt="Organic"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="relative z-10 min-h-[480px] md:min-h-[560px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-14">
          <p className="eyebrow text-honey-light mb-4">
            <Heart className="w-3.5 h-3.5" /> Our Story
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight max-w-3xl leading-[1.02]">
            {t("aboutTitle")}
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">{t("aboutDescription")}</p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className="eyebrow text-honey mb-5">
              <Leaf className="w-3.5 h-3.5" /> The Beginning
            </p>
            <h2 className="font-display text-4xl font-semibold text-ink mb-5">{t("ourStoryTitle")}</h2>
            <div className="space-y-4 text-stone-500 leading-relaxed text-[15px]">
              <p>{t("ourStoryP1")}</p>
              <p>{t("ourStoryP2")}</p>
              <p>{t("ourStoryP3")}</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="relative">
            <div className="absolute -inset-4 bg-honey/10 rounded-[2rem] -rotate-2" />
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"
              alt="Organic products"
              className="relative rounded-[1.75rem] shadow-xl h-96 w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 md:py-24 bg-cream/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="eyebrow text-honey justify-center mb-4">
              <Award className="w-3.5 h-3.5" /> What We Stand For
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-3">
              {t("coreValuesTitle")}
            </h2>
            <p className="text-stone-500 text-[15px] max-w-xl mx-auto">{t("coreValuesDescription")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="card hover-lift p-7"
              >
                <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-evergreen" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">
                  {t(`value${key}Title`)}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{t(`value${key}Text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / STATS */}
      <section className="py-20 md:py-24 bg-evergreen text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-honey rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-sage rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-16">
          <p className="eyebrow text-honey-light justify-center mb-5">
            <Leaf className="w-3.5 h-3.5" /> Our Mission
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">{t("missionTitle")}</h2>
          <p className="text-white/60 text-[15px] max-w-xl mx-auto leading-relaxed">
            {t("missionDescription")}
          </p>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center px-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <p className="font-display text-5xl font-bold text-honey-light mb-1">{t(`stats${i}`)}</p>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
                {t(`stats${i}Label`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp} className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-evergreen/5 rounded-[2rem] rotate-2" />
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop"
              alt="Fresh vegetables"
              className="relative z-10 w-full h-96 object-cover rounded-[1.75rem] shadow-xl"
            />
          </motion.div>

          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <p className="eyebrow text-honey mb-5">
              <Shield className="w-3.5 h-3.5" /> {t("whyChooseBadge")}
            </p>
            <h2 className="font-display text-4xl font-semibold text-ink mb-8">{t("whyChooseTitle")}</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 bg-evergreen rounded-2xl flex items-center justify-center">
                    <span className="text-honey-light font-display font-bold">{i}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-1">{t(`why${i}Title`)}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{t(`why${i}Text`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-cream/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4 text-balance">
            {t("ctaTitle")}
          </h2>
          <p className="text-stone-500 text-[15px] mb-10 max-w-xl mx-auto">{t("ctaDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/login")} className="btn btn-primary">
              {t("ctaButton1")} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/contact")} className="btn btn-ghost">
              {t("ctaButton2")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
