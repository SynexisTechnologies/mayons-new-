import { axiosInstance } from "../api/apiConfig";

export const loginUser = async (email: string, password: string) => {
  const res = await axiosInstance.post("/auth/login", { email, password });

  const token = res.data?.AccessToken || res.data?.accessToken;
  if (token) {
    localStorage.setItem("AccessToken", token);
  }

  return res.data;
};
