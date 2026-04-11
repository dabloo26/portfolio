import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import { heroCopy, person } from "../data/profile";
import { HeroTicker } from "./HeroTicker";

const ParticleWordMorphCanvas = lazy(async () => {
  const m = await import("./scene/ParticleWordMorph");
  return { default: m.ParticleWordMorphCanvas };
});

export function Hero() {
  const { role } = useRole();
  const copy = heroCopy[role];

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[90vh] flex-col justify-center overflow-hidden bg-transparent px-4 pb-24 pt-32 sm:px-6 sm:pt-36"
    >
      <Suspense
        fallback={<div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-transparent md:block" aria-hidden />}
      >
        <ParticleWordMorphCanvas role={role} />
      </Suspense>
      <div className="relative z-20 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl"
          >
            <span className="block">{person.name}</span>
            <span className="mt-3 block text-2xl font-sans font-medium tracking-tight text-meta sm:text-3xl md:text-4xl">
              {person.rolesLabel}
            </span>
          </motion.h1>

          <HeroTicker />

          <motion.p
            key={role + "-headline"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white sm:text-xl"
          >
            {copy.headline}
          </motion.p>
          <motion.p
            key={role + "-sub"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-meta sm:text-[15px]"
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
              className="glitch-cta inline-flex items-center justify-center rounded-sm bg-accent-violet px-6 py-2.5 text-sm font-semibold text-white"
            >
              {copy.ctaPrimary}
            </a>
            <a
              href={copy.ctaSecondaryHref}
              className="inline-flex items-center justify-center rounded-sm border border-white/15 bg-[#111118] px-6 py-2.5 text-sm font-medium text-white transition hover:border-accent-violet/50"
            >
              {copy.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
