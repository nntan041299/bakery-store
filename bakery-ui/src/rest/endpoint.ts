export const ENDPOINT = {
  LOGIN: "bakery-service/api/auth/login",
  GOOGLE_LOGIN: "bakery-service/api/auth/google/login",
  GOOGLE_LOGIN_GET_TOKEN: "bakery-service/api/auth/google/getToken",
  USERS: "bakery-service/api/users/current-user",
  SIGN_UP: "bakery-service/api/auth/register",
  SIGN_OUT: "bakery-service/api/auth/logout",
  REFRESH_TOKEN: "bakery-service/api/auth/refresh",
  STORES: "bakery-service/api/stores",
  MY_STORES: "bakery-service/api/stores/mine",
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
