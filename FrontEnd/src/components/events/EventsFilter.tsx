import { useLanguage } from "../../context/LanguageContext";

type Props = { selected: string; onChange: (value: string) => void };

const CATEGORIES = [
  "categoriesAll",
  "categoriesFestival",
  "categoriesMarket",
  "categoriesWorkshop",
  "categoriesTour",
  "categoriesFair",
];

export default function EventsFilter({ selected, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {CATEGORIES.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
            selected === key
              ? "bg-evergreen text-white shadow-sm"
              : "bg-white text-stone-500 border border-stone-200 hover:border-evergreen/40 hover:text-evergreen"
          }`}
        >
          {t(key)}
        </button>
      ))}
    </div>
  );
}
