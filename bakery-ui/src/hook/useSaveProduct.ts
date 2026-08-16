import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { PRODUCT_FORM_TEXT } from "@/constant/products";
import { useSelectedStore } from "@/context/SelectedStoreProvider";
import { createProduct, updateProduct, ProductFormPayload } from "@/service/product";

export const useSaveProduct = (id?: string) => {
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedStoreId } = useSelectedStore();

  const mutation = useMutation({
    mutationFn: (payload: ProductFormPayload) =>
      isEdit
        ? updateProduct(selectedStoreId!, id!, payload)
        : createProduct(selectedStoreId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES(selectedStoreId),
      });
      if (id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PRODUCT(selectedStoreId, id),
        });
      }
      navigate("/products");
    },
  });

  const getErrorMessage = (err: unknown): string =>
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? PRODUCT_FORM_TEXT.DEFAULT_SAVE_ERROR;

  return { ...mutation, getErrorMessage };
};
