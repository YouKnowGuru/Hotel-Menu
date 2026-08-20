import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set a New Password",
  description: "Choose a new password for your MenuStudio account.",
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
