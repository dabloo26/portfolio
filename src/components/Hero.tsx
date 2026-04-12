import { motion } from "framer-motion";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Role } from "../data/profile";
import { heroCopy, person } from "../data/profile";
import { useRole } from "../hooks/useRole";
import { HeroInteractiveHeading, HeroInteractiveParagraph } from "./HeroInteractiveText";
import { HeroTicker } from "./HeroTicker";

const WireCircleAccent = lazy(() =>
  import("./scene/WireCircleAccent").then((m) => ({ default: m.WireCircleAccent }))
);

const ROLE_ORB: Record<Role, string> = {
  analyst: "#38bdf8",
  scientist: "#e879f9",
  engineer: "#4ade80",
};

function CircleFallback() {
  return (
    <div
      className="h-full min-h-[240px] w-full bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.08),transparent_65%)] md:min-h-[300px]"
      aria-hidden
    />
  );
}

export function Hero() {
  const { role } = useRole();
  const copy = heroCopy[role];
  const orbHue = useMemo(() => ROLE_ORB[role], [role]);

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100dvh] flex-col justify-center overflow-x-clip bg-transparent px-4 pb-24 pt-[max(7rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-32 sm:pt-36 md:px-8 md:pb-28"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(6rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Landing-only vignette so this block reads as the “hero” */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(124,58,255,0.14),transparent_58%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(57,255,20,0.06),transparent)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,42%)] lg:gap-12 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative order-1 w-full max-w-2xl justify-self-stretch sm:max-w-none lg:justify-self-start"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#0a0d18]/95 via-[#06080f]/96 to-[#04050a]/98 p-5 shadow-[0_0_0_1px_rgba(124,58,255,0.15),0_28px_100px_rgba(0,0,0,0.55),0_0_80px_rgba(124,58,255,0.08)] sm:rounded-3xl sm:p-7 md:p-8 lg:max-w-xl xl:max-w-2xl">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-violet/10 blur-3xl"
              aria-hidden
            />
            <p className="relative font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-accent-violet/95 sm:text-[11px]">
              Portfolio · Data
            </p>

            <div className="relative mt-4">
              <HeroInteractiveHeading name={person.name} rolesLabel={person.rolesLabel} />
            </div>

            <HeroTicker />

            <motion.div
              key={role + "-headline"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-6 text-lg leading-relaxed text-white sm:text-xl"
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
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                to={{ pathname: "/", hash: "projects" }}
                className="glitch-cta inline-flex min-h-[48px] min-w-[min(100%,200px)] touch-manipulation items-center justify-center rounded-sm bg-accent-violet px-6 py-3 text-center text-sm font-semibold text-white sm:min-h-[44px] sm:min-w-0 sm:py-2.5"
              >
                {copy.ctaPrimary}
              </Link>
              <a
                href={copy.ctaSecondaryHref}
                {...(role === "analyst"
                  ? {
                      download: "Abhyansh_Anand_Resume.pdf",
                    }
                  : {})}
                className="inline-flex min-h-[48px] min-w-[min(100%,200px)] touch-manipulation items-center justify-center rounded-sm border border-white/15 bg-[#111118] px-6 py-3 text-center text-sm font-medium text-white transition hover:border-accent-violet/50 sm:min-h-[44px] sm:min-w-0 sm:py-2.5"
              >
                {copy.ctaSecondary}
              </a>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative order-2 flex min-h-[200px] w-full justify-center lg:min-h-[min(52vh,420px)] lg:justify-end">
          <Suspense fallback={<CircleFallback />}>
            <WireCircleAccent
              color={orbHue}
              className="h-[min(52vw,320px)] w-[min(92vw,360px)] md:h-[min(42vw,380px)] md:w-full md:max-w-[420px] lg:h-[min(48vh,440px)] lg:max-w-none"
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
