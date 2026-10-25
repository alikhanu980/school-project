import type { Metadata } from "next";
import KidsZone from "./KidsZone";

export const metadata: Metadata = {
  title: "Kids Zone · Think Well International",
  description: "Play with Sheru the lion cub: ball pit, rainbow xylophone, memory match, the school farm and grow-a-sunflower.",
};

export default function Page() {
  return <KidsZone />;
}
