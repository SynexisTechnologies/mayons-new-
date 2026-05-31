import { useLanguage } from "../../context/LanguageContext";

type Props = { selected: string; onChange: (value: string) => void };

const CATEGORIES = [
  "categoriesAll", "categoriesFestival", "categoriesMarket",
  "categoriesWorkshop", "categoriesTour", "categoriesFair",
];

export default function EventsFilter({ selected, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {CATEGORIES.map((key) => (
        <button key={key} onClick={() => onChange(key)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
            selected === key
              ? "bg-[#1e3a5f] text-[#d4af37] shadow-md"
              : "bg-white text-[#1e3a5f]/70 border border-slate-200 hover:border-[#1e3a5f]/40 hover:text-[#1e3a5f]"
          }`}>
          {t(key)}
        </button>
      ))}
    </div>
  );
}
