import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Sheet } from "./Sheet";
import { Alert } from "./Alert";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "confirmar",
  cancelLabel = "cancelar",
  destructive = false,
  loading = false,
  errorMessage,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex gap-2">
          {errorMessage && <Alert message={errorMessage} className="mb-3" />}
          <Button
            variant="outline"
            onClick={onCancel}
            fullWidth
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "primary" : "secondary"}
            onClick={onConfirm}
            fullWidth
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        {destructive && (
          <div className="mb-3 grid place-items-center text-center py-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
        )}
        <p className="text-sm text-neutral-600 leading-relaxed">{message}</p>
      </div>
    </Sheet>
  );
}
