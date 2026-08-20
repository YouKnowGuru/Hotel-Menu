"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
}

export function AnimatedBackground() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generated: Orb[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 400,
      color: [
        "rgba(139, 92, 246, 0.15)",
        "rgba(59, 130, 246, 0.12)",
        "rgba(244, 114, 182, 0.1)",
        "rgba(34, 197, 94, 0.08)",
        "rgba(251, 191, 36, 0.08)",
        "rgba(168, 85, 247, 0.12)",
      ][i],
      speed: 0.3 + Math.random() * 0.5,
      opacity: 0.4 + Math.random() * 0.3,
    }));
    setOrbs(generated);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setMousePos({
              x: (e.clientX - rect.left) / rect.width,
              y: (e.clientY - rect.top) / rect.height,
            });
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            filter: "blur(80px)",
            opacity: orb.opacity,
          }}
          animate={{
            x: [
              `${orb.x}%`,
              `${orb.x + 10 * orb.speed}%`,
              `${orb.x - 5 * orb.speed}%`,
              `${orb.x}%`,
            ],
            y: [
              `${orb.y}%`,
              `${orb.y - 8 * orb.speed}%`,
              `${orb.y + 6 * orb.speed}%`,
              `${orb.y}%`,
            ],
          }}
          transition={{
            duration: 20 + orb.id * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: `${mousePos.x * 30 - 15}%`,
          y: `${mousePos.y * 30 - 15}%`,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.01) 50px, rgba(255,255,255,0.01) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.01) 50px, rgba(255,255,255,0.01) 51px)",
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(244, 114, 182, 0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
