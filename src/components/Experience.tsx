import { motion } from "framer-motion";
import {
  experience,
  experienceBulletsForViewport,
  experienceTitle,
} from "../data/profile";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function Experience() {
  const isNarrow = useMediaQuery("(max-width: 767px)");

  return (
    <section
      id="experience"
      className="relative z-10 overflow-x-clip scroll-mt-40 bg-gradient-to-b from-base/30 via-base/52 to-base/60 px-4 py-14 sm:px-5 sm:py-16 md:scroll-mt-44 md:px-6 md:py-20"
    >
      <SectionBackdropLayer variant="experience" />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-4xl">
        <motion.div {...fade} className="min-w-0">
          <h2 className="font-condensed text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-bold uppercase tracking-[0.12em] text-white">
            Experience
          </h2>
          <p className="mt-2 hidden max-w-lg font-mono text-xs text-meta md:block md:text-sm">
            Timeline — most recent first.
          </p>
        </motion.div>

        <div className="relative mt-8 min-w-0 pl-1 sm:mt-10 sm:pl-2">
          <div
            className="absolute bottom-2 left-[11px] top-3 w-px bg-gradient-to-b from-accent-violet/40 via-white/15 to-transparent sm:left-[13px]"
            aria-hidden
          />
          <ol className="min-w-0 space-y-3 sm:space-y-4">
            {experience.map((job, i) => (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={{
                  duration: 0.35,
                  delay: Math.min(i * 0.03, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative min-w-0 pl-9 sm:pl-11"
              >
                <span
                  className="absolute left-0 top-[0.65rem] z-[1] flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-accent-violet/80 bg-[#0a0c10] shadow-[0_0_12px_rgba(124,58,255,0.35)] sm:top-[0.7rem]"
                  aria-hidden
                />
                <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#070a12]/55 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-4 md:p-5">
                  <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-accent-acid sm:text-xs">
                      {job.period}
                    </p>
                    {job.timelineNote ? (
                      <p className="hidden max-w-[min(100%,14rem)] font-mono text-[9px] leading-tight text-meta md:block md:max-w-none md:text-[10px]">
                        {job.timelineNote}
                      </p>
                    ) : null}
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-white sm:mt-2 sm:text-base md:text-lg">
                    {experienceTitle(job)}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/70 sm:text-xs">
                    {job.company}
                  </p>
                  <ul className="mt-2.5 space-y-1.5 border-t border-white/[0.06] pt-2.5 text-[12px] leading-snug text-meta sm:mt-3 sm:space-y-2 sm:pt-3 sm:text-[13px] sm:leading-relaxed md:text-sm">
                    {experienceBulletsForViewport(job, isNarrow).map((b, j) => (
                      <li key={j} className="flex min-w-0 gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-violet/60" />
                        <span className="min-w-0 break-words text-pretty text-white/85">{b}</span>
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
