"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { stages, type Stage } from "@/data/content";
import { useApply } from "./Providers";

function StageModal({ s, onClose }: { s: Stage; onClose: () => void }) {
  const apply = useApply();
  return (
    <motion.div className="fixed inset-0 z-[140] flex items-end justify-center bg-navy/60 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} data-lenis-prevent>
      <motion.div
        layoutId={`stage-${s.n}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-paper sm:rounded-[2rem]"
        role="dialog"
        aria-modal="true"
        aria-label={s.name}
      >
        <div className="relative overflow-hidden p-8 text-navy" style={{ background: s.color }}>
          <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/40 text-xl">×</button>
          <span className="absolute -bottom-6 right-8 text-[9rem] leading-none opacity-30">{s.emoji}</span>
          <p className="text-sm font-bold uppercase tracking-wider">{s.ages}</p>
          <h3 className="mt-1 font-serif text-4xl sm:text-5xl">{s.name}</h3>
          <p className="mt-2 font-display text-lg font-semibold tracking-wide">{s.motto}</p>
          <p className="mt-4 max-w-2xl">{s.blurb}</p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="eyebrow">The four core pillars at this level</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.pillars.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-bold text-navy/40">0{i + 1}</p>
                <h4 className="font-serif text-xl">{p.name}</h4>
                <p className="text-xs font-bold uppercase tracking-wider text-gold">{p.focus}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.items.map((it) => (
                    <li key={it} className="rounded-full bg-cream px-3 py-1 text-sm">{it}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy p-5 text-cream">
            <p>Registrations for {s.name} are open for the 2026–2027 session.</p>
            <button onClick={() => { onClose(); apply(s.name); }} className="btn-gold">Apply for {s.name}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Pinned horizontal journey through the four stages. */
export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const pathLen = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);
  const [open, setOpen] = useState<Stage | null>(null);

  return (
    <section id="levels" ref={ref} className="relative h-[320vh] bg-paper">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Class levels</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">
            Four stages, <span className="italic text-gold">one continuous journey.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-navy/70">Every level is built on the same four core pillars: Islamic character, entrepreneurship, skills and the farm, pitched to the age of the child. Tap a stage to see exactly what is taught.</p>
        </div>

        <motion.div style={{ x }} className="relative mt-10 flex w-max gap-6 pl-5 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {/* dotted road behind the cards */}
          <svg className="pointer-events-none absolute left-0 top-1/2 h-24 w-full -translate-y-1/2" viewBox="0 0 2000 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0,50 C250,0 500,100 750,50 C1000,0 1250,100 1500,50 C1750,0 2000,60 2000,50" stroke="#0b192c1a" strokeWidth="10" fill="none" strokeDasharray="2 22" strokeLinecap="round" />
            <motion.path d="M0,50 C250,0 500,100 750,50 C1000,0 1250,100 1500,50 C1750,0 2000,60 2000,50" stroke="#C9A24B" strokeWidth="6" fill="none" strokeLinecap="round" style={{ pathLength: pathLen }} />
          </svg>
          {stages.map((s, i) => (
            <motion.button
              key={s.n}
              layoutId={`stage-${s.n}`}
              onClick={() => setOpen(s)}
              whileHover={{ y: -12, rotate: i % 2 ? 1.5 : -1.5 }}
              className="group relative flex h-[52vh] max-h-[460px] min-h-[360px] w-[78vw] max-w-[400px] flex-col overflow-hidden rounded-[2rem] p-7 text-left text-navy shadow-[0_30px_60px_-30px_rgba(11,25,44,0.5)]"
              style={{ background: s.color }}
            >
              <span className="font-serif text-7xl font-semibold opacity-25">{s.n}</span>
              <motion.span className="absolute right-6 top-6 text-6xl" animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4 }}>
                {s.emoji}
              </motion.span>
              <div className="mt-auto">
                <p className="text-xs font-bold uppercase tracking-wider">{s.ages}</p>
                <h3 className="mt-1 font-serif text-4xl">{s.name}</h3>
                <p className="mt-1 font-display font-semibold">{s.motto}</p>
                <p className="mt-3 line-clamp-3 text-sm text-navy/80">{s.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-bold text-cream transition group-hover:gap-4">
                  See what&apos;s taught <span>→</span>
                </span>
              </div>
            </motion.button>
          ))}
          <div className="flex w-[70vw] max-w-[380px] flex-col justify-center pr-10">
            <p className="font-serif text-3xl italic text-navy/70">…and onward to A Level.</p>
            <p className="mt-3 text-navy/60">A clear Cambridge progression, from first steps to future leaders.</p>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>{open && <StageModal s={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
