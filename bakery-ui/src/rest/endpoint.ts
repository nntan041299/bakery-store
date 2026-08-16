export const ENDPOINT = {
  LOGIN: "bakery-service/api/auth/login",
  GOOGLE_LOGIN: "bakery-service/api/auth/google/login",
  GOOGLE_LOGIN_GET_TOKEN: "bakery-service/api/auth/google/getToken",
  USERS: "bakery-service/api/users/current-user",
  SIGN_UP: "bakery-service/api/auth/register",
  SIGN_OUT: "bakery-service/api/auth/logout",
  REFRESH_TOKEN: "bakery-service/api/auth/refresh",
  PRODUCTS: "bakery-service/api/products",
  CATEGORIES: "bakery-service/api/categories",
} as const;

export const productByIdEndpoint = (id: string | number): string =>
  `${ENDPOINT.PRODUCTS}/${id}`;
