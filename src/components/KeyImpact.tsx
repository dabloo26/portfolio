import { motion } from "framer-motion";
import { getKeyImpactMetrics, keyImpactTitle } from "../data/profile";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export function KeyImpact() {
  const metrics = getKeyImpactMetrics();

  return (
    <section
      id="impact"
      className="relative z-10 scroll-mt-32 border-t border-white/[0.06] bg-base px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          {...fade}
          className="font-condensed text-3xl font-bold uppercase tracking-[0.12em] text-white sm:text-4xl"
        >
          {keyImpactTitle}
        </motion.h2>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const inner = (
              <>
                <p className="font-display text-[clamp(1.85rem,4.5vw,2.85rem)] leading-none tracking-tight text-white">
                  {m.value}
                  {m.suffix ? (
                    <span className="text-accent-acid">{m.suffix}</span>
                  ) : null}
                </p>
                <p className="mt-3 text-left text-[11px] leading-relaxed text-meta sm:text-xs">
                  {m.label}
                </p>
              </>
            );

            const cardClass =
              "flex min-h-full flex-col rounded-lg border border-white/[0.08] bg-[#111118]/90 p-4 shadow-lg transition-colors duration-200 sm:p-5 " +
              (m.href
                ? "hover:border-accent-violet/35 focus-visible:border-accent-violet/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/30"
                : "");

            return (
              <motion.li
                key={`${m.value}-${m.suffix}-${i}`}
                {...fade}
                transition={{ ...fade.transition, delay: 0.06 + i * 0.05 }}
                className="min-h-0"
              >
                {m.href ? (
                  <a href={m.href} className={`${cardClass} block h-full`}>
                    {inner}
                  </a>
                ) : (
                  <div className={cardClass}>{inner}</div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
