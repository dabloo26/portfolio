import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  primaryFocusScore,
  skills,
  sortByPrimaryFocus,
  type SkillCategory,
} from "../data/profile";
import { sectionViewport } from "../motion/section";

const CATEGORY_META: Record<
  SkillCategory,
  { title: string; subtitle: string }
> = {
  analytics: {
    title: "Analytics & BI",
    subtitle: "Dashboards, SQL, metrics storytelling",
  },
  ml: {
    title: "ML & AI",
    subtitle: "Modeling, NLP, evaluation & experimentation",
  },
  engineering: {
    title: "Platforms & tools",
    subtitle: "Cloud, warehouses, ETL, APIs, CI/CD",
  },
};

const headerFade = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.4 },
};

function MiniBar({ score }: { score: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-violet/80 to-accent-acid/90 transition-[width] duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export function Skills() {
  const buckets = useMemo(() => {
    const order: SkillCategory[] = ["analytics", "ml", "engineering"];
    return order.map((key) => {
      const pool = skills.filter((s) => s.category === key);
      const sorted = sortByPrimaryFocus(pool);
      return {
        key,
        ...CATEGORY_META[key],
        items: sorted.map((s) => ({ skill: s, score: primaryFocusScore(s) })),
      };
    });
  }, []);

  return (
    <section
      id="skills"
      className="relative z-10 scroll-mt-40 bg-gradient-to-b from-base/25 via-base/50 to-base/60 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-44"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...headerFade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Skills
          </h2>
          <p className="mt-3 max-w-xl font-mono text-sm text-zinc-400">
            Grouped by practice area — scores blend analytics, ML, and engineering emphasis.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {buckets.map(({ key, title, subtitle, items }, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={sectionViewport}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex flex-col rounded-2xl border border-white/[0.1] bg-[#070a12]/55 p-5 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6"
            >
              <h3 className="font-condensed text-lg font-bold uppercase tracking-[0.14em] text-white sm:text-xl">
                {title}
              </h3>
              <p className="mt-1 font-mono text-[11px] leading-snug text-zinc-400 sm:text-xs">
                {subtitle}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-3.5">
                {items.map(({ skill, score }) => (
                  <li key={skill.name}>
                    <div className="flex items-start justify-between gap-2 font-mono text-[11px] leading-snug text-white/90 sm:text-xs">
                      <span className="min-w-0 flex-1">{skill.name}</span>
                      <span className="shrink-0 tabular-nums text-white/40">
                        {score}
                      </span>
                    </div>
                    <MiniBar score={score} />
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
