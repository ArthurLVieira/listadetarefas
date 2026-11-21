import { Button } from "@/components/ui/Button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";

export function HomePage() {
  const stats = { open: 0, today: 0, overdue: 0 };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-5">
      {/* ── Estatísticas rápidas ───────────────────── */}
      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        <StatChip
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Hoje"
          value={stats.today}
          tone="primary"
        />
        <StatChip
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label="Atrasadas"
          value={stats.overdue}
          tone="danger"
        />
        <StatChip
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Abertas"
          value={stats.open}
          tone="neutral"
        />
      </div>

      {/* ── Empty state (substituído pela lista quando o módulo existir) ── */}
      <div
        className="flex flex-col items-center text-center
                      py-14 lg:py-20 px-6"
      >
        <div
          className="mb-5 grid place-items-center h-16 w-16 rounded-3xl
                        bg-primary-50 ring-1 ring-primary-100"
        >
          <ListTodo className="h-7 w-7 text-primary-500" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Nenhuma tarefa por aqui
        </h2>
        <p className="mt-1.5 text-sm text-neutral-500 max-w-xs leading-relaxed">
          Crie sua primeira tarefa para começar a organizar o dia.
        </p>
        <Button
          className="mt-6"
          iconLeft={<Plus className="h-4 w-4" />}
          disabled
          title="Disponível após o módulo de tarefas"
        >
          Nova tarefa
        </Button>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "danger" | "neutral";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-700 ring-primary-100",
    danger: "bg-red-50 text-red-700 ring-red-100",
    neutral: "bg-white text-neutral-700 ring-neutral-200",
  };

  return (
    <div className={`rounded-2xl ring-1 p-3 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold leading-none">{value}</p>
    </div>
  );
}
