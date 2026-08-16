import { request, ENDPOINT } from "@/rest";

export interface Category {
  id: number;
  name: string;
}

export const listCategories = async () => {
  return request.get({ path: ENDPOINT.CATEGORIES });
};

export const createCategory = async (name: string) => {
  return request.post({ path: ENDPOINT.CATEGORIES, body: { name } });
};
