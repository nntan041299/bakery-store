export const QUERY_KEYS = {
  MY_STORES: ["stores", "mine"] as const,
  CATEGORIES: (storeId: number | null) => ["categories", storeId] as const,
  PRODUCTS: (
    storeId: number | null,
    params: {
      page: number;
      search: string;
      activeFilter: string;
      categoryId?: number;
      sortField: string;
      sortDir: string;
    },
  ) =>
    [
      "products",
      storeId,
      params.page,
      params.search,
      params.activeFilter,
      params.categoryId,
      params.sortField,
      params.sortDir,
    ] as const,
  PRODUCT: (storeId: number | null, id?: string) =>
    ["product", storeId, id] as const,
  TOP_STORES: (limit: number) => ["stores", "top", limit] as const,
  STORES: (params: { page: number; search: string }) =>
    ["stores", "search", params.page, params.search] as const,
};
