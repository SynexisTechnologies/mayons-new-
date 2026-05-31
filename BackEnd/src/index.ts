import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/mongo";
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { seedStatus } from "./util/StatusInitializer";
import { seedAdmin } from "./util/seedAdmin";


import CartModel from "./models/CartModel";
import "./models/VarientModel";
import "./models/ProductModel";
import eventRoutes from "./routes/event.routes";
import resturentRouter from "./routes/resturent.routes";
import offerRoutes from "./routes/OffersRoute";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,PUT,PATCH,DELETE,POST,HEAD",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api", rootRouter); // rootRouter should include productRouter
app.use("/api/events", eventRoutes);
app.use("/api/eats", resturentRouter);
app.use("/api/offers", offerRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
      // Only attempt DB-dependent initialization if mongoose is connected
      const mongooseModule = await import("mongoose");
      // `import()` returns a module namespace; the default export may be under `.default`
      const mongoose = (mongooseModule as any).default || mongooseModule;
      if (mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
        await seedStatus();
        await seedAdmin();

        // Ensure cart user unique index does not conflict with null entries
        try {
          const coll = CartModel.collection;
          try {
            await coll.dropIndex("user_1");
          } catch (e) {
            /* ignore if not exists */
          }
          await coll.createIndex({ user: 1 }, { unique: true, partialFilterExpression: { user: { $exists: true }, status: "ACTIVE" } });
          console.log("✅ Cart user index ensured");
        } catch (e) {
          console.error("Failed to ensure cart index", e);
        }
      } else {
        console.warn("MongoDB not connected — skipping DB initialization");
      }
    } catch (e) {
      console.warn("DB initialization skipped:", (e as Error).message || e);
    }
  });
};

// Attempt to connect to DB but start server even if DB connection fails after retries
connectDB()
  .then(() => startServer())
  .catch((err) => {
    console.warn("Could not connect to MongoDB:", err.message || err);
    // Start server regardless so frontend dev work can continue
    startServer();
  });
