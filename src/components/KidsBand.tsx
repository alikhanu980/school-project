"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Lion from "./kids/Lion";
import { burst } from "./kids/confetti";

const STICKERS = [
  { e: "⚽", x: "8%", y: "18%", r: -12 },
  { e: "🎨", x: "85%", y: "14%", r: 10 },
  { e: "🐇", x: "12%", y: "72%", r: 8 },
  { e: "🤖", x: "88%", y: "70%", r: -8 },
  { e: "🌱", x: "50%", y: "8%", r: 0 },
  { e: "🦜", x: "70%", y: "85%", r: 12 },
];

export default function KidsBand() {
  return (
    <section className="relative overflow-hidden bg-sun py-24 text-navy">
      {STICKERS.map((s, i) => (
        <motion.button
          key={i}
          drag
          dragSnapToOrigin
          whileDrag={{ scale: 1.4 }}
          whileHover={{ scale: 1.25, rotate: 0 }}
          onClick={(e) => burst(e.clientX, e.clientY)}
          className="absolute z-10 grid h-16 w-16 cursor-grab place-items-center rounded-full bg-white text-3xl shadow-[0_6px_0_rgba(0,0,0,0.12)] active:cursor-grabbing sm:h-20 sm:w-20 sm:text-4xl"
          style={{ left: s.x, top: s.y, rotate: s.r }}
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 + i * 0.3 }}
          aria-label="Sticker"
        >
          {s.e}
        </motion.button>
      ))}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center">
        <Lion size={200} />
        <h2 className="mt-4 font-display text-5xl font-bold leading-none sm:text-7xl">
          Hey kids! <span className="inline-block wiggle">👋</span>
        </h2>
        <p className="mt-4 max-w-xl font-display text-xl font-medium">
          I&apos;m <b>Sheru</b>, the Think Well lion cub! Tap me, drag the stickers, then come play in the Kids Zone.
        </p>
        <Link href="/kids" className="btn-kid mt-8 bg-navy px-8 py-4 text-xl text-cream">
          Enter the Kids Zone 🚀
        </Link>
      </div>
    </section>
  );
}
