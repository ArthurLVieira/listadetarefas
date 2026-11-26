import type { ApiErrorResponse } from "../types/api";

type apiErrorCode =
  | "API_OFFLINE"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "INVALID_CREDENTIALS"
  | string;

export type ApiErrorCode =
  | "API_OFFLINE"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHENTICATED"
  | "SESSION_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "INVALID_CREDENTIALS"
  | string;

export interface RawApiError {
  status: number;
  message: string;
  errors: ApiErrorResponse[];
  code?: ApiErrorCode;
}

export class ApiError extends Error {
  readonly status: number;
  readonly message: string;
  readonly errors: ApiErrorResponse[];
  readonly code?: ApiErrorCode;

  constructor(raw: RawApiError) {
    super(raw.message);
    this.status = raw.status;
    this.message = raw.message;
    this.errors = raw.errors;
    this.code = raw.code;
    this.name = "ApiError";
  }

  firstErrorMessage(): string {
    return this.errors[0]?.message ?? this.message;
  }

  isOffline(): boolean {
    return this.code === "API_OFFLINE" || this.code === "NETWORK_ERROR";
  }

  get getCode(): number | undefined {
    return this.code;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isValidation(): boolean {
    return this.status === 400 && this.errors.length > 0;
  }

  isServer(): boolean {
    return this.status >= 500;
  }

  isOffline(): boolean {
    return this.code === "API_OFFLINE" || this.code === "NETWORK_ERROR";
  }
}
