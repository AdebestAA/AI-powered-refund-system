import api from "@/lib/api";
import type {
  AdminCustomer,
  AdminRefundDetail,
  AdminRefundListItem,
  AdminStats,
  RefundStatus,
  typeResponse,
} from "@/utils/types";

export type AdminRefundFilters = {
  status: "all" | RefundStatus;
  search: string;
};

export type ReviewPayload = { id: string; status: "approved" | "denied"; note: string };

const getStats = async () => {
  const response = await api.get<typeResponse<AdminStats>>("/admin/stats");
  return response.data;
};

const listRefunds = async (filters: AdminRefundFilters) => {
  const response = await api.get<typeResponse<AdminRefundListItem[]>>("/admin/refunds", { params: filters });
  return response.data;
};

const getRefund = async (id: string) => {
  const response = await api.get<typeResponse<AdminRefundDetail>>(`/admin/refunds/${id}`);
  return response.data;
};

const review = async ({ id, status, note }: ReviewPayload) => {
  const response = await api.patch<typeResponse<AdminRefundDetail>>(`/admin/refunds/${id}/review`, { status, note });
  return response.data;
};

const listCustomers = async () => {
  const response = await api.get<typeResponse<AdminCustomer[]>>("/admin/customers");
  return response.data;
};

export const adminService = {
  getStats,
  listRefunds,
  getRefund,
  review,
  listCustomers,
};
