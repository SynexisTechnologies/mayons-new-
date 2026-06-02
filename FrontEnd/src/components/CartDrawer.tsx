import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

type Props = { isOpen: boolean; onClose: () => void };

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-canvas z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-evergreen text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-honey-light" />
            <h2 className="font-display font-semibold text-lg">{t("cartTitle")}</h2>
            {items.length > 0 && (
              <span className="bg-honey text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full bg-mist/60 flex items-center justify-center mb-5">
                <ShoppingBag className="w-9 h-9 text-sage" />
              </div>
              <p className="text-ink font-semibold">{t("cartEmpty")}</p>
              <p className="text-stone-400 text-sm mt-1">Add some products to get started</p>
              <button
                onClick={() => {
                  navigate("/products");
                  onClose();
                }}
                className="btn btn-ghost mt-6 text-sm"
              >
                {t("explore_products")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.discount
                ? item.price * (1 - item.discount / 100)
                : item.price;
              const name = (item as any).nameEn || (item as any).nameSi || item.nameKey;
              return (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white border border-stone-100 rounded-2xl p-3 hover:shadow-sm transition"
                >
                  <img
                    src={item.image}
                    alt={name}
                    className="w-[68px] h-[68px] object-cover rounded-xl flex-shrink-0 border border-stone-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/fallback.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink line-clamp-1">{name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {item.size && `${item.size}`}
                      {item.color && ` · ${item.color}`}
                      {item.unit && !item.size && item.unit}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 border border-stone-200 rounded-full bg-stone-50 px-1.5 py-1">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-evergreen transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-evergreen transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-evergreen">
                        {t("Rs")}
                        {(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start w-7 h-7 rounded-full hover:bg-clay-soft text-stone-300 hover:text-clay flex items-center justify-center transition"
                    aria-label={t("remove")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">{t("subtotal")}</span>
              <span className="font-display font-bold text-xl text-evergreen">
                {t("Rs")}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-stone-400">Delivery charges calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  navigate("/cart");
                  onClose();
                }}
                className="btn btn-ghost text-sm py-3"
              >
                {t("cartTitle")}
              </button>
              <button
                onClick={() => {
                  navigate("/checkout");
                  onClose();
                }}
                className="btn btn-primary text-sm py-3"
              >
                {t("Checkout")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
