import { useLocation } from "react-router-dom";
import { getPageInfo } from "./PageInfo";
import { UserMenu } from "./UserMenu";

export function AppHeader() {
  const location = useLocation();
  const page = getPageInfo(location.pathname);
  const PageIcon = page.icon;

  return (
    <header
      className="sticky top-0 z-30 bg-white/85 backdrop-blur-md
                 border-b border-neutral-200 pt-[env(safe-area-inset-top)]"
    >
      <div className="h-14 px-4 lg:px-8 flex items-center gap-3">
        {/* ── Mobile: ícone + título compacto ─────────── */}
        <div className="lg:hidden flex items-center gap-2.5 min-w-0 mr-auto">
          <span
            className="grid place-items-center h-9 w-9 rounded-2xl shrink-0
                           bg-gradient-to-br from-primary-500 to-secondary-600"
          >
            <PageIcon className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate leading-tight">
              {page.title}
            </p>
            <p className="text-[10px] text-neutral-500 truncate leading-tight">
              {page.subtitle}
            </p>
          </div>
        </div>

        {/* ── Desktop: ícone + título + subtítulo ────── */}
        <div className="hidden lg:flex items-center gap-3 min-w-0 mr-auto">
          <span
            className="grid place-items-center h-9 w-9 rounded-xl shrink-0
                           bg-primary-50 text-primary-600"
          >
            <PageIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-900 leading-tight truncate">
              {page.title}
            </h1>
            <p className="text-xs text-neutral-500 leading-tight truncate">
              {page.subtitle}
            </p>
          </div>
        </div>

        {/* ── Perfil (sempre à direita) ───────────────── */}
        <UserMenu />
      </div>
    </header>
  );
}
