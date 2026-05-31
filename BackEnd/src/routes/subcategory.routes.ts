import { Router } from "express";
import { createSubCategory, getAllSubCategories, getSubCategoriesByCategory, deleteSubCategory, updateSubCategory } from "../controllers/subCategory.controller";

const subcatRouter = Router();

subcatRouter.post("/create", createSubCategory);
subcatRouter.get("/all", getAllSubCategories);
subcatRouter.get("/category/:id", getSubCategoriesByCategory);
subcatRouter.delete("/delete/:id", deleteSubCategory);
subcatRouter.put("/update/:id", updateSubCategory);


export default subcatRouter;