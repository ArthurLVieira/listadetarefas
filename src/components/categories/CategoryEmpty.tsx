import clsx from "clsx";
import { Plus, Tag } from "lucide-react";
import { Button } from "../ui/Button";

export function CategoryEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-16 animate-fade-in">
      <div
        className={clsx(
          "mb-5 grid place-items-center h-16 w-16 rounded-3xl",
          "bg-primary-50 ring-1 ring-primary-100",
        )}
      >
        <Tag className="h-7 w-7 text-primary-500" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900">
        Nenhuma categoria ainda
      </h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-xs">
        Categorias ajudam a agrupar suas tarefas por context - trabalho,
        estudos, casa...
      </p>
      <Button
        onClick={onCreate}
        className="mt-6"
        iconLeft={<Plus className="h-4 w-4" />}
      >
        Criar primeira categoria
      </Button>
    </div>
  );
}
