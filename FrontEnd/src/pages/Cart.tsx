import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? "/fallback.png" : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
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
  const DELIVERY = 300;
  const total = subtotal + DELIVERY;

  return (
    <div className="min-h-screen bg-canvas pt-[150px] md:pt-[170px] pb-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-evergreen hover:border-evergreen transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            {t("cartTitle")}
          </h1>
          {items.length > 0 && (
            <span className="bg-evergreen text-honey-light text-xs font-bold px-2.5 py-1 rounded-full">
              {items.length}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center card">
            <div className="w-20 h-20 rounded-full bg-mist/60 flex items-center justify-center mb-6">
              <ShoppingCart className="w-9 h-9 text-sage" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink mb-2">{t("cartEmpty")}</h3>
            <p className="text-stone-400 text-sm mb-7">Start adding products to your cart.</p>
            <button onClick={() => navigate("/products")} className="btn btn-primary">
              {t("shopNow")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const itemPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 card p-4 hover:shadow-md transition"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.nameKey}
                      className="w-24 h-24 object-cover rounded-2xl flex-shrink-0 border border-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-ink line-clamp-1">{item.nameKey}</h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.size && `${item.size}`}
                        {item.color && ` · ${item.color}`}
                        {item.unit && !item.size && item.unit}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 border border-stone-200 rounded-full bg-stone-50 px-1.5 py-1">
                          <button
                            onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-evergreen transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-ink">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-evergreen transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-lg text-evergreen">
                            {t("Rs")}
                            {(itemPrice * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full text-stone-300 hover:text-clay hover:bg-clay-soft flex items-center justify-center transition"
                          >
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
            <div className="card p-6 h-fit sticky top-[150px]">
              <h3 className="font-display text-xl font-semibold text-ink mb-5">{t("Order_Summary")}</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>{t("subtotal")}</span>
                  <span>
                    {t("Rs")}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t("Delivery_Fee")}</span>
                  <span>
                    {t("Rs")}
                    {DELIVERY.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3.5 font-bold text-ink text-base">
                  <span>{t("total")}</span>
                  <span className="font-display text-xl text-evergreen">
                    {t("Rs")}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button onClick={() => navigate("/checkout")} className="btn btn-primary w-full mt-6">
                {t("proceed")} <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/products")}
                className="mt-2 w-full text-sm text-stone-500 hover:text-evergreen transition py-2"
              >
                {t("Continue_shopping")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
