import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { APIError } from "../errors/ApiErrors";
import ReviewModel from "../models/ReviewModel";


export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product, user, rating, comment } = req.body;

    if (!product || !user || !rating) {
      throw new APIError(400, "Required fields missing");
    }

    const existingReview = await ReviewModel.findOne({
      product: new mongoose.Types.ObjectId(product),
      user: new mongoose.Types.ObjectId(user)
    });

    if (existingReview) {
      throw new APIError(409, "User has already reviewed this product");
    }

    const review = await ReviewModel.create({
      product: new mongoose.Types.ObjectId(product),
      user: new mongoose.Types.ObjectId(user),
      rating,
      comment: comment || ""
    });

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new APIError(400, "Invalid product or user ID"));
    }
    next(error);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new APIError(400, "Product ID is required");
    }

    const reviews = await ReviewModel.find({ product: new mongoose.Types.ObjectId(id as string) })
      .populate("user", "name email");

    res.status(200).json(reviews);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new APIError(400, "Invalid product ID"));
    }
    next(error);
  }
};






export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!reviewId) {
      throw new APIError(400, "Review ID is required");
    }

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new APIError(400, "Invalid review ID"));
    }
    next(error);
  }
};





export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      throw new APIError(400, "Review ID is required");
    }

    const review = await ReviewModel.findByIdAndDelete(reviewId);

    if (!review) {
      throw new APIError(404, "Review not found");
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new APIError(400, "Invalid review ID"));
    }
    next(error);
  }
};
