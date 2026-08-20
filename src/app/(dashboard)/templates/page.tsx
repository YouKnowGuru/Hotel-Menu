"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  LayoutTemplate,
  ArrowRight,
  WandSparkles,
  Crown,
  Eye,
  X,
  Minus,
  Zap,
  Sparkles,
  Moon,
  Clock,
  Trees,
  Coffee,
  Cake,
  CupSoda,
  Utensils,
  Building,
  Hamburger,
  Pizza,
  Sandwich,
  Flame,
  ChefHat,
  Soup,
  Fish,
  Mountain,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TEMPLATE_CATEGORIES } from "@/constants";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { TemplatePreviewData } from "@/lib/template-data";

/* ------------------------------- types ------------------------------- */

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  style: string;
  orientation: string;
  paperSize: string;
  thumbnail?: string;
  gradient: string;
  isPremium: boolean;
  tags: string[];
  createdAt?: string;
  preview?: TemplatePreviewData;
}

type SortMode = "featured" | "name" | "newest";

/* --------------------------- category meta ---------------------------- */

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  minus: Minus,
  zap: Zap,
  crown: Crown,
  sparkles: Sparkles,
  moon: Moon,
  clock: Clock,
  trees: Trees,
  coffee: Coffee,
  cake: Cake,
  "cup-soda": CupSoda,
  utensils: Utensils,
  building: Building,
  burger: Hamburger,
  pizza: Pizza,
  sandwich: Sandwich,
  flame: Flame,
  "chef-hat": ChefHat,
  soup: Soup,
  fish: Fish,
  mountain: Mountain,
  calendar: Calendar,
};

const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> =
  Object.fromEntries(
    TEMPLATE_CATEGORIES.map((c) => [
      c.value,
      { label: c.label, icon: CATEGORY_ICONS[c.icon] ?? LayoutTemplate },
    ])
  );

const DEFAULT_PREVIEW: TemplatePreviewData = {
  bg: "#ffffff",
  title: "#1a1a1a",
  accent: "#c9a96e",
  text: "#333333",
  items: [
    { n: "French Onion Soup", p: "$14" },
    { n: "Seared Foie Gras", p: "$22" },
    { n: "Grilled Sea Bass", p: "$34" },
    { n: "Filet Mignon", p: "$48" },
  ],
};

/* ----------------------------- color utils ---------------------------- */

function parseHex(hex: string) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h || "ffffff", 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function withAlpha(hex: string, a: number) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function mix(hex: string, target: number, amt: number) {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.round(r + (target - r) * amt)}, ${Math.round(
    g + (target - g) * amt
  )}, ${Math.round(b + (target - b) * amt)})`;
}

const lighten = (hex: string, amt: number) => mix(hex, 255, amt);
const darken = (hex: string, amt: number) => mix(hex, 0, amt);

/* ------------------------------ MenuPreview --------------------------- */
/* Renders a faithful miniature of the actual menu design from its palette. */

function MenuPreview({
  template,
  size = "card",
}: {
  template: Template;
  size?: "card" | "large";
}) {
  const style = template.preview ?? DEFAULT_PREVIEW;
  const cat = CATEGORY_META[template.category];
  const large = size === "large";

  return (
    <div
      className="relative aspect-[210/297] w-full overflow-hidden rounded-lg border-[1px] border-solid"
      style={{
        backgroundColor: style.bg,
        borderColor: withAlpha(style.accent, 0.4),
        backgroundImage: `linear-gradient(150deg, ${lighten(
          style.bg,
          0.06
        )} 0%, ${style.bg} 50%, ${darken(style.bg, 0.08)} 100%)`,
        boxShadow: "0 18px 38px -10px rgba(0,0,0,0.6)",
      }}
      aria-hidden="true"
    >
      {/* Inner frame */}
      <div
        className="pointer-events-none absolute inset-[4.5%] rounded-[3px] border"
        style={{ borderColor: withAlpha(style.accent, 0.3) }}
      />

      {/* Corner diamonds on the frame */}
      {["left", "right"].flatMap((x) =>
        ["top", "bottom"].map((y) => (
          <span
            key={`${x}-${y}`}
            className={cn(
              "absolute h-[3.5%] w-[4.8%] rotate-45 rounded-[1px]",
              x === "left" ? "left-[4.5%] -translate-x-1/2" : "left-[95.5%] -translate-x-1/2",
              y === "top" ? "top-[4.5%] -translate-y-1/2" : "top-[95.5%] -translate-y-1/2"
            )}
            style={{ backgroundColor: style.accent }}
          />
        ))
      )}

      <div className="relative flex h-full flex-col px-[11%] pb-[6%] pt-[9%]">
        {/* Header */}
        <div className="text-center">
          <div
            className={cn(
              "font-bold uppercase leading-tight tracking-[0.14em]",
              large ? "text-lg" : "text-[8.5px]"
            )}
            style={{ color: style.title, fontFamily: "'Playfair Display', serif" }}
          >
            {template.name}
          </div>
          <div
            className={cn(
              "mt-[2.5%] font-semibold uppercase tracking-[0.3em]",
              large ? "text-[9px]" : "text-[4px]"
            )}
            style={{ color: style.accent }}
          >
            {cat?.label ?? "Menu"}
          </div>
          <div
            className="mx-auto mt-[3.5%] h-px w-2/5"
            style={{
              background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
            }}
          />
        </div>

        {/* Items */}
        <div className={cn("mt-auto", large ? "space-y-2.5 pb-2" : "space-y-[3px] pb-1")}>
          {style.items.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-baseline">
              <span
                className={cn(
                  "max-w-[62%] truncate font-medium",
                  large ? "text-[11px]" : "text-[5.5px]"
                )}
                style={{ color: style.text }}
              >
                {item.n}
              </span>
              <span
                className="mx-[2.5%] flex-1 border-b border-dotted"
                style={{ borderColor: withAlpha(style.accent, 0.55) }}
              />
              <span
                className={cn("shrink-0 font-bold", large ? "text-[11px]" : "text-[5.5px]")}
                style={{ color: style.title }}
              >
                {item.p}
              </span>
            </div>
          ))}
        </div>

        {/* Footer ornament */}
        <div className="mt-[4%] flex flex-col items-center">
          <span
            className={large ? "h-1.5 w-1.5 rotate-45" : "h-1 w-1 rotate-45"}
            style={{ backgroundColor: style.accent }}
          />
          <span
            className={cn(
              "mt-[2%] uppercase tracking-[0.25em]",
              large ? "text-[7px]" : "text-[3.5px]"
            )}
            style={{ color: withAlpha(style.text, 0.75) }}
          >
            Est. 2026 · Fine Food &amp; Drinks
          </span>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------ TemplateCard --------------------------- */

function TemplateCard({
  tpl,
  index,
  onPreview,
}: {
  tpl: Template;
  index: number;
  onPreview: (t: Template) => void;
}) {
  const style = tpl.preview ?? DEFAULT_PREVIEW;
  const cat = CATEGORY_META[tpl.category];
  const CatIcon = cat?.icon ?? LayoutTemplate;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="h-full min-w-0"
    >
      <div className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:shadow-[0_20px_50px_-15px_rgba(139,92,246,0.35)]">
        {/* Preview stage */}
        <button
          type="button"
          onClick={() => onPreview(tpl)}
          aria-label={`Preview ${tpl.name}`}
          className="relative block w-full cursor-pointer overflow-hidden p-4 pb-0 text-left"
        >
          {/* Clean backdrop */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent"
          />
          <div className="relative mx-auto w-[68%] transition-transform duration-500 group-hover:scale-[1.04]">
            <MenuPreview template={tpl} />
          </div>

          {/* Hover veil */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-lg">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>

          {tpl.isPremium && (
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-lg">
              <Crown className="h-3 w-3" /> PRO
            </div>
          )}
        </button>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold leading-tight text-white">{tpl.name}</h3>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-white/40">{tpl.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/15 px-2 py-0.5 text-[10px] font-medium text-primary-300">
              <CatIcon className="h-3 w-3" />
              {cat?.label ?? tpl.category}
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase text-white/40">
              {tpl.paperSize}
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] capitalize text-white/40">
              {tpl.orientation}
            </span>
          </div>

          <div className="mt-auto flex gap-2 pt-4">
            <Link
              href={`/editor/new?template=${tpl._id}`}
              aria-label={`Use template ${tpl.name}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 px-3 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] active:scale-[0.98]"
            >
              Use Template <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/editor/new?template=${tpl._id}&autofill=1&style=${tpl.category}`}
              aria-label={`Customize and fill ${tpl.name}`}
              title="Open this template and fill it with your own items"
              className="glass inline-flex w-11 items-center justify-center rounded-xl text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <WandSparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


/* --------------------------- Quick-view modal -------------------------- */

function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  const style = template.preview ?? DEFAULT_PREVIEW;
  const cat = CATEGORY_META[template.category];
  const CatIcon = cat?.icon ?? LayoutTemplate;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} preview`}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="glass-strong relative z-10 flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid overflow-y-auto md:grid-cols-[minmax(0,380px)_1fr]">
          {/* Left: large preview on clean backdrop */}
          <div className="relative flex items-center justify-center overflow-hidden p-4 sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-black/30"
            />
            <div className="relative w-full max-w-[280px]">
              <MenuPreview template={template} size="large" />
            </div>
          </div>

          {/* Right: details + actions */}
          <div className="flex flex-col border-t border-white/10 p-6 sm:p-8 md:border-l md:border-t-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/15 px-2.5 py-1 text-xs font-medium text-primary-300">
                <CatIcon className="h-3.5 w-3.5" />
                {cat?.label ?? template.category}
              </span>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs uppercase text-white/40">
                {template.paperSize}
              </span>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-white/40">
                {template.orientation}
              </span>
              {template.style && (
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs capitalize text-white/40">
                  {template.style}
                </span>
              )}
              {template.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                  <Crown className="h-3 w-3" /> PRO
                </span>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white">{template.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {template.description}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                Color Palette
              </p>
              <div className="flex gap-3">
                {[style.bg, style.title, style.accent, style.text].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span
                      className="h-9 w-9 rounded-xl border border-white/15 shadow-inner"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-[9px] uppercase tracking-wide text-white/35">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {template.tags.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
              <Link
                href={`/editor/new?template=${template._id}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] active:scale-[0.98]"
              >
                Use Template <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/editor/new?template=${template._id}&autofill=1&style=${template.category}`}
                className="glass inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <WandSparkles className="h-4 w-4" /> Customize &amp; Fill
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ------------------------------- Skeleton ------------------------------ */

function SkeletonCard() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="shimmer h-64" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-4 w-2/3 rounded" />
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="shimmer h-5 w-16 rounded-full" />
          <div className="shimmer h-5 w-12 rounded-full" />
        </div>
        <div className="shimmer h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ------------------------------- Page ---------------------------------- */

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A–Z" },
  { value: "newest", label: "Newest" },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortMode>("featured");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // `loading` is derived during render (instead of calling setState inside the
  // fetch effect) by comparing the live query against the query we last got a
  // response for. This avoids cascading renders and never gets stuck.
  const queryKey = `${debouncedSearch}::${selectedCategory ?? ""}`;
  const [resultKey, setResultKey] = useState<string | null>(null);
  const loading = resultKey !== queryKey;

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);

    fetch(`/api/templates?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.success) {
          setTemplates(d.data ?? []);
        } else {
          toast.error("Failed to load templates");
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load templates");
      })
      .finally(() => {
        // Mark this query as resolved so the derived `loading` flips off.
        if (!cancelled) setResultKey(queryKey);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory, queryKey]);

  const visibleTemplates = useMemo(() => {
    const list = [...templates];
    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
        break;
      default:
        break;
    }
    return list;
  }, [templates, sortBy]);

  const hasActiveFilters = Boolean(debouncedSearch || selectedCategory);


  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Template <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="mt-2 text-white/50">
            Choose from professionally designed menu templates and make them yours
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="glass flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search templates by name, style, or tag..."
                aria-label="Search templates by name, description, or tag"
                className="glass-input w-full pl-10 pr-10 [&::-webkit-search-cancel-button]:hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-white/40 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="template-sort"
                className="shrink-0 text-sm text-white/40"
              >
                Sort by
              </label>
              <select
                id="template-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="glass-input cursor-pointer px-3 py-2 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-surface-900">
                    {opt.label}
                  </option>
                ))}
              </select>

              {!loading && (
                <span className="shrink-0 text-sm text-white/40" role="status">
                  {templates.length} template{templates.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div
            className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Filter templates by category"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              aria-pressed={!selectedCategory}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                !selectedCategory
                  ? "border border-primary-500/40 bg-primary-500/30 text-primary-200"
                  : "glass text-white/50 hover:text-white/80"
              )}
            >
              <Sparkles className="h-4 w-4" />
              All
            </button>
            {TEMPLATE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_META[cat.value]?.icon ?? LayoutTemplate;
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() =>
                    setSelectedCategory(active ? null : cat.value)
                  }
                  aria-pressed={active}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all",
                    active
                      ? "border border-primary-500/40 bg-primary-500/30 text-primary-200"
                      : "glass text-white/50 hover:text-white/80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              : visibleTemplates.map((tpl, i) => (
                  <TemplateCard
                    key={tpl._id}
                    tpl={tpl}
                    index={i}
                    onPreview={setPreviewTemplate}
                  />
                ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {!loading && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="glass-card mx-auto inline-flex flex-col items-center rounded-2xl px-6 py-10 sm:px-16 sm:py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <LayoutTemplate className="h-8 w-8 text-white/25" />
              </div>
              <p className="mb-2 text-xl font-semibold text-white/60">
                No templates found
              </p>
              <p className="text-sm text-white/30">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setSelectedCategory(null);
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(139,92,246,0.5)] sm:w-auto"
                >
                  <X className="h-4 w-4" /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

