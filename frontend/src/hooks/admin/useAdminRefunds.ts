import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminService, type AdminRefundFilters } from "@/services/admin";
import type { AdminRefundListItem, typeResponse } from "@/utils/types";

const useAdminRefunds = (filters: AdminRefundFilters) => {
  return useQuery<typeResponse<AdminRefundListItem[]> | null>({
    queryKey: ["admin", "refunds", filters],
    queryFn: () => adminService.listRefunds(filters),
    placeholderData: keepPreviousData,
  });
};

export default useAdminRefunds;
