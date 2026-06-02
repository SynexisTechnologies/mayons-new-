import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProducts,
  updateProduct,
  deleteProduct,
  getSoldOutProducts
} from "../controllers/Product.controller";
import { upload } from "../middlewares/uploads";

const productRouter = Router();

// CRUD routes — `image` is uploaded as a file to /uploads
productRouter.post("/", upload.single("image"), createProduct);
productRouter.put("/update/:id", upload.single("image"), updateProduct);
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