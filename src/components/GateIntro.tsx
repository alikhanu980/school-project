"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Opening scene:
 *  1. the real Think Well gate (photo), gently approaching
 *  2. the gate splits down the middle and swings open, light floods through
 *  3. inside the gateway: a quote focuses in letter by letter, a gold shine sweeps across
 *  4. zoom through into the site
 * Plays once per page load (not on client-side navigation). Click to skip.
 */

const OPEN = 1.5; // gates start opening
const QUOTE = 2.5; // quote starts
const OUT = 5.6; // zoom through into the site
const TOTAL = 6.2;

const LINE_1 = "We don't just teach lessons.";
const LINE_2 = "We shape generations.";

let played = false;
let done = false;
const DONE_EVENT = "tw-intro-done";

/** True once the intro has finished (or was skipped / never shown). */
export function useIntroDone() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (done) return setReady(true);
    const on = () => setReady(true);
    window.addEventListener(DONE_EVENT, on);
    return () => window.removeEventListener(DONE_EVENT, on);
  }, []);
  return ready;
}

function finish() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(DONE_EVENT));
}

const ease = [0.16, 1, 0.3, 1] as const;
const swing = [0.65, 0, 0.25, 1] as const;

/** One half of the real gate photo, hinged on its outer edge. */
function GateHalf({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <motion.div
      className="absolute top-0 h-full w-1/2 overflow-hidden will-change-transform"
      style={{ [left ? "left" : "right"]: 0, transformOrigin: left ? "left center" : "right center" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: left ? -88 : 88 }}
      transition={{ delay: OPEN, duration: 1.5, ease: swing }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/main-gate.jpg" alt="" className="absolute top-0 h-screen w-screen max-w-none object-cover" style={{ [left ? "left" : "right"]: 0 }} />
      {/* darken as it turns away from the light */}
      <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0.15 }} animate={{ opacity: 0.75 }} transition={{ delay: OPEN, duration: 1.2 }} />
      {/* edge highlight on the opening seam */}
      <motion.div className={`absolute top-0 h-full w-[3px] bg-gold-bright ${left ? "right-0" : "left-0"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: OPEN, duration: 0.3 }} />
    </motion.div>
  );
}

/** Concentric gold rings rushing toward the viewer. Transform + opacity only, so it stays smooth. */
function Rings() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute aspect-square w-[42vmin] rounded-full border-2 border-gold/60 will-change-transform"
          initial={{ scale: 0.05, opacity: 0 }}
          animate={{ scale: [0.05, 4], opacity: [0, 0.8, 0] }}
          transition={{ delay: OPEN + 0.3 + i * 0.45, duration: 2.25, repeat: Infinity, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/** Light streaks flying outward: built on the client (random) to avoid hydration mismatch. */
function Streaks() {
  const [streaks, setStreaks] = useState<{ deg: number; dur: number; delay: number; len: number }[]>([]);
  useEffect(
    () =>
      setStreaks(
        Array.from({ length: 32 }, () => ({ deg: Math.random() * 360, dur: 0.8 + Math.random() * 0.6, delay: Math.random() * 1.8, len: 60 + Math.random() * 110 })),
      ),
    [],
  );
  return (
    <div className="absolute left-1/2 top-1/2">
      {streaks.map((s, i) => (
        <div key={i} className="absolute left-0 top-0" style={{ transform: `rotate(${s.deg}deg)` }}>
          <motion.span
            className="block h-[2px] origin-left rounded-full bg-gradient-to-r from-transparent to-gold-bright will-change-transform"
            style={{ width: s.len }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: [40, 900], opacity: [0, 1, 0] }}
            transition={{ delay: OPEN + 0.4 + s.delay, duration: s.dur, repeat: Infinity, ease: "easeIn" }}
          />
        </div>
      ))}
    </div>
  );
}

/** Letters drift into focus one after another. */
function Letters({ text, start, step = 0.035, className = "" }: { text: string; start: number; step?: number; className?: string }) {
  return (
    <span aria-label={text} className="inline-block">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`inline-block ${className}`}
          initial={{ opacity: 0, y: 18, scale: 1.25 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: start + i * step, duration: 0.7, ease }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function GateIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (played || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      finish();
      return;
    }
    played = true;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), TOTAL * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      finish();
    }
  }, [show]);

  const l2Start = QUOTE + LINE_1.length * 0.02 + 0.3;
  const shineAt = l2Start + LINE_2.length * 0.035 + 0.4;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] overflow-hidden bg-[#050c18]"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          onClick={() => setShow(false)}
          aria-hidden
        >
          {/* ---------- behind the gate: the gateway ---------- */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            animate={{ scale: [1, 1, 2.4], opacity: [1, 1, 0] }}
            transition={{ duration: TOTAL, times: [0, OUT / TOTAL, 1], ease: "easeIn" }}
          >
            {/* light flooding through the opening, then settling to a warm glow */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFF6D8_0%,#E2BD5C_20%,#6b4e16_45%,#050c18_75%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5] }}
              transition={{ delay: OPEN + 0.1, duration: 1.8, times: [0, 0.35, 1] }}
            />
            <Rings />
            <Streaks />
            {/* dark centre so the quote reads (gradient, no blur filter) */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_center,rgba(5,12,24,0.92)_0%,rgba(5,12,24,0.7)_55%,transparent_100%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: QUOTE - 0.4, duration: 0.8 }}
            />

            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <div>
                <motion.div
                  className="mx-auto mb-7 h-20 w-20 sm:h-24 sm:w-24"
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: QUOTE - 0.3, duration: 1, ease }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/crest.png" alt="" className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(226,189,92,0.6)]" />
                </motion.div>

                <p className="font-serif text-2xl italic text-cream/85 sm:text-4xl">
                  <Letters text={LINE_1} start={QUOTE} step={0.02} />
                </p>

                {/* once the letters land, the line glows gold */}
                <motion.p
                  className="mt-3 font-serif text-5xl font-semibold leading-[1.15] text-[#F3D27A] sm:text-7xl lg:text-8xl"
                  initial={{ textShadow: "0 0 0px rgba(243,210,122,0)" }}
                  animate={{ textShadow: ["0 0 0px rgba(243,210,122,0)", "0 0 38px rgba(243,210,122,0.75)", "0 0 16px rgba(243,210,122,0.35)"] }}
                  transition={{ delay: shineAt - 0.2, duration: 1.4, ease: "easeInOut" }}
                >
                  <Letters text={LINE_2} start={l2Start} />
                </motion.p>

                <motion.div
                  className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-gold-bright to-transparent"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ delay: shineAt - 0.2, duration: 1, ease }}
                />
                <motion.p
                  className="mt-5 text-[11px] font-bold uppercase tracking-[0.5em] text-gold sm:text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shineAt, duration: 0.8, ease }}
                >
                  Knowledge • Character • Leadership
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* ---------- the gate itself: walk up, then it opens ---------- */}
          <motion.div
            className="absolute inset-0 [perspective:1600px]"
            initial={{ scale: 1.12 }}
            animate={{ scale: [1.12, 1, 1.35] }}
            transition={{ duration: OPEN + 1.5, times: [0, OPEN / (OPEN + 1.5), 1], ease: "easeInOut" }}
          >
            <GateHalf side="left" />
            <GateHalf side="right" />
          </motion.div>

          {/* shade under the caption */}
          <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: OPEN, duration: 0.6 }} />
          {/* welcome caption over the closed gate */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[9%] text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -8] }}
            transition={{ duration: OPEN + 0.2, times: [0, 0.3, 0.8, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold sm:text-sm">Welcome to</p>
            <p className="mt-2 font-serif text-3xl text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] sm:text-5xl">Think Well International</p>
          </motion.div>

          <motion.button
            className="absolute bottom-6 right-6 z-10 rounded-full border border-white/25 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream/70 hover:text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setShow(false)}
          >
            Skip intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
