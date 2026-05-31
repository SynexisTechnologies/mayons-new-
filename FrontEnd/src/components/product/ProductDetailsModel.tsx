import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "./types";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductDetailsModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useCart();
  const { t, getProductName, getProductDescription } = useLanguage();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>(product.sizes?.[0] || "");
  const [sizeError, setSizeError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");

  const handleAddToCart = () => {
    if (product.sizes && !size) {
      setSizeError(t("select_size_error"));
      return;
    }
    addToCart({
      id: product._id || product.pluNumber, // <-- FIXED TYPE ISSUE
      pluNumber: product.pluNumber ?? "",
      nameKey: getProductName(product),
      image: product.image,
      price: product.newPrice ?? 0,
      quantity: qty,
      unit: product.unit,
      size: size || undefined,
      color: selectedColor || undefined,
      userRating: 0,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative shadow-[0_6px_20px_#1e3a5f4d]">
          <button onClick={onClose} className="absolute right-4 top-4 text-[#1e3a5f]"><X /></button>
          <div className="grid md:grid-cols-2 gap-8">
            <img src={product.image} className="w-full h-[420px] object-cover rounded-lg" />
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">{getProductName(product)}</h2>
              <p className="text-gray-500 mt-1">⭐ {product.rating ?? 0} ({product.reviews ?? 0} reviews)</p>
              <p className="text-3xl text-[#d4af37] font-bold mt-4">
                {t("Rs")} {product.newPrice}
                {product.oldPrice && <span className="line-through text-gray-400 text-lg ml-3">{t("Rs")} {product.oldPrice}</span>}
              </p>
              <p className="mt-4 text-gray-600">{getProductDescription(product)}</p>

              {product.sizes && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-[#1e3a5f]">{t("select_size")}</h4>
                  <div className="flex gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => { setSize(s); setSizeError(""); }}
                        className={`px-4 py-2 border rounded-lg font-medium transition ${size === s ? "bg-[#d4af37] text-[#1e3a5f] border-[#d4af37]" : "border-gray-300 hover:border-[#d4af37]"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="text-red-600 text-sm mt-2">{sizeError}</p>}
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="border rounded p-2"><Minus /></button>
                <span className="font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="border rounded p-2"><Plus /></button>
              </div>

              <div className="mt-8">
                <button onClick={handleAddToCart} className="mt-2 w-full bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a7c] transition flex justify-center items-center gap-2 font-semibold shadow">
                  <ShoppingCart className="w-4 h-4" /> {t("add_to_cart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
