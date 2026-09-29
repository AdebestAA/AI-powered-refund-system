import api from "@/lib/api";
import type { Order, typeResponse } from "@/utils/types";

const listMine = async () => {
  const response = await api.get<typeResponse<Order[]>>("/orders");
  return response.data;
};

export const ordersService = {
  listMine,
};
