"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";

export default function NotFound() {
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
              y: [0, -12, 0],
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-primary-500/20 to-pink-500/20 p-6"
          >
            <MapPin className="h-20 w-20 text-primary-400" strokeWidth={1.5} />
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold text-white">
            Page <span className="gradient-text">Not Found</span>
          </h1>
          <p className="mb-8 max-w-md text-lg text-white/40">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <Link href="/">
            <GlassButton variant="primary" size="lg">
              Go Home
            </GlassButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
