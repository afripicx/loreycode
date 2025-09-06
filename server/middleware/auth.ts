import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_COOKIE_NAME = "token";

function parseCookies(cookieHeader?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = decodeURIComponent(part.slice(0, idx).trim());
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = val;
  }
  return out;
}

function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (typeof auth === "string" && auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length).trim();
  }
  const cookies = parseCookies(req.headers.cookie || null);
  return cookies[TOKEN_COOKIE_NAME] || null;
}

export function signAuthToken(user: AuthUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    type: "access",
  } as const;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function getAuthUserFromRequest(req: Request): AuthUser | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      name: string;
      role: string;
      type: string;
      iat: number;
      exp: number;
    };
    if (decoded.type !== "access") return null;
    return { id: decoded.sub, email: decoded.email, name: decoded.name, role: decoded.role };
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  (req as any).user = user;
  next();
}

export function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}
