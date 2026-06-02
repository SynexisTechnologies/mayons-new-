import { useLanguage } from "../../context/LanguageContext";
import { MessageCircle } from "lucide-react";

export default function ContactHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[460px] md:min-h-[540px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Contact"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      <div className="relative z-10 min-h-[460px] md:min-h-[540px] max-w-7xl mx-auto flex flex-col justify-center text-white px-6 pt-[120px] md:pt-[150px] pb-16">
        <p className="eyebrow text-honey-light mb-5">
          <MessageCircle className="w-3.5 h-3.5" /> Get in Touch
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tight leading-[1.02]">
          {t("contactTitle")}
        </h1>
        <p className="text-white/70 text-base max-w-xl">{t("contactSubtitle")}</p>
      </div>
    </section>
  );
}
