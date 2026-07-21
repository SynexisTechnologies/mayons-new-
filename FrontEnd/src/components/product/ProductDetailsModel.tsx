import { X, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Product } from "./types";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { imageUrl } from "../../utils/imageUrl";

export default function ProductDetailsModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useCart();
  const { t, getProductName, getProductDescription } = useLanguage();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>(product.sizes?.[0] || "");
  const [color, setColor] = useState<string>(product.colors?.[0] || "");
  const [sizeError, setSizeError] = useState("");

  const hasDiscount = !!product.discount && product.discount > 0;
  const displayPrice = hasDiscount ? product.newPrice : product.price;
  const rating = Math.round(product.rating ?? 0);

  // An admin can flag a product Sold Out regardless of the stock count
  const soldOut = !!product.isSoldOut;
  const inStock = !soldOut && product.stock >= 1;
  const unavailableLabel = soldOut ? t("soldOut") : t("outOfStock");

  const handleAdd = () => {
    if (!inStock) return;
    if (product.sizes?.length && !size) { setSizeError(t("select_size_error")); return; }
    addToCart({
      id: product._id || product.pluNumber,
      pluNumber: product.pluNumber ?? "",
      nameKey: getProductName(product),
      image: imageUrl(product.image),
      price: product.newPrice ?? product.price ?? 0,
      quantity: qty,
      unit: product.unit,
      size: size || undefined,
      color: color || undefined,
      userRating: 0,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-[#1e3a5f] text-white flex-shrink-0">
            <p className="font-extrabold text-sm">Product Details</p>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-2 gap-0 overflow-y-auto">
            {/* Image */}
            <div className="relative aspect-square bg-slate-50">
              <img src={imageUrl(product.image)} alt={getProductName(product)} className="w-full h-full object-cover" />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#d4af37] text-[#1e3a5f] text-xs font-extrabold px-2.5 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-7 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#1e3a5f] mb-1">{getProductName(product)}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-[#d4af37] fill-[#d4af37]" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">({product.reviews ?? 0} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#1e3a5f]">{t("Rs")} {displayPrice?.toFixed(2)}</span>
                {hasDiscount && product.oldPrice && (
                  <span className="text-sm text-slate-400 line-through">{t("Rs")} {product.oldPrice.toFixed(2)}</span>
                )}
              </div>

              {product.descriptionEn && (
                <p className="text-slate-500 text-sm leading-relaxed">{getProductDescription(product)}</p>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">{t("size")}</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => { setSize(s); setSizeError(""); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${size === s ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "border-slate-200 text-slate-600 hover:border-[#1e3a5f]/40"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="text-red-500 text-xs mt-1">{sizeError}</p>}
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">{t("color")}</label>
                  <div className="flex gap-2">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setColor(c)} title={c}
                        className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${color === c ? "border-[#1e3a5f] scale-125" : "border-transparent"}`}
                        style={{ backgroundColor: c.toLowerCase() }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Qty */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Quantity</label>
                <div className="flex items-center gap-3 border border-slate-200 rounded-xl w-fit px-3 py-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-slate-500 hover:text-[#1e3a5f] transition cursor-pointer"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-[#1e3a5f] w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="text-slate-500 hover:text-[#1e3a5f] transition cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <button onClick={handleAdd} disabled={!inStock}
                className={`mt-auto w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-sm ${
                  inStock
                    ? "bg-[#1e3a5f] text-white hover:bg-[#2a4a7c] cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}>
                {inStock ? (
                  <><ShoppingCart className="w-4 h-4" /> {t("add_to_cart")}</>
                ) : (
                  unavailableLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
