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
      className="relative z-10 scroll-mt-32 border-t border-white/[0.05] bg-base/58 px-4 py-24 sm:px-6 sm:py-28"
    >
      <SectionBackdropLayer variant="experience" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Experience
          </h2>
        </motion.div>
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="absolute left-[11px] top-2 bottom-4 w-px bg-gradient-to-b from-accent-violet/50 via-white/10 to-transparent sm:left-[13px]"
            aria-hidden
          />
          <ol className="space-y-12">
            {experience.map((job, i) => (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 sm:pl-14"
              >
                <span
                  className="absolute left-0 top-1 font-mono text-sm text-accent-acid sm:left-0.5"
                  aria-hidden
                >
                  <span className="animate-cursor-blink">▮</span>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-xs uppercase tracking-wide text-accent-acid">
                    {job.period}
                  </p>
                  {job.timelineNote ? (
                    <p className="font-mono text-[10px] text-meta">{job.timelineNote}</p>
                  ) : null}
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {experienceTitle(job, role)}
                  </h3>
                  <p className="text-sm font-normal uppercase tracking-[0.15em] text-white/80">
                    {job.company}
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-meta">
                  {experienceBullets(job, role).map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      <span className="text-white/85">{b}</span>
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
