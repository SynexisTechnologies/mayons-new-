// backend/models/EventModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  titleSi: string;
  date: string;
  time: string;
  location: string;
  categoryKey: string;
  image?: string;
  description?: string;
  descriptionSi?: string;
  price?: string;
  capacity?: number;
  statusKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    titleSi: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    categoryKey: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    descriptionSi: { type: String },
    price: { type: String },
    capacity: { type: Number },
    statusKey: { type: String },
  },
  { timestamps: true }
);

export const EventModel = mongoose.model<IEvent>("Event", EventSchema);
