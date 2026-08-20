"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { toast } from "@/components/ui/toaster";
import { useUIStore } from "@/stores/ui-store";
import { CURRENCIES } from "@/constants";

interface UserSettings {
  defaultPaperSize: string;
  defaultOrientation: string;
  defaultCurrency: string;
  autoSave: boolean;
  autoSaveInterval: number;
  theme: "light" | "dark";
  snapToGrid: boolean;
  showGrid: boolean;
  showSafeArea: boolean;
}

const defaults: UserSettings = {
  defaultPaperSize: "A4",
  defaultOrientation: "portrait",
  defaultCurrency: "USD",
  autoSave: true,
  autoSaveInterval: 30,
  theme: "dark",
  snapToGrid: true,
  showGrid: false,
  showSafeArea: true,
};

const PAPER_OPTIONS = ["A5", "A4", "A3", "letter", "legal", "tabloid"];
const AUTOSAVE_OPTIONS = [10, 30, 60, 120, 300];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setSettings({
            defaultPaperSize: d.data.defaultPaperSize || defaults.defaultPaperSize,
            defaultOrientation: d.data.defaultOrientation || defaults.defaultOrientation,
            defaultCurrency: d.data.defaultCurrency || defaults.defaultCurrency,
            autoSave: d.data.autoSave ?? defaults.autoSave,
            autoSaveInterval:
              typeof d.data.autoSaveInterval === "number" && d.data.autoSaveInterval >= 1000
                ? Math.round(d.data.autoSaveInterval / 1000)
                : d.data.autoSaveInterval ?? defaults.autoSaveInterval,
            theme: d.data.theme === "light" ? "light" : "dark",
            snapToGrid: d.data.snapToGrid ?? defaults.snapToGrid,
            showGrid: d.data.showGrid ?? defaults.showGrid,
            showSafeArea: d.data.showSafeArea ?? defaults.showSafeArea,
          });
        }
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "theme") {
      // Apply the theme immediately (also persists via the UI store)
      setTheme(value as "light" | "dark");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Settings saved");
      } else {
        toast.error(d.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-white/50">Configure your editor preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <GlassCard level={2} className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Default Canvas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="setting-paper" className="text-sm text-white/60">Paper Size</label>
                <select
                  id="setting-paper"
                  value={settings.defaultPaperSize}
                  onChange={(e) => update("defaultPaperSize", e.target.value)}
                  className="glass-input w-full"
                >
                  {PAPER_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-surface-900">
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="setting-orientation" className="text-sm text-white/60">Orientation</label>
                <select
                  id="setting-orientation"
                  value={settings.defaultOrientation}
                  onChange={(e) => update("defaultOrientation", e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="portrait" className="bg-surface-900">Portrait</option>
                  <option value="landscape" className="bg-surface-900">Landscape</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="setting-currency" className="text-sm text-white/60">Currency</label>
                <select
                  id="setting-currency"
                  value={settings.defaultCurrency}
                  onChange={(e) => update("defaultCurrency", e.target.value)}
                  className="glass-input w-full"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-surface-900">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="setting-theme" className="text-sm text-white/60">Theme</label>
                <select
                  id="setting-theme"
                  value={settings.theme}
                  onChange={(e) => update("theme", e.target.value as "light" | "dark")}
                  className="glass-input w-full"
                >
                  <option value="dark" className="bg-surface-900">Dark</option>
                  <option value="light" className="bg-surface-900">Light</option>
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard level={2} className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Editor</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Auto-save interval</p>
                  <p className="text-xs text-white/40">How often the editor saves your work</p>
                </div>
                <select
                  aria-label="Auto-save interval in seconds"
                  value={settings.autoSaveInterval}
                  onChange={(e) => update("autoSaveInterval", Number(e.target.value))}
                  className="glass-input w-28"
                >
                  {AUTOSAVE_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-surface-900">
                      {s >= 60 ? `${s / 60} min` : `${s} sec`}
                    </option>
                  ))}
                </select>
              </div>

              {[
                {
                  label: "Auto-save",
                  description: "Automatically save changes while you edit",
                  key: "autoSave" as const,
                },
                {
                  label: "Snap to Grid",
                  description: "Align objects to the grid when moving",
                  key: "snapToGrid" as const,
                },
                {
                  label: "Show Grid",
                  description: "Display the grid overlay on the canvas",
                  key: "showGrid" as const,
                },
                {
                  label: "Show Safe Area",
                  description: "Display the safe area margins for print",
                  key: "showSafeArea" as const,
                },
              ].map((toggle) => (
                <div
                  key={toggle.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{toggle.label}</p>
                    <p className="text-xs text-white/40">{toggle.description}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={settings[toggle.key]}
                    aria-label={toggle.label}
                    onClick={() => update(toggle.key, !settings[toggle.key])}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      settings[toggle.key] ? "bg-primary-500" : "bg-white/20"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        settings[toggle.key] ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </GlassButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
