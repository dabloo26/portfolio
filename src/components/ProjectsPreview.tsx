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
const FEATURED_GITHUB_ID = "resume-chat";

export function ProjectsPreview() {
  const top = useMemo(() => {
    const sorted = sortByPrimaryFocus(projects);
    const featured = projects.find((p) => p.id === FEATURED_GITHUB_ID);
    const rest = sorted.filter((p) => p.id !== FEATURED_GITHUB_ID);
    if (!featured) return sorted.slice(0, TOP);
    return [featured, ...rest.slice(0, TOP - 1)];
  }, []);

  const featuredRepo = projects.find((p) => p.id === FEATURED_GITHUB_ID);

  return (
    <section
      id="projects"
      className="relative z-10 scroll-mt-40 bg-gradient-to-b from-base/22 via-base/48 to-base/58 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-44"
    >
      <SectionBackdropLayer variant="projects" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
              Projects
            </h2>
            <p className="mt-2 max-w-2xl font-mono text-sm leading-relaxed text-meta">
              I care about work that ships: reliable pipelines, clear analytics, and UIs that make models usable. Below
              are three builds I stand behind;{" "}
              {featuredRepo?.link ? (
                <a
                  href={featuredRepo.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-violet underline decoration-accent-violet/35 underline-offset-[3px] transition hover:text-accent-acid hover:decoration-accent-acid"
                >
                  {featuredRepo.title}
                </a>
              ) : (
                featuredRepo?.title
              )}{" "}
              (serverless FastAPI, React on CloudFront, DynamoDB + S3 session recovery) is public on GitHub if you want
              to read the implementation.
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
