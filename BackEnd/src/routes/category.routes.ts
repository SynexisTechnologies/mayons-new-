import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, applyCategoryDiscount } from "../controllers/category.controller";
import { upload } from "../middlewares/uploads";

const categoryRouter =  Router();

categoryRouter.post("/create",upload.single("image"), createCategory);
categoryRouter.get("/all", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/update/:id", upload.single("image"), updateCategory);
categoryRouter.put("/:id/apply-discount", applyCategoryDiscount);
categoryRouter.delete("/delete/:id", deleteCategory);

export default categoryRouter;