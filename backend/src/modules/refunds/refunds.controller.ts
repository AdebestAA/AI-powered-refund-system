import { Request, Response } from "express";
import { sendOk } from "../../common/utils/response";
import { refundsService } from "./refunds.service";

const submitRefund = async (req: Request, res: Response) => {
  sendOk(res, await refundsService.submitRefund(req.user!.id, req.body), undefined, 201);
};

const listMyRefunds = async (req: Request, res: Response) => {
  sendOk(res, await refundsService.listMyRefunds(req.user!.id));
};

export const refundsController = {
  submitRefund,
  listMyRefunds,
};
