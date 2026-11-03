import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import type { AuthResponse, LoginRequest, UserResponse } from "../../types/api";

export class AuthRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/auth");
  }

  public async login(
    payload: LoginRequest,
  ): Promise<AuthResponse<UserResponse>> {
    return this.post<AuthResponse<UserResponse>, LoginRequest>(
      "/login",
      payload,
    );
  }
}
