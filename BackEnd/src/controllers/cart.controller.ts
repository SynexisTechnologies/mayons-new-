  import { Request, Response, NextFunction } from "express";

import { Types } from "mongoose";
import CartModel, { ICartItem } from "../models/CartModel";





// Helper function to calculate total price
const calculateTotalPrice = (items: ICartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};



// GET user's active cart
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // support route param named either `userId` or `userEmail`
    const rawId = req.params.userId ?? req.params.userEmail;
    const userId = Array.isArray(rawId) ? rawId[0] : rawId || "";

    // support both ObjectId user id and email as identifier
    let cart;
    if (Types.ObjectId.isValid(String(userId))) {
      cart = await CartModel.findOne({ user: userId, status: "ACTIVE" }).populate("items.product items.variant");
    } else {
      cart = await CartModel.findOne({ userEmail: userId, status: "ACTIVE" }).populate("items.product items.variant");
    }

    // Auto-create empty cart if none exists, only when a valid identifier is provided
    if (!cart) {
      if (!userId) {
        // no identifier provided - return empty cart representation without creating DB doc
        return res.status(200).json({ success: true, data: { items: [], totalPrice: 0, status: "ACTIVE" } });
      }

      const newCartData: any = { items: [], totalPrice: 0, status: "ACTIVE" };
      if (Types.ObjectId.isValid(String(userId))) newCartData.user = userId;
      else newCartData.userEmail = userId;

      cart = new CartModel(newCartData);
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};


// ADD item to cart
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const userEmail = req.body.userEmail;
    const userName = req.body.userName;
    const { product, variant, quantity, price } = req.body;
    if (!userId && !userEmail) {
      return res.status(400).json({ success: false, message: "User identifier (userId or userEmail) is required" });
    }
    // find active cart by user id or email
    let cart;
    if (userId && Types.ObjectId.isValid(String(userId))) {
      cart = await CartModel.findOne({ user: userId, status: "ACTIVE" });
    } else if (userEmail) {
      cart = await CartModel.findOne({ userEmail: userEmail, status: "ACTIVE" });
    }

    const newItem: ICartItem = { product, variant, quantity, price };

    if (!cart) {
      // create new cart
      const cartData: any = {
        items: [newItem],
        totalPrice: price * quantity,
      };
      if (userId && Types.ObjectId.isValid(String(userId))) cartData.user = userId;
      if (userEmail) cartData.userEmail = userEmail;
      if (userName) cartData.userName = userName;
      cart = new CartModel(cartData);
    } else {
      // check if item already exists (same product + variant)
      const itemIndex = cart.items.findIndex((i: any) => {
        const existingProd = typeof i.product === "object" && i.product?._id ? i.product._id.toString() : String(i.product);
        const incomingProd = typeof product === "object" && product?._id ? product._id.toString() : String(product);
        const variantMatch = (i.variant && variant && i.variant.toString() === variant) || (!i.variant && !variant);
        return existingProd === incomingProd && variantMatch;
      });

      if (itemIndex > -1) {
        // merge quantity
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = price; // update price in case it changed
      } else {
        cart.items.push(newItem);
      }

      // update stored user email/name if provided
      if (userEmail) cart.userEmail = userEmail;
      if (userName) cart.userName = userName;

      cart.totalPrice = calculateTotalPrice(cart.items);
    }

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// UPDATE item quantites
export const updateItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // accept either `userId` or `userEmail` in route params
    const rawUserId = req.params.userId ?? req.params.userEmail;
    const rawItemId = req.params.itemId ?? req.params.itemId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId || "";
    const itemId = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId || "";
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

    // find by user id or email
    let cart;
    if (Types.ObjectId.isValid(String(userId))) {
      cart = await CartModel.findOne({ user: userId, status: "ACTIVE" });
    } else {
      cart = await CartModel.findOne({ userEmail: userId, status: "ACTIVE" });
    }
    if (!cart) return res.status(404).json({ success: false, message: "Active cart not found" });

    const item = cart.items.find(i => i._id?.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};



// REMOVE item from cart
export const removeItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawUserId = req.params.userId ?? req.params.userEmail;
    const rawItemId = req.params.itemId ?? req.params.itemId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId || "";
    const itemId = Array.isArray(rawItemId) ? rawItemId[0] : rawItemId || "";

    let cart;
    if (Types.ObjectId.isValid(String(userId))) {
      cart = await CartModel.findOne({ user: userId, status: "ACTIVE" });
    } else {
      cart = await CartModel.findOne({ userEmail: userId, status: "ACTIVE" });
    }
    if (!cart) return res.status(404).json({ success: false, message: "Active cart not found" });

    const itemIdx = cart.items.findIndex(i => i._id?.toString() === itemId);
    if (itemIdx === -1) return res.status(404).json({ success: false, message: "Item not found in cart" });

    cart.items.splice(itemIdx, 1);
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};



// CHECKOUT cart
 const checkoutCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawUserId = req.params.userId ?? req.params.userEmail;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId || "";

    let cart;
    if (Types.ObjectId.isValid(userId)) {
      cart = await CartModel.findOne({ user: userId, status: "ACTIVE" });
    } else {
      cart = await CartModel.findOne({ userEmail: userId, status: "ACTIVE" });
    }
    if (!cart) return res.status(404).json({ success: false, message: "Active cart not found" });

    cart.status = "CHECKED_OUT";
    await cart.save();

    res.status(200).json({ success: true, message: "Cart checked out successfully", data: cart });
  } catch (error) {
    next(error);
  }
};
