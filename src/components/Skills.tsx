import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import {
  skills,
  sortByRole,
  type Skill,
  type SkillCategory,
} from "../data/profile";

const categoryLabel: Record<SkillCategory, string> = {
  analytics: "Data Analytics",
  ml: "Machine Learning",
  engineering: "Data Engineering",
};

const categoryOrder: SkillCategory[] = ["analytics", "ml", "engineering"];

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

function SkillChip({ skill, score }: { skill: Skill; score: number }) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 0.55 + (score / 100) * 0.45 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group relative overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200"
    >
      <span
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/15 to-violet-500/10 opacity-0 transition group-hover:opacity-100"
        style={{ width: `${Math.max(18, score)}%` }}
      />
      <span className="relative">{skill.name}</span>
    </motion.div>
  );
}

export function Skills() {
  const { role } = useRole();

  const grouped = useMemo(() => {
    const byCat: Record<SkillCategory, Skill[]> = {
      analytics: [],
      ml: [],
      engineering: [],
    };
    const sorted = sortByRole(skills, role);
    for (const s of sorted) {
      byCat[s.category].push(s);
    }
    for (const c of categoryOrder) {
      byCat[c] = sortByRole(byCat[c], role);
    }
    return byCat;
  }, [role]);

  return (
    <section id="skills" className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-display text-4xl text-white sm:text-5xl">Skills</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            One consolidated stack — ordered by relevance for your selected role
            lens. Swap labels and weights easily in{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-cyan-200/90">
              src/data/profile.ts
            </code>
            .
          </p>
        </motion.div>
        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {categoryOrder.map((cat, idx) => (
            <motion.div
              key={cat}
              {...fade}
              transition={{ ...fade.transition, delay: idx * 0.08 }}
              className="rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6"
            >
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">
                {categoryLabel[cat]}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {grouped[cat].map((skill) => (
                  <SkillChip
                    key={skill.name}
                    skill={skill}
                    score={skill[role]}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
