"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="glass-card mx-auto mb-8 inline-flex flex-col items-center px-16 py-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, -4, 4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 p-6"
          >
            <AlertTriangle
              className="h-20 w-20 text-amber-400"
              strokeWidth={1.5}
            />
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold text-white">
            Something went <span className="gradient-text">wrong</span>
          </h1>
          <p className="mb-8 max-w-md text-lg text-white/40">
            Don&apos;t worry — your latest changes are safely saved.
          </p>

          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => reset()}
          >
            Try Again
          </GlassButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
