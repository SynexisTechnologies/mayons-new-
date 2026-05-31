import { Product } from "../components/product/types";
import { ProductApi } from "../api/ProductApi";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    return ProductApi.getAll();
  },

  getById: async (id: string): Promise<Product> => {
    return ProductApi.getById(id);
  },

  create: async (payload: Partial<Product>): Promise<Product> => {
    return ProductApi.create(payload);
  },

  update: async (id: string, payload: Partial<Product>): Promise<Product> => {
    return ProductApi.update(id, payload);
  },

  delete: async (id: string): Promise<void> => {
    return ProductApi.remove(id);
  },
};
