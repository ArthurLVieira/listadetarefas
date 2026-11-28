import type { AxiosInstance } from "axios";
import type { RawUser } from "@/models/User";
import type { ChangePasswordRequest, UpdateProfileRequest } from "@/types/api";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/users");
  }

  findMe(): Promise<RawUser> {
    return this.get<RawUser>("/me");
  }

  updateMe(payload: UpdateProfileRequest): Promise<RawUser> {
    return this.put<RawUser, UpdateProfileRequest>("/me", payload);
  }

  changePassword(payload: ChangePasswordRequest): Promise<void> {
    return this.put<void, ChangePasswordRequest>("/me/password", payload);
  }
}
