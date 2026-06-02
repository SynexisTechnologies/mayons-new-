import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function ContactFAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
  ];

  return (
    <section className="py-20 md:py-24 bg-canvas">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="eyebrow text-honey justify-center mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-3">
            {t("faqTitle")}
          </h2>
          <p className="text-stone-500 text-[15px]">{t("faqSubtitle")}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-white transition-all duration-200 overflow-hidden ${
                open === i ? "border-honey/40 shadow-sm" : "border-stone-100"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-mist/30 transition"
              >
                <span
                  className={`font-semibold text-[15px] ${
                    open === i ? "text-evergreen" : "text-ink"
                  }`}
                >
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 ml-4 text-honey transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <div className="h-px bg-stone-100 mb-4" />
                  <p className="text-stone-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
