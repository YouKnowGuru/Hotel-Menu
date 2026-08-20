"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4;
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const levelClasses = {
  1: "glass",
  2: "glass-light",
  3: "glass-medium",
  4: "glass-strong",
};

export function GlassCard({
  level = 1,
  hover = false,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        levelClasses[level],
        hover && "glass-card cursor-pointer",
        glow && "glass-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
