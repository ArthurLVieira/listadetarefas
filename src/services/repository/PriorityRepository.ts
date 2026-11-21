import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import { Priority } from "@/models/Priority";

export class PriorityRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/priorities");
  }

  list(): Promise<Priority[]> {
    return this.get<Priority[]>("");
  }
}
