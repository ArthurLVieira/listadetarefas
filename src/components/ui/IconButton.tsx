import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "ghost" | "danger";
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, variant = "ghost", className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        "grid place-items-center h-11 w-11 rounded-2xl transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "ghost" &&
          "text-neutral-500 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-300",
        variant === "danger" &&
          "text-red-500 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-300",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";
