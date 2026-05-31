import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ContactInfo() {
  const { t } = useLanguage();

  const items = [
    { icon: Phone, title: t("contactPhoneTitle"), value: <>+94 11 234 5678<br />+94 77 123 4567</> },
    { icon: Mail,  title: t("contactEmailTitle"),  value: <>info@mayons.lk</> },
    { icon: MapPin,title: t("contactAddressTitle"),value: t("contactAddress") },
    { icon: Clock, title: t("contactHoursTitle"),  value: <>{t("contactHours1")}<br />{t("contactHours2")}</> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, value }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#1e3a5f]/8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="font-bold text-[#1e3a5f] text-sm mb-1.5">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
