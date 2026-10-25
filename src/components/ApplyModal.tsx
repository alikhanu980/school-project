"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { documents, school } from "@/data/content";
import { celebrate } from "./kids/confetti";

const GRADES = ["Pre-School / Early Years (Ages 3–5)", "Primary (Ages 6–10)", "Middle (Ages 11–13)", "O / A Level (Ages 14–16)"];
const HEARD = ["Social Media", "Referral", "Campus Billboard", "Website"];
const STEPS = ["Child", "Parents", "Review"];

function Field({ label, name, type = "text", required, full }: { label: string; name: string; type?: string; required?: boolean; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
        {label}
        {required && <span className="text-coral"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-xl border-2 border-navy/10 bg-white px-4 py-2.5 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
      />
    </label>
  );
}

/** Online registration: the same fields as the live site's form, split into a 3-step wizard. Demo only, nothing is sent. */
export default function ApplyModal({ open, grade, onClose }: { open: boolean; grade: string; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [g, setG] = useState(grade);

  useEffect(() => {
    if (open) {
      setStep(0);
      setDone(false);
      setG(GRADES.find((x) => grade && x.toLowerCase().includes(grade.toLowerCase().split(" ")[0])) ?? "");
    }
  }, [open, grade]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
    else {
      setDone(true);
      celebrate();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[150] flex items-end justify-center bg-navy/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} data-lenis-prevent>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Online registration"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-paper shadow-2xl sm:rounded-[2rem]"
          >
            <div className="sticky top-0 z-10 bg-navy px-6 pb-5 pt-6 text-cream sm:px-8">
              <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20">
                ×
              </button>
              <p className="eyebrow">Online registration · 2026–2027</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Registration &amp; Assessment Enquiry</h2>
              {!done && (
                <div className="mt-5 flex gap-2">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                        <motion.div className="h-full bg-gold" animate={{ width: i <= step ? "100%" : "0%" }} />
                      </div>
                      <p className={`mt-1.5 text-xs font-semibold ${i <= step ? "text-gold" : "text-white/40"}`}>
                        {i + 1}. {s}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {done ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-8 py-14 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint/20 text-4xl">✓</div>
                <h3 className="mt-5 font-serif text-2xl">Thank you — your enquiry is with us.</h3>
                <p className="mx-auto mt-3 max-w-md text-navy/70">
                  Our admissions team will contact you within two working days to arrange the interview and readiness assessment.
                </p>
                <p className="mt-6 text-xs text-navy/40">(Demo: nothing was sent.)</p>
                <button onClick={onClose} className="btn-gold mt-6">Done</button>
              </motion.div>
            ) : (
              <form onSubmit={next} className="px-6 py-6 sm:px-8">
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                    {step === 0 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Child's full name" name="child" required full />
                        <div className="sm:col-span-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
                            Grade applying for<span className="text-coral"> *</span>
                          </span>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {GRADES.map((x) => (
                              <button
                                type="button"
                                key={x}
                                onClick={() => setG(x)}
                                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${g === x ? "border-gold bg-gold/15" : "border-navy/10 bg-white hover:border-navy/30"}`}
                              >
                                {x}
                              </button>
                            ))}
                          </div>
                          <input tabIndex={-1} className="sr-only" required value={g} onChange={() => {}} aria-hidden />
                        </div>
                        <Field label="Previous school (if any)" name="prev" />
                        <Field label="Any allergies / medical notes" name="medical" />
                      </div>
                    )}
                    {step === 1 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Parent's name" name="parent" required />
                        <Field label="Nominated guardian" name="guardian" />
                        <Field label="Father's qualification" name="fq" />
                        <Field label="Father's occupation" name="fo" />
                        <Field label="Mother's qualification" name="mq" />
                        <Field label="Mother's occupation" name="mo" />
                        <Field label="Father's telephone" name="ft" type="tel" required />
                        <Field label="Mother's telephone" name="mt" type="tel" />
                        <Field label="Email address" name="email" type="email" required full />
                        <Field label="Home address" name="addr" full />
                        <label className="block sm:col-span-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-navy/60">How did you hear about us?</span>
                          <select name="heard" className="mt-1.5 w-full rounded-xl border-2 border-navy/10 bg-white px-4 py-2.5 outline-none focus:border-gold">
                            {HEARD.map((h) => (
                              <option key={h}>{h}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="rounded-2xl bg-navy p-5 text-cream">
                          <p className="eyebrow">Registration fee</p>
                          <p className="mt-1 font-serif text-3xl">{school.regFee}</p>
                          <p className="text-sm text-cream/70">Non-refundable. Once the child is registered, parents are given an interview and assessment date. The assessment helps the school determine the child&apos;s readiness for admission.</p>
                        </div>
                        <div>
                          <p className="font-bold">Documents required on the day of interview</p>
                          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                            {documents.map((d) => (
                              <li key={d} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                                <span className="text-mint">✓</span> {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-sm text-navy/60">Submitting this enquiry does not confirm a place — our admissions office will contact you to schedule the interview.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={() => (step ? setStep(step - 1) : onClose())} className="text-sm font-bold text-navy/60 hover:text-navy">
                    {step ? "← Back" : "Cancel"}
                  </button>
                  <button type="submit" className="btn-gold">
                    {step < 2 ? "Continue →" : "Submit registration enquiry"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
