import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product?: Types.ObjectId;
  productName: string;
  variant?: Types.ObjectId;
  variantName?: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  address: Types.ObjectId;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  delivery?: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String, required: true },
  variant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
  variantName: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: true });

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  // allow address to be either an ObjectId reference to Address or a plain stored address string/object
  address: { type: Schema.Types.Mixed, ref: "Address", required: true },
  paymentMethod: { type: String, required: true },
status: {
  type: String,
  enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
  default: "PENDING",
},
  delivery: { type: Schema.Types.ObjectId, ref: "Delivery" } 
}, { timestamps: true });



export default model<IOrder>("Order", orderSchema);
