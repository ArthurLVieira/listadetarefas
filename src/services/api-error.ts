import type { ApiErrorResponse } from "../types/api";

export type ApiErrorCode =
  | "API_OFFLINE"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "INVALID_CREDENTIALS"
  | string;

export interface RawApiError {
  status?: number;
  message: string;
  errors?: ApiErrorResponse[];
  code?: ApiErrorCode;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly message: string;
  readonly errors?: ApiErrorResponse[];
  readonly code?: ApiErrorCode;

  constructor(raw: RawApiError) {
    super(raw.message);
    this.status = raw.status;
    this.message = raw.message;
    this.errors = raw.errors;
    this.code = raw.code;
    this.name = "ApiError";
  }

  get getStatus(): number | undefined {
    return this.status;
  }

  get getErrors(): ApiErrorResponse[] | undefined {
    return this.errors;
  }

  get getCode(): string | undefined {
    return this.code;
  }

  firstErrorMessage(): string | null {
    if (this.errors && this.errors.length > 0) {
      return this.errors[0].message;
    }
    return null;
  }

  isOffline(): boolean {
    return this.code === "API_OFFLINE" || this.code === "NETWORK_ERROR";
  }

  isTimeout(): boolean {
    return this.code === "TIMEOUT";
  }
}
