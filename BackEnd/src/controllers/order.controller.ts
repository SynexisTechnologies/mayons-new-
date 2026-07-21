import { Request, Response, NextFunction } from "express";
import OrderModel from "../models/OrderModel";
import DelivaryModel from "../models/DelivaryModel";
import CartModel from "../models/CartModel";
import ProductModel from "../models/ProductModel";

export const checkoutCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { addressId, paymentMethod, deliveryType, expectedDate, recipient, deliveryFee } = req.body;

    if (!addressId) return res.status(400).json({ success: false, message: "Address is required" });
    if (!recipient?.name || !recipient?.phone) {
      return res.status(400).json({ success: false, message: "Recipient name and phone are required" });
    }

    // Try to find cart by user ObjectId first; if not found, fall back to userEmail (for carts created when client sent email only)
    let cart = await CartModel.findOne({ user: userId, status: "ACTIVE" }).populate("items.product items.variant");
    if (!cart) {
      // fetch user's email and attempt lookup by email
      try {
        const user = await (await import("../models/userModel")).userModel.findById(userId);
        if (user && user.email) {
          cart = await CartModel.findOne({ userEmail: user.email, status: "ACTIVE" }).populate("items.product items.variant");
        }
      } catch (e) {
        // ignore and proceed; cart may remain null
      }
    }
    if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });

    // Check & update stock
    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      if (product.isSoldOut) return res.status(400).json({ success: false, message: `${product.nameEn} is sold out` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `${product.nameEn} does not have enough stock` });

      product.stock -= item.quantity;
      // increment sold counter
      // @ts-ignore - `sold` field added dynamically to schema
      product.sold = (product.sold || 0) + item.quantity;
      if (product.stock < 1) product.isActive = false;
      await product.save();
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const fee = Number(deliveryFee) || 0;
    // totalPrice is what the customer is actually charged — goods plus delivery
    const totalPrice = subtotal + fee;

    // create order
   const order = await OrderModel.create({
      user: userId,
      items: cart.items.map(i => ({
        product: i.product?._id || i.product,
        productName: (i.product && (i.product.nameEn || (i.product as any).name)) || "",
        variant: i.variant?._id || i.variant,
        variantName: ((i.variant as any)?.name) || ((i.variant as any)?.variantName) || "",
        quantity: i.quantity,
        price: i.price,
      })),
      totalPrice,
      deliveryFee: fee,
      address: addressId,
      recipient,
      paymentMethod,
    });

 // create delivery
    const delivery = await DelivaryModel.create({
      order: order._id,
      type: deliveryType,
      address: deliveryType === "HOME_DELIVERY" ? addressId : undefined,
      expectedDate,
    });

    order.delivery = delivery._id;
    await order.save();

    cart.status = "CHECKED_OUT";
    await cart.save();

    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Checkout failed" });
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderModel.find({ user: req.user!.id })
      .populate("delivery")
      .populate("items.product");

    const normalized = orders.map((o: any) => ({
      ...o.toObject(),
      items: (o.items || []).map((it: any) => ({
        product: it.product,
        productName: it.productName || (it.product && (it.product.nameEn || it.product.name)) || "",
        variant: it.variant,
        variantName: it.variantName || "",
        quantity: it.quantity,
        price: it.price,
      })),
    }));

    res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};



export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      user: req.user!.id
    })
      .populate("delivery")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const normalized = {
      ...order.toObject(),
      items: (order.items || []).map((it: any) => ({
        product: it.product,
        productName: it.productName || (it.product && (it.product.nameEn || it.product.name)) || "",
        variant: it.variant,
        variantName: it.variantName || "",
        quantity: it.quantity,
        price: it.price,
      })),
    };

    res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};



export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
      user: req.user!.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = "CANCELLED";
    await order.save();

    await DelivaryModel.findOneAndUpdate(
      { order: order._id },
      { status: "CANCELLED" }
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // support query params: ?date=YYYY-MM-DD or ?start=YYYY-MM-DD&end=YYYY-MM-DD
    const { date, start, end } = req.query as { date?: string; start?: string; end?: string };

    const parseDate = (d: string) => {
      const parts = d.split("-");
      if (parts.length !== 3) return null;
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const dt = new Date(y, m, day);
      dt.setHours(0, 0, 0, 0);
      return dt;
    };

    if (date || (start && end)) {
      let rangeStart: Date | null = null;
      let rangeEnd: Date | null = null;

      if (date) {
        rangeStart = parseDate(date);
        if (!rangeStart) return res.status(400).json({ message: "Invalid date" });
        rangeEnd = new Date(rangeStart);
        rangeEnd.setDate(rangeEnd.getDate() + 1);
      } else {
        rangeStart = parseDate(start!);
        rangeEnd = parseDate(end!);
        if (!rangeStart || !rangeEnd) return res.status(400).json({ message: "Invalid start/end" });
        rangeEnd.setDate(rangeEnd.getDate() + 1);
      }

      const orders = await OrderModel.find({ createdAt: { $gte: rangeStart, $lt: rangeEnd } });
      const itemsSold = orders.reduce((s, o: any) => s + (o.items?.reduce((a: number, it: any) => a + (it.quantity || 0), 0) || 0), 0);
      const income = orders.reduce((s, o: any) => s + (o.totalPrice || 0), 0);

      return res.json({
        products: await ProductModel.countDocuments(),
        itemsSold,
        income,
        totalOrders: orders.length,
        from: rangeStart.toISOString(),
        to: rangeEnd.toISOString(),
      });
    }

    const totalProducts = await ProductModel.countDocuments();

    const soldOut = await ProductModel.countDocuments({
      $or: [{ isSoldOut: true }, { stock: { $lt: 1 } }],
    });

    const soldPercentage =
      totalProducts === 0
        ? 0
        : Math.round((soldOut / totalProducts) * 100);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // compute date ranges
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - 1);

    const yearStart = new Date(today);
    yearStart.setFullYear(today.getFullYear() - 1);

    // fetch orders for ranges
    const [todayOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
      OrderModel.find({ createdAt: { $gte: today } }),
      OrderModel.find({ createdAt: { $gte: weekStart } }),
      OrderModel.find({ createdAt: { $gte: monthStart } }),
      OrderModel.find({ createdAt: { $gte: yearStart } }),
    ]);

    const sumIncome = (orders: typeof todayOrders) => orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const sumItems = (orders: typeof todayOrders) => orders.reduce((s, o) => s + (o.items?.reduce((a: number, it: any) => a + (it.quantity || 0), 0) || 0), 0);

    const todayIncome = sumIncome(todayOrders);
    const daily = todayIncome;
    const weekly = sumIncome(weeklyOrders);
    const monthly = sumIncome(monthlyOrders);
    const yearly = sumIncome(yearlyOrders);

    const itemsSold = sumItems(todayOrders);

    res.json({
      products: totalProducts,
      soldPercentage,
      itemsSold,
      todayIncome,
      daily,
      weekly,
      monthly,
      yearly,
    });

  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.find()
      .populate("user", "firstName lastName email mobile role")
      .populate("delivery")
      .sort({ createdAt: -1 });

    // Normalize user fields for frontend compatibility (user.name, user.phone)
    const normalized = orders.map((o: any) => {
      const user = o.user
        ? {
            _id: o.user._id,
            name: `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim(),
            email: o.user.email,
            phone: o.user.mobile,
            role: o.user.role,
          }
        : null;

      // ensure items include productName when present in schema
      const items = (o.items || []).map((it: any) => ({
        product: it.product,
        productName: it.productName || (it.product && it.product.nameEn) || "",
        variant: it.variant,
        variantName: it.variantName || "",
        quantity: it.quantity,
        price: it.price,
      }));

      return {
        ...o.toObject(),
        user,
        items,
      };
    });

    res.status(200).json({ success: true, data: normalized });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      data: updatedOrder,
    });

  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
