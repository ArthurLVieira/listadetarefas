import { TaskEmpty } from "@/components/task/TaskEmpty";
import { TaskFilterBar } from "@/components/task/TaskFilterBar";
import { TaskFormSheet } from "@/components/task/TaskFormSheet";
import { TaskGroup } from "@/components/task/TaskGroup";
import { TaskItem } from "@/components/task/TaskItem";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTasks } from "@/hooks/useTask";
import type { Task } from "@/models/Task";
import type { TaskFormData } from "@/schemas/task.schema";
import { ApiError } from "@/services/api-error";
import {
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Toast {
  message: string;
  tone: "success" | "error";
}

export function TasksPage() {
  const {
    loading,
    error,
    filteredItems,
    filter,
    setFilter,
    refetch,
    create,
    update,
    setCompletion,
    remove,
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, tone: Toast["tone"] = "success") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2200);
  };

  const groups = useMemo(() => {
    const open = filteredItems.filter((t) => !t.completed);
    const done = filteredItems.filter((t) => t.completed);

    return {
      overdue: open.filter((t) => t.overdue),
      today: open.filter((t) => t.dueToday),
      upcoming: open.filter((t) => t.upcoming),
      noDate: open.filter((t) => t.noDueDate),
      completed: done,
      openTotal: open.length,
    };
  }, [filteredItems]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const submitForm = async (data: TaskFormData) => {
    const payload = {
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
      priorityId: data.priorityId,
      categoryId: data.categoryId,
    };
    if (editing) {
      await update(editing.id, payload);
      showToast("Tarefa atualizada");
    } else {
      await create(payload);
      showToast("Tarefa criada");
    }
  };

  const toggle = async (task: Task) => {
    const wasCompleted = task.completed;
    try {
      await setCompletion(task.id, !wasCompleted);
      showToast(
        wasCompleted ? "Tarefa reaberta" : "Tarefa concluída",
        "success",
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Erro ao atualizar tarefa";
      showToast(msg, "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await remove(deleting.id);
      setDeleting(null);
      showToast("Tarefa excluída");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.firstErrorMessage() : "Erro ao excluir",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const isEmpty = filteredItems.length === 0;
  const emptyMessage =
    filter === "completed"
      ? "Nenhuma tarefa concluída"
      : filter === "open"
        ? "Nada em aberto 🎉"
        : undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-5 lg:py-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <TaskFilterBar value={filter} onChange={setFilter} />

        <div className="flex items-center gap-1.5">
          {error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void refetch()}
              aria-label="Recarregar"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={openCreate}
            iconLeft={<Plus className="h-4 w-4" />}
          >
            Nova
          </Button>
        </div>
      </div>

      {error && <Alert message={error} />}

      {/* Conteúdo */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      ) : isEmpty ? (
        <TaskEmpty message={emptyMessage} onCreate={openCreate} />
      ) : (
        <div className="space-y-5">
          <TaskGroup
            title="Atrasadas"
            count={groups.overdue.length}
            tone="danger"
          >
            {groups.overdue.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </TaskGroup>

          <TaskGroup title="Hoje" count={groups.today.length} tone="primary">
            {groups.today.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </TaskGroup>

          <TaskGroup title="Próximas" count={groups.upcoming.length}>
            {groups.upcoming.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </TaskGroup>

          <TaskGroup title="Sem prazo" count={groups.noDate.length}>
            {groups.noDate.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </TaskGroup>

          <TaskGroup
            title="Concluídas"
            count={groups.completed.length}
            tone="success"
            defaultOpen={false}
            autoExpand
          >
            {groups.completed.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={toggle}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </TaskGroup>
        </div>
      )}

      <TaskFormSheet
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
        onDelete={(task) => {
          setFormOpen(false);
          setDeleting(task);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Excluir tarefa"
        message={deleting ? `Excluir "${deleting.title}"?` : ""}
        confirmLabel="Excluir"
        destructive
        loading={deleteLoading}
        errorMessage={deleteError}
        onCancel={() => {
          setDeleting(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[70]",
            "inline-flex items-center gap-2 px-4 h-11 rounded-2xl shadow-lg",
            "text-sm font-medium animate-slide-up",
            toast.tone === "success"
              ? "bg-neutral-900 text-white"
              : "bg-red-600 text-white",
          ].join(" ")}
        >
          {toast.tone === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
