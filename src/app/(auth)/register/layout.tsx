import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free MenuStudio account and start designing restaurant menus in minutes.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
