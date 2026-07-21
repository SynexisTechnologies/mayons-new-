// src/models/SubCategory1.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory1 extends Document {
  titleKey: string;
  name: string;
  subCategory: mongoose.Types.ObjectId;
}

const SubCategory1Schema: Schema<ISubCategory1> = new Schema(
  {
    titleKey: { type: String, required: true },
    name: { type: String, required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
  },
  { timestamps: true }
);

SubCategory1Schema.index({ titleKey: 1, subCategory: 1 }, { unique: true });

const SubCategory1Model = mongoose.model<ISubCategory1>("SubCategory1", SubCategory1Schema);
export default SubCategory1Model;
