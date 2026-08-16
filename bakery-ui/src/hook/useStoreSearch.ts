import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { searchStores, StorePage } from "@/service/store";

interface UseStoreSearchParams {
  page: number;
  size: number;
  search: string;
}

export const useStoreSearch = ({ page, size, search }: UseStoreSearchParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.STORES({ page, search }),
    queryFn: async () => {
      const res = await searchStores({ page, size, search: search || undefined });
      return res.data.data as StorePage;
    },
    enabled: search.trim().length > 0,
  });
};
