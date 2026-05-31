import { Request, Response, NextFunction } from "express";
import CategoryModel from "../models/CategoryModel";
import { APIError } from "../errors/ApiErrors";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { titleKey, name, discount, items } = req.body;

    if (!titleKey || !name) {
      return next(new APIError(400, "titleKey and name are required"));
    }

    const exists = await CategoryModel.findOne({ titleKey });
    if (exists) {
      return next(new APIError(400, "Category already exists"));
    }

    const category = await CategoryModel.create({
      titleKey,
      name,
      discount: discount ?? 0,
      image: req.file?.path,
      items: items ?? [],
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      throw new APIError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      throw new APIError(404, "Category not found");
    }

    if (req.body.name) {
      category.name = req.body.name;
    }

    
    if (req.body.discount || req.body.discount===0) {
      category.discount = req.body.discount;
    }

    if (req.file) {
      category.image = req.file.path;
    }

    if (req.body.items) {
      category.items = req.body.items;
    }

    await category.save();

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};




export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new APIError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
