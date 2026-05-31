import mongoose, { Schema, Document } from "mongoose";

export interface IStatus extends Document {
  value: string;
}

const statusSchema: Schema<IStatus> = new Schema(
  {
    value: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
      uppercase: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStatus>("Status", statusSchema);
