import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { createStore, listMyStores, Store } from "@/service/store";

export const useMyStores = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MY_STORES,
    queryFn: async () => {
      const res = await listMyStores();
      return res.data.data as Store[];
    },
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createStore(name),
    onSuccess: (res) => {
      const created = res.data.data as Store;
      queryClient.setQueryData<Store[]>(QUERY_KEYS.MY_STORES, (old = []) => [
        ...old,
        created,
      ]);
    },
  });
};
