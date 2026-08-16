export const QUERY_KEYS = {
  CATEGORIES: ["categories"] as const,
  PRODUCTS: (params: {
    page: number;
    search: string;
    activeFilter: string;
    categoryId?: number;
    sortField: string;
    sortDir: string;
  }) =>
    [
      "products",
      params.page,
      params.search,
      params.activeFilter,
      params.categoryId,
      params.sortField,
      params.sortDir,
    ] as const,
  PRODUCT: (id?: string) => ["product", id] as const,
};
