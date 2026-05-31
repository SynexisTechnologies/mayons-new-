import EatCard from "./EatCard";
import { X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

type MenuItem = {
  _id: string; // ✅ from Mongo
  nameKey: string;
  description: string;
  price: number;
  calories: string;
  image: string;
  tags?: string[];
};

type CategoryGroup = {
  category: string;
  items: MenuItem[];
};

type Props = {
  restaurantName: string;
  categories: CategoryGroup[];
  onClose: () => void;
};


export default function MenuModal({
  restaurantName,
  categories,
  onClose,
}: Props) {
  const { t } = useLanguage();
 const categoryLabelMap: Record<string, string> = {
  appetizers: t("menu_appetizers"),
  main: t("menu_main"),
  beverages: t("menu_beverages"),
  breakfast: t("menu_breakfast"),
};
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold mb-6">
          {t(restaurantName)}
        </h2>

        {Array.isArray(categories) && categories.map((cat) => (

          <div key={cat.category} className="mb-6">
    <h3 className="text-xl font-bold mb-4">
  {categoryLabelMap[cat.category.toLowerCase()] || cat.category}
</h3>


            <div className="grid md:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <EatCard key={item._id} item={item} /> // ✅ FIXED
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
