import { motion } from "framer-motion";
import type { Project } from "../data/profile";
import { person } from "../data/profile";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function linkLabel(url: string) {
  return url.includes("github.com") ? "View on GitHub →" : "View details →";
}

const walkthroughMail = `mailto:${person.email}?subject=${encodeURIComponent("Portfolio walkthrough request")}`;

export function ProjectCard({
  p,
  delayIndex = 0,
}: {
  p: Project;
  delayIndex?: number;
}) {
  return (
    <motion.article
      id={`project-${p.id}`}
      {...fade}
      transition={{ ...fade.transition, delay: delayIndex * 0.07 }}
      className="scanline-hover group relative flex w-full min-w-0 shrink-0 flex-col scroll-mt-36 overflow-hidden rounded-lg bg-[#111118] p-[1px] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:min-w-[min(100%,340px)] lg:min-w-0"
    >
      <div
        className="absolute inset-y-0 left-0 w-1 animate-gradient-shift bg-gradient-to-b from-accent-violet via-accent-acid to-accent-violet bg-[length:100%_300%]"
        aria-hidden
      />
      <div className="relative flex min-w-0 max-w-full flex-1 flex-col rounded-lg bg-[#111118] px-4 pt-4 pb-5 sm:px-5 sm:pt-5 sm:pb-6">
        <h3 className="relative break-words text-base font-semibold leading-snug text-white sm:text-lg">{p.title}</h3>
        <p className="relative mt-3 hidden text-sm leading-relaxed text-meta sm:block">{p.summary}</p>
        <p className="relative mt-4 hidden font-mono text-sm leading-relaxed text-white/90 sm:block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-acid">
            IMPACT
          </span>{" "}
          <span className="text-meta"> </span>
          {p.impact}
        </p>
        <div className="relative mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-accent-violet sm:mt-5">
          {p.tech.map((t) => (
            <span key={t}>
              [<span className="text-white/90">{t}</span>]
            </span>
          ))}
        </div>
        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="relative mt-6 inline-flex font-mono text-xs font-medium text-accent-violet hover:text-accent-acid"
          >
            {linkLabel(p.link)}
          </a>
        ) : (
          <a
            href={walkthroughMail}
            className="relative mt-6 inline-flex w-fit items-center rounded-full border border-accent-acid/40 bg-base px-3 py-1.5 font-mono text-[11px] font-medium text-accent-acid transition hover:border-accent-acid hover:bg-accent-acid/10"
          >
            Request walkthrough
          </a>
        )}
      </div>
    </motion.article>
  );
}
