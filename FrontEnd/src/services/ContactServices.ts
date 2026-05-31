import { axiosInstance } from "../api/apiConfig";

export const submitContactToAdmin = async (data: any) => {
  return axiosInstance.post("/contact/send", data);
};