"use client";

import { useEffect, useRef, useState } from "react";

const SPINS = 2; // full 0–9 rotations before landing

/** Slot-machine counter: each digit rolls on its own reel, staggered left to right. */
export default function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  ready = true,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** hold the roll until the caller says go (e.g. after the intro) */
  ready?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [go, setGo] = useState(false);
  const text = `${prefix}${value.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGo(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // background-clip:text doesn't paint through the moving reels, so a gradient goes on each glyph instead
  const glyph = className.includes("text-gradient") ? "text-gradient" : "";
  const root = className.replace("text-gradient", "");
  let digitIndex = 0;
  return (
    <span ref={ref} className={`inline-flex tabular-nums ${root}`}>
      <span className="sr-only">{text}</span>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch))
          return (
            <span key={i} aria-hidden className={`inline-block h-[1em] leading-none ${glyph}`} style={{ lineHeight: 1 }}>
              {ch}
            </span>
          );
        const d = +ch;
        const k = digitIndex++;
        const target = SPINS * 10 + d;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden leading-none" style={{ lineHeight: 1 }}>
            {/* invisible sizer keeps the reel exactly one glyph wide */}
            <span className="invisible">{ch}</span>
            <span
              className="absolute left-0 top-0 flex flex-col"
              style={{
                transform: `translateY(-${go ? target : 0}em)`,
                transition: `transform ${1.6 + k * 0.18}s cubic-bezier(0.16, 1, 0.3, 1) ${k * 0.06}s`,
              }}
            >
              {Array.from({ length: target + 1 }, (_, j) => (
                <span key={j} className={`block h-[1em] ${glyph}`}>
                  {j % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
