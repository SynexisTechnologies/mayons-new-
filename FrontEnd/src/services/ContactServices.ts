import { axiosInstance } from "./apiConfig";

export const submitContactToAdmin = async (data: any) => {
  return axiosInstance.post("/contact/send", data);
};