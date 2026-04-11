import { motion } from "framer-motion";
import { aboutParagraphs, education, person } from "../data/profile";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function About() {
  return (
    <section id="about" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade} className="max-w-3xl">
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            About
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-slate-500">
            {person.location}
          </p>
        </motion.div>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="space-y-6 text-[15px] leading-relaxed text-slate-400">
            {aboutParagraphs.map((p, i) => (
              <motion.p key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }}>
                {p}
              </motion.p>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-6"
            >
              <h3 className="text-sm font-semibold text-slate-200">Education</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-400">
                {education.map((e) => (
                  <li key={e.school}>
                    <p className="font-medium text-slate-200">{e.school}</p>
                    <p className="mt-0.5 text-slate-300">{e.degree}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {e.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.16 }}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-6"
            >
              <h3 className="text-sm font-semibold text-slate-200">How I work</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80" />
                  Start from the decision the business needs to make, then trace backward to data and systems.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/80" />
                  Prefer simple, observable designs over clever complexity — especially in production paths.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
                  Communicate uncertainty and trade-offs clearly; metrics are only as good as their definitions.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
