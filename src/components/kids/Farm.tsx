"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { burst } from "./confetti";

// The school farm has rabbits and parrots (from the Early Years curriculum).
const ANIMALS = [
  { e: "🐇", name: "Bunny", says: "I love carrots! 🥕", fact: "Rabbits can see almost all the way around without turning their heads!" },
  { e: "🦜", name: "Parrot", says: "Hello! Hello! 👋", fact: "Parrots can learn to copy words they hear!" },
];

export function FarmFriends() {
  const [talk, setTalk] = useState<number | null>(null);
  const [fed, setFed] = useState<number[]>([0, 0]);

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:gap-6">
      {ANIMALS.map((a, i) => (
        <div key={a.name} className="relative flex flex-col items-center rounded-[2rem] bg-white p-5 shadow-[0_8px_0_rgba(0,0,0,0.08)]">
          <AnimatePresence>
            {talk === i && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="absolute -top-12 z-10 whitespace-nowrap rounded-2xl bg-navy px-4 py-2 font-display text-sm text-cream after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-navy">
                {a.says}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className="text-7xl"
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              setTalk(i);
              setFed((f) => f.map((x, j) => (j === i ? Math.min(5, x + 1) : x)));
              if (fed[i] === 4) burst(e.clientX, e.clientY);
              setTimeout(() => setTalk((t) => (t === i ? null : t)), 1600);
            }}
            aria-label={`Feed the ${a.name}`}
          >
            {a.e}
          </motion.button>
          <p className="mt-2 font-display text-xl font-semibold">{a.name}</p>
          <div className="mt-2 flex gap-1" aria-label={`${fed[i]} of 5 treats`}>
            {Array.from({ length: 5 }, (_, j) => (
              <motion.span key={j} animate={{ scale: j < fed[i] ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.35 }} className={`h-3 w-3 rounded-full ${j < fed[i] ? "bg-mint" : "bg-navy/10"}`} />
            ))}
          </div>
          {fed[i] >= 5 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-xs text-navy/70">💡 {a.fact}</motion.p>}
        </div>
      ))}
    </div>
  );
}

const STAGES = ["🟤", "🌱", "🌿", "🪴", "🌻"];
const LABELS = ["A tiny seed", "It sprouted!", "Growing leaves", "Almost there…", "A sunflower! 🎉"];

export function GrowPlant() {
  const [water, setWater] = useState(0);
  const [drops, setDrops] = useState<number[]>([]);
  const stage = Math.min(4, Math.floor(water / 3));

  const pour = (e: React.MouseEvent) => {
    if (stage === 4) return;
    const id = Date.now();
    setDrops((d) => [...d, id]);
    setTimeout(() => setDrops((d) => d.filter((x) => x !== id)), 700);
    const next = water + 1;
    setWater(next);
    if (Math.floor(next / 3) === 4) setTimeout(() => burst(e.clientX, e.clientY - 100, ["#FFC83D", "#3CC8A0", "#FF9F43"], 120), 300);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-64 w-64 items-end justify-center">
        <AnimatePresence>
          {drops.map((d) => (
            <motion.span key={d} className="absolute top-0 text-3xl" initial={{ y: 0, opacity: 1, x: (d % 40) - 20 }} animate={{ y: 140, opacity: 0 }} transition={{ duration: 0.6, ease: "easeIn" }}>
              💧
            </motion.span>
          ))}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span key={stage} className="relative z-10 mb-10 text-8xl" initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 260, damping: stage === 4 ? 7 : 14 }}>
            {STAGES[stage]}
          </motion.span>
        </AnimatePresence>
        <div className="absolute bottom-0 h-16 w-44 rounded-b-[2rem] rounded-t-lg bg-[#C8693B] shadow-[inset_0_8px_0_#a5532d]" />
      </div>
      <p className="mt-4 font-display text-2xl font-semibold">{LABELS[stage]}</p>
      <div className="mt-3 h-3 w-56 overflow-hidden rounded-full bg-navy/10">
        <motion.div className="h-full bg-mint" animate={{ width: `${Math.min(100, (water / 12) * 100)}%` }} />
      </div>
      {stage < 4 ? (
        <motion.button whileTap={{ rotate: -30 }} onClick={pour} className="btn-kid mt-5 bg-sky text-lg text-white">
          🚿 Water me!
        </motion.button>
      ) : (
        <button onClick={() => setWater(0)} className="btn-kid mt-5 bg-navy text-cream">🌰 Plant another seed</button>
      )}
    </div>
  );
}
