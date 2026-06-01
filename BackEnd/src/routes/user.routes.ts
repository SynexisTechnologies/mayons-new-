import { Router } from "express";
import {
  getAllUsers,
  login,
  logout,
  refreshToken,
  resendOtp,
  signup,
  verifyOtp,
  sendResetOtp,
  verifyResetOtp,
  getResetUser,
  resetPassword,
  updateUser,
  deleteUser,
  adminResetPassword,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/authenticateToken";
import { isAdmin } from "../middlewares/isAdmin";


const userRouter = Router() 
userRouter.post("/signup",signup) 
userRouter.post("/verify-otp",verifyOtp) 
userRouter.post("/resend-otp",resendOtp) 
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/verify-reset-otp", verifyResetOtp); // ✅ ADD THIS
userRouter.post("/get-reset-user", getResetUser);
userRouter.post("/reset-password", resetPassword); 
userRouter.post("/login",login);
userRouter.get("/get",authenticateToken,isAdmin,getAllUsers);
userRouter.get("/users",authenticateToken,isAdmin,getAllUsers);
userRouter.patch("/users/:id",authenticateToken,isAdmin,updateUser);
userRouter.delete("/users/:id",authenticateToken,isAdmin,deleteUser);
userRouter.post("/users/:id/reset-password",authenticateToken,isAdmin,adminResetPassword);
userRouter.post("/refresh-token",refreshToken);
userRouter.post("/logout",logout);

export default userRouter