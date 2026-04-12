import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  getKeyImpactDisplayCards,
  keyImpactEyebrow,
  keyImpactTitle,
} from "../data/profile";
import { hashIdFromProfileHref, routerToFromHref } from "../nav/routerTo";
import { useScrollToSection } from "../hooks/useScrollToSection";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function IconBars({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="8" y="28" width="8" height="12" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="20" y="18" width="8" height="22" rx="1" fill="currentColor" />
      <rect x="32" y="10" width="8" height="30" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function IconRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="14" stroke="url(#ringGrad)" strokeWidth="5" fill="none" />
      <path
        d="M24 10 A14 14 0 0 1 38 24"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-sky-400/90"
        fill="none"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconNodes({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="12" r="4" fill="#4ade80" />
      <circle cx="12" cy="36" r="4" fill="#4ade80" opacity="0.75" />
      <circle cx="36" cy="36" r="4" fill="#22c55e" />
      <path
        d="M24 16 L14 32 M24 16 L34 32 M14 36 L34 36"
        stroke="#4ade80"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

function IconFlask({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M18 8h12v6l8 26a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4l8-26V8z"
        stroke="#f472b6"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M16 32h16" stroke="#f472b6" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

const icons = {
  bars: IconBars,
  ring: IconRing,
  nodes: IconNodes,
  flask: IconFlask,
} as const;

export function KeyImpact() {
  const cards = getKeyImpactDisplayCards();
  const scrollToSection = useScrollToSection();

  return (
    <section
      id="impact"
      className="key-impact relative z-10 scroll-mt-40 overflow-x-clip bg-gradient-to-b from-[#050a14]/35 via-[#050a14]/55 to-[#050a14]/65 px-4 py-20 sm:px-6 sm:py-24 md:scroll-mt-44"
    >
      <SectionBackdropLayer variant="impact" />
      <div className="key-impact__glow pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute right-0 top-0 h-64 w-[min(100%,480px)] opacity-[0.12]"
        aria-hidden
      >
        <svg viewBox="0 0 400 200" className="h-full w-full text-sky-400/50">
          <path
            d="M0 160 Q100 40 200 100 T400 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade} className="text-center sm:text-left">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-400 sm:text-xs">
            {keyImpactEyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl italic text-white sm:text-5xl md:text-6xl">
            {keyImpactTitle}
          </h2>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <motion.li
                key={c.shortLabel}
                {...fade}
                transition={{ ...fade.transition, delay: 0.08 + i * 0.06 }}
              >
                <Link
                  to={routerToFromHref(c.href)}
                  title={c.detail}
                  onClick={(e) => {
                    const id = hashIdFromProfileHref(c.href);
                    if (!id) return;
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                  className="key-impact-card group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a1020]/55 px-5 pb-9 pt-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:border-sky-400/25 hover:bg-[#0c1228]/70 hover:shadow-[0_12px_48px_rgba(56,189,248,0.08)]"
                >
                  <span
                    className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-sky-400/90 via-violet-400/80 to-fuchsia-500/90 opacity-90"
                    aria-hidden
                  />
                  <Icon className="relative mb-5 h-12 w-12 text-sky-300 transition group-hover:scale-105" />
                  <p className="relative font-display text-4xl leading-none tracking-tight text-sky-200 sm:text-[2.75rem]">
                    {c.value}
                    {c.suffix ? (
                      <span className="text-sky-300">{c.suffix}</span>
                    ) : null}
                  </p>
                  <p className="relative mt-4 max-w-[14rem] font-sans text-[13px] leading-snug text-white/55">
                    {c.shortLabel}
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
