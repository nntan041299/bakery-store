import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { useSelectedStore } from "@/context/SelectedStoreProvider";
import { getProduct, Product } from "@/service/product";

export const useProduct = (id?: string) => {
  const { selectedStoreId } = useSelectedStore();

  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(selectedStoreId, id),
    queryFn: async () => {
      const res = await getProduct(selectedStoreId!, id!);
      return res.data.data as Product;
    },
    enabled: selectedStoreId !== null && Boolean(id),
  });
};
