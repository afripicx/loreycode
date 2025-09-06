import express from "express";
import { db } from "../services/database";

export const publicRouter = express.Router();

publicRouter.get("/services", async (_req, res) => {
  const items = await db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  res.json({ success: true, items });
});

publicRouter.get("/projects", async (_req, res) => {
  const items = await db.project.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  res.json({ success: true, items });
});

publicRouter.get("/courses", async (_req, res) => {
  const items = await db.course.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  res.json({ success: true, items });
});

publicRouter.get("/pages/:slug", async (req, res) => {
  const page = await db.page.findUnique({ where: { slug: req.params.slug } });
  if (!page || !page.isActive) return res.status(404).json({ success: false, message: "Not found" });
  const sections = await db.section.findMany({ where: { pageId: page.id, isActive: true }, orderBy: { order: "asc" } });
  res.json({ success: true, page, sections });
});

publicRouter.get("/settings", async (_req, res) => {
  const items = await db.siteSettings.findMany({});
  res.json({ success: true, items });
});

publicRouter.get("/settings/:key", async (req, res) => {
  const item = await db.siteSettings.findUnique({ where: { key: req.params.key } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});
