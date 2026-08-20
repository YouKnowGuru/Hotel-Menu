"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { AnimatedBackground } from "@/components/glass/animated-background";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AuthSlider } from "@/components/auth/auth-slider";

interface AuthContainerProps {
  initialMode?: "login" | "register";
}

export function AuthContainer({ initialMode = "login" }: AuthContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [notice, setNotice] = useState("");

  // Register State
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Verification redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    if (verified === "1") {
      setNotice("Email verified successfully! You can sign in now.");
    } else if (verified === "0") {
      setLoginError("This verification link is invalid or has already expired.");
    }
  }, []);

  // Compute password strength
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9!@#$%^&*]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(registerPassword);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-emerald-500"];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email or password. Please check your credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");

    if (!agreeTerms) {
      setRegisterError("Please accept the terms and conditions to proceed.");
      setRegisterLoading(false);
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match. Please verify both fields.");
      setRegisterLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must contain at least 6 characters.");
      setRegisterLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: registerEmail, password: registerPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterError(data.error || "Registration failed. Please try again.");
        return;
      }

      const result = await signIn("credentials", {
        email: registerEmail,
        password: registerPassword,
        redirect: false,
      });

      if (result?.error) {
        setMode("login");
        setNotice("Account created! Please sign in.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setRegisterError("Something went wrong. Please check your connection and try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Dynamic Background Atmosphere */}
      <AnimatedBackground />

      {/* Floating Header Actions (Back Home & Theme Toggle) */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-7xl mx-auto pointer-events-none">
        <Link
          href="/"
          className="glass pointer-events-auto inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="pointer-events-auto">
          <ThemeToggle variant="icon" />
        </div>
      </div>

      {/* Main Split-Screen Auth Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden p-0 shadow-2xl lg:grid-cols-12 rounded-3xl border border-white/15"
      >
        {/* Left Form Column */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 xl:col-span-6">
          <div>
            {/* Top Brand Logo & Mode Switcher Pill */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-600 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">MenuStudio</span>
              </Link>

              {/* Sliding Mode Switcher Pill */}
              <div className="glass-light flex rounded-xl p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    mode === "login"
                      ? "bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    mode === "register"
                      ? "bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Sliding Form Container */}
            <div className="relative mt-7 overflow-hidden min-h-[460px]">
              <AnimatePresence mode="wait" initial={false}>
                {mode === "login" ? (
                  /* ================= LOGIN FORM SLIDE ================= */
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Welcome Back
                      </h1>
                      <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                        Sign in to manage your hotel menus, table QR codes, and brand kits.
                      </p>
                    </div>

                    {/* Notification & Error Banners */}
                    {notice && (
                      <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{notice}</span>
                      </div>
                    )}

                    {loginError && (
                      <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
                      {/* Email Input with Non-Overlapping Icon */}
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
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="manager@hotel.bt"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "1rem" }}
                          />
                        </div>
                      </div>

                      {/* Password Input with Non-Overlapping Icons */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            aria-label={showLoginPassword ? "Hide password" : "Show password"}
                            className="absolute right-3.5 z-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] hover:shadow-amber-500/40 disabled:opacity-50"
                      >
                        {loginLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <span>Sign In to Studio</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Social Login */}
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] uppercase tracking-wider text-white/30">or continue with</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="glass-button w-full inline-flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-xs font-semibold text-white/90"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <p className="mt-5 text-center text-xs text-white/50">
                      Need a new hotel account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Create account free →
                      </button>
                    </p>
                  </motion.div>
                ) : (
                  /* ================= REGISTER FORM SLIDE ================= */
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                        <ShieldCheck className="h-3 w-3" />
                        Free 14-Day Full Hospitality Access
                      </div>
                      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Create Your Account
                      </h1>
                      <p className="mt-1 text-xs text-white/60">
                        Start designing press-ready Bhutanese hotel menus & QR codes today.
                      </p>
                    </div>

                    {registerError && (
                      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400 shrink-0" />
                        <span>{registerError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
                      {/* Name Input with Non-Overlapping Icon */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                          Full / Manager Name
                        </label>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Karma Tshering"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.55rem", paddingBottom: "0.55rem" }}
                          />
                        </div>
                      </div>

                      {/* Work Email with Non-Overlapping Icon */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                          Work Email
                        </label>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            placeholder="manager@resort.bt"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.55rem", paddingBottom: "0.55rem" }}
                          />
                        </div>
                      </div>

                      {/* Password with Non-Overlapping Icons */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                          Password
                        </label>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            type={showRegisterPassword ? "text" : "password"}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem", paddingTop: "0.55rem", paddingBottom: "0.55rem" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                            className="absolute right-3.5 z-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                          >
                            {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {registerPassword.length > 0 && (
                          <div className="flex items-center justify-between text-[10px] text-white/50 pt-0.5">
                            <div className="flex gap-1 h-1 w-20">
                              {[0, 1, 2, 3].map((step) => (
                                <div
                                  key={step}
                                  className={`flex-1 rounded-full ${
                                    strength > step ? strengthColors[strength - 1] : "bg-white/10"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>Strength: {strengthLabels[Math.max(0, strength - 1)]}</span>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password with Non-Overlapping Icon */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                          Confirm Password
                        </label>
                        <div className="relative flex items-center">
                          <div className="pointer-events-none absolute left-3.5 z-10 flex items-center justify-center text-white/40">
                            <Lock className="h-4 w-4" />
                          </div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            required
                            className="glass-input w-full text-sm"
                            style={{ paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.55rem", paddingBottom: "0.55rem" }}
                          />
                        </div>
                      </div>

                      <div className="pt-0.5">
                        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-amber-500"
                          />
                          <span className="text-[11px]">I agree to the Terms of Service & Privacy Policy</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={registerLoading}
                        className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] hover:shadow-amber-500/40 disabled:opacity-50"
                      >
                        {registerLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <span>Create Free Account</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-white/50">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Sign in instead →
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Slider Showcase Column */}
        <div className="hidden border-l border-white/10 bg-black/40 lg:block lg:col-span-6 xl:col-span-6">
          <AuthSlider />
        </div>
      </motion.div>
    </div>
  );
}
