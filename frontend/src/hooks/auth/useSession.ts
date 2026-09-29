import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import type { User } from "@/utils/types";

const useSession = () => {
  const query = useQuery<User | null>({
    queryKey: ["session"],
    queryFn: async () => {
      if (!localStorage.getItem("token")) return null;
      const response = await authService.me();
      return response.data;
    },
    staleTime: Infinity,
    retry: false,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    isAuthenticated: Boolean(query.data),
    isAdmin: query.data?.role === "admin",
  };
};

export default useSession;
