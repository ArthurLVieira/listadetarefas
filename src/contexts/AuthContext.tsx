import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RawUser } from "../models/User";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/api";
import { tokenManagerInstance } from "../services/auth/tokenManager";
import { authRepository } from "../services/api";
import { ApiError } from "@/services/api-error";

const OAUTH2_REMEMBER_KEY = "oauth2:remember";

export interface OAuth2CallBackParams {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
}

export interface AuthContextValue {
  user: RawUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest, remember?: boolean) => Promise<void>;
  register: (data: RegisterRequest, remember?: boolean) => Promise<void>;
  loginWithGoogle: (remember?: boolean) => void;
  completeOAuuth2Login: (Params: OAuth2CallBackParams) => boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RawUser | null>(
    tokenManagerInstance.getUser(),
  );
  const [isLoading, setIsLoading] = useState(true);

  const sync = useCallback(() => setUser(tokenManagerInstance.getUser()), []);

  useEffect(() => {
    tokenManagerInstance.hydrate();
    sync();
    setIsLoading(false);
  }, [sync]);

  useEffect(() => {
    return tokenManagerInstance.on((event) => {
      if (event === "session:refreshd") sync();
      if (event === "session:expired") setUser(null);
    });
  }, [sync]);

  const persistSession = useCallback(
    (response: AuthResponse, remember: boolean) => {
      tokenManagerInstance.setSession(response, remember);
      sync();
    },
    [sync],
  );

  const login = useCallback(
    async (data: LoginRequest, remember = true) => {
      const response = await authRepository.login(data);
      persistSession(response, remember);
    },
    [persistSession],
  );

  const register = useCallback(
    async (data: RegisterRequest, remember = true) => {
      const response = await authRepository.register(data);

      if (!response) {
        throw new ApiError({
          status: 500,
          message: "Resposta inválida do servidor ao registrar",
          errors: [],
        });
      }

      persistSession(response, remember);
    },
    [persistSession],
  );

  const loginWithGoogle = useCallback((remember: boolean = true) => {
    sessionStorage.setItem(OAUTH2_REMEMBER_KEY, String(remember));
    authRepository.startGoogleLogin();
  }, []);

  const completeOAuuth2Login = useCallback(
    (params: OAuth2CallBackParams) => {
      const remember = sessionStorage.getItem(OAUTH2_REMEMBER_KEY) !== "false";
      sessionStorage.removeItem(OAUTH2_REMEMBER_KEY);

      try {
        persistSession(
          {
            accessToken: params.accessToken,
            refreshToken: params.refreshToken,
            tokenType: params.tokenType ?? "Bearer",
            expiresIn: params.expiresIn,
          },
          remember,
        );
        return true;
      } catch {
        return false;
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenManagerInstance.getRefreshToken();

    if (refreshToken) {
      try {
        await authRepository.logout(refreshToken);
      } catch {}
      tokenManagerInstance.clearSession();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      loginWithGoogle,
      completeOAuuth2Login,
      logout,
    }),
    [
      user,
      isLoading,
      login,
      register,
      loginWithGoogle,
      completeOAuth2Login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
