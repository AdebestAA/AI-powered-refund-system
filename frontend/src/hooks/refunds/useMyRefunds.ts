import { useQuery } from "@tanstack/react-query";
import { refundsService } from "@/services/refunds";
import type { RefundRequest, typeResponse } from "@/utils/types";

const useMyRefunds = () => {
  return useQuery<typeResponse<RefundRequest[]> | null>({
    queryKey: ["my-refunds"],
    queryFn: refundsService.listMine,
  });
};

export default useMyRefunds;
