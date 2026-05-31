import EatCard from "./EatCard";
import { X, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

type MenuItem = { _id: string; nameKey: string; description: string; price: number; calories: string; image: string; tags?: string[] };
type CategoryGroup = { category: string; items: MenuItem[] };
type Props = { restaurantName: string; categories: CategoryGroup[]; onClose: () => void };

const CATEGORY_LABELS: Record<string, string> = {
  appetizers: "Appetizers",
  main: "Main Course",
  beverages: "Beverages",
  breakfast: "Breakfast",
  desserts: "Desserts",
};

export default function MenuModal({ restaurantName, categories, onClose }: Props) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-[#1e3a5f] text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#d4af37] rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#1e3a5f]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/80">Menu</p>
              <h2 className="font-extrabold text-base leading-tight">{t(restaurantName)}</h2>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-base font-extrabold text-[#1e3a5f]">
                    {CATEGORY_LABELS[cat.category.toLowerCase()] || cat.category}
                  </h3>
                  <span className="text-xs font-semibold text-[#d4af37] bg-[#1e3a5f]/8 px-2.5 py-1 rounded-full border border-[#d4af37]/20">
                    {cat.items.length}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {cat.items.map((item) => <EatCard key={item._id} item={item} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Menu not available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
