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

function CircleFallback({ large }: { large?: boolean }) {
  return (
    <div
      className={`w-full bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.1),transparent_68%)] ${
        large ? "min-h-[min(72vw,420px)]" : "min-h-[240px] md:min-h-[300px]"
      }`}
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
      className="relative z-10 flex min-h-[100dvh] flex-col justify-center overflow-visible bg-transparent px-4 pb-24 pt-[max(8.5rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-32 sm:pt-[9rem] md:px-8 md:pb-28"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(6rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(124,58,255,0.14),transparent_58%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(57,255,20,0.06),transparent)]"
        aria-hidden
      />

      {/* Large wireframe orb — extends past section box so it isn’t clipped by the next band */}
      <div className="pointer-events-none absolute left-[26%] right-[-22%] top-[-14vh] z-[1] hidden h-[min(118vh,1200px)] max-h-none md:block lg:left-[32%] lg:right-[-12%] lg:top-[-12vh]">
        <Suspense fallback={<CircleFallback large />}>
          <WireCircleAccent
            color={orbHue}
            immersive
            className="h-full w-full min-h-[min(92vh,720px)]"
          />
        </Suspense>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative w-full max-w-2xl sm:max-w-none"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#060a12]/55 p-5 shadow-[0_0_0_1px_rgba(124,58,255,0.18),0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-7 md:p-8 lg:max-w-xl xl:max-w-2xl">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-violet/15 blur-3xl"
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
                  className="inline-flex min-h-[48px] min-w-[min(100%,200px)] touch-manipulation items-center justify-center rounded-sm border border-white/15 bg-[#111118]/90 px-6 py-3 text-center text-sm font-medium text-white transition hover:border-accent-violet/50 sm:min-h-[44px] sm:min-w-0 sm:py-2.5"
                >
                  {copy.ctaSecondary}
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile / tablet: orb in-flow so it isn’t only a boxed thumbnail */}
          <div className="relative z-[15] flex min-h-[min(64vw,340px)] w-full justify-center md:hidden">
            <Suspense fallback={<CircleFallback />}>
              <WireCircleAccent
                color={orbHue}
                immersive
                className="h-[min(64vw,340px)] w-[min(92vw,400px)] max-w-[440px]"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
