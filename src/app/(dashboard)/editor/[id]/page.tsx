"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { FabricObject } from "fabric";
import { EditorToolbar, type ViewSettings } from "@/components/editor/editor-toolbar";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorPropertiesPanel } from "@/components/editor/editor-properties-panel";
import FabricCanvas, { type FabricCanvasRef } from "@/components/canvas/fabric-canvas";
import { ExportModal } from "@/components/export/export-modal";
import { PreviewModal, printImage } from "@/components/export/preview-modal";
import { QuickFillModal } from "@/components/editor/quick-fill-modal";
import { VersionHistoryModal } from "@/components/editor/version-history-modal";
import { toast } from "@/components/ui/toaster";
import { PAPER_SIZES } from "@/constants";
import { prepareCanvasData, isTextEditing } from "@/lib/editor-utils";
import type { Project } from "@/types";

const MM_TO_PX = 96 / 25.4;

function paperDims(paperSize: string, orientation: string) {
  const size = PAPER_SIZES[paperSize] ?? PAPER_SIZES.A4;
  const portraitW = Math.round(size.width * MM_TO_PX);
  const portraitH = Math.round(size.height * MM_TO_PX);
  return orientation === "landscape"
    ? { width: portraitH, height: portraitW }
    : { width: portraitW, height: portraitH };
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const canvasRef = useRef<FabricCanvasRef>(null);

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [layersVersion, setLayersVersion] = useState(0);
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    snapToGrid: true,
    showGrid: false,
    showSafeArea: false,
    showBleed: false,
  });

  const [project, setProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("Untitled Menu");
  const [paperSize, setPaperSize] = useState<string>("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const isSavingRef = useRef(false);
  const isDirtyRef = useRef(false);
  isDirtyRef.current = isDirty;

  // Bug #1: Warn before closing with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Bug #4: Reset zoom display when paper dimensions change.
  useEffect(() => {
    setZoom(100);
  }, [project?.paperSize, project?.orientation]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || !data.success) {
          setError(data.error || "Project not found");
          return;
        }

        setProject(data.data);
        setProjectName(data.data.name || "Untitled Menu");
        if (data.data.paperSize) setPaperSize(data.data.paperSize);
        if (data.data.orientation === "landscape" || data.data.orientation === "portrait") {
          setOrientation(data.data.orientation);
        }
        if (data.data.customWidth) setCustomWidth(data.data.customWidth);
        if (data.data.customHeight) setCustomHeight(data.data.customHeight);
      } catch {
        if (!cancelled) setError("Failed to load project");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProject();
    return () => { cancelled = true; };
  }, [projectId]);

  // Load user view preferences (best-effort)
  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (!cancelled && res.ok && data.success && data.data) {
          const s = data.data;
          setViewSettings({
            snapToGrid: s.snapToGrid ?? true,
            showGrid: s.showGrid ?? false,
            showSafeArea: s.showSafeArea ?? false,
            showBleed: false,
          });
        }
      } catch {
        /* defaults are fine */
      }
    }
    loadSettings();
    return () => { cancelled = true; };
  }, []);

  // Project canvas JSON is handed to FabricCanvas via `initialData` below so
  // it loads as part of canvas creation (the skeleton hides the canvas while
  // fetching, so imperative loading would race the mount).
  const initialCanvasJson =
    project?.canvasData != null
      ? prepareCanvasData(project.canvasData as unknown as Record<string, unknown>)
      : undefined;

  const handleHistoryUpdate = useCallback((undo: boolean, redo: boolean) => {
    setCanUndo(undo);
    setCanRedo(redo);
  }, []);

  const handleObjectSelected = useCallback((obj: FabricObject | null) => {
    setSelectedObject(obj);
  }, []);

  const handleCanvasChanged = useCallback(() => {
    setIsDirty(true);
    setSaveStatus("unsaved");
    setLayersVersion((v) => v + 1);
  }, []);

  const handleViewSettingChange = useCallback((key: keyof ViewSettings, value: boolean) => {
    setViewSettings((prev) => ({ ...prev, [key]: value }));
    canvasRef.current?.updateOverlaySettings({ [key]: value });
  }, []);

  const handlePropertyUpdate = useCallback((props: Record<string, unknown>) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const active = canvas.getActiveObject();
    if (!active) return;

    const { width, height, ...rest } = props;
    active.set(rest);

    const isText =
      active.type === "i-text" || active.type === "text" || active.type === "textbox";
    if (
      !isText &&
      width !== undefined &&
      height !== undefined &&
      (active.width || 0) > 0 &&
      (active.height || 0) > 0
    ) {
      active.set({
        scaleX: (width as number) / active.width,
        scaleY: (height as number) / active.height,
      });
    }

    active.setCoords();
    canvas.requestRenderAll();
    // Record property edits in undo history
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: active } as any);
    setIsDirty(true);
    setSaveStatus("unsaved");
  }, []);

  const handleSave = useCallback(async () => {
    if (!project || isSavingRef.current) return;

    isSavingRef.current = true;
    setSaveStatus("saving");
    const json = canvasRef.current?.getJSON();
    if (!json) {
      setSaveStatus("unsaved");
      isSavingRef.current = false;
      return;
    }

    try {
      const canvasData = JSON.parse(json);
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          canvasData,
          paperSize,
          orientation,
          ...(paperSize === "custom" ? { customWidth, customHeight } : {}),
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveStatus("saved");
      setIsDirty(false);
      isDirtyRef.current = false;
      toast.success("Project saved");
    } catch {
      setSaveStatus("unsaved");
      toast.error("Failed to save project");
    } finally {
      isSavingRef.current = false;
    }
  }, [project, projectId]);

  useEffect(() => {
    if (!isDirty) return;

    const interval = setInterval(() => {
      if (isDirtyRef.current && !isSavingRef.current) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isDirty, handleSave]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      // Detect when focus is inside a text input — skip all canvas shortcuts.
      const target = e.target as HTMLElement;
      const editing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (!mod && !editing) {
        if (e.key === "Delete" || e.key === "Backspace") {
          const active = canvasRef.current?.getCanvas()?.getActiveObject();
          if (active && (active.type === "i-text" || active.type === "text")) return;
          canvasRef.current?.deleteSelected();
        }
        return;
      }
      // If modifier key held but focus is inside an input, allow the browser
      // to handle it (copy, paste, undo in text field) — do not intercept.
      if (!mod || editing) return;

      const key = e.key.toLowerCase();

      // If a Fabric text object is being edited, let the browser handle
      // clipboard shortcuts (Ctrl+C/X/V) so they work on selected text.
      const fabricCanvas = canvasRef.current?.getCanvas();
      const inTextEdit = isTextEditing(fabricCanvas ?? null);
      if (inTextEdit && (key === "c" || key === "x" || key === "v" || key === "a")) return;

      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        canvasRef.current?.undo();
      }
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        canvasRef.current?.redo();
      }
      if (key === "y") {
        e.preventDefault();
        canvasRef.current?.redo();
      }
      if (key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (key === "d") {
        e.preventDefault();
        canvasRef.current?.duplicateSelected();
      }
      if (key === "c") {
        e.preventDefault();
        canvasRef.current?.copySelected();
      }
      if (key === "x") {
        e.preventDefault();
        canvasRef.current?.copySelected();
        canvasRef.current?.deleteSelected();
      }
      if (key === "v") {
        e.preventDefault();
        canvasRef.current?.pasteCopied();
      }
      if (key === "g" && !e.shiftKey) {
        const active = fabricCanvas?.getActiveObject();
        if (active && active.type === "activeSelection") {
          e.preventDefault();
          canvasRef.current?.groupSelected();
        }
      }
      if (key === "g" && e.shiftKey) {
        e.preventDefault();
        canvasRef.current?.ungroupSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave]);

  const handleZoomIn = useCallback(() => {
    canvasRef.current?.zoomIn();
    setZoom((p) => Math.min(500, p + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    canvasRef.current?.zoomOut();
    setZoom((p) => Math.max(25, p - 10));
  }, []);

  const handleZoomReset = useCallback(() => {
    canvasRef.current?.resetZoom();
    setZoom(100);
  }, []);

  const baseW =
    paperSize === "custom" ? customWidth : PAPER_SIZES[paperSize]?.width ?? 210;
  const baseH =
    paperSize === "custom" ? customHeight : PAPER_SIZES[paperSize]?.height ?? 297;
  const paper =
    orientation === "landscape"
      ? { width: Math.round(baseH * MM_TO_PX), height: Math.round(baseW * MM_TO_PX) }
      : { width: Math.round(baseW * MM_TO_PX), height: Math.round(baseH * MM_TO_PX) };
  const paperInfo = PAPER_SIZES[paperSize] ?? PAPER_SIZES.A4;

  const handleQuickPrint = useCallback(() => {
    const url = canvasRef.current?.exportDataURL(2);
    if (!url) {
      toast.error("Nothing to print yet");
      return;
    }
    const w = orientation === "landscape" ? baseH : baseW;
    const h = orientation === "landscape" ? baseW : baseH;
    printImage(url, w, h);
  }, [orientation, baseW, baseH]);

  const handleSaveAsTemplate = useCallback(async () => {
    if (!project) return;
    const json = canvasRef.current?.getJSON();
    if (!json) {
      toast.error("Nothing to save");
      return;
    }

    const templateName = prompt("Template name:", project.name);
    if (!templateName) return;

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          description: `Custom template created from ${project.name}`,
          category: "minimal",
          canvasData: JSON.parse(json),
          paperSize: project.paperSize,
          orientation: project.orientation,
          tags: ["custom", "user-created"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Template "${templateName}" saved!`);
      } else {
        toast.error(data.error || "Failed to save template");
      }
    } catch {
      toast.error("Failed to save template");
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col bg-surface-950">
        <div className="glass flex items-center justify-between border-b border-white/5 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
            <div className="h-6 w-px bg-white/10" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
            <div className="h-8 w-14 animate-pulse rounded-lg bg-white/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-16 animate-pulse rounded-lg bg-white/10" />
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="glass flex w-14 flex-col items-center gap-1 border-r border-white/5 py-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-10 w-10 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center bg-surface-950/50 p-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-[500px] w-[350px] animate-pulse rounded-lg bg-white/5" />
              <p className="text-sm text-white/40">Loading project...</p>
            </div>
          </div>
          <div className="glass hidden w-[280px] border-l border-white/5 p-4 md:block">
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-surface-950">
        <div className="glass-strong rounded-3xl p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">Project Not Found</h2>
          <p className="mb-6 max-w-sm text-sm text-white/50">
            {error || "The project you're looking for doesn't exist or has been deleted."}
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="rounded-xl bg-primary-500/20 px-6 py-3 text-sm font-medium text-primary-400 transition-colors hover:bg-primary-500/30"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-surface-950">
      <EditorToolbar
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        saveStatus={saveStatus}
        onSave={handleSave}
        onExport={() => setShowExport(true)}
        onPreview={() => setShowPreview(true)}
        onPrint={handleQuickPrint}
        onBack={() => router.push("/projects")}
        onQuickFill={() => setShowQuickFill(true)}
        onSaveAsTemplate={handleSaveAsTemplate}
        onVersionHistory={() => setShowVersionHistory(true)}
        viewSettings={viewSettings}
        onViewSettingChange={handleViewSettingChange}
      />

      {/* Paper setup strip */}
      <div className="glass flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Menu Name
        </span>
        <input
          type="text"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            setIsDirty(true);
            setSaveStatus("unsaved");
          }}
          className="glass-input w-44 px-3 py-1.5 text-sm"
          aria-label="Menu name"
        />
        <div className="h-5 w-px bg-white/10" />
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Paper
        </span>
        <select
          value={paperSize}
          onChange={(e) => {
            setPaperSize(e.target.value);
            setIsDirty(true);
            setSaveStatus("unsaved");
          }}
          className="glass-input px-3 py-1.5 text-sm"
          aria-label="Paper size"
        >
          {Object.entries(PAPER_SIZES).map(([key, size]) => (
            <option key={key} value={key} className="bg-surface-900">
              {size.label}
            </option>
          ))}
          <option value="custom" className="bg-surface-900">
            Custom size
          </option>
        </select>
        {paperSize === "custom" && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={50}
              max={2000}
              value={customWidth}
              onChange={(e) => {
                setCustomWidth(Number(e.target.value) || 210);
                setIsDirty(true);
                setSaveStatus("unsaved");
              }}
              className="glass-input w-20 px-2 py-1.5 text-sm"
              aria-label="Custom width in mm"
            />
            <span className="text-xs text-white/40">×</span>
            <input
              type="number"
              min={50}
              max={2000}
              value={customHeight}
              onChange={(e) => {
                setCustomHeight(Number(e.target.value) || 297);
                setIsDirty(true);
                setSaveStatus("unsaved");
              }}
              className="glass-input w-20 px-2 py-1.5 text-sm"
              aria-label="Custom height in mm"
            />
            <span className="text-xs text-white/40">mm</span>
          </div>
        )}
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          {(["portrait", "landscape"] as const).map((o) => (
            <button
              key={o}
              onClick={() => {
                setOrientation(o);
                setIsDirty(true);
                setSaveStatus("unsaved");
              }}
              aria-pressed={orientation === o}
              className={
                orientation === o
                  ? "bg-primary-500/20 px-3 py-1.5 text-xs font-medium capitalize text-primary-400"
                  : "px-3 py-1.5 text-xs capitalize text-white/40 hover:text-white/70"
              }
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          fabricRef={canvasRef}
        />

        <div className="flex flex-1 overflow-auto bg-surface-950/50 p-8">
          <div className="m-auto">
            <FabricCanvas
              ref={canvasRef}
              width={paper.width}
              height={paper.height}
              initialData={initialCanvasJson}
              onObjectSelected={handleObjectSelected}
              onHistoryUpdate={handleHistoryUpdate}
              onCanvasChanged={handleCanvasChanged}
              overlaySettings={viewSettings}
            />
          </div>
        </div>

        <EditorPropertiesPanel
          selectedObject={selectedObject}
          onUpdate={handlePropertyUpdate}
          fabricRef={canvasRef}
          layersVersion={layersVersion}
        />
      </div>

      <ExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
        getExportImage={(multiplier, format, quality) =>
          canvasRef.current?.exportImage(format === "jpeg" ? "jpeg" : "png", quality ?? 1, multiplier)
        }
        getCanvasJSON={() => canvasRef.current?.getJSON() ?? ""}
        projectId={projectId}
        paperLabel={paperInfo.label}
        paperWidthMm={paperInfo.width}
        paperHeightMm={paperInfo.height}
        orientation={orientation}
        menuName={project.name}
      />

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        getPreviewImage={() => canvasRef.current?.exportDataURL(2)}
        paperLabel={paperInfo.label}
        paperWidthMm={paperInfo.width}
        paperHeightMm={paperInfo.height}
        orientation={orientation}
        menuName={project.name}
      />

      <QuickFillModal
        open={showQuickFill}
        onClose={() => setShowQuickFill(false)}
        fabricRef={canvasRef}
      />

      <VersionHistoryModal
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        projectId={projectId}
        getCanvasJSON={() => canvasRef.current?.getJSON() ?? ""}
        onLoadVersion={(json) => canvasRef.current?.loadJSON(json)}
      />
    </div>
  );
}
