import mongoose, { Schema, Document } from "mongoose";

export interface IEatItem extends Document {
  restaurant: mongoose.Types.ObjectId;
  nameKey: string;
  description: string;
  category: string;
  calories: string;
  price: number;
  image: string;
  tags: string[];
}

const eatItemSchema = new Schema<IEatItem>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    nameKey: { type: String, required: true },
    description: String,
    category: String,
    calories: String,
    price: { type: Number, required: true },
    image: String,
    tags: [String],
  },
  { timestamps: true }
);

export const EatItemModel = mongoose.model<IEatItem>(
  "EatItem",
  eatItemSchema
);
