import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(1000).optional(),
  templateId: z.string().optional(),
  paperSize: z.enum(["A5", "A4", "A3", "letter", "legal", "tabloid", "custom"]).optional(),
  orientation: z.enum(["portrait", "landscape"]).optional(),
  customWidth: z.number().min(50).max(2000).optional(),
  customHeight: z.number().min(50).max(2000).optional(),
  canvasData: z.record(z.string(), z.unknown()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  paperSize: z.enum(["A5", "A4", "A3", "letter", "legal", "tabloid", "custom"]).optional(),
  orientation: z.enum(["portrait", "landscape"]).optional(),
  customWidth: z.number().min(50).max(2000).optional(),
  customHeight: z.number().min(50).max(2000).optional(),
  canvasData: z.record(z.string(), z.unknown()).optional(),
  thumbnail: z.string().optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
});

export const brandKitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  logo: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  fonts: z.object({
    heading: z.string().optional(),
    body: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
});

export const settingsSchema = z.object({
  defaultPaperSize: z.enum(["A5", "A4", "A3", "letter", "legal", "tabloid"]).optional(),
  defaultOrientation: z.enum(["portrait", "landscape"]).optional(),
  defaultCurrency: z.string().min(1).max(8).optional(),
  autoSave: z.boolean().optional(),
  autoSaveInterval: z.number().min(5).max(300).optional(),
  theme: z.enum(["light", "dark"]).optional(),
  snapToGrid: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  showSafeArea: z.boolean().optional(),
});

export const uploadSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  size: z.number().max(10 * 1024 * 1024, "File must be less than 10MB"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type BrandKitInput = z.infer<typeof brandKitSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
