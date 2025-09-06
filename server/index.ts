import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContactForm } from "./routes/contact";
import { handleLogin, handleMe, handleLogout } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/contact", handleContactForm);
  // Duplicate without /api prefix for Netlify function path
  app.get("/demo", handleDemo);
  app.post("/contact", handleContactForm);

  // Auth endpoints (prefixed and unprefixed)
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/me", handleMe);
  app.post("/api/auth/logout", handleLogout);
  app.post("/auth/login", handleLogin);
  app.get("/auth/me", handleMe);
  app.post("/auth/logout", handleLogout);

  // Serve uploaded files (development/local)
  app.use("/uploads", express.static("public/uploads"));

  // Admin CRUD (prefixed and unprefixed)
  app.use("/api/admin", adminRouter);
  app.use("/admin", adminRouter);

  // Public content APIs (prefixed and unprefixed)
  app.use("/api/public", publicRouter);
  app.use("/public", publicRouter);

  return app;
}
