import { Request, Response } from "express";
import { sendOk } from "../../common/utils/response";
import { adminService } from "./admin.service";

const getStats = async (_req: Request, res: Response) => {
  sendOk(res, await adminService.getStats());
};

const listRefunds = async (_req: Request, res: Response) => {
  sendOk(res, await adminService.listRefunds(res.locals.query));
};

const getRefund = async (req: Request, res: Response) => {
  sendOk(res, await adminService.getRefund(req.params.id as string));
};

const reviewRefund = async (req: Request, res: Response) => {
  sendOk(res, await adminService.reviewRefund(req.params.id as string, req.user!.id, req.body), "Review saved");
};

const listCustomers = async (_req: Request, res: Response) => {
  sendOk(res, await adminService.listCustomers());
};

export const adminController = {
  getStats,
  listRefunds,
  getRefund,
  reviewRefund,
  listCustomers,
};
