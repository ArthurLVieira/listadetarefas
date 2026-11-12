import { LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-neutral-900">
                {user?.name?.split(" ")[0] ?? "Usuário"}
              </p>
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
          </div>

          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5">
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">
            Tudo pronto 🎉
          </h2>
          <p className="text-sm text-neutral-500">
            Sua sessão está ativa. A partir daqui você pode implementar a lista
            de tarefas consumindo{" "}
            <code className="text-primary-600">/api/tasks</code> — o header{" "}
            <code>Authorization</code> já é injetado automaticamente.
          </p>
        </div>
      </main>
    </div>
  );
}
