import type { Metadata, Viewport } from "next";
import { Fraunces, Fredoka, Nunito_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"], axes: ["opsz"] });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Think Well International · A School Built Around the Child",
  description:
    "Cambridge-pathway school in Lahore, Pre-School to O / A Level. Knowledge, character and leadership, with farm life, enterprise and future skills. Admissions open 2026–2027.",
};

export const viewport: Viewport = { themeColor: "#0B192C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${fraunces.variable} ${nunito.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy">
          Skip to content
        </a>
        <SmoothScroll />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
