export const Storage = {
  isRemenbered(): boolean {
    return localStorage.getItem("REMENBER_KEY") === "true";
  },
  setRemenbered(value: boolean): void {
    localStorage.setItem("REMENBER_KEY", String(value));
    if (!value) {
      localStorage.removeItem("@listadetarefas:token");
      localStorage.removeItem("@listadetarefas:refreshToken");
      localStorage.removeItem("@listadetarefas:expiresAt");
      localStorage.removeItem("@listadetarefas:user");
    }
  },
  active(): globalThis.Storage {
    return this.isRemenbered() ? localStorage : sessionStorage;
  },
  get<T>(key: string): T | null {
    const raw =
      this.active().getItem(key) ??
      sessionStorage.getItem(key) ??
      localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    this.active().setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
  clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  },
  clearAuth(): void {
    [
      "@listadetarefas:token",
      "@listadetarefas:refreshToken",
      "@listadetarefas:expiresAt",
      "@listadetarefas:user",
    ].forEach((key) => this.remove(key));
  },
};
