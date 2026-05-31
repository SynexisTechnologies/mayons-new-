import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext"; 

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const subtotal = items.reduce((sum, item) => {
  const basePrice = Number(item.price) || 0;

const price = item.discount
  ? basePrice * (1 - item.discount / 100)
  : basePrice;

    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Your Bag ({items.length})
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-220px)]">
          {items.length === 0 && (
            <p className="text-center text-gray-500">
              Your cart is empty
            </p>
          )}

          {items.map((item) => {
            const price = item.discount
              ? item.price * (1 - item.discount / 100)
              : item.price;

            return (
              <div key={item.id} className="flex gap-3 border-b pb-4">
                <img
                  src={item.image}
                  alt={(item as any).nameEn || (item as any).nameSi || item.nameKey}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{(item as any).nameEn || (item as any).nameSi || item.nameKey}</h4>
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


                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 border rounded px-2 py-1">
                      <button
                        onClick={() =>
                          updateQty(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-semibold text-yellow-700">
                      {t("Rs")}{(price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 mt-2 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-3">
          <div className="flex justify-between font-semibold">
            <span>Sub Total</span>
            <span>{t("Rs")}{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              navigate("/cart");
              onClose();
            }}
            className="w-full border border-[#2a4a7c] text-[#1e3a5f] py-2 rounded"
          >
            GO TO CART
          </button>

          <button
            onClick={() => {
              navigate("/checkout");
              onClose();
            }}
            className="w-full bg-[#2a4a7c] text-white py-2 rounded"
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
}
