"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  LayoutTemplate,
  MousePointer2,
  Download,
  Palette,
  Code2,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

const features = [
  {
    icon: LayoutTemplate,
    title: "Template Library",
    description: "Start with professionally designed menu templates or create your own from scratch.",
  },
  {
    icon: MousePointer2,
    title: "Drag & Drop Editor",
    description: "Intuitive canvas editor with real-time preview and precise layout control.",
  },
  {
    icon: Download,
    title: "Export Options",
    description: "Export your menus as PDF, PNG, or JPG in any DPI for print or digital use.",
  },
  {
    icon: Palette,
    title: "Brand Kit",
    description: "Save your brand colors, fonts, and logos for consistent menu design.",
  },
];

const builtWith = [
  { name: "Next.js", description: "React framework" },
  { name: "MongoDB", description: "Database" },
  { name: "Fabric.js", description: "Canvas rendering" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white">MenuStudio</h1>
          <p className="mt-4 text-xl text-white/50">
            Design beautiful menus effortlessly with a powerful, intuitive editor.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-16 grid gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <GlassCard level={2} hover className="h-full p-6">
                <feature.icon className="mb-4 h-8 w-8 text-primary-400" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <GlassCard level={2} className="p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Built with</h2>
            <div className="flex flex-wrap gap-4">
              {builtWith.map((tech) => (
                <div
                  key={tech.name}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-3"
                >
                  <Code2 className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{tech.name}</p>
                    <p className="text-xs text-white/40">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link href="/dashboard/projects">
            <GlassButton variant="primary" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </GlassButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
