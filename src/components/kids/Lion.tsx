"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const MANE = "#E8A33D";
const MANE_DARK = "#C9822A";
const FUR = "#FFD27A";
const MUZZLE = "#FFF1D6";
const NAVY = "#0B192C";

/**
 * Sheru the lion cub, a playful take on the lion in the Think Well crest. Pure SVG.
 * Eyes follow the pointer, blinks, dozes off when idle, bounces + roars (a cute one) when tapped.
 */
export default function Lion({ size = 240, onRoar, className = "" }: { size?: number; onRoar?: () => void; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [sleepy, setSleepy] = useState(false);
  const [happy, setHappy] = useState(false);
  const body = useAnimationControls();
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const wake = () => {
      setSleepy(false);
      clearTimeout(idle.current);
      idle.current = setTimeout(() => setSleepy(true), 10000);
    };
    const move = (e: PointerEvent) => {
      wake();
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.45);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 280);
      setEye({ x: (dx / d) * 6 * k, y: (dy / d) * 5 * k });
    };
    wake();
    window.addEventListener("pointermove", move);
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2000 + Math.random() * 3000);
    };
    loop();
    return () => {
      window.removeEventListener("pointermove", move);
      clearTimeout(t);
      clearTimeout(idle.current);
    };
  }, []);

  const roar = () => {
    setSleepy(false);
    setHappy(true);
    setTimeout(() => setHappy(false), 1100);
    body.start({ y: [0, -40, 0, -14, 0], scale: [1, 1.08, 0.96, 1.02, 1], transition: { duration: 0.8 } });
    try {
      // a tiny cub "rawr": falling sawtooth through a lowpass
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const f = ctx.createBiquadFilter();
      const g = ctx.createGain();
      const t = ctx.currentTime;
      o.type = "sawtooth";
      o.frequency.setValueAtTime(320, t);
      o.frequency.exponentialRampToValueAtTime(140, t + 0.45);
      f.type = "lowpass";
      f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(f).connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    } catch {}
    onRoar?.();
  };

  const lid = blink || sleepy;
  const petals = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

  return (
    <motion.svg
      ref={ref}
      animate={body}
      viewBox="0 0 240 250"
      width={size}
      height={size * 1.04}
      onClick={roar}
      role="button"
      aria-label="Sheru the lion cub. Tap to say hello"
      className={`cursor-pointer select-none overflow-visible drop-shadow-[0_18px_30px_rgba(11,25,44,0.25)] ${className}`}
    >
      {/* tail */}
      <motion.g animate={{ rotate: [0, 14, -6, 0] }} transition={{ repeat: Infinity, duration: 2.6 }} style={{ originX: "170px", originY: "215px" }}>
        <path d="M170 215 Q215 220 212 180" stroke={FUR} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="212" cy="176" r="10" fill={MANE_DARK} />
      </motion.g>
      {/* body */}
      <ellipse cx="120" cy="200" rx="62" ry="42" fill={FUR} />
      <ellipse cx="120" cy="210" rx="34" ry="26" fill={MUZZLE} />
      {/* paws */}
      <ellipse cx="88" cy="238" rx="18" ry="11" fill={FUR} />
      <ellipse cx="152" cy="238" rx="18" ry="11" fill={FUR} />
      {[80, 88, 96, 144, 152, 160].map((x) => (
        <line key={x} x1={x} y1={234} x2={x} y2={242} stroke={MANE_DARK} strokeWidth="2" strokeLinecap="round" />
      ))}
      {/* mane: rotating petals */}
      <motion.g animate={{ rotate: happy ? 30 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 8 }} style={{ originX: "120px", originY: "105px" }}>
        {petals.map((a, i) => (
          <ellipse
            key={i}
            cx={120 + Math.cos(a) * 66}
            cy={105 + Math.sin(a) * 62}
            rx="26"
            ry="30"
            fill={i % 2 ? MANE : MANE_DARK}
            transform={`rotate(${(a * 180) / Math.PI + 90} ${120 + Math.cos(a) * 66} ${105 + Math.sin(a) * 62})`}
          />
        ))}
        <circle cx="120" cy="105" r="70" fill={MANE} />
      </motion.g>
      {/* ears */}
      <circle cx="72" cy="58" r="17" fill={FUR} />
      <circle cx="72" cy="58" r="9" fill="#F5A3A3" />
      <circle cx="168" cy="58" r="17" fill={FUR} />
      <circle cx="168" cy="58" r="9" fill="#F5A3A3" />
      {/* face */}
      <ellipse cx="120" cy="108" rx="56" ry="52" fill={FUR} />
      {/* cheeks */}
      <motion.ellipse cx="82" cy="124" rx="11" ry="7" fill="#FF8FA3" animate={{ opacity: happy ? 0.9 : 0.45 }} />
      <motion.ellipse cx="158" cy="124" rx="11" ry="7" fill="#FF8FA3" animate={{ opacity: happy ? 0.9 : 0.45 }} />
      {/* eyes */}
      {[96, 144].map((cx) => (
        <g key={cx}>
          {happy ? (
            <path d={`M${cx - 10} ${100} q10 -12 20 0`} stroke={NAVY} strokeWidth="5" fill="none" strokeLinecap="round" />
          ) : (
            <>
              <ellipse cx={cx} cy={98} rx="13" ry="15" fill="#fff" />
              <circle cx={cx + eye.x} cy={99 + eye.y} r="9" fill={NAVY} />
              <circle cx={cx + eye.x + 3} cy={95 + eye.y} r="3.2" fill="#fff" />
              <motion.rect
                x={cx - 15}
                y={82}
                width="30"
                rx="8"
                fill={FUR}
                initial={false}
                animate={{ height: lid ? (sleepy && !blink ? 17 : 32) : 0 }}
                transition={{ duration: 0.1 }}
              />
            </>
          )}
        </g>
      ))}
      {/* muzzle + nose + mouth */}
      <ellipse cx="120" cy="132" rx="26" ry="19" fill={MUZZLE} />
      <path d="M110 120 h20 l-10 11 z" fill="#7A3E2B" strokeLinejoin="round" />
      {happy ? (
        <path d="M106 136 q14 18 28 0 z" fill="#B23A48" />
      ) : (
        <path d="M120 131 v5 M120 136 q-7 7 -13 1 M120 136 q7 7 13 1" stroke="#7A3E2B" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
      {/* whisker dots */}
      {[-1, 1].map((s) => [0, 1, 2].map((j) => <circle key={`${s}${j}`} cx={120 + s * (12 + j * 5)} cy={128 + (j % 2) * 5} r="1.4" fill={MANE_DARK} />))}
      {/* school scarf, navy + gold */}
      <path d="M78 160 q42 18 84 0 l-2 14 q-40 14 -80 0 z" fill={NAVY} />
      <path d="M82 166 q38 14 76 0" stroke="#C9A24B" strokeWidth="2.5" fill="none" />
      <motion.path d="M140 168 l14 30 l-12 2 l-10 -28 z" fill={NAVY} animate={{ rotate: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ originX: "140px", originY: "168px" }} />
      {sleepy && (
        <motion.text x="185" y="50" fontSize="24" fill="#5AB4F0" fontWeight="700" fontFamily="var(--font-display)" animate={{ y: [50, 25], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          z
        </motion.text>
      )}
    </motion.svg>
  );
}
