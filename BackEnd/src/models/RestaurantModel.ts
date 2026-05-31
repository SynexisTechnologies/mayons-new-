import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  nameKey: string;
  cuisine: string;
  image: string;
  rating: number;
  reviews: number;
  locationKey: string;
  phone: string;
  openingHoursKey: string;
  priceRangeKey: string;
  description: string;
  features: string[];
  certified: boolean;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    nameKey: { 
      type: String, 
      required: true,
      unique: true   // 🔥 important for lookup
    },
    cuisine: { type: String, required: true },
    image: String,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    locationKey: String,
    phone: String,
    openingHoursKey: String,
    priceRangeKey: String,
    description: String,
    features: [String],
    certified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RestaurantModel = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);
