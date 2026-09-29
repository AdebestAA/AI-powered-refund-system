import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config/constants";
import { pool } from "./config/db";
import { sendOk } from "./common/utils/response";
import { globalErrorHandler, notFoundHandler } from "./common/middlewares/error-handler";
import { authRoutes } from "./modules/auth/auth.route";
import { ordersRoutes } from "./modules/orders/orders.route";
import { refundsRoutes } from "./modules/refunds/refunds.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { policyRoutes } from "./modules/policy/policy.route";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: "50kb" }));
  app.use(cookieParser());

  app.get("/api/health", async (_req, res) => {
    await pool.query("SELECT 1");
    sendOk(res, null, "ok");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/refunds", refundsRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/policy", policyRoutes);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
