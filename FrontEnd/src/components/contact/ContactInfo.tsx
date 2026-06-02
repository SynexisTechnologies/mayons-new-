import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ContactInfo() {
  const { t } = useLanguage();

  const items = [
    { icon: Phone, title: t("contactPhoneTitle"), value: <>+94 11 234 5678<br />+94 77 123 4567</> },
    { icon: Mail, title: t("contactEmailTitle"), value: <>info@mayons.lk</> },
    { icon: MapPin, title: t("contactAddressTitle"), value: t("contactAddress") },
    { icon: Clock, title: t("contactHoursTitle"), value: <>{t("contactHours1")}<br />{t("contactHours2")}</> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, value }) => (
          <div key={title} className="card p-6 text-center hover-lift">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-mist flex items-center justify-center">
              <Icon className="w-5 h-5 text-evergreen" />
            </div>
            <h3 className="font-semibold text-ink text-sm mb-1.5">{title}</h3>
            <p className="text-stone-500 text-xs leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
