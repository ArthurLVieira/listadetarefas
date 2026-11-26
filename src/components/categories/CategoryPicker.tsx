import { useCategory } from "@/hooks/useCategories";
import clsx from "clsx";
import { Ban } from "lucide-react";

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
}

export function CategoryPicker({ value, onChange }: Props) {
  const { items } = useCategory();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        className={clsx(
          "shrink-0 inline-flex items-center gap-1.5 px-3 h-10 rounded-2xl border text-sm font-medium transition-all active:scale-95",
          value === null
            ? "border-neutral-900 bg-neutral-100 text-neutral-900"
            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
        )}
      >
        <Ban className="h-3.5 w-3.5" />
        Sem categoria
      </button>

      {items.map((c) => {
        const selected = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={selected}
            className={clsx(
              "shrink-0 inline-flex items-center gap-1.5 px-3 h-10 rounded-2xl border text-sm font-medium transition-all active:scale-95",
              selected
                ? "border-neutral-900 bg-neutral-100 text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
            )}
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: c.color ?? "#A3A3A3" }}
            />
            {c.name}
          </button>
        );
      })}

      {items.length === 0 && (
        <p className="text-xs text-neutral-400 self-center px-2">
          Nenhuma categoria — crie em <strong>Categorias</strong>
        </p>
      )}
    </div>
  );
}
