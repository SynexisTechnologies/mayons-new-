// src/models/SubCategory.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  titleKey: string;
  name: string;
  category: mongoose.Types.ObjectId;
}

const SubCategorySchema: Schema<ISubCategory> = new Schema(
  {
    titleKey: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
export default SubCategoryModel;
