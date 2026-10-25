"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const KEYS = [
  { note: "C", f: 523.25, c: "#FF6B5B", k: "a" },
  { note: "D", f: 587.33, c: "#FF9F43", k: "s" },
  { note: "E", f: 659.25, c: "#FFC83D", k: "d" },
  { note: "F", f: 698.46, c: "#3CC8A0", k: "f" },
  { note: "G", f: 783.99, c: "#5AB4F0", k: "g" },
  { note: "A", f: 880.0, c: "#7C8CFF", k: "h" },
  { note: "B", f: 987.77, c: "#B79CFF", k: "j" },
  { note: "C", f: 1046.5, c: "#FF8FC7", k: "k" },
];

// "Twinkle twinkle": C C G G A A G
const SONG = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];

/** Rainbow xylophone: synthesised with WebAudio, no audio files. Keyboard A–K works too. */
export default function Xylophone() {
  const ctx = useRef<AudioContext | null>(null);
  const [hit, setHit] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [learn, setLearn] = useState(false);

  const play = (i: number) => {
    ctx.current ??= new AudioContext();
    const a = ctx.current;
    const t = a.currentTime;
    // bell-ish: fundamental + bright overtone
    [1, 3.98].forEach((m, j) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = "sine";
      o.frequency.value = KEYS[i].f * m;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(j ? 0.06 : 0.3, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (j ? 0.25 : 1.1));
      o.connect(g).connect(a.destination);
      o.start(t);
      o.stop(t + 1.2);
    });
    setHit(i);
    setTimeout(() => setHit((h) => (h === i ? null : h)), 160);
    if (learn) setStep((s) => (SONG[s] === i ? (s + 1) % SONG.length : s));
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const i = KEYS.findIndex((k) => k.k === e.key.toLowerCase());
      if (i >= 0 && !e.repeat) play(i);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  });

  return (
    <div>
      <div className="flex items-end justify-center gap-1.5 sm:gap-3" role="group" aria-label="Xylophone">
        {KEYS.map((k, i) => {
          const glow = learn && SONG[step] === i;
          return (
            <motion.button
              key={i}
              onPointerDown={() => play(i)}
              animate={hit === i ? { y: 8, scaleY: 0.94 } : { y: 0, scaleY: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 12 }}
              whileHover={{ y: -6 }}
              aria-label={`Note ${k.note}`}
              className="relative flex w-9 items-end justify-center rounded-2xl pb-3 font-display text-lg font-bold text-white shadow-[0_8px_0_rgba(0,0,0,0.15)] sm:w-16 sm:text-2xl"
              style={{ background: k.c, height: 210 - i * 14 }}
            >
              <span className="absolute left-1/2 top-4 h-3 w-3 -translate-x-1/2 rounded-full bg-white/70" />
              <span className="absolute bottom-10 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/70" />
              {k.note}
              {glow && <motion.span layoutId="xglow" className="absolute -top-8 text-2xl">⬇️</motion.span>}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button onClick={() => { setLearn((l) => !l); setStep(0); }} className="btn-kid bg-navy text-white">
          {learn ? "Stop lesson" : "🎵 Teach me Twinkle Twinkle"}
        </button>
        <span className="text-navy/60">or press keys A S D F G H J K</span>
      </div>
    </div>
  );
}
