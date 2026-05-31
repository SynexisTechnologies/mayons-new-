import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col transform transition-transform duration-300 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#1e3a5f]">
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-bold">Your Bag</h2>
            {items.length > 0 && (
              <span className="bg-[#d4af37] text-[#1e3a5f] text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">Your bag is empty</p>
              <p className="text-slate-300 text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            items.map((item) => {
              const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
              const name = (item as any).nameEn || (item as any).nameSi || item.nameKey;
              return (
                <div key={item.id} className="flex gap-3 bg-slate-50 rounded-xl p-3">
                  <img src={item.image} alt={name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-slate-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e3a5f] line-clamp-1">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` · ${item.color}`}
                      {item.unit && !item.size && item.unit}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-white px-2 py-1">
                        <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))} className="text-slate-500 hover:text-[#1e3a5f] transition">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-[#1e3a5f]">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-slate-500 hover:text-[#1e3a5f] transition">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#1e3a5f]">{t("Rs")}{(price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      className="mt-1.5 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="font-bold text-[#1e3a5f]">{t("Rs")}{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-400">Delivery charges calculated at checkout.</p>
            <button onClick={() => { navigate("/cart"); onClose(); }}
              className="w-full border border-[#1e3a5f] text-[#1e3a5f] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a5f]/5 transition">
              View Cart
            </button>
            <button onClick={() => { navigate("/checkout"); onClose(); }}
              className="w-full bg-[#1e3a5f] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#2a4a7c] transition shadow-sm">
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
