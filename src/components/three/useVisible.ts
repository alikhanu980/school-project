"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks whether an element is on screen, so WebGL canvases can stop rendering when they're not. */
export function useVisible<T extends HTMLElement>(margin = "100px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    const vis = () => document.visibilityState === "hidden" && setVisible(false);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [margin]);
  return [ref, visible] as const;
}
