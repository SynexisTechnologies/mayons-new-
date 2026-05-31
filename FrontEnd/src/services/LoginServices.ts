import { axiosInstance } from "../api/apiConfig";

export const loginUser = async (email: string, password: string) => {
  const res = await axiosInstance.post("/auth/login", { email, password });

  const { accessToken } = res.data;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  return res.data;
};
