"use client";

import { motion } from "framer-motion";
import { aim, mission, ticker, vision } from "@/data/content";
import Reveal from "./motion/Reveal";
import Tilt from "./motion/Tilt";

function Ticker() {
  const items = [...ticker, ...ticker];
  return (
    <div className="marquee relative -rotate-1 overflow-hidden bg-gold py-4">
      <div className="marquee-track flex w-max gap-8 font-display text-xl font-semibold text-navy sm:text-2xl">
        {items.map((t, i) => (
          <span key={i} aria-hidden={i >= ticker.length} className="flex items-center gap-8 whitespace-nowrap">
            {t} <span className="text-coral">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Aim() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream pb-28">
      <Ticker />
      <div className="mx-auto max-w-7xl px-5 pt-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow">{aim.eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-6xl">
              Thinkers. <span className="italic text-gold">People of purpose.</span> Future leaders.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-navy/75">{aim.body}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {aim.pillars.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12}>
              <Tilt className="h-full rounded-[2rem]">
                <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(11,25,44,0.35)]">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 transition-transform duration-700 group-hover:scale-[2.4]" style={{ background: p.color }} />
                  <motion.div whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }} className="relative grid h-16 w-16 place-items-center rounded-2xl text-3xl" style={{ background: `${p.color}26` }}>
                    {p.icon}
                  </motion.div>
                  <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: p.color }}>
                    {p.tag}
                  </p>
                  <h3 className="relative mt-2 font-serif text-3xl">{p.name}</h3>
                  <p className="relative mt-3 leading-relaxed text-navy/70">{p.body}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          {[
            ["Our vision", vision, "🔭"],
            ["Our mission", mission, "🧭"],
          ].map(([t, b, e], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-4 rounded-[2rem] border-2 border-dashed border-navy/15 p-7 sm:flex-row sm:gap-5 sm:p-8">
                <span className="text-4xl">{e}</span>
                <div>
                  <p className="eyebrow">{t}</p>
                  <p className="mt-3 font-serif text-xl leading-snug">{b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
