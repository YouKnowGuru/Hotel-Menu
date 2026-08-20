import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to MenuStudio to design and export professional restaurant menus.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
