import { axiosInstance } from "../api/apiConfig";
import { Category } from "../types/Category";

export interface SubCategory {
  _id: string;
  name: string;
  titleKey: string;
  category: string;
}

export interface SubCategory1 {
  _id: string;
  name: string;
  titleKey: string;
  subCategory: string;
}

export const getAllcat = async (): Promise<Category[]> => {
  const response = await axiosInstance.get(`/category/all`);
  return response.data.categories;
};

export const createCategory = async (data: { titleKey: string; name: string }): Promise<Category> => {
  const response = await axiosInstance.post(`/category/create`, data);
  return response.data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/category/delete/${id}`);
};

export const applyCategoryDiscount = async (id: string, discount: number): Promise<Category> => {
  const response = await axiosInstance.put(`/category/${id}/apply-discount`, { discount });
  return response.data.category;
};

export const getSubAllcat = async (): Promise<SubCategory[]> => {
  const response = await axiosInstance.get(`/subcategory/all`);
  return response.data.subCategories;
};

export const getSubcatByCategory = async (categoryId: string): Promise<SubCategory[]> => {
  const response = await axiosInstance.get(`/subcategory/category/${categoryId}`);
  return response.data.subCategories ?? response.data;
};

export const createSubCategory = async (data: { titleKey: string; name: string; category: string }): Promise<SubCategory> => {
  const response = await axiosInstance.post(`/subcategory/create`, data);
  return response.data.subCategory;
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/subcategory/delete/${id}`);
};

export const getSubCategory1BySubCategory = async (subCategoryId: string): Promise<SubCategory1[]> => {
  const response = await axiosInstance.get(`/subCategory1/subCategory/${subCategoryId}`);
  return response.data.subCategory1s ?? response.data;
};

export const createSubCategory1 = async (data: { titleKey: string; name: string; subCategory: string }): Promise<SubCategory1> => {
  const response = await axiosInstance.post(`/subCategory1/create`, data);
  return response.data.subCategory1;
};

export const deleteSubCategory1 = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/subCategory1/delete/${id}`);
};
