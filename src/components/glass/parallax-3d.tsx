"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.3,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Floating 3D element that bobs and rotates automatically
interface Float3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  rotateRange?: number;
  floatRange?: number;
}

export function Float3D({
  children,
  className = "",
  delay = 0,
  duration = 6,
  rotateRange = 8,
  floatRange = 20,
}: Float3DProps) {
  return (
    <motion.div
      className={className}
      style={{ transformStyle: "preserve-3d" }}
      animate={{
        y: [-floatRange, floatRange, -floatRange],
        rotateX: [-rotateRange, rotateRange, -rotateRange],
        rotateY: [rotateRange, -rotateRange, rotateRange],
        rotateZ: [-rotateRange / 3, rotateRange / 3, -rotateRange / 3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Orbiting element that circles around a center point
interface OrbitProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
}

export function Orbit({
  children,
  className = "",
  radius = 120,
  duration = 20,
  delay = 0,
  reverse = false,
}: OrbitProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        rotate: reverse ? [360, 0] : [0, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: radius * 2,
        height: radius * 2,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
