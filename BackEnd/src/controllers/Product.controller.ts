import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import ProductModel from "../models/ProductModel";
import { APIError } from "../errors/ApiErrors";
import CategoryModel from "../models/CategoryModel";
import SubCategoryModel from "../models/SubCategory";

// Helper: auto-calculate discount
const calculateDiscount = (oldPrice: number, newPrice: number) => {
  if (!oldPrice || !newPrice || newPrice >= oldPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

// Helper: coerce a multipart text field (or JSON array) into a string[]
const parseList = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    } catch {
      /* not JSON — fall back to comma split */
    }
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// Helper: delete an uploaded file from /uploads (ignores remote URLs & missing files)
const removeUpload = (image?: string) => {
  if (!image || /^https?:\/\//i.test(image)) return;
  const filename = image.replace(/^\/?uploads\//, "");
  fs.promises
    .unlink(path.join("uploads", filename))
    .catch(() => {/* already gone — ignore */});
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

    // Image comes from the uploaded file; fall back to a URL string for back-compat
    const image = req.file ? req.file.filename : req.body.image;

    if (!pluNumber || !nameEn || !nameSi || !category || !descriptionEn || !descriptionSi || !image) {
      if (req.file) removeUpload(req.file.filename);
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await ProductModel.findOne({ pluNumber });
    if (exists) {
      if (req.file) removeUpload(req.file.filename);
      return res.status(409).json({ message: "Product already exists" });
    }

    // Match category by name (case-insensitive) OR titleKey
    const categoryDoc = await CategoryModel.findOne({
      $or: [
        { titleKey: category.toLowerCase() },
        { name: { $regex: new RegExp(`^${category}$`, "i") } },
      ],
    });
    if (!categoryDoc) {
      if (req.file) removeUpload(req.file.filename);
      return res.status(400).json({ message: "Invalid category" });
    }

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

      if (!subCategoryDoc) {
        if (req.file) removeUpload(req.file.filename);
        return res.status(400).json({ message: "Invalid SubCategory" });
      }
    }

    const oldP = Number(oldPrice) || 0;
    const newP = Number(newPrice) || 0;

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
      oldPrice: oldP,
      newPrice: newP,
      discount: calculateDiscount(oldP, newP),
      rating: Number(rating) || 0,
      reviews: Number(reviews) || 0,
      sizes: parseList(sizes),
      colors: parseList(colors),
      isActive: isActive === undefined ? true : isActive !== "false" && isActive !== false,
      stock: Number(stock) || 0,
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
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) removeUpload(req.file.filename);
      throw new APIError(400, "Invalid product ID");
    }

    const existing = await ProductModel.findById(id);
    if (!existing) {
      if (req.file) removeUpload(req.file.filename);
      throw new APIError(404, "Product not found");
    }

    const updateData: Record<string, any> = { ...req.body };

    // Resolve category / subCategory names → ObjectIds when provided
    if (updateData.category) {
      const categoryDoc = await CategoryModel.findOne({
        $or: [
          { titleKey: String(updateData.category).toLowerCase() },
          { name: { $regex: new RegExp(`^${updateData.category}$`, "i") } },
        ],
      });
      if (!categoryDoc) {
        if (req.file) removeUpload(req.file.filename);
        return res.status(400).json({ message: "Invalid category" });
      }
      updateData.category = categoryDoc._id;

      if (updateData.subCategory) {
        const subDoc = await SubCategoryModel.findOne({
          category: categoryDoc._id,
          $or: [
            { titleKey: String(updateData.subCategory).toLowerCase() },
            { name: { $regex: new RegExp(`^${updateData.subCategory}$`, "i") } },
          ],
        });
        if (!subDoc) {
          if (req.file) removeUpload(req.file.filename);
          return res.status(400).json({ message: "Invalid SubCategory" });
        }
        updateData.subCategory = subDoc._id;
      }
    }

    // Numbers / arrays come in as strings over multipart — coerce them
    if (updateData.oldPrice !== undefined) updateData.oldPrice = Number(updateData.oldPrice) || 0;
    if (updateData.newPrice !== undefined) updateData.newPrice = Number(updateData.newPrice) || 0;
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock) || 0;
    if (updateData.sizes !== undefined) updateData.sizes = parseList(updateData.sizes);
    if (updateData.colors !== undefined) updateData.colors = parseList(updateData.colors);
    if (updateData.isActive !== undefined)
      updateData.isActive = updateData.isActive !== "false" && updateData.isActive !== false;

    if (updateData.oldPrice !== undefined && updateData.newPrice !== undefined) {
      updateData.discount = calculateDiscount(updateData.oldPrice, updateData.newPrice);
    }

    // A new file replaces the stored image (and the old file on disk)
    if (req.file) {
      updateData.image = req.file.filename;
      removeUpload(existing.image);
    } else {
      // No new upload — never overwrite the saved image with an empty value
      delete updateData.image;
    }

    const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    if (req.file) removeUpload(req.file.filename);
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

    removeUpload(deletedProduct.image);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
