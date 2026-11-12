import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import {
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "../../types/api";
import { env } from "../../config/env";

export class AuthRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/api/auth");
  }

  public async login(payload: LoginRequest): Promise<AuthResponse> {
    const data = await this.post<AuthResponse>("/login", payload);
    return data;
  }

  public async register(
    payload: RegisterRequest,
  ): Promise<AuthResponse | null> {
    const data = await this.post<AuthResponse>("/register", payload);
    return data;
  }

  public async logout(refreshToken: string): Promise<void> {
    await this.post("/logout", { refreshToken });
  }

  startGoogleLogin(): void {
    window.location.href = env.oauth2Url;
  }
}
