import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@/utils/types";

const useStoreSession = () => {
  const queryClient = useQueryClient();

  return (session: Session) => {
    localStorage.setItem("token", session.accessToken);
    queryClient.setQueryData(["session"], session.user);
  };
};

export default useStoreSession;
