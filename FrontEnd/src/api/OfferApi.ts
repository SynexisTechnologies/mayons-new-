// frontend/OfferApi.ts
import { Product } from "../components/product/types";
import { Offer } from "../data/offer";
import { productService } from "../services/ProductServices";
import { axiosInstance } from "./apiConfig";

// Fetch all offers
export const getAllOffers = async (): Promise<Offer[]> => {
  // 1. Fetch admin-defined offers
  const { data: adminOffers } = await axiosInstance.get<Offer[]>("/offers");

  // 2. Fetch all products
  const products: Product[] = await productService.getAll();

  // 3. Generate auto-offers for discounted products
  const autoDiscountOffers: Offer[] = products
    .filter((p) => p.discount && p.discount > 0)
    .map((p) => {
      const offer: Offer = {
        _id: `${p._id}-discount`,
        product: p,
        type: "DISCOUNT", // make sure Offer.type allows this value
        startDate: p.createdAt || new Date().toISOString(), // fallback if undefined
        endDate: undefined,
        isActive: true,
      };
      return offer;
    });

  // 4. Combine admin and auto-generated discount offers
  return [...adminOffers, ...autoDiscountOffers];
};

// Fetch best offers (optional: top 4 discounts)
export const getBestOffers = async (): Promise<Offer[]> => {
  const offers = await getAllOffers();
  const discountOffers = offers.filter((o) => o.type === "DISCOUNT");
  return discountOffers.slice(0, 4);
};
