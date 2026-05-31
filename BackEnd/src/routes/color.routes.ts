import { Router } from "express";
import { createColor, updateColor, getAllColors, deleteColor } from "../controllers/color.controller";

const colorRouter = Router();

colorRouter.post("/create", createColor);
colorRouter.put("/update/:id", updateColor);
colorRouter.get("/all", getAllColors);
colorRouter.delete("/delete/:id", deleteColor);

export default colorRouter;