type Props = {
  categories: string[];
  selected: string;
  onChange: (value: string) => void;
};

export default function EatCategoryFilter({
  categories,
  selected,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-6 py-2 rounded-lg font-semibold ${
            selected === cat
              ? "bg-[#1e3a5f] text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
