import mongoose, { Schema, Document, Types } from "mongoose";

export type OfferType =
  | "DISCOUNT"
  | "LIMITED_TIME"
  | "SEASONAL"
  | "CLEARANCE"
  | "BOGO";

export interface IOffer extends Document {
  product: Types.ObjectId;
  type: OfferType;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

const OfferSchema = new Schema<IOffer>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["DISCOUNT", "LIMITED_TIME", "SEASONAL", "CLEARANCE", "BOGO"],
      required: true,
    },
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOffer>("Offer", OfferSchema);
