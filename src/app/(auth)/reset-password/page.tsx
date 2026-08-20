"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Lock, Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setDone(true);
      } else {
        setError(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="py-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-white">Invalid Link</h3>
        <p className="text-sm text-white/50">
          This password reset link is missing its token. Please request a new reset link.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm text-primary-400 hover:text-primary-300"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-8 w-8 text-green-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">Password Updated</h3>
        <p className="text-sm text-white/50">
          Your password has been changed successfully.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary-400 hover:text-primary-300">
          Continue to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="new-password" className="block text-sm font-medium text-white/70">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            maxLength={128}
            required
            autoComplete="new-password"
            className="glass-input w-full pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-white/70">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            minLength={6}
            maxLength={128}
            required
            autoComplete="new-password"
            className="glass-input w-full pl-10"
          />
        </div>
      </div>

      <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
      </GlassButton>

      <div className="text-center">
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/70">
          <ArrowLeft className="h-3 w-3" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MenuStudio</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Set a New Password</h1>
          <p className="mt-2 text-sm text-white/50">
            Choose a strong password for your account
          </p>
        </div>

        <GlassCard level={3} className="p-8">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </GlassCard>
      </motion.div>
    </div>
  );
}
