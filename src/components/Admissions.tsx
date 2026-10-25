"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { documents, faqs, school, steps } from "@/data/content";
import Reveal from "./motion/Reveal";
import { useApply } from "./Providers";
import Magnetic from "./motion/Magnetic";

export default function Admissions() {
  const apply = useApply();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section id="admissions" className="relative bg-navy py-28 text-cream">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Admissions &amp; fees · 2026–2027</p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-6xl">
              Three steps to a place <span className="italic text-gold">at Think Well.</span>
            </h2>
            <p className="mt-4 max-w-xl text-cream/70">Registrations are open now, and places are confirmed on a rolling basis as assessments are completed.</p>
          </div>
          <Magnetic>
            <button onClick={() => apply()} className="btn-gold !px-8 !py-4 !text-base">Start the online form →</button>
          </Magnetic>
        </Reveal>

        {/* steps with a drawing progress line */}
        <div ref={ref} className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-1 rounded-full bg-white/10 md:block">
            <motion.div className="h-full rounded-full bg-gold" style={{ width: line }} />
          </div>
          {steps.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.15} className="relative">
              <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border-4 border-navy bg-gold font-serif text-2xl font-bold text-navy">{i + 1}</div>
              <h3 className="mt-5 font-serif text-2xl">{s.name}</h3>
              <p className="mt-2 text-cream/70">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gold p-8 text-navy">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/25" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Registration fee</p>
                <p className="mt-2 font-serif text-5xl font-semibold">{school.regFee}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-wider">Non-refundable</p>
                <p className="mt-4 text-sm text-navy/75">Separate from tuition. Covers processing, assessment and interview scheduling.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[2rem] bg-white/5 p-8">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-xl">Documents for interview day</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{checked.size}/{documents.length}</span>
                </div>
                <p className="mt-1 text-sm text-cream/50">Tick them off as you gather them.</p>
                <ul className="mt-5 space-y-2">
                  {documents.map((d, i) => {
                    const on = checked.has(i);
                    return (
                      <li key={d}>
                        <button
                          onClick={() => setChecked((c) => { const n = new Set(c); if (on) n.delete(i); else n.add(i); return n; })}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${on ? "bg-mint/20" : "bg-white/5 hover:bg-white/10"}`}
                        >
                          <motion.span animate={{ scale: on ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }} className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-sm ${on ? "border-mint bg-mint text-navy" : "border-white/30"}`}>
                            {on && "✓"}
                          </motion.span>
                          <span className={on ? "text-cream/60 line-through" : ""}>{d}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-[2rem] bg-white/5 p-6 sm:p-8">
              <p className="eyebrow">Parent questions</p>
              <div className="mt-4 divide-y divide-white/10">
                {faqs.map((f, i) => (
                  <div key={f.q}>
                    <button onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg sm:text-xl" aria-expanded={faq === i}>
                      {f.q}
                      <motion.span animate={{ rotate: faq === i ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-xl text-navy">+</motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {faq === i && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-5 text-cream/70">
                          {f.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
