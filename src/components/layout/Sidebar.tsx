import clsx from "clsx";
import { Home, ListTodo, Sparkles, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  className?: string;
}

const NAV = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/tasks", label: "Tarefas", icon: ListTodo, end: false },
  { to: "/categories", label: "Categorias", icon: Tag, end: false },
] as const;

export function Sidebar({ className }: Props) {
  return (
    <aside
      className={clsx(
        "bg-white border-r border-neutral-200 flex-col",
        className,
      )}
    >
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span
            className={clsx(
              "grid place-items-center h-10 w-10 rounded-2xl bg-gradient-to-br",
              "from-primary-500 to-secondary-600 shadow-md shadow-primary-500/20",
            )}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-neutral-900">TaskFlow</p>
            <p className="text-[11px] text-neutral-500">Organize seu dia</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-neutral-100">
        <p className="text-[11px] text-neutral-400">TaskFlow · v1</p>
      </div>
    </aside>
  );
}
