"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FabricObject } from "fabric";
import { EditorToolbar, type ViewSettings } from "@/components/editor/editor-toolbar";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorPropertiesPanel } from "@/components/editor/editor-properties-panel";
import FabricCanvas, { type FabricCanvasRef } from "@/components/canvas/fabric-canvas";
import { ExportModal } from "@/components/export/export-modal";
import { PreviewModal, printImage } from "@/components/export/preview-modal";
import { QuickFillModal } from "@/components/editor/quick-fill-modal";
import { toast } from "@/components/ui/toaster";
import { PAPER_SIZES } from "@/constants";
import { prepareCanvasData, isTextEditing } from "@/lib/editor-utils";
import type { Template } from "@/types";

const MM_TO_PX = 96 / 25.4;
const DRAFT_KEY = "menu-editor-new-draft";

export default function NewEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const autofillParam = searchParams.get("autofill");
  const styleParam = searchParams.get("style");

  const canvasRef = useRef<FabricCanvasRef>(null);
  const autofillOpenedRef = useRef(false);

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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

  const [templateName, setTemplateName] = useState<string>("Untitled Menu");
  const [templateCategory, setTemplateCategory] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(!!templateId);
  const [pendingTemplateJson, setPendingTemplateJson] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isSavingRef = useRef(false);
  const isDirtyRef = useRef(false);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const pendingDraftRef = useRef<string | null>(null);

  // Warn before closing with unsaved changes (Bug #1)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Auto-open Quick Fill when arriving from the template gallery (?autofill=1).
  useEffect(() => {
    if (autofillParam === "1" && !autofillOpenedRef.current) {
      autofillOpenedRef.current = true;
      setShowQuickFill(true);
    }
  }, [autofillParam]);

  const [paperSize, setPaperSize] = useState<string>("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [showPaperSetup, setShowPaperSetup] = useState(true);

  // Load user defaults for paper + view settings (best-effort)
  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (!cancelled && res.ok && data.success && data.data) {
          const s = data.data;
          // When opening a template, the template's own paper/orientation must
          // win — only apply user defaults on a blank canvas. (Otherwise a
          // slower settings fetch remounts the canvas with the wrong size.)
          if (!templateId) {
            if (s.defaultPaperSize) setPaperSize(s.defaultPaperSize);
            if (s.defaultOrientation) setOrientation(s.defaultOrientation);
          }
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
  }, [templateId]);

  useEffect(() => {
    if (!templateId) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        // Syncing with localStorage (an external system unavailable during
        // SSR) — a post-mount effect is the correct place for this setState.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasDraft(true);
      }
      return;
    }

    let cancelled = false;

    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/templates/${templateId}`);
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || !data.success || !data.data) {
          toast.error(data.error || "Failed to load template");
          return;
        }

        const template: Template = data.data;

        setTemplateName(template.name);
        setTemplateCategory(template.category ?? null);
        // Respect template paper settings when available
        const tpl = template as Template & { paperSize?: string; orientation?: string };
        if (tpl.paperSize) setPaperSize(tpl.paperSize);
        if (tpl.orientation === "landscape" || tpl.orientation === "portrait") {
          setOrientation(tpl.orientation);
        }

        if (template.canvasData) {
          // The canvas isn't mounted while the skeleton is showing, so stage
          // the JSON and hand it to FabricCanvas via `initialData` (loaded as
          // part of canvas creation — no mount race).
          setPendingTemplateJson(
            prepareCanvasData(template.canvasData as unknown as Record<string, unknown>)
          );
        }
      } catch {
        if (!cancelled) toast.error("Failed to load template");
      } finally {
        if (!cancelled) setIsLoadingTemplate(false);
      }
    }

    fetchTemplate();
    return () => { cancelled = true; };
  }, [templateId]);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.fire("object:modified" as any, { target: active } as any);
    setIsDirty(true);
    setSaveStatus("unsaved");
  }, []);

  const saveDraftToStorage = useCallback(() => {
    const json = canvasRef.current?.getJSON();
    if (json) {
      const draft = {
        name: templateName,
        canvasData: json,
        templateId,
        paperSize,
        orientation,
        customWidth,
        customHeight,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [templateName, templateId, paperSize, orientation, customWidth, customHeight]);

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaveStatus("saving");
    const json = canvasRef.current?.getJSON();
    if (!json) {
      setSaveStatus("unsaved");
      isSavingRef.current = false;
      return;
    }

    if (createdProjectId) {
      try {
        const canvasData = JSON.parse(json);
        const res = await fetch(`/api/projects/${createdProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ canvasData, name: templateName }),
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
    } else {
      try {
        const canvasData = JSON.parse(json);
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: templateName,
            templateId,
            canvasData,
            paperSize,
            orientation,
            ...(paperSize === "custom" ? { customWidth, customHeight } : {}),
          }),
        });

        if (!res.ok) throw new Error("Create failed");

        const data = await res.json();
        const newId = data.data._id;
        setCreatedProjectId(newId);

        setSaveStatus("saved");
        setIsDirty(false);
        isDirtyRef.current = false;
        localStorage.removeItem(DRAFT_KEY);
        toast.success("Project created");

        router.replace(`/editor/${newId}`);
      } catch {
        setSaveStatus("unsaved");
        toast.error("Failed to create project");
      } finally {
        isSavingRef.current = false;
      }
    }
  }, [createdProjectId, templateName, templateId, paperSize, orientation, customWidth, customHeight, router]);

  useEffect(() => {
    if (!isDirty) return;

    const interval = setInterval(() => {
      if (isDirtyRef.current && !isSavingRef.current) {
        if (createdProjectId) {
          handleSave();
        } else {
          saveDraftToStorage();
          // Don't show "Saved" or clear isDirty — it's only a draft.
          setSaveStatus("unsaved");
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isDirty, createdProjectId, handleSave, saveDraftToStorage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

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
        if (!fabricCanvas?.getObjects()?.length) return;
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

  const handleLoadDraft = useCallback(() => {
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (!draftStr) return;

    try {
      const draft = JSON.parse(draftStr);
      if (draft.name) setTemplateName(draft.name);
      if (draft.paperSize) setPaperSize(draft.paperSize);
      if (draft.orientation === "landscape" || draft.orientation === "portrait") {
        setOrientation(draft.orientation);
      }
      if (typeof draft.customWidth === "number") setCustomWidth(draft.customWidth);
      if (typeof draft.customHeight === "number") setCustomHeight(draft.customHeight);
      // Stage canvas data so the (soon-to-remount) canvas picks it up as
      // initialData — avoids a race between loadJSON and the canvas remount.
      if (draft.canvasData) {
        pendingDraftRef.current = draft.canvasData;
      }
      setHasDraft(false);
      toast.success("Draft restored");
    } catch {
      toast.error("Failed to load draft");
    }
  }, []);

  const handleDiscardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    toast.info("Draft discarded");
  }, []);

  // Compute canvas pixel dimensions
  const baseW =
    paperSize === "custom" ? customWidth : PAPER_SIZES[paperSize]?.width ?? 210;
  const baseH =
    paperSize === "custom" ? customHeight : PAPER_SIZES[paperSize]?.height ?? 297;
  const paper =
    orientation === "landscape"
      ? { width: Math.round(baseH * MM_TO_PX), height: Math.round(baseW * MM_TO_PX) }
      : { width: Math.round(baseW * MM_TO_PX), height: Math.round(baseH * MM_TO_PX) };

  // Reset zoom display when paper dimensions change (Bug #4).
  // Must live here — after `paper` is defined.
  useEffect(() => {
    setZoom(100);
  }, [paper.width, paper.height]);

  const pageWmm = orientation === "landscape" ? baseH : baseW;
  const pageHmm = orientation === "landscape" ? baseW : baseH;
  const paperLabel =
    paperSize === "custom"
      ? `Custom (${customWidth} × ${customHeight} mm)`
      : PAPER_SIZES[paperSize]?.label ?? "A4";

  const handleQuickPrint = useCallback(() => {
    const url = canvasRef.current?.exportDataURL(2);
    if (!url) {
      toast.error("Nothing to print yet");
      return;
    }
    printImage(url, pageWmm, pageHmm);
  }, [pageWmm, pageHmm]);

  // Bug #11: Allow saving new editor canvas as template.
  const handleSaveAsTemplate = useCallback(async () => {
    const json = canvasRef.current?.getJSON();
    if (!json) {
      toast.error("Nothing to save");
      return;
    }

    const name = prompt("Template name:", templateName);
    if (!name) return;

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: `Custom template — ${name}`,
          category: templateCategory ?? "minimal",
          canvasData: JSON.parse(json),
          paperSize,
          orientation,
          tags: ["custom", "user-created"],
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Template saved!");
      } else {
        throw new Error(data.error || "Failed to save template");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save template");
    }
  }, [templateName, templateCategory, paperSize, orientation]);

  if (isLoadingTemplate) {
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
              <p className="text-sm text-white/40">Loading template...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-surface-950">
      {hasDraft && (
        <div className="glass flex items-center justify-between border-b border-amber-500/20 bg-amber-500/5 px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <p className="text-sm text-white/70">
              You have an unsaved draft from a previous session
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscardDraft}
              className="rounded-lg px-3 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              Discard
            </button>
            <button
              onClick={handleLoadDraft}
              className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/30"
            >
              Restore Draft
            </button>
          </div>
        </div>
      )}

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
        viewSettings={viewSettings}
        onViewSettingChange={handleViewSettingChange}
      />

      {/* Paper setup strip (before first save) */}
      {showPaperSetup && !createdProjectId && (
        <div className="glass flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Menu Name
          </span>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="glass-input w-44 px-3 py-1.5 text-sm"
            aria-label="Menu name"
          />
          <div className="h-5 w-px bg-white/10" />
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Paper
          </span>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
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
                onChange={(e) => setCustomWidth(Number(e.target.value) || 210)}
                className="glass-input w-20 px-2 py-1.5 text-sm"
                aria-label="Custom width in mm"
              />
              <span className="text-xs text-white/40">×</span>
              <input
                type="number"
                min={50}
                max={2000}
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value) || 297)}
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
                onClick={() => setOrientation(o)}
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
          <button
            onClick={() => setShowPaperSetup(false)}
            className="ml-auto rounded-lg px-3 py-1.5 text-xs text-white/40 hover:text-white/70"
            aria-label="Hide paper setup"
          >
            Hide
          </button>
        </div>
      )}
      {!showPaperSetup && !createdProjectId && (
        <button
          onClick={() => setShowPaperSetup(true)}
          className="glass border-b border-white/5 px-4 py-1.5 text-left text-xs text-white/40 hover:text-white/70"
        >
          {templateName} — {paperLabel} {orientation} (click to change)
        </button>
      )}

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
              initialData={pendingTemplateJson ?? pendingDraftRef.current ?? undefined}
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
        projectId={createdProjectId ?? undefined}
        paperLabel={paperLabel}
        paperWidthMm={pageWmm}
        paperHeightMm={pageHmm}
        orientation={orientation}
        menuName={templateName}
      />

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        getPreviewImage={() => canvasRef.current?.exportDataURL(2)}
        paperLabel={paperLabel}
        paperWidthMm={pageWmm}
        paperHeightMm={pageHmm}
        orientation={orientation}
        menuName={templateName}
      />

      <QuickFillModal
        open={showQuickFill}
        onClose={() => setShowQuickFill(false)}
        fabricRef={canvasRef}
        initialStyleCategory={styleParam ?? templateCategory ?? undefined}
      />
    </div>
  );
}
