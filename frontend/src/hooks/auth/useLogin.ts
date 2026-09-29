import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "@/services/auth";
import { handleError } from "@/utils/error-handler";
import type { Session, typeResponse } from "@/utils/types";
import useStoreSession from "./useStoreSession";

const useLogin = () => {
  const navigate = useNavigate();
  const storeSession = useStoreSession();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response: typeResponse<Session>) => {
      if (response.status == "ok") {
        storeSession(response.data);
        toast.success(`Welcome back, ${response.data.user.name.split(" ")[0]}`);
        navigate(response.data.user.role === "admin" ? "/admin" : "/support", { replace: true });
      } else {
        toast.error("sorry, something went wrong");
      }
    },
    onError: handleError,
  });
};

export default useLogin;
