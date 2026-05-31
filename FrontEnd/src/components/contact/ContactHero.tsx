import { useLanguage } from "../../context/LanguageContext";
import { Mail } from "lucide-react";

export default function ContactHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Contact background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-white">
        <div className="max-w-2xl backdrop-blur-md bg-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
            <Mail className="w-4 h-4" />
            Let’s talk
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            {t("contactTitle")}
          </h1>

          <p className="text-sm sm:text-lg opacity-90 mb-8">
            {t("contactSubtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
