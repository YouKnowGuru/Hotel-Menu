"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { AnimatedBackground } from "@/components/glass/animated-background";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setSent(true);
      } else {
        setError(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 text-white">
      {/* Dynamic Background Atmosphere */}
      <AnimatedBackground />

      {/* Floating Header Controls */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-7xl mx-auto pointer-events-none">
        <Link
          href="/login"
          className="glass pointer-events-auto inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="pointer-events-auto">
          <ThemeToggle variant="icon" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card relative z-10 w-full max-w-md p-8 sm:p-10 shadow-2xl rounded-3xl border border-white/15"
      >
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white">Reset Password</h1>
          <p className="mt-1.5 text-xs text-white/60">
            Enter your work email address to receive a recovery link.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              We&apos;ve sent a password reset link to <strong className="text-amber-300">{email}</strong>.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white/10 py-3 text-xs font-semibold text-white hover:bg-white/15 transition-colors"
            >
              Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@hotel.bt"
                  required
                  className="glass-input w-full text-sm"
                  style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] hover:shadow-amber-500/40 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Instructions"
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-white/50 hover:text-white transition-colors">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
