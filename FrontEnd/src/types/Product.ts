export interface Product {
  _id: string;
  pluNumber: string;
  nameEn: string;
  nameSi: string;
  category: string;
  subCategory?: string;
  description: string;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
