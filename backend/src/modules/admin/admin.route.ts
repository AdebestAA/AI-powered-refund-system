import { Router } from "express";
import { authenticate, requireRole } from "../../common/middlewares/auth";
import { validate } from "../../common/middlewares/validate";
import { adminController } from "./admin.controller";
import {
  listRefundsQuery,
  refundIdParams,
  reviewRefundSchema,
} from "./admin.schema";

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireRole("admin"));
adminRoutes.get("/stats", adminController.getStats);
adminRoutes.get(
  "/refunds",
  validate({ query: listRefundsQuery }),
  adminController.listRefunds,
);
adminRoutes.get(
  "/refunds/:id",
  validate({ params: refundIdParams }),
  adminController.getRefund,
);
adminRoutes.patch(
  "/refunds/:id/review",
  validate({ params: refundIdParams, body: reviewRefundSchema }),
  adminController.reviewRefund,
);
adminRoutes.get("/customers", adminController.listCustomers);
