import type { TaskFilter } from "@/types/api";
import clsx from "clsx";

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "open", label: "Abertas" },
  { value: "completed", label: "Concluídas" },
];

interface Props {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
}

export function TaskFilterBar({ value, onChange }: Props) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-neutral-100">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={clsx(
              "px-3 h-8 rounded-xl text-xs font-medium transition-all",
              active
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
