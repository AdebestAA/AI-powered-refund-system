import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders";
import type { Order, typeResponse } from "@/utils/types";

const useMyOrders = () => {
  return useQuery<typeResponse<Order[]> | null>({
    queryKey: ["my-orders"],
    queryFn: ordersService.listMine,
  });
};

export default useMyOrders;
