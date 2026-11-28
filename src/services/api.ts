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
import { UserRepository } from "./repository/UserRepository";

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

interface SpringErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

interface ApiResponseBody {
  success?: boolean;
  message?: string | null;
  errors?: { code: string; message: string }[] | null;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => {
    healthService.reportSuccess();
    return response;
  },
  async (error: AxiosError<ApiResponseBody & SpringErrorBody>) => {
    const original = error.response?.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/register");

    const isNetworkError = !error.response;
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      error.message?.toLowerCase().includes("timeout");
    const isServerError = status !== undefined && status >= 500;

    if (status !== undefined && status < 500) {
      healthService.reportSuccess();
    }

    if (isNetworkError || isServerError) {
      healthService.reportFailure();
      if (isNetworkError) void healthService.checkNow();
    }

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      const hadTokenBefore = !!tokenManagerInstance.getAccessToken();

      if (!hadTokenBefore) {
        return Promise.reject(
          new ApiError({
            status: 401,
            message: "Autenticação necessária",
            errors: [],
            code: "UNAUTHENTICATED",
          }),
        );
      }

      original._retry = true;
      try {
        const newToken = await tokenManagerInstance.refreshToken();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenManagerInstance.clearSession();
        if (!location.pathname.startsWith("/login")) {
          location.assign("/login");
        }
        return Promise.reject(
          new ApiError({
            status: 401,
            message: "Sessão expirada. Faça login novamente.",
            errors: [],
            code: "SESSION_EXPIRED",
          }),
        );
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

    return Promise.reject(buildApiError(error, status));
  },
);

function buildApiError(
  error: AxiosError<ApiResponseBody & SpringErrorBody>,
  status: number | undefined,
): ApiError {
  const body = error.response?.data;
  if (body?.errors && Array.isArray(body.errors) && body.errors.length > 0) {
    return new ApiError({
      status: status ?? 400,
      message: body.errors[0].message ?? body.message ?? "Erro na requisição",
      errors: body.errors,
      code: body.errors[0].code,
    });
  }

  if (body?.message && body?.success === false) {
    return new ApiError({
      status: status ?? 400,
      message: body.message,
      errors: [],
      code: undefined,
    });
  }

  if (body?.error && typeof body.error === "string") {
    return new ApiError({
      status: status ?? 400,
      message: humanizeSpringError(status, body),
      errors: [],
      code: springCodeFromStatus(status),
    });
  }

  if (body?.message) {
    return new ApiError({
      status: status ?? 400,
      message: body.message,
      errors: [],
      code: undefined,
    });
  }

  return new ApiError({
    status: status ?? 0,
    message: defaultMessageByStatus(status),
    errors: [],
    code: springCodeFromStatus(status),
  });
}

function humanizeSpringError(
  status: number | undefined,
  body: SpringErrorBody,
): string {
  switch (status) {
    case 400:
      return "Requisição inválida. Verifique os dados enviados.";
    case 403:
      return "Você não tem permissão para acessar este recurso.";
    case 404:
      return "Recurso não encontrado.";
    case 405:
      return "Método não permitido.";
    case 415:
      return "Formato de conteúdo não suportado.";
    case 429:
      return "Muitas requisições. Aguarde e tente novamente.";
    default:
      return body.message ?? body.error ?? "Erro inesperado";
  }
}

function defaultMessageByStatus(status: number | undefined): string {
  switch (status) {
    case 400:
      return "Requisição inválida";
    case 401:
      return "Não autenticado";
    case 403:
      return "Acesso negado";
    case 404:
      return "Recurso não encontrado";
    case 409:
      return "Conflito de dados";
    case 422:
      return "Dados inválidos";
    case 429:
      return "Muitas requisições";
    case 500:
      return "Erro interno do servidor";
    case 502:
    case 503:
    case 504:
      return "Servidor temporariamente indisponível";
    default:
      return "Erro inesperado";
  }
}

function springCodeFromStatus(status: number | undefined): string | undefined {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHENTICATED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 500:
    case 502:
    case 503:
    case 504:
      return "SERVER_ERROR";
    default:
      return undefined;
  }
}

export type ApiInstance = AxiosInstance;
export const authRepository = new AuthRepository(api);
export const categoryRepository = new CategoryRepository(api);
export const priorityRepository = new PriorityRepository(api);
export const taskRepository = new TaskRepository(api);
export const userRepository = new UserRepository(api);
