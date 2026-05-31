// controllers/address.controller.ts
import { Request, Response, NextFunction } from "express";
import AddressModel from "../models/AddressModel";
import { APIError } from "../errors/ApiErrors";


// Create Address
export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {

     if (!req.user?.id) {
      throw new Error("Unauthorized: user not found");
     }

    const address = await AddressModel.create({ ...req.body, user: req.user?.id });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

// Get User Addresses
export const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await AddressModel.find({ user: req.user?.id });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};



// Update Address
export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await AddressModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!address) throw new APIError(404, "Address not found");
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};
