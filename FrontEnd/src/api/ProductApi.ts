import { axiosInstance } from "./apiConfig";
import { Product } from "../components/product/types";

export const ProductApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await axiosInstance.get("/product/all");
    return res.data;
  },
  getById: async (id: string): Promise<Product> => {
    const res = await axiosInstance.get(`/product/${id}`);
    return res.data;
  },
  create: async (payload: Partial<Product>): Promise<Product> => {
    const res = await axiosInstance.post("/product", payload);
    return res.data;
  },
  update: async (id: string, payload: Partial<Product>): Promise<Product> => {
    const res = await axiosInstance.put(`/product/update/${id}`, payload);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/product/delete/${id}`);
  },
};
