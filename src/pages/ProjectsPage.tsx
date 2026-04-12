import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { githubHighlights, projects, sortByRole } from "../data/profile";
import { SectionBackdropLayer } from "../components/ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";
import { ProjectCard } from "../components/ProjectCard";
import { Skills } from "../components/Skills";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function ProjectsPage() {
  const { role } = useRole();
  const ordered = useMemo(() => sortByRole(projects, role), [role]);
  const topRepos = useMemo(
    () => sortByRole(githubHighlights, role),
    [role]
  );

  return (
    <main className="relative pt-[9rem]">
      <SectionBackdropLayer variant="projects" />
      <div className="relative z-10 bg-gradient-to-b from-base/35 to-base/50 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="font-mono text-[11px] uppercase tracking-wider text-meta transition hover:text-accent-acid"
            >
              ← Back to home
            </Link>
            <h1 className="mt-4 font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
              All projects
            </h1>
            <p className="mt-2 max-w-xl font-mono text-sm text-meta">
              Every build below is ordered by Role Lens relevance. Scroll horizontally on small
              screens or use the grid on large ones.
            </p>
          </div>
        </div>
      </div>

      <section className="relative z-10 bg-gradient-to-b from-base/25 via-base/48 to-base/55 px-4 py-14 sm:px-6">
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div {...fade}>
            <h2 className="font-condensed text-xl font-bold uppercase tracking-[0.14em] text-white">
              GitHub repositories
            </h2>
          </motion.div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topRepos.map((repo, i) => (
              <motion.li
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={{ ...fade.transition, delay: 0.05 + i * 0.04 }}
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-lg border border-white/[0.08] bg-[#111118] p-4 transition hover:border-accent-violet/40"
                >
                  <span className="font-mono text-[11px] text-accent-violet">{repo.name}</span>
                  <span className="mt-2 text-xs leading-relaxed text-meta">{repo.description}</span>
                  <span className="mt-3 font-mono text-[11px] text-accent-acid">Open repository →</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 bg-gradient-to-b from-base/30 via-base/50 to-base/58 px-4 py-14 sm:px-6">
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.h2 {...fade} className="font-condensed text-xl font-bold uppercase tracking-[0.14em] text-white">
            Portfolio builds
          </motion.h2>
          <div className="mt-10 flex gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {ordered.map((p, i) => (
              <ProjectCard key={p.id} p={p} delayIndex={i} />
            ))}
          </div>
        </div>
      </section>

      <Skills />
    </main>
  );
}
