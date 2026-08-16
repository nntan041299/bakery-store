export const STORE_SELECTION_TEXT = {
  TITLE: "Choose your store",
  SUBTITLE: "Pick which store you want to manage.",
  PRODUCT_COUNT: (count: number) =>
    `${count} ${count === 1 ? "product" : "products"}`,
  ADD_STORE: "Add another store",
  NEW_STORE_PLACEHOLDER: "New store name",
  CREATE: "Create",
  CREATING: "Creating…",
  CANCEL: "Cancel",
  NAME_REQUIRED_ERROR: "Store name is required.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  LOADING: "Loading your stores…",
  LOAD_ERROR: "Failed to load your stores. Please try again.",
  NO_STORES_TITLE: "No store found",
  NO_STORES_MESSAGE:
    "Your account doesn't have a store yet. Please contact support.",
  SWITCH_STORE: "Switch store",
  CURRENT_STORE: "Current store",
};
