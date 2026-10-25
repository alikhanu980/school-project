"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ceo } from "@/data/content";
import Wave from "./motion/Wave";

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(p, [start * 0.9, start * 0.9 + 0.12], [0.18, 1]);
  const highlight = /road|courage|lead|capability/i.test(w);
  return (
    <motion.span style={{ opacity }} className={highlight ? "italic text-gold" : ""}>
      {w}{" "}
    </motion.span>
  );
}

/** CEO & Principal message: the quote lights up word by word as you scroll. */
export default function Ceo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const words = ceo.quote.split(" ");
  const photoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rot = useTransform(scrollYProgress, [0, 1], [-6, 4]);

  return (
    <section className="relative bg-navy text-cream">
      <Wave fill="#0b192c" className="absolute -top-11 sm:-top-[79px]" />
      <div ref={ref} className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <motion.div style={{ y: photoY, rotate: rot }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 rounded-[3rem] bg-gold/30 blur-2xl" />
          <div className="blob-mask relative aspect-[4/5] overflow-hidden border-4 border-gold/70 bg-[#1f7a64]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ceo.photo} alt={ceo.name} className="h-full w-full object-cover object-[50%_20%]" />
          </div>
          <div className="absolute -bottom-5 -right-3 rotate-[-4deg] rounded-2xl bg-gold px-5 py-3 text-navy shadow-xl">
            <p className="font-serif text-lg font-semibold">{ceo.name}</p>
            <p className="text-xs font-bold uppercase tracking-wider">CEO &amp; Principal</p>
          </div>
        </motion.div>
        <div>
          <p className="eyebrow">A message from the CEO &amp; Principal</p>
          <span className="mt-4 block font-serif text-8xl leading-none text-gold/40">&ldquo;</span>
          <blockquote className="-mt-8 font-serif text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
            {words.map((w, i) => (
              <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} />
            ))}
          </blockquote>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-cream/60">— {ceo.role}</p>
        </div>
      </div>
    </section>
  );
}
