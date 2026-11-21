import clsx from "clsx";
import { Ban, Check } from "lucide-react";

const PALETTE = [
  "#EF4444", // red
  "#F97316", // orange (accent)
  "#F59E0B", // amber
  "#10B981", // emerald
  "#06B6D4", // cyan
  "#3B82F6", // primary
  "#6366F1", // indigo
  "#8B5CF6", // secondary
  "#EC4899", // pink
  "#737373", // neutral
] as const;

interface Props {
  value: string | null;
  onChange: (color: string | null) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Sem cor"
          aria-pressed={value === null}
          className={clsx(
            "h-10 rounded-2xl border-2 place-items-center transition-all",
            "active:scale-95",
            value === null
              ? "border-neutral-900 ring-2 ring-neutral-200"
              : "border-neutral-200 bg-white",
          )}
        >
          <Ban className="h-4 w-4 text-neutral-400" />
        </button>

        {PALETTE.map((color) => {
          const selected = value?.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={`Cor ${color}`}
              aria-pressed={selected}
              className={clsx(
                "relative h-10 rounded-2xl transition-all active:scale-95",
                "ring-offset-2",
                selected && "ring-2 ring-neutral-900",
              )}
              style={{ backgroundColor: color }}
            >
              {selected && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="color"
          value={value ?? "#3B82F6"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 rounded-xl border border-neutral-200 cursor-pointer bg-transparent"
          aria-label="Escolher cor personalizada"
        />
        <span className="text-xs text-neutral-500">
          Ou escolha uma cor personalizada
        </span>
      </div>
    </div>
  );
}
