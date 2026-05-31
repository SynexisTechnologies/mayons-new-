import { fetchRestaurants } from "../api/EatsApi";

export const fetchEats = async (): Promise<any[]> => {
  const res = await fetchRestaurants();
  return res?.data || res || [];
};
