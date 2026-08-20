"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Download,
  Loader2,
  Check,
  Eye,
  Printer,
  Settings2,
  Wand2,
  LayoutTemplate,
  History,
} from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";
import { cn } from "@/lib/utils";

export interface ViewSettings {
  snapToGrid: boolean;
  showGrid: boolean;
  showSafeArea: boolean;
  showBleed: boolean;
}

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  saveStatus: "saved" | "saving" | "unsaved";
  onSave: () => void;
  onExport: () => void;
  onPreview: () => void;
  onPrint: () => void;
  onBack: () => void;
  onQuickFill: () => void;
  onSaveAsTemplate?: () => void;
  onVersionHistory?: () => void;
  viewSettings: ViewSettings;
  onViewSettingChange: (key: keyof ViewSettings, value: boolean) => void;
}

export function EditorToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  saveStatus,
  onSave,
  onExport,
  onPreview,
  onPrint,
  onBack,
  onQuickFill,
  onSaveAsTemplate,
  onVersionHistory,
  viewSettings,
  onViewSettingChange,
}: EditorToolbarProps) {
  const [showViewSettings, setShowViewSettings] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowViewSettings(false);
      }
    };
    if (showViewSettings) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showViewSettings]);

  return (
    <div className="glass flex items-center justify-between border-b border-white/5 px-4 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          aria-label="Back to projects"
          className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <GlassButton
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo (Ctrl+Z)"
          className={cn(!canUndo && "pointer-events-none opacity-30")}
        >
          <Undo2 className="h-4 w-4" />
        </GlassButton>
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo (Ctrl+Shift+Z)"
          className={cn(!canRedo && "pointer-events-none opacity-30")}
        >
          <Redo2 className="h-4 w-4" />
        </GlassButton>

        <div className="h-6 w-px bg-white/10" />

        <GlassButton variant="ghost" size="sm" onClick={onZoomOut} aria-label="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </GlassButton>
        <button
          onClick={onZoomReset}
          className="min-w-[50px] text-center text-sm text-white/50 transition-colors hover:text-white/80"
          aria-label="Reset zoom"
        >
          {zoom}%
        </button>
        <GlassButton variant="ghost" size="sm" onClick={onZoomIn} aria-label="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </GlassButton>
        <GlassButton variant="ghost" size="sm" onClick={onZoomReset} aria-label="Reset view">
          <RotateCcw className="h-3.5 w-3.5" />
        </GlassButton>

        <div className="h-6 w-px bg-white/10" />

        {/* Canvas view settings */}
        <div className="relative" ref={popoverRef}>
          <GlassButton
            variant={showViewSettings ? "primary" : "ghost"}
            size="sm"
            onClick={() => setShowViewSettings((s) => !s)}
            aria-label="Canvas view settings"
            aria-expanded={showViewSettings}
          >
            <Settings2 className="h-4 w-4" />
          </GlassButton>
          <AnimatePresence>
            {showViewSettings && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-strong absolute left-0 top-11 z-50 w-56 rounded-2xl p-3"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Canvas Guides
                </p>
                {(
                  [
                    { key: "showGrid", label: "Show grid" },
                    { key: "snapToGrid", label: "Snap to grid" },
                    { key: "showSafeArea", label: "Safe area" },
                    { key: "showBleed", label: "Print bleed" },
                  ] as { key: keyof ViewSettings; label: string }[]
                ).map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5"
                  >
                    <span className="text-sm text-white/70">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={viewSettings[item.key]}
                      onChange={(e) => onViewSettingChange(item.key, e.target.checked)}
                      className="h-4 w-4 accent-primary-500"
                    />
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-sm"
        >
          {saveStatus === "saving" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-white/40"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </motion.span>
          )}
          {saveStatus === "saved" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-green-400"
            >
              <Check className="h-3 w-3" />
              Saved
            </motion.span>
          )}
          {saveStatus === "unsaved" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Unsaved
            </motion.span>
          )}
        </motion.div>

        <div className="h-6 w-px bg-white/10" />

        <GlassButton variant="ghost" size="sm" onClick={onQuickFill} aria-label="Quick Fill menu">
          <Wand2 className="h-4 w-4" />
          <span className="hidden md:inline">Quick Fill</span>
        </GlassButton>
        {onSaveAsTemplate && (
          <GlassButton variant="ghost" size="sm" onClick={onSaveAsTemplate} aria-label="Save as template">
            <LayoutTemplate className="h-4 w-4" />
            <span className="hidden lg:inline">Save Template</span>
          </GlassButton>
        )}
        {onVersionHistory && (
          <GlassButton variant="ghost" size="sm" onClick={onVersionHistory} aria-label="Version history">
            <History className="h-4 w-4" />
            <span className="hidden lg:inline">History</span>
          </GlassButton>
        )}
        <GlassButton variant="ghost" size="sm" onClick={onPreview} aria-label="Preview menu">
          <Eye className="h-4 w-4" />
          <span className="hidden md:inline">Preview</span>
        </GlassButton>
        <GlassButton variant="ghost" size="sm" onClick={onPrint} aria-label="Print menu">
          <Printer className="h-4 w-4" />
          <span className="hidden md:inline">Print</span>
        </GlassButton>
        <GlassButton variant="ghost" size="sm" onClick={onSave} aria-label="Save project">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </GlassButton>
        <GlassButton variant="primary" size="sm" onClick={onExport} aria-label="Export menu">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </GlassButton>
      </div>
    </div>
  );
}
