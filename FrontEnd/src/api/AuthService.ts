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

const API = "http://localhost:5000/api/auth";

export const getResetUser = async (email: string) => {
  const res = await fetch(`${API}/get-reset-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await fetch(`${API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  return res.json();
};

export const requestPasswordResetOTP = async (email: string) => {
  const res = await fetch(`${API}/send-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyPasswordResetOTP = async (email: string, otp: string) => {
  const res = await fetch(`${API}/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

