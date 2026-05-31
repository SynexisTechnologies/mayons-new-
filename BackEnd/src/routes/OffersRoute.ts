import express from "express";
import { getAllOffers, getBestDiscountOffers } from "../controllers/offer.controller";

const router = express.Router();

router.get("/", getAllOffers);
router.get("/best", getBestDiscountOffers);

export default router;
