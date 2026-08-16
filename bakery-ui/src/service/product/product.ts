import { request, ENDPOINT, productByIdEndpoint } from "@/rest";
import { Category } from "@/service/category";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  quantity: number;
  imageUrl?: string;
  active: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductPage {
  content: Product[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ProductFormPayload {
  name: string;
  description?: string;
  price: number;
  sku: string;
  quantity: number;
  imageFile?: File;
  active: boolean;
  categories: string[];
}

export interface ListProductsParams {
  search?: string;
  active?: boolean;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

const buildQuery = (params: ListProductsParams): string => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.active !== undefined) query.set("active", String(params.active));
  if (params.categoryId !== undefined)
    query.set("categoryId", String(params.categoryId));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  if (params.sort) query.set("sort", params.sort);
  const queryString = query.toString();
  return queryString
    ? `${ENDPOINT.PRODUCTS}?${queryString}`
    : ENDPOINT.PRODUCTS;
};

export const listProducts = async (params: ListProductsParams = {}) => {
  return request.get({ path: buildQuery(params) });
};

export const getProduct = async (id: string | number) => {
  return request.get({ path: productByIdEndpoint(id) });
};

const buildProductFormData = (payload: ProductFormPayload): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("sku", payload.sku);
  formData.append("quantity", String(payload.quantity));
  formData.append("active", String(payload.active));
  payload.categories.forEach((category) => formData.append("categories", category));
  if (payload.imageFile) formData.append("image", payload.imageFile);
  return formData;
};

export const createProduct = async (payload: ProductFormPayload) => {
  return request.upload({
    path: ENDPOINT.PRODUCTS,
    formData: buildProductFormData(payload),
  });
};

export const updateProduct = async (
  id: string | number,
  payload: ProductFormPayload,
) => {
  return request.upload({
    path: productByIdEndpoint(id),
    formData: buildProductFormData(payload),
    method: "put",
  });
};
