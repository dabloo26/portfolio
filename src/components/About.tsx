import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { aboutParagraphMobile, aboutParagraphs, person } from "../data/profile";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

/** ~6.5/10 solidity — mostly translucent with readable tint + blur */
const cardShell =
  "rounded-2xl border border-white/[0.12] bg-[#070a12]/65 shadow-[0_12px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:rounded-3xl";

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
      className="relative z-10 overflow-x-clip scroll-mt-40 bg-gradient-to-b from-transparent via-base/35 to-base/55 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-44"
    >
      <SectionBackdropLayer variant="about" />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl overflow-x-clip">
        <motion.div {...fade} className="max-w-3xl min-w-0">
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            About
          </h2>
          <p className="mt-3 font-mono text-sm uppercase tracking-wider text-zinc-400">
            <span aria-hidden>📍 </span>
            {person.location}
          </p>
        </motion.div>
        <div className="mt-12 grid min-w-0 gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-10">
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.04 }}
            className={`min-w-0 max-w-full ${cardShell} p-5 sm:p-8`}
          >
            <p className="text-[clamp(15px,3.5vw,18px)] leading-relaxed text-white/90 md:hidden">
              {aboutParagraphMobile}
            </p>
            <div className="hidden space-y-6 text-[17px] leading-relaxed text-white/90 sm:text-lg md:block">
              {aboutParagraphs.map((p, i) => (
                <motion.p key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }}>
                  {p}
                </motion.p>
              ))}
            </div>
          </motion.div>
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
            className={`min-w-0 max-w-full ${cardShell} overflow-hidden font-mono text-xs text-white/90`}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-[#0d1018]/50 px-3 py-2 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] text-meta">education.json</span>
            </div>
            <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed sm:text-[13px]">
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
        </div>
      </div>
    </section>
  );
}
