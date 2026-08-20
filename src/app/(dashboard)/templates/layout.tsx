import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Templates",
  description:
    "Browse 20+ professionally designed restaurant menu templates — fine dining, cafe, bakery, fast food, and more. Customize and export in print quality.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
