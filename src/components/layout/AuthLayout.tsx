import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="relative min-h-[100dvh] flex bg-gradient-to-br from-primary-700 via-secondary-700 to-primary-900 overflow-hidden">
      {/* Blobs decorativos — controlados para não cortarem */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl"
      />

      {/* Painel esquerdo — só a partir de lg */}
      <aside className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-2.5 text-xl font-semibold">
          <span className="grid place-items-center h-10 w-10 rounded-2xl bg-white/10 backdrop-blur">
            <Sparkles className="h-5 w-5 text-accent-400" />
          </span>
          TaskFlow
        </div>

        <div className="space-y-6 max-w-md">
          <h2 className="text-5xl font-semibold leading-[1.1] tracking-tight">
            Organize seu dia,
            <br />
            <span className="text-accent-400">conquiste mais.</span>
          </h2>
          <p className="text-white/75 text-lg leading-relaxed">
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
      <main
        className="relative flex-1 flex flex-col items-center justify-center
                   px-4 sm:px-6
                   py-[max(1rem,var(--safe-top))] pb-[max(1rem,var(--safe-bottom))]"
      >
        {/* Marca compacta — só mobile/tablet */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-7 animate-fade-in">
          <span className="grid place-items-center h-12 w-12 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20">
            <Sparkles className="h-6 w-6 text-accent-400" />
          </span>
          <span className="text-lg font-semibold text-white">TaskFlow</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Título — apenas no mobile (o card já tem no desktop) */}
          <div className="mb-5 text-center lg:hidden">
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="mt-1.5 text-white/70 text-sm">{subtitle}</p>
          </div>

          {/* Card principal — glass no mobile, branco sólido no desktop */}
          <div
            className="rounded-3xl bg-white/[0.97] backdrop-blur-xl
                          ring-1 ring-white/20
                          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]
                          p-5 sm:p-7 md:p-8"
          >
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-semibold text-neutral-900">
                {title}
              </h1>
              <p className="mt-1.5 text-neutral-500 text-sm">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
