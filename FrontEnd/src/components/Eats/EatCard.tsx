import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { ShoppingCart, Zap } from "lucide-react";

type Props = { item: any };

export default function EatCard({ item }: Props) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <div className="group card hover-lift flex gap-4 p-4 overflow-hidden">
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={t(item.nameKey)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-ink text-sm leading-snug line-clamp-1">
            {t(item.nameKey)}
          </h4>
          {item.description && (
            <p className="text-xs text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
              {t(item.description)}
            </p>
          )}
          {item.calories && (
            <div className="flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-honey" />
              <span className="text-[11px] text-stone-400">{item.calories}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-evergreen">
            {t("Rs")} {item.price}
          </span>
          <button
            onClick={() =>
              addToCart({
                id: item.id,
                pluNumber: item.pluNumber ?? "",
                nameKey: item.nameKey,
                image: item.image,
                price: item.price,
                quantity: 1,
                unit: item.calories,
                userRating: 0,
              })
            }
            className="flex items-center gap-1.5 bg-evergreen text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-forest transition shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> {t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
