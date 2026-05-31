import { Request, Response, NextFunction } from "express";
import SubCategoryModel from "../models/SubCategory";
import { APIError } from "../errors/ApiErrors";


export const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { titleKey, name, category } = req.body;

    if (!titleKey || !name || !category) {
      return next(new APIError(400, "titleKey, name and category are required"));
    }

    const exists = await SubCategoryModel.findOne({ titleKey, category });
    if (exists) {
      return next(new APIError(400, "SubCategory already exists"));
    }

    const subCategory = await SubCategoryModel.create({
      titleKey,
      name,
      category,
    });

    res.status(201).json({
      success: true,
      subCategory,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllSubCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subCategories = await SubCategoryModel.find()
      .populate("category", "name");

    return res.json({
      success: true,
      subCategories,
    });
  } catch (error) {
    return next(error);
  }
};




export const getSubCategoriesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategoryModel.find({
      category: categoryId,
    });

    return res.json({
      success: true,
      subCategories,
    });
  } catch (error) {
    return next(error);
  }
};


export const updateSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
      return next(new APIError(404, "SubCategory not found"));
    }

    if (name) subCategory.name = name;
    if (category) subCategory.category = category;

    await subCategory.save();

    return res.json({
      success: true,
      subCategory,
    });
  } catch (error) {
    return next(error);
  }
};




export const deleteSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deleted = await SubCategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      return next(new APIError(404, "SubCategory not found"));
    }

    return res.json({
      success: true,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
