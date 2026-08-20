"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="glass-card mx-auto inline-flex flex-col items-center px-16 py-12">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-primary-500/30 to-blue-500/30 p-6"
          >
            <Sparkles className="h-16 w-16 text-primary-400" />
          </motion.div>

          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-lg font-medium text-white/60"
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
