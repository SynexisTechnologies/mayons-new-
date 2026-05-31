import { useLanguage } from "../../context/LanguageContext";

export default function ContactFAQ() {
  const { t } = useLanguage();

  const faqs = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl text-center text-[#1e3a5f] mb-4">
          {t("faqTitle")}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {t("faqSubtitle")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="bg-gray-50 p-6 rounded-xl shadow-sm"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
