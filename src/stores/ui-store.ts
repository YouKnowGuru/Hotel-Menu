import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeTool: string | null;
  activeModal: string | null;
  theme: "light" | "dark";
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveTool: (tool: string | null) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  activeTool: null,
  activeModal: null,
  theme: "dark",
  isMobile: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setActiveTool: (tool) => set({ activeTool: tool }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", theme === "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      try {
        localStorage.setItem("menustudio-theme", theme);
      } catch {
        /* storage unavailable */
      }
    }
  },
  setIsMobile: (isMobile) => set({ isMobile }),
}));
