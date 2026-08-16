import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { listTopStores, Store } from "@/service/store";

export const useTopStores = (limit: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.TOP_STORES(limit),
    queryFn: async () => {
      const res = await listTopStores(limit);
      return res.data.data as Store[];
    },
  });
};
