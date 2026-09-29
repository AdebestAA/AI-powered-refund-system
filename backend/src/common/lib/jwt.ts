import jwt, { SignOptions } from "jsonwebtoken";
import { ACCESS_TOKEN_TTL, JWT_ACCESS_SECRET } from "../../config/constants";

export type UserRole = "customer" | "admin";

export type AccessTokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
    issuer: "resolve-api",
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, JWT_ACCESS_SECRET, { issuer: "resolve-api" }) as AccessTokenPayload;
