export interface ApiErrorResponse {
  code?: string | null;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ApiErrorResponse[] | null;
  message?: string | null;
  path: string | null;
  traceId: string | null;
  timestamp: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface AuthSession<T> {
  token: string;
  data: T;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  color: string | null;
}

export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priorityId?: number | null;
  categoryId?: number | null;
}

export type TaskUpdateRequest = TaskCreateRequest;

export type TaskFilter = "all" | "open" | "completed";
