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
  verifyResetOtp,   // ✅ ADD THIS
  getResetUser,  
  resetPassword 
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
userRouter.post("/refresh-token",refreshToken);
userRouter.post("/logout",logout);

export default userRouter