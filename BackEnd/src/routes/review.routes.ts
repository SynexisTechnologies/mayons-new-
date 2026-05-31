import { Router } from "express";
import { createReview, getProductReviews } from "../controllers/review.controller";

const reviewRouter = Router();

reviewRouter.post("/create", createReview);
reviewRouter.get("/product/:id", getProductReviews);





export default reviewRouter;