import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { APIError } from "../errors/ApiErrors"; 
import VarientModel, { IProductVariant } from "../models/VarientModel";




export const createVariant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product, size, color, cost, mrpPrice, ourPrice, stock } = req.body;

    if (!product || !size || !color || !cost || !mrpPrice || !ourPrice) {
      throw new APIError(400, "Required fields missing");
    }

    const images = req.files as Express.Multer.File[];
    if (!images || images.length === 0) {
      throw new APIError(400, "Variant images are required");
    }

    const variant = await VarientModel.create({
      product: new mongoose.Types.ObjectId(product),
      size: new mongoose.Types.ObjectId(size),
      color: new mongoose.Types.ObjectId(color),
      cost,
      mrpPrice,
      ourPrice,
      stock: stock || 0,
      images: images.map(f => f.filename),
    
    });

    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
};

export const getAllVariants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variants = await VarientModel.find()
      .populate("product")
      .populate("size")
      .populate("color");

    res.json(variants);
  } catch (error) {
    next(error);
  }
};






export const getVariantsByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
  
    const variants = await VarientModel.find({ product: productId })
      .populate("size")
      .populate("color");

    res.json(variants);
  } catch (error) {
    next(error);
  }
};





export const updateVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

  
    const images = req.files as Express.Multer.File[];
    const updateData: Partial<IProductVariant> = { ...req.body };

    if (images && images.length > 0) {
      updateData.images = images.map(f => f.filename);
    }

    const updatedVariant = await VarientModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedVariant) {
      throw new APIError(404, "Variant not found");
    }

    res.json(updatedVariant);
  } catch (error) {
    next(error);
  }
};




export const deleteVariant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

   
    const deletedVariant = await VarientModel.findByIdAndDelete(id);

    if (!deletedVariant) {
      throw new APIError(404, "Variant not found");
    }

    res.json({ message: "Variant deleted successfully" });
  } catch (error) {
    next(error);
  }
};
