import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import {
  type ApiResponse,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "../../types/api";
import type { User } from "../../models/User";
import { env } from "../../config/env";

export class AuthRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/auth");
  }

  public async login(payload: LoginRequest): Promise<AuthResponse<User>> {
    return this.post<AuthResponse<User>, LoginRequest>("/login", payload);
  }

  public async register(
    payload: RegisterRequest,
  ): Promise<AuthResponse<User> | null> {
    const { data } = await this.post<ApiResponse<AuthResponse<User>>>(
      "/register",
      payload,
    );
    return data;
  }

  startGoogleLogin(): void {
    window.location.href = env.oauth2Url;
  }
}
