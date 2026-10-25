import confetti from "canvas-confetti";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Confetti pop at a screen point (client px). No-op for reduced motion. */
export function burst(x: number, y: number, colors?: string[], count = 60) {
  if (reduced()) return;
  confetti({
    particleCount: count,
    spread: 75,
    startVelocity: 32,
    scalar: 0.9,
    ticks: 140,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: colors ?? ["#FF6B5B", "#FFC83D", "#3CC8A0", "#5AB4F0", "#B79CFF"],
    disableForReducedMotion: true,
  });
}

/** Big two-sided celebration (stars + circles). */
export function celebrate() {
  if (reduced()) return;
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, shapes: ["star", "circle"] });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, shapes: ["star", "circle"] });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
