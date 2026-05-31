import { axiosInstance } from "./apiConfig";

export const submitContactAPI = (data: {
  name: string;
  email: string;
  message: string;
}) => {
  return axiosInstance.post("/contact/send", data);
};
