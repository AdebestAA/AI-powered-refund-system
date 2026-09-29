import { useQuery } from "@tanstack/react-query";
import { policyService } from "@/services/policy";
import type { Policy, typeResponse } from "@/utils/types";

const usePolicy = () => {
  return useQuery<typeResponse<Policy> | null>({
    queryKey: ["policy"],
    queryFn: policyService.get,
    staleTime: 1000 * 60 * 60,
  });
};

export default usePolicy;
