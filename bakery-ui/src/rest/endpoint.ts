export const ENDPOINT = {
  LOGIN: "auth/login",
  GOOGLE_LOGIN: "auth/google/login",
  GOOGLE_LOGIN_GET_TOKEN: "auth/google/getToken",
  USERS: "users/current-user",
  SIGN_UP: "auth/register",
  SIGN_OUT: "auth/logout",
  REFRESH_TOKEN: "auth/refresh",
  STORES: "stores",
  MY_STORES: "stores/mine",
} as const;

export const storeProductsEndpoint = (storeId: string | number): string =>
  `${ENDPOINT.STORES}/${storeId}/products`;

export const storeProductByIdEndpoint = (
  storeId: string | number,
  id: string | number,
): string => `${storeProductsEndpoint(storeId)}/${id}`;

export const storeCategoriesEndpoint = (storeId: string | number): string =>
  `${ENDPOINT.STORES}/${storeId}/categories`;

export const storeCategoryByIdEndpoint = (
  storeId: string | number,
  id: string | number,
): string => `${storeCategoriesEndpoint(storeId)}/${id}`;
