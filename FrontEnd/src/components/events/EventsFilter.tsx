import { useLanguage } from "../../context/LanguageContext";

type Props = {
  selected: string;
  onChange: (value: string) => void;
};

export default function EventsFilter({ selected, onChange }: Props) {
  const { t } = useLanguage();

  const categories = [
    "categoriesAll",
    "categoriesFestival",
    "categoriesMarket",
    "categoriesWorkshop",
    "categoriesTour",
    "categoriesFair",
  ];

  return (
    <div className="bg-white sm:p-6 mb-10">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((key) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition
              ${
                selected === key
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-[#d4af37]/20"
              }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
}
