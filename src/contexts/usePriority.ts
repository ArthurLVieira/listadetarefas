import type { Priority } from "@/models/Priority";
import { priorityRepository } from "@/services/api";
import { useCallback, useEffect, useRef, useState } from "react";

let cache: Priority[] | null = null;
let inFlitht: Promise<Priority[]> | null = null;

export function usePriority() {
  const [items, setItems] = useState<Priority[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchPriorities = useCallback(async (force = false) => {
    if (cache && !force) {
      setItems(cache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!inFlitht) {
        inFlitht = priorityRepository.list();
      }

      const list = await inFlitht;
      cache = list;

      if (!mountedRef.current) return;
      setItems(list);
    } catch (err) {
      cache = null;
      if (!mountedRef.current) return;
      setError(
        err instanceof Error ? err.message : "Erro ao carregar prioridades",
      );
    } finally {
      inFlitht = null;
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void fetchPriorities();
    return () => {
      mountedRef.current = false;
      mountedRef.current = false;
    };
  }, [fetchPriorities]);

  const refetch = useCallback(() => {
    cache = null;
    return fetchPriorities(true);
  }, [fetchPriorities]);

  return { items, loading, error, refetch };
}
