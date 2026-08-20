"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

const iconColors = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

let toastId = 0;
const listeners: Array<(toasts: Toast[]) => void> = [];
let toastsState: Toast[] = [];

function notify(type: ToastType, message: string, duration = 4000) {
  const id = String(++toastId);
  const toast: Toast = { id, type, message, duration };
  toastsState = [...toastsState, toast];
  listeners.forEach((l) => l(toastsState));

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toastsState));
  }, duration);
}

export const toast = {
  success: (msg: string) => notify("success", msg),
  error: (msg: string) => notify("error", msg),
  warning: (msg: string) => notify("warning", msg),
  info: (msg: string) => notify("info", msg),
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    toastsState = toastsState.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toastsState));
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={cn(
                "glass-strong flex items-center gap-3 rounded-xl border px-4 py-3 pr-2 shadow-xl",
                colors[t.type]
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", iconColors[t.type])} />
              <p className="flex-1 text-sm text-white/80">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="rounded-lg p-1.5 text-white/40 hover:text-white/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
