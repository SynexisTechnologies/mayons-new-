// EatItem shape comes from API; accept dynamic shape
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

type Props = { item: any };

export default function EatCard({ item }: Props) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg p-4 shadow-[0_4px_12px_#1e3a5f4d] hover:shadow-xl transition">
      <img
        src={item.image}
        alt={item.nameKey}
        className="h-48 w-full object-cover rounded-lg mb-2"
      />
      <h4 className="text-lg font-bold text-gray-800">
  {t(item.nameKey)}
</h4>

<p className="text-sm text-gray-600 mb-2">
  {t(item.description)}
</p>

      <div className="flex justify-between items-center mt-2">
        <span className="text-[#1e3a5f] font-bold">{t("Rs")} {item.price}</span>
        <button
          onClick={() =>addToCart({
  id: item.id,
  pluNumber: item.pluNumber ?? "",
  nameKey: item.nameKey,
  image: item.image,
  price: item.price,
  quantity: 1,
  unit: item.calories,   // if you add color selection
  userRating: 0,                       // default 0
})}
          className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a7c] transition"
        >
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
}
