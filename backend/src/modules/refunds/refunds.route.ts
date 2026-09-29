import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth";
import { refundLimiter } from "../../common/middlewares/rate-limit";
import { validate } from "../../common/middlewares/validate";
import { refundsController } from "./refunds.controller";
import { createRefundSchema } from "./refunds.schema";

export const refundsRoutes = Router();

refundsRoutes.post("/", authenticate, refundLimiter, validate({ body: createRefundSchema }), refundsController.submitRefund);
refundsRoutes.get("/", authenticate, refundsController.listMyRefunds);
