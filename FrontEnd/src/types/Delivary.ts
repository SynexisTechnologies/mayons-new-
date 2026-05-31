export interface Delivery {
  _id: string;
  order: string;
  type: "HOME_DELIVERY" | "PICKUP" | "DRONE";
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  address: string;
  expectedDate?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}
