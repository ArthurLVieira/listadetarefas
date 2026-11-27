import { useAuth } from "@/hooks/useAuth";
import { Task } from "@/models/Task";
import { taskRepository } from "@/services/api";
import { ApiError } from "@/services/api-error";
import type {
  TaskCreateRequest,
  TaskFilter,
  TaskUpdateRequest,
} from "@/types/api";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

export const TaskContext = createContext<TaskContextValue | null>(null);

const byPosition = (a: Task, b: Task) => a.position - b.position;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const { isAuthenticated } = useAuth();

  const itemsRef = useRef<Task[]>([]);
  itemsRef.current = items;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await taskRepository.findAll());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.firstErrorMessage() : "Erro ao carregar",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }
    void fetchAll();
  }, [fetchAll, isAuthenticated]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const create = useCallback(
    async (payload: TaskCreateRequest): Promise<Task> => {
      const created = await taskRepository.insert(payload);
      setItems((prev) => [...prev, created].sort(byPosition));
      return created;
    },
    [],
  );

  const update = useCallback(
    async (id: number, payload: TaskUpdateRequest): Promise<Task> => {
      const updated = await taskRepository.update(id, payload);
      setItems((prev) =>
        prev.map((t) => (t.id === id ? updated : t)).sort(byPosition),
      );
      return updated;
    },
    [],
  );

  const setCompletion = useCallback(
    async (id: number, completed: boolean): Promise<Task> => {
      const snapshot = itemsRef.current;
      setItems((prev) =>
        prev
          .map((t) =>
            t.id === id ? Task.fromRaw({ ...t, completed }) : t,
          )
          .sort(byPosition),
      );
      try {
        const updated = await taskRepository.setCompletion(id, completed);
        setItems((prev) =>
          prev.map((t) => (t.id === id ? updated : t)).sort(byPosition),
        );
        return updated;
      } catch (err) {
        setItems(snapshot);
        throw err;
      }
    },
    [],
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    const snapshot = itemsRef.current;
    setItems((prev) => prev.filter((t) => t.id !== id));
    try {
      await taskRepository.remove(id);
    } catch (err) {
      setItems(snapshot);
      throw err;
    }
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "open") return items.filter((t) => !t.completed);
    if (filter === "completed") return items.filter((t) => t.completed);

    return items;
  }, [items, filter]);

  const value = useMemo<TaskContextValue>(
    () => ({
      items,
      loading,
      error,
      fetchAll,
      refetch: fetchAll,
      create,
      update,
      setCompletion,
      remove,
      filter,
      setFilter,
      filteredItems,
    }),
    [
      items,
      loading,
      error,
      fetchAll,
      create,
      update,
      setCompletion,
      remove,
      filter,
      filteredItems,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
