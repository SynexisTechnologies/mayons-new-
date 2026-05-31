import { axiosInstance } from "../api/apiConfig";

export const placeOrderApi = async (data: any) => {
  try {
    // use shared axiosInstance so interceptors (refresh) run
    return await axiosInstance.post("/orders/checkout", data);
  } catch (error: any) {
    const msg = error?.response?.data?.message || error?.message || "Checkout failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
};

export const placeOrder = async (data: any) => {
  try {
    return await placeOrderApi(data);
  } catch (error: any) {
    console.error("Checkout failed", error?.message || error);
    throw error;
  }
};