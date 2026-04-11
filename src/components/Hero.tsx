import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import { heroCopy, person } from "../data/profile";

export function Hero() {
  const { role } = useRole();
  const copy = heroCopy[role];

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] flex-col justify-center px-4 pb-24 pt-36 sm:px-6 sm:pt-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          key={role + "-eyebrow"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-300/80"
        >
          Unified profile
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl"
        >
          <span className="block">{person.name}</span>
          <span className="mt-3 block text-2xl font-sans font-medium tracking-tight text-slate-300 sm:text-3xl md:text-4xl">
            {person.rolesLabel}
          </span>
        </motion.h1>
        <motion.p
          key={role + "-headline"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
        >
          {copy.headline}
        </motion.p>
        <motion.p
          key={role + "-sub"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]"
        >
          {copy.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_0_40px_-10px_rgba(34,211,238,0.65)] transition hover:brightness-110"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href={copy.ctaSecondaryHref}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-slate-100 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            {copy.ctaSecondary}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
