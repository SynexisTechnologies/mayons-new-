import { axiosInstance } from "./apiConfig";

export const placeOrderApi = async (orderData: any) => {
  const response = await axiosInstance.post(`/orders/checkout`, orderData);
  return response.data;
};
