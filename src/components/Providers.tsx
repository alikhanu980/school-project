"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, useState } from "react";
import ApplyModal from "./ApplyModal";

const ApplyCtx = createContext<(grade?: string) => void>(() => {});
/** Opens the online registration modal from anywhere. */
export const useApply = () => useContext(ApplyCtx);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<string | false>(false);
  return (
    <MotionConfig reducedMotion="user">
      <ApplyCtx.Provider value={(g) => setOpen(g ?? "")}>
        {children}
        <ApplyModal open={open !== false} grade={open || ""} onClose={() => setOpen(false)} />
      </ApplyCtx.Provider>
    </MotionConfig>
  );
}
