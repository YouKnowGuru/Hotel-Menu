"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Canvas,
  IText,
  Text,
  Textbox,
  Rect,
  Circle,
  Line,
  Group,
  FabricImage,
  Point,
  Gradient,
  Pattern,
  Path,
  Polygon,
  type FabricObject,
} from "fabric";
import { loadMenuFonts, remeasureCanvasText, normalizeCanvasFonts } from "@/lib/menu-generator";
import { prepareCanvasData } from "@/lib/editor-utils";

export interface BrandThemeInput {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fonts?: {
    heading?: string;
    body?: string;
    accent?: string;
  };
  applyBackground?: boolean;
}

export interface MenuItemInput {
  name?: string;
  description?: string;
  price?: string;
  oldPrice?: string;
  currency?: string;
  badge?: string;
  badgeColor?: string;
}

export interface OverlaySettings {
  snapToGrid: boolean;
  gridSize: number;
  showGrid: boolean;
  showSafeArea: boolean;
  showBleed: boolean;
  showRulers: boolean;
  margin: number;
  bleed: number;
}

export interface BorderDesignOptions {
  style?: "single" | "double" | "corners" | "rounded" | "dashed" | "dotted" | "triple" | "bhutanese" | "none";
  color?: string;
  strokeWidth?: number;
  margin?: number;
  rx?: number;
  opacity?: number;
}

export interface BorderInfo {
  exists: boolean;
  style: string;
  color: string;
  strokeWidth: number;
  margin: number;
  rx: number;
  opacity: number;
}

export interface FabricCanvasRef {
  getCanvas: () => Canvas | null;
  addText: (options?: Record<string, unknown>) => void;
  addRect: (options?: Record<string, unknown>) => void;
  addCircle: (options?: Record<string, unknown>) => void;
  addLine: (options?: Record<string, unknown>) => void;
  addPolygonShape: (
    kind: "triangle" | "star" | "diamond" | "hexagon",
    options?: Record<string, unknown>
  ) => void;
  addDivider: () => void;
  addFrame: () => void;
  applyBorderDesign: (options?: BorderDesignOptions) => void;
  getBorderInfo: () => BorderInfo;
  removeBorder: () => void;
  addBadge: (label?: string, color?: string) => void;
  addIcon: (path: string, options?: Record<string, unknown>) => void;
  addImage: (url: string) => void;
  addCircularImage: (url: string, diameter?: number) => void;
  applyBrandTheme: (theme: BrandThemeInput) => void;
  addMenuItem: (name?: string, price?: string) => void;
  addMenuItemFull: (item: MenuItemInput) => void;
  addCategoryBlock: (title?: string, color?: string) => void;
  addFoodCard: (name?: string, desc?: string, price?: string) => void;
  addPriceList: () => void;
  addFeaturedItem: (name?: string, desc?: string, price?: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  pasteCopied: () => void;
  toggleLockSelected: () => void;
  toggleVisibilitySelected: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  getJSON: () => string;
  loadJSON: (json: string) => void;
  clearCanvas: () => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundGradient: (colors: string[], angle?: number) => void;
  setBackgroundPattern: (
    type: "dots" | "lines" | "crosshatch" | "grid",
    color?: string,
    size?: number
  ) => void;
  setBackgroundImage: (url: string) => void;
  clearBackgroundImage: () => void;
  clearBackground: () => void;
  updateOverlaySettings: (settings: Partial<OverlaySettings>) => void;
  exportImage: (format?: string, quality?: number, multiplier?: number) => string | undefined;
  exportDataURL: (multiplier?: number) => string | undefined;
  /** Suppress per-object history saves during bulk canvas operations. */
  setSuppressHistory: (suppress: boolean) => void;
  /* Alignment tools for multi-select */
  alignLeft: () => void;
  alignCenterH: () => void;
  alignRight: () => void;
  alignTop: () => void;
  alignCenterV: () => void;
  alignBottom: () => void;
  distributeHorizontal: () => void;
  distributeVertical: () => void;
  /* QR code generation */
  addQRCode: (url: string, size?: number) => Promise<void>;
}

interface FabricCanvasProps {
  width: number;
  height: number;
  onObjectSelected?: (object: FabricObject | null) => void;
  onHistoryUpdate?: (canUndo: boolean, canRedo: boolean) => void;
  onCanvasChanged?: () => void;
  initialData?: string;
  overlaySettings?: Partial<OverlaySettings>;
}

const POLYGON_POINTS: Record<string, number[][]> = {
  triangle: [[60, 0], [120, 100], [0, 100]],
  diamond: [[60, 0], [120, 60], [60, 120], [0, 60]],
  hexagon: Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [Math.round(60 + 55 * Math.cos(angle)), Math.round(65 + 55 * Math.sin(angle))];
  }),
  star: Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? 60 : 26;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return [Math.round(60 + radius * Math.cos(angle)), Math.round(65 + radius * Math.sin(angle))];
  }),
};

const FabricCanvas = forwardRef<FabricCanvasRef, FabricCanvasProps>(
  ({ width, height, onObjectSelected, onHistoryUpdate, onCanvasChanged, initialData, overlaySettings }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isUndoRedoRef = useRef(false);
    const isLoadingJsonRef = useRef(false);
    const isInternalRef = useRef(false);
    const clipboardRef = useRef<FabricObject | null>(null);
    const savedJsonRef = useRef<string | null>(null);
    // True once any canvas JSON has finished loading (initial or imperative).
    // Used to avoid snapshotting a still-empty canvas during StrictMode
    // remounts, which would otherwise shadow `initialData` with a blank page.
    const didLoadContentRef = useRef(false);
    const overlayObjectsRef = useRef<FabricObject[]>([]);
    const guideVRef = useRef<Rect | null>(null);
    const guideHRef = useRef<Rect | null>(null);
    const overlaySettingsRef = useRef<OverlaySettings>({
      snapToGrid: true,
      gridSize: 10,
      showGrid: false,
      showSafeArea: false,
      showBleed: false,
      showRulers: false,
      margin: 40,
      bleed: 12,
      ...(overlaySettings ?? {}),
    });

    const saveHistory = useCallback(() => {
      if (!fabricRef.current || isUndoRedoRef.current || isInternalRef.current) return;
      const json = JSON.stringify(fabricRef.current.toJSON());
      const history = historyRef.current;
      const index = historyIndexRef.current;

      const newHistory = history.slice(0, index + 1);
      newHistory.push(json);
      if (newHistory.length > 50) newHistory.shift();

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;

      onHistoryUpdate?.(
        historyIndexRef.current > 0,
        historyIndexRef.current < historyRef.current.length - 1
      );
      onCanvasChanged?.();
    }, [onHistoryUpdate, onCanvasChanged]);

    /* ---------------- Overlay helpers (grid, safe area, bleed, guides) ---------------- */

    const hideGuides = useCallback(() => {
      if (guideVRef.current) guideVRef.current.visible = false;
      if (guideHRef.current) guideHRef.current.visible = false;
      fabricRef.current?.requestRenderAll();
    }, []);

    const rebuildOverlays = useCallback(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      isInternalRef.current = true;

      try {
        // Remove previous overlays
        overlayObjectsRef.current.forEach((o) => canvas.remove(o));
        if (guideVRef.current) canvas.remove(guideVRef.current);
        if (guideHRef.current) canvas.remove(guideHRef.current);
        overlayObjectsRef.current = [];

        const s = overlaySettingsRef.current;

        if (s.showGrid) {
          const lines: Line[] = [];
          for (let x = s.gridSize; x < width; x += s.gridSize) {
            lines.push(
              new Line([x, 0, x, height], {
                stroke: "rgba(139, 92, 246, 0.15)",
                strokeWidth: 0.5,
                selectable: false,
                evented: false,
                excludeFromExport: true,
              })
            );
          }
          for (let y = s.gridSize; y < height; y += s.gridSize) {
            lines.push(
              new Line([0, y, width, y], {
                stroke: "rgba(139, 92, 246, 0.15)",
                strokeWidth: 0.5,
                selectable: false,
                evented: false,
                excludeFromExport: true,
              })
            );
          }
          if (lines.length) {
            const grid = new Group(lines, {
              selectable: false,
              evented: false,
              excludeFromExport: true,
            });
            canvas.add(grid);
            overlayObjectsRef.current.push(grid);
          }
        }

        if (s.showSafeArea) {
          const safe = new Rect({
            left: s.margin,
            top: s.margin,
            width: width - s.margin * 2,
            height: height - s.margin * 2,
            originX: "left",
            originY: "top",
            fill: "transparent",
            stroke: "rgba(34, 197, 94, 0.7)",
            strokeWidth: 1,
            strokeDashArray: [6, 4],
            selectable: false,
            evented: false,
            excludeFromExport: true,
          });
          canvas.add(safe);
          overlayObjectsRef.current.push(safe);
        }

        if (s.showBleed) {
          const bleed = new Rect({
            left: 0,
            top: 0,
            width,
            height,
            originX: "left",
            originY: "top",
            fill: "transparent",
            stroke: "rgba(239, 68, 68, 0.7)",
            strokeWidth: 2,
            strokeDashArray: [8, 4],
            selectable: false,
            evented: false,
            excludeFromExport: true,
          });
          const inner = new Rect({
            left: s.bleed,
            top: s.bleed,
            width: width - s.bleed * 2,
            height: height - s.bleed * 2,
            originX: "left",
            originY: "top",
            fill: "transparent",
            stroke: "rgba(239, 68, 68, 0.4)",
            strokeWidth: 1,
            strokeDashArray: [4, 4],
            selectable: false,
            evented: false,
            excludeFromExport: true,
          });
          canvas.add(bleed, inner);
          overlayObjectsRef.current.push(bleed, inner);
        }

        // Alignment guides (hidden until snapping)
        guideVRef.current = new Rect({
          left: width / 2,
          top: 0,
          width: 1,
          height,
          originX: "left",
          originY: "top",
          fill: "rgba(139, 92, 246, 0.9)",
          selectable: false,
          evented: false,
          excludeFromExport: true,
          visible: false,
        });
        guideHRef.current = new Rect({
          left: 0,
          top: height / 2,
          width,
          height: 1,
          originX: "left",
          originY: "top",
          fill: "rgba(139, 92, 246, 0.9)",
          selectable: false,
          evented: false,
          excludeFromExport: true,
          visible: false,
        });
        canvas.add(guideVRef.current, guideHRef.current);

        // Overlays always on top of content
        overlayObjectsRef.current.forEach((o) => canvas.bringObjectToFront(o));
        canvas.bringObjectToFront(guideVRef.current);
        canvas.bringObjectToFront(guideHRef.current);

      } finally {
        isInternalRef.current = false;
      }
      canvas.requestRenderAll();
    }, [width, height]);

    /* ---------------- Snap + alignment logic ---------------- */

    const handleMoving = useCallback(
      (e: { target?: FabricObject; e?: MouseEvent & { altKey?: boolean } }) => {
        const canvas = fabricRef.current;
        const obj = e.target;
        if (!canvas || !obj) return;

        const s = overlaySettingsRef.current;

        if (s.snapToGrid && !e.e?.altKey) {
          obj.set({
            left: Math.round(obj.left / s.gridSize) * s.gridSize,
            top: Math.round(obj.top / s.gridSize) * s.gridSize,
          });
        }

        const threshold = 6;
        const w = obj.getScaledWidth();
        const h = obj.getScaledHeight();
        const cx = obj.left + w / 2;
        const cy = obj.top + h / 2;

        const xTargets = [width / 2, s.margin, width - s.margin];
        const yTargets = [height / 2, s.margin, height - s.margin];

        let snappedX = false;
        let snappedY = false;

        for (const t of xTargets) {
          if (Math.abs(cx - t) < threshold) {
            obj.set({ left: t - w / 2 });
            snappedX = true;
            break;
          }
        }
        for (const t of yTargets) {
          if (Math.abs(cy - t) < threshold) {
            obj.set({ top: t - h / 2 });
            snappedY = true;
            break;
          }
        }

        if (guideVRef.current) {
          guideVRef.current.visible = snappedX;
          if (snappedX) guideVRef.current.set({ left: cx - 0.5 });
        }
        if (guideHRef.current) {
          guideHRef.current.visible = snappedY;
          if (snappedY) guideHRef.current.set({ top: cy - 0.5 });
        }
        canvas.requestRenderAll();
      },
      [width, height]
    );

    /* ---------------- Canvas init ---------------- */

    useEffect(() => {
      if (!canvasRef.current || !containerRef.current) return;

      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
      });

      fabricRef.current = canvas;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas.on("selection:created" as any, (e: any) => {
        onObjectSelected?.(e.selected?.[0] || null);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas.on("selection:updated" as any, (e: any) => {
        onObjectSelected?.(e.selected?.[0] || null);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas.on("selection:cleared" as any, () => {
        onObjectSelected?.(null);
      });

      canvas.on("object:modified", () => {
        hideGuides();
        saveHistory();
      });

      canvas.on("object:moving", (e) => handleMoving(e as never));

      canvas.on("mouse:up", () => hideGuides());

      canvas.on("object:added", () => {
        if (!isUndoRedoRef.current && !isInternalRef.current) saveHistory();
      });

      const initialJson = JSON.stringify(canvas.toJSON());
      historyRef.current = [initialJson];
      historyIndexRef.current = 0;

      const dataToLoad = savedJsonRef.current ?? initialData;

      // Load fonts FIRST, then load canvas JSON.
      // This ensures text is measured with correct font metrics from the
      // start — preventing center/right-aligned text from jumping when
      // fonts finish loading after the template has already rendered.
      const fontsReady = typeof document !== "undefined" && "fonts" in document
        ? loadMenuFonts().catch(() => {})
        : Promise.resolve();

      fontsReady.then(() => {
        if (fabricRef.current !== canvas) return; // unmounted

        if (dataToLoad) {
          isUndoRedoRef.current = true;
          canvas
            .loadFromJSON(prepareCanvasData(normalizeCanvasFonts(dataToLoad)))
            .then(() => {
              if (fabricRef.current !== canvas) {
                isUndoRedoRef.current = false;
                return;
              }
              // Always reset viewport to identity so templates don't load zoomed-in.
              canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
              canvas.setZoom(1);
              canvas.absolutePan(new Point(0, 0));
              didLoadContentRef.current = true;
              canvas.requestRenderAll();
              rebuildOverlays();
              isUndoRedoRef.current = false;
              saveHistory();
            })
            .catch((e) => {
              if (fabricRef.current !== canvas) {
                isUndoRedoRef.current = false;
                return;
              }
              console.error("Failed to load initial canvas data:", e);
              isUndoRedoRef.current = false;
              rebuildOverlays();
            });
        } else {
          rebuildOverlays();
        }
      });

      return () => {
        // Preserve canvas content across width/height remounts (orientation
        // changes). Only persist when real user objects exist — overlay
        // decorations (grid, guides, bleed) should not count, otherwise a
        // blank canvas with overlays shadows `initialData` when switching
        // templates.
        try {
          const hasRealContent =
            didLoadContentRef.current ||
            canvas.getObjects().some((o) => !overlayObjectsRef.current.includes(o));
          if (hasRealContent) {
            savedJsonRef.current = JSON.stringify(canvas.toJSON());
          }
        } catch { savedJsonRef.current = null; }
        canvas.dispose();
        fabricRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height]);

    const getPlacementY = useCallback((elementHeight = 40) => {
      const canvas = fabricRef.current;
      if (!canvas) return 150;
      const h = canvas.getHeight();
      const maxAllowed = h - elementHeight - 40; // always keep within page

      // Helper: clamp to safe range
      const clamp = (y: number) => Math.min(Math.max(y, 40), maxAllowed);

      // If user has something selected, try to place directly below it
      const activeObj = canvas.getActiveObject();
      if (activeObj && activeObj.top != null) {
        const candidateY = (activeObj.top ?? 0) + activeObj.getScaledHeight() + 16;
        if (candidateY + elementHeight <= h - 40) {
          return clamp(candidateY);
        }
      }

      // Scan content objects: skip overlays and full-page backgrounds
      const contentObjects = canvas.getObjects().filter((o) => {
        if (
          overlayObjectsRef.current.includes(o) ||
          o === guideVRef.current ||
          o === guideHRef.current
        ) return false;
        // Skip full-page background covers (covers >80% height)
        if (o.getScaledHeight() >= h * 0.8) return false;
        // Skip footer items near the very bottom (last 80px of page)
        const bottom = (o.top ?? 0) + o.getScaledHeight();
        if ((o.top ?? 0) > h - 100) return false;
        return bottom > 0;
      });

      if (contentObjects.length === 0) {
        return clamp(160);
      }

      // Find the bottom edge of the lowest content element within the usable page area
      let maxBottom = 0;
      for (const obj of contentObjects) {
        const bottom = (obj.top ?? 0) + obj.getScaledHeight();
        if (bottom > maxBottom && bottom < h - 80) {
          maxBottom = bottom;
        }
      }

      // If there's room below all existing content, place there
      if (maxBottom > 0 && maxBottom + elementHeight + 16 <= h - 40) {
        return clamp(maxBottom + 16);
      }

      // Page is full — place in the center of the page so user can see and move it
      return clamp(Math.round(h / 2 - elementHeight / 2));
    }, []);

    const nextYOffset = useCallback((step: number) => {
      return getPlacementY(step);
    }, [getPlacementY]);

    const getThemeColors = useCallback(() => {
      const canvas = fabricRef.current;
      let isDark = false;

      if (canvas) {
        const bg = canvas.backgroundColor;
        if (typeof bg === "string" && bg) {
          const hex = bg.replace("#", "");
          if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            isDark = brightness < 128;
          }
        }

        // Also check if background object is dark
        if (!isDark) {
          const objects = canvas.getObjects();
          const firstObj = objects[0];
          if (firstObj && firstObj.type === "rect" && firstObj.getScaledWidth() >= (canvas.width || 0) * 0.8) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fill = (firstObj as any).fill;
            if (typeof fill === "string") {
              const hex = fill.replace("#", "");
              if (hex.length === 6) {
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                isDark = brightness < 128;
              }
            } else if (typeof fill === "object") {
              isDark = true;
            }
          }
        }
      }

      return {
        text: isDark ? "#f8fafc" : "#1f2937",
        title: isDark ? "#ffffff" : "#111827",
        muted: isDark ? "#94a3b8" : "#6b7280",
        dots: isDark ? "#475569" : "#d1d5db",
        line: isDark ? "#334155" : "#f3f4f6",
        accent: isDark ? "#d4af37" : "#d97706",
      };
    }, []);

    const removeBackgroundCoverObjects = useCallback((canvas: Canvas) => {
      const w = canvas.getWidth();
      const h = canvas.getHeight();
      const objects = canvas.getObjects();
      const toRemove: FabricObject[] = [];

      for (const o of objects) {
        if (
          overlayObjectsRef.current.includes(o) ||
          o === guideVRef.current ||
          o === guideHRef.current
        ) {
          continue;
        }

        // Keep decorative transparent border frames
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fill = (o as any).fill;
        const isTransparent =
          !fill ||
          fill === "transparent" ||
          fill === "rgba(0,0,0,0)" ||
          fill === "none";

        if (isTransparent) continue;

        const scaledW = o.getScaledWidth();
        const scaledH = o.getScaledHeight();
        const coversFullCanvas = scaledW >= w * 0.85 && scaledH >= h * 0.85;
        const nearOrigin = (o.left ?? 0) <= w * 0.15 && (o.top ?? 0) <= h * 0.15;

        if (
          (o.type === "rect" || o.type === "polygon" || o.type === "path" || o.type === "image") &&
          coversFullCanvas &&
          nearOrigin
        ) {
          toRemove.push(o);
        }
      }

      toRemove.forEach((o) => canvas.remove(o));
    }, []);

    /* ---------------- Imperative API ---------------- */

    useImperativeHandle(ref, () => ({
      getCanvas: () => fabricRef.current,

      addText: (options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const text = new IText("Text", {
          left: 100,
          top: 100,
          fontFamily: "Inter",
          fontSize: 24,
          fill: "#000000",
          ...options,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
      },

      addRect: (options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const rect = new Rect({
          left: 100,
          top: 100,
          originX: "left",
          originY: "top",
          width: 150,
          height: 150,
          fill: "rgba(0,0,0,0.05)",
          stroke: "#000000",
          strokeWidth: 1,
          strokeUniform: true,
          ...options,
        });

        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
      },

      addCircle: (options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const circle = new Circle({
          left: 100,
          top: 100,
          radius: 75,
          fill: "rgba(0,0,0,0.05)",
          stroke: "#000000",
          strokeWidth: 1,
          ...options,
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
      },

      addLine: (options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const line = new Line([100, 200, 400, 200], {
          stroke: "#000000",
          strokeWidth: 1,
          ...options,
        });

        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
      },

      addPolygonShape: (kind, options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const poly = new Polygon(POLYGON_POINTS[kind].map(([x, y]) => ({ x, y })), {
          left: 100,
          top: 100,
          fill: "rgba(0,0,0,0.08)",
          stroke: "#000000",
          strokeWidth: 1,
          ...options,
        });

        canvas.add(poly);
        canvas.setActiveObject(poly);
        canvas.renderAll();
      },

      addDivider: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const y = nextYOffset(40);
        const lineW = Math.round(width * 0.75);
        const midX = Math.round(lineW / 2);

        // Children are positioned relative to the group's own bounding box origin.
        // We position the group at left:60, so children are offset from there.
        const line1 = new Line([0, 6, midX - 10, 6], { stroke: "#c9a96e", strokeWidth: 1 });
        const line2 = new Line([midX + 10, 6, lineW, 6], { stroke: "#c9a96e", strokeWidth: 1 });
        const diamond = new Rect({
          left: midX,
          top: 6,
          width: 10,
          height: 10,
          fill: "#c9a96e",
          angle: 45,
          originX: "center",
          originY: "center",
        });

        const group = new Group([line1, line2, diamond], { left: 60, top: y, subTargetCheck: true });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
      },

      addFrame: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(30, Math.round(width * 0.05));
        const frame = new Rect({
          left: margin,
          top: margin,
          width: width - margin * 2,
          height: height - margin * 2,
          originX: "left",
          originY: "top",
          fill: "transparent",
          stroke: "#c9a96e",
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          strokeUniform: true,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (frame as any).name = "menuBorder";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (frame as any).isMenuFrame = true;

        canvas.add(frame);
        canvas.setActiveObject(frame);
        canvas.renderAll();
        saveHistory();
      },

      applyBorderDesign: (options: BorderDesignOptions = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const style = options.style ?? "single";
        const color = options.color ?? "#c9a96e";
        const sw = Math.max(1, options.strokeWidth ?? 2);
        const margin = Math.max(12, options.margin ?? 36);
        const rx = options.rx ?? (style === "rounded" ? 18 : 0);
        const opacity = options.opacity ?? 1;

        // 1. Remove all existing borders and frame objects
        const existingBorders = canvas.getObjects().filter((o) => {
          if (overlayObjectsRef.current.includes(o)) return false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyObj = o as any;
          if (anyObj.name === "menuBorder" || anyObj.isMenuFrame) return true;
          // Also catch any full-perimeter border frame rects
          if (
            o.type === "rect" &&
            (o.fill === "transparent" || !o.fill) &&
            o.stroke &&
            (o.width || 0) > width * 0.55 &&
            (o.height || 0) > height * 0.55
          ) {
            return true;
          }
          return false;
        });
        existingBorders.forEach((o) => canvas.remove(o));

        if (style === "none") {
          canvas.requestRenderAll();
          saveHistory();
          return;
        }

        const borderObjects: FabricObject[] = [];

        const tagBorderObj = (obj: FabricObject, bStyle: string) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any).name = "menuBorder";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any).isMenuFrame = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any).borderStyle = bStyle;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any).selectable = true;
        };

        if (style === "single") {
          const rect = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx,
            ry: rx,
            opacity,
          });
          tagBorderObj(rect, "single");
          borderObjects.push(rect);
        } else if (style === "double") {
          const gap = Math.max(6, sw * 2.5);
          const outer = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx,
            ry: rx,
            opacity,
          });
          const inner = new Rect({
            left: margin + gap,
            top: margin + gap,
            width: width - (margin + gap) * 2,
            height: height - (margin + gap) * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: Math.max(1, sw * 0.6),
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx: Math.max(0, rx - gap / 2),
            ry: Math.max(0, rx - gap / 2),
            opacity,
          });
          tagBorderObj(outer, "double");
          tagBorderObj(inner, "double");
          borderObjects.push(outer, inner);
        } else if (style === "corners") {
          const outer = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity,
          });
          tagBorderObj(outer, "corners");
          borderObjects.push(outer);

          const dSize = Math.max(12, sw * 4);
          const corners = [
            { x: margin, y: margin },
            { x: width - margin, y: margin },
            { x: margin, y: height - margin },
            { x: width - margin, y: height - margin },
          ].map(
            (pt) =>
              new Rect({
                left: pt.x,
                top: pt.y,
                width: dSize,
                height: dSize,
                fill: color,
                angle: 45,
                originX: "center",
                originY: "center",
                opacity,
              })
          );
          corners.forEach((c) => {
            tagBorderObj(c, "corners");
            borderObjects.push(c);
          });
        } else if (style === "rounded") {
          const effectiveRx = rx || 20;
          const rect = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx: effectiveRx,
            ry: effectiveRx,
            opacity,
          });
          tagBorderObj(rect, "rounded");
          borderObjects.push(rect);
        } else if (style === "dashed") {
          const rect = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeDashArray: [12, 6],
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx,
            ry: rx,
            opacity,
          });
          tagBorderObj(rect, "dashed");
          borderObjects.push(rect);
        } else if (style === "dotted") {
          const rect = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: Math.max(2, sw),
            strokeDashArray: [3, 4],
            strokeUniform: true,
            originX: "left",
            originY: "top",
            rx,
            ry: rx,
            opacity,
          });
          tagBorderObj(rect, "dotted");
          borderObjects.push(rect);
        } else if (style === "triple") {
          const g1 = Math.max(4, sw * 1.5);
          const g2 = Math.max(8, sw * 3);
          const outer = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: Math.max(1, sw * 0.5),
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity,
          });
          const mid = new Rect({
            left: margin + g1,
            top: margin + g1,
            width: width - (margin + g1) * 2,
            height: height - (margin + g1) * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: sw,
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity,
          });
          const inner = new Rect({
            left: margin + g2,
            top: margin + g2,
            width: width - (margin + g2) * 2,
            height: height - (margin + g2) * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: Math.max(1, sw * 0.5),
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity,
          });
          tagBorderObj(outer, "triple");
          tagBorderObj(mid, "triple");
          tagBorderObj(inner, "triple");
          borderObjects.push(outer, mid, inner);
        } else if (style === "bhutanese") {
          const gap = 12;
          const outer = new Rect({
            left: margin,
            top: margin,
            width: width - margin * 2,
            height: height - margin * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: Math.max(2, sw * 1.2),
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity,
          });
          const inner = new Rect({
            left: margin + gap,
            top: margin + gap,
            width: width - (margin + gap) * 2,
            height: height - (margin + gap) * 2,
            fill: "transparent",
            stroke: color,
            strokeWidth: 1,
            strokeDashArray: [8, 4],
            strokeUniform: true,
            originX: "left",
            originY: "top",
            opacity: opacity * 0.8,
          });
          tagBorderObj(outer, "bhutanese");
          tagBorderObj(inner, "bhutanese");
          borderObjects.push(outer, inner);

          const dSize = 14;
          const corners = [
            { x: margin + gap, y: margin + gap },
            { x: width - margin - gap, y: margin + gap },
            { x: margin + gap, y: height - margin - gap },
            { x: width - margin - gap, y: height - margin - gap },
          ].map(
            (pt) =>
              new Rect({
                left: pt.x,
                top: pt.y,
                width: dSize,
                height: dSize,
                fill: color,
                angle: 45,
                originX: "center",
                originY: "center",
                opacity,
              })
          );
          corners.forEach((c) => {
            tagBorderObj(c, "bhutanese");
            borderObjects.push(c);
          });
        }

        // 2. Add border objects and guarantee they sit right ABOVE the background rect
        const nonOverlayObjects = canvas.getObjects().filter((o) => !overlayObjectsRef.current.includes(o));
        const bgObj = nonOverlayObjects.find(
          (o) =>
            o.type === "rect" &&
            o.fill &&
            o.fill !== "transparent" &&
            (o.width || 0) >= width * 0.75 &&
            (o.height || 0) >= height * 0.75
        );

        borderObjects.forEach((obj) => {
          canvas.add(obj);
          if (bgObj) {
            const currentObjs = canvas.getObjects();
            const bgIdx = currentObjs.indexOf(bgObj);
            if (bgIdx >= 0 && typeof (canvas as any).moveObjectTo === "function") {
              (canvas as any).moveObjectTo(obj, bgIdx + 1);
            }
          } else {
            canvas.sendObjectToBack(obj);
          }
        });

        canvas.requestRenderAll();
        saveHistory();
      },

      getBorderInfo: () => {
        const canvas = fabricRef.current;
        if (!canvas) {
          return { exists: false, style: "single", color: "#c9a96e", strokeWidth: 2, margin: 36, rx: 0, opacity: 1 };
        }
        const obj = canvas.getObjects().find((o) => {
          if (overlayObjectsRef.current.includes(o)) return false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyObj = o as any;
          return anyObj.name === "menuBorder" || anyObj.isMenuFrame || (
            o.type === "rect" && o.fill === "transparent" && o.stroke && (o.width || 0) > width * 0.55 && (o.height || 0) > height * 0.55
          );
        });
        if (!obj) {
          return { exists: false, style: "single", color: "#c9a96e", strokeWidth: 2, margin: 36, rx: 0, opacity: 1 };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyObj = obj as any;
        const color = anyObj.stroke || (anyObj._objects?.[0]?.stroke) || "#c9a96e";
        const strokeWidth = anyObj.strokeWidth || (anyObj._objects?.[0]?.strokeWidth) || 2;
        const margin = Math.round(obj.left || 36);
        const rx = anyObj.rx || 0;
        const opacity = obj.opacity ?? 1;
        const style = anyObj.borderStyle || (anyObj.strokeDashArray ? (anyObj.strokeDashArray[0] > 5 ? "dashed" : "dotted") : (rx > 0 ? "rounded" : "single"));
        return { exists: true, style, color, strokeWidth, margin, rx, opacity };
      },

      removeBorder: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const existingBorders = canvas.getObjects().filter((o) => {
          if (overlayObjectsRef.current.includes(o)) return false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyObj = o as any;
          return anyObj.name === "menuBorder" || anyObj.isMenuFrame || (
            o.type === "rect" && o.fill === "transparent" && o.stroke && (o.width || 0) > width * 0.55 && (o.height || 0) > height * 0.55
          );
        });
        existingBorders.forEach((o) => canvas.remove(o));
        canvas.requestRenderAll();
        saveHistory();
      },

      addBadge: (label = "CHEF'S SPECIAL", color = "#ef4444") => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const safeLabel = String(label || "CHEF'S SPECIAL").toUpperCase();
        const safeColor = color || "#ef4444";

        const text = new Text(safeLabel, {
          fontFamily: "Inter",
          fontSize: 12,
          fontWeight: "700",
          fill: "#ffffff",
          charSpacing: 80,
        });

        // In Fabric.js, getLineWidth takes a line index number (0), not a string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tw = (text as any).getLineWidth?.(0) || text.width || (safeLabel.length * 8.5);
        const pill = new Rect({
          width: Math.max(60, tw + 28),
          height: 26,
          rx: 13,
          ry: 13,
          fill: safeColor,
        });

        text.set({ left: 14, top: 7 });
        const group = new Group([pill, text], { left: 100, top: nextYOffset(36), subTargetCheck: true });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
      },

      addIcon: (path: string, options: Record<string, unknown> = {}) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const icon = new Path(path, {
          left: 120,
          top: 120,
          scaleX: 2,
          scaleY: 2,
          stroke: "#374151",
          strokeWidth: 1.5,
          fill: "",
          strokeUniform: true,
          ...options,
        });

        canvas.add(icon);
        canvas.setActiveObject(icon);
        canvas.renderAll();
      },

      addImage: (url: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        FabricImage.fromURL(url, { crossOrigin: "anonymous" }).then((img) => {
          const maxWidth = width * 0.5;
          const scale = (img.width || 100) > maxWidth ? maxWidth / (img.width || 100) : 1;

          img.set({
            left: 100,
            top: 100,
            scaleX: scale,
            scaleY: scale,
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      },

      addCircularImage: (url: string, diameter = 240) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        FabricImage.fromURL(url, { crossOrigin: "anonymous" }).then((img) => {
          const r = diameter / 2;
          // Scale image to cover the circle (cover, not contain)
          const imgW = img.width || 1;
          const imgH = img.height || 1;
          const scale = Math.max(diameter / imgW, diameter / imgH);

          img.set({
            scaleX: scale,
            scaleY: scale,
            // Center the image within the circle origin
            originX: "center",
            originY: "center",
            left: 0,
            top: 0,
          });

          // Clip to a circle centred at image origin
          const clipCircle = new Circle({
            radius: r,
            originX: "center",
            originY: "center",
            left: 0,
            top: 0,
          });
          img.clipPath = clipCircle;

          // Position on canvas
          img.set({
            left: width / 2,
            top: 200,
            originX: "center",
            originY: "center",
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      },

      applyBrandTheme: (theme: BrandThemeInput) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const headingFont = theme.fonts?.heading?.trim() || "Playfair Display";
        const bodyFont = theme.fonts?.body?.trim() || "Inter";
        const accentFont = theme.fonts?.accent?.trim() || "Dancing Script";

        // Load fonts dynamically
        loadMenuFonts();

        // Process all canvas objects
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          // Check if object is text (Text, IText, Textbox)
          if (obj.type === "text" || obj.type === "i-text" || obj.type === "textbox") {
            const textObj = obj as Text | IText | Textbox;
            const size = textObj.fontSize || 16;
            const weight = String(textObj.fontWeight || "");

            // If heading size or bold weight -> Heading font + primary color
            if (size >= 24 || weight === "bold" || weight === "700" || weight === "800" || weight === "900") {
              textObj.set({
                fontFamily: headingFont,
                fill: theme.primaryColor || textObj.fill,
              });
            } else if (weight === "600" || weight === "semibold") {
              // Subheaders / Categories
              textObj.set({
                fontFamily: headingFont,
                fill: theme.primaryColor || textObj.fill,
              });
            } else {
              // Body text
              textObj.set({
                fontFamily: bodyFont,
              });
            }
          } else if (obj.type === "group") {
            const grp = obj as Group;
            grp.getObjects().forEach((child) => {
              if (child.type === "text" || child.type === "i-text" || child.type === "textbox") {
                const textObj = child as Text | IText | Textbox;
                const size = textObj.fontSize || 16;
                if (size >= 22) {
                  textObj.set({
                    fontFamily: headingFont,
                    fill: theme.primaryColor || textObj.fill,
                  });
                } else {
                  textObj.set({
                    fontFamily: bodyFont,
                  });
                }
              } else if (child.type === "rect" || child.type === "circle" || child.type === "line") {
                // Accent colored badges or dividers in groups
                if (theme.accentColor) {
                  const currentFill = String(child.fill || "");
                  if (currentFill !== "transparent" && currentFill !== "#ffffff" && currentFill !== "#000000") {
                    child.set({ fill: theme.accentColor });
                  }
                }
              }
            });
          } else if (obj.type === "line" || obj.type === "rect") {
            // Standalone dividers or accents
            const isFullBackground = obj.width && obj.width >= width * 0.9 && obj.height && obj.height >= height * 0.9;
            if (!isFullBackground && theme.accentColor) {
              const currentStroke = String(obj.stroke || "");
              if (currentStroke && currentStroke !== "transparent") {
                obj.set({ stroke: theme.accentColor });
              }
            }
          }
        });

        // Optionally apply background color if requested
        if (theme.applyBackground && theme.secondaryColor) {
          removeBackgroundCoverObjects(canvas);
          canvas.backgroundImage = undefined;
          canvas.backgroundColor = theme.secondaryColor;
        }

        remeasureCanvasText(canvas);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addMenuItem: (name = "Menu Item", price = "$12.99") => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(36, Math.round(width * 0.08));
        const contentW = width - margin * 2;
        const yOffset = getPlacementY(36);
        const colors = getThemeColors();

        const nameText = new IText(name, {
          left: 0,
          top: 0,
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: "600",
          fill: colors.text,
        });

        const dotsText = new Text("·".repeat(45), {
          left: Math.round(contentW * 0.35),
          top: 3,
          fontFamily: "Inter",
          fontSize: 14,
          fill: colors.dots,
        });

        const priceText = new IText(price, {
          left: contentW,
          top: 0,
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: "700",
          fill: colors.accent,
          originX: "right",
        });

        const group = new Group([nameText, dotsText, priceText], {
          left: margin,
          top: yOffset,
          subTargetCheck: true,
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addMenuItemFull: (item: MenuItemInput) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const {
          name = "Menu Item",
          description = "",
          price = "12.99",
          oldPrice = "",
          currency = "$",
          badge = "",
          badgeColor = "#ef4444",
        } = item;

        const margin = Math.max(36, Math.round(width * 0.08));
        const contentW = width - margin * 2;
        const yOffset = getPlacementY(description ? 65 : 45);
        const colors = getThemeColors();
        const parts: FabricObject[] = [];
        let cursorY = 0;

        if (badge) {
          const badgeText = new Text(badge, {
            left: 8,
            top: cursorY + 3,
            fontFamily: "Inter",
            fontSize: 9,
            fontWeight: "700",
            fill: "#ffffff",
            charSpacing: 50,
          });
          const bw = (badgeText.width || badge.length * 6) + 16;
          const pill = new Rect({
            left: 0,
            top: cursorY,
            width: bw,
            height: 18,
            rx: 9,
            ry: 9,
            fill: badgeColor,
          });
          parts.push(pill, badgeText);
          cursorY += 24;
        }

        const nameText = new IText(name, {
          left: 0,
          top: cursorY,
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: "600",
          fill: colors.text,
        });
        parts.push(nameText);

        const priceLabel = price ? `${currency}${price}` : "";
        if (priceLabel) {
          const priceText = new IText(priceLabel, {
            left: contentW,
            top: cursorY,
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: "700",
            fill: colors.accent,
            originX: "right",
          });
          parts.push(priceText);
        }

        if (oldPrice) {
          const oldText = new Text(`${currency}${oldPrice}`, {
            left: contentW - 75,
            top: cursorY + 2,
            fontFamily: "Inter",
            fontSize: 12,
            fill: colors.muted,
            linethrough: true,
            originX: "right",
          });
          parts.push(oldText);
        }

        const dotsTop = new Text("·".repeat(40), {
          left: Math.round(contentW * 0.38),
          top: cursorY + 3,
          fontFamily: "Inter",
          fontSize: 14,
          fill: colors.dots,
        });
        parts.push(dotsTop);
        cursorY += 22;

        if (description) {
          const descText = new Textbox(description, {
            left: 0,
            top: cursorY,
            width: Math.round(contentW * 0.85),
            fontFamily: "Inter",
            fontSize: 12,
            fill: colors.muted,
            splitByGrapheme: false,
          });
          parts.push(descText);
          cursorY += (descText.height || 16) + 4;
        }

        const divider = new Line([0, cursorY + 4, contentW, cursorY + 4], {
          stroke: colors.line,
          strokeWidth: 1,
        });
        parts.push(divider);

        const group = new Group(parts, { left: margin, top: yOffset, subTargetCheck: true });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addCategoryBlock: (title = "Category", color = "#d97706") => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(36, Math.round(width * 0.08));
        const contentW = width - margin * 2;
        const midX = Math.round(contentW / 2);
        const yOffset = getPlacementY(40);
        const lineY = 13;

        const titleText = new Text(title.toUpperCase(), {
          left: midX,
          top: 0,
          fontFamily: "Playfair Display",
          fontSize: 18,
          fontWeight: "700",
          fill: color,
          charSpacing: 120,
          originX: "center",
          originY: "top",
        });
        const textHalfW = Math.round(((titleText.width || 120) + 30) / 2);

        const lineLeft = new Line([0, lineY, midX - textHalfW, lineY], {
          stroke: color,
          strokeWidth: 1,
        });

        const lineRight = new Line([midX + textHalfW, lineY, contentW, lineY], {
          stroke: color,
          strokeWidth: 1,
        });

        const group = new Group([lineLeft, titleText, lineRight], {
          left: margin,
          top: yOffset,
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addFoodCard: (name = "Food Name", desc = "Description", price = "$14.99") => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(36, Math.round(width * 0.08));
        const cardW = Math.min(220, Math.round((width - margin * 2) * 0.48));
        const yOffset = getPlacementY(240);
        const colors = getThemeColors();
        const imgH = 130;
        const cardH = 230;

        const cardBg = new Rect({
          left: 0,
          top: 0,
          width: cardW,
          height: cardH,
          originX: "left",
          originY: "top",
          rx: 12,
          ry: 12,
          fill: colors.text === "#f8fafc" ? "#1e293b" : "#ffffff",
          stroke: colors.line,
          strokeWidth: 1,
        });

        const imagePlaceholder = new Rect({
          left: 0,
          top: 0,
          width: cardW,
          height: imgH,
          originX: "left",
          originY: "top",
          rx: 12,
          ry: 12,
          fill: colors.text === "#f8fafc" ? "#0f172a" : "#f3f4f6",
        });

        const nameText = new Text(name, {
          left: 12,
          top: imgH + 10,
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: "600",
          fill: colors.title,
        });

        const descText = new Text(desc, {
          left: 12,
          top: imgH + 30,
          fontFamily: "Inter",
          fontSize: 11,
          fill: colors.muted,
        });

        const priceText = new Text(price, {
          left: 12,
          top: imgH + 54,
          fontFamily: "Inter",
          fontSize: 15,
          fontWeight: "700",
          fill: colors.accent,
        });

        const group = new Group([cardBg, imagePlaceholder, nameText, descText, priceText], {
          left: margin,
          top: yOffset,
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addPriceList: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(36, Math.round(width * 0.08));
        const contentW = width - margin * 2;
        const yOffset = getPlacementY(190);
        const colors = getThemeColors();
        const parts: FabricObject[] = [];
        const rows = [
          { n: "House Specialty", d: "Chef's signature preparation", p: "$24" },
          { n: "Seasonal Delight", d: "Fresh from the market", p: "$19" },
          { n: "Classic Favorite", d: "Prepared the traditional way", p: "$16" },
        ];

        let cursorY = 0;
        rows.forEach((row, i) => {
          parts.push(
            new Text(row.n, {
              left: 0,
              top: cursorY,
              fontFamily: "Inter",
              fontSize: 15,
              fontWeight: "600",
              fill: colors.text,
            }),
            new Text(row.d, {
              left: 0,
              top: cursorY + 22,
              fontFamily: "Inter",
              fontSize: 11,
              fill: colors.muted,
            }),
            new Text(row.p, {
              left: contentW,
              top: cursorY,
              fontFamily: "Inter",
              fontSize: 15,
              fontWeight: "700",
              fill: colors.accent,
              originX: "right",
            })
          );
          if (i < rows.length - 1) {
            parts.push(
              new Line([0, cursorY + 48, contentW, cursorY + 48], { stroke: colors.line, strokeWidth: 1 })
            );
          }
          cursorY += 60;
        });

        const group = new Group(parts, { left: margin, top: yOffset, subTargetCheck: true });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      addFeaturedItem: (name = "Featured Dish", desc = "Short delicious description", price = "$28") => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const margin = Math.max(36, Math.round(width * 0.08));
        const cardW = Math.min(width - margin * 2, 420);
        const yOffset = getPlacementY(260);
        const colors = getThemeColors();

        const imagePlaceholder = new Rect({
          left: 0,
          top: 0,
          width: cardW,
          height: 160,
          originX: "left",
          originY: "top",
          rx: 12,
          ry: 12,
          fill: colors.text === "#f8fafc" ? "#1e293b" : "#f3f4f6",
          stroke: colors.line,
          strokeWidth: 1,
        });

        const nameText = new Text(name, {
          left: 0,
          top: 176,
          fontFamily: "Playfair Display",
          fontSize: 22,
          fontWeight: "700",
          fill: colors.title,
        });

        const priceText = new Text(price, {
          left: cardW,
          top: 176,
          fontFamily: "Inter",
          fontSize: 20,
          fontWeight: "700",
          fill: colors.accent,
          originX: "right",
        });

        const descText = new Textbox(desc, {
          left: 0,
          top: 210,
          width: cardW,
          fontFamily: "Inter",
          fontSize: 12,
          fill: colors.muted,
          splitByGrapheme: false,
        });

        const group = new Group([imagePlaceholder, nameText, descText, priceText], {
          left: margin,
          top: yOffset,
          subTargetCheck: true,
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      deleteSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObjects();
        if (active.length) {
          active.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          saveHistory();
        }
      },

      duplicateSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active) return;

        active.clone().then((cloned: FabricObject) => {
          cloned.set({
            left: (active.left || 0) + 20,
            top: (active.top || 0) + 20,
          });

          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
          saveHistory();
        });
      },

      copySelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active) return;

        active.clone().then((cloned: FabricObject) => {
          clipboardRef.current = cloned;
        });
      },

      pasteCopied: () => {
        const canvas = fabricRef.current;
        if (!canvas || !clipboardRef.current) return;

        clipboardRef.current.clone().then((copy: FabricObject) => {
          copy.set({
            left: (copy.left || 0) + 24,
            top: (copy.top || 0) + 24,
          });
          canvas.add(copy);
          canvas.setActiveObject(copy);
          canvas.renderAll();
          saveHistory();
        });
      },

      toggleLockSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active) return;

        const locked = active.lockMovementX;
        active.set({
          lockMovementX: !locked,
          lockMovementY: !locked,
          lockScalingX: !locked,
          lockScalingY: !locked,
          lockRotation: !locked,
          hasControls: locked,
        });
        canvas.requestRenderAll();
        onCanvasChanged?.();
      },

      toggleVisibilitySelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active) return;

        // `visible` defaults to `true` (not `undefined`), so use a proper boolean toggle.
        active.set({ visible: active.visible === false ? true : false });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        saveHistory();
      },

      bringForward: () => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;
        canvas.bringObjectForward(active);
        saveHistory();
      },

      sendBackwards: () => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;
        canvas.sendObjectBackwards(active);
        saveHistory();
      },

      bringToFront: () => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;
        canvas.bringObjectToFront(active);
        overlayObjectsRef.current.forEach((o) => canvas.bringObjectToFront(o));
        if (guideVRef.current) canvas.bringObjectToFront(guideVRef.current);
        if (guideHRef.current) canvas.bringObjectToFront(guideHRef.current);
        saveHistory();
      },

      sendToBack: () => {
        const canvas = fabricRef.current;
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;
        canvas.sendObjectToBack(active);
        saveHistory();
      },

      groupSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;

        const group = new Group(objects);
        // Some fabric versions keep the originals on canvas — remove if still present
        objects.forEach((o) => {
          if (canvas.getObjects().includes(o)) canvas.remove(o);
        });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        saveHistory();
      },

      ungroupSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const active = canvas.getActiveObject();
        if (!active || active.type !== "group") return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const group = active as any;
        // Collect child objects before removing the group.
        const items: FabricObject[] = (group.getObjects?.() ?? []) as FabricObject[];
        // Clone matrix so children retain their world transform after ungroup.
        const matrix = group.calcTransformMatrix?.() as number[] | undefined;
        canvas.remove(group);
        items.forEach((o) => {
          if (matrix) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const objMatrix = (o as any).calcTransformMatrix?.() as number[] | undefined;
            if (objMatrix) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const decomposed = (o as any).constructor?.qrDecompose?.(objMatrix);
              if (decomposed) o.set(decomposed);
            }
          }
          canvas.add(o);
          o.setCoords();
        });
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        saveHistory();
      },

      undo: () => {
        const canvas = fabricRef.current;
        if (!canvas || historyIndexRef.current <= 0 || isLoadingJsonRef.current) return;

        isUndoRedoRef.current = true;
        isLoadingJsonRef.current = true;
        historyIndexRef.current--;
        const json = historyRef.current[historyIndexRef.current];

        canvas.loadFromJSON(json).then(() => {
          canvas.renderAll();
          rebuildOverlays();
          isUndoRedoRef.current = false;
          isLoadingJsonRef.current = false;
          onHistoryUpdate?.(
            historyIndexRef.current > 0,
            historyIndexRef.current < historyRef.current.length - 1
          );
        });
      },

      redo: () => {
        const canvas = fabricRef.current;
        if (!canvas || historyIndexRef.current >= historyRef.current.length - 1 || isLoadingJsonRef.current) return;

        isUndoRedoRef.current = true;
        isLoadingJsonRef.current = true;
        historyIndexRef.current++;
        const json = historyRef.current[historyIndexRef.current];

        canvas.loadFromJSON(json).then(() => {
          canvas.renderAll();
          rebuildOverlays();
          isUndoRedoRef.current = false;
          isLoadingJsonRef.current = false;
          onHistoryUpdate?.(
            historyIndexRef.current > 0,
            historyIndexRef.current < historyRef.current.length - 1
          );
        });
      },

      zoomIn: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const newZoom = Math.min(canvas.getZoom() + 0.1, 3);
        canvas.zoomToPoint(new Point(width / 2, height / 2), newZoom);
        canvas.renderAll();
      },

      zoomOut: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const newZoom = Math.max(canvas.getZoom() - 0.1, 0.25);
        canvas.zoomToPoint(new Point(width / 2, height / 2), newZoom);
        canvas.renderAll();
      },

      resetZoom: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.renderAll();
      },

      getJSON: () => {
        const canvas = fabricRef.current;
        if (!canvas) return "";
        return JSON.stringify(canvas.toJSON());
      },

      loadJSON: (json: string) => {
        const canvas = fabricRef.current;
        if (!canvas) {
          console.error("loadJSON: canvas not ready yet");
          return;
        }

        isUndoRedoRef.current = true;
        canvas
          .loadFromJSON(prepareCanvasData(normalizeCanvasFonts(json)))
          .then(() => {
            if (fabricRef.current !== canvas) return;
            // Always reset viewport to identity so canvas doesn't appear zoomed.
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            canvas.setZoom(1);
            canvas.absolutePan(new Point(0, 0));
            didLoadContentRef.current = true;
            canvas.requestRenderAll();
            rebuildOverlays();
            isUndoRedoRef.current = false;
            saveHistory();
          })
          .catch((e) => {
            if (fabricRef.current !== canvas) return;
            console.error("loadJSON failed:", e);
            isUndoRedoRef.current = false;
          });
      },

      clearCanvas: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        // Remove objects individually instead of calling canvas.clear().
        // In Fabric.js v6 canvas.clear() internally calls _initRetinaScaling()
        // which re-applies a context.scale(dpr, dpr) transform — if called
        // multiple times the scale compounds (2× → 4× → 8× …), causing all
        // subsequently drawn objects to appear squished toward the top-left.
        const objects = canvas.getObjects().slice();
        canvas.remove(...objects);
        canvas.backgroundImage = undefined;
        canvas.backgroundColor = "#ffffff";
        // Reset any viewport pan/zoom so generateMenu starts from a clean origin.
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.renderAll();
        saveHistory();
        rebuildOverlays();
      },

      setBackgroundColor: (color: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        removeBackgroundCoverObjects(canvas);
        canvas.backgroundImage = undefined;
        canvas.backgroundColor = color;
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      setBackgroundGradient: (colors: string[], angle = 0) => {
        const canvas = fabricRef.current;
        if (!canvas || !colors || colors.length === 0) return;
        removeBackgroundCoverObjects(canvas);
        canvas.backgroundImage = undefined;
        const angleRad = (angle * Math.PI) / 180;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        const w = canvas.getWidth();
        const h = canvas.getHeight();
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

        const grad = new Gradient({
          type: "linear",
          coords: {
            x1: w / 2 - (cos * length) / 2,
            y1: h / 2 - (sin * length) / 2,
            x2: w / 2 + (cos * length) / 2,
            y2: h / 2 + (sin * length) / 2,
          },
          colorStops,
        });
        // Fabric v5/v6/v7: assign directly; the Fabric v4 two-argument callback
        // form of setBackgroundColor(gradient, cb) is removed.
        canvas.backgroundColor = grad as unknown as string;
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      setBackgroundPattern: (type: "dots" | "lines" | "crosshatch" | "grid", color = "#e5e7eb", size = 20) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        removeBackgroundCoverObjects(canvas);
        canvas.backgroundImage = undefined;
        const patternCanvas = document.createElement("canvas");
        const ctx = patternCanvas.getContext("2d")!;
        patternCanvas.width = size;
        patternCanvas.height = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        switch (type) {
          case "dots":
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 8, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "lines":
            ctx.beginPath();
            ctx.moveTo(0, size / 2);
            ctx.lineTo(size, size / 2);
            ctx.stroke();
            break;
          case "crosshatch":
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size, size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(0, size);
            ctx.stroke();
            break;
          case "grid":
            ctx.beginPath();
            ctx.moveTo(0, size / 2);
            ctx.lineTo(size, size / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(size / 2, 0);
            ctx.lineTo(size / 2, size);
            ctx.stroke();
            break;
        }
        const pattern = new Pattern({ source: patternCanvas, repeat: "repeat" });
        // Fabric v5/v6/v7: assign directly; avoid deprecated v4 callback form.
        canvas.backgroundColor = pattern as unknown as string;
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      setBackgroundImage: (url: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        removeBackgroundCoverObjects(canvas);

        FabricImage.fromURL(url, { crossOrigin: "anonymous" }).then((img) => {
          const scale = Math.max(width / (img.width || 1), height / (img.height || 1));
          img.set({
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
            scaleX: scale,
            scaleY: scale,
          });
          // Use the public API so Fabric tracks the backgroundImage for
          // toJSON() serialization — direct property assignment bypasses this.
          canvas.backgroundImage = img;
          canvas.requestRenderAll();
          saveHistory();
          onCanvasChanged?.();
        });
      },

      clearBackgroundImage: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.backgroundImage = undefined;
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      clearBackground: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        removeBackgroundCoverObjects(canvas);
        canvas.backgroundColor = "#ffffff";
        canvas.backgroundImage = undefined;
        canvas.requestRenderAll();
        saveHistory();
        onCanvasChanged?.();
      },

      updateOverlaySettings: (settings: Partial<OverlaySettings>) => {
        overlaySettingsRef.current = { ...overlaySettingsRef.current, ...settings };
        rebuildOverlays();
      },

      exportImage: (format = "png", quality = 1, multiplier = 1) => {
        const canvas = fabricRef.current;
        if (!canvas) return undefined;

        const overlays = [...overlayObjectsRef.current];
        const prevVisibility = overlays.map((o) => o.visible);
        overlays.forEach((o) => (o.visible = false));
        if (guideVRef.current) guideVRef.current.visible = false;
        if (guideHRef.current) guideHRef.current.visible = false;
        canvas.requestRenderAll();

        const url = canvas.toDataURL({
          format: format as "png" | "jpeg",
          quality,
          multiplier,
        });

        overlays.forEach((o, i) => (o.visible = prevVisibility[i]));
        canvas.requestRenderAll();
        return url;
      },

      exportDataURL: (multiplier = 1) => {
        const canvas = fabricRef.current;
        if (!canvas) return undefined;

        const overlays = [...overlayObjectsRef.current];
        const prevVisibility = overlays.map((o) => o.visible);
        overlays.forEach((o) => (o.visible = false));
        if (guideVRef.current) guideVRef.current.visible = false;
        if (guideHRef.current) guideHRef.current.visible = false;
        canvas.requestRenderAll();

        const url = canvas.toDataURL({ format: "png", multiplier });

        overlays.forEach((o, i) => (o.visible = prevVisibility[i]));
        canvas.requestRenderAll();
        return url;
      },

      setSuppressHistory: (suppress: boolean) => {
        isUndoRedoRef.current = suppress;
      },

      /* ---------------- Alignment tools (multi-select) ---------------- */

      alignLeft: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const minLeft = Math.min(...objects.map((o) => o.left || 0));
        objects.forEach((o) => o.set({ left: minLeft }));
        canvas.requestRenderAll();
        saveHistory();
      },

      alignCenterH: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const centers = objects.map((o) => (o.left || 0) + o.getScaledWidth() / 2);
        const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
        objects.forEach((o) => o.set({ left: avgCenter - o.getScaledWidth() / 2 }));
        canvas.requestRenderAll();
        saveHistory();
      },

      alignRight: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const maxRight = Math.max(...objects.map((o) => (o.left || 0) + o.getScaledWidth()));
        objects.forEach((o) => o.set({ left: maxRight - o.getScaledWidth() }));
        canvas.requestRenderAll();
        saveHistory();
      },

      alignTop: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const minTop = Math.min(...objects.map((o) => o.top || 0));
        objects.forEach((o) => o.set({ top: minTop }));
        canvas.requestRenderAll();
        saveHistory();
      },

      alignCenterV: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const centers = objects.map((o) => (o.top || 0) + o.getScaledHeight() / 2);
        const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
        objects.forEach((o) => o.set({ top: avgCenter - o.getScaledHeight() / 2 }));
        canvas.requestRenderAll();
        saveHistory();
      },

      alignBottom: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 2) return;
        const maxBottom = Math.max(...objects.map((o) => (o.top || 0) + o.getScaledHeight()));
        objects.forEach((o) => o.set({ top: maxBottom - o.getScaledHeight() }));
        canvas.requestRenderAll();
        saveHistory();
      },

      distributeHorizontal: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 3) return;
        const sorted = [...objects].sort((a, b) => (a.left || 0) - (b.left || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalWidth = sorted.reduce((sum, o) => sum + o.getScaledWidth(), 0);
        const firstLeft = first.left || 0;
        const lastRight = (last.left || 0) + last.getScaledWidth();
        const totalSpace = lastRight - firstLeft - totalWidth;
        const gap = totalSpace / (sorted.length - 1);
        let cursor = firstLeft;
        sorted.forEach((o) => {
          o.set({ left: cursor });
          cursor += o.getScaledWidth() + gap;
        });
        canvas.requestRenderAll();
        saveHistory();
      },

      distributeVertical: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const objects = canvas.getActiveObjects();
        if (objects.length < 3) return;
        const sorted = [...objects].sort((a, b) => (a.top || 0) - (b.top || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalHeight = sorted.reduce((sum, o) => sum + o.getScaledHeight(), 0);
        const firstTop = first.top || 0;
        const lastBottom = (last.top || 0) + last.getScaledHeight();
        const totalSpace = lastBottom - firstTop - totalHeight;
        const gap = totalSpace / (sorted.length - 1);
        let cursor = firstTop;
        sorted.forEach((o) => {
          o.set({ top: cursor });
          cursor += o.getScaledHeight() + gap;
        });
        canvas.requestRenderAll();
        saveHistory();
      },

      /* ---------------- QR code generation ---------------- */

      addQRCode: async (url: string, size = 120) => {
        const canvas = fabricRef.current;
        if (!canvas || !url) return;

        try {
          const QRCode = await import("qrcode");
          const dataUrl = await QRCode.toDataURL(url, {
            width: size * 2,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
          });

          const img = await FabricImage.fromURL(dataUrl);
          img.set({
            left: width / 2 - size / 2,
            top: height - size - 60,
            scaleX: size / (img.width || size),
            scaleY: size / (img.height || size),
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveHistory();
        } catch (e) {
          console.error("Failed to generate QR code:", e);
        }
      },
    }), [getPlacementY, getThemeColors, removeBackgroundCoverObjects, nextYOffset, width, height, saveHistory, rebuildOverlays, onCanvasChanged, onHistoryUpdate]);

    return (
      <div ref={containerRef} className="relative overflow-hidden rounded-lg bg-white shadow-2xl">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

FabricCanvas.displayName = "FabricCanvas";

export default FabricCanvas;
