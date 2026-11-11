import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-700 via-secondary-700 to-primary-900">
      {/* Painel esquerdo — só desktop */}
      <aside className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-6 w-6 text-accent-400" />
          TaskFlow
        </div>

        <div className="space-y-6 max-w-md">
          <h2 className="text-5xl font-semibold leading-tight tracking-tight">
            Organize seu dia,
            <br />
            <span className="text-accent-400">conquiste mais.</span>
          </h2>
          <p className="text-white/75 text-lg">
            Simples, rápido e focado no que importa. Suas tarefas, do seu jeito.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="h-1.5 w-12 rounded-full bg-accent-400" />
            <span className="h-1.5 w-12 rounded-full bg-white/30" />
            <span className="h-1.5 w-12 rounded-full bg-white/30" />
          </div>
        </div>

        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} TaskFlow
        </p>
      </aside>

      {/* Área do formulário — ocupa a tela toda no mobile */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 min-h-screen">
        {/* Marca no mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8 text-white">
          <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-accent-400" />
          </div>
          <span className="text-xl font-semibold">TaskFlow</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="mt-1.5 text-white/70 text-sm">{subtitle}</p>
          </div>

          {/* No mobile o card é "flush"; no desktop ganha padding extra */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/20 ring-1 ring-white/10 p-6 sm:p-8">
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-semibold text-neutral-900">
                {title}
              </h1>
              <p className="mt-1.5 text-neutral-500 text-sm">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        {/* Safe area para iOS home indicator */}
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </main>
    </div>
  );
}
