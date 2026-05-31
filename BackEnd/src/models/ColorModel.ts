import { Schema, model, Document } from "mongoose";

export interface IColor extends Document {
  name: string;
  
}

const colorSchema = new Schema<IColor>(
  {
    name: { type: String, required: true, trim: true },
   
  },
  { timestamps: true }
);

export default model<IColor>("Color", colorSchema);
