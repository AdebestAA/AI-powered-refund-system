import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { AUTH_RATE_LIMIT } from "../../config/constants";

const message = (msg: string) => ({ success: false, message: msg });

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: AUTH_RATE_LIMIT,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Too many attempts. Please try again in a few minutes."),
});

export const refundLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? "", 56),
  message: message(
    "You're sending requests too quickly. Please wait a moment.",
  ),
});
