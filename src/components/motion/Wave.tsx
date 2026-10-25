"use client";

import { motion } from "framer-motion";

const A = "M0,64 C240,120 480,8 720,56 C960,104 1200,16 1440,60 L1440,120 L0,120 Z";
const B = "M0,52 C240,10 480,110 720,64 C960,18 1200,100 1440,48 L1440,120 L0,120 Z";

/** Gently moving wavy divider. `fill` is the colour of the section below. */
export default function Wave({ fill, flip = false, className = "" }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden className={`block h-12 w-full sm:h-20 ${flip ? "rotate-180" : ""} ${className}`}>
      <motion.path fill={fill} animate={{ d: [A, B, A] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
    </svg>
  );
}
