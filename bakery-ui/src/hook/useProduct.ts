import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { getProduct, Product } from "@/service/product";

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: async () => {
      const res = await getProduct(id!);
      return res.data.data as Product;
    },
    enabled: Boolean(id),
  });
};
