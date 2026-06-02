import { ShoppingCart, Heart, Star, Check } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";
import { useState } from "react";
import { Product } from "./types";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { imageUrl } from "../../utils/imageUrl";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toggleFavorite, favorites } = useFavorites();
  const { language, t } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const [added, setAdded] = useState(false);

  const isFavorite = favorites.some(
    (item) => item.type === "product" && item.data._id === product._id
  );
  const inStock = product.stock >= 1;
  const hasDiscount = !!product.discount && product.discount > 0;

  const productName =
    language === "si" ? product.nameSi || product.nameEn : product.nameEn || product.nameSi;
  const displayPrice = hasDiscount ? product.newPrice : product.price;
  const oldPrice = hasDiscount ? product.oldPrice : null;
  const rating = Math.round(product.rating ?? 0);

  const handleAdd = () => {
    addToCart({
      id: product._id,
      pluNumber: product.pluNumber,
      nameKey: productName,
      image: imageUrl(product.image),
      price: hasDiscount ? product.newPrice ?? product.price ?? 0 : product.price ?? 0,
      discount: product.discount ?? 0,
      quantity: 1,
      unit: product.unit,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      userRating: 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      className={`group card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_24px_50px_-28px_rgba(22,36,29,0.5)] hover:-translate-y-1 ${
        !inStock ? "opacity-90" : ""
      }`}
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={imageUrl(product.image)}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {!inStock && (
          <div className="absolute inset-0 bg-canvas/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
              {t("outOfStock")}
            </span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-clay text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            -{product.discount}%
          </div>
        )}

        <button
          onClick={() => toggleFavorite({ type: "product", data: product })}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "text-clay fill-clay" : "text-stone-400"
            }`}
          />
        </button>
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <h3 className="font-semibold text-ink text-[15px] leading-snug line-clamp-2 min-h-[2.6em]">
          {productName}
        </h3>

        {/* Rating + unit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating ? "text-honey fill-honey" : "text-stone-200 fill-stone-200"
                }`}
              />
            ))}
            {(product.reviews ?? 0) > 0 && (
              <span className="text-[11px] text-stone-400 ml-1">({product.reviews})</span>
            )}
          </div>
          {product.unit && (
            <span className="text-[11px] text-stone-400 font-medium">{product.unit}</span>
          )}
        </div>

        {/* Size chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium transition ${
                  selectedSize === size
                    ? "border-evergreen bg-evergreen text-white"
                    : "border-stone-200 text-stone-500 hover:border-evergreen/40"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400">{t("color")}:</span>
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={`w-4 h-4 rounded-full border-2 transition ${
                  selectedColor === color ? "border-evergreen scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-display text-xl font-bold text-evergreen">
            {t("Rs")} {displayPrice?.toFixed(2)}
          </span>
          {oldPrice != null && oldPrice > 0 && (
            <span className="text-xs text-stone-400 line-through">
              {t("Rs")} {oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          disabled={!inStock}
          onClick={handleAdd}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
            !inStock
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : added
              ? "bg-pine text-white"
              : "bg-evergreen text-white hover:bg-forest active:scale-[0.97] shadow-[0_10px_24px_-14px_rgba(20,64,46,0.9)]"
          }`}
        >
          {!inStock ? (
            t("outOfStock")
          ) : added ? (
            <>
              <Check className="w-4 h-4" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> {t("add_to_cart")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
