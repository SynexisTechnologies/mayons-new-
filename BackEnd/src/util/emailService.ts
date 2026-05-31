import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});


export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    const subject = "Your OTP Code";
    const text = `Hello! Your OTP for signup is: ${otp}. It expires in 5 minutes.`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`OTP Email sent to ${to}: ${otp}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};





