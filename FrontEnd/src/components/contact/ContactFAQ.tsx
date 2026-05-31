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
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 text-[#1e3a5f] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] mb-3">{t("faqTitle")}</h2>
          <p className="text-slate-400 text-sm">{t("faqSubtitle")}</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-[#d4af37]/40 shadow-sm" : "border-slate-100"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span className={`font-semibold text-sm ${open === i ? "text-[#1e3a5f]" : "text-slate-700"}`}>{item.q}</span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-4 text-[#d4af37] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <div className="h-px bg-slate-100 mb-4" />
                  <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
