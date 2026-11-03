export interface ApiErrorResponse {
  code?: number;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ApiErrorResponse[] | null;
  message?: string;
  path: string | null;
  traceId: string | null;
  timestamp: string | null;
}

export interface AuthResponse<T> {
  token: string;
  data: T | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}
