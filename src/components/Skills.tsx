import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useRole } from "../hooks/useRole";
import { skills, sortByRole, type SkillCategory } from "../data/profile";
import { sectionViewport } from "../motion/section";

const categoryLabel: Record<SkillCategory, string> = {
  analytics: "ANALYTICS",
  ml: "ML",
  engineering: "ENGINEERING",
};

function weightBar(score: number) {
  const filled = Math.round((score / 100) * 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

const headerFade = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.4 },
};

export function Skills() {
  const { role } = useRole();

  const rows = useMemo(() => {
    const sorted = sortByRole(skills, role);
    return sorted.map((s) => ({
      skill: s,
      score: s[role],
      cat: categoryLabel[s.category],
    }));
  }, [role]);

  return (
    <section
      id="skills"
      className="relative z-10 scroll-mt-32 border-t border-white/[0.05] bg-base/72 px-4 py-24 backdrop-blur-md sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...headerFade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Skills
          </h2>
          <p className="mt-3 max-w-xl font-mono text-sm text-meta">
            Ordered by relevance for your selected role.
          </p>
        </motion.div>

        <div className="mt-10 overflow-hidden rounded-lg border border-white/[0.08] font-mono text-[11px] sm:text-xs">
          <div className="grid grid-cols-1 gap-2 border-b border-white/[0.08] bg-[#111118] px-3 py-2 text-meta sm:grid-cols-[1fr_auto_9rem] sm:px-4">
            <span>SKILL</span>
            <span className="hidden sm:inline">CATEGORY</span>
            <span className="text-left sm:text-right">WEIGHT</span>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map(({ skill, score, cat }, i) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 28 },
                  opacity: { delay: i * 0.03 },
                }}
                className={`grid grid-cols-1 items-start gap-1 border-b border-white/[0.05] px-3 py-2.5 sm:grid-cols-[1fr_auto_9rem] sm:items-center sm:gap-2 sm:px-4 ${
                  i % 2 === 0 ? "bg-white/[0.04]" : "bg-[#111118]/90"
                }`}
              >
                <div>
                  <span className="text-white">{skill.name}</span>
                  <span className="mt-0.5 block text-[10px] text-accent-violet/90 sm:hidden">
                    {cat}
                  </span>
                </div>
                <span className="hidden text-accent-violet/90 sm:inline">{cat}</span>
                <span className="text-left text-accent-acid tabular-nums sm:text-right">
                  {weightBar(score)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
