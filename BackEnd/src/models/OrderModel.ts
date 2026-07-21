import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product?: Types.ObjectId;
  productName: string;
  variant?: Types.ObjectId;
  variantName?: string;
  quantity: number;
  price: number;
}

// Details captured on the checkout form — who the order is going to
export interface IRecipient {
  name: string;
  phone: string;
  address: string;
  city?: string;
  locationType?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  deliveryInstructions?: string;
  senderName?: string;
  sendAlerts?: boolean;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  deliveryFee: number;
  address: Types.ObjectId;
  recipient?: IRecipient;
  paymentMethod: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  delivery?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipientSchema = new Schema<IRecipient>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String },
  locationType: { type: String },
  deliveryDate: { type: String },
  deliveryTimeSlot: { type: String },
  deliveryInstructions: { type: String },
  senderName: { type: String },
  sendAlerts: { type: Boolean, default: false },
}, { _id: false });

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
  deliveryFee: { type: Number, default: 0 },
  // allow address to be either an ObjectId reference to Address or a plain stored address string/object
  address: { type: Schema.Types.Mixed, ref: "Address", required: true },
  recipient: { type: recipientSchema },
  paymentMethod: { type: String, required: true },
status: {
  type: String,
  enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
  default: "PENDING",
},
  delivery: { type: Schema.Types.ObjectId, ref: "Delivery" } 
}, { timestamps: true });



export default model<IOrder>("Order", orderSchema);
