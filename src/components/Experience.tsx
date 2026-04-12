import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import {
  experience,
  experienceBullets,
  experienceTitle,
} from "../data/profile";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function Experience() {
  const { role } = useRole();

  return (
    <section
      id="experience"
      className="relative z-10 scroll-mt-40 bg-gradient-to-b from-base/30 via-base/52 to-base/60 px-4 py-16 sm:px-6 sm:py-20 md:scroll-mt-44"
    >
      <SectionBackdropLayer variant="experience" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div {...fade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Experience
          </h2>
          <p className="mt-2 max-w-lg font-mono text-sm text-meta">
            Timeline — most recent first.
          </p>
        </motion.div>

        <div className="relative mt-10 pl-1 sm:pl-2">
          <div
            className="absolute bottom-2 left-[11px] top-3 w-px bg-gradient-to-b from-accent-violet/40 via-white/15 to-transparent sm:left-[13px]"
            aria-hidden
          />
          <ol className="space-y-4">
            {experience.map((job, i) => (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={{
                  duration: 0.4,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-9 sm:pl-11"
              >
                <span
                  className="absolute left-0 top-[0.65rem] z-[1] flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-accent-violet/80 bg-[#0a0c10] shadow-[0_0_12px_rgba(124,58,255,0.35)] sm:top-[0.7rem]"
                  aria-hidden
                />
                <div className="rounded-xl border border-white/[0.1] bg-[#070a12]/55 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-[11px] uppercase tracking-wide text-accent-acid sm:text-xs">
                      {job.period}
                    </p>
                    {job.timelineNote ? (
                      <p className="font-mono text-[10px] text-meta">{job.timelineNote}</p>
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-white sm:text-lg">
                    {experienceTitle(job, role)}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-white/70">
                    {job.company}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-meta sm:text-sm">
                    {experienceBullets(job, role).map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-violet/60" />
                        <span className="text-white/85">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
