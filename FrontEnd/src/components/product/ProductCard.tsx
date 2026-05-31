import { ShoppingCart, Star, Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";
import { useState } from "react";
import { Product } from "./types";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toggleFavorite, favorites } = useFavorites();
  const { language, t } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const [userRating, setUserRating] = useState<number | null>(null);

  // Favorite check
  const favorite = favorites.some(item => item.type === "product" && item.data._id === product._id);

  // Multilingual product name & description
  const productName = language === "si" ? product.nameSi : product.nameEn;
  const description = language === "si" ? product.descriptionSi || product.descriptionEn : product.descriptionEn;
 
  return (
    <div className="bg-white rounded-2xl border shadow hover:shadow-xl transition overflow-hidden flex flex-col">
      <div className="aspect-square overflow-hidden relative">
        <img src={product.image} alt={productName} className="w-full h-full object-cover hover:scale-105 transition" />
        {/* Favorite Heart Button */}
<button
  onClick={() => toggleFavorite({ type: "product", data: product })}
  className="absolute top-4 right-4 p-2 rounded-full shadow-lg hover:scale-110 transition
             bg-white/80 backdrop-blur-sm"
>
  <Heart
    className={`w-5 h-5 transition ${
      favorite ? "text-red-500 fill-red-500" : "text-gray-700"
    }`}
  />
</button>

      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#1e3a5f] line-clamp-1">{productName}</h3>

        {description && (
          <p className="text-sm text-[#2a4a7c] mb-2 line-clamp-2">{description}</p>
        )}
          
      {/* Stock and Unit in one line */}
<div className="flex items-center gap-2 mb-2">
  {product.unit && (
    <span className="text-xs text-gray-500 font-medium">{product.unit}</span>
  )}
  {product.stock >= 1 ? (
    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
      {t("inStock")}
    </span>
  ) : (
    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
      {t("outOfStock")}
    </span>
  )}
</div>        
        {product.discount && <p className="text-xs text-red-500 mb-2">{t("discount")}: {product.discount}%</p>}

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${idx < (userRating ?? Math.round(product.rating ?? 0)) ? "text-[#d4af37]" : "text-gray-300"}`}
              onClick={() => setUserRating(idx + 1)}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews ?? 0})</span>
        </div>

       {product.sizes && product.sizes.length > 0 && (
  <div className="mb-2">
    <label className="text-sm text-[#2a4a7c] mr-2">{t("size")}:</label>
    <select
      value={selectedSize}
      onChange={e => setSelectedSize(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {product.sizes.map(size => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
)}

{product.colors && product.colors.length > 0 && (
  <div className="mb-2">
    <label className="text-sm text-[#2a4a7c] mr-2">{t("color")}:</label>
    <select
      value={selectedColor}
      onChange={e => setSelectedColor(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {product.colors.map(color => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
  </div>
)}

       <div className="flex items-center gap-2 mb-4">
  {product.discount ? (
    <>
      <span className="text-lg font-bold text-[#1e3a5f]">{t("Rs")} {product.newPrice?.toFixed(2)}</span>
      {product.oldPrice && (
        <span className="text-sm line-through text-gray-400">{t("Rs")} {product.oldPrice.toFixed(2)}</span>
      )}
    </>
  ) : (
    <span className="text-lg font-bold text-[#1e3a5f]">{t("Rs")} {product.price?.toFixed(2)}</span>
  )}
</div>

<button
  disabled={product.stock < 1}
  onClick={() =>
    addToCart({
      id: product._id,
      pluNumber: product.pluNumber,
      nameKey: productName,
      image: product.image,
      price: product.discount
        ? product.newPrice ?? product.price ?? 0
        : product.price ?? 0,
      discount: product.discount ?? 0,
      quantity: 1,
      unit: product.unit,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      userRating: 0,
    })
  }

  className={`mt-2 w-full px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-semibold transition
  ${
    product.stock >= 1
      ? "bg-[#1e3a5f] text-white hover:bg-[#2a4a7c]"
      : "bg-gray-400 text-white cursor-not-allowed"
  }`}
>
  <ShoppingCart className="w-4 h-4" />
  {product.stock >= 1 ? t("add_to_cart") : t("outOfStock")}
</button>

      </div>
    </div>
  );
}
