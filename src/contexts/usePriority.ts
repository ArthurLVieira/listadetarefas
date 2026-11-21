import type { Priority } from "@/models/Priority";
import { priorityRepository } from "@/services/api";
import { useEffect, useState } from "react";

let cache: Priority[] | null = null;

export function usePriority() {
  const [items, setItems] = useState<Priority[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    setLoading(true);
    priorityRepository
      .list()
      .then((list) => {
        if (cancelled) return;
        cache = list;
        setItems(list);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Erro ao carregar prioridades",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}
