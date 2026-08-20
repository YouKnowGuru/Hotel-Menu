"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Zap, Crown, Building2 } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out MenuStudio",
    icon: Zap,
    gradient: "from-gray-500/20 to-slate-500/20",
    features: [
      "3 menu projects",
      "Basic templates",
      "PDF export (72 DPI)",
      "Standard fonts",
      "Community support",
    ],
    cta: "Get Started",
    ctaVariant: "default" as const,
    href: "/register",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For professional restaurants and cafes",
    icon: Sparkles,
    gradient: "from-primary-500/20 to-blue-500/20",
    popular: true,
    features: [
      "Unlimited menu projects",
      "All premium templates",
      "PDF export (300 DPI)",
      "All fonts including premium",
      "Brand kit",
      "Priority support",
      "Custom paper sizes",
      "Print bleed support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary" as const,
    href: "/register",
  },
  {
    name: "Business",
    price: "$39",
    period: "/month",
    description: "For hotel chains and restaurant groups",
    icon: Building2,
    gradient: "from-amber-500/20 to-orange-500/20",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared brand kits",
      "Bulk export",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "White-label options",
    ],
    cta: "Contact Sales",
    ctaVariant: "default" as const,
    href: "/register",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MenuStudio</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/templates" className="text-sm text-white/60 hover:text-white">Templates</Link>
            <Link href="/login" className="text-sm text-white/60 hover:text-white">Log In</Link>
            <Link href="/register">
              <GlassButton variant="primary" size="sm">Get Started</GlassButton>
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/50">
              Choose the plan that fits your restaurant. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-primary-500/25">
                    Most Popular
                  </div>
                )}
                <GlassCard
                  level={plan.popular ? 3 : 1}
                  className={cn("h-full", plan.popular && "border-primary-500/30")}
                >
                  <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${plan.gradient} p-3`}>
                    <plan.icon className="h-6 w-6 text-white/70" />
                  </div>

                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-white/40">{plan.description}</p>

                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                        <Check className="h-4 w-4 shrink-0 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}>
                    <GlassButton variant={plan.ctaVariant} className="w-full">
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </GlassButton>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-white/40">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
