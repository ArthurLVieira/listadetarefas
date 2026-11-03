import { env } from "../config/env";
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../types/api";
import { ApiError } from "./api-error";

export const TOKEN_KEY = "@listadetarefas.token";

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const isAuthRoute = error.config?.url?.includes("/api/auth");
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("@auth/unauthorized"));
    }

    const body = error.response?.data;
    return Promise.reject(
      new ApiError({
        status: error.response?.status,
        message:
          body?.message ?? body?.errors?.[0]?.message ?? "Erro inesperado",
        errors: body?.errors ?? [],
        code: body?.errors?.[0]?.code ?? undefined,
      }),
    );
  },
);
