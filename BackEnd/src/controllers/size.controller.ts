import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { APIError } from "../errors/ApiErrors";
import SizeModel from "../models/SizeModel";




export const createSize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(new APIError(400, "Size name is required"));
    }

    const exists = await SizeModel.findOne({ name: name.trim() });
    if (exists) {
      return next(new APIError(400, "Size already exists"));
    }

    const size = await SizeModel.create({ name: name.trim() });

    return res.status(201).json({
      success: true,
      size,
    });
  } catch (error) {
    return next(error);
  }
};




export const getAllSizes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sizes = await SizeModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sizes.length,
      sizes,
    });
  } catch (error) {
    return next(error);
  }
};





export const updateSize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const size = await SizeModel.findById(id);
    if (!size) return next(new APIError(404, "Size not found"));
    if (!name) return next(new APIError(400, "Size name is required"));

    // duplicate check
   

    size.name = name.trim();
    await size.save();

    return res.status(200).json({
      success: true,
      size,
    });
  } catch (error) {
    return next(error);
  }
};



export const deleteSize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleted = await SizeModel.findByIdAndDelete(id);
    if (!deleted) return next(new APIError(404, "Size not found"));

    return res.status(200).json({
      success: true,
      message: "Size deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
