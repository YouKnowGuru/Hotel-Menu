"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, RotateCw } from "lucide-react";
import { GRADIENT_PRESETS } from "@/constants";
import { cn } from "@/lib/utils";

interface GradientBuilderProps {
  initialColors?: string[];
  initialAngle?: number;
  onChange: (colors: string[], angle: number) => void;
  compact?: boolean;
}

const DEFAULT_INITIAL_COLORS = ["#ff9a9e", "#fecfef"];

export function GradientBuilder({
  initialColors = DEFAULT_INITIAL_COLORS,
  initialAngle = 135,
  onChange,
  compact = false,
}: GradientBuilderProps) {
  const [colors, setColors] = useState<string[]>(
    initialColors && initialColors.length >= 2 ? initialColors : DEFAULT_INITIAL_COLORS
  );
  const [angle, setAngle] = useState<number>(initialAngle);
  const lastEmittedRef = useRef<string>(colors.join(",") + "_" + angle);

  // Sync if initial props change from outside (deep comparison)
  const initialColorsKey = (initialColors && initialColors.length >= 2 ? initialColors : DEFAULT_INITIAL_COLORS).join(",");
  useEffect(() => {
    if (initialColors && initialColors.length >= 2) {
      const currentKey = colors.join(",");
      if (initialColorsKey !== currentKey && initialColorsKey !== lastEmittedRef.current.split("_")[0]) {
        setColors(initialColors);
      }
    }
  }, [initialColorsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const notifyChange = useCallback(
    (newColors: string[], newAngle: number) => {
      const key = newColors.join(",") + "_" + newAngle;
      if (lastEmittedRef.current === key) return;
      lastEmittedRef.current = key;
      onChange(newColors, newAngle);
    },
    [onChange]
  );

  const isValidColor = (c: string) =>
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c.trim()) ||
    /^(rgb|rgba|hsl|hsla)\(/.test(c.trim());

  const sanitizeColor = (c: string) => {
    const trimmed = c.trim();
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
    }
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
      return trimmed;
    }
    return "#667eea";
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...colors];
    updated[index] = newColor;
    setColors(updated);
    if (updated.every(isValidColor)) {
      notifyChange(updated, angle);
    }
  };

  const handleAddColor = () => {
    if (colors.length >= 8) return; // reasonable max
    // Pick a default new color based on the last color or a nice complementary accent
    const defaultNewColors = ["#f9d423", "#00dfd8", "#7928ca", "#ff007f", "#38ef7d", "#ff4e50"];
    const nextColor = defaultNewColors[(colors.length - 2) % defaultNewColors.length] || "#f9d423";
    const updated = [...colors, nextColor];
    setColors(updated);
    notifyChange(updated, angle);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 2) return; // Keep at least 2 stops
    const updated = colors.filter((_, i) => i !== index);
    setColors(updated);
    notifyChange(updated, angle);
  };

  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    notifyChange(colors, newAngle);
  };

  const handleSelectPreset = (presetColors: string[]) => {
    setColors(presetColors);
    notifyChange(presetColors, angle);
  };

  const gradientCss = `linear-gradient(${angle}deg, ${colors.join(", ")})`;

  return (
    <div className="space-y-3.5">
      {/* Live Preview Bar */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 p-0.5 shadow-inner">
        <div
          className="h-10 w-full rounded-lg transition-all duration-300"
          style={{ background: gradientCss }}
        />
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-white/50">
          <span>{colors.length} Color Stops</span>
          <span>{angle}° Angle</span>
        </div>
      </div>

      {/* Color Stops List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/70">Color Stops</label>
          <button
            type="button"
            onClick={handleAddColor}
            disabled={colors.length >= 8}
            className="flex items-center gap-1 rounded-md bg-primary-500/20 px-2 py-1 text-[11px] font-medium text-primary-300 transition-colors hover:bg-primary-500/30 disabled:opacity-40"
            aria-label="Add gradient color stop"
          >
            <Plus className="h-3 w-3" />
            Add Color
          </button>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {colors.map((color, index) => {
            const percentage = Math.round((index / (colors.length - 1)) * 100);
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 p-1.5"
              >
                {/* Color swatch picker */}
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-white/10 shadow-sm">
                  <input
                    type="color"
                    value={color.startsWith("#") && color.length === 7 ? color : "#000000"}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={`Color stop ${index + 1}`}
                  />
                  <div className="h-full w-full" style={{ backgroundColor: color }} />
                </div>

                {/* Stop info & hex input */}
                <div className="flex flex-1 items-center justify-between gap-1.5">
                  <span className="text-[11px] font-medium text-white/60">
                    Stop {index + 1} ({percentage}%)
                  </span>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v) || v === "") {
                        handleColorChange(index, v);
                      }
                    }}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      const sanitized = sanitizeColor(v);
                      const updated = [...colors];
                      updated[index] = sanitized;
                      setColors(updated);
                      notifyChange(updated, angle);
                    }}
                    className="glass-input w-20 px-1.5 py-0.5 text-center text-xs"
                    aria-label={`Hex value for stop ${index + 1}`}
                  />
                </div>

                {/* Delete button (minimum 2 stops) */}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  disabled={colors.length <= 2}
                  className="rounded p-1 text-white/40 transition-colors hover:text-red-400 disabled:opacity-20"
                  aria-label={`Remove color stop ${index + 1}`}
                  title="Remove color stop"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Angle Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60 flex items-center gap-1">
            <RotateCw className="h-3 w-3 text-primary-400" />
            Direction Angle
          </span>
          <span className="text-white/40">{angle}°</span>
        </div>

        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={angle}
          onChange={(e) => handleAngleChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary-500"
          aria-label="Gradient angle slider"
        />

        {/* Quick Angle Buttons */}
        <div className="flex gap-1 pt-1">
          {[0, 45, 90, 135, 180, 270].map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => handleAngleChange(deg)}
              className={cn(
                "flex-1 rounded px-1 py-0.5 text-[10px] font-medium transition-colors",
                angle === deg
                  ? "bg-primary-500/30 text-primary-300 border border-primary-500/30"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
              )}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      {!compact && (
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Presets</label>
          <div className="grid grid-cols-5 gap-1.5">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset.colors)}
                title={`${preset.name} (${preset.colors.length} colors)`}
                aria-label={`Select ${preset.name} preset`}
                className="h-6 rounded-md border border-white/10 transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors.join(", ")})`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
