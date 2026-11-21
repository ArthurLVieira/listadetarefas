import { Sidebar } from "./Sidebar";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] bg-neutral-50">
      {/* Sidebar — desktop only */}
      <Sidebar className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-40" />

      {/* Coluna principal */}
      <div className="lg:pl-64 flex flex-col min-h-[100dvh]">
        <AppHeader />

        <main className="flex-1 pb-24 lg:pb-8">
          <Outlet /> {/* ← ESSENCIAL: sem isso, nenhuma página aparece */}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav className="lg:hidden" />
    </div>
  );
}
