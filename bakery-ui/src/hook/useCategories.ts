import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { useSelectedStore } from "@/context/SelectedStoreProvider";
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
  const { selectedStoreId } = useSelectedStore();

  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES(selectedStoreId),
    queryFn: async () => {
      const res = await listCategories(selectedStoreId!);
      return res.data.data as Category[];
    },
    enabled: selectedStoreId !== null,
  });
};

export const useCreateCategory = () => {
  const { selectedStoreId } = useSelectedStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCategory(selectedStoreId!, name),
    onSuccess: (res) => {
      const created = res.data.data as Category;
      queryClient.setQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES(selectedStoreId),
        (old = []) => sortByName([...old, created]),
      );
    },
  });
};

export const useUpdateCategory = () => {
  const { selectedStoreId } = useSelectedStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCategory(selectedStoreId!, id, name),
    onSuccess: (res) => {
      const updated = res.data.data as Category;
      queryClient.setQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES(selectedStoreId),
        (old = []) => sortByName(old.map((c) => (c.id === updated.id ? updated : c))),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteCategory = () => {
  const { selectedStoreId } = useSelectedStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(selectedStoreId!, id),
    onSuccess: (_res, id) => {
      queryClient.setQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES(selectedStoreId),
        (old = []) => old.filter((c) => c.id !== id),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useBulkDeleteCategories = () => {
  const { selectedStoreId } = useSelectedStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => deleteCategory(selectedStoreId!, id)));
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.setQueryData<Category[]>(
        QUERY_KEYS.CATEGORIES(selectedStoreId),
        (old = []) => old.filter((c) => !ids.includes(c.id)),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
