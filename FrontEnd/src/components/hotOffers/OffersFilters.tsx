import { useLanguage } from "../../context/LanguageContext";

interface Props { selected: string; setSelected: (v: string) => void; }

export default function OfferFilters({ selected, setSelected }: Props) {
  const { t } = useLanguage();
  const types = [
    { key: "ALL", label: t("category_all") },
    { key: "DISCOUNT", label: t("category_discount") },
    { key: "LIMITED_TIME", label: t("category_limited_Time") },
    { key: "SEASONAL", label: t("category_seasonal") },
    { key: "CLEARANCE", label: t("category_clearance") },
    { key: "BOGO", label: t("category_bogo") },
  ];
  return (
    <div className="flex justify-center gap-2 flex-wrap mb-10">
      {types.map((item) => (
        <button key={item.key} onClick={() => setSelected(item.key)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
            selected.toUpperCase() === item.key
              ? "bg-[#1e3a5f] text-[#d4af37] shadow-md"
              : "bg-white text-[#1e3a5f]/70 border border-slate-200 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f]"
          }`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
