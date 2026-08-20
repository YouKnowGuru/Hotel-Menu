export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPage {
  id: string;
  name: string;
  canvasData: CanvasData;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  templateId?: string;
  canvasData: CanvasData;
  /** Multi-page support: additional pages beyond the first canvas */
  pages?: ProjectPage[];
  thumbnail?: string;
  paperSize: PaperSize;
  orientation: "portrait" | "landscape";
  status: "active" | "archived" | "deleted";
  /** Version history snapshots */
  versions?: ProjectVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectVersion {
  id: string;
  name: string;
  canvasData: CanvasData;
  createdAt: Date;
}

export interface CanvasData {
  objects: unknown[];
  background: BackgroundConfig;
  width: number;
  height: number;
}

export interface BackgroundConfig {
  type: "solid" | "gradient" | "image" | "pattern";
  value: string;
  gradient?: {
    type: string;
    angle: number;
    colors: string[];
  };
}

export type PaperSize = "A5" | "A4" | "A3" | "letter" | "legal" | "tabloid" | "custom";

export interface PaperDimensions {
  width: number;
  height: number;
  label: string;
}

export interface Template {
  _id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  style: TemplateStyle;
  orientation: "portrait" | "landscape";
  paperSize: PaperSize;
  thumbnail: string;
  previewImages: string[];
  canvasData: CanvasData;
  isPremium: boolean;
  tags: string[];
  createdAt: Date;
}

export type TemplateCategory =
  | "minimal"
  | "modern"
  | "luxury"
  | "elegant"
  | "dark"
  | "vintage"
  | "rustic"
  | "cafe"
  | "bakery"
  | "coffee"
  | "fine-dining"
  | "hotel"
  | "fast-food"
  | "pizza"
  | "burger"
  | "bbq"
  | "indian"
  | "chinese"
  | "japanese"
  | "bhutanese"
  | "seasonal";

export type TemplateStyle =
  | "clean"
  | "bold"
  | "ornate"
  | "minimalist"
  | "classic"
  | "contemporary"
  | "artistic";

export interface BrandKit {
  _id: string;
  userId: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  currency: string;
  image?: string;
  badge?: MenuBadge;
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  isGlutenFree?: boolean;
}

export type MenuBadge =
  | "NEW"
  | "BEST SELLER"
  | "CHEF'S SPECIAL"
  | "SPICY"
  | "VEG"
  | "VEGAN"
  | "POPULAR";

export interface ExportOptions {
  format: "pdf" | "png" | "jpg";
  quality: number;
  dpi: number;
  paperSize: PaperSize;
  orientation: "portrait" | "landscape";
  includeBleed: boolean;
  bleedWidth: number;
}

export interface EditorState {
  selectedObjectIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  history: CanvasData[];
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface FontOption {
  name: string;
  family: string;
  category: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
  weights: number[];
}

export interface ShapeOption {
  id: string;
  name: string;
  type: "line" | "circle" | "rectangle" | "triangle" | "star" | "diamond" | "hexagon";
  icon: string;
}

export interface TextureOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
