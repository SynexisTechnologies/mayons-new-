import { Router } from "express";
import {
  getRestaurants,
  getEatItemsByRestaurant,
  createEatItem,
  createRestaurant
} from "../controllers/Restaurant.controller";

const resturentRouter = Router();

resturentRouter.get("/restaurants", getRestaurants);
resturentRouter.get("/eat-items/:restaurantId", getEatItemsByRestaurant);
resturentRouter.post("/restaurants", createRestaurant);
resturentRouter.post("/eat-items", createEatItem);

export default resturentRouter;
