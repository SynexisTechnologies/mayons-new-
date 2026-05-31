export type Product = {
  _id: string; // MongoDB id

  pluNumber: string;

  nameEn: string;
  nameSi: string;

  category: string;       // ObjectId as string
  subCategory?: string;   // ObjectId as string

  descriptionEn: string;
  descriptionSi: string;

  image: string;

  unit?: string;

  oldPrice: number;
  newPrice: number;
  price?: number;
  discount?: number;
  rating?: number;
  reviews?: number;

  sizes?: string[];
  colors?: string[];

  isActive: boolean;
  stock: number;
  sold?: number;

  createdAt?: string;
  updatedAt?: string;
};
