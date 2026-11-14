import clsx from "clsx";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  hint?: string;
  iconLeft?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, iconLeft, className, id, ...rest }, ref) => {
    const reactId = useId();
    const inputId = id ?? rest.name;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-neutral-700"
        >
          {label}
        </label>

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={clsx(
              "w-full min-h-[48px] px-4 text-base rounded-2xl border bg-white",
              "placeholder:text-neutral-400 transition-all",
              "focus:outline-none focus:ring-4",
              iconLeft && "pl-11",
              error
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-neutral-200 focus:ring-primary-100 focus:border-primary-400",
              className,
            )}
            {...rest}
          />
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-red-600 pl-1">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-neutral-500 pl-1">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
