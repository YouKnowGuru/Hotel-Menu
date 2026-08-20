"use client";

import { cn } from "@/lib/utils";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlassModal({ open, onClose, title, children, className }: GlassModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "glass-strong relative z-10 mx-4 max-h-[85vh] w-full max-w-lg overflow-auto rounded-3xl p-8",
          className
        )}
      >
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="glass rounded-lg p-2 text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
