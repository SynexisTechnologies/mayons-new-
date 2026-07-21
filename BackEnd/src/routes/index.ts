import { Router } from "express";
import userRouter from "./user.routes";
import productRouter from "./product.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";
import contactRouter from "./contact.routes";
import addressRouter from "./address.routes";
import categoryRouter from "./category.routes";
import subcatRouter from "./subcategory.routes";
import subcat1Router from "./subcategory1.routes";
import eventRoutes from "./event.routes";
import resturentRouter from "./resturent.routes";
import offerRoutes from "./OffersRoute";

const rootRouter = Router();

rootRouter.use("/auth", userRouter);
rootRouter.use("/product", productRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/address", addressRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/subCategory", subcatRouter);
rootRouter.use("/subCategory1", subcat1Router);
rootRouter.use("/orders", orderRouter);
rootRouter.use("/events", eventRoutes);
rootRouter.use("/eats", resturentRouter);
rootRouter.use("/offers", offerRoutes);
rootRouter.use("/contact", contactRouter);

export default rootRouter;
