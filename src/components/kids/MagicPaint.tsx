"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MODES = [
  { id: 1, label: "Free", e: "✏️" },
  { id: 2, label: "Mirror", e: "🦋" },
  { id: 6, label: "Snowflake", e: "❄️" },
  { id: 8, label: "Flower", e: "🌸" },
];
const SIZES = [4, 10, 20];

/** Rainbow kaleidoscope paint: every stroke is mirrored N ways around the centre. */
export default function MagicPaint() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState(8);
  const [size, setSize] = useState(10);
  const [rainbow, setRainbow] = useState(true);
  const [color, setColor] = useState("#FF6B5B");
  const st = useRef({ drawing: false, x: 0, y: 0, hue: 0 });

  useEffect(() => {
    const c = canvas.current!;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const snap = c.width ? c.toDataURL() : null;
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#0b192c";
      ctx.fillRect(0, 0, r.width, r.height);
      if (snap) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
        img.src = snap;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    const cx = r.width / 2;
    const cy = r.height / 2;
    const s = st.current;
    s.hue = (s.hue + 2) % 360;
    ctx.strokeStyle = rainbow ? `hsl(${s.hue} 95% 62%)` : color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.shadowColor = ctx.strokeStyle as string;
    ctx.shadowBlur = 12;
    for (let i = 0; i < mode; i++) {
      for (const flip of mode > 1 ? [1, -1] : [1]) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI * 2) / mode);
        ctx.scale(flip, 1);
        ctx.beginPath();
        ctx.moveTo(x0 - cx, y0 - cy);
        ctx.lineTo(x1 - cx, y1 - cy);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const clear = () => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    ctx.fillStyle = "#0b192c";
    ctx.fillRect(0, 0, r.width, r.height);
  };

  const save = () => {
    const a = document.createElement("a");
    a.download = "my-think-well-art.png";
    a.href = canvas.current!.toDataURL("image/png");
    a.click();
  };

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2.5rem] border-8 border-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]">
        <canvas
          ref={canvas}
          className="h-full w-full touch-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const [x, y] = pos(e);
            st.current = { ...st.current, drawing: true, x, y };
            line(x, y, x + 0.1, y + 0.1);
          }}
          onPointerMove={(e) => {
            const s = st.current;
            if (!s.drawing) return;
            const [x, y] = pos(e);
            line(s.x, s.y, x, y);
            s.x = x;
            s.y = y;
          }}
          onPointerUp={() => (st.current.drawing = false)}
          onPointerLeave={() => (st.current.drawing = false)}
        />
        <p className="pointer-events-none absolute inset-x-0 top-4 text-center text-sm font-semibold text-white/40">Draw anywhere ✨</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {MODES.map((m) => (
          <motion.button key={m.id} whileTap={{ scale: 0.9 }} onClick={() => setMode(m.id)} className={`btn-kid ${mode === m.id ? "bg-navy text-white" : "bg-white"}`}>
            {m.e} {m.label}
          </motion.button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => setRainbow(true)} className={`btn-kid ${rainbow ? "ring-4 ring-navy" : ""}`} style={{ background: "linear-gradient(90deg,#FF6B5B,#FFC83D,#3CC8A0,#5AB4F0,#B79CFF)" }} aria-label="Rainbow">
          🌈
        </button>
        {["#FF6B5B", "#FFC83D", "#3CC8A0", "#5AB4F0", "#FFFFFF"].map((c) => (
          <button key={c} onClick={() => { setRainbow(false); setColor(c); }} aria-label={`Colour ${c}`} className={`h-10 w-10 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.15)] transition ${!rainbow && color === c ? "scale-110 ring-4 ring-navy" : ""}`} style={{ background: c }} />
        ))}
        <span className="mx-2 h-8 w-px bg-navy/20" />
        {SIZES.map((s) => (
          <button key={s} onClick={() => setSize(s)} aria-label={`Brush ${s}`} className={`grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,0.1)] ${size === s ? "ring-4 ring-navy" : ""}`}>
            <span className="rounded-full bg-navy" style={{ width: s / 1.3 + 3, height: s / 1.3 + 3 }} />
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button onClick={clear} className="btn-kid bg-white">🧽 Clear</button>
        <button onClick={save} className="btn-kid bg-mint text-white">💾 Save my art</button>
      </div>
    </div>
  );
}
