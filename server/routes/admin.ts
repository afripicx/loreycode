import express from "express";
import { z } from "zod";
import { db } from "../services/database";
import { requireAuth } from "../middleware/auth";

export const adminRouter = express.Router();

adminRouter.use(requireAuth);

function parsePagination(q: any) {
  const page = Math.max(parseInt(q.page as string) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(q.pageSize as string) || 20, 1), 100);
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
}

const ServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional().nullable(),
  features: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

const CourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  level: z.string().min(1),
  price: z.string().min(1),
  duration: z.string().min(1),
  lessons: z.number().int().optional(),
  students: z.number().int().optional(),
  image: z.string().optional().nullable(),
  curriculum: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  technologies: z.string().min(1),
  images: z.string().min(1),
  liveUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  clientName: z.string().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const PageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const SectionSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  content: z.string().min(1),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Services
adminRouter.get("/services", async (req, res) => {
  const { skip, take } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    db.service.findMany({ skip, take, orderBy: { order: "asc" } }),
    db.service.count(),
  ]);
  res.json({ success: true, items, total });
});

adminRouter.post("/services", async (req, res) => {
  const data = ServiceSchema.parse(req.body);
  const created = await db.service.create({ data });
  res.json({ success: true, item: created });
});

adminRouter.get("/services/:id", async (req, res) => {
  const item = await db.service.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});

adminRouter.put("/services/:id", async (req, res) => {
  const data = ServiceSchema.partial().parse(req.body);
  const updated = await db.service.update({ where: { id: req.params.id }, data });
  res.json({ success: true, item: updated });
});

adminRouter.delete("/services/:id", async (req, res) => {
  await db.service.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Courses
adminRouter.get("/courses", async (req, res) => {
  const { skip, take } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    db.course.findMany({ skip, take, orderBy: { order: "asc" } }),
    db.course.count(),
  ]);
  res.json({ success: true, items, total });
});

adminRouter.post("/courses", async (req, res) => {
  const data = CourseSchema.parse(req.body);
  const created = await db.course.create({ data });
  res.json({ success: true, item: created });
});

adminRouter.get("/courses/:id", async (req, res) => {
  const item = await db.course.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});

adminRouter.put("/courses/:id", async (req, res) => {
  const data = CourseSchema.partial().parse(req.body);
  const updated = await db.course.update({ where: { id: req.params.id }, data });
  res.json({ success: true, item: updated });
});

adminRouter.delete("/courses/:id", async (req, res) => {
  await db.course.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Projects
adminRouter.get("/projects", async (req, res) => {
  const { skip, take } = parsePagination(req.query);
  const [items, total] = await Promise.all([
    db.project.findMany({ skip, take, orderBy: { order: "asc" } }),
    db.project.count(),
  ]);
  res.json({ success: true, items, total });
});

adminRouter.post("/projects", async (req, res) => {
  const data = ProjectSchema.parse(req.body);
  const created = await db.project.create({ data });
  res.json({ success: true, item: created });
});

adminRouter.get("/projects/:id", async (req, res) => {
  const item = await db.project.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});

adminRouter.put("/projects/:id", async (req, res) => {
  const data = ProjectSchema.partial().parse(req.body);
  const updated = await db.project.update({ where: { id: req.params.id }, data });
  res.json({ success: true, item: updated });
});

adminRouter.delete("/projects/:id", async (req, res) => {
  await db.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Pages
adminRouter.get("/pages", async (_req, res) => {
  const items = await db.page.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, items });
});

adminRouter.post("/pages", async (req, res) => {
  const data = PageSchema.parse(req.body);
  const created = await db.page.create({ data });
  res.json({ success: true, item: created });
});

adminRouter.get("/pages/:id", async (req, res) => {
  const item = await db.page.findUnique({ where: { id: req.params.id }, include: { sections: true } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});

adminRouter.put("/pages/:id", async (req, res) => {
  const data = PageSchema.partial().parse(req.body);
  const updated = await db.page.update({ where: { id: req.params.id }, data });
  res.json({ success: true, item: updated });
});

adminRouter.delete("/pages/:id", async (req, res) => {
  await db.page.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Sections nested under page
adminRouter.get("/pages/:id/sections", async (req, res) => {
  const sections = await db.section.findMany({ where: { pageId: req.params.id }, orderBy: { order: "asc" } });
  res.json({ success: true, items: sections });
});

adminRouter.post("/pages/:id/sections", async (req, res) => {
  const body = SectionSchema.parse(req.body);
  const created = await db.section.create({ data: { ...body, pageId: req.params.id } });
  res.json({ success: true, item: created });
});

adminRouter.put("/sections/:id", async (req, res) => {
  const body = SectionSchema.partial().parse(req.body);
  const updated = await db.section.update({ where: { id: req.params.id }, data: body });
  res.json({ success: true, item: updated });
});

adminRouter.delete("/sections/:id", async (req, res) => {
  await db.section.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Site settings
const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.string().optional(),
  description: z.string().optional().nullable(),
});

adminRouter.get("/settings", async (_req, res) => {
  const items = await db.siteSettings.findMany({ orderBy: { updatedAt: "desc" } });
  res.json({ success: true, items });
});

adminRouter.put("/settings/:key", async (req, res) => {
  const body = SettingSchema.partial({ key: true }).parse({ ...req.body, key: req.params.key });
  const existing = await db.siteSettings.findUnique({ where: { key: req.params.key } });
  let item;
  if (existing) {
    item = await db.siteSettings.update({ where: { key: req.params.key }, data: { value: body.value!, type: body.type, description: body.description ?? undefined } });
  } else {
    item = await db.siteSettings.create({ data: { key: req.params.key, value: body.value!, type: body.type ?? "text", description: body.description ?? undefined } });
  }
  res.json({ success: true, item });
});

// Media uploads
import { upload, publicUrlFor } from "../services/storage";

adminRouter.get("/media", async (_req, res) => {
  const items = await db.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, items });
});

adminRouter.post("/media/upload", upload.array("files", 10), async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const created = await Promise.all(
    files.map((f) =>
      db.mediaFile.create({
        data: {
          filename: f.filename,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
          url: publicUrlFor(f.filename),
          alt: null,
        },
      }),
    ),
  );
  res.json({ success: true, items: created });
});

adminRouter.delete("/media/:id", async (req, res) => {
  const item = await db.mediaFile.findUnique({ where: { id: req.params.id } });
  if (item) {
    try {
      // Attempt to remove file from disk
      const fs = await import("fs/promises");
      const path = await import("path");
      const full = path.resolve(process.cwd(), "public", "uploads", item.filename);
      await fs.unlink(full).catch(() => {});
    } catch {}
    await db.mediaFile.delete({ where: { id: req.params.id } });
  }
  res.json({ success: true });
});
