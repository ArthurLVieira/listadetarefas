import { env } from "../config/env";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "../types/api";
import { ApiError } from "./api-error";
import { tokenManagerInstance } from "./auth/tokenManager";
import { AuthRepository } from "./repository/AuthRepository";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";

  const isPublicRoute =
    url.startsWith("/auth/login") ||
    url.startsWith("/register") ||
    url.startsWith("/auth/refresh");

  if (isPublicRoute || !tokenManagerInstance.isAuthenticated()) {
    return config;
  }

  if (tokenManagerInstance.isExpringSoon()) {
    try {
      const newToken = await tokenManagerInstance.refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    } catch {}
  }

  const token = tokenManagerInstance.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.response?.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/register");

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        const newToken = tokenManagerInstance.refreshToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenManagerInstance.clearSession();
        if (!location.pathname.startsWith("/login")) location.assign("/login");
      }
    }

    return Promise.reject(
      new ApiError({
        status: error.response?.status,
        message:
          error.response?.data?.message ??
          error.response?.data?.errors?.[0]?.message ??
          "Erro inesperado",
        errors: error.response?.data?.errors ?? [],
        code: error.response?.data?.errors?.[0]?.code ?? undefined,
      }),
    );
  },
);

export type ApiInstance = AxiosInstance;
export const authRepository = new AuthRepository(api);
