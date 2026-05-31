import { Schema, model, Document, Types } from "mongoose";

export interface IDelivery extends Document {
  order: Types.ObjectId;           // Link to Order
  type: "HOME_DELIVERY" | "PICKUP" | "DRONE";
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  address: any;         // Required for HOME_DELIVERY — may be ObjectId or plain address object/string
  expectedDate?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  type: { type: String, enum: ["HOME_DELIVERY", "PICKUP", "DRONE"], required: true },
  status: { type: String, enum: ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"], default: "PENDING" },
  // address can be an Address ObjectId or a plain address object/string submitted at checkout
  address: {
    type: Schema.Types.Mixed,
    ref: "Address",
    required: function () {
      return (this as any).type === "HOME_DELIVERY";
    },
  },
  expectedDate: { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default model<IDelivery>("Delivery", deliverySchema);
