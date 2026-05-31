import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [err, setErr] = useState(false);
  return <img src={err ? "/fallback.png" : src} alt={alt} className={className} onError={() => setErr(true)} />;
};

export default function Cart() {
  const { items, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);
  const DELIVERY = 300;
  const total = subtotal + DELIVERY;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1e3a5f] transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("cartTitle")}</h1>
          {items.length > 0 && (
            <span className="bg-[#1e3a5f] text-[#d4af37] text-xs font-bold px-2.5 py-1 rounded-full">{items.length}</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-2xl shadow-sm">
            <ShoppingCart className="w-16 h-16 text-slate-200 mb-5" />
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{t("cartEmpty")}</h3>
            <p className="text-slate-400 text-sm mb-6">Start adding products to your cart.</p>
            <button onClick={() => navigate("/products")}
              className="px-7 py-2.5 bg-[#1e3a5f] text-white rounded-full text-sm font-semibold hover:bg-[#2a4a7c] transition shadow-sm">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
                return (
                  <div key={item.id} className="flex gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition">
                    <ImageWithFallback src={item.image} alt={item.nameKey}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#1e3a5f] line-clamp-1">{item.nameKey}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` · ${item.color}`}
                        {item.unit && !item.size && item.unit}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl bg-slate-50 px-2.5 py-1.5">
                          <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))} className="text-slate-500 hover:text-[#1e3a5f] transition">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-[#1e3a5f]">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-slate-500 hover:text-[#1e3a5f] transition">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#1e3a5f]">{t("Rs")}{(itemPrice * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit sticky top-32">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t("subtotal")}</span>
                  <span>{t("Rs")}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>{t("Rs")}{DELIVERY.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold text-[#1e3a5f] text-base">
                  <span>{t("total")}</span>
                  <span>{t("Rs")}{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-[#1e3a5f] text-white py-3 rounded-xl font-bold hover:bg-[#2a4a7c] transition shadow-sm text-sm">
                {t("proceed")} →
              </button>
              <button onClick={() => navigate("/products")}
                className="mt-2 w-full text-sm text-slate-500 hover:text-[#1e3a5f] transition py-2">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
