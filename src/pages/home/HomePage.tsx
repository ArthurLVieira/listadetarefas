// src/pages/HomePage.tsx
// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  ListTodo,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Tag,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { TaskFormData } from "@/schemas/task.schema";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useTask } from "@/hooks/useTask";
import { useCategory } from "@/hooks/useCategories";
import type { Task } from "@/models/Task";
import { TaskItem } from "@/components/task/TaskItem";
import { TaskFormSheet } from "@/components/task/TaskFormSheet";
import clsx from "clsx";

const PREVIEW_LIMIT = 5;

export function HomePage() {
  const { user } = useAuth();
  const { items, loading, error, refetch, create, setCompletion } = useTask();
  const { items: categories, loading: categoriesLoading } = useCategory();
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";

  const stats = useMemo(() => {
    const open = items.filter((t) => !t.completed);
    return {
      open: open.length,
      overdue: open.filter((t) => t.overdue).length,
      today: open.filter((t) => t.dueToday).length,
      completed: items.length - open.length,
    };
  }, [items]);

  const preview = useMemo<Task[]>(() => {
    const open = items.filter((t) => !t.completed);
    const overdue = open.filter((t) => t.overdue);
    const today = open.filter((t) => t.dueToday);
    const upcoming = open.filter((t) => t.upcoming);
    const noDate = open.filter((t) => t.noDueDate);
    return [...overdue, ...today, ...upcoming, ...noDate].slice(
      0,
      PREVIEW_LIMIT,
    );
  }, [items]);

  const toggle = async (task: Task) => {
    try {
      await setCompletion(task.id, !task.completed);
    } catch {
      /* tratado pelo Alert global */
    }
  };

  const submitForm = async (data: TaskFormData) => {
    await create({
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
      priorityId: data.priorityId,
      categoryId: data.categoryId,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-5 lg:py-6 space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900 leading-tight">
          Olá, {firstName} 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {stats.open === 0
            ? "Nada em aberto. Bom trabalho!"
            : stats.overdue > 0
              ? `Você tem ${stats.overdue} tarefa${stats.overdue > 1 ? "s" : ""} atrasada${stats.overdue > 1 ? "s" : ""}.`
              : stats.today > 0
                ? `${stats.today} tarefa${stats.today > 1 ? "s" : ""} para hoje.`
                : `${stats.open} tarefa${stats.open > 1 ? "s" : ""} em aberto.`}
        </p>
      </header>

      {error && (
        <div className="flex items-center gap-2">
          <Alert message={error} className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void refetch()}
            aria-label="Recarregar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3">
        <StatCard
          icon={<ListTodo className="h-4 w-4" />}
          label="Abertas"
          value={stats.open}
          tone="primary"
          loading={loading}
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Atrasadas"
          value={stats.overdue}
          tone="danger"
          loading={loading}
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Hoje"
          value={stats.today}
          tone="accent"
          loading={loading}
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Feitas"
          value={stats.completed}
          tone="success"
          loading={loading}
        />
      </div>

      <Button
        onClick={() => setFormOpen(true)}
        fullWidth
        size="lg"
        iconLeft={<Plus className="h-4 w-4" />}
      >
        Nova tarefa
      </Button>

      {/* Preview de tarefas */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-neutral-900">
            Precisa de atenção
          </h2>
          {items.length > 0 && (
            <Link
              to="/tasks"
              className="text-xs font-medium text-primary-600 hover:text-primary-700
                         inline-flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
          </div>
        ) : preview.length === 0 ? (
          <div className="rounded-2xl bg-white ring-1 ring-neutral-100 p-6 text-center">
            <p className="text-sm text-neutral-500 mb-3">
              Nada por aqui. Aproveite o dia ☀️
            </p>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              Criar uma tarefa
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {preview.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggle}
                onEdit={() => navigate("/tasks")}
                onDelete={() => navigate("/tasks")}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-neutral-900">Categorias</h2>
          <Link
            to="/categories"
            className={clsx(
              "text-xs font-medium text-primary-600 hover:text-primary-700",
              "inline-flex items-center gap-1",
            )}
          >
            Gerenciar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-[60px] rounded-2xl bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Link
            to="/categories"
            className={clsx(
              "flex items-center gap-3 p-4 rounded-2xl bg-white",
              "ring-1 ring-neutral-100 hover:ring-neutral-200 transition-all",
            )}
          >
            <span
              className={clsx(
                "grid place-items-center h-10 w-10 rounded-2xl",
                "bg-secondary-50 ring-1 ring-secondary-100 shrink-0",
              )}
            >
              <Tag className="h-5 w-5 text-secondary-600" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900">
                Crie sua primeira categoria
              </p>
              <p className="text-xs text-neutral-500">
                Agrupe tarefas por contexto
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400" />
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to="/categories"
                className={clsx(
                  "group flex items-center gap-2.5 p-3 rounded-2xl bg-white",
                  "ring-1 ring-neutral-100 hover:ring-neutral-200",
                  "transition-all active:scale-[0.99]",
                )}
              >
                <span
                  aria-hidden
                  className="h-9 w-9 rounded-xl shrink-0 ring-1 ring-black/5"
                  style={{ backgroundColor: category.color ?? "#E5E5E5" }}
                />
                <span className="text-sm font-medium text-neutral-900 truncate">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <TaskFormSheet
        open={formOpen}
        initial={null}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "danger" | "accent" | "success";
  loading?: boolean;
}

function StatCard({ icon, label, value, tone, loading }: StatCardProps) {
  const tones = {
    primary: "bg-primary-50 text-primary-700 ring-primary-100",
    danger: "bg-red-50 text-red-700 ring-red-100",
    accent: "bg-accent-50 text-accent-700 ring-accent-100",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  } as const;

  return (
    <div className={`rounded-2xl ring-1 p-3 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold leading-none">
        {loading ? "—" : value}
      </p>
    </div>
  );
}
