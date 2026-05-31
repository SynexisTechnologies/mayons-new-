import {Request, Response, NextFunction } from "express";

import { APIError } from "../errors/ApiErrors";
import bcrypt from "bcrypt"
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError }  from "jsonwebtoken"
import { error } from "console";
import { generateOTP, hashOTP } from "../util/generateOTP";
import OtpModel from "../models/OtpModel";
import { sendOTPEmail } from "../util/emailService";
import {  userModel } from "../models/userModel";
import { randomBytes, randomInt } from "crypto";

export const create_access_token = (userId: string, role: string) => {
  return jwt.sign(
    {
      id: userId,   
      role: role,   
    },
    process.env.ACCESS_SECRETE_TOKEN!,
    { expiresIn: "15m" }
  );
};


export const create_refresh_token = (userId:string) =>{
  return jwt.sign(
    {userId},
    process.env.REFRESH_SECRETE_TOKEN!,
    {expiresIn:"3d"}
  )

}



export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (user.otpAttempts >= 5)
      return res.status(429).json({ message: "Too many attempts" });

    if (hashOTP(otp) !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;

    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
};


export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user || user.isVerified)
      return res.status(400).json({ message: "Invalid request" });

    const otp = generateOTP();

    user.otpHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.otpAttempts = 0;

    await user.save();
    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (e) {
      console.error("Failed to send OTP email:", e);
      // continue — do not fail the whole request just because email failed
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};


export const signup = async (req: Request, res: Response) => {
  try {
const { firstName, lastName, email, mobile, password, role } = req.body;
const normalizedEmail = String(email || "").toLowerCase();


const detectedRole = role || (email.endsWith("@admin.com") ? "admin" : "user");


const hashedPassword = await bcrypt.hash(password, 12);
const otp = generateOTP();

const user = await userModel.create({
  firstName,
  lastName,
  email: normalizedEmail,   // store normalized email
  mobile,
  password: hashedPassword,
  role: detectedRole,
  otpHash: hashOTP(otp),
  otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
  otpAttempts: 0,
  isVerified: false,
  status: "Active"
});
    try {
      await sendOTPEmail(normalizedEmail, otp);
      res.status(201).json({ message: "Signup successful. OTP sent to email" });
    } catch (emailErr) {
      console.error("sendOTPEmail failed:", emailErr);
      // return success but warn caller that email failed to send
      res.status(201).json({ message: "Signup successful. OTP creation succeeded but sending email failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};



export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      throw new APIError(404, "User not found");
    }

    if (!user.isVerified) {
      // prevent login until email verified
      throw new APIError(403, "Account not verified. Please verify your email before signing in.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new APIError(401, "Invalid Credentials");
    }

    const today = new Date();
    let licenseExpired = false;

    // Admin License 
  if (user.role === "admin") {
  if (!user.licenseStart) {
    // First login → generate 2-min license
    user.licenseStart = today;
    const expire = new Date(today);
    expire.setFullYear(expire.getFullYear() + 1);
    user.licenseExpire = expire;
    await user.save();
    console.log(" 1-year license generated ");
  }

  // Check license expired
  if (today > (user.licenseExpire || today)) {
    licenseExpired = true;

    //  auto update user status in DB if needed
    if (user.status !== "Inactive") {
      user.status = "Inactive";
      await user.save();
       return res.status(403).json({ message: "Admin license expired ❌ Access blocked" });
      console.log("⚠️ Admin license expired, status set to Inactive ✅");
    }
 return res.status(403).json({ message: "Admin license expired ❌ Access blocked" });
    console.log("⚠️ Admin license expired, flag set true");
  }
}


    // JWT Tokens
    const AccessToken = create_access_token(user._id.toString(), user.role.toString());
    const RefreshToken = create_refresh_token(user._id.toString());
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh-token",
    });

    res.cookie(
      "User",
      JSON.stringify({
        id: user._id,
        // keep legacy snake_case for any consumers
        first_name: user.firstName,
        last_name: user.lastName,
        // provide camelCase fields expected by frontend
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        licenseExpired, // flag sent to frontend
      }),
      {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      }
    );

    const userWithoutPass = {
      id: user.id,
      // include both naming styles for compatibility
      first_name: user.firstName,
      last_name: user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      AccessToken,
      licenseExpired, // frontend how warning
    };

    res.status(201).json(userWithoutPass);
  } catch (error) {
    next(error);
  }
};


export const sendResetOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });

    // ❌ If user not registered
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email address" });
    }

    // Generate OTP
    const otp = generateOTP();

    user.otpHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    user.otpAttempts = 0;

    await user.save();

    await sendOTPEmail(normalizedEmail, otp);

    res.status(200).json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send reset OTP" });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (user.otpAttempts >= 5)
      return res.status(429).json({ success: false, message: "Too many attempts" });

    if (hashOTP(otp) !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};



export const refreshToken = async (req:Request,res:Response,next:NextFunction) =>{
   
   try{

     const token  =  req.cookies?.refreshToken

     console.log("tokenddd",token)

     if(!token){
      throw new APIError(401,"Refresh Token missing")
     }

     jwt.verify(

       token,
       process.env.REFRESH_SECRETE_TOKEN!,
       async (error:Error | null,decoded:string | JwtPayload |undefined)=>{       
         if(error){
             if(error instanceof TokenExpiredError){
                  throw new APIError(401,"Access Token Expired")
            }else if (error instanceof JsonWebTokenError){
                  throw new APIError(401,"Invalid Access Token")
            }else{
                  throw new APIError(401,"Error Verifying Access Token")
            }
         }
        
          if(!decoded || typeof decoded === "string"){
               throw new APIError(401,"Error Access Token Payload Error")
          }

          const userID = decoded.userId as string;

          console.log("ifsdf",userID)
          const user =  await userModel.findById(userID)

          if(!user){
            throw new APIError(401,"user not found")
          }

          const newAccessToken = create_access_token(user._id.toString(),user.role.toString())
          res.status(200).json({accessToken : newAccessToken,


             user: {
            id: user._id,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
            createdAt: user.createdAt,
          },
          })

       }
     )
    
   }catch(error){
         console.log(error)
          next(error)
   }
} 


export const getAllUsers =  async(req:Request,res:Response,next:NextFunction) =>{

    try{
       const users = await userModel.find().select("-password")
       res.status(201).json(users) 
    }catch(error:any){
       res.status(500).json({message:"internal server error"})
    } 

}


export const logout = (req:Request,res:Response,next:NextFunction) =>{
    
   try{

    const isProd = process.env.NODE_ENV === "production"

    res.cookie("refreshToken","",{

      httpOnly:true,
      secure:isProd,
      expires:new Date(0),
      path:"/api/auth/refresh-token"
    })
    
    res.status(200).json({message:"Logout successful"})

   }catch(error:any){
     next(error)
   }

}


export const sendPasswordResetOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    user.resetOTP = otp;
    user.resetOTPExpires = expires;
    await user.save();

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (e) {
      console.error("Failed to send reset OTP email:", e);
      // continue — allow flow to succeed even if email sending fails
    }

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const verifyPasswordResetOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOTP || !user.resetOTPExpires)
      return res.status(400).json({ message: "OTP not requested" });

    if (user.resetOTPExpires < new Date()) {
      user.resetOTP = undefined;
      user.resetOTPExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP expired, request again" });
    }

    if (user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // OTP is valid → frontend can now show new password field
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password required" });
    const normalizedEmail = String(email || "").toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getResetUser = async (req: Request, res: Response) => 
  { try { 
    const { email } = req.body; 
    const normalizedEmail = email.toLowerCase(); 
    const user = await userModel.findOne(
      { email: normalizedEmail }).select( "firstName lastName email mobile" ); 
      if (!user) { return res.status(404).json({
         success: false, message: "User not found" }); } 
         res.status(200).json({ success: true, user }); }
    
    catch { res.status(500).json({ success: false, message: "Failed to fetch user" }); } };