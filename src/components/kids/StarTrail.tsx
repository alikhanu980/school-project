"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GLYPHS = ["⭐", "✨", "💫", "🌟"];

/** Sparkly cursor trail for the Kids Zone. Mouse only, off for reduced motion. */
export default function StarTrail() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; g: string }[]>([]);
  const id = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last.current < 45) return;
      last.current = now;
      const s = { id: id.current++, x: e.clientX, y: e.clientY, g: GLYPHS[id.current % GLYPHS.length] };
      setStars((xs) => [...xs.slice(-11), s]);
      setTimeout(() => setStars((xs) => xs.filter((x) => x.id !== s.id)), 700);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <AnimatePresence>
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute text-lg"
            style={{ left: s.x, top: s.y }}
            initial={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            animate={{ opacity: 0, scale: 0.2, y: 30, rotate: 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {s.g}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
