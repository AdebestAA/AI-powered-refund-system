import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { handleError } from "@/utils/error-handler";
import type { typeResponse } from "@/utils/types";

const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (response: typeResponse<{ email: string }>) => {
      if (response.status == "ok") {
        toast.success(response.message ?? "Check your inbox for a 6-digit code");
        navigate(`/verify-email?email=${encodeURIComponent(response.data.email)}`, { replace: true });
      } else {
        toast.error("sorry, something went wrong");
      }
    },
    onError: handleError,
  });
};

export default useSignUp;
