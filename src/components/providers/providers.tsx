"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { AnimatedBackground } from "@/components/glass/animated-background";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
