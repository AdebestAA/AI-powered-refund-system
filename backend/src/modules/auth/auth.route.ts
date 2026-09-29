import { Router } from "express";
import { validate } from "../../common/middlewares/validate";
import { authenticate } from "../../common/middlewares/auth";
import { authLimiter } from "../../common/middlewares/rate-limit";
import { authController } from "./auth.controller";
import { loginSchema, resendOtpSchema, signupSchema, verifyEmailSchema } from "./auth.schema";

export const authRoutes = Router();

authRoutes.post("/signup", authLimiter, validate({ body: signupSchema }), authController.signup);
authRoutes.post("/verify-email", authLimiter, validate({ body: verifyEmailSchema }), authController.verifyEmail);
authRoutes.post("/resend-otp", authLimiter, validate({ body: resendOtpSchema }), authController.resendOtp);
authRoutes.post("/login", authLimiter, validate({ body: loginSchema }), authController.login);
authRoutes.post("/refresh", authController.refresh);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", authenticate, authController.me);
