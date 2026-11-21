import type { Category } from "@/models/Category";
import clsx from "clsx";
import { IconButton } from "../ui/IconButton";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  category: Category;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

export function CategoryItem({ category, onEdit, onDelete }: Props) {
  return (
    <div
      className={clsx(
        "group flex items-center gap-3 p-3 rounded-2xl bg-white",
        "ring-1 ring-neutral-100 hover:ring-neutral-200 transition-all",
      )}
    >
      <span
        aria-hidden
        className="h-10 w-10 rounded-2xl shrink-0 ring-1 ring-black/5"
        style={{
          backgroundColor: category.color ?? "#E5E5E5",
        }}
      />

      <div className="min-w-0 flex-1">
        <p className="font-medium text-neutral-900 truncate">{category.name}</p>
        <p className="text-xs text-neutral-500">
          {category.color ? category.color.toUpperCase() : "Sem cor"}
        </p>
      </div>

      <div className="flex items-center gap-0.5">
        <IconButton label="Editar categoria" onClick={() => onEdit(category)}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Excluir categoria"
          variant="danger"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
