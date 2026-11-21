import clsx from "clsx";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
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
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full px-4 py-3 text-base rounded-2xl border bg-white resize-none",
            "placeholder:text-neutral-400 transition-all focus:outline-none focus:ring-4",
            error
              ? "border-red-300 focus:ring-red-100 focus:border-red-400"
              : "border-neutral-200 focus:ring-primary-100 focus:border-primary-400",
            className,
          )}
          {...rest}
        >
          {error && <p className="text-xs text-red-600 pl-1">{error}</p>}
        </textarea>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
