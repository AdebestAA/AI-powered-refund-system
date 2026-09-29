import { Response } from "express";

export const sendOk = (res: Response, data: unknown, message?: string, statusCode = 200) =>
  res.status(statusCode).json({ status: "ok", message, data });
