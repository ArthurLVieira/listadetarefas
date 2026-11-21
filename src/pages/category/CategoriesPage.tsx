import { CategoryEmpty } from "@/components/categories/CategoryEmpty";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryFormSheet } from "@/components/forms/category/CategoryFormSheet";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCategory } from "@/hooks/useCategories";
import { Category } from "@/models/Category";
import type { CategoryFormData } from "@/schemas/category.schema";
import { ApiError } from "@/services/api-error";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

export function CategoriesPage() {
  const {
    items,
    loading,
    error,
    limitReached,
    maxCategories,
    refetch,
    create,
    update,
    remove,
  } = useCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deletingError, setDeletingError] = useState<string | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (payload: Category) => {
    setEditing(payload);
    setFormOpen(true);
  };

  const submitForm = async (data: CategoryFormData) => {
    if (editing) await update(editing.id, data);
    else await create(data);
  };

  const requestDelete = (category: Category) => {
    setDeletingError(null);
    setDeleting(category);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingError(null);
    setDeletingLoading(true);
    try {
      await remove(deleting.id);
      setDeleting(null);
    } catch (err) {
      setDeletingError(
        err instanceof ApiError ? err.firstErrorMessage() : "Erro ao excluir",
      );
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-5 lg:py-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {loading
            ? "Carregando…"
            : items.length === 0
              ? "Nenhuma categoria ainda"
              : `${items.length} de ${maxCategories} categoria${
                  items.length > 1 ? "s" : ""
                }`}
        </p>

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
          {items.length > 0 && (
            <Button
              size="sm"
              onClick={openCreate}
              disabled={limitReached}
              title={
                limitReached
                  ? `Limite de ${maxCategories} categorias atingido`
                  : undefined
              }
              iconLeft={<Plus className="h-4 w-4" />}
            >
              Nova
            </Button>
          )}
        </div>
      </div>

      {/* Erro de carga */}
      {error && <Alert message={error} />}

      {/* Conteúdo */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      ) : items.length === 0 ? (
        <CategoryEmpty onCreate={openCreate} />
      ) : (
        <CategoryList
          categories={items}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      )}

      {/* Sheet (create / edit) */}
      <CategoryFormSheet
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        open={!!deleting}
        title="Excluir categoria"
        message={
          deleting
            ? `Excluir "${deleting.name}"? As tarefas dessa categoria não serão apagadas — elas ficarão sem categoria.`
            : ""
        }
        confirmLabel="Excluir"
        destructive
        loading={deletingLoading}
        errorMessage={deletingError}
        onCancel={() => {
          setDeleting(null);
          setDeletingError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
