"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { school } from "@/data/content";
import Magnetic from "./motion/Magnetic";
import { useIntroDone } from "./GateIntro";

const ToyBlocks = dynamic(() => import("./three/ToyBlocks"), { ssr: false, loading: () => null });

const ease = [0.16, 1, 0.3, 1] as const;

function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: delay + i * 0.07, ease }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // hold everything until the gate intro is done, then remount so the entrances play
  const ready = useIntroDone();
  const D = ready ? 0 : 999;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blocksY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-navy text-cream">
      {/* campus photo, darkened, slow parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/main-gate.jpg" alt="" className="h-full w-full scale-110 object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy" />
      </motion.div>
      {/* colour blobs */}
      <div className="blob absolute -left-32 top-20 h-96 w-96 bg-gold/40" />
      <div className="blob absolute -right-20 top-1/3 h-[28rem] w-[28rem] bg-sky/30 [animation-delay:-5s]" />
      <div className="blob absolute bottom-0 left-1/3 h-80 w-80 bg-coral/25 [animation-delay:-9s]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-6 px-5 pb-24 pt-28 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <motion.div key={ready ? "go" : "wait"} style={{ opacity: fade }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: D + 0.2 }} className="flex flex-wrap gap-2">
            {school.positioning.map((p, i) => (
              <span key={p} className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${i === 2 ? "border-gold bg-gold text-navy" : "border-white/20 text-cream/80"}`}>
                {i === 2 && <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-coral" />}
                {p}
              </span>
            ))}
          </motion.div>
          <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
            <Words text="A School Built" delay={D + 0.3} />
            <br />
            <span className="italic text-gold">
              <Words text="Around the Child" delay={D + 0.55} />
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: D + 0.9 }} className="mt-6 max-w-xl text-lg text-cream/75">
            {school.heroLede}
          </motion.p>

          {/* the two doors */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: D + 1.1 }} className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
            <Magnetic strength={0.15} className="w-full">
              <a href="#about" className="group flex items-center gap-4 rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur transition hover:border-gold hover:bg-white/10">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-2xl transition group-hover:rotate-[-8deg] group-hover:scale-110">👨‍👩‍👧</span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gold">I&apos;m a parent</span>
                  <span className="block whitespace-nowrap font-serif text-lg">Explore the school →</span>
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.15} className="w-full">
              <Link href="/kids" className="group flex items-center gap-4 rounded-3xl bg-sun p-4 text-navy shadow-[0_6px_0_#c9962a] transition active:translate-y-1 active:shadow-none">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-2xl transition group-hover:rotate-12 group-hover:scale-110">🦁</span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-navy/70">I&apos;m a kid</span>
                  <span className="block whitespace-nowrap font-display text-lg font-semibold">Come and play! →</span>
                </span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* 3D toy blocks */}
        <motion.div style={{ y: blocksY }} className="relative h-[46vh] min-h-[320px] lg:h-[72vh]">
          {ready && <ToyBlocks />}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 2.4 }} className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-cream/80 backdrop-blur">
            ✨ Tap the blocks
          </motion.p>
        </motion.div>
      </div>

      {/* pillar strip */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-navy/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-5 py-4 text-xs font-bold uppercase tracking-[0.35em] text-gold sm:gap-10 sm:text-sm">
          {school.motto.map((m, i) => (
            <span key={m} className="flex items-center gap-4 sm:gap-10">
              {i > 0 && <span className="text-cream/30">•</span>}
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
