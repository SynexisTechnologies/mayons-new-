import { Request, Response } from "express";
import { RestaurantModel } from "../models/RestaurantModel";
import { EatItemModel } from "../models/EatsModel";
import mongoose from "mongoose";
/* ================= RESTAURANTS ================= */

export const getRestaurants = async (_: Request, res: Response) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.json({ data: restaurants });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await RestaurantModel.create(req.body);
    res.status(201).json(restaurant);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= MENU ITEMS ================= */

export const getEatItemsByRestaurant = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId = req.params.restaurantId;

if (!restaurantId || typeof restaurantId !== "string") {
  return res.status(400).json({ message: "Restaurant identifier is required" });
}


const isObjectId = mongoose.Types.ObjectId.isValid(restaurantId);

let restaurant;
if (isObjectId) {
  restaurant = await RestaurantModel.findById(restaurantId);
} else {
  restaurant = await RestaurantModel.findOne({ nameKey: restaurantId });
}

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const items = await EatItemModel.find({
      restaurant: restaurant._id,
    });

  const grouped = items.reduce((acc: any, item: any) => {
  // normalize to lowercase
  const category = (item.category || "others").toLowerCase();

  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
}, {});

const formatted = Object.keys(grouped).map((cat) => ({
  category: cat,  // this is now lowercase
  items: grouped[cat],
}));

    res.json({ data: formatted });
  } catch (error) {
    console.error("GET EAT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch eat items" });
  }
};


export const createEatItem = async (req: Request, res: Response) => {
  try {
    const {
      restaurantNameKey,
      nameKey,
      description,
      category,
      calories,
      price,
      image,
      tags,
    } = req.body;

    // 🔥 Step 1: Find restaurant by nameKey
    const restaurant = await RestaurantModel.findOne({
      nameKey: restaurantNameKey,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // 🔥 Step 2: Create eat item with restaurant._id
    const item = await EatItemModel.create({
      restaurant: restaurant._id,
      nameKey,
      description,
      category,
      calories,
      price,
      image,
      tags,
    });

    res.status(201).json(item);
  } catch (error: any) {
    console.error("CREATE EAT ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};
