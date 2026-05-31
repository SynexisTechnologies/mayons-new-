import { Request, Response } from "express";
import OfferModel from "../models/OffersModel";

export const getAllOffers = async (_: Request, res: Response) => {
  try {
    const now = new Date();

    const offers = await OfferModel.find({
      isActive: true,
      $or: [
        { type: { $ne: "LIMITED_TIME" } },
        {
          type: "LIMITED_TIME",
          startDate: { $lte: now },
          endDate: { $gte: now },
        },
      ],
    }).populate("product");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch offers" });
  }
};

export const getBestDiscountOffers = async (_: Request, res: Response) => {
  try {
    const offers = await OfferModel.find({
      type: "DISCOUNT",
      isActive: true,
    })
      .limit(4)
      .populate("product");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch best offers" });
  }
};
