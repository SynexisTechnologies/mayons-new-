import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ProductModel from "../models/ProductModel";
import { APIError } from "../errors/ApiErrors";
import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategory";

// Helper: auto-calculate discount
const calculateDiscount = (oldPrice: number, newPrice: number) => {
  if (!oldPrice || !newPrice || newPrice >= oldPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

// Helper: format product response
const formatProduct = (obj: any) => {
  const discount = calculateDiscount(obj.oldPrice, obj.newPrice);

  return {
    ...obj,
    category: obj.category?.name || obj.category,
    subCategory: obj.subCategory?.name || obj.subCategory,
    sizes: Array.isArray(obj.sizes) && obj.sizes.length > 0 ? obj.sizes : undefined,
    colors: Array.isArray(obj.colors) && obj.colors.length > 0 ? obj.colors : undefined,
    discount: discount > 0 ? discount : undefined,
    oldPrice: discount > 0 ? obj.oldPrice : undefined,
    newPrice: discount > 0 ? obj.newPrice : undefined,
    price: discount === 0 ? obj.newPrice : undefined, // Only show newPrice as price if no discount
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : undefined,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : undefined,
  };
};

export const getSoldOutProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find({ stock: { $lt: 1 } })
      .populate("category")
      .populate("subCategory");

    res.json(products);
  } catch (error) {
    next(error);
  }
};


// Create product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      pluNumber,
      nameEn,
      nameSi,
      category, // user can give category name
      subCategory, // user can give subcategory name
      descriptionEn,
      descriptionSi,
      image,
      unit,
      oldPrice,
      newPrice,
      rating,
      reviews,
      sizes,
      colors,
      isActive,
      stock,
    } = req.body;

    if (!pluNumber || !nameEn || !nameSi || !category || !descriptionEn || !descriptionSi || !image) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await ProductModel.findOne({ pluNumber });
    if (exists) return res.status(409).json({ message: "Product already exists" });

    // Match category by name (case-insensitive) OR titleKey
    const categoryDoc = await CategoryModel.findOne({
      $or: [
        { titleKey: category.toLowerCase() },
        { name: { $regex: new RegExp(`^${category}$`, "i") } },
      ],
    });
    if (!categoryDoc) return res.status(400).json({ message: "Invalid category" });

    let subCategoryDoc = null;
    if (subCategory) {
      // Match subcategory by name (case-insensitive) OR titleKey
      subCategoryDoc = await SubCategoryModel.findOne({
        category: categoryDoc._id,
        $or: [
          { titleKey: subCategory.toLowerCase() },
          { name: { $regex: new RegExp(`^${subCategory}$`, "i") } },
        ],
      });

      if (!subCategoryDoc) return res.status(400).json({ message: "Invalid SubCategory" });
    }

    const product = await ProductModel.create({
      pluNumber,
      nameEn,
      nameSi,
      category: categoryDoc._id,
      subCategory: subCategoryDoc?._id,
      descriptionEn,
      descriptionSi,
      image,
      unit,
      oldPrice,
      newPrice,
      discount: calculateDiscount(oldPrice, newPrice),
      rating: rating || 0,
      reviews: reviews || 0,
      sizes: sizes || [],
      colors: colors || [],
      isActive: isActive ?? true,
      stock: stock ?? 0, 
    });

    res.status(201).json(formatProduct(product.toObject()));
  } catch (error) {
    next(error);
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find().populate("category").populate("subCategory");
    const formattedProducts = products.map((p) => formatProduct(p.toObject()));
    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new APIError(400, "Invalid product ID");

    const product = await ProductModel.findById(id).populate("category").populate("subCategory");
    if (!product) throw new APIError(404, "Product not found");

    res.json(formatProduct(product.toObject()));
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.find()
      .populate("category")
      .populate("subCategory");

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const updated = await ProductModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};


// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new APIError(400, "Invalid product ID");

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) throw new APIError(404, "Product not found");

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
