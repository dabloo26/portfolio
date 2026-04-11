import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { experience, sortByRole } from "../data/profile";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function Experience() {
  const { role } = useRole();
  const ordered = useMemo(() => sortByRole(experience, role), [role]);

  return (
    <section id="experience" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Experience
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Results-first narrative — bullets are written to read well for data
            hiring loops across IC tracks.
          </p>
        </motion.div>
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="absolute left-[7px] top-2 bottom-4 w-px bg-gradient-to-b from-cyan-500/50 via-white/10 to-transparent sm:left-3"
            aria-hidden
          />
          <ol className="space-y-12">
            {ordered.map((job, i) => (
              <motion.li
                key={job.id}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.06 }}
                className="relative pl-8 sm:pl-12"
              >
                <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-cyan-400/40 bg-ink-950 sm:left-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </span>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      {job.period}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-400">{job.company}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-400">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
