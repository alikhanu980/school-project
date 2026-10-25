"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AGE_GROUPS, programmes } from "@/data/content";
import Reveal from "./motion/Reveal";
import { useApply } from "./Providers";

/** The five practical programmes: pick one, then slide the age to see how it grows. */
export default function Curriculum() {
  const [p, setP] = useState(0);
  const [age, setAge] = useState(0);
  const apply = useApply();
  const prog = programmes[p];

  return (
    <section id="curriculum" className="relative overflow-hidden bg-cream py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The practical curriculum</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-6xl">
            Real experiences that turn lessons into <span className="italic text-gold">understanding.</span>
          </h2>
          <p className="mt-4 text-navy/70">Five programmes run through the whole school, growing in ambition as our students do.</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* programme picker */}
          <div className="flex flex-col gap-3">
            {programmes.map((x, i) => (
              <button
                key={x.n}
                onClick={() => setP(i)}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl p-4 text-left transition ${p === i ? "text-navy" : "bg-white/60 text-navy/70 hover:bg-white"}`}
              >
                {p === i && <motion.span layoutId="prog-bg" className="absolute inset-0 rounded-3xl" style={{ background: x.color }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-sm transition group-hover:scale-110">{x.emoji}</span>
                <span className="relative">
                  <span className="block text-xs font-bold opacity-60">{x.n}</span>
                  <span className="block font-serif text-xl leading-tight">{x.name}</span>
                </span>
              </button>
            ))}
          </div>

          {/* detail */}
          <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-navy p-8 text-cream sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={p} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <motion.span className="absolute -right-6 -top-6 text-[10rem] opacity-15" animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
                  {prog.emoji}
                </motion.span>
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: prog.color }}>
                  {prog.tag}
                </p>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl">{prog.name}</h3>
                <p className="mt-3 max-w-lg text-cream/70">{prog.body}</p>
              </motion.div>
            </AnimatePresence>

            {/* age slider */}
            <div className="relative mt-8">
              <div className="flex rounded-full bg-white/10 p-1">
                {AGE_GROUPS.map((a, i) => (
                  <button key={a} onClick={() => setAge(i)} className="relative flex-1 rounded-full px-2 py-2.5 text-xs font-bold sm:text-sm">
                    {age === i && <motion.span layoutId="age-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    <span className={`relative ${age === i ? "text-navy" : "text-cream/70"}`}>{a}</span>
                  </button>
                ))}
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {prog.byAge[age].map((it, i) => (
                    <motion.li
                      key={`${p}-${age}-${it}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 22 }}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: prog.color }} />
                      {it}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
              <p className="text-sm text-cream/70">Want to see this in practice? Come and spend a morning on campus with us.</p>
              <button onClick={() => apply()} className="btn-gold">Apply online</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
