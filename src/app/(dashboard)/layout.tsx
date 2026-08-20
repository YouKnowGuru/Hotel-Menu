"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="ml-[260px] min-w-0 flex-1 transition-all duration-300 max-md:ml-0">
        {children}
      </main>
    </div>
  );
}
