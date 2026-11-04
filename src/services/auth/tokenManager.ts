import axios from "axios";
import { env } from "../../config/env";
import type { RawUser } from "../../models/User";
import { Storage } from "../../utils.storage";
import { jwtDecode } from "jwt-decode";

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
      throw new Error("No refresh token available");
    }

    const { data } = await axios.post<SessionResponse>(
      `${this.baseUrl}/auth/refresh`,
      {
        refreshToken,
      },
    );

    this.state = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn,
      user: data.data,
    };

    Storage.set(TOKEN_KEY, data.accessToken);
    Storage.set(REFRESH_TOKEN_KEY, data.refreshToken);
    Storage.set(EXPIRES_KEY, this.state.expiresAt);
    Storage.set(USER_KEY, data.data);

    this.scheduleRefresh();
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

    const refreshTime = Math.max(remainingTime - 10000, 0);
    this.refreshTimer = setTimeout(() => {
      void this.refreshOrExpire();
    }, refreshTime);
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
