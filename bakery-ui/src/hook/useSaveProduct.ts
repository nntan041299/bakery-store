import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "@/constant/queryKeys";
import { PRODUCT_FORM_TEXT } from "@/constant/products";
import { createProduct, updateProduct, ProductFormPayload } from "@/service/product";

export const useSaveProduct = (id?: string) => {
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ProductFormPayload) =>
      isEdit ? updateProduct(id!, payload) : createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      if (id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(id) });
      }
      navigate("/products");
    },
  });

  const getErrorMessage = (err: unknown): string =>
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? PRODUCT_FORM_TEXT.DEFAULT_SAVE_ERROR;

  return { ...mutation, getErrorMessage };
};
