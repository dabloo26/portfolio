import { motion } from "framer-motion";
import { person } from "../data/profile";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          {...fade}
          className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-ink-900/80 to-ink-950 p-8 sm:p-12"
        >
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Contact
          </h2>
          <p className="mt-3 max-w-lg text-sm text-slate-400">
            Email is the fastest path — resume PDF is attached for recruiters who
            prefer a traditional packet.
          </p>
          <div className="mt-10 flex flex-col flex-wrap gap-4 text-sm sm:flex-row sm:items-center sm:gap-8">
            <a
              href={`mailto:${person.email}`}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-5 py-2.5 font-medium text-slate-100 transition hover:border-cyan-400/35 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              {person.email}
            </a>
            <a
              href={`tel:${person.phone.replace(/\s/g, "")}`}
              className="inline-flex w-fit items-center gap-2 text-slate-400 transition hover:text-cyan-200"
            >
              {person.phone}
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 text-slate-400 transition hover:text-cyan-200"
            >
              LinkedIn →
            </a>
            <a
              href={person.resumeUrl}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-slate-100 transition hover:border-cyan-400/35"
              download
            >
              Download resume (PDF)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
