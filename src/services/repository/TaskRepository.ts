import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { BaseRepository } from "./BaseRepository";
import { Task } from "@/models/Task";
import type { TaskCreateRequest, TaskUpdateRequest } from "@/types/api";

export class TaskRepository extends BaseRepository {
  constructor(http: AxiosInstance) {
    super(http, "/tasks");
  }

  findAll(completed?: boolean | null): Promise<Task[]> {
    const params: AxiosRequestConfig | undefined =
      typeof completed === "boolean" ? { params: { completed } } : undefined;
    return this.get<Task[]>("", params);
  }

  findById(id: number): Promise<Task> {
    return this.get<Task>(`/${id}`);
  }

  insert(payload: TaskCreateRequest): Promise<Task> {
    return this.post<Task, TaskCreateRequest>("", payload);
  }

  update(id: number, payload: TaskUpdateRequest): Promise<Task> {
    return this.put<Task, TaskUpdateRequest>(`/${id}`, payload);
  }

  setCompletion(id: number, completed: boolean): Promise<Task> {
    return this.patch<Task, { completed: boolean }>(`/${id}/completion`, {
      completed,
    });
  }

  remove(id: number): Promise<Task> {
    return this.delete(`/${id}`);
  }
}
