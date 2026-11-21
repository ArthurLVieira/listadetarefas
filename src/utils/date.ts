// src/features/tasks/utils/date.ts
const MS_DAY = 86_400_000;

/** Converte ISO do backend ("2026-11-22T10:30:00") para input datetime-local ("2026-11-22T10:30"). */
export function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

/** Converte input datetime-local para string aceita pelo backend LocalDateTime. */
export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value;
}

/** Rótulo curto e humano para exibição. */
export function formatDueDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / MS_DAY);

  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  if (diff > 1 && diff <= 6)
    return date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "");
  return date
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
}
