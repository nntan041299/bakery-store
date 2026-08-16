import { request, storeCategoriesEndpoint, storeCategoryByIdEndpoint } from "@/rest";

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export const listCategories = async (storeId: number) => {
  return request.get({ path: storeCategoriesEndpoint(storeId) });
};

export const createCategory = async (storeId: number, name: string) => {
  return request.post({ path: storeCategoriesEndpoint(storeId), body: { name } });
};

export const updateCategory = async (
  storeId: number,
  id: number,
  name: string,
) => {
  return request.put({
    path: storeCategoryByIdEndpoint(storeId, id),
    body: { name },
  });
};

export const deleteCategory = async (storeId: number, id: number) => {
  return request.delete({ path: storeCategoryByIdEndpoint(storeId, id) });
};
