import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "google";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium select-none " +
  "rounded-2xl transition-all duration-150 " +
  "active:scale-[0.98] active:brightness-95 " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "whitespace-nowrap";

const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-3.5 text-sm",
  md: "min-h-[44px] px-4 text-[15px]",
  lg: "min-h-[52px] px-6 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent-500 to-accent-600 text-white " +
    "shadow-lg shadow-accent-500/25 " +
    "hover:from-accent-600 hover:to-accent-700 focus-visible:ring-accent-400",
  secondary:
    "bg-gradient-to-r from-primary-500 to-primary-600 text-white " +
    "shadow-lg shadow-primary-500/25 hover:from-primary-600 hover:to-primary-700 " +
    "focus-visible:ring-primary-400",
  outline:
    "border border-neutral-200 bg-white text-neutral-800 " +
    "hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-primary-400",
  ghost:
    "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-300",
  google:
    "border border-neutral-200 bg-white text-neutral-800 " +
    "hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-primary-400",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      fullWidth,
      iconLeft,
      iconRight,
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
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  ),
);
Button.displayName = "Button";
