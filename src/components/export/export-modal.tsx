"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileImage,
  FileText,
  X,
  Loader2,
  Check,
  Settings,
} from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  /** Returns a canvas data URL at the given multiplier, overlays hidden */
  getExportImage: (multiplier: number, format?: "png" | "jpeg", quality?: number) => string | undefined;
  /** Serialized canvas JSON, used to record export history */
  getCanvasJSON: () => string;
  projectId?: string;
  paperLabel: string;
  paperWidthMm: number;
  paperHeightMm: number;
  orientation: "portrait" | "landscape";
  menuName: string;
}

type ExportFormat = "pdf" | "png" | "jpg";

export function ExportModal({
  open,
  onClose,
  getExportImage,
  getCanvasJSON,
  projectId,
  paperLabel,
  paperWidthMm,
  paperHeightMm,
  orientation,
  menuName,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [quality, setQuality] = useState(1);
  const [dpi, setDpi] = useState(300);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const safeName = menuName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "menu";

  const recordHistory = async () => {
    try {
      // Best-effort export history record
      await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasData: getCanvasJSON(),
          format,
          dpi,
          quality,
          paperSize: paperLabel,
          orientation,
          projectId,
        }),
      });
    } catch {
      /* history is best-effort */
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const multiplier = dpi / 96;
      const pageW = paperWidthMm;
      const pageH = paperHeightMm;

      if (format === "png" || format === "jpg") {
        const dataUrl = getExportImage(
          multiplier,
          format === "png" ? "png" : "jpeg",
          quality
        );
        if (!dataUrl) throw new Error("Export failed");

        const link = document.createElement("a");
        link.download = `${safeName}-${dpi}dpi.${format}`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const imgData = getExportImage(multiplier, "png", 1);
        if (!imgData) throw new Error("Export failed");

        const { default: jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
          orientation: pageW > pageH ? "landscape" : "portrait",
          unit: "mm",
          format: [pageW, pageH],
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${safeName}-${dpi}dpi.pdf`);
      }

      await recordHistory();

      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!open) return null;

  const pageW = paperWidthMm;
  const pageH = paperHeightMm;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Export menu"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-strong relative z-10 mx-4 w-full max-w-md rounded-3xl p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Export Menu</h2>
            <button
              onClick={onClose}
              aria-label="Close export dialog"
              className="rounded-lg p-2 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-white/60">Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "pdf" as const, label: "PDF", icon: FileText, desc: "Print-ready" },
                { value: "png" as const, label: "PNG", icon: FileImage, desc: "Lossless" },
                { value: "jpg" as const, label: "JPG", icon: FileImage, desc: "Compressed" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  aria-pressed={format === f.value}
                  className={`glass flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                    format === f.value
                      ? "border-primary-500/50 bg-primary-500/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <f.icon className="h-6 w-6 text-white/60" />
                  <span className="text-sm font-medium text-white">{f.label}</span>
                  <span className="text-xs text-white/30">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="mb-6 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60">DPI (Resolution)</label>
                <span className="text-sm font-medium text-white">{dpi}</span>
              </div>
              <input
                type="range"
                min={72}
                max={600}
                step={1}
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                aria-label="Export DPI"
                className="mt-2 w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-white/30">
                <span>72 (Screen)</span>
                <span>300 (Print)</span>
                <span>600 (High)</span>
              </div>
            </div>

            {format !== "pdf" && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/60">Quality</label>
                  <span className="text-sm font-medium text-white">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  aria-label="Export quality"
                  className="mt-2 w-full accent-primary-500"
                />
              </div>
            )}
          </div>

          {/* Paper Size Info */}
          <div className="mb-6 rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Settings className="h-4 w-4" />
              <span>
                Paper: {paperLabel} {orientation} • {pageW} × {pageH} mm
              </span>
            </div>
            <p className="mt-1 pl-6 text-xs text-white/30">
              Output at {dpi} DPI ≈ {Math.round((pageW * dpi) / 25.4)} × {Math.round((pageH * dpi) / 25.4)} px
            </p>
          </div>

          {/* Export Button */}
          <GlassButton
            variant="primary"
            className="w-full"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : exported ? (
              <>
                <Check className="h-4 w-4" />
                Exported!
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </GlassButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
