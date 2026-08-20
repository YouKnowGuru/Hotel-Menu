"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
  depth?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  depth = 30,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);

  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{ duration: 0.2 }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? `translateZ(${depth}px)` : "translateZ(0px)",
          transition: "transform 0.2s ease-out",
        }}
        className="h-full w-full"
      >
        {children}
      </div>

      {/* Specular Glare Reflection Layer */}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 -z-0 rounded-[inherit] overflow-hidden opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 350px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.4), transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
}
