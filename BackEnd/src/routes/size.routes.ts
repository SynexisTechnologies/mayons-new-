import { Router } from "express";
import { createSize, updateSize, getAllSizes, deleteSize } from "../controllers/size.controller";

const sizeRouter = Router();

sizeRouter.post("/create", createSize);
sizeRouter.put("/update/:id", updateSize);
sizeRouter.get("/all", getAllSizes);
sizeRouter.delete("/delete/:id", deleteSize);

export default sizeRouter;