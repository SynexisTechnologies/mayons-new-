import { Request, Response, NextFunction } from "express";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";
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




// Apply a single discount % to every product in a category (MRP-based)
export const applyCategoryDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      throw new APIError(404, "Category not found");
    }

    const pct = Number(req.body.discount);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      throw new APIError(400, "discount must be a number between 0 and 100");
    }

    category.discount = pct;
    await category.save();

    const products = await ProductModel.find({ category: category._id });
    await Promise.all(
      products.map((p) => {
        p.newPrice = Math.round(p.oldPrice * (1 - pct / 100));
        p.discount = pct;
        return p.save();
      })
    );

    res.status(200).json({
      success: true,
      message: `Applied ${pct}% discount to ${products.length} product(s)`,
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
