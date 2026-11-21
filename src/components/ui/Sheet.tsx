import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-[60] flex items-end sm:items-center justify-center",
        "bg-neutral-900/40 backdrop-blur-sm animate-fade-in",
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "w-full sm:max-w-md bg-white shadow-2xl",
          "rounded-t-3xl sm:rounded-3xl",
          "animate-slide-up sm:animate-fade-in",
          "max-h-[90dvh] flex flex-col",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div className="flex items-center mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-neutral-200" />

        <header className="flex items-center justify-between px-5 pt-3 pb-3">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={clsx(
              "grid place-items-center h-9 w-9 rounded-full",
              "text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200",
              "transition-colors",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 overflow-y-auto">{children}</div>

        {footer && (
          <footer className="px-5 pt-3 pb-4 border-t border-neutral-100 mt-3">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
