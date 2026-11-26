import { Task } from "@/models/Task";
import { formatDueDate } from "@/utils/date";
import clsx from "clsx";
import { Calendar, Check, Trash2 } from "lucide-react";
import { IconButton } from "../ui/IconButton";

const PRIORITY_LABEL: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

function priorityLabel(name: string | undefined | null): string {
  if (!name) return "";
  return PRIORITY_LABEL[String(name).toUpperCase()] ?? String(name);
}

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div
      className={clsx(
        "group flex items-start gap-3 p-3 rounded-2xl bg-white",
        "ring-1 ring-neutral-100 hover:ring-neutral-200 transition-all",
        task.completed && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Reabrir tarefa" : "Concluir tarefa"}
        aria-pressed={task.completed}
        className={clsx(
          "-m-2 p-2 mt-[2px] shrink-0 rounded-full transition-transform active:scale-90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        )}
      >
        <span
          className={clsx(
            "grid place-items-center h-6 w-6 rounded-full border-2 transition-all duration-150",
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-neutral-400 bg-white hover:border-primary-500 hover:bg-primary-50",
          )}
        >
          {task.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onEdit(task)}
        className="flex-1 min-w-0 text-left"
      >
        <p
          className={clsx(
            "text-sm font-medium leading-snug break-words transition-all",
            task.completed
              ? "line-through text-neutral-400"
              : "text-neutral-900",
          )}
        >
          {task.title}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2 py-0.5"
            style={{
              backgroundColor: `${task.priority.color}1A`,
              color: task.priority.color,
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: task.priority.color }}
            />
            {priorityLabel(task.priority.name)}
          </span>

          {task.category && (
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 text-[11px]",
                "text-neutral-700 rounded-full px-2 py-0.5 bg-neutral-100",
              )}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: task.category.color ?? "#A3A3A3" }}
              />
              {task.category.name}
            </span>
          )}

          {task.dueDate && (
            <span
              className={clsx(
                "inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5",
                task.overdue
                  ? "bg-red-50 text-red-700"
                  : task.dueToday
                    ? "bg-primary-50 text-primary-700"
                    : "bg-neutral-100 text-neutral-600",
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </button>

      <IconButton
        label="Excluir tarefa"
        variant="danger"
        onClick={() => onDelete(task)}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
