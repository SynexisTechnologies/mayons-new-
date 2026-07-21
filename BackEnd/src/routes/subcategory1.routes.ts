import { Router } from "express";
import {
  createSubCategory1,
  getAllSubCategory1,
  getSubCategory1BySubCategory,
  deleteSubCategory1,
  updateSubCategory1,
} from "../controllers/subCategory1.controller";

const subcat1Router = Router();

subcat1Router.post("/create", createSubCategory1);
subcat1Router.get("/all", getAllSubCategory1);
subcat1Router.get("/subCategory/:id", getSubCategory1BySubCategory);
subcat1Router.delete("/delete/:id", deleteSubCategory1);
subcat1Router.put("/update/:id", updateSubCategory1);

export default subcat1Router;
