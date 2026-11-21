import { Task } from "@/models/Task";
import type {
  TaskCreateRequest,
  TaskFilter,
  TaskUpdateRequest,
} from "@/types/api";
import { createContext, useState } from "react";

export interface TaskContextValue {
  items: Task[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  refetch: () => Promise<void>;

  create: (payload: TaskCreateRequest) => Promise<Task>;
  update: (id: number, payload: TaskUpdateRequest) => Promise<Task>;
  setCompletion: (id: number, completed: boolean) => Promise<Task>;
  remove: (id: number) => Promise<void>;

  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;

  filteredItems: Task[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

const byPosition = (a: Task, b: Task) => a.position - b.position;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Task[]>([]);
}
