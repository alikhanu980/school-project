"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "@/components/Nav";
import Lion from "@/components/kids/Lion";
import StarTrail from "@/components/kids/StarTrail";
import Xylophone from "@/components/kids/Xylophone";
import MemoryGame from "@/components/kids/MemoryGame";
import { FarmFriends, GrowPlant } from "@/components/kids/Farm";
import { celebrate } from "@/components/kids/confetti";
import BalloonGame from "@/components/kids/BalloonGame";
import MagicPaint from "@/components/kids/MagicPaint";
import Wave from "@/components/motion/Wave";
import type { PitSignal } from "@/components/three/BallPit";

const BallPit = dynamic(() => import("@/components/three/BallPit"), { ssr: false, loading: () => <div className="grid h-full place-items-center font-display text-2xl text-navy/40">Loading balls… 🎈</div> });
const ToyBlocks = dynamic(() => import("@/components/three/ToyBlocks"), { ssr: false });

const LINES = [
  "Hi friend! I'm Sheru! 🦁",
  "Tap me again! Rawr! 😄",
  "Did you know? Lions sleep up to 20 hours a day! 😴",
  "Let's play in the ball pit! 🎈",
  "Can you play Twinkle Twinkle? 🎵",
  "Feed the bunny at our farm! 🐇",
];

const GAMES = [
  { id: "balloons", e: "🎈", t: "Balloon Pop", c: "#FF6B5B" },
  { id: "pit", e: "⚽", t: "Ball Pit", c: "#FF9F43" },
  { id: "paint", e: "🎨", t: "Magic Paint", c: "#FF8FC7" },
  { id: "music", e: "🎵", t: "Music", c: "#5AB4F0" },
  { id: "memory", e: "🧠", t: "Memory", c: "#B79CFF" },
  { id: "farm", e: "🐇", t: "Farm", c: "#3CC8A0" },
  { id: "grow", e: "🌻", t: "Grow", c: "#8BC34A" },
];

function Section({ id, title, sub, bg, children }: { id: string; title: string; sub: string; bg: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-5 py-20" style={{ background: bg }}>
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -3 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-6xl">{title}</h2>
          <p className="mt-2 font-display text-lg text-navy/70">{sub}</p>
        </motion.div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function KidsZone() {
  const [line, setLine] = useState(0);
  const [pops, setPops] = useState(0);
  const [count, setCount] = useState(0);
  const [signal, setSignal] = useState<PitSignal>();

  return (
    <div className="font-display text-navy" style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ctext y='26' font-size='26'%3E⭐%3C/text%3E%3C/svg%3E\") 16 16, auto" }}>
      <StarTrail />
      <Nav kids />
      <main id="main">
        {/* hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky to-[#9fd6fb] pb-10 pt-28">
          {/* clouds */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div key={i} className="absolute text-7xl opacity-90 sm:text-8xl" style={{ top: `${12 + i * 18}%` }} initial={{ x: i % 2 ? "110vw" : "-20vw" }} animate={{ x: i % 2 ? "-20vw" : "110vw" }} transition={{ repeat: Infinity, duration: 40 + i * 12, ease: "linear", delay: -i * 9 }}>
              ☁️
            </motion.div>
          ))}
          <motion.div className="absolute right-[8%] top-24 text-7xl" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
            ☀️
          </motion.div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <motion.h1 initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="text-6xl font-bold leading-[0.95] text-white [text-shadow:0_5px_0_#0b192c33] sm:text-8xl">
                Kids
                <br />
                <span className="text-sun">Zone!</span>
              </motion.h1>
              <p className="mt-4 text-xl font-medium text-white">Play, make music, feed the farm animals and grow a sunflower!</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {GAMES.map((g, i) => (
                  <motion.a key={g.id} href={`#${g.id}`} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.08, type: "spring" }} whileHover={{ y: -6, rotate: i % 2 ? 4 : -4 }} className="btn-kid text-white" style={{ background: g.c }}>
                    {g.e} {g.t}
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="relative flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div key={line} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative mb-3 max-w-xs rounded-3xl bg-white px-6 py-4 text-center text-lg font-semibold shadow-lg after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[12px] after:border-transparent after:border-t-white">
                  {LINES[line]}
                </motion.div>
              </AnimatePresence>
              <Lion size={280} onRoar={() => setLine((l) => (l + 1) % LINES.length)} />
            </div>
          </div>
          <div className="relative mt-4 h-56 sm:h-72">
            <ToyBlocks words={["PLAY", "LEARN"]} compact />
          </div>
        </section>

        <div className="bg-[#9fd6fb]"><Wave fill="#FFF8EC" /></div>

        <Section id="balloons" title="🎈 Balloon Pop" sub="Pop the balloons before they float away! Golden balloons = 5 points!" bg="#FFF8EC">
          <BalloonGame />
        </Section>

        <Section id="pit" title="⚽ Ball Pit" sub="Tap the tub to drop balls. Tap a ball to make it jump!" bg="#FFEFEA">
          <div className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#ffe9b0] to-[#fff6dc] shadow-[inset_0_-10px_0_rgba(0,0,0,0.05)]">
            <BallPit signal={signal} onCount={setCount} onPop={() => setPops((p) => p + 1)} />
            <div className="absolute left-4 top-4 flex gap-2 text-sm">
              <span className="rounded-full bg-white px-4 py-2 font-semibold shadow">🎈 {count + 12}</span>
              <span className="rounded-full bg-white px-4 py-2 font-semibold shadow">💥 {pops} jumps</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setSignal({ kind: "rain", n: 25, nonce: Date.now() })} className="btn-kid bg-coral text-lg text-white">🌧️ Ball rain!</button>
            <button onClick={() => setSignal({ kind: "clear", nonce: Date.now() })} className="btn-kid bg-white text-lg">🧹 Clean up</button>
          </div>
        </Section>

        <Section id="paint" title="🎨 Magic Paint" sub="Every line you draw turns into a magic pattern!" bg="#FFEAF4">
          <MagicPaint />
        </Section>

        <Section id="music" title="🎵 Rainbow Xylophone" sub="Tap the bars to make music!" bg="#E8F5FF">
          <Xylophone />
        </Section>

        <Section id="memory" title="🧠 Memory Match" sub="Find all the matching pairs!" bg="#F3EEFF">
          <MemoryGame />
        </Section>

        <Section id="farm" title="🐇 Our School Farm" sub="Tap an animal to give it a treat. Feed it 5 times for a fun fact!" bg="#E9FBF3">
          <FarmFriends />
        </Section>

        <Section id="grow" title="🌻 Grow a Sunflower" sub="At Think Well we plant real seeds! Water yours to help it grow." bg="#FFF3E3">
          <GrowPlant />
        </Section>

        <section className="bg-navy px-5 py-20 text-center text-cream">
          <motion.p className="text-6xl" animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🏆</motion.p>
          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">You&apos;re a Think Well star!</h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-cream/70">Show this page to your grown-ups and ask them about visiting our school!</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={celebrate} className="btn-kid bg-sun text-lg text-navy">🎉 Celebrate!</button>
            <Link href="/" className="btn-kid bg-white text-lg text-navy">👨‍👩‍👧 Grown-ups page</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
