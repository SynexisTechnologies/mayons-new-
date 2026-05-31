import { axiosInstance } from "../api/apiConfig";

import { Category } from "types/Category";




export const getAllcat = async () : Promise<Category[]> => {
  const response = await axiosInstance.get(`/category/all`)
  return response.data.categories;
}

export const getSubAllcat = async () : Promise<Category[]> => {
  const response = await axiosInstance.get(`/subcategory/all`)
  return response.data.subCategories;
}
