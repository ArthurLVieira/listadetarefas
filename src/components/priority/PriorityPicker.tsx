import { usePriority } from "@/contexts/usePriority";
import clsx from "clsx";
import { RefreshCw } from "lucide-react";

const LABELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const;

interface Props {
  value: number | null;
  onChange: (id: number) => void;
}

export function PriorityPicker({ value, onChange }: Props) {
  const { items, loading, error, refetch } = usePriority();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[52px] rounded-2xl bg-neutral-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-3 py-2.5">
        <p className="flex-1 text-xs text-red-700">
          Não foi possível carregar prioridades.
        </p>
        <button
          type="button"
          onClick={refetch}
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 h-8 rounded-xl text-xs",
            "font-medium text-red-700 hover:bg-red-100 transition-colors",
          )}
        >
          <RefreshCw className="h-3 w-3" />
          Tentar
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-amber-50 border border-amber-100 px-3 py-2.5">
        <p className="text-xs text-amber-800">
          Nenhuma prioridade cadastrada. Execute as migrations do backend.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((p) => {
        const selected = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            aria-pressed={selected}
            className={clsx(
              "relative flex items-center gap-2 px-3 h-[52px] rounded-2xl",
              "border transition-all active:scale-[0.97]",
              selected
                ? "border-transparent shadow-sm"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50",
            )}
            style={
              selected
                ? {
                    backgroundColor: `${p.color}14`,
                    borderColor: `${p.color}50`,
                  }
                : undefined
            }
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span
              className={clsx(
                "text-sm font-medium truncate",
                !selected && "text-neutral-700",
              )}
              style={selected ? { color: p.color } : undefined}
            >
              {LABELS[p.name]}
            </span>

            {selected && (
              <span
                aria-hidden
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white"
                style={{ backgroundColor: p.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
