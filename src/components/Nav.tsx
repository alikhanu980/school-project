"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useApply } from "./Providers";

const LINKS = [
  ["About", "/#about"],
  ["Class Levels", "/#levels"],
  ["Curriculum", "/#curriculum"],
  ["Campus", "/#campus"],
  ["Admissions", "/#admissions"],
  ["Contact", "/#contact"],
];

export default function Nav({ kids = false }: { kids?: boolean }) {
  const apply = useApply();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[80]">
      <motion.div className="h-1 origin-left bg-gradient-to-r from-gold via-sun to-coral" style={{ scaleX: progress }} />
      <div className={`mx-auto mt-2 flex max-w-7xl items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 sm:mx-4 lg:mx-auto ${scrolled || kids ? "bg-navy/90 shadow-lg backdrop-blur-md" : "bg-transparent"}`}>
        <Link href="/" className="flex items-center gap-2.5 pl-1 text-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/crest.png" alt="" className="h-10 w-10 object-contain" />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold">Think Well</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gold">International</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="rounded-full px-3 py-2 text-sm font-semibold text-cream/80 transition hover:bg-white/10 hover:text-cream">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {kids ? (
            <Link href="/" className="btn-kid bg-gold text-sm text-navy">👨‍👩‍👧 For Parents</Link>
          ) : (
            <Link href="/kids" className="btn-kid wiggle hidden bg-sun text-sm text-navy sm:inline-flex">
              🦁 Kids Zone
            </Link>
          )}
          <button onClick={() => apply()} className="btn-gold hidden !py-2.5 sm:inline-flex">Apply online</button>
          <button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-cream lg:hidden" aria-label="Open menu">
            ☰
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-[90] flex flex-col bg-navy p-6 text-cream" initial={{ clipPath: "circle(0% at 95% 4%)" }} animate={{ clipPath: "circle(150% at 95% 4%)" }} exit={{ clipPath: "circle(0% at 95% 4%)" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <button onClick={() => setMenu(false)} className="self-end text-3xl" aria-label="Close menu">×</button>
            <div className="mt-8 flex flex-col gap-2">
              {[...LINKS, ["🦁 Kids Zone", "/kids"]].map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={() => setMenu(false)} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="font-serif text-4xl">
                  {l}
                </motion.a>
              ))}
            </div>
            <button onClick={() => { setMenu(false); apply(); }} className="btn-gold mt-auto justify-center">Apply online</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
