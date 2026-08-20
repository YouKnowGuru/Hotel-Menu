"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gradient, Shadow, type FabricObject, type FabricImage } from "fabric";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Move,
  Maximize2,
  CornerDownRight,
  Layers,
  Copy,
  ClipboardPaste,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Group,
  Ungroup,
  FlipHorizontal,
  FlipVertical,
  CircleDot,
  CaseSensitive,
  ImageIcon,
  Square,
  Minus,
  Star,
  Sparkles,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  Space,
  QrCode,
  GripVertical,
  Frame,
} from "lucide-react";
import { FONT_OPTIONS, GRADIENT_PRESETS } from "@/constants";
import { GradientBuilder } from "./gradient-builder";
import type { FabricCanvasRef } from "@/components/canvas/fabric-canvas";
import { GlassButton } from "@/components/glass/glass-button";
import { cn } from "@/lib/utils";

interface EditorPropertiesPanelProps {
  selectedObject: FabricObject | null;
  onUpdate: (props: Record<string, unknown>) => void;
  fabricRef: React.RefObject<FabricCanvasRef | null>;
  layersVersion: number;
}

function getObjectType(obj: FabricObject | null): string | null {
  if (!obj) return null;
  const type = obj.type;
  if (type === "i-text" || type === "text" || type === "textbox") return "text";
  if (type === "rect") return "rect";
  if (type === "circle") return "circle";
  if (type === "line") return "line";
  if (type === "group") return "group";
  if (type === "image") return "image";
  if (type === "polygon") return "polygon";
  if (type === "path") return "path";
  return "other";
}

function objectLabel(obj: FabricObject): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyObj = obj as any;
  if (typeof anyObj.text === "string" && anyObj.text.trim()) {
    return anyObj.text.slice(0, 24);
  }
  const type = obj.type ?? "object";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="min-w-[70px] text-xs text-white/50">{label}</label>
      <div className="relative flex-1">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full cursor-pointer rounded-lg border-0 bg-transparent"
          aria-label={`${label} color`}
        />
      </div>
      <input
        type="text"
        value={value || "#000000"}
        onChange={(e) => {
          const v = e.target.value.trim();
          // Accept only valid 3-or-6-digit hex values to avoid corrupting Fabric objects.
          if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v) || v === "" || v.startsWith("#")) {
            onChange(v);
          }
        }}
        onBlur={(e) => {
          // On blur, sanitize to a valid hex or fall back to black.
          const v = e.target.value.trim();
          if (!/^#[0-9a-fA-F]{6}$/.test(v)) {
            const expanded = v.replace(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/, "#$1$1$2$2$3$3");
            onChange(/^#[0-9a-fA-F]{6}$/.test(expanded) ? expanded : "#000000");
          }
        }}
        className="glass-input w-20 px-2 py-1 text-xs"
        aria-label={`${label} hex value`}
      />
    </div>
  );
}

function FillModeControl({
  fillValue,
  onSolidChange,
  onGradientChange,
}: {
  fillValue: string;
  onSolidChange: (color: string) => void;
  onGradientChange: (colors: string[], angle: number) => void;
}) {
  const [mode, setMode] = useState<"solid" | "gradient">("solid");

  return (
    <div className="space-y-3">
      <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5 p-0.5">
        <button
          type="button"
          onClick={() => setMode("solid")}
          className={cn(
            "flex-1 rounded-md py-1 text-xs font-medium transition-colors",
            mode === "solid"
              ? "bg-primary-500/30 text-primary-300 shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          Solid Color
        </button>
        <button
          type="button"
          onClick={() => setMode("gradient")}
          className={cn(
            "flex-1 rounded-md py-1 text-xs font-medium transition-colors",
            mode === "gradient"
              ? "bg-primary-500/30 text-primary-300 shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          Multi-Color Gradient
        </button>
      </div>

      {mode === "solid" ? (
        <ColorInput
          label="Fill"
          value={fillValue || "#000000"}
          onChange={onSolidChange}
        />
      ) : (
        <GradientBuilder onChange={onGradientChange} />
      )}
    </div>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/50">{label}</label>
        <span className="text-xs text-white/40">
          {step < 1 ? value.toFixed(2) : Math.round(value)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary-500 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.5)]"
      />
    </div>
  );
}

function SectionHeader({ icon: Icon, label }: { icon: typeof Type; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-primary-400" />
      <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{label}</span>
    </div>
  );
}

/* ---------------- Layers panel ---------------- */

function LayerTypeIcon({ type }: { type: string | undefined }) {
  switch (type) {
    case "i-text":
    case "text":
    case "textbox":
      return <Type className="h-3.5 w-3.5" />;
    case "image":
      return <ImageIcon className="h-3.5 w-3.5" />;
    case "circle":
      return <CircleDot className="h-3.5 w-3.5" />;
    case "line":
      return <Minus className="h-3.5 w-3.5" />;
    case "polygon":
      return <Star className="h-3.5 w-3.5" />;
    case "path":
      return <Sparkles className="h-3.5 w-3.5" />;
    case "group":
      return <Group className="h-3.5 w-3.5" />;
    default:
      return <Square className="h-3.5 w-3.5" />;
  }
}

function LayersList({
  fabricRef,
  layersVersion,
  selectedObject,
}: {
  fabricRef: React.RefObject<FabricCanvasRef | null>;
  layersVersion: number;
  selectedObject: FabricObject | null;
}) {
  // layersVersion triggers re-render when canvas changes
  void layersVersion;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const canvas = fabricRef.current?.getCanvas();
  const objects = canvas
    ? canvas
      .getObjects()
      .filter((o) => !o.excludeFromExport && o.visible !== undefined)
      .slice()
      .reverse()
    : [];

  // Drag-and-drop reorder handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index || !canvas) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Objects are displayed reversed, so we need to calculate actual indices
    const allObjects = canvas.getObjects().filter((o) => !o.excludeFromExport && o.visible !== undefined);
    const actualFromIndex = allObjects.length - 1 - dragIndex;
    const actualToIndex = allObjects.length - 1 - index;

    const obj = allObjects[actualFromIndex];
    if (!obj) return;

    // Move object to new position
    canvas.remove(obj);
    const insertAt = actualToIndex > actualFromIndex ? actualToIndex : actualToIndex;
    const currentObjects = canvas.getObjects();
    if (insertAt >= currentObjects.length) {
      canvas.add(obj);
    } else {
      // Insert at specific position by reordering
      canvas.add(obj);
      // Move to correct position
      const diff = actualToIndex - actualFromIndex;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) canvas.bringObjectForward(obj);
      } else {
        for (let i = 0; i < -diff; i++) canvas.sendObjectBackwards(obj);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: obj } as any);
    canvas.requestRenderAll();
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const select = (obj: FabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("selection:created" as any, { selected: [obj] } as any);
  };

  const move = (obj: FabricObject, dir: "up" | "down" | "front" | "back") => {
    if (!canvas) return;
    if (dir === "up") canvas.bringObjectForward(obj);
    if (dir === "down") canvas.sendObjectBackwards(obj);
    if (dir === "front") canvas.bringObjectToFront(obj);
    if (dir === "back") canvas.sendObjectToBack(obj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: obj } as any);
    canvas.requestRenderAll();
  };

  const toggleVisibility = (obj: FabricObject) => {
    if (!canvas) return;
    obj.set({ visible: !obj.visible });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: obj } as any);
    canvas.requestRenderAll();
  };

  const toggleLock = (obj: FabricObject) => {
    if (!canvas) return;
    const locked = obj.lockMovementX;
    obj.set({
      lockMovementX: !locked,
      lockMovementY: !locked,
      lockScalingX: !locked,
      lockScalingY: !locked,
      lockRotation: !locked,
      hasControls: locked,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: obj } as any);
    canvas.requestRenderAll();
  };

  if (!objects.length) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Layers className="mx-auto mb-2 h-8 w-8 text-white/20" />
        <p className="text-xs text-white/40">No objects yet. Add text, shapes or images.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" role="list" aria-label="Canvas layers">
      {objects.map((obj, index) => {
        const isSelected = selectedObject === obj;
        const locked = obj.lockMovementX;
        const hidden = obj.visible === false;
        const isDragging = dragIndex === index;
        const isDragOver = dragOverIndex === index && dragIndex !== index;
        return (
          <div
            key={index}
            role="listitem"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all",
              isSelected ? "bg-primary-500/20" : "hover:bg-white/5",
              isDragging && "opacity-50 scale-95",
              isDragOver && "border-t-2 border-primary-400"
            )}
          >
            <span className="cursor-grab text-white/30 hover:text-white/60" title="Drag to reorder">
              <GripVertical className="h-3.5 w-3.5" />
            </span>
            <button
              onClick={() => select(obj)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
              aria-label={`Select ${objectLabel(obj)}`}
            >
              <span className="text-white/40">
                <LayerTypeIcon type={obj.type} />
              </span>
              <span
                className={cn(
                  "truncate text-xs",
                  hidden ? "text-white/25 line-through" : "text-white/70"
                )}
              >
                {objectLabel(obj)}
              </span>
            </button>
            <button
              onClick={() => toggleVisibility(obj)}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
              aria-label={hidden ? "Show layer" : "Hide layer"}
              title={hidden ? "Show" : "Hide"}
            >
              {hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            <button
              onClick={() => toggleLock(obj)}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
              aria-label={locked ? "Unlock layer" : "Lock layer"}
              title={locked ? "Unlock" : "Lock"}
            >
              {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </button>
            <button
              onClick={() => move(obj, "up")}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
              aria-label="Move layer up"
              title="Bring forward"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              onClick={() => move(obj, "down")}
              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
              aria-label="Move layer down"
              title="Send backwards"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Main panel ---------------- */

export function EditorPropertiesPanel({
  selectedObject,
  onUpdate,
  fabricRef,
  layersVersion,
}: EditorPropertiesPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, unknown>>({});
  const [tab, setTab] = useState<"properties" | "layers">("properties");

  const objectType = getObjectType(selectedObject);

  useEffect(() => {
    if (!selectedObject) {
      setLocalProps({});
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyObj = selectedObject as any;
    const props: Record<string, unknown> = {
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0),
      width: Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1)),
      height: Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1)),
      opacity: selectedObject.opacity ?? 1,
      angle: Math.round(selectedObject.angle || 0),
    };

    if (objectType === "text") {
      props.fontFamily = (anyObj.fontFamily || "Inter").split(",")[0].replace(/'/g, "");
      props.fontSize = anyObj.fontSize || 24;
      props.fontWeight = anyObj.fontWeight || "normal";
      props.fontStyle = anyObj.fontStyle || "normal";
      props.underline = anyObj.underline || false;
      props.textAlign = anyObj.textAlign || "left";
      props.fill = typeof anyObj.fill === "string" ? anyObj.fill : "#000000";
      props.charSpacing = anyObj.charSpacing || 0;
      props.lineHeight = anyObj.lineHeight || 1.16;
      props.stroke = typeof anyObj.stroke === "string" ? anyObj.stroke : "";
      props.strokeWidth = anyObj.strokeWidth || 0;
      props.isUppercase =
        typeof anyObj.text === "string" &&
        anyObj.text.length > 0 &&
        anyObj.text === anyObj.text.toUpperCase();
    }

    if (objectType === "rect" || objectType === "circle" || objectType === "polygon" || objectType === "path") {
      props.fill = typeof selectedObject.fill === "string" ? selectedObject.fill : "#00000000";
      props.stroke = typeof selectedObject.stroke === "string" ? selectedObject.stroke : "#000000";
      props.strokeWidth = selectedObject.strokeWidth || 0;
    }

    if (objectType === "group") {
      props.isMenuFrame = !!(anyObj.isMenuFrame || anyObj.name === "menuBorder");
      if (props.isMenuFrame && anyObj._objects?.[0]) {
        props.stroke = typeof anyObj._objects[0].stroke === "string" ? anyObj._objects[0].stroke : "#c9a96e";
        props.strokeWidth = anyObj._objects[0].strokeWidth || 2;
      }
    }

    if (objectType === "rect") {
      props.isMenuFrame = !!(anyObj.isMenuFrame || anyObj.name === "menuBorder");
    }

    if (objectType === "rect" || objectType === "image") {
      props.rx = anyObj.rx || 0;
    }

    if (objectType === "line") {
      props.stroke = typeof selectedObject.stroke === "string" ? selectedObject.stroke : "#000000";
      props.strokeWidth = selectedObject.strokeWidth || 1;
    }

    if (objectType === "image") {
      const img = selectedObject as FabricImage;
      props.flipX = img.flipX || false;
      props.flipY = img.flipY || false;
      props.stroke = typeof img.stroke === "string" ? img.stroke : "";
      props.strokeWidth = img.strokeWidth || 0;
    }

    // Initialize shadow state from the object so the button reflects reality.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.hasShadow = !!(selectedObject as any).shadow;

    setLocalProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject, objectType, layersVersion]);

  const handleChange = useCallback(
    (key: string, value: unknown) => {
      setLocalProps((prev) => ({ ...prev, [key]: value }));
      onUpdate({ [key]: value });
    },
    [onUpdate]
  );

  const handleNumericChange = useCallback(
    (key: string, value: string) => {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        handleChange(key, num);
      }
    },
    [handleChange]
  );

  const toggleUppercase = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyObj = selectedObject as any;
    if (typeof anyObj.text !== "string") return;
    const isUpper = anyObj.text === anyObj.text.toUpperCase();
    handleChange("text", isUpper ? anyObj.text.toLowerCase() : anyObj.text.toUpperCase());
    setLocalProps((prev) => ({ ...prev, isUppercase: !isUpper }));
  };

  const applyGradientFill = (colors: string[], angle = 135) => {
    if (!selectedObject || !colors || colors.length === 0) return;
    const w = selectedObject.getScaledWidth() || 200;
    const h = selectedObject.getScaledHeight() || 60;
    const angleRad = (angle * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const cx = w / 2;
    const cy = h / 2;
    const length = Math.max(w, h);

    const sanitizeHex = (col: string) => {
      if (!col || typeof col !== "string") return "#000000";
      const c = col.trim();
      if (/^#[0-9a-fA-F]{3}$/.test(c)) {
        return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
      }
      if (/^#[0-9a-fA-F]{6}$/.test(c) || /^#[0-9a-fA-F]{8}$/.test(c)) {
        return c;
      }
      if (/^(rgb|rgba|hsl|hsla)\(/.test(c)) {
        return c;
      }
      return "#000000";
    };

    const colorStops = colors.map((color, index) => ({
      offset: colors.length === 1 ? 0 : index / (colors.length - 1),
      color: sanitizeHex(color),
    }));

    const gradient = new Gradient({
      type: "linear",
      coords: {
        x1: cx - (cos * length) / 2,
        y1: cy - (sin * length) / 2,
        x2: cx + (cos * length) / 2,
        y2: cy + (sin * length) / 2,
      },
      colorStops,
    });
    handleChange("fill", gradient);
  };

  const applyShadow = (on: boolean) => {
    if (on) {
      handleChange(
        "shadow",
        new Shadow({ color: "rgba(0,0,0,0.35)", blur: 12, offsetX: 4, offsetY: 4 })
      );
    } else {
      handleChange("shadow", null);
    }
    setLocalProps((prev) => ({ ...prev, hasShadow: on }));
  };

  const toggleFlip = (axis: "flipX" | "flipY") => {
    const current = !!localProps[axis];
    handleChange(axis, !current);
  };

  return (
    <div className="glass flex h-full w-[280px] flex-col border-l border-white/5">
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setTab("properties")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-semibold transition-colors",
            tab === "properties" ? "text-white/80" : "text-white/40 hover:text-white/60"
          )}
          aria-pressed={tab === "properties"}
        >
          Properties
        </button>
        <button
          onClick={() => setTab("layers")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors",
            tab === "layers" ? "text-white/80" : "text-white/40 hover:text-white/60"
          )}
          aria-pressed={tab === "layers"}
        >
          <Layers className="h-3.5 w-3.5" />
          Layers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "layers" && (
          <LayersList
            fabricRef={fabricRef}
            layersVersion={layersVersion}
            selectedObject={selectedObject}
          />
        )}

        {tab === "properties" && !selectedObject && (
          <div className="glass mt-4 rounded-xl p-6 text-center">
            <Sparkles className="mx-auto mb-2 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">
              Select an object on the canvas to edit its properties, or open the Layers tab.
            </p>
          </div>
        )}

        {tab === "properties" && selectedObject && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80">
                {objectType === "text" && "Text Properties"}
                {objectType === "rect" && "Rectangle Properties"}
                {objectType === "circle" && "Circle Properties"}
                {objectType === "line" && "Line Properties"}
                {objectType === "group" && "Group Properties"}
                {objectType === "image" && "Image Properties"}
                {objectType === "polygon" && "Shape Properties"}
                {objectType === "path" && "Icon Properties"}
                {objectType === "other" && "Object Properties"}
              </h3>
            </div>

            {/* Object actions */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => fabricRef.current?.copySelected()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Copy"
                title="Copy (Ctrl+C)"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.pasteCopied()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Paste"
                title="Paste (Ctrl+V)"
              >
                <ClipboardPaste className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.duplicateSelected()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Duplicate"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.deleteSelected()}
                className="glass flex items-center justify-center rounded-lg p-2 text-red-400/70 hover:text-red-400"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.toggleLockSelected()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label={selectedObject.lockMovementX ? "Unlock" : "Lock"}
                title={selectedObject.lockMovementX ? "Unlock" : "Lock"}
              >
                {selectedObject.lockMovementX ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => fabricRef.current?.toggleVisibilitySelected()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label={selectedObject.visible === false ? "Show" : "Hide"}
                title={selectedObject.visible === false ? "Show" : "Hide"}
              >
                {selectedObject.visible === false ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => fabricRef.current?.bringToFront()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Bring to front"
                title="Bring to front"
              >
                <ChevronsUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.sendToBack()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Send to back"
                title="Send to back"
              >
                <ChevronsDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.bringForward()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Bring forward"
                title="Bring forward"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => fabricRef.current?.sendBackwards()}
                className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                aria-label="Send backwards"
                title="Send backwards"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              {objectType === "group" ? (
                <button
                  onClick={() => fabricRef.current?.ungroupSelected()}
                  className="glass col-span-2 flex items-center justify-center gap-1.5 rounded-lg p-2 text-xs text-white/60 hover:text-white/90"
                  aria-label="Ungroup"
                  title="Ungroup"
                >
                  <Ungroup className="h-4 w-4" />
                  Ungroup
                </button>
              ) : (
                <button
                  onClick={() => fabricRef.current?.groupSelected()}
                  className="glass col-span-2 flex items-center justify-center gap-1.5 rounded-lg p-2 text-xs text-white/60 hover:text-white/90"
                  aria-label=" Group selected objects"
                  title="Group selected (needs 2+ objects)"
                >
                  <Group className="h-4 w-4" />
                  Group
                </button>
              )}
            </div>

            {objectType === "group" && (
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xs text-white/40">
                  Objects grouped. Use Ungroup to edit individual elements.
                </p>
              </div>
            )}

            {/* Alignment tools - shown when multiple objects selected */}
            <div>
              <SectionHeader icon={AlignStartVertical} label="Align Objects (multi-select)" />
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => fabricRef.current?.alignLeft()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align left"
                  title="Align Left"
                >
                  <AlignStartVertical className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.alignCenterH()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align center horizontal"
                  title="Align Center (Horizontal)"
                >
                  <AlignCenterHorizontal className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.alignRight()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align right"
                  title="Align Right"
                >
                  <AlignEndVertical className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.distributeHorizontal()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Distribute horizontal"
                  title="Distribute Horizontally (3+ objects)"
                >
                  <Space className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.alignTop()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align top"
                  title="Align Top"
                >
                  <AlignStartHorizontal className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.alignCenterV()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align center vertical"
                  title="Align Center (Vertical)"
                >
                  <AlignCenterVertical className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.alignBottom()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Align bottom"
                  title="Align Bottom"
                >
                  <AlignEndHorizontal className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fabricRef.current?.distributeVertical()}
                  className="glass flex items-center justify-center rounded-lg p-2 text-white/50 hover:text-white/90"
                  aria-label="Distribute vertical"
                  title="Distribute Vertically (3+ objects)"
                >
                  <Space className="h-4 w-4 rotate-90" />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-white/30">
                Select 2+ objects (Shift+Click) to align, 3+ to distribute
              </p>
            </div>

            {objectType === "text" && (
              <>
                <div>
                  <SectionHeader icon={Type} label="Font" />
                  <select
                    value={(localProps.fontFamily as string) || "Inter"}
                    onChange={(e) => handleChange("fontFamily", e.target.value)}
                    className="glass-input w-full px-3 py-2 text-sm"
                    aria-label="Font family"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.name} value={font.name} className="bg-surface-900">
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <SectionHeader icon={Type} label="Size & Style" />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={String(localProps.fontSize || 24)}
                        onChange={(e) => handleNumericChange("fontSize", e.target.value)}
                        className="glass-input w-full px-3 py-2 text-sm"
                        aria-label="Font size"
                      />
                    </div>
                    <GlassButton
                      variant={localProps.fontWeight === "bold" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() =>
                        handleChange(
                          "fontWeight",
                          localProps.fontWeight === "bold" ? "normal" : "bold"
                        )
                      }
                      aria-label="Toggle bold"
                    >
                      <Bold className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton
                      variant={localProps.fontStyle === "italic" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() =>
                        handleChange(
                          "fontStyle",
                          localProps.fontStyle === "italic" ? "normal" : "italic"
                        )
                      }
                      aria-label="Toggle italic"
                    >
                      <Italic className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton
                      variant={localProps.underline ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handleChange("underline", !localProps.underline)}
                      aria-label="Toggle underline"
                    >
                      <Underline className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton
                      variant={localProps.isUppercase ? "primary" : "ghost"}
                      size="sm"
                      onClick={toggleUppercase}
                      aria-label="Toggle uppercase"
                    >
                      <CaseSensitive className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>

                <div>
                  <SectionHeader icon={AlignLeft} label="Alignment" />
                  <div className="flex gap-1">
                    {[
                      { value: "left", icon: AlignLeft },
                      { value: "center", icon: AlignCenter },
                      { value: "right", icon: AlignRight },
                    ].map((align) => (
                      <GlassButton
                        key={align.value}
                        variant={localProps.textAlign === align.value ? "primary" : "ghost"}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleChange("textAlign", align.value)}
                        aria-label={`Align ${align.value}`}
                      >
                        <align.icon className="h-4 w-4" />
                      </GlassButton>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Palette} label="Color & Fill" />
                  <FillModeControl
                    fillValue={(localProps.fill as string) || "#000000"}
                    onSolidChange={(v) => handleChange("fill", v)}
                    onGradientChange={(colors, angle) => applyGradientFill(colors, angle)}
                  />
                </div>

                <div>
                  <SectionHeader icon={Type} label="Spacing & Lines" />
                  <div className="space-y-3">
                    <SliderInput
                      label="Letter Spacing"
                      value={(localProps.charSpacing as number) || 0}
                      onChange={(v) => handleChange("charSpacing", v)}
                      min={-100}
                      max={800}
                      suffix="px"
                    />
                    <SliderInput
                      label="Line Height"
                      value={(localProps.lineHeight as number) || 1.16}
                      onChange={(v) => handleChange("lineHeight", v)}
                      min={0.5}
                      max={3}
                      step={0.05}
                    />
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Palette} label="Text Stroke" />
                  <div className="space-y-3">
                    <ColorInput
                      label="Color"
                      value={(localProps.stroke as string) || "#000000"}
                      onChange={(v) => handleChange("stroke", v)}
                    />
                    <SliderInput
                      label="Width"
                      value={(localProps.strokeWidth as number) || 0}
                      onChange={(v) => handleChange("strokeWidth", v)}
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Sparkles} label="Shadow" />
                  <div className="flex gap-2">
                    <GlassButton
                      variant={localProps.hasShadow ? "primary" : "ghost"}
                      size="sm"
                      className="flex-1"
                      onClick={() => applyShadow(!localProps.hasShadow)}
                    >
                      {localProps.hasShadow ? "Shadow On" : "Add Shadow"}
                    </GlassButton>
                  </div>
                </div>
              </>
            )}

            {/* Dedicated Border Frame Controls if object is a menu border */}
            {(localProps.isMenuFrame || (selectedObject as any)?.isMenuFrame || (selectedObject as any)?.name === "menuBorder") && (
              <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
                    <Frame className="h-3.5 w-3.5" /> Border Frame Active
                  </span>
                </div>
                <div className="space-y-2">
                  <ColorInput
                    label="Border Color"
                    value={(localProps.stroke as string) || "#c9a96e"}
                    onChange={(col) => {
                      handleChange("stroke", col);
                      fabricRef.current?.applyBorderDesign({ color: col });
                    }}
                  />
                  <SliderInput
                    label="Border Width"
                    value={(localProps.strokeWidth as number) || 2}
                    onChange={(w) => {
                      handleChange("strokeWidth", w);
                      fabricRef.current?.applyBorderDesign({ strokeWidth: w });
                    }}
                    min={1}
                    max={16}
                    step={0.5}
                  />
                </div>
              </div>
            )}

            {(objectType === "rect" || objectType === "circle" || objectType === "polygon" || objectType === "path") && (
              <>
                <div>
                  <SectionHeader icon={Palette} label="Fill" />
                  <FillModeControl
                    fillValue={(localProps.fill as string) || "#00000000"}
                    onSolidChange={(v) => handleChange("fill", v)}
                    onGradientChange={(colors, angle) => applyGradientFill(colors, angle)}
                  />
                </div>

                <div>
                  <SectionHeader icon={Palette} label="Stroke" />
                  <div className="space-y-3">
                    <ColorInput
                      label="Color"
                      value={(localProps.stroke as string) || "#000000"}
                      onChange={(v) => handleChange("stroke", v)}
                    />
                    <SliderInput
                      label="Width"
                      value={(localProps.strokeWidth as number) || 0}
                      onChange={(v) => handleChange("strokeWidth", v)}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>

                {objectType === "rect" && (
                  <div>
                    <SectionHeader icon={CornerDownRight} label="Corner Radius" />
                    <SliderInput
                      label="Radius"
                      value={(localProps.rx as number) || 0}
                      onChange={(v) => handleChange("rx", v)}
                      min={0}
                      max={100}
                    />
                  </div>
                )}
              </>
            )}

            {objectType === "line" && (
              <div>
                <SectionHeader icon={Palette} label="Stroke" />
                <div className="space-y-3">
                  <ColorInput
                    label="Color"
                    value={(localProps.stroke as string) || "#000000"}
                    onChange={(v) => handleChange("stroke", v)}
                  />
                  <SliderInput
                    label="Width"
                    value={(localProps.strokeWidth as number) || 1}
                    onChange={(v) => handleChange("strokeWidth", v)}
                    min={1}
                    max={20}
                  />
                </div>
              </div>
            )}

            {objectType === "image" && (
              <>
                <div>
                  <SectionHeader icon={FlipHorizontal} label="Transform" />
                  <div className="flex gap-2">
                    <GlassButton
                      variant={localProps.flipX ? "primary" : "ghost"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleFlip("flipX")}
                      aria-label="Flip horizontal"
                    >
                      <FlipHorizontal className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton
                      variant={localProps.flipY ? "primary" : "ghost"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleFlip("flipY")}
                      aria-label="Flip vertical"
                    >
                      <FlipVertical className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Maximize2} label="Rounded Corners" />
                  <SliderInput
                    label="Radius"
                    value={(localProps.rx as number) || 0}
                    onChange={(v) => handleChange("rx", v)}
                    min={0}
                    max={Math.round(((localProps.width as number) || 200) / 2)}
                  />
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      handleChange("rx", Math.round(((localProps.width as number) || 200) / 2))
                    }
                  >
                    <CircleDot className="h-4 w-4" />
                    Make Circular
                  </GlassButton>
                </div>

                <div>
                  <SectionHeader icon={Palette} label="Border" />
                  <div className="space-y-3">
                    <ColorInput
                      label="Color"
                      value={(localProps.stroke as string) || "#000000"}
                      onChange={(v) => handleChange("stroke", v)}
                    />
                    <SliderInput
                      label="Width"
                      value={(localProps.strokeWidth as number) || 0}
                      onChange={(v) => handleChange("strokeWidth", v)}
                      min={0}
                      max={30}
                    />
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Sparkles} label="Shadow" />
                  <GlassButton
                    variant={localProps.hasShadow ? "primary" : "ghost"}
                    size="sm"
                    className="w-full"
                    onClick={() => applyShadow(!localProps.hasShadow)}
                  >
                    {localProps.hasShadow ? "Shadow On" : "Add Shadow"}
                  </GlassButton>
                </div>
              </>
            )}

            {objectType !== "group" && objectType !== null && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div>
                    <SectionHeader icon={Move} label="Position" />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-[10px] text-white/40">X</label>
                        <input
                          type="number"
                          value={String(localProps.left || 0)}
                          onChange={(e) => handleNumericChange("left", e.target.value)}
                          className="glass-input w-full px-2 py-1.5 text-xs"
                          aria-label="X position"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-white/40">Y</label>
                        <input
                          type="number"
                          value={String(localProps.top || 0)}
                          onChange={(e) => handleNumericChange("top", e.target.value)}
                          className="glass-input w-full px-2 py-1.5 text-xs"
                          aria-label="Y position"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <SliderInput
                        label="Rotation"
                        value={(localProps.angle as number) || 0}
                        onChange={(v) => handleChange("angle", v)}
                        min={0}
                        max={359}
                        suffix="°"
                      />
                    </div>
                  </div>

                  <div>
                    <SectionHeader icon={Maximize2} label="Size" />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-[10px] text-white/40">W</label>
                        <input
                          type="number"
                          value={String(localProps.width || 0)}
                          onChange={(e) => handleNumericChange("width", e.target.value)}
                          className="glass-input w-full px-2 py-1.5 text-xs"
                          aria-label="Width"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-white/40">H</label>
                        <input
                          type="number"
                          value={String(localProps.height || 0)}
                          onChange={(e) => handleNumericChange("height", e.target.value)}
                          className="glass-input w-full px-2 py-1.5 text-xs"
                          aria-label="Height"
                        />
                      </div>
                    </div>
                  </div>

                  <SliderInput
                    label="Opacity"
                    value={(localProps.opacity as number) ?? 1}
                    onChange={(v) => handleChange("opacity", v)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
