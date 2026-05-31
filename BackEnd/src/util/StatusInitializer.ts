import StatusModel from "../models/StatusModel";

export const seedStatus = async () => {
  try {
    const defaultStatuses = ["ACTIVE", "DEACTIVE"];

    for (const value of defaultStatuses) {
      const exists = await StatusModel.findOne({ value });
      if (!exists) {
        await StatusModel.create({ value });
        console.log(`✅ Status created: ${value}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding status:", error);
  }
};
