import { jwtDecode } from "jwt-decode";
import { User } from "../models/User";

interface JwtPayload {
  sub: string;
  userId: number;
  name: string;
  iat: number;
  exp: number;
}

export function decodeUserFromToken(token: string): User | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return new User({ 
      id: payload.userId, 
      name: payload.name, 
      email: payload.sub 
    });
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
}
