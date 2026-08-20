"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Trash2, Save, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { toast } from "@/components/ui/toaster";

interface Profile {
  name: string;
  email: string;
  image?: string;
  provider?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProfile(d.data);
          setName(d.data.name);
          setEmail(d.data.email);
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const d = await res.json();
      if (d.success) {
        setProfile(d.data);
        toast.success("Profile updated");
      } else {
        toast.error(d.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const d = await res.json();
      if (d.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed");
      } else {
        toast.error(d.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Account deleted");
        window.location.href = "/login";
      } else {
        toast.error(d.error || "Failed to delete account");
      }
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Account</h1>
          <p className="mt-2 text-white/50">Manage your profile and account settings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <GlassCard level={2} className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Profile Info</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-white/60">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-white/60">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              {profile && (
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <span>
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                  {profile.provider && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      {profile.provider}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <GlassButton variant="primary" size="md" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </GlassButton>
            </div>
          </GlassCard>

          <GlassCard level={2} className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-white/60">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-white/60">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-white/60">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <GlassButton
                variant="primary"
                size="md"
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {changingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Change Password
              </GlassButton>
            </div>
          </GlassCard>

          <GlassCard level={2} className="border-red-500/20 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
            </div>

            <p className="mb-4 text-sm text-white/50">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <GlassButton
                variant="destructive"
                size="md"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </GlassButton>
            ) : (
              <div className="flex items-center gap-3">
                <GlassButton
                  variant="destructive"
                  size="md"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Confirm Delete
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="md"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </GlassButton>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
