import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { useSelectedStore } from "@/context/SelectedStoreProvider";
import { listProducts, ProductPage } from "@/service/product";

interface UseProductsParams {
  page: number;
  size: number;
  search?: string;
  active?: boolean;
  categoryId?: number;
  sortField: string;
  sortDir: string;
}

export const useProducts = ({
  page,
  size,
  search,
  active,
  categoryId,
  sortField,
  sortDir,
}: UseProductsParams) => {
  const { selectedStoreId } = useSelectedStore();

  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS(selectedStoreId, {
      page,
      search: search ?? "",
      activeFilter: String(active),
      categoryId,
      sortField,
      sortDir,
    }),
    queryFn: async () => {
      const res = await listProducts(selectedStoreId!, {
        page,
        size,
        search,
        active,
        categoryId,
        sort: `${sortField},${sortDir}`,
      });
      return res.data.data as ProductPage;
    },
    enabled: selectedStoreId !== null,
  });
};
