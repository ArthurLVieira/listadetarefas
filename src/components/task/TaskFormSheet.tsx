import { usePriority } from "@/contexts/usePriority";
import type { Task } from "@/models/Task";
import { taskSchema, type TaskFormData } from "@/schemas/task.schema";
import { ApiError } from "@/services/api-error";
import { fromLocalInput, toLocalInput } from "@/utils/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { PriorityPicker } from "../priority/PriorityPicker";
import { CategoryPicker } from "../categories/CategoryPicker";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

interface Props {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onDelete?: (task: Task) => void;
}

export function TaskFormSheet({
  open,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = !!initial;
  const { items: priorities } = usePriority();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: undefined,
      dueDate: "",
      priorityId: 0,
      categoryId: null,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!priorities.length) return; // espera carregar as prioridades

    reset({
      title: initial?.title ?? "",
      description: initial?.description ?? undefined,
      dueDate: toLocalInput(initial?.dueDate ?? null),
      priorityId:
        initial?.priority?.id ??
        priorities.find((p) => p.name === "MEDIUM")?.id ??
        priorities[0]?.id ??
        0,
      categoryId: initial?.category?.id ?? null,
    });
    setFormError(null);
  }, [open, initial, reset, priorities]);

  const submit = async (data: TaskFormData) => {
    setFormError(null);
    try {
      await onSubmit({
        ...data,
        description: data.description ?? undefined,
        dueDate:
          data.dueDate ? (fromLocalInput(data.dueDate) ?? undefined) : undefined,
      });
      onClose();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Não foi possível salvar",
      );
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar tarefa" : "Nova tarefa"}
      footer={
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            form="task-form"
            fullWidth
            loading={isSubmitting}
          >
            {isEditing ? "Salvar alterações" : "Criar tarefa"}
          </Button>

          {isEditing && onDelete && initial && (
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => onDelete(initial)}
              iconLeft={<Trash2 className="h-4 w-4" />}
              className="text-red-600 hover:bg-red-50"
            >
              Excluir tarefa
            </Button>
          )}
        </div>
      }
    >
      <form
        id="task-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-4 pb-1"
        noValidate
      >
        {formError && <Alert message={formError} />}

        <Input
          label="Título"
          placeholder="Ex.: Comprar leite, Revisar PR…"
          autoFocus
          maxLength={200}
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Detalhes, links, contexto…"
          maxLength={5000}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-neutral-700">
            Prazo (opcional)
          </label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <input
                type="datetime-local"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className={clsx(
                  "w-full h-12 px-4 text-base rounded-2xl border border-neutral-200",
                  "bg-white focus:outline-none focus:ring-4",
                  "focus:ring-primary-100 focus:border-primary-400",
                )}
              />
            )}
          />
          {errors.dueDate?.message && (
            <p className="text-xs text-red-600 pl-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-neutral-700">
            Prioridade
          </label>
          <Controller
            control={control}
            name="priorityId"
            render={({ field }) => (
              <PriorityPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-neutral-700">
            Categoria
          </label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <CategoryPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </form>
    </Sheet>
  );
}
