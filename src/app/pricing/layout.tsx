import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for MenuStudio — start free, upgrade for premium templates and print-quality exports.",
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
