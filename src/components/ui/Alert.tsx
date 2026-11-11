import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import type React from "react";

interface AlertProps {
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ message, className }) => {
  return (
    <div
      className={clsx(
        "flex items-start gap-2 px-4 py-3 rounded-2xl text-sm",
        "bg-red-50 border border-red-100 text-red-700",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
