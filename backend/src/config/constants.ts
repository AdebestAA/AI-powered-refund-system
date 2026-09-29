import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const PORT = Number(process.env.PORT ?? 4000);
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5179";

export const DB_URI = process.env.DB_URI ?? "";
export const DB_SSL = process.env.DB_SSL === "true";
export const DB_POOL_MAX = Number(process.env.DB_POOL_MAX ?? 10);

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me";
export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? "15m";
export const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7);
export const REFRESH_COOKIE = "resolve_rt";
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const AUTH_RATE_LIMIT = Number(process.env.AUTH_RATE_LIMIT ?? 30);

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? "dev-encryption-key-change-me";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
export const GEMINI_API_URL = process.env.GEMINI_API_URL ?? "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest";
export const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 20000);

export const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
export const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "aadebesta@gmail.com";
export const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME ?? "Resolve Support";

if (!DB_URI) throw new Error("DB_URI is missing from .env");
if (IS_PRODUCTION && (!process.env.JWT_ACCESS_SECRET || !process.env.ENCRYPTION_KEY)) {
  throw new Error("JWT_ACCESS_SECRET and ENCRYPTION_KEY must be set in production");
}
