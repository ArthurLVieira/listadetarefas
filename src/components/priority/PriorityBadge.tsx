import type { PriorityName } from "@/models/Priority";
import clsx from "clsx";

const LABELS: Record<PriorityName, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

interface Props {
  name: PriorityName;
  color: string;
  compact?: boolean;
}

export function PriorityBadge({ name, color, compact }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full text-[11px] font-medium",
        compact ? "px-2 py-0.5" : "px-2.5 py-1",
      )}
      style={{
        backgroundColor: `${color}1A`,
        color: color,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      >
        {!compact && LABELS[name]}
      </span>
    </span>
  );
}
