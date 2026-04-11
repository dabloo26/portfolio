import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { githubHighlights, person, projects, sortByRole } from "../data/profile";
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

export function Projects() {
  const { role } = useRole();
  const ordered = useMemo(() => sortByRole(projects, role), [role]);
  const topRepos = useMemo(
    () => sortByRole(githubHighlights, role).slice(0, 3),
    [role]
  );

  return (
    <section
      id="projects"
      className="relative z-10 scroll-mt-32 bg-base px-4 py-24 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Projects
          </h2>
          <p className="mt-3 max-w-xl font-mono text-sm text-meta">Selected work.</p>
        </motion.div>

        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.06 }} className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-condensed text-xl font-bold uppercase tracking-[0.14em] text-white">
              GitHub Repos
            </h3>
            <span
              className="cursor-help font-mono text-[10px] text-meta underline decoration-dotted decoration-white/25"
              title="Repos reorder by relevance to the selected Role Lens."
            >
              ⓘ
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {topRepos.map((repo, i) => (
              <motion.li
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={{ ...fade.transition, delay: 0.05 + i * 0.05 }}
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-lg border border-white/[0.08] bg-[#111118] p-4 transition hover:border-accent-violet/40"
                >
                  <span className="font-mono text-[11px] text-accent-violet">{repo.name}</span>
                  <span className="mt-2 text-xs leading-relaxed text-meta">{repo.description}</span>
                  <span className="mt-3 font-mono text-[11px] text-accent-acid">
                    Open repository →
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ordered.map((p, i) => (
            <motion.article
              key={p.id}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.07 }}
              className="scanline-hover group relative flex flex-col overflow-hidden rounded-lg bg-[#111118] p-[1px] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              <div
                className="absolute inset-y-0 left-0 w-1 animate-gradient-shift bg-gradient-to-b from-accent-violet via-accent-acid to-accent-violet bg-[length:100%_300%]"
                aria-hidden
              />
              <div className="relative flex flex-1 flex-col rounded-lg bg-[#111118] pl-5 pr-5 pt-5 pb-6">
                <h3 className="relative text-lg font-semibold text-white">{p.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-meta">{p.summary}</p>
                <p className="relative mt-4 font-mono text-sm leading-relaxed text-white/90">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-acid">
                    IMPACT
                  </span>{" "}
                  <span className="text-meta"> </span>
                  {p.impact}
                </p>
                <div className="relative mt-5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-accent-violet">
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
                    📞 Request walkthrough
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
