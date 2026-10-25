"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { celebrate } from "./confetti";

const FACES = ["🦉", "📚", "🚀", "🎨", "⚽", "🔬", "🌍", "🎵"];

function deal() {
  return [...FACES, ...FACES]
    .map((f, i) => ({ f, id: i, r: Math.random() }))
    .sort((a, b) => a.r - b.r);
}

/** Flip-card memory game. 8 pairs, counts moves, confetti on win. */
export default function MemoryGame() {
  const [cards, setCards] = useState(() => FACES.concat(FACES).map((f, id) => ({ f, id, r: 0 })));
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  // shuffle on the client only (avoids hydration mismatch)
  useEffect(() => setCards(deal()), []);

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || done.has(cards[i].f)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].f === cards[b].f) {
        const d = new Set(done).add(cards[a].f);
        setDone(d);
        setOpen([]);
        if (d.size === FACES.length) setTimeout(celebrate, 300);
      } else setTimeout(() => setOpen([]), 800);
    }
  };

  const reset = () => {
    setCards(deal());
    setOpen([]);
    setDone(new Set());
    setMoves(0);
  };

  const won = done.size === FACES.length;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between font-display text-navy">
        <span>Moves: <b>{moves}</b></span>
        <span>Pairs: <b>{done.size}/{FACES.length}</b></span>
        <button onClick={reset} className="btn-kid bg-sun text-navy">Shuffle</button>
      </div>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((c, i) => {
          const up = open.includes(i) || done.has(c.f);
          return (
            <button key={c.id} onClick={() => flip(i)} className="aspect-square [perspective:600px]" aria-label={up ? c.f : "Hidden card"}>
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{ rotateY: up ? 180 : 0, scale: done.has(c.f) ? [1, 1.12, 1] : 1 }}
                transition={{ rotateY: { type: "spring", stiffness: 260, damping: 20 }, scale: { duration: 0.4 } }}
              >
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-sky to-lav text-2xl text-white shadow-[0_6px_0_rgba(0,0,0,0.12)] [backface-visibility:hidden]">
                  ?
                </div>
                <div className={`absolute inset-0 grid place-items-center rounded-2xl text-3xl shadow-[0_6px_0_rgba(0,0,0,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-4xl ${done.has(c.f) ? "bg-mint/30" : "bg-white"}`}>
                  {c.f}
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
      {won && (
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-5 text-center font-display text-2xl text-coral">
          You did it in {moves} moves! 🎉
        </motion.p>
      )}
    </div>
  );
}
