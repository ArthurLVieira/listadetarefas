import type { ApiErrorResponse } from "../types/api";

export interface RawApiError {
  status?: number;
  message: string;
  errors?: ApiErrorResponse[];
  code?: number;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly message: string;
  readonly errors?: ApiErrorResponse[];
  readonly code?: number;

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

  get getCode(): number | undefined {
    return this.code;
  }

  firstErrorMessage(): string | null {
    if (this.errors && this.errors.length > 0) {
      return this.errors[0].message;
    }
    return null;
  }
}
