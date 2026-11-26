import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Category } from "@/models/Category";
import { categoryRepository } from "@/services/api";
import { ApiError } from "@/services/api-error";
import type { CategoryRequest } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";

const MAX_CATEGORIES = 20;
const byName = (a: Category, b: Category) =>
  a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });

export interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

export interface CategoryContextValue {
  items: Category[];
  loading: boolean;
  error: string | null;
  limitReached: boolean;
  maxCategories: number;
  fetchAll: () => Promise<void>;
  refetch: () => Promise<void>;
  fetchId: (id: number) => Promise<Category | null>;
  create: (payload: CategoryRequest) => Promise<Category>;
  update: (id: number, payload: CategoryRequest) => Promise<Category>;
  remove: (id: number) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<CategoryState>({
    items: [],
    loading: true,
    error: null,
  });

  const itemsRef = useRef<Category[]>([]);
  itemsRef.current = state.items;

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const items = await categoryRepository.findAll();
      setState({ items, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Erro ao carregar categorias";
      setState((s) => ({ ...s, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setState((prev) => ({ ...prev, items: [], loading: false }));
      return;
    }
  }, []);

  const fetchId = useCallback(async (id: number): Promise<Category | null> => {
    try {
      const category = await categoryRepository.findByid(id);

      setState((s) => ({
        ...s,
        items: s.items.some((c) => c.id === category.id)
          ? s.items
              .map((c) => (c.id === category.id ? category : c))
              .sort(byName)
          : [...s.items, category].sort(byName),
      }));

      return category;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Erro ao carregar categoria";
      setState((s) => ({ ...s, error: message }));
      return null;
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const create = useCallback(
    async (payload: CategoryRequest): Promise<Category> => {
      const created = await categoryRepository.insert(payload);
      setState((s) => ({
        ...s,
        items: [...s.items, created].sort(byName),
      }));
      return created;
    },
    [],
  );

  const update = useCallback(
    async (id: number, payload: CategoryRequest): Promise<Category> => {
      const updated = await categoryRepository.update(id, payload);
      setState((s) => ({
        ...s,
        items: s.items.map((c) => (c.id === id ? updated : c)).sort(byName),
      }));
      return updated;
    },
    [],
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    const snapshot = itemsRef.current;
    setState((s) => ({ ...s, items: s.items.filter((c) => c.id !== id) }));
    try {
      await categoryRepository.remove(id);
    } catch (err) {
      setState((s) => ({ ...s, items: snapshot }));
      throw err;
    }
  }, []);

  const value = useMemo<CategoryContextValue>(
    () => ({
      items: state.items,
      loading: state.loading,
      error: state.error,

      limitReached: state.items.length >= MAX_CATEGORIES,
      maxCategories: MAX_CATEGORIES,

      fetchAll,
      refetch: fetchAll,
      fetchId,

      create,
      update,
      remove,
    }),
    [
      state.items,
      state.loading,
      state.error,
      fetchAll,
      fetchId,
      create,
      update,
      remove,
    ],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}
