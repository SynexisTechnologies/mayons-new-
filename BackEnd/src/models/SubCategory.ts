// src/models/SubCategory.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  titleKey: string;
  name: string;
  category: mongoose.Types.ObjectId;
}

const SubCategorySchema: Schema<ISubCategory> = new Schema(
  {
    titleKey: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

SubCategorySchema.index({ titleKey: 1, category: 1 }, { unique: true });

const SubCategoryModel = mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
export default SubCategoryModel;
