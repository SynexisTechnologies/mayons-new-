import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductVariant extends Document {
  product: Types.ObjectId;
  size: Types.ObjectId;
  color: Types.ObjectId;
  cost: number;
  mrpPrice: number;
  ourPrice: number;
  stock: number;
  images: string[];
  isActive: boolean;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    cost: { type: Number, required: true },
    mrpPrice: { type: Number, required: true },
    ourPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductVariantSchema.index(
  { product: 1, size: 1, color: 1 },
  { unique: true }
);

export default mongoose.model<IProductVariant>(
  "ProductVariant",
  ProductVariantSchema
);
