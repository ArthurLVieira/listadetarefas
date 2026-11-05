import { createContext, type ReactNode, useReducer } from "react";
import type { User } from "../models/User";
import type { LoginRequest, RegisterRequest } from "../types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | {
      type: "RESTORE";
      payload: { user: User | null; token: string | null };
    }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: User; token: string };
    }
  | {
      type: "LOGOUT";
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    };

const initialState: AuthState = { user: null, token: null, isLoading: true };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE":
      return { ...state, ...action.payload, isLoading: false };
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload, isLoading: false };
    case "LOGOUT":
      return { user: null, token: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  loginWithGoogle: () => void;
  completeOauth2Login: (token: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
}
