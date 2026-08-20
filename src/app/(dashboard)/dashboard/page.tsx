"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutTemplate,
  FolderOpen,
  Palette,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { useSession } from "next-auth/react";
import { getGreeting } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

interface Project {
  _id: string;
  name: string;
  updatedAt: string;
  thumbnail?: string;
  paperSize?: string;
  orientation?: string;
}

interface Template {
  _id: string;
  name: string;
  category: string;
  thumbnail?: string;
}

const quickActions = [
  {
    label: "New Menu",
    href: "/editor/new",
    icon: Plus,
    gradient: "from-primary-500/30 to-blue-500/30",
    iconColor: "text-primary-400",
  },
  {
    label: "Templates",
    href: "/templates",
    icon: LayoutTemplate,
    gradient: "from-pink-500/30 to-rose-500/30",
    iconColor: "text-pink-400",
  },
  {
    label: "My Projects",
    href: "/projects",
    icon: FolderOpen,
    gradient: "from-amber-500/30 to-orange-500/30",
    iconColor: "text-amber-400",
  },
  {
    label: "Brand Kit",
    href: "/brand-kit",
    icon: Palette,
    gradient: "from-green-500/30 to-emerald-500/30",
    iconColor: "text-green-400",
  },
];

const gradients = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
];

function SkeletonCard() {
  return (
    <div className="h-44 rounded-2xl bg-white/5 animate-pulse" />
  );
}

function SkeletonTemplate() {
  return (
    <div className="w-64 shrink-0">
      <div className="h-40 rounded-xl bg-white/5 animate-pulse mb-3" />
      <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse mb-2" />
      <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Chef";

  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProjects(d.data.slice(0, 3));
      })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoadingProjects(false));

    fetch("/api/templates?limit=4")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTemplates(d.data);
      })
      .catch(() => toast.error("Failed to load templates"))
      .finally(() => setLoadingTemplates(false));
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()} 👋
          </h1>
          <p className="mt-2 text-lg text-white/50">
            What will you design today, {userName}?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <GlassCard level={1} hover className="group text-center">
                <div
                  className={`mx-auto mb-3 inline-flex rounded-2xl bg-gradient-to-br ${action.gradient} p-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <p className="text-sm font-medium text-white/80">{action.label}</p>
              </GlassCard>
            </Link>
          ))}
        </motion.div>

        {/* Create New Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <Link href="/editor/new">
            <GlassCard level={2} className="group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500 shadow-lg shadow-primary-500/25">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Create New Menu</h3>
                  <p className="text-sm text-white/50">
                    Start from scratch or choose a template
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-white/60" />
            </GlassCard>
          </Link>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Menus</h2>
            <Link
              href="/projects"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {loadingProjects
              ? Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`skel-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              : projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <Link href={`/editor/${project._id}`}>
                      <GlassCard level={1} hover className="group">
                        <div
                          className="mb-4 h-32 rounded-xl"
                          style={{ background: project.thumbnail || gradients[i % gradients.length] }}
                        />
                        <h3 className="font-medium text-white">{project.name}</h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
                          <Clock className="h-3 w-3" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
            {!loadingProjects && projects.length === 0 && (
              <div className="col-span-3 py-10 text-center">
                <p className="text-white/40">No projects yet. Create your first menu!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Template Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Featured Templates</h2>
            <Link
              href="/templates"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Browse All
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {loadingTemplates
              ? Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`skel-tpl-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <SkeletonTemplate />
                  </motion.div>
                ))
              : templates.map((tpl, i) => (
                  <motion.div
                    key={tpl._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="shrink-0"
                  >
                    <Link href="/templates">
                      <GlassCard
                        level={1}
                        hover
                        className="w-64 cursor-pointer"
                      >
                        <div
                          className="mb-3 h-40 rounded-xl"
                          style={{
                            background: tpl.thumbnail || `linear-gradient(135deg, hsl(${i * 60}, 50%, 30%), hsl(${i * 60 + 30}, 50%, 20%))`,
                          }}
                        />
                        <h3 className="font-medium text-white">{tpl.name}</h3>
                        <p className="text-xs text-white/40">{tpl.category}</p>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
