import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  Category,
} from "@/service/category";

const sortByName = (categories: Category[]): Category[] =>
  [...categories].sort((a, b) => a.name.localeCompare(b.name));

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
        sortByName([...old, created]),
      );
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategory(id, name),
    onSuccess: (res) => {
      const updated = res.data.data as Category;
      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old = []) =>
        sortByName(old.map((c) => (c.id === updated.id ? updated : c))),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_res, id) => {
      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old = []) =>
        old.filter((c) => c.id !== id),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => deleteCategory(id)));
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.setQueryData<Category[]>(QUERY_KEYS.CATEGORIES, (old = []) =>
        old.filter((c) => !ids.includes(c.id)),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
