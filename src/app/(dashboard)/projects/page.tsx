"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Clock,
  MoreVertical,
  Copy,
  Trash2,
  Archive,
  ArchiveRestore,
  Edit3,
  FolderOpen,
  Pencil,
  Check,
  X,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { toast } from "@/components/ui/toaster";

interface Project {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt?: string;
  status: string;
  thumbnail?: string;
  paperSize?: string;
  orientation?: string;
  templateId?: string;
  canvasData?: Record<string, unknown>;
  customWidth?: number;
  customHeight?: number;
}

type SortKey = "recent" | "oldest" | "name";

const gradients = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "active" | "archived">("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchProjects = useCallback(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProjects(d.data);
      })
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const insideAnyMenu = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(e.target as Node)
      );
      if (!insideAnyMenu) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "archived" ? p.status === "archived" : p.status === "active");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "oldest")
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleDuplicate = async (project: Project) => {
    setActiveMenu(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Copy of ${project.name}`,
          templateId: project.templateId,
          paperSize: project.paperSize,
          orientation: project.orientation,
          ...(project.paperSize === "custom"
            ? { customWidth: project.customWidth, customHeight: project.customHeight }
            : {}),
          canvasData: project.canvasData || { objects: [] },
        }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Project duplicated");
        fetchProjects();
      } else {
        toast.error(d.error || "Failed to duplicate project");
      }
    } catch {
      toast.error("Failed to duplicate project");
    }
  };

  const handleArchive = async (id: string) => {
    setActiveMenu(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Project archived");
        fetchProjects();
      } else {
        toast.error(d.error || "Failed to archive project");
      }
    } catch {
      toast.error("Failed to archive project");
    }
  };

  const handleRestore = async (id: string) => {
    setActiveMenu(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Project restored");
        fetchProjects();
      } else {
        toast.error(d.error || "Failed to restore project");
      }
    } catch {
      toast.error("Failed to restore project");
    }
  };

  const handleRename = async (id: string) => {
    const newName = renameValue.trim();
    if (!newName) {
      setRenamingId(null);
      return;
    }
    setRenamingId(null);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Project renamed");
        fetchProjects();
      } else {
        toast.error(d.error || "Failed to rename project");
      }
    } catch {
      toast.error("Failed to rename project");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setDeleteTarget(null);
    setActiveMenu(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error(d.error || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="mt-2 text-white/50">Manage all your menu designs</p>
          </div>
          <Link href="/editor/new" aria-label="Create a new menu">
            <GlassButton variant="primary">
              <Plus className="h-4 w-4" /> New Menu
            </GlassButton>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-4"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="glass-input w-full pl-10"
            />
          </div>
          <div className="flex gap-2" role="group" aria-label="Filter by status">
            {(["all", "active", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterBy(f)}
                aria-pressed={filterBy === f}
                className={`rounded-xl px-4 py-2.5 text-sm transition-all ${
                  filterBy === f
                    ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                    : "glass text-white/50 hover:text-white/80"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              aria-label="Sort projects"
              className="glass rounded-xl py-2.5 pl-9 pr-4 text-sm text-white/60"
            >
              <option value="recent" className="bg-surface-900">Last modified</option>
              <option value="oldest" className="bg-surface-900">Oldest first</option>
              <option value="name" className="bg-surface-900">Name A–Z</option>
            </select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skel-${i}`} className="h-60 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <GlassCard level={1} hover className="group relative">
                  <Link href={`/editor/${project._id}`} aria-label={`Open ${project.name}`}>
                    <div
                      className="mb-4 h-40 rounded-xl"
                      style={{
                        background: project.thumbnail || gradients[i % gradients.length],
                      }}
                    />
                  </Link>

                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      {renamingId === project._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(project._id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            className="glass-input w-full px-2 py-1 text-sm"
                            aria-label="New project name"
                          />
                          <button
                            onClick={() => handleRename(project._id)}
                            aria-label="Confirm rename"
                            className="rounded-lg p-1.5 text-green-400 hover:bg-white/5"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setRenamingId(null)}
                            aria-label="Cancel rename"
                            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="truncate font-medium text-white">{project.name}</h3>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                        {project.paperSize && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5">
                            {project.paperSize === "custom" ? "Custom" : project.paperSize}
                            {project.orientation === "landscape" ? " ↔" : ""}
                          </span>
                        )}
                        {project.status === "archived" && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative" ref={(el) => { menuRefs.current[project._id] = el; }}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === project._id ? null : project._id)}
                        aria-label={`Actions for ${project.name}`}
                        aria-expanded={activeMenu === project._id}
                        className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeMenu === project._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="glass-strong absolute right-0 top-full z-10 mt-1 w-44 rounded-xl p-2"
                          role="menu"
                        >
                          <button
                            onClick={() => {
                              setActiveMenu(null);
                              router.push(`/editor/${project._id}`);
                            }}
                            role="menuitem"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenu(null);
                              setRenamingId(project._id);
                              setRenameValue(project.name);
                            }}
                            role="menuitem"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Rename
                          </button>
                          <button
                            onClick={() => handleDuplicate(project)}
                            role="menuitem"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" /> Duplicate
                          </button>
                          {project.status === "archived" ? (
                            <button
                              onClick={() => handleRestore(project._id)}
                              role="menuitem"
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                            >
                              <ArchiveRestore className="h-3.5 w-3.5" /> Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(project._id)}
                              role="menuitem"
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                            >
                              <Archive className="h-3.5 w-3.5" /> Archive
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(project)}
                            role="menuitem"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/5"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <p className="text-lg text-white/40">
              {searchQuery || filterBy !== "all" ? "No matching projects" : "No projects yet"}
            </p>
            <p className="mb-6 text-sm text-white/20">
              {searchQuery || filterBy !== "all"
                ? "Try a different search or filter"
                : "Create your first menu to get started"}
            </p>
            <Link href="/editor/new">
              <GlassButton variant="primary">
                <Plus className="h-4 w-4" /> Create Menu
              </GlassButton>
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm delete"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong relative z-10 mx-4 w-full max-w-sm rounded-3xl p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertTriangle className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-white">Delete this menu?</h2>
              <p className="mb-6 text-sm text-white/50">
                &ldquo;{deleteTarget.name}&rdquo; will be moved to trash. You won&rsquo;t see it in
                your projects anymore.
              </p>
              <div className="flex gap-3">
                <GlassButton
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  className="flex-1 !bg-red-500/20 !text-red-300 hover:!bg-red-500/30"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
