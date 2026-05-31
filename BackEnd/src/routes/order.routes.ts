import { Router } from "express";
import { getUserOrders, getOrderById, cancelOrder, checkoutCart, getSummary, getAllOrdersAdmin, updateOrderStatus} from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/authenticateToken";
import { isAdmin } from "../middlewares/isAdmin";

const orderRouter = Router();

orderRouter.post("/checkout", authenticateToken, checkoutCart);
orderRouter.get("/user", authenticateToken, getUserOrders);
orderRouter.get("/summary", getSummary);
// Admin routes must come before dynamic `/:id` to avoid route parameter collisions
orderRouter.get("/admin", authenticateToken, isAdmin, getAllOrdersAdmin);
orderRouter.put("/admin/:id/status", authenticateToken, isAdmin, updateOrderStatus);
orderRouter.get("/:id", authenticateToken, getOrderById);
orderRouter.put("/cancel/:id", authenticateToken, cancelOrder);

export default orderRouter;