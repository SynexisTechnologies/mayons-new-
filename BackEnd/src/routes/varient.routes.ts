import { Router } from "express";
import { createVariant, getAllVariants, getVariantsByProduct, updateVariant, deleteVariant } from "../controllers/varient.controller";
import { upload } from "../middlewares/uploads";

const varientRouter = Router();

varientRouter.post("/create", upload.array("images", 5), createVariant);
varientRouter.get("/all", getAllVariants);
varientRouter.get("/product/:id", getVariantsByProduct);
varientRouter.put("/update/:id", upload.array("images", 5) ,updateVariant);
varientRouter.delete("/delete/:id", deleteVariant);

export default varientRouter;