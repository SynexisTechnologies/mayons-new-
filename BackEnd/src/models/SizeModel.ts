import { Schema, model, Document } from "mongoose";

export interface ISize extends Document {
  name: string; 
}

const sizeSchema = new Schema<ISize>(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default model<ISize>("Size", sizeSchema);
