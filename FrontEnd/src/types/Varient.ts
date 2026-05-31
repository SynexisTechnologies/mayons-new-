export interface ProductVariant {
  _id: string;
  product: string;
  size: string;
  color: string;
  cost: number;
  mrpPrice: number;
  ourPrice: number;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
