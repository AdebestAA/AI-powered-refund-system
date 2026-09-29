import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminService } from "@/services/admin";
import { handleError } from "@/utils/error-handler";
import type { AdminRefundDetail, typeResponse } from "@/utils/types";

const useReviewRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.review,
    onSuccess: (response: typeResponse<AdminRefundDetail>) => {
      if (response.status == "ok") {
        toast.success(`Request ${response.data.status}`);
        queryClient.setQueryData(["admin", "refund", response.data.id], response);
        queryClient.invalidateQueries({ queryKey: ["admin"] });
      } else {
        toast.error("sorry, something went wrong");
      }
    },
    onError: handleError,
  });
};

export default useReviewRefund;
