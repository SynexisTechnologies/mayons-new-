import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { axiosInstance as api } from "../api/apiConfig";

export type CartItem = {
  id: number | string;
  pluNumber: string;
  nameKey: string;
  nameEn?: string;
  nameSi?: string;
  image: string;
  price: number;
  quantity: number;
  unit?: string;
  discount?: number;
  size?: string;
  color?: string;
  userRating: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  totalPrice: number;
  addToCart: (item: CartItem) => Promise<void> | void;
  removeFromCart: (id: number | string) => void;
  updateQty: (id: number | string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const axiosInstance = api;

    
    useEffect(() => {
  const stored = localStorage.getItem("cart");
  if (stored) setItems(JSON.parse(stored));

  if (user?.email) {
    (async () => {
      try {
        const res = await axiosInstance.get(`/cart/${encodeURIComponent(user.email)}`);

        const mapped = res.data?.data?.items?.map((ci: any) => {
          const prod = ci.product && typeof ci.product === "object" ? ci.product : null;
          const nameEn = prod?.nameEn || prod?.name || prod?.title;
          const nameSi = prod?.nameSi || undefined;
          const fallbackName = ci.nameKey || (prod ? JSON.stringify(prod) : String(ci.product || ci._id || ""));

          return {
            id: ci._id || ci.product || String(ci.product || ci._id),
            pluNumber: ci.pluNumber || "",
            nameKey: nameEn || nameSi || fallbackName,
            nameEn: prod?.nameEn,
            nameSi: prod?.nameSi,
            image: (prod && prod.image) || ci.image || "",
            price: ci.price,
            quantity: ci.quantity,
            unit: ci.unit || (prod && prod.unit) || undefined,
            discount: ci.discount,
            size: ci.size,
            color: ci.color,
            userRating: ci.userRating || 0,
          } as CartItem;
        });

        if (mapped?.length) {
          setItems(mapped);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error("Failed to fetch cart:", e);
      }
    })();
  }
}, [user]);

     

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Add item
  const addToCart = async (product: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === product.id &&
          i.size === product.size &&
          i.color === product.color &&
          i.unit === product.unit
      );

      if (existing) {
        return prev.map((i) =>
          i.id === product.id &&
          i.size === product.size &&
          i.color === product.color &&
          i.unit === product.unit
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }

      return [
        ...prev,
        { ...product, quantity: product.quantity || 1, userRating: product.userRating || 0 },
      ];
    });

    if (user?.email) {
      try {
        const body = {
          userEmail: user.email,
          userName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          product: product.id,
          quantity: product.quantity || 1,
          price: product.price,
        };
        await axiosInstance.post(`/cart/add`, body);
      } catch (e) {
        console.error("Failed to add to server cart:", e);
      }
    }
  };

  const updateQty = (id: number | string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);

    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));

    if (user?.email) {
      (async () => {
        try {
          await axiosInstance.put(`/cart/update/${encodeURIComponent(user.email)}/${id}`, { quantity: qty });
        } catch (e) {
          console.error("Failed to sync cart update:", e);
        }
      })();
    }
  };

  const removeFromCart = (id: number | string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (user?.email) {
      (async () => {
        try {
          await axiosInstance.delete(`/cart/remove/${encodeURIComponent(user.email)}/${id}`);
        } catch (e) {
          console.error("Failed to remove from cart:", e);
        }
      })();
    }
  };

  const clearCart = () => setItems([]);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <CartContext.Provider
      value={{ items, cartCount, totalPrice, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};