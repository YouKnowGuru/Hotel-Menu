import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about MenuStudio — the premium menu creator for restaurants, cafes, and hotels.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
