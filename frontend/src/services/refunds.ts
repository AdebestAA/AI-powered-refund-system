import api from "@/lib/api";
import type { CreateRefundPayload, RefundRequest, typeResponse } from "@/utils/types";

const create = async (payload: CreateRefundPayload) => {
  const response = await api.post<typeResponse<RefundRequest>>("/refunds", payload);
  return response.data;
};

const listMine = async () => {
  const response = await api.get<typeResponse<RefundRequest[]>>("/refunds");
  return response.data;
};

export const refundsService = {
  create,
  listMine,
};
