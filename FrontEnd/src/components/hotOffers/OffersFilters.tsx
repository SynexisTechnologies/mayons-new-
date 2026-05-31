import { useLanguage } from "../../context/LanguageContext";

interface OfferFiltersProps {
  selected: string;
  setSelected: (v: string) => void;
}

export default function OfferFilters({ selected, setSelected }: OfferFiltersProps) {
  const { t } = useLanguage();

  // Map filter keys to display names
  const types: { key: string; label: string }[] = [
    { key: "ALL", label: t("category_all") },
    { key: "DISCOUNT", label: t("category_discount") },
    { key: "LIMITED_TIME", label: t("category_limited_Time") },
    { key: "SEASONAL", label: t("category_seasonal") },
    { key: "CLEARANCE", label: t("category_clearance") },
    { key: "BOGO", label: t("category_bogo") },
  ];

  return (
    <div className="flex justify-center gap-4 flex-wrap mb-10">
      {types.map((tItem) => (
        <button
          key={tItem.key}
          onClick={() => setSelected(tItem.key)}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            selected.toUpperCase() === tItem.key.toUpperCase()
              ? "bg-[#1e3a5f] text-[#d4af37]"
              : "bg-white shadow"
          }`}
        >
          {tItem.label}
        </button>
      ))}
    </div>
  );
}
