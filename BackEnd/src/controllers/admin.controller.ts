import { Request, Response, NextFunction } from "express";
import OrderModel from "../models/OrderModel";
import ProductModel from "../models/ProductModel";

export const getAdminSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const monthStart = new Date(today);
    monthStart.setMonth(today.getMonth() - 1);

    const yearStart = new Date(today);
    yearStart.setFullYear(today.getFullYear() - 1);

    const totalProducts = await ProductModel.countDocuments();

    const [todayOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
      OrderModel.find({ createdAt: { $gte: today } }),
      OrderModel.find({ createdAt: { $gte: weekStart } }),
      OrderModel.find({ createdAt: { $gte: monthStart } }),
      OrderModel.find({ createdAt: { $gte: yearStart } }),
    ]);

    const calcIncome = (orders: any[]) => orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const todayIncome = calcIncome(todayOrders);
    const daily = todayIncome;
    const weekly = calcIncome(weeklyOrders);
    const monthly = calcIncome(monthlyOrders);
    const yearly = calcIncome(yearlyOrders);

    const itemsSold = todayOrders.reduce(
      (sum, o: any) =>
        sum + (o.items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0),
      0
    );

    const soldPercentage = 0; // you can calculate if needed

    res.json({
      products: totalProducts,
      itemsSold,
      todayIncome,
      daily,
      weekly,
      monthly,
      yearly,
      soldPercentage,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching summary" });
  }
};