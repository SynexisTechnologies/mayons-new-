import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ContactInfo() {
  const { t } = useLanguage();

  const items = [
    {
      icon: Phone,
      title: t("contactPhoneTitle"),
      // Two phone numbers on separate lines
      value: (
        <>
          +94 11 234 5678 <br /> +94 77 123 4567
        </>
      ),
      color: "text-[#d4af37]",
    },
    {
      icon: Mail,
      title: t("contactEmailTitle"),
      value: (
        <>
          support@organi.lk
        </>
      ),
      color: "text-[#d4af37]",
    },
    {
      icon: MapPin,
      title: t("contactAddressTitle"),
      value: t("contactAddress"),
      color: "text-[#d4af37]",
    },
    {
      icon: Clock,
      title: t("contactHoursTitle"),
      value: (
        <>
          {t("contactHours1")} <br /> {t("contactHours2")}
        </>
      ),
      color: "text-[#d4af37]",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
      <div className="grid md:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, value, color }) => (
          <div
            key={title}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
