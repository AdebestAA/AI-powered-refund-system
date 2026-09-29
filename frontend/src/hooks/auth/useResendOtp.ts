import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { handleError } from "@/utils/error-handler";
import type { typeResponse } from "@/utils/types";

const useResendOtp = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: (response: typeResponse<null>) => {
      if (response.status == "ok") {
        toast.success(response.message ?? "A new code is on its way");
      } else {
        toast.error("sorry, something went wrong");
      }
    },
    onError: handleError,
  });
};

export default useResendOtp;
