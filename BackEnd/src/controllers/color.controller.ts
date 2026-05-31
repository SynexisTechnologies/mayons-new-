import { Request, Response, NextFunction } from "express";

import { APIError } from "../errors/ApiErrors";
import ColorModel from "../models/ColorModel";
import mongoose from "mongoose";





export const createColor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(new APIError(400, "Color name is required"));
    }

    const exists = await ColorModel.findOne({ name: name.trim() });
    if (exists) {
      return next(new APIError(400, "Color already exists"));
    }

    const color = await ColorModel.create({ name: name.trim() });

    return res.status(201).json({
      success: true,
      color,
    });
  } catch (error) {
    return next(error);
  }
};





export const getAllColors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const colors = await ColorModel.find();

    return res.json({
      success: true,
      colors,
    });
  } catch (error) {
    return next(error);
  }
};





export const updateColor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const color = await ColorModel.findById(id);
    if (!color) {
      return next(new APIError(404, "Color not found"));
    }

    if (!name) {
      return next(new APIError(400, "Color name is required"));
    }



    color.name = name.trim();
    await color.save();

    return res.json({
      success: true,
      color,
    });
  } catch (error) {
    return next(error);
  }
};






export const deleteColor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deleted = await ColorModel.findByIdAndDelete(id);
    if (!deleted) {
      return next(new APIError(404, "Color not found"));
    }

    return res.json({
      success: true,
      message: "Color deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
