import fs from "fs";
import path from "path";
import multer from "multer";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadDir();
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      cb(null, `${sanitizeFilename(base)}_${unique}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export function publicUrlFor(filename: string) {
  return `/uploads/${encodeURIComponent(filename)}`;
}
