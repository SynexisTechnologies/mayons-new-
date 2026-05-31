import mongoose, {  Document } from "mongoose";




export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile?: string;

  otpHash?: string;
  otpExpiresAt?: Date;
  otpAttempts: number;

  isVerified: boolean;
  createdAt: Date;

  role : "admin" | "user"
  status : "Active" | "Inactive"


  licenseStart?: Date;
  licenseExpire?: Date;

  resetOTP?: string;
  resetOTPExpires?: Date;
}

const userSchema =  new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  mobile: { type: String, required: true },

  password: { type: String, required: true },

  otpHash: { type: String },
  otpExpiresAt: { type: Date },
  otpAttempts: { type: Number, default: 0 },

  isVerified: { type: Boolean, default: false },
      
   role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",   
  },
   
   licenseStart: { type: Date },
   licenseExpire: { type: Date },

  resetOTP: { type: String },
  resetOTPExpires: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

export const userModel = mongoose.model<User>("User",userSchema)