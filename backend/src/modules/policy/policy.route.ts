import { Request, Response, Router } from "express";
import { sendOk } from "../../common/utils/response";
import { POLICY_DOCUMENT } from "./policy";

export const policyRoutes = Router();

policyRoutes.get("/", (_req: Request, res: Response) => {
  sendOk(res, POLICY_DOCUMENT);
});
