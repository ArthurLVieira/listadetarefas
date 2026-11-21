import type { AxiosInstance } from "axios";
import { BaseRepository } from "./BaseRepository";
import { Category } from "@/models/Category";
import type { CategoryRequest } from "@/types/api";

export class CategoryRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/categories");
  }

  findAll(): Promise<Category[]> {
    return this.get<Category[]>("");
  }

  findByid(id: number): Promise<Category> {
    return this.get<Category>(`/${id}`);
  }

  insert(payload: CategoryRequest): Promise<Category> {
    return this.post<Category, CategoryRequest>("", payload);
  }

  update(id: number, payload: CategoryRequest): Promise<Category> {
    return this.put<Category, CategoryRequest>(`/${id}`, payload);
  }

  remove(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }
}
