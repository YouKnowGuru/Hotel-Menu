"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "primary" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses = {
  default: "glass hover:bg-white/15",
  ghost: "bg-transparent border-transparent hover:bg-white/10",
  outline: "glass border-white/20 hover:bg-white/10",
  primary:
    "bg-gradient-to-r from-primary-500/80 to-blue-500/80 border border-primary-400/30 hover:from-primary-500 hover:to-blue-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]",
  destructive:
    "bg-gradient-to-r from-red-500/80 to-red-600/80 border border-red-400/30 hover:from-red-500 hover:to-red-600",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-xl",
};

export function GlassButton({
  variant = "default",
  size = "md",
  asChild = false,
  className,
  children,
  ...props
}: GlassButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 active:scale-[0.98]",
        "text-white/90 hover:text-white",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
