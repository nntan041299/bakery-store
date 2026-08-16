import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { createCategory, listCategories, Category } from "@/service/category";

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: async () => {
      const res = await listCategories();
      return res.data.data as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: (res) => {
      const created = res.data.data as Category;
      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old = []) =>
        [...old, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
    },
  });
};
