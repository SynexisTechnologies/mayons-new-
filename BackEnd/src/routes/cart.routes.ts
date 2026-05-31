import { Router } from "express";
import { getCart, addItemToCart, updateItemQuantity, removeItemFromCart } from "../controllers/cart.controller";

const cartRouter = Router();

// Get all items for a user
cartRouter.get("/:userEmail", getCart);

// Add item to cart
cartRouter.post("/add", addItemToCart);

// Update quantity
cartRouter.put("/update/:userEmail/:itemId", updateItemQuantity);

// Remove item
cartRouter.delete("/remove/:userEmail/:itemId", removeItemFromCart);

export default cartRouter;