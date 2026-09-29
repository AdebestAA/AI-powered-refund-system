import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/app-error";
import { UserRole, verifyAccessToken } from "../lib/jwt";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(createError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(header.split(" ")[1]);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(createError(401, "Access token expired or invalid"));
  }
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(createError(401, "Authentication required"));
    if (!roles.includes(req.user.role))
      return next(createError(403, "You don't have access to this resource"));
    next();
  };
