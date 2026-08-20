"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, History, Loader2, RotateCcw, Save, Trash2 } from "lucide-react";
import { GlassButton } from "@/components/glass/glass-button";
import { toast } from "@/components/ui/toaster";

interface Version {
    name: string;
    canvasData: unknown;
    createdAt: string;
}

interface VersionHistoryModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    getCanvasJSON: () => string;
    onLoadVersion: (canvasData: string) => void;
}

export function VersionHistoryModal({
    open,
    onClose,
    projectId,
    getCanvasJSON,
    onLoadVersion,
}: VersionHistoryModalProps) {
    const [versions, setVersions] = useState<Version[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [versionName, setVersionName] = useState("");

    useEffect(() => {
        if (!open) return;
        setIsLoading(true);
        fetch(`/api/projects/${projectId}/versions`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setVersions(d.data || []);
            })
            .catch(() => toast.error("Failed to load versions"))
            .finally(() => setIsLoading(false));
    }, [open, projectId]);

    const handleSaveVersion = async () => {
        const json = getCanvasJSON();
        if (!json) {
            toast.error("Nothing to save");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/versions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: versionName || `Version ${new Date().toLocaleString()}`,
                    canvasData: JSON.parse(json),
                }),
            });

            const data = await res.json();
            if (data.success) {
                setVersions(data.data || []);
                setVersionName("");
                toast.success("Version saved");
            } else {
                toast.error(data.error || "Failed to save version");
            }
        } catch {
            toast.error("Failed to save version");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestore = (version: Version) => {
        onLoadVersion(JSON.stringify(version.canvasData));
        toast.success(`Restored "${version.name}"`);
        onClose();
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                aria-label="Version history"
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-strong relative z-10 mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-3xl p-6"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                            <History className="h-5 w-5 text-primary-400" />
                            Version History
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close version history"
                            className="rounded-lg p-2 text-white/40 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Save new version */}
                    <div className="mb-4 flex gap-2">
                        <input
                            type="text"
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                            placeholder="Version name (optional)"
                            className="glass-input flex-1 px-3 py-2 text-sm"
                            aria-label="Version name"
                        />
                        <GlassButton
                            variant="primary"
                            size="sm"
                            onClick={handleSaveVersion}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save
                        </GlassButton>
                    </div>

                    {/* Version list */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                            </div>
                        ) : versions.length === 0 ? (
                            <div className="py-8 text-center">
                                <History className="mx-auto mb-2 h-8 w-8 text-white/20" />
                                <p className="text-sm text-white/40">
                                    No versions yet. Save a version to create a restore point.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {[...versions].reverse().map((version, index) => (
                                    <div
                                        key={index}
                                        className="glass flex items-center justify-between rounded-xl p-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-white/80">
                                                {version.name}
                                            </p>
                                            <p className="text-xs text-white/40">
                                                {new Date(version.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <GlassButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRestore(version)}
                                            aria-label={`Restore ${version.name}`}
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Restore
                                        </GlassButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-center text-[10px] text-white/30">
                        Last 20 versions are kept automatically
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}