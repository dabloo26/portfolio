import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { aboutParagraphs, person } from "../data/profile";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function AnimatedGpa() {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        let t0: number | null = null;
        const run = (t: number) => {
          if (t0 === null) t0 = t;
          const p = Math.min((t - t0) / 800, 1);
          const eased = 1 - (1 - p) ** 3;
          setV(3.86 * eased);
          if (p < 1) requestAnimationFrame(run);
          else setV(3.86);
        };
        requestAnimationFrame(run);
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="text-accent-acid">
      {v.toFixed(2)}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 scroll-mt-32 border-t border-white/[0.05] bg-base/58 px-4 py-24 sm:px-6 sm:py-28"
    >
      <SectionBackdropLayer variant="about" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade} className="max-w-3xl">
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            About
          </h2>
          <p className="mt-3 font-mono text-sm uppercase tracking-wider text-meta">
            <span aria-hidden>📍 </span>
            {person.location}
          </p>
        </motion.div>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="space-y-6 text-[15px] leading-relaxed text-meta">
            {aboutParagraphs.map((p, i) => (
              <motion.p key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }}>
                {p}
              </motion.p>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
              className="overflow-hidden rounded-lg border border-white/[0.1] bg-[#111118] font-mono text-xs text-white/90 shadow-lg"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#1a1a22] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] text-meta">education.json</span>
              </div>
              <pre className="overflow-x-auto p-4 text-[11px] leading-relaxed sm:text-xs">
                <code className="block text-white">
                  {`{
  "degree": "M.S. Data Science",
  "school": "University of Maryland, College Park",
  "gpa": `}
                  <AnimatedGpa />
                  {`,
  "expected": "May 2026"
}`}
                </code>
                <code className="mt-3 block text-meta">
                  {`// NMIT — B.E. Computer Science (2021)`}
                </code>
              </pre>
            </motion.div>
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.16 }}
              className="rounded-lg border border-white/[0.08] bg-[#111118] p-6"
            >
              <h3 className="font-condensed text-lg font-bold uppercase tracking-[0.12em] text-white">
                How I work
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-meta">
                <li className="flex gap-2">
                  <span className="shrink-0 font-mono text-accent-acid">&gt;</span>
                  <span className="text-white/85">
                    Start from the decision the business needs to make, then trace
                    backward to data and systems.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-mono text-accent-acid">&gt;</span>
                  <span className="text-white/85">
                    Prefer simple, observable designs over clever complexity —
                    especially in production paths.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-mono text-accent-acid">&gt;</span>
                  <span className="text-white/85">
                    Communicate uncertainty and trade-offs clearly; metrics are only
                    as good as their definitions.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
