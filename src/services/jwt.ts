import type { UserResponse } from "../types/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  userId: string;
  name: string;
  iat: number;
  exp: number;
}

export function decodeUserFromToken(token: string): UserResponse | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return { id: payload.userId, name: payload.name, email: payload.sub };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
