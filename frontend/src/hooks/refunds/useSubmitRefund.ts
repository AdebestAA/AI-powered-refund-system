import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { refundsService } from "@/services/refunds";
import { handleError } from "@/utils/error-handler";
import type { RefundRequest, typeResponse } from "@/utils/types";

const useSubmitRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundsService.create,
    onSuccess: (response: typeResponse<RefundRequest>) => {
      if (response.status == "ok") {
        queryClient.invalidateQueries({ queryKey: ["my-refunds"] });
        queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        queryClient.invalidateQueries({ queryKey: ["admin"] });
      } else {
        toast.error("sorry, something went wrong");
      }
    },
    onError: handleError,
  });
};

export default useSubmitRefund;
