import { API_BASE_URL } from "@/config/serverApiConfig";
import { request, ENDPOINT } from "@/rest";

interface LoginParams {
  username: string;
  password: string;
}

interface GoogleTokenParams {
  code: string;
  state: string;
}

export type RegisterableRole = "CUSTOMER" | "SHOP_OWNER";

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: RegisterableRole;
  shopName?: string;
}

export const login = async ({ username, password }: LoginParams) => {
  return request.post({
    path: API_BASE_URL + ENDPOINT.LOGIN,
    body: { username, password },
  });
};

export const getGoogleLoginUrl = (): string => {
  return API_BASE_URL + ENDPOINT.GOOGLE_LOGIN;
};

export const getGoogleToken = async ({ code, state }: GoogleTokenParams) => {
  return request.get({
    path:
      API_BASE_URL +
      ENDPOINT.GOOGLE_LOGIN_GET_TOKEN +
      "?code=" +
      code +
      "&state=" +
      state,
  });
};

export const signUp = async ({
  username,
  email,
  password,
  fullName,
  role,
  shopName,
}: SignUpParams) => {
  return await request.post({
    path: API_BASE_URL + ENDPOINT.SIGN_UP,
    body: { username, email, password, fullName, role, shopName },
  });
};

export const signOut = async () => {
  return await request.post({
    path: API_BASE_URL + ENDPOINT.SIGN_OUT,
  });
};
