import { Request, Response, NextFunction } from "express";
import SubCategory1Model from "../models/SubCategory1";
import { APIError } from "../errors/ApiErrors";


export const createSubCategory1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { titleKey, name, subCategory } = req.body;

    if (!titleKey || !name || !subCategory) {
      return next(new APIError(400, "titleKey, name and subCategory are required"));
    }

    const exists = await SubCategory1Model.findOne({ titleKey, subCategory });
    if (exists) {
      return next(new APIError(400, "SubCategory1 already exists"));
    }

    const subCategory1 = await SubCategory1Model.create({
      titleKey,
      name,
      subCategory,
    });

    res.status(201).json({
      success: true,
      subCategory1,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllSubCategory1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subCategory1s = await SubCategory1Model.find()
      .populate("subCategory", "name");

    return res.json({
      success: true,
      subCategory1s,
    });
  } catch (error) {
    return next(error);
  }
};


export const getSubCategory1BySubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const subCategory1s = await SubCategory1Model.find({
      subCategory: id,
    });

    return res.json({
      success: true,
      subCategory1s,
    });
  } catch (error) {
    return next(error);
  }
};


export const updateSubCategory1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, subCategory } = req.body;

    const subCategory1 = await SubCategory1Model.findById(id);
    if (!subCategory1) {
      return next(new APIError(404, "SubCategory1 not found"));
    }

    if (name) subCategory1.name = name;
    if (subCategory) subCategory1.subCategory = subCategory;

    await subCategory1.save();

    return res.json({
      success: true,
      subCategory1,
    });
  } catch (error) {
    return next(error);
  }
};


export const deleteSubCategory1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deleted = await SubCategory1Model.findByIdAndDelete(id);
    if (!deleted) {
      return next(new APIError(404, "SubCategory1 not found"));
    }

    return res.json({
      success: true,
      message: "SubCategory1 deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
