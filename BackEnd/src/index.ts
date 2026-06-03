import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/mongo";
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { seedStatus } from "./util/StatusInitializer";
import { seedAdmin } from "./util/seedAdmin";
import { seedCategories } from "./util/seedCategories";

import CartModel from "./models/CartModel";
import "./models/VarientModel";
import "./models/ProductModel";

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
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// All routes go through rootRouter
app.use("/api", rootRouter);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const runDbInitialization = async () => {
  try {
    await seedStatus();
    await seedAdmin();
    await seedCategories();

    // Ensure cart user unique index does not conflict with null entries
    try {
      const coll = CartModel.collection;
      try {
        await coll.dropIndex("user_1");
      } catch (e) {
        /* ignore if not exists */
      }
      await coll.createIndex(
        { user: 1 },
        {
          unique: true,
          partialFilterExpression: {
            user: { $exists: true },
            status: "ACTIVE",
          },
        },
      );
      console.log("✅ Cart user index ensured");
    } catch (e) {
      console.error("Failed to ensure cart index", e);
    }
  } catch (e) {
    console.warn("DB initialization skipped:", (e as Error).message || e);
  }
};

// Start listening immediately so the reverse proxy always has an upstream —
// a slow or failing DB connection must never make the server unreachable (502).
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect to the DB in the background; run seed/initialization once connected.
connectDB()
  .then(() => runDbInitialization())
  .catch((err) => {
    console.warn("Could not connect to MongoDB:", err.message || err);
  });

// Don't let an unhandled DB/network rejection take the whole process down
// (pm2 would restart it and reopen the 502 window on every blip).
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
