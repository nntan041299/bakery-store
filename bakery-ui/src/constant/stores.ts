export const TOP_STORES_COUNT = 10;
export const STORE_SEARCH_PAGE_SIZE = 10;

export const STORES_TEXT = {
  POPULAR_TITLE: "Popular stores",
  POPULAR_SUBTITLE: "Bakeries our customers order from the most.",
  SEARCH_PLACEHOLDER: "Search stores by name",
  SEARCH_RESULTS_TITLE: (query: string) => `Results for "${query}"`,
  LOADING: "Loading stores…",
  LOAD_ERROR: "Failed to load stores. Please try again.",
  EMPTY: "No stores yet. Check back soon.",
  EMPTY_SEARCH: "No stores match your search.",
  PRODUCT_COUNT: (count: number) =>
    `${count} ${count === 1 ? "product" : "products"}`,
  PREVIOUS: "Previous",
  NEXT: "Next",
  PAGE_LABEL: (page: number, totalPages: number) =>
    `Page ${page} of ${totalPages}`,
};
