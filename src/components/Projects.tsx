import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { projects, sortByRole } from "../data/profile";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export function Projects() {
  const { role } = useRole();
  const ordered = useMemo(() => sortByRole(projects, role), [role]);

  return (
    <section id="projects" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-display text-4xl text-white sm:text-5xl">
            Projects
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            A tight set of flagship work — each with problem, build, and impact.
            Ordering reacts to your Role Lens.
          </p>
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
                  className="relative mt-6 inline-flex text-xs font-medium text-cyan-300 hover:text-cyan-200"
                >
                  View details →
                </a>
              ) : (
                <span className="relative mt-6 text-[11px] text-slate-600">
                  Case-study / repo links available on request.
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
