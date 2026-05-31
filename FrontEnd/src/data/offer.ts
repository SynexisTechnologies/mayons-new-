import { Product } from "../components/product/types";

export type OfferType =
  | "DISCOUNT"
  | "LIMITED_TIME"
  | "SEASONAL"
  | "CLEARANCE"
  | "BOGO";

export type Offer = {
  _id: string;
  type: OfferType;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive : boolean;
  product: Product;
};
