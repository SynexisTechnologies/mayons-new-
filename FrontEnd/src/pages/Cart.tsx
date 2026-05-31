import { X, Minus, Plus, Trash2 } from "lucide-react"; 
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// Fallback image component
const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? "/fallback.png" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default function Cart() {
  const { items, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white pt-36 px-4 md:px-8 lg:px-16 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("cartTitle")}</h2>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t("cartEmpty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.discount
                ? item.price * (1 - item.discount / 100)
                : item.price;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white shadow-md p-4 rounded-lg items-center"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.nameKey}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold">{item.nameKey}</h4>
<p className="text-gray-500 text-sm">
  {item.size && <span>Size: {item.size}</span>}{" "}
  {item.color && <span> | Color: {item.color}</span>}{" "}
  {item.unit && !item.size && <span>{t("unit")}: {item.unit}</span>}
</p>

<div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
  {Array.from({ length: 5 }).map((_, idx) => (
    <span key={idx}>{idx < item.userRating ? "★" : "☆"}</span>
  ))}
</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-gray-600 hover:text-gray-900 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:text-gray-900 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-yellow-700">
                          {t("Rs")}{(itemPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title={t("remove")}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">{t("cartTitle")}</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span>{t("Rs")}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("tax")}</span>
                <span>{t("Rs")}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
                <span>{t("total")}</span>
                <span>{t("Rs")}{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
              className={`mt-6 w-full py-3 rounded-full font-semibold transition
                ${items.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "w-full  bg-[#1e3a5f] text-white py-3 rounded-full hover:opacity-90 transition"}`}
            >
              {t("proceed")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
