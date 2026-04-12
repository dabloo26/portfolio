import { motion } from "framer-motion";
import { heroLandingCopy, person } from "../data/profile";
import { HeroInteractiveHeading } from "./HeroInteractiveText";
import { InlinePlanetMobile } from "./scene/PlanetScene";

const ACCENT_ORB = "#34d399";

export function Hero() {
  const { headline, focus } = heroLandingCopy;

  return (
    <>
      <section
        id="top"
        className="relative z-10 flex min-h-[100dvh] flex-col justify-center bg-transparent px-4 py-12 sm:px-6 md:px-8"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingTop: "max(6.25rem, calc(env(safe-area-inset-top, 0px) + 5.5rem))",
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(124,58,255,0.14),transparent_58%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(57,255,20,0.06),transparent)]"
          aria-hidden
        />

        <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-10 xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-[min(100%,560px)] lg:justify-self-start xl:max-w-[600px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#060a12]/65 p-6 shadow-[0_0_0_1px_rgba(124,58,255,0.18),0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10">
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
                className="relative mt-6 font-display text-[clamp(1.35rem,calc(2.8vw+0.75rem),2.35rem)] italic leading-snug tracking-wide text-sky-200/95 sm:mt-7 md:text-4xl"
              >
                {headline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="relative mt-5 max-w-[42ch] text-base font-medium leading-relaxed text-white sm:mt-6 sm:text-[17px]"
              >
                {focus}
              </motion.p>
            </div>
          </motion.div>

          <div
            className="pointer-events-none hidden min-h-[min(52vh,520px)] lg:block"
            aria-hidden
          />

          <div className="relative z-[15] flex w-full justify-center lg:col-span-2 lg:hidden">
            <InlinePlanetMobile accent={ACCENT_ORB} />
          </div>
        </div>
      </section>
    </>
  );
}
