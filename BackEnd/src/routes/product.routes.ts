import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProducts,
  updateProduct,
  deleteProduct,
  getSoldOutProducts
} from "../controllers/Product.controller";

const productRouter = Router();

// CRUD routes
productRouter.post("/", createProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/all", getAllProducts);
productRouter.get("/sold-out", getSoldOutProducts);
productRouter.get("/", getProducts);

export default productRouter;

 

{/**
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  qty: number;
  unit: "kg" | "g" | "pcs" | "liter";
  expiryDate?: Date;
  organic: boolean;
  special: boolean;
  image?: string [];
  category: mongoose.Types.ObjectId;
  status : "Active" | "Inactive"

}
 */}