"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { SPOTS, type Spot } from "@/data/spots";
import Reveal from "./motion/Reveal";

const CampusIsland = dynamic(() => import("./three/CampusIsland"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center font-display text-xl text-navy/40">Building the campus… 🏗️</div>,
});

/** Explorable 3D diorama of the campus. Spin it, tap a pin, the camera flies there. */
export default function Campus3D() {
  const [active, setActive] = useState<Spot | null>(null);
  const pins = useRef<(HTMLElement | null)[]>([]);

  return (
    <section className="relative overflow-hidden bg-paper pb-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Explore in 3D</p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">
              Take a tour of <span className="italic text-gold">our little world.</span>
            </h2>
          </div>
          <p className="max-w-sm text-navy/70">Drag to spin the campus. Tap a pin to fly in and see what happens there.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-10 h-[70vh] min-h-[460px] overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-50px_rgba(11,25,44,0.6)]">
            <CampusIsland active={active} onPick={setActive} pins={pins} />

            {/* hotspot pins, positioned every frame by the 3D scene */}
            {SPOTS.map((s, i) => {
              const on = active?.id === s.id;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    pins.current[i] = el;
                  }}
                  onClick={() => setActive(on ? null : s)}
                  aria-label={s.name}
                  className={`group absolute left-0 top-0 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-2 py-1 font-display text-sm font-semibold opacity-0 shadow-lg transition-[background,color,opacity] ${on ? "border-white bg-gold text-navy" : "border-gold bg-navy text-cream"}`}
                >
                  {!on && <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-gold/40" />}
                  <span className="text-base">{s.emoji}</span>
                  <span className={on ? "inline" : "hidden group-hover:inline"}>{s.name}</span>
                </button>
              );
            })}

            {/* quick-jump chips */}
            <div className="absolute inset-x-0 top-0 flex gap-2 overflow-x-auto p-4 [scrollbar-width:none]">
              {SPOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(active?.id === s.id ? null : s)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold backdrop-blur transition ${active?.id === s.id ? "bg-navy text-cream" : "bg-white/70 text-navy hover:bg-white"}`}
                >
                  {s.emoji} <span className="hidden sm:inline">{s.name}</span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="absolute bottom-4 left-4 right-4 rounded-3xl bg-navy/90 p-6 text-cream backdrop-blur-md sm:left-auto sm:w-96"
                >
                  <button onClick={() => setActive(null)} aria-label="Back to overview" className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10">×</button>
                  <span className="text-4xl">{active.emoji}</span>
                  <h3 className="mt-2 font-serif text-2xl">{active.name}</h3>
                  <p className="mt-2 text-cream/75">{active.body}</p>
                  <button onClick={() => setActive(null)} className="mt-4 text-sm font-bold text-gold">← Back to the whole campus</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
