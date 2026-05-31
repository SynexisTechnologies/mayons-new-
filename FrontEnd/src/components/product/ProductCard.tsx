import { ShoppingCart, Heart, Star } from "lucide-react";
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

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        !inStock ? "opacity-80" : ""
      }`}
    >
      {/* ── IMAGE ── */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Out-of-stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
              {t("outOfStock")}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 bg-[#d4af37] text-[#1e3a5f] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow">
            -{product.discount}%
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite({ type: "product", data: product })}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "text-rose-500 fill-rose-500" : "text-slate-400"
            }`}
          />
        </button>
      </div>

      {/* ── INFO ── */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        {/* Name */}
        <h3 className="font-semibold text-[#1e3a5f] text-sm leading-snug line-clamp-2">
          {productName}
        </h3>

        {/* Rating + stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? "text-[#d4af37] fill-[#d4af37]" : "text-slate-200 fill-slate-200"
                }`}
              />
            ))}
            {(product.reviews ?? 0) > 0 && (
              <span className="text-[11px] text-slate-400 ml-1">({product.reviews})</span>
            )}
          </div>
          {product.unit && (
            <span className="text-[11px] text-slate-400 font-medium">{product.unit}</span>
          )}
        </div>

        {/* Size chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[11px] px-2 py-0.5 rounded-full border font-medium transition
                  ${selectedSize === size
                    ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                    : "border-slate-200 text-slate-500 hover:border-[#1e3a5f]/40"
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
            <span className="text-[11px] text-slate-400">{t("color")}:</span>
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                title={color}
                className={`w-4 h-4 rounded-full border-2 transition ${
                  selectedColor === color ? "border-[#1e3a5f] scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-extrabold text-[#1e3a5f]">
            {t("Rs")} {displayPrice?.toFixed(2)}
          </span>
          {oldPrice != null && oldPrice > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {t("Rs")} {oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          disabled={!inStock}
          onClick={() =>
            addToCart({
              id: product._id,
              pluNumber: product.pluNumber,
              nameKey: productName,
              image: product.image,
              price: hasDiscount
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
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${inStock
              ? "bg-[#1e3a5f] text-white hover:bg-[#2a4a7c] active:scale-95 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? t("add_to_cart") : t("outOfStock")}
        </button>
      </div>
    </div>
  );
}
