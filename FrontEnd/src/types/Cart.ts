export interface CartItem {
  _id: string;
  product: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  status: "ACTIVE" | "CHECKED_OUT";
  createdAt: string;
  updatedAt: string;
}
