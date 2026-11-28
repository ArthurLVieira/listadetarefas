import { UserProfileSheet } from "@/components/forms/profile/UserProfileSheet";
import { ChangePasswordSheet } from "@/components/forms/profile/ChangePasswordSheet";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";
import { ChevronDown, KeyRound, LogOut, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
  }, [open]);

  if (!user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase() ?? "")
    .join("");

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
        className={clsx(
          "flex items-center gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-2xl",
          "hover:bg-neutral-100 active:bg-neutral-200 transition-colors",
        )}
      >
        <span
          className={clsx(
            "grid place-items-center h-9 w-9 rounded-full",
            "bg-gradient-to-br from-primary-500 to-secondary-600",
            "text-white text-xs font-semibold ring-2 ring-white shadow-sm",
          )}
        >
          {initials || "U"}
        </span>

        <span className="hidden sm:flex flex-col items-start leading-tight min-w-0 max-w-[140px]">
          <span className="text-xs font-semibold text-neutral-900 truncate w-full text-left">
            {user.name.split(" ")[0]}
          </span>
          <span className="text-[10px] text-neutral-500 truncate w-full text-left">
            {user.email}
          </span>
        </span>

        <ChevronDown
          className={clsx(
            "hidden sm:block h-3.5 w-3.5 text-neutral-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute right-0 mt-2 w-64 bg-white rounded-2xl",
            "shadow-xl ring-1 ring-black/5 p-2 animate-fade-in z-50",
          )}
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>

          <div className="my-1 border-t border-neutral-100" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setProfileOpen(true);
            }}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl",
              "text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
              "transition-colors",
            )}
          >
            <Pencil className="h-4 w-4" />
            Editar usuário
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setPasswordOpen(true);
            }}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl",
              "text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
              "transition-colors",
            )}
          >
            <KeyRound className="h-4 w-4" />
            Alterar senha
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl",
              "text-sm text-red-600 hover:bg-red-50 active:bg-red-100",
              "transition-colors",
            )}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
      {profileOpen && (
        <UserProfileSheet onClose={() => setProfileOpen(false)} />
      )}
      {passwordOpen && (
        <ChangePasswordSheet onClose={() => setPasswordOpen(false)} />
      )}
    </div>
  );
}
