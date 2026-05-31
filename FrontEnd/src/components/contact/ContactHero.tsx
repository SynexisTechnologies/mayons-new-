import { useLanguage } from "../../context/LanguageContext";
import { MessageCircle } from "lucide-react";

export default function ContactHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[560px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Contact"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-transparent" />
      </div>

      <div className="relative z-10 min-h-[500px] md:min-h-[560px] flex flex-col items-center justify-center text-white text-center px-4 pt-[80px] md:pt-[130px] pb-14">
        <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 px-4 py-1.5 rounded-full mb-5">
          <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase">Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight drop-shadow">
          {t("contactTitle")}
        </h1>
        <p className="text-white/70 text-sm sm:text-base max-w-xl">
          {t("contactSubtitle")}
        </p>
      </div>
    </section>
  );
}
