import { request, ENDPOINT } from "@/rest";

export interface Store {
  id: number;
  name: string;
  productCount: number;
}

export interface StorePage {
  content: Store[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const listMyStores = async () => {
  return request.get({ path: ENDPOINT.MY_STORES });
};

export const createStore = async (name: string) => {
  return request.post({ path: ENDPOINT.STORES, body: { name } });
};

export const listTopStores = async (limit: number) => {
  return request.get({ path: `${ENDPOINT.STORES}/top?limit=${limit}` });
};

export interface SearchStoresParams {
  search?: string;
  page?: number;
  size?: number;
}

const buildSearchQuery = (params: SearchStoresParams): string => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  const queryString = query.toString();
  return queryString ? `${ENDPOINT.STORES}?${queryString}` : ENDPOINT.STORES;
};

export const searchStores = async (params: SearchStoresParams = {}) => {
  return request.get({ path: buildSearchQuery(params) });
};
