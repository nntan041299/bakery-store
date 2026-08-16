export const CATEGORIES_TEXT = {
  TITLE: "Categories",
  SUBTITLE: "Organize your products into categories.",
  NEW_CATEGORY_PLACEHOLDER: "New category name",
  ADD: "Add category",
  ADDING: "Adding…",
  LOADING: "Loading categories…",
  LOAD_ERROR: "Failed to load categories. Please try again.",
  EMPTY: "No categories yet. Create your first one.",
  PRODUCT_COUNT: (count: number) =>
    `${count} ${count === 1 ? "product" : "products"}`,
  EDIT: "Edit",
  SAVE: "Save",
  CANCEL: "Cancel",
  DELETE: "Delete",
  DELETE_TITLE: "Delete category",
  DELETE_CONFIRM: (name: string, count: number) =>
    count > 0
      ? `Delete "${name}"? It will be removed from ${count} ${count === 1 ? "product" : "products"}.`
      : `Delete "${name}"?`,
  SELECT_ALL: "Select all",
  SELECTED_COUNT: (count: number) => `${count} selected`,
  DELETE_SELECTED: "Delete selected",
  BULK_DELETE_CONFIRM: (categoryCount: number, productCount: number) =>
    productCount > 0
      ? `Delete ${categoryCount} ${categoryCount === 1 ? "category" : "categories"}? They will be removed from ${productCount} ${productCount === 1 ? "product" : "products"}.`
      : `Delete ${categoryCount} ${categoryCount === 1 ? "category" : "categories"}?`,
  NAME_REQUIRED_ERROR: "Category name is required.",
  DUPLICATE_ERROR: "A category with this name already exists.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
