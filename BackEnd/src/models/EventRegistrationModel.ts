import mongoose, { Schema, Document } from "mongoose";

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  numberOfTickets: number;
  dietaryPreferences?: string;
  specialRequirements?: string;
  createdAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  numberOfTickets: { type: Number, required: true, default: 1 },
  dietaryPreferences: { type: String },
  specialRequirements: { type: String },
}, { timestamps: true });

export const EventRegistrationModel = mongoose.model<IEventRegistration>(
  "EventRegistration",
  EventRegistrationSchema
);
