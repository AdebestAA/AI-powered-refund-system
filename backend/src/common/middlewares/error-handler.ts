import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/app-error";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
