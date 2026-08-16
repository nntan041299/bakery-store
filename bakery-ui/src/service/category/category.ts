import { request, ENDPOINT, categoryByIdEndpoint } from "@/rest";

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export const listCategories = async () => {
  return request.get({ path: ENDPOINT.CATEGORIES });
};

export const createCategory = async (name: string) => {
  return request.post({ path: ENDPOINT.CATEGORIES, body: { name } });
};

export const updateCategory = async (id: number, name: string) => {
  return request.put({ path: categoryByIdEndpoint(id), body: { name } });
};

export const deleteCategory = async (id: number) => {
  return request.delete({ path: categoryByIdEndpoint(id) });
};
