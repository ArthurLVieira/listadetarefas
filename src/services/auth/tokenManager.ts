import { env } from "../../config/env";
import type { RawUser } from "../../models/User";
import type { UserResponse } from "../../types/api";
import { Storage } from "../../utils.storage";

export const TOKEN_KEY = "@listadetarefas:token";
export const REFRESH_TOKEN_KEY = "@listadetarefas:refreshToken";
export const EXPIRES_KEY = "@listadetarefas:expiresAt";
export const USER_KEY = "@listadetarefas:user";

export type TokenEvent = "session:refreshd" | "session:expired";

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  data: RawUser;
}

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: RawUser | null;
}

class tokenManager {
  private state: TokenState | null = null;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(event: TokenEvent) => void> = new Set();
  private baseUrl = env.apiUrl;

  constructor() {}

  hydrate(): void {
    const accessToken = Storage.get<string>(TOKEN_KEY);
    const refreshToken = Storage.get<string>(REFRESH_TOKEN_KEY);
    const expiresAt = Storage.get<number>(EXPIRES_KEY);
    const user = Storage.get<RawUser>(USER_KEY);

    if (accessToken && refreshToken && expiresAt && user) {
      this.state = {
        accessToken,
        refreshToken,
        expiresAt,
        user,
      };
      this.scheduleRefresh();
    } else {
      this.state = null;
    }
  }

  setSession(session: SessionResponse, remember: boolean): void {
    Storage.setRemenbered(remember);

    const expiresAt = Date.now() + session.expiresIn;

    this.state = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt,
      user: session.data,
    };

    Storage.set(TOKEN_KEY, session.accessToken);
    Storage.set(REFRESH_TOKEN_KEY, session.refreshToken);
    Storage.set(EXPIRES_KEY, expiresAt);
    Storage.set(USER_KEY, session.data);

    this.cancelRefreshTimer();
  }

  clearSession(): void {
    this.state = null;
    Storage.clearAuth();
    this.cancelRefreshTimer();
  }

  getAccessToken(): string | null {
    return this.state?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.state?.refreshToken ?? null;
  }

  getUser(): RawUser | null {
    return this.state?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.state !== null;
  }
}
