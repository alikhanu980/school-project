"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { enquiryTopics, school } from "@/data/content";
import Reveal from "./motion/Reveal";
import Wave from "./motion/Wave";
import { useApply } from "./Providers";

const MAP = `https://maps.google.com/maps?q=${encodeURIComponent("Queen's Road, Lahore, Pakistan")}&z=15&output=embed`;

export function Contact() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(enquiryTopics[0]);
  const apply = useApply();

  return (
    <section id="contact" className="relative bg-cream pb-28 pt-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="eyebrow">Contact us</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] sm:text-6xl">
            Talk to our <span className="italic text-gold">admissions team.</span>
          </h2>
          <p className="mt-4 max-w-lg text-navy/70">Ask a question, request the fee structure, or book a morning on campus. We reply within two working days.</p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-2xl bg-white p-5">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50">Campus address</p>
                <p className="font-semibold">{school.address}</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl bg-white p-5">
              <span className="text-2xl">🕗</span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50">School office hours</p>
                {school.hours.map(([d, h]) => (
                  <p key={d} className="flex justify-between gap-4 font-semibold">
                    <span>{d}</span>
                    <span className="text-navy/70">{h}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-lg">
            <iframe title="Map of Queen's Road, Lahore" src={MAP} className="h-64 w-full grayscale-[30%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(11,25,44,0.45)] sm:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
                  <motion.div className="mx-auto text-6xl" animate={{ y: [0, -16, 0] }} transition={{ repeat: 2, duration: 0.6 }}>📬</motion.div>
                  <h3 className="mt-5 font-serif text-2xl">Thank you — your message has been sent.</h3>
                  <p className="mt-2 text-navy/70">A member of our admissions team will be in touch within two working days.</p>
                  <p className="mt-4 text-xs text-navy/40">(Demo: nothing was sent.)</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm font-bold text-gold underline">Send another</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4" exit={{ opacity: 0, y: -10 }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Your name", "text"],
                      ["Mobile number", "tel"],
                    ].map(([l, t]) => (
                      <label key={l} className="block">
                        <span className="text-xs font-bold uppercase tracking-wider text-navy/60">{l}</span>
                        <input required type={t} className="mt-1.5 w-full rounded-xl border-2 border-navy/10 px-4 py-3 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20" />
                      </label>
                    ))}
                  </div>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/60">Email address</span>
                    <input type="email" className="mt-1.5 w-full rounded-xl border-2 border-navy/10 px-4 py-3 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20" />
                  </label>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/60">I am enquiring about</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {enquiryTopics.map((t) => (
                        <button type="button" key={t} onClick={() => setTopic(t)} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${topic === t ? "text-navy" : "bg-cream text-navy/70 hover:bg-cream/70"}`}>
                          {topic === t && <motion.span layoutId="topic" className="absolute inset-0 rounded-full bg-gold" />}
                          <span className="relative">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/60">Your message</span>
                    <textarea rows={4} className="mt-1.5 w-full rounded-xl border-2 border-navy/10 px-4 py-3 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20" />
                  </label>
                  <p className="text-xs text-navy/50">We use your details only to answer your enquiry.</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button className="btn-gold">Send message</button>
                    <button type="button" onClick={() => apply()} className="text-sm font-bold text-navy/70 underline decoration-gold decoration-2 underline-offset-4">
                      Ready to register instead?
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const apply = useApply();
  return (
    <footer className="relative bg-navy text-cream">
      <Wave fill="#0b192c" className="absolute -top-11 sm:-top-[79px]" />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/crest.png" alt="Think Well International crest" className="h-24 w-24 object-contain" />
            <p className="mt-4 font-serif text-2xl">Think Well International</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-gold">{school.motto.join(" • ")}</p>
            <p className="mt-3 text-cream/60">A school built around the child.</p>
          </div>
          <div>
            <p className="eyebrow">Quick links</p>
            <ul className="mt-4 space-y-2 text-cream/75">
              {[["About us", "/#about"], ["Practical curriculum", "/#curriculum"], ["Admissions & fees", "/#admissions"], ["Contact us", "/#contact"], ["Kids Zone 🦁", "/kids"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-gold">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Class levels</p>
            <ul className="mt-4 space-y-2 text-cream/75">
              {["Early Years", "Primary Level", "Middle School", "O Level"].map((l) => (
                <li key={l}><a href="/#levels" className="hover:text-gold">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Admissions 2026–2027</p>
            <p className="mt-4 font-serif text-xl">Pre-School to O / A Level</p>
            <p className="mt-2 text-sm text-cream/60">{school.address}</p>
            <button onClick={() => apply()} className="btn-gold mt-5">Apply now</button>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-sm text-cream/50">
          <p>© 2026 Think Well International. All rights reserved.</p>
          <p>Demo redesign concept</p>
        </div>
      </div>
    </footer>
  );
}
