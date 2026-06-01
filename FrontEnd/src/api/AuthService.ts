// src/api/AuthService.ts
import { axiosInstance } from "./apiConfig";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  AccessToken: string;
  role: "admin" | "user";
  email: string;
  firstName: string;   // ✅ ADD
  lastName: string;    // ✅ ADD
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return res.data;
};

export const register = async (data: any) => {
  return axiosInstance.post("/auth/signup", data);
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  return axiosInstance.post("/auth/verify-otp", data);
};

export const resendOtp = async (data: { email: string }) => {
  return axiosInstance.post("/auth/resend-otp", data);
};

export const getResetUser = async (email: string) => {
  const res = await axiosInstance.post("/auth/get-reset-user", { email });
  return res.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await axiosInstance.post("/auth/reset-password", { email, newPassword });
  return res.data;
};

export const requestPasswordResetOTP = async (email: string) => {
  const res = await axiosInstance.post("/auth/send-reset-otp", { email });
  return res.data;
};

export const verifyPasswordResetOTP = async (email: string, otp: string) => {
  const res = await axiosInstance.post("/auth/verify-reset-otp", { email, otp });
  return res.data;
};

