export interface OrderItem {
  _id: string;
  product: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  address: string;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  delivery?: string;
  createdAt: string;
  updatedAt: string;
}
