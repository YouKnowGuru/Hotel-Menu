import type { PaperDimensions, FontOption, TemplateCategory, MenuBadge } from "@/types";

export const PAPER_SIZES: Record<string, PaperDimensions> = {
  A5: { width: 148, height: 210, label: "A5 (148 × 210 mm)" },
  A4: { width: 210, height: 297, label: "A4 (210 × 297 mm)" },
  A3: { width: 297, height: 420, label: "A3 (297 × 420 mm)" },
  letter: { width: 216, height: 279, label: "Letter (8.5 × 11 in)" },
  legal: { width: 216, height: 356, label: "Legal (8.5 × 14 in)" },
  tabloid: { width: 279, height: 432, label: "Tabloid (11 × 17 in)" },
};

export const MM_TO_PX = 3.7795275591;
export const PX_TO_MM = 0.2645833333;
export const PRINT_DPI = 300;
export const SCREEN_DPI = 96;

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; icon: string }[] = [
  { value: "minimal", label: "Minimal", icon: "minus" },
  { value: "modern", label: "Modern", icon: "zap" },
  { value: "luxury", label: "Luxury", icon: "crown" },
  { value: "elegant", label: "Elegant", icon: "sparkles" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "vintage", label: "Vintage", icon: "clock" },
  { value: "rustic", label: "Rustic", icon: "trees" },
  { value: "cafe", label: "Cafe", icon: "coffee" },
  { value: "bakery", label: "Bakery", icon: "cake" },
  { value: "coffee", label: "Coffee", icon: "cup-soda" },
  { value: "fine-dining", label: "Fine Dining", icon: "utensils" },
  { value: "hotel", label: "Hotel", icon: "building" },
  { value: "fast-food", label: "Fast Food", icon: "burger" },
  { value: "pizza", label: "Pizza", icon: "pizza" },
  { value: "burger", label: "Burger", icon: "sandwich" },
  { value: "bbq", label: "BBQ", icon: "flame" },
  { value: "indian", label: "Indian", icon: "chef-hat" },
  { value: "chinese", label: "Chinese", icon: "soup" },
  { value: "japanese", label: "Japanese", icon: "fish" },
  { value: "bhutanese", label: "Bhutanese", icon: "mountain" },
  { value: "seasonal", label: "Seasonal", icon: "calendar" },
];

export const MENU_BADGES: { value: MenuBadge; label: string; color: string }[] = [
  { value: "NEW", label: "NEW", color: "#22c55e" },
  { value: "BEST SELLER", label: "BEST SELLER", color: "#f59e0b" },
  { value: "CHEF'S SPECIAL", label: "CHEF'S SPECIAL", color: "#ef4444" },
  { value: "SPICY", label: "SPICY", color: "#dc2626" },
  { value: "VEG", label: "VEG", color: "#16a34a" },
  { value: "VEGAN", label: "VEGAN", color: "#059669" },
  { value: "POPULAR", label: "POPULAR", color: "#8b5cf6" },
];

export const FONT_OPTIONS: FontOption[] = [
  { name: "Playfair Display", family: "'Playfair Display', serif", category: "serif", weights: [400, 500, 600, 700] },
  { name: "Inter", family: "'Inter', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
  { name: "Montserrat", family: "'Montserrat', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
  { name: "Lora", family: "'Lora', serif", category: "serif", weights: [400, 500, 600, 700] },
  { name: "Poppins", family: "'Poppins', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
  { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", category: "serif", weights: [300, 400, 500, 600, 700] },
  { name: "Raleway", family: "'Raleway', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
  { name: "Crimson Text", family: "'Crimson Text', serif", category: "serif", weights: [400, 600, 700] },
  { name: "Oswald", family: "'Oswald', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
  { name: "Merriweather", family: "'Merriweather', serif", category: "serif", weights: [300, 400, 700] },
  { name: "Source Sans Pro", family: "'Source Sans Pro', sans-serif", category: "sans-serif", weights: [300, 400, 600, 700] },
  { name: "Dancing Script", family: "'Dancing Script', cursive", category: "handwriting", weights: [400, 500, 600, 700] },
  { name: "Great Vibes", family: "'Great Vibes', cursive", category: "handwriting", weights: [400] },
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", category: "display", weights: [400] },
  { name: "Abril Fatface", family: "'Abril Fatface', serif", category: "display", weights: [400] },
];

export const GRADIENT_PRESETS = [
  { name: "Sunset", colors: ["#ff9a9e", "#fecfef"] },
  { name: "Ocean", colors: ["#667eea", "#764ba2"] },
  { name: "Forest", colors: ["#11998e", "#38ef7d"] },
  { name: "Peach", colors: ["#ffecd2", "#fcb69f"] },
  { name: "Aurora", colors: ["#00d2ff", "#3a7bd5"] },
  { name: "Warm", colors: ["#f093fb", "#f5576c"] },
  { name: "Cool", colors: ["#4facfe", "#00f2fe"] },
  { name: "Royal", colors: ["#7f00ff", "#e100ff"] },
  { name: "Gold", colors: ["#f7971e", "#ffd200"] },
  { name: "Midnight", colors: ["#232526", "#414345"] },
  { name: "Cosmic 3-Stop", colors: ["#ff007f", "#7928ca", "#00dfd8"] },
  { name: "Sunset Fire", colors: ["#ff4e50", "#f9d423", "#e100ff"] },
  { name: "Tropical Vibe", colors: ["#00c9ff", "#92fe9d", "#ffea00"] },
  { name: "Rainbow Flow", colors: ["#ff416c", "#ff4b2b", "#f9d423", "#00dfd8"] },
  { name: "Neon Luxury", colors: ["#1a0826", "#6c1387", "#e63988", "#f4a261"] },
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
];

export const EDITOR_TOOLS = [
  { id: "templates", label: "Templates", icon: "layout-template" },
  { id: "text", label: "Text", icon: "type" },
  { id: "images", label: "Images", icon: "image" },
  { id: "shapes", label: "Shapes", icon: "shapes" },
  { id: "icons", label: "Icons", icon: "smile" },
  { id: "menu-items", label: "Menu Items", icon: "utensils" },
  { id: "categories", label: "Categories", icon: "tag" },
  { id: "brand", label: "Brand", icon: "palette" },
  { id: "background", label: "Background", icon: "paintbrush" },
];

export const CANVAS_DEFAULTS = {
  zoom: { min: 0.1, max: 5, default: 1 },
  snapToGrid: { enabled: true, size: 10 },
  safeArea: { margin: 10 },
  bleed: { width: 3 },
};

/* ---------------- Menu themes for the Quick Fill generator ---------------- */

export interface MenuTheme {
  id: string;
  name: string;
  bg: string;
  title: string;
  accent: string;
  text: string;
  body: string;
  muted: string;
  divider: string;
  isDark: boolean;
  headingFont: string;
  bodyFont: string;
  /** Template categories that map to this theme. */
  categories: string[];
}

export const MENU_THEMES: MenuTheme[] = [
  { id: "minimal", name: "Minimal", bg: "#ffffff", title: "#111827", accent: "#6b7280", text: "#1f2937", body: "#4b5563", muted: "#9ca3af", divider: "#e5e7eb", isDark: false, headingFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", categories: ["minimal"] },
  { id: "modern", name: "Modern Blue", bg: "#f8fafc", title: "#0f172a", accent: "#2563eb", text: "#1e293b", body: "#334155", muted: "#94a3b8", divider: "#e2e8f0", isDark: false, headingFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", categories: ["modern"] },
  { id: "elegant", name: "Elegant Cream", bg: "#fefce8", title: "#1c1917", accent: "#b45309", text: "#292524", body: "#57534e", muted: "#a8a29e", divider: "#e7e5d8", isDark: false, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["elegant"] },
  { id: "luxury", name: "Luxury Gold", bg: "#0b1220", title: "#e8c878", accent: "#c9a96e", text: "#f3ecd9", body: "#c9bca0", muted: "#8a7c5e", divider: "rgba(201,169,110,0.25)", isDark: true, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["luxury", "fine-dining", "hotel"] },
  { id: "dark", name: "Midnight", bg: "#0f172a", title: "#f1f5f9", accent: "#a78bfa", text: "#e2e8f0", body: "#cbd5e1", muted: "#64748b", divider: "rgba(148,163,184,0.20)", isDark: true, headingFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", categories: ["dark"] },
  { id: "vintage", name: "Vintage", bg: "#f7eedd", title: "#4b3b2a", accent: "#92400e", text: "#3f3024", body: "#6b5b4a", muted: "#a89878", divider: "#e0d2b6", isDark: false, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["vintage", "rustic"] },
  { id: "cafe", name: "Cafe Warm", bg: "#fff7ed", title: "#431407", accent: "#c2410c", text: "#431407", body: "#7c2d12", muted: "#c4a484", divider: "#fed7aa", isDark: false, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["cafe", "bakery"] },
  { id: "coffee", name: "Coffee Roastery", bg: "#1a120b", title: "#f0e4d0", accent: "#b08968", text: "#e6d7c0", body: "#c4b091", muted: "#8a7558", divider: "rgba(176,137,104,0.25)", isDark: true, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["coffee"] },
  { id: "bold", name: "Bold Street", bg: "#111827", title: "#fbbf24", accent: "#f59e0b", text: "#f3f4f6", body: "#d1d5db", muted: "#6b7280", divider: "rgba(245,158,11,0.25)", isDark: true, headingFont: "'Bebas Neue', sans-serif", bodyFont: "'Inter', sans-serif", categories: ["fast-food", "burger", "pizza", "bbq"] },
  { id: "saffron", name: "Saffron Spice", bg: "#fff8eb", title: "#7c2d12", accent: "#ea580c", text: "#431407", body: "#7c2d12", muted: "#c2410c", divider: "#fed7aa", isDark: false, headingFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", categories: ["indian", "chinese", "japanese"] },
  { id: "garden", name: "Garden Fresh", bg: "#f0fdf4", title: "#14532d", accent: "#16a34a", text: "#14532d", body: "#166534", muted: "#86efac", divider: "#bbf7d0", isDark: false, headingFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", categories: ["seasonal"] },
  { id: "druk", name: "Druk (Bhutanese)", bg: "#fbf3e2", title: "#7a1f1f", accent: "#d4a017", text: "#5b2a2a", body: "#7a4533", muted: "#a16207", divider: "rgba(212,160,23,0.35)", isDark: false, headingFont: "'Playfair Display', serif", bodyFont: "'Lora', serif", categories: ["bhutanese"] },
];

/** Find the best-matching theme id for a template category. */
export function getThemeByCategory(category: string): string {
  const t = MENU_THEMES.find((th) => th.categories.includes(category));
  return t?.id ?? "elegant";
}
