import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "ghost" | "google";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullwidth?: boolean;
}

const base = clsx(
  "inline-flex items-center justify-center gap-2 h-12 px-5 text-[15px] font-medium rounded-2xl",
  "transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
);

const variants: Record<Variant, string> = {
  primary: clsx(
    "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/25",
    "hover:from-accent-600 hover:to-accent-700 focus-visible:ring-accent-400",
  ),
  outline:
    "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 focus-visible:ring-primary-400",
  ghost: "text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-300",
  google: clsx(
    "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100",
    "focus-visible:ring-primary-400",
  ),
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = "primary",
      loading,
      fullwidth,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        base,
        variants[variant],
        fullwidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
