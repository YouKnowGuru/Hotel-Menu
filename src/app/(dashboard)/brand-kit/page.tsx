"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Save,
  Plus,
  Trash2,
  Copy,
  Upload,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Check,
  Utensils,
  ChevronRight,
  Eye,
  Type,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { FONT_OPTIONS } from "@/constants";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface BrandKit {
  _id?: string;
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
}

const BRAND_PALETTES = [
  {
    name: "Royal Gold & Dark",
    primary: "#d4af37",
    secondary: "#121316",
    accent: "#f59e0b",
    heading: "Playfair Display",
    body: "Inter",
  },
  {
    name: "Midnight Luxury",
    primary: "#a78bfa",
    secondary: "#0f172a",
    accent: "#ec4899",
    heading: "Cinzel",
    body: "Inter",
  },
  {
    name: "Tuscan Bistro",
    primary: "#9a3412",
    secondary: "#fffbeb",
    accent: "#d97706",
    heading: "Lora",
    body: "Montserrat",
  },
  {
    name: "Modern Charcoal",
    primary: "#f97316",
    secondary: "#18181b",
    accent: "#38bdf8",
    heading: "Oswald",
    body: "Inter",
  },
  {
    name: "Fresh Emerald",
    primary: "#059669",
    secondary: "#f0fdf4",
    accent: "#10b981",
    heading: "Poppins",
    body: "Inter",
  },
  {
    name: "Sunset Fire",
    primary: "#ea580c",
    secondary: "#1c1917",
    accent: "#facc15",
    heading: "Bebas Neue",
    body: "Poppins",
  },
];

const createEmptyKit = (name = "My Brand Kit"): BrandKit => ({
  name,
  logo: "",
  primaryColor: "#8b5cf6",
  secondaryColor: "#0f172a",
  accentColor: "#f59e0b",
  fonts: {
    heading: "Playfair Display",
    body: "Inter",
    accent: "Dancing Script",
  },
});

export default function BrandKitPage() {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeKit, setActiveKit] = useState<BrandKit>(createEmptyKit());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all user's brand kits
  const loadKits = async () => {
    try {
      const res = await fetch("/api/brand-kit");
      const d = await res.json();
      if (d.success) {
        if (d.data && d.data.length > 0) {
          setBrandKits(d.data);
          // Keep current active kit if still present, or select first
          const current = d.data.find((k: BrandKit) => k._id === selectedId) || d.data[0];
          setSelectedId(current._id || null);
          setActiveKit({
            _id: current._id,
            name: current.name || "My Restaurant",
            logo: current.logo || "",
            primaryColor: current.primaryColor || "#8b5cf6",
            secondaryColor: current.secondaryColor || "#0f172a",
            accentColor: current.accentColor || "#f59e0b",
            fonts: {
              heading: current.fonts?.heading || "Playfair Display",
              body: current.fonts?.body || "Inter",
              accent: current.fonts?.accent || "Dancing Script",
            },
          });
        } else {
          setBrandKits([]);
          setActiveKit(createEmptyKit("My Restaurant"));
          setSelectedId(null);
        }
      }
    } catch {
      toast.error("Failed to load brand kits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKits();
  }, []);

  const selectKit = (kit: BrandKit) => {
    setSelectedId(kit._id || null);
    setActiveKit({
      _id: kit._id,
      name: kit.name || "My Restaurant",
      logo: kit.logo || "",
      primaryColor: kit.primaryColor || "#8b5cf6",
      secondaryColor: kit.secondaryColor || "#0f172a",
      accentColor: kit.accentColor || "#f59e0b",
      fonts: {
        heading: kit.fonts?.heading || "Playfair Display",
        body: kit.fonts?.body || "Inter",
        accent: kit.fonts?.accent || "Dancing Script",
      },
    });
  };

  const handleNewKit = () => {
    const newKit = createEmptyKit(`Brand Kit ${brandKits.length + 1}`);
    setSelectedId(null);
    setActiveKit(newKit);
  };

  const handleDuplicateKit = () => {
    const dup: BrandKit = {
      ...activeKit,
      _id: undefined,
      name: `${activeKit.name} (Copy)`,
    };
    setSelectedId(null);
    setActiveKit(dup);
    toast.success("Kit duplicated as new draft. Click 'Save' to store.");
  };

  const updateField = (key: keyof BrandKit, value: unknown) => {
    setActiveKit((prev) => ({ ...prev, [key]: value }));
  };

  const updateFont = (key: "heading" | "body" | "accent", value: string) => {
    setActiveKit((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: value },
    }));
  };

  const applyPalette = (palette: (typeof BRAND_PALETTES)[0]) => {
    setActiveKit((prev) => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      fonts: {
        ...prev.fonts,
        heading: palette.heading,
        body: palette.body,
      },
    }));
    toast.success(`Applied ${palette.name} palette`);
  };

  // Logo upload to Cloudinary via /api/upload
  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG, WebP)");
      return;
    }
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setActiveKit((prev) => ({ ...prev, logo: data.data.url }));
        toast.success("Logo uploaded ✓");
      } else {
        toast.error(data.error || "Logo upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Save or Update Kit
  const handleSave = async () => {
    if (!activeKit.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    setIsSaving(true);
    try {
      const isUpdate = !!activeKit._id;
      const res = await fetch("/api/brand-kit", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUpdate
            ? { id: activeKit._id, ...activeKit }
            : {
                name: activeKit.name,
                logo: activeKit.logo,
                primaryColor: activeKit.primaryColor,
                secondaryColor: activeKit.secondaryColor,
                accentColor: activeKit.accentColor,
                fonts: activeKit.fonts,
              }
        ),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(isUpdate ? "Brand kit updated ✓" : "Brand kit created ✓");
        await loadKits();
        if (!isUpdate && d.data?._id) {
          setSelectedId(d.data._id);
          setActiveKit((prev) => ({ ...prev, _id: d.data._id }));
        }
      } else {
        toast.error(d.error || "Failed to save brand kit");
      }
    } catch {
      toast.error("Failed to save brand kit");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Kit
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/brand-kit?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Brand kit deleted");
        setDeleteConfirmId(null);
        await loadKits();
      } else {
        toast.error(d.error || "Failed to delete kit");
      }
    } catch {
      toast.error("Error deleting brand kit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-96 rounded-2xl bg-white/5 animate-pulse lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Brand <span className="gradient-text">Kits</span>
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Manage logos, colors, and typography to style your restaurant menus consistently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="ghost" size="sm" onClick={handleNewKit}>
              <Plus className="h-4 w-4" />
              New Brand Kit
            </GlassButton>
            <GlassButton variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {activeKit._id ? "Save Changes" : "Create Kit"}
            </GlassButton>
          </div>
        </div>

        {/* Main Grid: Sidebar of Kits + Kit Editor + Real-time Mockup Preview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Brand Kit Selector & List (3 cols) */}
          <div className="space-y-4 lg:col-span-3">
            <GlassCard level={2} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Your Brand Kits ({brandKits.length})
                </span>
                <button
                  onClick={handleNewKit}
                  className="rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                  title="Create New Kit"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {brandKits.length === 0 ? (
                <div className="py-6 text-center text-xs text-white/40">
                  No brand kits yet. Click &ldquo;New Brand Kit&rdquo; above to start!
                </div>
              ) : (
                <div className="space-y-2">
                  {brandKits.map((kit) => {
                    const isSelected = selectedId === kit._id;
                    return (
                      <div
                        key={kit._id}
                        onClick={() => selectKit(kit)}
                        className={cn(
                          "group relative flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all",
                          isSelected
                            ? "border border-primary-400/50 bg-primary-500/15 shadow-lg shadow-primary-500/10"
                            : "border border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-white/90">{kit.name}</p>
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />}
                          </div>
                          {/* Color swatches */}
                          <div className="mt-2 flex items-center gap-1.5">
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: kit.primaryColor }}
                            />
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: kit.secondaryColor }}
                            />
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: kit.accentColor }}
                            />
                            <span className="ml-1 text-[10px] text-white/40 truncate">
                              {kit.fonts?.heading}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* Quick Actions for Active Kit */}
            {activeKit._id && (
              <GlassCard level={1} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleDuplicateKit}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(activeKit._id || null)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/10 py-2 text-xs text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </GlassCard>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
              <GlassCard level={3} className="border-red-500/30 p-4">
                <p className="text-xs font-semibold text-white">Delete &ldquo;{activeKit.name}&rdquo;?</p>
                <p className="mt-1 text-[11px] text-white/50">This action cannot be undone.</p>
                <div className="mt-3 flex gap-2">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </GlassButton>
                  <button
                    type="button"
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Center Column: Kit Configuration (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Brand Name */}
            <GlassCard level={2} className="p-5">
              <h3 className="mb-2 text-sm font-semibold text-white/90">Brand Name</h3>
              <input
                type="text"
                value={activeKit.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm"
                placeholder="e.g. The Rustic Oak Bistro"
              />
            </GlassCard>

            {/* Brand Logo Upload */}
            <GlassCard level={2} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white/90">Brand Logo</h3>
                  <p className="text-xs text-white/40">Upload high-res PNG, JPG or SVG</p>
                </div>
                {activeKit.logo && (
                  <button
                    type="button"
                    onClick={() => updateField("logo", "")}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>

              {activeKit.logo ? (
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-black/40 p-1">
                    <img
                      src={activeKit.logo}
                      alt="Brand Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white/80">Active Logo</p>
                    <p className="truncate text-[10px] text-white/40">{activeKit.logo}</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 text-xs text-primary-400 hover:underline"
                    >
                      Replace image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 p-6 transition hover:border-primary-400/60 hover:bg-primary-500/5"
                >
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                      <span className="text-xs text-white/50">Uploading logo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-white/30" />
                      <span className="text-xs font-medium text-white/70">Click or drag logo to upload</span>
                      <span className="text-[10px] text-white/30">PNG with transparent background recommended</span>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                  e.target.value = "";
                }}
              />
            </GlassCard>

            {/* Curated Color Palettes */}
            <GlassCard level={2} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Palette Presets</h3>
                <span className="text-[11px] text-white/40">1-click apply</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {BRAND_PALETTES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPalette(p)}
                    className="flex flex-col rounded-xl border border-white/5 bg-white/5 p-2 text-left transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex h-5 w-full overflow-hidden rounded-md border border-white/10">
                      <div className="h-full w-1/3" style={{ backgroundColor: p.primary }} />
                      <div className="h-full w-1/3" style={{ backgroundColor: p.secondary }} />
                      <div className="h-full w-1/3" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="mt-1.5 truncate text-[11px] font-medium text-white/70">{p.name}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Custom Brand Colors */}
            <GlassCard level={2} className="p-5">
              <h3 className="mb-3 text-sm font-semibold text-white/90">Brand Colors</h3>
              <div className="space-y-3">
                {[
                  { label: "Primary (Titles & Headers)", field: "primaryColor" as const, val: activeKit.primaryColor },
                  { label: "Secondary (Background / Card)", field: "secondaryColor" as const, val: activeKit.secondaryColor },
                  { label: "Accent (Badges & Highlights)", field: "accentColor" as const, val: activeKit.accentColor },
                ].map((item) => (
                  <div key={item.field} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-white/70">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={item.val}
                        onChange={(e) => updateField(item.field, e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-lg border border-white/20 bg-transparent"
                      />
                      <input
                        type="text"
                        value={item.val}
                        onChange={(e) => updateField(item.field, e.target.value)}
                        className="glass-input w-24 px-2 py-1 text-center font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Typography */}
            <GlassCard level={2} className="p-5">
              <h3 className="mb-3 text-sm font-semibold text-white/90">Brand Typography</h3>
              <div className="space-y-4">
                {/* Heading Font */}
                <div>
                  <label className="mb-1 block text-xs text-white/60">Heading & Category Font</label>
                  <select
                    value={activeKit.fonts.heading}
                    onChange={(e) => updateFont("heading", e.target.value)}
                    className="glass-input w-full px-3 py-2 text-xs"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.name} value={f.name} className="bg-surface-900 text-white">
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-2 truncate text-xl font-bold"
                    style={{
                      fontFamily: activeKit.fonts.heading,
                      color: activeKit.primaryColor,
                    }}
                  >
                    {activeKit.name || "Sample Heading"}
                  </p>
                </div>

                {/* Body Font */}
                <div>
                  <label className="mb-1 block text-xs text-white/60">Body Text Font</label>
                  <select
                    value={activeKit.fonts.body}
                    onChange={(e) => updateFont("body", e.target.value)}
                    className="glass-input w-full px-3 py-2 text-xs"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.name} value={f.name} className="bg-surface-900 text-white">
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-1 text-xs text-white/70"
                    style={{ fontFamily: activeKit.fonts.body }}
                  >
                    Truffle glazed filet mignon with roasted baby potatoes & garlic herb butter.
                  </p>
                </div>

                {/* Accent Font */}
                <div>
                  <label className="mb-1 block text-xs text-white/60">Accent / Script Font</label>
                  <select
                    value={activeKit.fonts.accent}
                    onChange={(e) => updateFont("accent", e.target.value)}
                    className="glass-input w-full px-3 py-2 text-xs"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.name} value={f.name} className="bg-surface-900 text-white">
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-1 text-lg"
                    style={{
                      fontFamily: activeKit.fonts.accent,
                      color: activeKit.accentColor,
                    }}
                  >
                    Chef&apos;s Signature Special
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Real-time Live Menu Mockup Preview (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="sticky top-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                  <Eye className="h-3.5 w-3.5 text-primary-400" />
                  Live Menu Preview
                </span>
                <span className="text-[10px] text-white/40">Real-time update</span>
              </div>

              {/* Realistic Menu Card Mockup */}
              <div
                className="relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl transition-all"
                style={{
                  backgroundColor: activeKit.secondaryColor,
                  color: "#ffffff",
                }}
              >
                {/* Decorative corner accent */}
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-xl"
                  style={{ backgroundColor: activeKit.primaryColor }}
                />

                {/* Restaurant Logo & Name Header */}
                <div className="text-center">
                  {activeKit.logo && (
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/20 p-1 shadow-md">
                      <img
                        src={activeKit.logo}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  <h2
                    className="text-2xl font-bold tracking-wide"
                    style={{
                      fontFamily: activeKit.fonts.heading,
                      color: activeKit.primaryColor,
                    }}
                  >
                    {activeKit.name || "RESTAURANT NAME"}
                  </h2>

                  <p
                    className="mt-0.5 text-sm"
                    style={{
                      fontFamily: activeKit.fonts.accent,
                      color: activeKit.accentColor,
                    }}
                  >
                    Handcrafted Cuisine & Fine Dining
                  </p>

                  <div
                    className="mx-auto my-3 h-0.5 w-16"
                    style={{ backgroundColor: activeKit.accentColor }}
                  />
                </div>

                {/* Sample Category 1 */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{
                        fontFamily: activeKit.fonts.heading,
                        color: activeKit.primaryColor,
                      }}
                    >
                      Starters
                    </span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                      style={{
                        backgroundColor: activeKit.accentColor,
                        color: "#111827",
                      }}
                    >
                      CHEF&apos;S PICK
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-baseline justify-between">
                      <span
                        className="font-medium"
                        style={{ fontFamily: activeKit.fonts.body, opacity: 0.95 }}
                      >
                        Crispy Truffle Calamari
                      </span>
                      <span className="font-bold" style={{ color: activeKit.primaryColor }}>
                        $18
                      </span>
                    </div>
                    <p
                      className="text-[10px] text-white/50"
                      style={{ fontFamily: activeKit.fonts.body }}
                    >
                      Garlic aioli, lemon zest, smoked paprika
                    </p>
                  </div>
                </div>

                {/* Sample Category 2 */}
                <div className="mt-5">
                  <span
                    className="mb-2 block text-xs font-bold uppercase tracking-wider"
                    style={{
                      fontFamily: activeKit.fonts.heading,
                      color: activeKit.primaryColor,
                    }}
                  >
                    Main Courses
                  </span>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span
                          className="font-medium"
                          style={{ fontFamily: activeKit.fonts.body, opacity: 0.95 }}
                        >
                          Dry-Aged Ribeye 12oz
                        </span>
                        <span className="font-bold" style={{ color: activeKit.primaryColor }}>
                          $48
                        </span>
                      </div>
                      <p
                        className="text-[10px] text-white/50"
                        style={{ fontFamily: activeKit.fonts.body }}
                      >
                        Bone marrow butter, rosemary roasted potatoes
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between">
                        <span
                          className="font-medium"
                          style={{ fontFamily: activeKit.fonts.body, opacity: 0.95 }}
                        >
                          Pan-Seared Sea Bass
                        </span>
                        <span className="font-bold" style={{ color: activeKit.primaryColor }}>
                          $36
                        </span>
                      </div>
                      <p
                        className="text-[10px] text-white/50"
                        style={{ fontFamily: activeKit.fonts.body }}
                      >
                        Saffron risotto, asparagus, citrus emulsion
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer note in preview */}
                <div className="mt-6 border-t border-white/10 pt-3 text-center">
                  <p
                    className="text-[9px] text-white/40"
                    style={{ fontFamily: activeKit.fonts.body }}
                  >
                    Please inform your server of any food allergies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
