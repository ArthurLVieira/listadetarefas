import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-neutral-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full, h-12 text-[15px] rounded-2xl border bg-white/90 backdrop-blur",
            "placeholder:text-neutral-400 transition-all",
            error
              ? "border-red-300 focus:ring-red-100 focus:border-primary-400"
              : "border-neutral-200 focus:ring-primary-100 focus:border-primary-400",
            className,
          )}
          {...rest}
        />
        {error && <p className="text-xs text-red-600 pl-1">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
