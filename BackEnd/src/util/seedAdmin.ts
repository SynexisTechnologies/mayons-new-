import bcrypt from "bcrypt";
import { userModel } from "../models/userModel";

export const seedAdmin = async () => {
  try {
    const existing = await userModel.findOne({ email: "admin@example.com" });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await userModel.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: hashedPassword,
        mobile: "0000000000",
        role: "admin",
        status: "Active",
        isVerified: true,
      });
      console.log("👑 Default admin user created!");
    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
