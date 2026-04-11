import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { githubHighlights, person, projects, sortByRole } from "../data/profile";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function linkLabel(url: string) {
  return url.includes("github.com") ? "View on GitHub →" : "View details →";
}

export function Projects() {
  const { role } = useRole();
  const ordered = useMemo(() => sortByRole(projects, role), [role]);
  const topRepos = useMemo(
    () => sortByRole(githubHighlights, role).slice(0, 3),
    [role]
  );

  return (
    <section id="projects" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Projects
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Flagship work with problem, build, and impact — ordering follows your
            Role Lens. Repos below are live on{" "}
            <span className="text-slate-400">
              {person.github.replace(/^https?:\/\//, "")}
            </span>
            .
          </p>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.06 }}
          className="mt-10 rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.07] via-transparent to-violet-500/[0.06] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                Featured on GitHub
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">
                Top repos for this lens
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 sm:text-xs">
              Ranked by relevance to the selected role.
            </p>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {topRepos.map((repo, i) => (
              <motion.li
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...fade.transition, delay: 0.05 + i * 0.05 }}
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-ink-950/50 p-4 transition hover:border-cyan-400/25 hover:bg-ink-900/60"
                >
                  <span className="font-mono text-[11px] text-cyan-200/90">
                    {repo.name}
                  </span>
                  <span className="mt-2 text-xs leading-relaxed text-slate-400">
                    {repo.description}
                  </span>
                  <span className="mt-3 text-[11px] font-medium text-cyan-300/90">
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
              whileHover={{ y: -4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-ink-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition group-hover:bg-cyan-400/15" />
              <h3 className="relative text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                {p.summary}
              </p>
              <p className="relative mt-4 text-sm font-medium leading-relaxed text-cyan-100/90">
                <span className="text-slate-500">Impact:</span> {p.impact}
              </p>
              <div className="relative mt-5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.06] bg-black/20 px-2 py-0.5 text-[11px] text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-6 inline-flex text-xs font-medium text-cyan-300 hover:text-cyan-200"
                >
                  {linkLabel(p.link)}
                </a>
              ) : (
                <span className="relative mt-6 text-[11px] text-slate-600">
                  Case-study / private code — happy to walk through on a call.
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
