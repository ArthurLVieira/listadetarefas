import clsx from "clsx";
import { ListTodo, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  className?: string;
}

const NAV = [
  { to: "/", label: "Tarefas", icon: ListTodo, end: true },
  { to: "/categories", label: "Categorias", icon: Tag, end: false },
] as const;

export function BottomNav({ className }: Props) {
  return (
    <nav
      className={clsx(
        "fixed bottom-0 inset-x-0 z-30",
        "bg-white/95 backdrop-blur-md",
        "border-t border-neutral-200",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="grid grid-cols-2 max-w-md mx-auto p-2 gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center gap-0.5",
                "py-2 rounded-2xl min-h-[56px] transition-colors",
                isActive
                  ? "text-primary-600 bg-primary-50/60"
                  : "text-neutral-500 active:bg-neutral-100",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx(
                    "h-5 w-5 transition-all",
                    isActive && "stroke-[2.25]",
                  )}
                />
                <span className="text-[11px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
