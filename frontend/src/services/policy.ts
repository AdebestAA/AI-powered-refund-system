import api from "@/lib/api";
import type { Policy, typeResponse } from "@/utils/types";

const get = async () => {
  const response = await api.get<typeResponse<Policy>>("/policy");
  return response.data;
};

export const policyService = {
  get,
};
