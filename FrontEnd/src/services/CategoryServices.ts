import { axiosInstance } from "../api/apiConfig";
import { Category } from "../types/Category";

export interface SubCategory {
  _id: string;
  name: string;
  titleKey: string;
  category: string;
}

export const getAllcat = async (): Promise<Category[]> => {
  const response = await axiosInstance.get(`/category/all`);
  return response.data.categories;
};

export const getSubAllcat = async (): Promise<SubCategory[]> => {
  const response = await axiosInstance.get(`/subcategory/all`);
  return response.data.subCategories;
};

export const getSubcatByCategory = async (categoryId: string): Promise<SubCategory[]> => {
  const response = await axiosInstance.get(`/subcategory/category/${categoryId}`);
  return response.data.subCategories ?? response.data;
};
