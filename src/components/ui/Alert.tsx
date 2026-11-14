import clsx from "clsx";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type React from "react";

type Variant = "error" | "success" | "info";

const config = {
  error: {
    icon: AlertCircle,
    cls: "bg-red-50   border-red-100   text-red-700",
  },
  success: {
    icon: CheckCircle2,
    cls: "bg-emerald-50 border-emerald-100 text-emerald-700",
  },
  info: {
    icon: Info,
    cls: "bg-primary-50 border-primary-100 text-primary-700",
  },
} as const;

interface AlertProps {
  message: string;
  variant?: Variant;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  variant = "error",
  className,
}) => {
  const { icon: Icon, cls } = config[variant];

  return (
    <div
      role="alert"
      className={clsx(
        "flex items-start gap-2.5 px-4 py-3 rounded-2xl border text-sm",
        "animate-fade-in",
        cls,
        className,
      )}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span className="leading-relaxed break-words">{message}</span>
    </div>
  );
};
