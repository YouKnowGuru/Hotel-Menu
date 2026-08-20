"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Palette,
  Settings,
  Info,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { GlassButton } from "@/components/glass/glass-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "My Projects", icon: FolderOpen },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/brand-kit", label: "Brand Kit", icon: Palette },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="glass fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5"
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-white"
            >
              MenuStudio
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="px-3 py-3">
        <Link href="/editor/new">
          <GlassButton variant="primary" className="w-full" size="sm">
            <Plus className="h-4 w-4" />
            {!collapsed && <span>New Menu</span>}
          </GlassButton>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-500/20 text-primary-300"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3 space-y-2">
        {!collapsed && session?.user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/30 text-sm font-bold text-primary-300">
              {session.user.name?.[0] || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white/80">{session.user.name}</p>
              <p className="truncate text-xs text-white/40">{session.user.email}</p>
            </div>
          </div>
        )}

        <ThemeToggle collapsed={collapsed} />

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-white/30 transition-colors hover:bg-white/5 hover:text-white/50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
