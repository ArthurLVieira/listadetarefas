import { ColorPicker } from "@/components/categories/ColorPicker";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import type { Category } from "@/models/Category";
import {
  categorySchema,
  type CategoryFormData,
} from "@/schemas/category.schema";
import { ApiError } from "@/services/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  open: boolean;
  initial?: Category | null;
  onClose: () => void;
  onSubmit: (date: CategoryFormData) => Promise<void>;
}

export function CategoryFormSheet({ open, initial, onClose, onSubmit }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = !!initial;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", color: null },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      color: initial?.color ?? null,
    });
  }, [open, initial, reset]);

  const submit = async (data: CategoryFormData) => {
    setFormError(null);
    try {
      await onSubmit({
        name: data.name.trim(),
        description: data.description,
        color: data.color,
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
      title={isEditing ? "Editar categoria" : "Nova catagoria"}
      footer={
        <Button
          type="submit"
          form="category-form"
          fullwidth
          loading={isSubmitting}
        >
          {isEditing ? "Salvar alterações" : "Criar categoria"}
        </Button>
      }
    >
      <form
        id="category-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-4 pb-4"
        noValidate
      >
        {formError && <Alert message={formError} />}

        <Input
          label="Nome"
          placeholder="Ex.: Trabalho, Pessoal, Estudos..."
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Observação"
          placeholder="Digite aqui..."
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-neutral-700">
            Cor
          </label>
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <ColorPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </form>
    </Sheet>
  );
}
