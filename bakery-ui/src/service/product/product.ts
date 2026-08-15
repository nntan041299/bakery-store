import { request, ENDPOINT, productByIdEndpoint } from "@/rest";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  imageUrl?: string;
  active: boolean;
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
  imageUrl?: string;
  active: boolean;
}

export interface ListProductsParams {
  search?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

const buildQuery = (params: ListProductsParams): string => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.active !== undefined) query.set("active", String(params.active));
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

export const createProduct = async (payload: ProductFormPayload) => {
  return request.post({
    path: ENDPOINT.PRODUCTS,
    body: payload as unknown as Record<string, unknown>,
  });
};

export const updateProduct = async (
  id: string | number,
  payload: ProductFormPayload,
) => {
  return request.put({
    path: productByIdEndpoint(id),
    body: payload as unknown as Record<string, unknown>,
  });
};
