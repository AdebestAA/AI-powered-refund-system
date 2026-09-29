import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin";
import type { AdminCustomer, typeResponse } from "@/utils/types";

const useAdminCustomers = () => {
  return useQuery<typeResponse<AdminCustomer[]> | null>({
    queryKey: ["admin", "customers"],
    queryFn: adminService.listCustomers,
  });
};

export default useAdminCustomers;
