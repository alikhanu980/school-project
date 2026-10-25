"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { facilities } from "@/data/content";
import Reveal from "./motion/Reveal";

export default function Campus() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);

  return (
    <section id="campus" ref={ref} className="relative overflow-hidden bg-paper py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative h-[480px] sm:h-[560px]">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 w-[78%] overflow-hidden rounded-[2rem] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img style={{ scale }} src="/img/campus-building.jpg" alt="Think Well International campus building" className="aspect-[4/3] w-full object-cover" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 w-[62%] overflow-hidden rounded-[2rem] border-8 border-paper shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/classroom.jpg" alt="A Think Well classroom" className="aspect-[5/3] w-full object-cover" />
          </motion.div>
          <motion.div
            className="absolute left-[55%] top-[42%] grid h-28 w-28 place-items-center rounded-full bg-gold text-center font-display text-sm font-bold leading-tight text-navy shadow-xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="10.5" fontWeight="700" letterSpacing="2" fill="#0b192c">
                <textPath href="#circ">QUEEN&apos;S ROAD • LAHORE • CAMPUS •</textPath>
              </text>
            </svg>
            <span className="text-3xl">🦁</span>
          </motion.div>
        </div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="eyebrow">Campus &amp; facilities</p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl">
              Small classes. Individual attention. <span className="italic text-gold">Teachers as mentors.</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {facilities.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.06}>
                <motion.div whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }} className="group flex h-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_30px_-18px_rgba(11,25,44,0.4)]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream text-2xl transition group-hover:scale-125 group-hover:rotate-12">{f.emoji}</span>
                  <span className="font-semibold leading-tight">{f.name}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
