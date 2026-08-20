"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Loader2, Download } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  /** Returns a data URL of the canvas without overlays */
  getPreviewImage: () => string | undefined;
  paperLabel: string;
  paperWidthMm: number;
  paperHeightMm: number;
  orientation: "portrait" | "landscape";
  menuName: string;
}

export function printImage(
  dataUrl: string,
  widthMm: number,
  heightMm: number
) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
<style>
  @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
  html, body { margin: 0; padding: 0; }
  img { width: ${widthMm}mm; height: ${heightMm}mm; display: block; }
</style>
</head>
<body><img src="${dataUrl}" /></body>
</html>`);
  doc.close();

  const cleanup = () => {
    setTimeout(() => document.body.removeChild(iframe), 500);
  };

  const img = doc.querySelector("img");
  if (img) {
    const startPrint = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      cleanup();
    };
    if (img.complete) {
      setTimeout(startPrint, 100);
    } else {
      img.addEventListener("load", () => setTimeout(startPrint, 100));
      img.addEventListener("error", cleanup);
    }
  } else {
    cleanup();
  }
}

export function PreviewModal({
  open,
  onClose,
  getPreviewImage,
  paperLabel,
  paperWidthMm,
  paperHeightMm,
  orientation,
  menuName,
}: PreviewModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (open) {
      setIsGenerating(true);
      // Give the modal a tick to mount before synchronously exporting
      setTimeout(() => {
        const url = getPreviewImage();
        setImageUrl(url ?? null);
        setIsGenerating(false);
      }, 50);
    } else {
      setImageUrl(null);
    }
  }, [open, getPreviewImage]);

  const handlePrint = () => {
    if (!imageUrl) return;
    setIsPrinting(true);
    const w = paperWidthMm;
    const h = paperHeightMm;
    printImage(imageUrl, w, h);
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = `${menuName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-preview.png`;
    link.href = imageUrl;
    link.click();
  };

  const w = paperWidthMm;
  const h = paperHeightMm;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Print preview"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-white">Print Preview</h2>
              <p className="text-xs text-white/40">
                {menuName} — {paperLabel} {orientation} • {w} × {h} mm
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="ghost" size="sm" onClick={handleDownload} disabled={!imageUrl}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Save PNG</span>
              </GlassButton>
              <GlassButton variant="primary" size="sm" onClick={handlePrint} disabled={!imageUrl}>
                {isPrinting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                Print
              </GlassButton>
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="rounded-lg p-2 text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex flex-1 items-center justify-center overflow-auto p-6">
            {isGenerating && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                <p className="text-sm text-white/40">Rendering preview...</p>
              </div>
            )}
            {!isGenerating && imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white shadow-2xl"
                style={{ maxHeight: "100%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${menuName} preview`}
                  style={{ maxHeight: "calc(100vh - 160px)", width: "auto", display: "block" }}
                />
              </motion.div>
            )}
            {!isGenerating && !imageUrl && (
              <p className="text-sm text-white/40">Failed to generate preview.</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
