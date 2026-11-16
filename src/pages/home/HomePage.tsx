// src/pages/HomePage.tsx
import { LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

export function HomePage() {
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Usuário";

  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      {/* Header sticky respeitando safe-top */}
      <header className="sticky top-0 z-10 bg-white/85 backdrop-blur
                         border-b border-neutral-200
                         pt-[var(--safe-top)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-2xl
                            bg-gradient-to-br from-primary-500 to-secondary-600
                            flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {firstName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={logout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4
                       pb-[max(1.5rem,var(--safe-bottom))]">
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">
            Tudo pronto 🎉
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Sua sessão está ativa. A partir daqui você pode implementar a lista de
            tarefas consumindo{" "}
            <code className="text-primary-600 break-all">/api/tasks</code>.
          </p>
        </Card>
      </main>
    </div>
  );
}