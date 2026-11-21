import { useApiStatus } from "@/hooks/useApiStatus";
import clsx from "clsx";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";

export function ApiStatusBanner() {
  const { status, retry } = useApiStatus();

  if (status === "online" || status === "unknown") return null;

  const isChecking = status === "checking";

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed top-0 inset-x-0 z-[55]",
        "-[env(safe-area-inset-top)]",
        "bg-amber-50 border-b border-amber-200 text-amber-900 text-sm",
        "animate-slide-down",
      )}
    >
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-600" />

        <p className="flex-1 leading-snug">
          {isChecking
            ? "Verificando conexão com o servidor…"
            : "Sem conexão com o servidor. Algumas ações podem falhar."}
        </p>

        <button
          type="button"
          onClick={retry}
          disabled={isChecking}
          className={clsx(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
            "text-xs font-medium text-amber-800",
            "hover:bg-amber-100 active:bg-amber-200",
            "disabled:opacity-50 disabled:pointer-events-none",
            "transition-colors min-h-[32px]",
          )}
        >
          {isChecking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          {isChecking ? "Verificando" : "Reconectar"}
        </button>
      </div>
    </div>
  );
}
