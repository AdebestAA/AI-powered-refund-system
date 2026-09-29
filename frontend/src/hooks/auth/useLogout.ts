import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};

export default useLogout;
