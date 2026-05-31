import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  pluNumber: string;
  nameEn: string;
  nameSi: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  descriptionEn: string;
  descriptionSi: string;
  image: string;
  unit?: string;
  oldPrice: number;
  newPrice: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  isActive: boolean;
  stock: number;
  sold?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    pluNumber: { type: String, required: true, unique: true },
    nameEn: { type: String, required: true },
    nameSi: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    descriptionEn: { type: String, required: true },
    descriptionSi: { type: String, required: true },
    image: { type: String, required: true },
    unit: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
