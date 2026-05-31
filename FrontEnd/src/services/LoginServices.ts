// loginService.ts
import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });

  const { accessToken } = res.data; // adjust if your backend returns differently

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken); // ✅ save token
  }

  return res.data;
};