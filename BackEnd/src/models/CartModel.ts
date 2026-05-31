import { Schema, model, Document, Types } from "mongoose";

// Cart Item Interface
export interface ICartItem {
  [x: string]: any;
  product: any; // allow ObjectId or external id/object
  variant?: Types.ObjectId;
  quantity: number;
  price: number;
}

// Cart Interface
export interface ICart extends Document {
  user?: Types.ObjectId;
  userEmail?: string;
  userName?: string;
  items: ICartItem[];
  totalPrice: number;
  status: "ACTIVE" | "CHECKED_OUT";
  createdAt: Date;
  updatedAt: Date;
}


const cartItemSchema = new Schema<ICartItem>(
  {
    // product can be an ObjectId reference to Product, or an external id/string/object for eats/offers
    product: {
      type: Schema.Types.Mixed,
      ref: "Product",
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);


const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
    },
    userName: {
      type: String,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CHECKED_OUT"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);


cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true }, status: "ACTIVE" } }
);

export default model<ICart>("Cart", cartSchema);
