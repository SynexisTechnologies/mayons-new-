// src/models/CategoryModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  titleKey: string;
  name: string;
  discount?: number;
  image?: string;
  items?: any[];
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    titleKey: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String },
    items: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);
export default CategoryModel;
