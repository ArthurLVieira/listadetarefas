import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  title: string;
  count: number;
  defaultOpen?: boolean;
  tone?: "neutral" | "danger" | "primary" | "success";
  autoExpand?: boolean;
  children: ReactNode;
}

export function TaskGroup({
  title,
  count,
  defaultOpen = true,
  tone = "neutral",
  autoExpand = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const prevCount = useRef(count);

  useEffect(() => {
    if (autoExpand && prevCount.current === 0 && count > 0) {
      setOpen(true);
    }

    prevCount.current = count;
  }, [count, autoExpand]);

  if (count === 0) return null;

  const toneCls = {
    danger: "text-red-700",
    primary: "text-primary-700",
    success: "text-emerald-700",
    neutral: "text-neutral-700",
  }[tone];

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 w-full text-left group/header
                   py-1 -mx-1 px-1 rounded-lg hover:bg-neutral-50 transition-colors"
        aria-expanded={open}
      >
        <ChevronDown
          className={clsx(
            "h-4 w-4 text-neutral-400 transition-transform shrink-0",
            !open && "-rotate-90",
          )}
        />
        <h2 className={clsx("text-sm font-semibold", toneCls)}>{title}</h2>
        <span className="text-xs text-neutral-400 font-normal">({count})</span>
      </button>

      {open && <div className="space-y-2">{children}</div>}
    </section>
  );
}
