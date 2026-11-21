import { env } from "../config/env";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "./api-error";
import { tokenManagerInstance } from "./auth/tokenManager";
import { AuthRepository } from "./repository/AuthRepository";
import { CategoryRepository } from "./repository/CategoryRepository";
import { healthService } from "./health/HealthService";
import { PriorityRepository } from "./repository/PriorityRepository";
import { TaskRepository } from "./repository/TaskRepository";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";

  const isPublic =
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/refresh");

  if (healthService.isOffline() && !isPublic) {
    throw new ApiError({
      status: 0,
      message: "Sem conexão com o servidor. Verificar sua internet",
      errors: [],
      code: "API_OFFLINE",
    });
  }

  if (
    !isPublic &&
    tokenManagerInstance.isAuthenticated() &&
    tokenManagerInstance.isExpiringSoon()
  ) {
    try {
      const newToken = await tokenManagerInstance.refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    } catch {
      /* deixa o response interceptor tratar */
    }
  }

  const token = tokenManagerInstance.getAccessToken();
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => {
    healthService.reportSuccess();
    return response;
  },
  async (
    error: AxiosError<{
      message?: string;
      errors?: { code: string; message: string }[];
    }>,
  ) => {
    const original = error.response?.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/register");

    const isNetworkError = !error.response;
    const isTimeout =
      error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    const isServerDown = status !== undefined && status >= 500;

    if (isNetworkError || isServerDown) {
      healthService.reportFailure();

      if (isNetworkError) {
        void healthService.checkNow();
      }
    }

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const newToken = await tokenManagerInstance.refreshToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenManagerInstance.clearSession();
        if (!location.pathname.startsWith("/login")) location.assign("/login");
      }
    }

    if (isNetworkError) {
      return Promise.reject(
        new ApiError({
          status: 0,
          message: isTimeout
            ? "O servidor demorou para responder. Tente novamente."
            : "Sem conexão com o servidor. Verifique sua internet.",
          errors: [],
          code: isTimeout ? "TIMEOUT" : "API_OFFLINE",
        }),
      );
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
export const categoryRepository = new CategoryRepository(api);
export const priorityRepository = new PriorityRepository(api);
export const taskRepository = new TaskRepository(api);
