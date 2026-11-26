import { ListTodo, Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  message?: string;
  hint?: string;
  onCreate: () => void;
}

export function TaskEmpty({ message, hint, onCreate }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6 animate-fade-in">
      <div className="mb-5 place-items-center h-16 w-16 rounded-3xl bg-primary-50 ring-1 ring-primary-100">
        <ListTodo className="h-7 w-7 text-primary-500" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900">
        {message ?? "Nenhuma tarefa por aqui"}
      </h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-xs leading-relaxed">
        {hint ?? "Crie sua primeira tarefa para começar a organizar o dia."}
      </p>
      <Button
        onClick={onCreate}
        className="mt-6"
        iconLeft={<Plus className="h-4 w-4" />}
      >
        Nova tarefa
      </Button>
    </div>
  );
}
