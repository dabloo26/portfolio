import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { projects, sortByPrimaryFocus } from "../data/profile";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";
import { ProjectCard } from "./ProjectCard";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const TOP = 3;
const SHOWCASE_ORDER = ["resume-chat", "nmt", "ecom"] as const;

export function ProjectsPreview() {
  const top = useMemo(() => {
    const list = SHOWCASE_ORDER.map((id) => projects.find((p) => p.id === id)).filter(
      (p): p is (typeof projects)[number] => Boolean(p)
    );
    return list.length >= TOP ? list : sortByPrimaryFocus(projects).slice(0, TOP);
  }, []);

  const featuredRepo = projects.find((p) => p.id === "resume-chat");

  return (
    <section
      id="projects"
      className="relative z-10 overflow-x-clip scroll-mt-40 bg-gradient-to-b from-base/22 via-base/48 to-base/58 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-44"
    >
      <SectionBackdropLayer variant="projects" />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl">
        <motion.div {...fade} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
              Projects
            </h2>
            <p className="mt-2 max-w-2xl font-mono text-sm leading-relaxed text-zinc-400">
              Three builds I reach for first: session recovery on AWS, English–Hindi NMT, and a
              warehouse-backed analytics stack.
              {featuredRepo?.liveUrl || featuredRepo?.link ? (
                <>
                  {" "}
                  {featuredRepo.liveUrl ? (
                    <>
                      <a
                        href={featuredRepo.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-acid underline decoration-accent-acid/35 underline-offset-[3px] transition hover:text-white hover:decoration-white"
                      >
                        Live resume session
                      </a>
                      {featuredRepo.link ? " · " : null}
                    </>
                  ) : null}
                  {featuredRepo.link ? (
                    <a
                      href={featuredRepo.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-violet underline decoration-accent-violet/35 underline-offset-[3px] transition hover:text-accent-acid hover:decoration-accent-acid"
                    >
                      {featuredRepo.liveUrl ? "Source on GitHub" : "The resume app repo"}
                    </a>
                  ) : null}
                  {featuredRepo.link && featuredRepo.liveUrl
                    ? " — open if you want to poke at the Lambda/React wiring."
                    : featuredRepo.link
                      ? " is open if you want to poke at the Lambda/React wiring."
                      : "."}
                </>
              ) : null}
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex w-fit items-center rounded-sm border border-accent-violet/50 bg-[#111118] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-violet transition hover:border-accent-acid hover:text-accent-acid"
          >
            View all projects →
          </Link>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {top.map((p, i) => (
            <ProjectCard key={p.id} p={p} delayIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
