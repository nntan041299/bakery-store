export const PRODUCTS_PAGE_SIZE = 10;

export const PRODUCTS_TEXT = {
  TITLE: "Inventory",
  SUBTITLE: "Create, edit, and search your products.",
  NEW_PRODUCT: "New product",
  SEARCH_PLACEHOLDER: "Search by name or SKU",
  STATUS_ALL: "All statuses",
  STATUS_ACTIVE: "Active only",
  STATUS_INACTIVE: "Inactive only",
  LOADING: "Loading products…",
  LOAD_ERROR: "Failed to load products. Please try again.",
  EMPTY_FILTERED: "No products match your search.",
  EMPTY: "No products yet. Create your first one.",
  COLUMN_NAME: "Name",
  COLUMN_SKU: "SKU",
  COLUMN_PRICE: "Price",
  COLUMN_QUANTITY: "Quantity",
  COLUMN_CATEGORIES: "Categories",
  COLUMN_STATUS: "Status",
  NO_CATEGORIES: "—",
  PAGE_LABEL: (page: number, totalPages: number) =>
    `Page ${page} of ${totalPages}`,
  PREVIOUS: "Previous",
  NEXT: "Next",
  STATUS_ACTIVE_BADGE: "Active",
  STATUS_INACTIVE_BADGE: "Inactive",
};

export const PRODUCT_FORM_TEXT = {
  BACK_TO_INVENTORY: "Back to inventory",
  TITLE_EDIT: "Edit product",
  TITLE_NEW: "New product",
  SUBTITLE_EDIT: "Update the details of this product.",
  SUBTITLE_NEW: "Add a new product to your inventory.",
  SECTION_TITLE: "Product details",
  LOADING_PRODUCT: "Loading product…",
  LABEL_NAME: "Name",
  PLACEHOLDER_NAME: "e.g. Sourdough loaf",
  LABEL_DESCRIPTION: "Description",
  PLACEHOLDER_DESCRIPTION: "Optional description",
  LABEL_PRICE: "Price",
  LABEL_SKU: "SKU",
  PLACEHOLDER_SKU: "e.g. BRD-001",
  LABEL_QUANTITY: "Quantity",
  LABEL_CATEGORIES: "Categories",
  LABEL_IMAGE_URL: "Image URL",
  PLACEHOLDER_IMAGE_URL: "https://…",
  LABEL_ACTIVE: "Active (visible for sale)",
  SAVING: "Saving…",
  SAVE_CHANGES: "Save changes",
  CREATE_PRODUCT: "Create product",
  DEFAULT_SAVE_ERROR: "Failed to save product. Please try again.",
  ERROR_NAME_REQUIRED: "Name is required.",
  ERROR_PRICE_INVALID: "Enter a valid price.",
  ERROR_SKU_REQUIRED: "SKU is required.",
  ERROR_QUANTITY_INVALID: "Enter a valid quantity.",
};

export const CATEGORY_PICKER_TEXT = {
  PLACEHOLDER: "Add a category…",
  REMOVE_LABEL: (name: string) => `Remove ${name}`,
  CREATE_OPTION: (query: string) => `Create category "${query}"`,
};

export const CATEGORY_FILTER_TEXT = {
  ALL_CATEGORIES: "All categories",
  CREATE_PLACEHOLDER: "Create new category…",
  CREATING: "Creating…",
  CREATE_OPTION: (query: string) => `Create category "${query}"`,
};
