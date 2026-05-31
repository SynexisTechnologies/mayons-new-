import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { ShoppingCart, Zap } from "lucide-react";

type Props = { item: any };

export default function EatCard({ item }: Props) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex gap-4 p-4 overflow-hidden">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img src={item.image} alt={t(item.nameKey)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-[#1e3a5f] text-sm leading-snug line-clamp-1">{t(item.nameKey)}</h4>
          {item.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{t(item.description)}</p>
          )}
          {item.calories && (
            <div className="flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-[#d4af37]" />
              <span className="text-[11px] text-slate-400">{item.calories}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-extrabold text-[#1e3a5f] text-sm">{t("Rs")} {item.price}</span>
          <button
            onClick={() => addToCart({ id: item.id, pluNumber: item.pluNumber ?? "", nameKey: item.nameKey, image: item.image, price: item.price, quantity: 1, unit: item.calories, userRating: 0 })}
            className="flex items-center gap-1.5 bg-[#1e3a5f] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2a4a7c] transition cursor-pointer shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> {t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
