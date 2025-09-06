import type { RequestHandler } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../services/database";
import { signAuthToken, setAuthCookie, clearAuthCookie, getAuthUserFromRequest } from "../middleware/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function sanitizeUser(u: { id: string; email: string; name: string; role: string; createdAt: Date }) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  };
}

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = signAuthToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    setAuthCookie(res, token);

    return res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Invalid input", errors: err.errors });
    }
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const handleMe: RequestHandler = async (req, res) => {
  const authUser = getAuthUserFromRequest(req);
  if (!authUser) return res.status(401).json({ success: false, message: "Unauthorized" });
  const user = await db.user.findUnique({ where: { id: authUser.id } });
  if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
  return res.json({ success: true, user: sanitizeUser(user) });
};

export const handleLogout: RequestHandler = async (_req, res) => {
  clearAuthCookie(res);
  return res.json({ success: true });
};
