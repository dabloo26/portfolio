import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { projects, sortByRole } from "../data/profile";
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

export function ProjectsPreview() {
  const { role } = useRole();
  const top = useMemo(() => sortByRole(projects, role).slice(0, TOP), [role]);

  return (
    <section
      id="projects"
      className="relative z-10 scroll-mt-32 bg-base px-4 py-24 sm:px-6 sm:py-28"
    >
      <SectionBackdropLayer variant="projects" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
              Projects
            </h2>
            <p className="mt-2 max-w-lg font-mono text-sm text-meta">
              Role Lens ranks the full list; this row is the top {TOP}.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex w-fit items-center rounded-sm border border-accent-violet/50 bg-[#111118] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-violet transition hover:border-accent-acid hover:text-accent-acid"
          >
            View all projects →
          </Link>
        </motion.div>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {top.map((p, i) => (
            <ProjectCard key={p.id} p={p} delayIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
