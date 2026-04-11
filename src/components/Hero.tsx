import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import { heroCopy, person } from "../data/profile";
import { HeroInteractiveHeading, HeroInteractiveParagraph } from "./HeroInteractiveText";
import { HeroScene } from "./HeroScene";
import { HeroTicker } from "./HeroTicker";

export function Hero() {
  const { role } = useRole();
  const copy = heroCopy[role];

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100dvh] flex-col justify-center overflow-x-clip bg-transparent px-4 pb-28 pt-32 sm:px-6 sm:pb-32 sm:pt-36"
    >
      <div className="pointer-events-none relative z-20 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-auto">
          <HeroInteractiveHeading name={person.name} rolesLabel={person.rolesLabel} />

          <HeroTicker />

          <motion.div
            key={role + "-headline"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white sm:text-xl"
          >
            <HeroInteractiveParagraph>{copy.headline}</HeroInteractiveParagraph>
          </motion.div>
          <motion.div
            key={role + "-sub"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-meta sm:text-[15px]"
          >
            <HeroInteractiveParagraph>{copy.sub}</HeroInteractiveParagraph>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="/#projects"
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
      <HeroScene />
    </section>
  );
}
