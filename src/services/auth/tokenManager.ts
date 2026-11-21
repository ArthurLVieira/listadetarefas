import axios from "axios";
import { env } from "../../config/env";
import type { RawUser } from "../../models/User";
import { jwtDecode } from "jwt-decode";
import type { AuthResponse } from "../../types/api";
import { Storage } from "@/utils/storage";

export const TOKEN_KEY = "@listadetarefas:token";
export const REFRESH_TOKEN_KEY = "@listadetarefas:refreshToken";
export const EXPIRES_KEY = "@listadetarefas:expiresAt";
export const USER_KEY = "@listadetarefas:user";

export type TokenEvent = "session:refreshd" | "session:expired";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: RawUser | null;
}

interface JwtPayload {
  sub: string;
  userId: number;
  name: string;
  iat: number;
  exp: number;
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

    if (!accessToken || !refreshToken || !expiresAt) {
      this.state = null;
      return;
    }

    const user = this.decodeUserFromToken(accessToken);

    if (!user || expiresAt <= Date.now()) {
      this.clearSession();
      return;
    }

    this.state = { accessToken, refreshToken, expiresAt, user };
    this.scheduleRefresh();
  }

  setSession(session: AuthResponse, remember: boolean): void {
    const user = this.decodeUserFromToken(session.accessToken);
    if (!user) throw new Error("Token de acesso inválido");

    Storage.setRemenbered(remember);

    const expiresAt = Date.now() + session.expiresIn;

    this.state = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt,
      user,
    };

    Storage.set(TOKEN_KEY, session.accessToken);
    Storage.set(REFRESH_TOKEN_KEY, session.refreshToken);
    Storage.set(EXPIRES_KEY, expiresAt);
    Storage.set(USER_KEY, user);

    this.cancelRefreshTimer();
    this.scheduleRefresh();
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

  isExpringSoon(threshold: number = 120_000): boolean {
    if (!this.state || !this.state.expiresAt) {
      return false;
    }

    return this.state.expiresAt - Date.now() < threshold;
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefreshToken().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!this.state || !this.state.refreshToken) {
      throw new Error("Sem refresh token disponível");
    }

    const { data } = await axios.post<AuthResponse>(
      `${this.baseUrl}/auth/refresh`,
      {
        refreshToken,
      },
    );

    this.setSession(data, Storage.isRemenbered());
    this.notifyListeners("session:refreshd");

    return data.accessToken;
  }

  private async refreshOrExpire(): Promise<void> {
    try {
      await this.refreshToken();
    } catch {
      this.clearSession();
      this.notifyListeners("session:expired");
    }
  }

  private cancelRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private static readonly DEFAULT_EXPIRY_THRESHOLD_MS = 120_000;

  isExpiringSoon(
    threshold: number = tokenManager.DEFAULT_EXPIRY_THRESHOLD_MS,
  ): boolean {
    if (!this.state?.expiresAt) return false;

    if (!this.state.accessToken) return false;

    const remaining = this.state.expiresAt - Date.now();

    return remaining <= threshold;
  }

  on(listener: (event: TokenEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(event: TokenEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  getRemainingTime(): number | null {
    if (!this.state || !this.state.expiresAt) {
      return null;
    }

    return this.state.expiresAt - Date.now();
  }

  private scheduleRefresh(): void {
    this.cancelRefreshTimer();

    if (!this.state || !this.state.expiresAt) {
      return;
    }

    const remainingTime = this.state.expiresAt - Date.now();
    if (remainingTime <= 0) {
      this.refreshOrExpire();
      return;
    }

    const delay = Math.max(remainingTime - 10_000, 0);
    this.refreshTimer = setTimeout(() => {
      void this.refreshOrExpire();
    }, delay);
  }

  decodeUserFromToken(token: string): RawUser | null {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return {
        email: payload.sub,
        name: payload.name,
        id: payload.userId,
      };
    } catch {
      return null;
    }
  }
}

export const tokenManagerInstance = new tokenManager();
