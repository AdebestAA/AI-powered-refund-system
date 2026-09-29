import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin";
import type { AdminStats, typeResponse } from "@/utils/types";

const useAdminStats = () => {
  return useQuery<typeResponse<AdminStats> | null>({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getStats,
    refetchInterval: 30_000,
  });
};

export default useAdminStats;
