import { Router } from "express";
import userRouter from "./user.routes";
import productRouter from "./product.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";

import contactRouter from "./contact.routes";
import addressRouter from "./address.routes";
import categoryRouter from "./category.routes";
import subcatRouter from "./subcategory.routes";
import eventRoutes from "./event.routes";
import resturentRouter from "./resturent.routes";

const rootRouter = Router();

rootRouter.use("/auth", userRouter);
rootRouter.use("/product", productRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/address", addressRouter);
rootRouter.use("/category", categoryRouter); 
rootRouter.use("/subCategory",subcatRouter);
// use plural '/orders' to match frontend API paths
rootRouter.use("/orders", orderRouter);
rootRouter.use("/events", eventRoutes);
rootRouter.use("/restaurant", resturentRouter);
rootRouter.use("/contact",contactRouter)

export default rootRouter;