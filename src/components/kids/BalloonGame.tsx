"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { celebrate } from "./confetti";

const BalloonPop = dynamic(() => import("../three/BalloonPop"), { ssr: false });
const TIME = 30;

/** 30-second 3D balloon pop. Gold balloons are worth 5. */
export default function BalloonGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem("tw-balloon-best") || 0));
    } catch {}
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (left <= 0) {
      setPlaying(false);
      setOver(true);
      if (score > best) {
        setBest(score);
        try {
          localStorage.setItem("tw-balloon-best", String(score));
        } catch {}
        celebrate();
      }
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [playing, left, score, best]);

  const start = () => {
    setScore(0);
    setLeft(TIME);
    setOver(false);
    setPlaying(true);
  };

  return (
    <div className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#7cc8ff] via-[#b8e3ff] to-[#fff3d6] shadow-[0_20px_50px_-25px_rgba(0,0,0,0.4)]">
      {/* hills */}
      <div className="absolute -bottom-20 -left-10 h-48 w-[60%] rounded-[50%] bg-[#8BD17C]" />
      <div className="absolute -bottom-24 right-[-10%] h-56 w-[70%] rounded-[50%] bg-[#6fc263]" />
      <BalloonPop playing={playing} onScore={(n) => { setScore((s) => s + n); setBump((b) => b + 1); }} />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-display">
        <motion.div key={bump} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="rounded-2xl bg-white px-4 py-2 text-2xl font-bold shadow">
          🎈 {score}
        </motion.div>
        <div className="rounded-2xl bg-white px-4 py-2 text-center shadow">
          <p className={`text-2xl font-bold ${left <= 5 && playing ? "text-coral" : ""}`}>⏱️ {left}s</p>
          <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-navy/10">
            <motion.div className="h-full bg-mint" animate={{ width: `${(left / TIME) * 100}%` }} transition={{ ease: "linear", duration: 1 }} />
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-2 text-lg font-semibold shadow">🏆 {best}</div>
      </div>

      <AnimatePresence>
        {!playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="absolute inset-0 grid place-items-center bg-navy/30 backdrop-blur-[2px]">
            <motion.div initial={{ scale: 0.6, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 12 }} className="mx-4 max-w-sm rounded-[2rem] bg-white p-8 text-center font-display shadow-2xl">
              <p className="text-6xl">{over ? (score >= best && score > 0 ? "🏆" : "🎉") : "🎈"}</p>
              <h3 className="mt-3 text-3xl font-bold">{over ? `You popped ${score}!` : "Balloon Pop!"}</h3>
              <p className="mt-2 text-navy/70">{over ? (score >= best && score > 0 ? "New high score! Amazing!" : `Best: ${best}. Try again?`) : "Pop as many balloons as you can in 30 seconds. Golden ones are worth 5!"}</p>
              <button onClick={start} className="btn-kid mt-6 bg-coral px-8 py-3 text-xl text-white">{over ? "Play again" : "Start!"}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
