import { axiosInstance } from "./apiConfig";

export const fetchRestaurants = async () => {
  const res = await axiosInstance.get("/eats/restaurants");
  return res.data;
};

export const fetchMenu = async (restaurantId: string) => {
  const res = await axiosInstance.get(`/eats/eat-items/${encodeURIComponent(restaurantId)}`);
  return res.data;
};
