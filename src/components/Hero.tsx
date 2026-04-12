import { motion } from "framer-motion";
import { heroLandingQuote, heroTagline, person } from "../data/profile";
import { HeroInteractiveHeading } from "./HeroInteractiveText";
import { InlinePlanetMobile } from "./scene/PlanetScene";

const ACCENT_ORB = "#34d399";

export function Hero() {
  return (
    <>
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

        <div className="relative z-20 mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative w-full max-w-2xl sm:max-w-none"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#060a12]/55 p-6 shadow-[0_0_0_1px_rgba(124,58,255,0.18),0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10 lg:max-w-2xl xl:max-w-3xl">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-violet/15 blur-3xl"
                  aria-hidden
                />

                <div className="relative mt-1">
                  <HeroInteractiveHeading name={person.name} variant="landing" />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="relative mt-5 font-display text-[clamp(1.35rem,calc(2.8vw+0.75rem),2.35rem)] italic leading-tight tracking-wide text-sky-200/95 sm:mt-6 md:text-4xl"
                >
                  {heroTagline}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.14 }}
                  className="relative mt-8 max-w-xl text-lg italic leading-relaxed text-white/88 sm:mt-10 sm:text-xl"
                >
                  {heroLandingQuote}
                </motion.p>
              </div>
            </motion.div>

            <div className="relative z-[15] flex w-full justify-center md:hidden">
              <InlinePlanetMobile accent={ACCENT_ORB} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
