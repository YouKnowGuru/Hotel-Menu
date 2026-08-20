"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Wand2 } from "lucide-react";
import type { FabricCanvasRef } from "@/components/canvas/fabric-canvas";
import { GlassButton } from "@/components/glass/glass-button";
import { MENU_THEMES, CURRENCIES, MENU_BADGES, getThemeByCategory } from "@/constants";
import { MENU_ICONS } from "@/constants/icons";
import {
  generateMenu,
  fillTemplate,
  loadMenuFonts,
  remeasureCanvasText,
  type QuickFillData,
  type QuickFillItem,
  type QuickFillCategory,
} from "@/lib/menu-generator";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const uid = () => Math.random().toString(36).slice(2, 9);

const defaultItem = (): QuickFillItem => ({
  id: uid(),
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  badge: "",
  badgeColor: "#ef4444",
});

const SEED_CATEGORIES: QuickFillCategory[] = [
  {
    id: uid(),
    title: "Starters",
    items: [
      { id: uid(), name: "Bruschetta", description: "Tomato, basil, garlic", price: "9", oldPrice: "", badge: "VEG", badgeColor: "#16a34a" },
      { id: uid(), name: "Crispy Calamari", description: "Fried squid, aioli", price: "14", oldPrice: "18", badge: "", badgeColor: "#ef4444" },
    ],
  },
  {
    id: uid(),
    title: "Main Courses",
    items: [
      { id: uid(), name: "Truffle Pasta", description: "Fresh tagliatelle, black truffle", price: "24", oldPrice: "", badge: "CHEF'S SPECIAL", badgeColor: "#ef4444" },
      { id: uid(), name: "Grilled Salmon", description: "Atlantic salmon, seasonal vegetables", price: "28", oldPrice: "", badge: "", badgeColor: "#ef4444" },
    ],
  },
];

interface QuickFillModalProps {
  open: boolean;
  onClose: () => void;
  fabricRef: React.RefObject<FabricCanvasRef | null>;
  initialStyleCategory?: string;
}

export function QuickFillModal({ open, onClose, fabricRef, initialStyleCategory }: QuickFillModalProps) {
  const [restaurantName, setRestaurantName] = useState("The Grand Bistro");
  const [tagline, setTagline] = useState("Fine Cuisine · Est. 2024");
  const [footerText, setFooterText] = useState("Open Daily · 12:00 – 23:00");
  const [currency, setCurrency] = useState("$");
  const [themeId, setThemeId] = useState("elegant");
  const [categories, setCategories] = useState<QuickFillCategory[]>(SEED_CATEGORIES);
  const [icons, setIcons] = useState<string[]>([MENU_ICONS[0].path]);
  const [addFrame, setAddFrame] = useState(false);
  const appliedRef = useRef<string | null>(null);

  // Pre-select a theme when opened from a template category (e.g. ?style=coffee).
  useEffect(() => {
    if (open && initialStyleCategory && appliedRef.current !== initialStyleCategory) {
      appliedRef.current = initialStyleCategory;
      setThemeId(getThemeByCategory(initialStyleCategory));
    }
  }, [open, initialStyleCategory]);

  const addCategory = () =>
    setCategories((cs) => [
      ...cs,
      { id: uid(), title: "New Category", items: [defaultItem()] },
    ]);

  const updateCategory = (id: string, patch: Partial<QuickFillCategory>) =>
    setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const removeCategory = (id: string) =>
    setCategories((cs) => cs.filter((c) => c.id !== id));

  const addItem = (catId: string) =>
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId ? { ...c, items: [...c.items, defaultItem()] } : c
      )
    );

  const updateItem = (catId: string, itemId: string, patch: Partial<QuickFillItem>) =>
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
            }
          : c
      )
    );

  const removeItem = (catId: string, itemId: string) =>
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c
      )
    );

  const toggleIcon = (path: string) =>
    setIcons((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );

  const handleGenerate = async () => {
    const canvas = fabricRef.current?.getCanvas();
    if (!canvas) {
      toast.error("Canvas isn't ready yet");
      return;
    }
    if (
      !restaurantName.trim() &&
      categories.every((c) => c.items.every((i) => !i.name.trim()))
    ) {
      toast.error("Add a restaurant name or at least one menu item");
      return;
    }

    // ── Font loading ────────────────────────────────────────────────────────
    // Fabric measures text synchronously when objects are constructed.  If the
    // web-fonts haven't been downloaded yet, the browser falls back to a system
    // font whose glyphs have completely different widths — which makes leader
    // dots start in the wrong place, pushes prices into the wrong column, and
    // breaks wrapping estimates.
    //
    // Strategy: use document.fonts.ready (resolves once ALL fonts in the page
    // are loaded) with a 2 s safety timeout, then *also* prime every specific
    // menu font via FontFace.load() to maximise the chance they're cached.
    try {
      const fontsReady =
        typeof document !== "undefined" && "fonts" in document
          ? document.fonts.ready
          : Promise.resolve();
      await Promise.race([
        Promise.all([fontsReady, loadMenuFonts()]),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
    } catch {
      /* proceed regardless — layout will self-correct in the RAF pass below */
    }

    const theme = MENU_THEMES.find((t) => t.id === themeId) ?? MENU_THEMES[0];
    const data: QuickFillData = {
      restaurantName,
      tagline,
      footerText,
      currency,
      themeId,
      categories,
      icons,
      addFrame,
    };

    // Suppress per-object history during bulk changes — save once at the end.
    fabricRef.current?.setSuppressHistory(true);

    // If a real design template is on the canvas, fill it in place so its
    // visual design is preserved.  Otherwise (blank canvas OR a previously
    // generated menu — detected via the hidden marker rect) build fresh.
    let mode: "fill" | "generate" = "generate";
    if (fillTemplate(canvas, data)) {
      mode = "fill";
    } else {
      fabricRef.current?.clearCanvas();
      generateMenu(canvas, data, theme);
    }

    fabricRef.current?.resetZoom();
    fabricRef.current?.setSuppressHistory(false);
    // Trigger a full history save so the whole operation is one undo step.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: null } as any);

    toast.success(
      mode === "fill"
        ? "Template filled — click any text to edit"
        : "Menu generated — click any text to edit"
    );
    onClose();

    // ── Post-generation re-measurement pass ─────────────────────────────────
    // Even after the font-wait above, a browser may not have rasterised every
    // glyph into Fabric's canvas context yet.  Scheduling a remeasure in the
    // next animation frame (after the page has painted) ensures all IText /
    // Textbox objects re-compute their true widths with the real font metrics,
    // fixing any remaining dot-leader or price-alignment drift.
    if (mode === "generate") {
      requestAnimationFrame(() => {
        const cv = fabricRef.current?.getCanvas();
        if (cv) remeasureCanvasText(cv);
      });
    }
  };


  return (
<AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Quick Fill menu generator"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="glass-strong relative z-10 mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Quick Fill</h2>
                  <p className="text-xs text-white/40">
                    Pick a style, fill in your items, and generate the whole menu at once.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* 1. Style */}
              <section className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-white/80">1. Choose a style</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {MENU_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        themeId === t.id
                          ? "border-primary-500/60 bg-primary-500/10"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                      )}
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-start overflow-hidden rounded-lg border border-white/10"
                        style={{ background: t.bg }}
                      >
                        <span className="h-full w-2" style={{ background: t.accent }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white/80">{t.name}</span>
                        <span className="block text-[10px] uppercase tracking-wide text-white/30">
                          {t.isDark ? "Dark" : "Light"}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 2. Details */}
              <section className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-white/80">2. Restaurant details</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="glass-input w-full px-3 py-2 text-sm"
                    placeholder="Restaurant name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    aria-label="Restaurant name"
                  />
                  <input
                    className="glass-input w-full px-3 py-2 text-sm"
                    placeholder="Tagline (e.g. Fine Cuisine · Est. 2024)"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    aria-label="Tagline"
                  />
                  <input
                    className="glass-input w-full px-3 py-2 text-sm"
                    placeholder="Footer (e.g. Open Daily · 12–23)"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    aria-label="Footer text"
                  />
                  <div className="flex gap-3">
                    <select
                      className="glass-input px-2 py-2 text-sm"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      aria-label="Currency"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.symbol} className="bg-surface-900">
                          {c.symbol} {c.code}
                        </option>
                      ))}
                    </select>
                    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={addFrame}
                        onChange={(e) => setAddFrame(e.target.checked)}
                        className="h-4 w-4 accent-primary-500"
                      />
                      Decorative frame
                    </label>
                  </div>
                </div>
              </section>
              {/* 3. Categories & items */}
              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white/80">3. Categories & items</h3>
                  <button
                    onClick={addCategory}
                    className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add category
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="glass rounded-xl p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <input
                          className="glass-input flex-1 px-2 py-1.5 text-sm"
                          placeholder="Category title"
                          value={cat.title}
                          onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
                          aria-label="Category title"
                        />
                        <button
                          onClick={() => removeCategory(cat.id)}
                          aria-label="Remove category"
                          className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {cat.items.map((item) => (
                          <div key={item.id} className="rounded-lg bg-white/[0.02] p-2">
                            <div className="flex gap-2">
                              <input
                                className="glass-input flex-1 px-2 py-1.5 text-sm"
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => updateItem(cat.id, item.id, { name: e.target.value })}
                                aria-label="Item name"
                              />
                              <input
                                className="glass-input w-24 px-2 py-1.5 text-sm"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => updateItem(cat.id, item.id, { price: e.target.value })}
                                aria-label="Price"
                              />
                              <button
                                onClick={() => removeItem(cat.id, item.id)}
                                aria-label="Remove item"
                                className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <input
                                className="glass-input flex-1 px-2 py-1.5 text-sm"
                                placeholder="Description (optional)"
                                value={item.description}
                                onChange={(e) => updateItem(cat.id, item.id, { description: e.target.value })}
                                aria-label="Description"
                              />
                              <input
                                className="glass-input w-24 px-2 py-1.5 text-sm"
                                placeholder="Old price"
                                value={item.oldPrice}
                                onChange={(e) => updateItem(cat.id, item.id, { oldPrice: e.target.value })}
                                aria-label="Old price"
                              />
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <select
                                className="glass-input flex-1 px-2 py-1.5 text-sm"
                                value={item.badge}
                                onChange={(e) => {
                                  const b = MENU_BADGES.find((x) => x.value === e.target.value);
                                  updateItem(cat.id, item.id, {
                                    badge: e.target.value,
                                    badgeColor: b ? b.color : item.badgeColor,
                                  });
                                }}
                                aria-label="Badge"
                              >
                                <option value="" className="bg-surface-900">No badge</option>
                                {MENU_BADGES.map((b) => (
                                  <option key={b.value} value={b.value} className="bg-surface-900">
                                    {b.label}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="color"
                                value={item.badgeColor}
                                onChange={(e) => updateItem(cat.id, item.id, { badgeColor: e.target.value })}
                                className="h-8 w-10 cursor-pointer rounded-lg border-0"
                                aria-label="Badge color"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addItem(cat.id)}
                        className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-white/10 py-1.5 text-xs text-white/50 hover:bg-white/5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add item
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="rounded-lg bg-white/[0.02] p-4 text-center text-sm text-white/40">
                      No categories yet. Click “Add category” to start.
                    </p>
                  )}
                </div>
              </section>
              {/* 4. Icons */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-white/80">
                  4. Decorative icons <span className="text-white/30">(optional)</span>
                </h3>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {MENU_ICONS.map((icon) => {
                    const active = icons.includes(icon.path);
                    return (
                      <button
                        key={icon.name}
                        title={icon.name}
                        aria-pressed={active}
                        onClick={() => toggleIcon(icon.path)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg border p-2 transition-all",
                          active
                            ? "border-primary-500/60 bg-primary-500/10 text-primary-300"
                            : "border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/5"
                        )}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={icon.path} />
                        </svg>
                        <span className="text-[9px] text-white/40">{icon.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-white/5 px-6 py-4">
              <p className="text-xs text-white/40">
                This replaces the current canvas with your generated menu.
              </p>
              <div className="flex gap-2">
                <GlassButton variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" size="sm" onClick={handleGenerate}>
                  <Wand2 className="h-4 w-4" /> Generate Menu
                </GlassButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
