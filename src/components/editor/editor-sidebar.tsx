"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Shapes,
  Smile,
  UtensilsCrossed,
  Tag,
  Palette,
  Paintbrush,
  Square,
  Circle,
  Minus,
  Triangle,
  Diamond,
  Hexagon,
  Star,
  Upload,
  Link as LinkIcon,
  Loader2,
  RotateCw,
  Sparkles,
  Plus,
  ArrowRight,
  ImageIcon as GalleryIcon,
  Frame,
  GripHorizontal,
  Crown,
  QrCode,
} from "lucide-react";
import type { FabricCanvasRef } from "@/components/canvas/fabric-canvas";
import { GRADIENT_PRESETS, MENU_BADGES, CURRENCIES } from "@/constants";
import { GradientBuilder } from "./gradient-builder";
import { GlassButton } from "@/components/glass/glass-button";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { MENU_ICONS } from "@/constants/icons";

interface EditorSidebarProps {
  activeTool: string | null;
  onToolSelect: (id: string | null) => void;
  fabricRef: React.RefObject<FabricCanvasRef | null>;
}

const sidebarTools = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "borders", label: "Borders & Frames", icon: Frame },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "icons", label: "Icons", icon: Smile },
  { id: "menu-items", label: "Menu Items", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "brand", label: "Brand", icon: Palette },
  { id: "background", label: "Background", icon: Paintbrush },
  { id: "qrcode", label: "QR Code", icon: QrCode },
];

const textPresets = [
  { label: "Restaurant Title", fontSize: 48, fontWeight: "bold", fontFamily: "Playfair Display", fill: "#111827" },
  { label: "Category Heading", fontSize: 28, fontWeight: "600", fontFamily: "Inter", fill: "#374151" },
  { label: "Food Name", fontSize: 20, fontWeight: "600", fontFamily: "Inter", fill: "#1f2937" },
  { label: "Description", fontSize: 14, fontWeight: "400", fontFamily: "Inter", fill: "#6b7280" },
  { label: "Price", fontSize: 22, fontWeight: "700", fontFamily: "Inter", fill: "#111827" },
  { label: "Footer Text", fontSize: 11, fontWeight: "400", fontFamily: "Inter", fill: "#9ca3af" },
];

const backgroundColorGroups = [
  {
    label: "☁ Neutrals",
    colors: [
      { name: "Pure White", value: "#ffffff" },
      { name: "Snow", value: "#fafafa" },
      { name: "Light Gray", value: "#f3f4f6" },
      { name: "Silver", value: "#e5e7eb" },
      { name: "Stone", value: "#d1d5db" },
      { name: "Slate", value: "#6b7280" },
      { name: "Charcoal", value: "#374151" },
      { name: "Near Black", value: "#111827" },
    ],
  },
  {
    label: "🌅 Warm Tones",
    colors: [
      { name: "Ivory", value: "#fefce8" },
      { name: "Linen", value: "#fff7ed" },
      { name: "Peach", value: "#fde8d8" },
      { name: "Blush", value: "#fce7f3" },
      { name: "Salmon", value: "#fca5a5" },
      { name: "Terracotta", value: "#c2714f" },
      { name: "Amber", value: "#d97706" },
      { name: "Mahogany", value: "#7c2d12" },
    ],
  },
  {
    label: "🌊 Cool Blues",
    colors: [
      { name: "Ice", value: "#f0f9ff" },
      { name: "Sky", value: "#bae6fd" },
      { name: "Azure", value: "#60a5fa" },
      { name: "Royal", value: "#2563eb" },
      { name: "Navy", value: "#1e3a8a" },
      { name: "Midnight", value: "#0f172a" },
      { name: "Teal", value: "#0d9488" },
      { name: "Cyan", value: "#06b6d4" },
    ],
  },
  {
    label: "🌿 Greens & Earth",
    colors: [
      { name: "Mint", value: "#d1fae5" },
      { name: "Sage", value: "#86efac" },
      { name: "Forest", value: "#166534" },
      { name: "Olive", value: "#65a30d" },
      { name: "Emerald", value: "#059669" },
      { name: "Pine", value: "#14532d" },
      { name: "Khaki", value: "#ca8a04" },
      { name: "Moss", value: "#4d7c0f" },
    ],
  },
  {
    label: "🌸 Pastels",
    colors: [
      { name: "Baby Pink", value: "#fce7f3" },
      { name: "Lavender", value: "#ede9fe" },
      { name: "Baby Blue", value: "#dbeafe" },
      { name: "Mint Cream", value: "#dcfce7" },
      { name: "Butter", value: "#fef9c3" },
      { name: "Apricot", value: "#ffedd5" },
      { name: "Lilac", value: "#e9d5ff" },
      { name: "Powder", value: "#cffafe" },
    ],
  },
  {
    label: "💎 Jewel Tones",
    colors: [
      { name: "Ruby", value: "#991b1b" },
      { name: "Sapphire", value: "#1d4ed8" },
      { name: "Amethyst", value: "#7c3aed" },
      { name: "Jade", value: "#065f46" },
      { name: "Topaz", value: "#b45309" },
      { name: "Garnet", value: "#9f1239" },
      { name: "Indigo", value: "#4338ca" },
      { name: "Plum", value: "#6b21a8" },
    ],
  },
  {
    label: "🌑 Dark Themes",
    colors: [
      { name: "Obsidian", value: "#030712" },
      { name: "Abyss", value: "#020617" },
      { name: "Dark Slate", value: "#0f172a" },
      { name: "Dark Navy", value: "#0f172a" },
      { name: "Dark Wine", value: "#1c0b0b" },
      { name: "Dark Forest", value: "#052e16" },
      { name: "Dark Purple", value: "#1e0533" },
      { name: "Dark Teal", value: "#042f2e" },
    ],
  },
  {
    label: "✨ Neon Vibes",
    colors: [
      { name: "Hot Pink", value: "#ec4899" },
      { name: "Electric Blue", value: "#3b82f6" },
      { name: "Neon Green", value: "#22c55e" },
      { name: "Neon Orange", value: "#f97316" },
      { name: "Neon Purple", value: "#a855f7" },
      { name: "Neon Yellow", value: "#eab308" },
      { name: "Neon Cyan", value: "#06b6d4" },
      { name: "Neon Red", value: "#ef4444" },
    ],
  },
];

const gradientPresets = [
  { name: "Sunset", colors: ["#ff6b6b", "#feca57"], angle: 135 },
  { name: "Ocean", colors: ["#4facfe", "#00f2fe"], angle: 135 },
  { name: "Aurora", colors: ["#43e97b", "#38f9d7"], angle: 135 },
  { name: "Dusk", colors: ["#667eea", "#764ba2"], angle: 135 },
  { name: "Flamingo", colors: ["#f093fb", "#f5576c"], angle: 135 },
  { name: "Midnight", colors: ["#0f0c29", "#302b63", "#24243e"], angle: 135 },
  { name: "Peach", colors: ["#ffecd2", "#fcb69f"], angle: 135 },
  { name: "Mint", colors: ["#a8edea", "#fed6e3"], angle: 135 },
  { name: "Forest", colors: ["#134e5e", "#71b280"], angle: 135 },
  { name: "Royal", colors: ["#1a1a2e", "#16213e", "#0f3460"], angle: 135 },
  { name: "Candy", colors: ["#ff9a9e", "#fad0c4", "#ffecd2"], angle: 135 },
  { name: "Twilight", colors: ["#ee9ca7", "#ffdde1"], angle: 135 },
  { name: "Cosmic", colors: ["#8360c3", "#2ebf91"], angle: 135 },
  { name: "Fire", colors: ["#f12711", "#f5af19"], angle: 135 },
  { name: "Deep Sea", colors: ["#2193b0", "#6dd5ed"], angle: 180 },
  { name: "Lush", colors: ["#56ab2f", "#a8e063"], angle: 135 },
  { name: "Blush", colors: ["#ffd1ff", "#fad0c4", "#ff9a9e"], angle: 45 },
  { name: "Espresso", colors: ["#2c1810", "#4a2c2a"], angle: 135 },
];

/* ---------------- Shared: upload image to Cloudinary via /api/upload ---------------- */

async function uploadFile(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    return null;
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Upload failed");
    }
    return data.data.url as string;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Upload failed");
    return null;
  }
}

/* ---------------- Text panel ---------------- */

function TextPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  return (
    <div className="space-y-2">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Text Presets</h3>
      <GlassButton
        variant="primary"
        size="sm"
        className="mb-3 w-full"
        onClick={() => fabricRef.current?.addText()}
      >
        <Plus className="h-4 w-4" />
        Add Text
      </GlassButton>
      {textPresets.map((preset) => (
        <button
          key={preset.label}
          onClick={() =>
            fabricRef.current?.addText({
              fontSize: preset.fontSize,
              fontFamily: preset.fontFamily,
              fill: preset.fill,
              fontWeight: preset.fontWeight,
            })
          }
          className="glass w-full rounded-xl p-3 text-left transition-all hover:bg-white/10"
        >
          <span
            style={{
              fontSize: Math.min(preset.fontSize / 2.5, 16),
              fontWeight: preset.fontWeight,
              fontFamily: preset.fontFamily,
            }}
            className="text-white"
          >
            {preset.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------------- Images panel (uploads persist via Cloudinary) ---------------- */

function ImagesPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [urlInput, setUrlInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"rect" | "circle">("rect");
  const [circleSize, setCircleSize] = useState<"sm" | "md" | "lg">("md");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const circleFileInputRef = useRef<HTMLInputElement>(null);

  const diameterMap = { sm: 160, md: 240, lg: 320 };

  const handleFile = useCallback(
    async (file: File, forCircle = false) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setIsUploading(true);
      const url = await uploadFile(file);
      setIsUploading(false);
      if (url) {
        if (forCircle || mode === "circle") {
          fabricRef.current?.addCircularImage(url, diameterMap[circleSize]);
          toast.success("Circular image added ✓");
        } else {
          fabricRef.current?.addImage(url);
          toast.success("Image added ✓");
        }
      }
    },
    [fabricRef, mode, circleSize, diameterMap]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      if (mode === "circle") {
        fabricRef.current?.addCircularImage(urlInput.trim(), diameterMap[circleSize]);
      } else {
        fabricRef.current?.addImage(urlInput.trim());
      }
      setUrlInput("");
    }
  }, [urlInput, fabricRef, mode, circleSize, diameterMap]);

  return (
    <div className="space-y-4">
      {/* ── Mode toggle ── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-white/80">Place as</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("rect")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-all",
              mode === "rect"
                ? "border-primary-400 bg-primary-500/20 text-primary-300"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            )}
            aria-label="Rectangle mode"
          >
            <Square className="h-3.5 w-3.5" />
            Rectangle
          </button>
          <button
            type="button"
            onClick={() => setMode("circle")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-all",
              mode === "circle"
                ? "border-primary-400 bg-primary-500/20 text-primary-300"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            )}
            aria-label="Circular frame mode"
          >
            <Circle className="h-3.5 w-3.5" />
            Circular Frame
          </button>
        </div>
      </div>

      {/* ── Circle size selector (only when circular mode) ── */}
      {mode === "circle" && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-white/60">Circle size</h3>
          <div className="flex gap-2">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setCircleSize(s)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border py-2 text-xs transition-all",
                  circleSize === s
                    ? "border-primary-400 bg-primary-500/20 text-primary-300"
                    : "border-white/10 text-white/40 hover:border-white/20"
                )}
                aria-label={`Circle size ${s}`}
              >
                <div
                  className={cn(
                    "rounded-full bg-white/20",
                    s === "sm" ? "h-4 w-4" : s === "md" ? "h-6 w-6" : "h-8 w-8"
                  )}
                />
                {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
                <span className="text-[10px] text-white/30">
                  {s === "sm" ? "160px" : s === "md" ? "240px" : "320px"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Upload drop zone ── */}
      <h3 className="text-sm font-semibold text-white/80">Upload Image</h3>
      <div
        role="button"
        tabIndex={0}
        aria-label={mode === "circle" ? "Upload circular food photo" : "Upload image"}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all",
          isDragOver
            ? "border-primary-400 bg-primary-500/10"
            : mode === "circle"
              ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-400/60 hover:bg-amber-500/10"
              : "border-white/10 hover:border-white/20 hover:bg-white/5"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            <p className="text-xs text-white/40">Uploading...</p>
          </>
        ) : (
          <>
            {mode === "circle" ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-amber-400/50 bg-amber-500/10">
                <Upload className="h-6 w-6 text-amber-400/70" />
              </div>
            ) : (
              <Upload className="h-8 w-8 text-white/30" />
            )}
            <p className="text-xs text-white/40">
              {isDragOver
                ? "Drop image here"
                : mode === "circle"
                  ? "Upload food photo → placed as circle"
                  : "Click or drag to upload"}
            </p>
            <p className="text-[10px] text-white/25">JPG, PNG, WebP — up to 10MB</p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <input ref={circleFileInputRef} type="file" accept="image/*" className="hidden" />

      {/* ── From URL ── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-white/80">From URL</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            className="glass-input flex-1 px-3 py-2 text-sm"
            aria-label="Image URL"
          />
          <GlassButton variant="ghost" size="sm" onClick={handleUrlSubmit} aria-label="Add image from URL">
            <LinkIcon className="h-4 w-4" />
          </GlassButton>
        </div>
        {mode === "circle" && (
          <p className="mt-1.5 text-[10px] text-amber-400/60">
            ↑ Image will be placed as a circular frame
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Shapes panel ---------------- */

function ShapesPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  // Resolve the canvas ref at click-time (not during render) so shape
  // actions always target the live canvas.
  const addShape = useCallback(
    (kind: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      switch (kind) {
        case "rect":
          canvas.addRect();
          break;
        case "circle":
          canvas.addCircle();
          break;
        case "line":
          canvas.addLine();
          break;
        case "divider":
          canvas.addDivider();
          break;
        default:
          canvas.addPolygonShape(kind as "triangle" | "star" | "diamond" | "hexagon");
      }
    },
    [fabricRef]
  );

  const shapes = [
    { label: "Rectangle", icon: Square, kind: "rect" },
    { label: "Circle", icon: Circle, kind: "circle" },
    { label: "Line", icon: Minus, kind: "line" },
    { label: "Triangle", icon: Triangle, kind: "triangle" },
    { label: "Diamond", icon: Diamond, kind: "diamond" },
    { label: "Hexagon", icon: Hexagon, kind: "hexagon" },
    { label: "Star", icon: Star, kind: "star" },
    { label: "Divider", icon: GripHorizontal, kind: "divider" },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/80">Add Shape</h3>
      <div className="grid grid-cols-2 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.label}
            onClick={() => addShape(shape.kind)}
            aria-label={`Add ${shape.label}`}
            className="glass flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:bg-white/10"
          >
            <shape.icon className="h-8 w-8 text-white/60" />
            <span className="text-xs text-white/50">{shape.label}</span>
          </button>
        ))}
      </div>
      <GlassButton
        variant="ghost"
        size="sm"
        className="mt-3 w-full"
        onClick={() => fabricRef.current?.addFrame()}
      >
        <Frame className="h-4 w-4" />
        Add Decorative Frame
      </GlassButton>
    </div>
  );
}

/* ---------------- Borders & Frame Studio Panel ---------------- */

const BORDER_STYLES = [
  { id: "single", label: "Classic Solid", desc: "Clean single perimeter line" },
  { id: "double", label: "Royal Double", desc: "Dual concentric luxury lines" },
  { id: "corners", label: "Art Deco Corners", desc: "Frame with corner diamond accents" },
  { id: "rounded", label: "Modern Curved", desc: "Soft modern rounded corners" },
  { id: "dashed", label: "Contemporary Dash", desc: "Modern stitched dashed line" },
  { id: "dotted", label: "Fine Dotted", desc: "Refined dotted perimeter" },
  { id: "triple", label: "Royal Triple", desc: "Formal 3-line hotel prestige frame" },
  { id: "bhutanese", label: "Bhutanese Heritage", desc: "Dzong & Himalayan cultural border" },
];

const BORDER_COLORS = [
  { name: "Bhutan Gold", value: "#c9a96e" },
  { name: "Royal Amber", value: "#d97706" },
  { name: "Dzong Crimson", value: "#991b1b" },
  { name: "Heritage Ochre", value: "#ca8a04" },
  { name: "Charcoal Slate", value: "#334155" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Deep Forest", value: "#166534" },
  { name: "Rose Blush", value: "#ec4899" },
  { name: "Midnight Noir", value: "#0f172a" },
  { name: "Silver Gray", value: "#94a3b8" },
];

function BordersPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [selectedStyle, setSelectedStyle] = useState<string>("single");
  const [color, setColor] = useState<string>("#c9a96e");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [margin, setMargin] = useState<number>(36);
  const [rx, setRx] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(100);

  // Sync with current canvas border on mount
  useEffect(() => {
    const info = fabricRef.current?.getBorderInfo();
    if (info && info.exists) {
      if (info.style) setSelectedStyle(info.style);
      if (info.color) setColor(info.color);
      if (info.strokeWidth) setStrokeWidth(info.strokeWidth);
      if (info.margin) setMargin(info.margin);
      if (info.rx) setRx(info.rx);
      if (info.opacity != null) setOpacity(Math.round(info.opacity * 100));
    }
  }, [fabricRef]);

  const applyBorder = (overrides: Partial<{
    style: string;
    color: string;
    strokeWidth: number;
    margin: number;
    rx: number;
    opacity: number;
  }> = {}) => {
    const s = overrides.style ?? selectedStyle;
    const c = overrides.color ?? color;
    const sw = overrides.strokeWidth ?? strokeWidth;
    const m = overrides.margin ?? margin;
    const r = overrides.rx ?? rx;
    const op = (overrides.opacity ?? opacity) / 100;

    fabricRef.current?.applyBorderDesign({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: s as any,
      color: c,
      strokeWidth: sw,
      margin: m,
      rx: r,
      opacity: op,
    });
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    applyBorder({ style: styleId });
    toast.success(`Applied ${BORDER_STYLES.find((b) => b.id === styleId)?.label} border`);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    applyBorder({ color: newColor });
  };

  const handleRemove = () => {
    fabricRef.current?.removeBorder();
    toast.info("Border removed from canvas");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">Border & Frame Studio</h3>
        <button
          type="button"
          onClick={handleRemove}
          className="text-[11px] text-red-400/80 hover:text-red-300 transition-colors"
        >
          Remove Border
        </button>
      </div>

      <p className="text-xs text-white/40">
        Choose a decorative border design, customize colors, thickness, and corner ornaments.
      </p>

      {/* Border Styles */}
      <div>
        <label className="mb-2 block text-xs font-medium text-white/60">Border Style</label>
        <div className="grid grid-cols-2 gap-2">
          {BORDER_STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleStyleChange(st.id)}
              className={cn(
                "glass flex flex-col items-start gap-1 rounded-xl p-2.5 text-left transition-all",
                selectedStyle === st.id
                  ? "border-primary-500/50 bg-primary-500/10 text-white shadow-sm ring-1 ring-primary-500/40"
                  : "text-white/60 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-semibold">{st.label}</span>
                {st.id === "bhutanese" && <Sparkles className="h-3 w-3 text-amber-400" />}
              </div>
              <span className="text-[10px] text-white/40 leading-tight">{st.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker & Presets */}
      <div>
        <label className="mb-2 block text-xs font-medium text-white/60">Border Color</label>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#c9a96e"}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
            aria-label="Border Color"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#c9a96e"
            className="glass-input flex-1 px-2.5 py-1 text-xs"
            aria-label="Hex color"
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {BORDER_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => handleColorChange(c.value)}
              className={cn(
                "h-6 w-full rounded-md border transition-all hover:scale-105",
                color.toLowerCase() === c.value.toLowerCase()
                  ? "border-white ring-2 ring-primary-500/50"
                  : "border-white/10"
              )}
              style={{ backgroundColor: c.value }}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>

      {/* Thickness / Stroke Width Slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60">Line Thickness</label>
          <span className="text-xs font-mono text-white/40">{strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={1}
          max={16}
          step={0.5}
          value={strokeWidth}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setStrokeWidth(v);
            applyBorder({ strokeWidth: v });
          }}
          className="w-full accent-primary-500"
          aria-label="Border Line Thickness"
        />
      </div>

      {/* Margin / Page Inset Slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60">Page Inset / Margin</label>
          <span className="text-xs font-mono text-white/40">{margin}px</span>
        </div>
        <input
          type="range"
          min={15}
          max={80}
          step={2}
          value={margin}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setMargin(v);
            applyBorder({ margin: v });
          }}
          className="w-full accent-primary-500"
          aria-label="Border Margin"
        />
      </div>

      {/* Corner Radius (for rounded/single) */}
      {(selectedStyle === "rounded" || selectedStyle === "single") && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/60">Corner Rounding</label>
            <span className="text-xs font-mono text-white/40">{rx}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={2}
            value={rx}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setRx(v);
              applyBorder({ rx: v });
            }}
            className="w-full accent-primary-500"
            aria-label="Corner Rounding"
          />
        </div>
      )}

      {/* Opacity */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-white/60">Opacity</label>
          <span className="text-xs font-mono text-white/40">{opacity}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={opacity}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setOpacity(v);
            applyBorder({ opacity: v });
          }}
          className="w-full accent-primary-500"
          aria-label="Border Opacity"
        />
      </div>

      <GlassButton
        variant="primary"
        size="sm"
        className="w-full"
        onClick={() => {
          applyBorder();
          toast.success("Border updated!");
        }}
      >
        <Frame className="h-4 w-4" />
        Apply Border Design
      </GlassButton>
    </div>
  );
}

/* ---------------- Icons panel (real SVG path library) ---------------- */

const ICON_LIBRARY = MENU_ICONS;

function IconsPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/80">Icon Library</h3>
      <div className="grid grid-cols-3 gap-2">
        {ICON_LIBRARY.map((icon) => (
          <button
            key={icon.name}
            title={icon.name}
            aria-label={`Add ${icon.name} icon`}
            onClick={() => fabricRef.current?.addIcon(icon.path)}
            className="glass flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-white/10"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/60"
            >
              <path d={icon.path} />
            </svg>
            <span className="text-[10px] text-white/40">{icon.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Menu items panel (full form with badges + currency) ---------------- */

function MenuItemsPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [currency, setCurrency] = useState("$");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("#ef4444");

  const handleAddFull = () => {
    if (!name.trim() && !price.trim()) {
      toast.error("Add at least a name or price");
      return;
    }
    fabricRef.current?.addMenuItemFull({
      name: name.trim() || "Menu Item",
      description: description.trim(),
      price: price.trim() || "0.00",
      oldPrice: oldPrice.trim(),
      currency,
      badge,
      badgeColor,
    });
    setName("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setBadge("");
    toast.success("Menu item added");
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/80">Add Menu Item</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Item name (e.g. Truffle Pasta)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input w-full px-3 py-2 text-sm"
            aria-label="Item name"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="glass-input w-full resize-none px-3 py-2 text-sm"
            aria-label="Item description"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="glass-input px-2 py-2 text-sm"
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.symbol} className="bg-surface-900">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="glass-input px-3 py-2 text-sm"
              aria-label="Price"
            />
            <input
              type="text"
              placeholder="Old price"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="glass-input px-3 py-2 text-sm"
              aria-label="Old price"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={badge}
              onChange={(e) => {
                const selected = MENU_BADGES.find((b) => b.value === e.target.value);
                setBadge(e.target.value);
                if (selected) setBadgeColor(selected.color);
              }}
              className="glass-input px-2 py-2 text-sm"
              aria-label="Badge"
            >
              <option value="" className="bg-surface-900">
                No badge
              </option>
              {MENU_BADGES.map((b) => (
                <option key={b.value} value={b.value} className="bg-surface-900">
                  {b.label}
                </option>
              ))}
            </select>
            <input
              type="color"
              value={badgeColor}
              onChange={(e) => setBadgeColor(e.target.value)}
              className="h-[38px] w-full cursor-pointer rounded-lg border-0"
              aria-label="Badge color"
            />
          </div>
          <GlassButton variant="primary" size="sm" className="w-full" onClick={handleAddFull}>
            <Plus className="h-4 w-4" />
            Add Item to Menu
          </GlassButton>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/80">Smart Components</h3>
        <div className="space-y-3">
          <button
            onClick={() => fabricRef.current?.addMenuItem()}
            className="glass w-full rounded-xl p-4 text-left transition-all hover:bg-white/10"
          >
            <UtensilsCrossed className="mb-2 h-5 w-5 text-primary-400" />
            <p className="text-sm font-medium text-white/80">Menu Row</p>
            <p className="text-xs text-white/40">Name + Dots + Price</p>
          </button>
          <button
            onClick={() => fabricRef.current?.addFoodCard()}
            className="glass w-full rounded-xl p-4 text-left transition-all hover:bg-white/10"
          >
            <ImageIcon className="mb-2 h-5 w-5 text-pink-400" />
            <p className="text-sm font-medium text-white/80">Food Card</p>
            <p className="text-xs text-white/40">Image + Name + Price</p>
          </button>
          <button
            onClick={() => fabricRef.current?.addPriceList()}
            className="glass w-full rounded-xl p-4 text-left transition-all hover:bg-white/10"
          >
            <Tag className="mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-sm font-medium text-white/80">Price List</p>
            <p className="text-xs text-white/40">Three rows with separators</p>
          </button>
          <button
            onClick={() => fabricRef.current?.addFeaturedItem()}
            className="glass w-full rounded-xl p-4 text-left transition-all hover:bg-white/10"
          >
            <Sparkles className="mb-2 h-5 w-5 text-amber-400" />
            <p className="text-sm font-medium text-white/80">Featured Item</p>
            <p className="text-xs text-white/40">Large hero block with price</p>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Categories panel ---------------- */

const CATEGORY_PRESETS = [
  "Starters",
  "Appetizers",
  "Salads",
  "Soups",
  "Mains",
  "Pasta",
  "Grill & BBQ",
  "Seafood",
  "Vegetarian",
  "Desserts",
  "Beverages",
  "Coffee & Tea",
  "Breakfast",
  "Kids Menu",
];

function CategoriesPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [custom, setCustom] = useState("");
  const [color, setColor] = useState("#d97706");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/80">Custom Category</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Category title (e.g. Main Course)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="glass-input w-full px-3 py-2 text-sm"
            aria-label="Category title"
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-[38px] flex-1 cursor-pointer rounded-lg border-0"
              aria-label="Category color"
            />
            <GlassButton
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => {
                fabricRef.current?.addCategoryBlock(custom.trim() || "Category", color);
                setCustom("");
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </GlassButton>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/80">Quick Add</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_PRESETS.map((cat) => (
            <button
              key={cat}
              onClick={() => fabricRef.current?.addCategoryBlock(cat, color)}
              className="glass rounded-full px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white/90"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Brand panel (applies real brand kits) ---------------- */

interface BrandKitData {
  _id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: { heading: string; body: string; accent: string };
}

function BrandPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [kits, setKits] = useState<BrandKitData[]>([]);
  const [selectedKitId, setSelectedKitId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/brand-kit");
        const data = await res.json();
        if (!cancelled && res.ok && data.success && data.data) {
          setKits(data.data);
          if (data.data.length > 0) {
            setSelectedKitId(data.data[0]._id);
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeKit = kits.find((k) => k._id === selectedKitId) || kits[0];

  // 1-Click Apply full brand theme to canvas
  const handleApplyFullTheme = () => {
    if (!activeKit) return;
    fabricRef.current?.applyBrandTheme({
      primaryColor: activeKit.primaryColor,
      secondaryColor: activeKit.secondaryColor,
      accentColor: activeKit.accentColor,
      fonts: activeKit.fonts,
      applyBackground: false,
    });
    toast.success(`Applied ${activeKit.name} theme to canvas! ✓`);
  };

  // Quick apply color to selected object
  const applyColorToSelection = (color: string, label: string) => {
    const canvas = fabricRef.current?.getCanvas?.();
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
      toast.info("Select an item on the canvas first to apply this color");
      return;
    }
    if (activeObj.type === "text" || activeObj.type === "i-text" || activeObj.type === "textbox") {
      activeObj.set({ fill: color });
    } else if (activeObj.type === "line") {
      activeObj.set({ stroke: color });
    } else {
      activeObj.set({ fill: color });
    }
    canvas.requestRenderAll();
    toast.success(`Applied ${label} color to selected object`);
  };

  // Quick apply font to selected text
  const applyFontToSelection = (fontName: string, label: string) => {
    const canvas = fabricRef.current?.getCanvas?.();
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj.type !== "text" && activeObj.type !== "i-text" && activeObj.type !== "textbox")) {
      toast.info("Select a text item on the canvas first to apply this font");
      return;
    }
    activeObj.set({ fontFamily: fontName });
    canvas.requestRenderAll();
    toast.success(`Applied ${label} font (${fontName}) to text`);
  };

  const applyTitle = (kit: BrandKitData) => {
    const heading = kit.fonts?.heading?.split(",")[0]?.replace(/'/g, "") || "Playfair Display";
    fabricRef.current?.addText({
      text: kit.name.toUpperCase() || "YOUR RESTAURANT",
      fontSize: 42,
      fontFamily: heading,
      fontWeight: "bold",
      fill: kit.primaryColor,
      textAlign: "center",
    });
    toast.success("Brand title added");
  };

  const applyBackground = (kit: BrandKitData) => {
    fabricRef.current?.setBackgroundColor(kit.secondaryColor);
    toast.success("Background updated with brand color");
  };

  const applyBadge = (kit: BrandKitData) => {
    fabricRef.current?.addBadge("CHEF'S SPECIAL", kit.accentColor);
    toast.success("Brand badge added");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">Brand Kit</h3>
        <Link
          href="/brand-kit"
          className="text-[11px] text-primary-400 hover:underline"
          title="Manage Brand Kits"
        >
          Manage Kits
        </Link>
      </div>

      {isLoading && (
        <div className="glass flex items-center justify-center gap-2 rounded-xl p-4">
          <Loader2 className="h-4 w-4 animate-spin text-white/40" />
          <span className="text-xs text-white/40">Loading kits...</span>
        </div>
      )}

      {!isLoading && kits.length === 0 && (
        <div className="glass rounded-xl p-4 text-center">
          <Palette className="mx-auto mb-2 h-8 w-8 text-white/20" />
          <p className="mb-3 text-xs text-white/40">
            No brand kits yet. Create one to apply consistent styling.
          </p>
          <Link
            href="/brand-kit"
            className="inline-flex items-center gap-1 rounded-lg bg-primary-500/20 px-3 py-1.5 text-xs text-primary-400 hover:bg-primary-500/30"
          >
            Create Brand Kit
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {!isLoading && kits.length > 0 && activeKit && (
        <div className="space-y-4">
          {/* Kit Switcher Dropdown if multiple */}
          {kits.length > 1 && (
            <div>
              <label className="mb-1 block text-[11px] text-white/50">Active Kit</label>
              <select
                value={selectedKitId}
                onChange={(e) => setSelectedKitId(e.target.value)}
                className="glass-input w-full px-2.5 py-1.5 text-xs"
              >
                {kits.map((k) => (
                  <option key={k._id} value={k._id} className="bg-surface-900 text-white">
                    {k.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 1-Click "Apply Brand to Canvas" Big Button */}
          <button
            type="button"
            onClick={handleApplyFullTheme}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 p-3 text-xs font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.02] hover:shadow-primary-500/30 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Apply Brand to Canvas
          </button>

          {/* Brand Colors Swatches */}
          <div className="glass rounded-xl p-3">
            <span className="mb-2 block text-[11px] font-medium text-white/60">
              Quick Colors (Click to apply to selection)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Primary", color: activeKit.primaryColor },
                { label: "Secondary", color: activeKit.secondaryColor },
                { label: "Accent", color: activeKit.accentColor },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => applyColorToSelection(c.color, c.label)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-white/5 bg-white/5 p-2 transition hover:border-white/20 hover:bg-white/10"
                  title={`Apply ${c.label} (${c.color})`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-white/20 shadow-inner"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[10px] text-white/70">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Typography Swatches */}
          <div className="glass rounded-xl p-3">
            <span className="mb-2 block text-[11px] font-medium text-white/60">
              Quick Fonts (Click to apply to text)
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => applyFontToSelection(activeKit.fonts.heading, "Heading")}
                className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-left text-xs transition hover:border-white/20 hover:bg-white/10"
              >
                <span className="text-white/60">Heading:</span>
                <span className="font-semibold text-white/90 truncate ml-2" style={{ fontFamily: activeKit.fonts.heading }}>
                  {activeKit.fonts.heading}
                </span>
              </button>
              <button
                type="button"
                onClick={() => applyFontToSelection(activeKit.fonts.body, "Body")}
                className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-left text-xs transition hover:border-white/20 hover:bg-white/10"
              >
                <span className="text-white/60">Body:</span>
                <span className="text-white/90 truncate ml-2" style={{ fontFamily: activeKit.fonts.body }}>
                  {activeKit.fonts.body}
                </span>
              </button>
              {activeKit.fonts.accent && (
                <button
                  type="button"
                  onClick={() => applyFontToSelection(activeKit.fonts.accent, "Accent")}
                  className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/5 px-2.5 py-1.5 text-left text-xs transition hover:border-white/20 hover:bg-white/10"
                >
                  <span className="text-white/60">Accent:</span>
                  <span className="text-white/90 truncate ml-2" style={{ fontFamily: activeKit.fonts.accent }}>
                    {activeKit.fonts.accent}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Logo Insertion */}
          {activeKit.logo && (
            <div className="glass rounded-xl p-3">
              <span className="mb-2 block text-[11px] font-medium text-white/60">Brand Logo</span>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/40 p-1">
                  <img src={activeKit.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex flex-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      fabricRef.current?.addImage(activeKit.logo as string);
                      toast.success("Logo inserted");
                    }}
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Insert
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fabricRef.current?.addCircularImage(activeKit.logo as string, 160);
                      toast.success("Circular logo inserted");
                    }}
                    className="flex-1 rounded-lg bg-white/5 py-1.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Circle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Element Inserters */}
          <div className="space-y-1.5">
            <button
              onClick={() => applyTitle(activeKit)}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              + Add brand-styled restaurant title
            </button>
            <button
              onClick={() => applyBadge(activeKit)}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              + Add brand accent badge
            </button>
            <button
              onClick={() => applyBackground(activeKit)}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              Set canvas background to brand color
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ---------------- Background panel ---------------- */

const patternPresets = [
  { type: "dots" as const, label: "Dots" },
  { type: "lines" as const, label: "Lines" },
  { type: "crosshatch" as const, label: "Crosshatch" },
  { type: "grid" as const, label: "Grid" },
];

function PatternPreview({ type }: { type: string }) {
  if (type === "dots") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" fill="white" opacity="0.7" />
      </svg>
    );
  }
  if (type === "lines") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="2" opacity="0.7" />
      </svg>
    );
  }
  if (type === "crosshatch") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <line x1="12" y1="4" x2="12" y2="20" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="2" opacity="0.7" />
    </svg>
  );
}

function BackgroundPanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "gradients" | "textures" | "image">("colors");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeGradient, setActiveGradient] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      const url = await uploadFile(file);
      setIsUploading(false);
      if (url) {
        fabricRef.current?.setBackgroundImage(url);
        toast.success("Background image set");
      }
    },
    [fabricRef]
  );

  const applyColor = (value: string, name: string) => {
    fabricRef.current?.setBackgroundColor(value);
    setActiveColor(value);
    setActiveGradient(null);
    toast.success(`Background set to ${name}`);
  };

  const applyGradient = (preset: typeof gradientPresets[0]) => {
    fabricRef.current?.setBackgroundGradient(preset.colors, preset.angle);
    setActiveGradient(preset.name);
    setActiveColor(null);
    toast.success(`${preset.name} gradient applied`);
  };

  const tabs = [
    { id: "colors" as const, label: "Colors" },
    { id: "gradients" as const, label: "Gradients" },
    { id: "textures" as const, label: "Textures" },
    { id: "image" as const, label: "Image" },
  ];

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-white/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-all",
              activeTab === tab.id
                ? "bg-primary-500/30 text-primary-300 shadow"
                : "text-white/40 hover:text-white/70"
            )}
            aria-label={`${tab.label} tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Colors Tab ── */}
      {activeTab === "colors" && (
        <div className="space-y-5">
          {backgroundColorGroups.map((group) => (
            <div key={group.label}>
              <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {group.label}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {group.colors.map((bg) => (
                  <button
                    key={bg.name}
                    aria-label={`Set ${bg.name} background`}
                    onClick={() => applyColor(bg.value, bg.name)}
                    className="group flex flex-col items-center gap-1"
                    title={bg.name}
                  >
                    <div
                      className={cn(
                        "relative h-11 w-11 rounded-xl border-2 transition-all duration-200 group-hover:scale-110",
                        activeColor === bg.value
                          ? "border-primary-400 shadow-lg shadow-primary-500/30 scale-110"
                          : "border-white/10 group-hover:border-white/30"
                      )}
                      style={{ backgroundColor: bg.value }}
                    >
                      {activeColor === bg.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/90 p-0.5">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-white/40 truncate w-full text-center">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Custom color picker */}
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">🎨 Custom Color</h4>
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={(e) => {
                fabricRef.current?.setBackgroundColor(e.target.value);
                setActiveColor(e.target.value);
                setActiveGradient(null);
              }}
              className="h-10 w-full cursor-pointer rounded-xl border-0"
              aria-label="Custom background color"
            />
          </div>
        </div>
      )}

      {/* ── Gradients Tab ── */}
      {activeTab === "gradients" && (
        <div className="space-y-3">
          <p className="text-[11px] text-white/40">Click a gradient to instantly apply it to your canvas.</p>
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((preset) => {
              const gradientStyle = `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})`;
              return (
                <button
                  key={preset.name}
                  aria-label={`Apply ${preset.name} gradient`}
                  onClick={() => applyGradient(preset)}
                  className="group flex flex-col items-center gap-1.5"
                  title={preset.name}
                >
                  <div
                    className={cn(
                      "relative h-16 w-full rounded-xl border-2 transition-all duration-200 group-hover:scale-105",
                      activeGradient === preset.name
                        ? "border-primary-400 shadow-lg shadow-primary-500/30 scale-105"
                        : "border-white/10 group-hover:border-white/30"
                    )}
                    style={{ background: gradientStyle }}
                  >
                    {activeGradient === preset.name && (
                      <div className="absolute top-1 right-1 rounded-full bg-white/90 p-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-white/50">{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom gradient builder */}
          <div className="pt-2">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">🎨 Custom Gradient</h4>
            <GradientBuilder
              onChange={(colors, angle) => {
                fabricRef.current?.setBackgroundGradient(colors, angle);
                setActiveColor(null);
                setActiveGradient(null);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Textures Tab ── */}
      {activeTab === "textures" && (
        <div className="space-y-3">
          <p className="text-[11px] text-white/40">Apply a subtle pattern texture over your background.</p>
          <div className="grid grid-cols-2 gap-2">
            {patternPresets.map((pattern) => (
              <button
                key={pattern.type}
                aria-label={`Set ${pattern.label} texture`}
                onClick={() => {
                  fabricRef.current?.setBackgroundPattern(pattern.type);
                  toast.success(`${pattern.label} texture applied`);
                }}
                className="group flex flex-col items-center gap-1.5"
              >
                <div className="flex h-14 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:scale-105 group-hover:border-white/30 group-hover:bg-white/10">
                  <PatternPreview type={pattern.type} />
                </div>
                <span className="text-[10px] text-white/40">{pattern.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Image Tab ── */}
      {activeTab === "image" && (
        <div className="space-y-3">
          <p className="text-[11px] text-white/40">Upload a full-page photo or illustration as your background.</p>
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload background image"
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onClick={() => fileInputRef.current?.click()}
            className="glass flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 p-6 text-xs text-white/50 transition-all hover:border-primary-400/50 hover:bg-primary-500/5"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-white/30" />
                <span className="text-center">Click to upload or drag &amp; drop<br /><span className="text-[10px] text-white/30">JPG, PNG, WebP, GIF</span></span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBackgroundFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fabricRef.current?.clearBackgroundImage()}
            className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
          >
            Remove background image
          </button>
        </div>
      )}

      {/* Reset button always visible */}
      <div className="border-t border-white/5 pt-3">
        <button
          onClick={() => {
            fabricRef.current?.clearBackground();
            setActiveColor(null);
            setActiveGradient(null);
            toast.success("Background reset");
          }}
          className="glass flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white/80"
        >
          <RotateCw className="h-4 w-4" />
          Reset Background
        </button>
      </div>
    </div>
  );
}

/* ---------------- Templates panel ---------------- */

interface TemplatesPanelProps {
  fabricRef: React.RefObject<FabricCanvasRef | null>;
  onToolSelect: (id: string | null) => void;
}

function TemplatesPanel({ fabricRef, onToolSelect }: TemplatesPanelProps) {
  const [templates, setTemplates] = useState<
    {
      _id: string;
      name: string;
      category: string;
      isPremium?: boolean;
      preview?: { bg: string; title: string; accent: string; text: string };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates?limit=12")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTemplates(d.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleBlankCanvas = () => {
    fabricRef.current?.clearCanvas();
    toast.success("Canvas reset to blank");
  };

  const handleLoadTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/templates/${templateId}`);
      const d = await res.json();
      if (!d.success || !d.data?.canvasData) {
        toast.error("Failed to load template");
        return;
      }
      // Convert text → i-text for editability, then stringify
      const cd = d.data.canvasData as Record<string, unknown>;
      let data: Record<string, unknown> = cd;
      if (Array.isArray(data.objects)) {
        data = {
          ...data,
          objects: (data.objects as Record<string, unknown>[]).map((obj) =>
            obj.type === "text" ? { ...obj, type: "i-text" } : obj
          ),
        };
      }
      fabricRef.current?.setSuppressHistory(true);
      fabricRef.current?.clearCanvas();
      fabricRef.current?.loadJSON(JSON.stringify(data));
      fabricRef.current?.setSuppressHistory(false);
      onToolSelect(null);
      toast.success(`Loaded "${d.data.name}"`);
    } catch {
      toast.error("Failed to load template");
    }
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white/80">Templates</h3>
      <div className="space-y-2 mb-4">
        <button
          type="button"
          onClick={handleBlankCanvas}
          className="glass w-full cursor-pointer rounded-xl p-3 text-left transition-all hover:bg-white/10"
        >
          <div className="mb-2 h-16 rounded-lg bg-white/5 flex items-center justify-center">
            <Square className="h-5 w-5 text-white/30" />
          </div>
          <p className="text-sm font-medium text-white/80">Blank Canvas</p>
          <p className="text-xs text-white/40">Reset canvas to empty</p>
        </button>

        <button
          type="button"
          onClick={() => onToolSelect("brand")}
          className="glass w-full cursor-pointer rounded-xl p-3 text-left transition-all hover:bg-white/10"
        >
          <div className="mb-2 h-16 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Palette className="h-5 w-5 text-white/40" />
          </div>
          <p className="text-sm font-medium text-white/80">Your Brand</p>
          <p className="text-xs text-white/40">Apply brand kit styling</p>
        </button>
      </div>

      <h4 className="mb-2 text-[10px] font-medium text-white/40 uppercase tracking-wider">Browse Templates</h4>
      {loading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {templates.map((tpl) => {
            const p = tpl.preview;
            return (
              <button
                key={tpl._id}
                onClick={() => handleLoadTemplate(tpl._id)}
                className="glass flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-white/10"
                title={`Load ${tpl.name}`}
              >
                {/* Mini palette thumbnail */}
                <div
                  className="relative h-10 w-8 shrink-0 overflow-hidden rounded-[5px] border border-white/15 shadow-md"
                  style={{ backgroundColor: p?.bg ?? "#1f2937" }}
                >
                  {p ? (
                    <>
                      <div
                        className="mx-auto mt-2 h-[3px] w-3.5 rounded-full"
                        style={{ backgroundColor: p.title }}
                      />
                      <div
                        className="mx-auto mt-[3px] h-px w-2.5"
                        style={{ backgroundColor: p.accent }}
                      />
                      <div className="mx-auto mt-1.5 w-4 space-y-[3px]">
                        <div className="h-px w-full" style={{ backgroundColor: p.text, opacity: 0.55 }} />
                        <div className="h-px w-full" style={{ backgroundColor: p.text, opacity: 0.55 }} />
                        <div className="h-px w-3/4" style={{ backgroundColor: p.text, opacity: 0.55 }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <LayoutTemplate className="h-3.5 w-3.5 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white/80">{tpl.name}</p>
                  <p className="text-[10px] capitalize text-white/40">{tpl.category}</p>
                </div>
                {tpl.isPremium && (
                  <Crown className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <Link
        href="/templates"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary-500/20 px-4 py-2.5 text-sm font-medium text-primary-400 transition-colors hover:bg-primary-500/30"
      >
        <LayoutTemplate className="h-4 w-4" />
        Full Gallery
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ---------------- QR Code panel ---------------- */

function QRCodePanel({ fabricRef }: { fabricRef: React.RefObject<FabricCanvasRef | null> }) {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(120);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast.error("Enter a URL for the QR code");
      return;
    }
    setIsGenerating(true);
    await fabricRef.current?.addQRCode(url.trim(), size);
    setIsGenerating(false);
    toast.success("QR code added to canvas");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white/80">QR Code Generator</h3>
      <p className="text-xs text-white/40">
        Add a QR code linking to your online menu, website, or ordering page.
      </p>

      <div>
        <label className="mb-1.5 block text-xs text-white/50">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-menu.com"
          className="glass-input w-full px-3 py-2 text-sm"
          aria-label="QR code URL"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-white/50">Size: {size}px</label>
        <input
          type="range"
          min={60}
          max={300}
          step={10}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full accent-primary-500"
          aria-label="QR code size"
        />
        <div className="flex justify-between text-[10px] text-white/30">
          <span>60px</span>
          <span>300px</span>
        </div>
      </div>

      <GlassButton
        variant="primary"
        size="sm"
        className="w-full"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode className="h-4 w-4" />
            Add QR Code
          </>
        )}
      </GlassButton>

      <div className="glass rounded-xl p-3">
        <p className="text-[10px] text-white/40">
          💡 Tip: Place the QR code at the bottom corner of your menu. Guests can scan it to access your digital menu or leave reviews.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Sidebar shell ---------------- */

const SIDEBAR_PANEL_WIDTH = 260;

export function EditorSidebar({ activeTool, onToolSelect, fabricRef }: EditorSidebarProps) {
  return (
    <div className="flex h-full">
      <div className="glass flex w-14 flex-col items-center gap-1 border-r border-white/5 py-3" role="toolbar" aria-label="Editor tools">
        {sidebarTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(activeTool === tool.id ? null : tool.id)}
            aria-label={tool.label}
            aria-pressed={activeTool === tool.id}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
              activeTool === tool.id
                ? "bg-primary-500/20 text-primary-400"
                : "text-white/40 hover:bg-white/5 hover:text-white/70"
            )}
            title={tool.label}
          >
            <tool.icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: SIDEBAR_PANEL_WIDTH, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass overflow-hidden border-r border-white/5"
          >
            <div style={{ width: SIDEBAR_PANEL_WIDTH }} className="h-full overflow-y-auto p-4">
              {activeTool === "borders" && <BordersPanel fabricRef={fabricRef} />}
              {activeTool === "text" && <TextPanel fabricRef={fabricRef} />}
              {activeTool === "images" && <ImagesPanel fabricRef={fabricRef} />}
              {activeTool === "shapes" && <ShapesPanel fabricRef={fabricRef} />}
              {activeTool === "icons" && <IconsPanel fabricRef={fabricRef} />}
              {activeTool === "menu-items" && <MenuItemsPanel fabricRef={fabricRef} />}
              {activeTool === "categories" && <CategoriesPanel fabricRef={fabricRef} />}
              {activeTool === "brand" && <BrandPanel fabricRef={fabricRef} />}
              {activeTool === "background" && <BackgroundPanel fabricRef={fabricRef} />}
              {activeTool === "qrcode" && <QRCodePanel fabricRef={fabricRef} />}
              {activeTool === "templates" && (
                <TemplatesPanel fabricRef={fabricRef} onToolSelect={onToolSelect} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
