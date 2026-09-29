import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin";
import type { AdminRefundDetail, typeResponse } from "@/utils/types";

const useAdminRefund = (id: string | undefined) => {
  return useQuery<typeResponse<AdminRefundDetail> | null>({
    queryKey: ["admin", "refund", id],
    queryFn: () => adminService.getRefund(id!),
    enabled: !!id,
  });
};

export default useAdminRefund;
